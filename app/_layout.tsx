import 'react-native-gesture-handler';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { CoinProvider, useCoins } from '../context/CoinContext';
import { CoinRewardPopup } from '../components/CoinRewardPopup';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useRef } from 'react';
import { Alert, Platform, PermissionsAndroid, BackHandler, TouchableOpacity } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { useAppOpenAd } from '../hooks/useAppOpenAd';
import { useOpenGames } from '../hooks/useOpenGames';
import { ChevronLeft } from 'lucide-react-native';

import * as WebBrowser from 'expo-web-browser';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

function AppContent() {
    useAppOpenAd();
    const router = useRouter();
    const openGames = useOpenGames();
    const { rewardPopup, hideRewardPopup, isStartupBrowserClosed, setStartupBrowserClosed } = useCoins();
    const isBrowserOpening = useRef(false);

    const handleNotificationUrl = async (remoteMessage: any) => {
        if (!remoteMessage) return;
        
        const url = remoteMessage.data?.url;
        if (url) {
            console.log('Opening notification URL:', url);
            try {
                await WebBrowser.openBrowserAsync(url, {
                    presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                });
            } catch (error) {
                console.error('Failed to open notification URL:', error);
            }
        }
    };

    // Global initialization and Startup Browser Logic
    useEffect(() => {
        const initApp = async () => {
            try {
                // Initialize Ads
                await mobileAds().initialize();
                console.log('Mobile Ads SDK initialized');

                // Initialize Messaging
                const initialMessage = await messaging().getInitialNotification();
                if (initialMessage) {
                    handleNotificationUrl(initialMessage);
                }

                // Force open in-app browser on startup (every time app starts from cold)
                if (!isBrowserOpening.current) {
                    isBrowserOpening.current = true;
                    // Small delay to ensure UI is ready
                    setTimeout(async () => {
                        await openGames();
                        setStartupBrowserClosed(true);
                        isBrowserOpening.current = false;
                    }, 500);
                }
            } catch (error) {
                console.error('App initialization failed:', error);
            }
        };

        initApp();

        const onOpenedAppUnsubscribe = messaging().onNotificationOpenedApp(handleNotificationUrl);
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('New Notification', remoteMessage.notification?.body || 'You have a new message!');
        });

        return () => {
            unsubscribe();
            onOpenedAppUnsubscribe();
        };
    }, []);

    // Global Hardware Back Handler (Android)
    useEffect(() => {
        const backAction = () => {
            openGames();
            return false; // Let the navigation continue
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [openGames]);

    // Delayed initialization (Permissions, Token) - Runs after browser closes
    useEffect(() => {
        if (!isStartupBrowserClosed) return;

        const requestSetup = async () => {
            console.log('Requesting notification permissions after browser closure...');
            
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Notification permission denied');
                }
            } else {
                const authStatus = await messaging().requestPermission();
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (enabled) {
                    console.log('Authorization status:', authStatus);
                }
            }

            try {
                const token = await messaging().getToken();
                console.log('FCM Token:', token);
            } catch (error) {
                console.log('Failed to get FCM token:', error);
            }
        };

        requestSetup();
    }, [isStartupBrowserClosed]);

    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                    headerTintColor: Colors.text,
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: Colors.primary,
                    },
                    contentStyle: {
                        backgroundColor: Colors.background,
                    },
                    animation: 'slide_from_right',
                    headerLeft: ({ canGoBack }) => 
                        canGoBack ? (
                            <TouchableOpacity 
                                onPress={() => {
                                    openGames(); // Trigger browser on back
                                    if (router.canGoBack()) {
                                        router.back();
                                    }
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.12)',
                                    marginLeft: 4,
                                    marginRight: 10,
                                }}
                            >
                                <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                            </TouchableOpacity>
                        ) : null
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="daily" options={{ title: 'Daily Reward' }} />
                <Stack.Screen name="wheel" options={{ title: 'Lucky Wheel' }} />
                <Stack.Screen name="scratch" options={{ title: 'Scratch & Win' }} />
                <Stack.Screen name="quiz" options={{ title: 'Roblox Quiz' }} />
                <Stack.Screen name="flip" options={{ title: 'Flip Cards' }} />
                <Stack.Screen name="tips" options={{ title: 'Tips & Tricks' }} />
                <Stack.Screen name="wallet" options={{ title: 'My Wallet' }} />
                <Stack.Screen name="calculator" options={{ title: 'Robux Calculators' }} />
                <Stack.Screen name="calculators/usd-to-robux" options={{ title: 'USD to Robux' }} />
                <Stack.Screen name="calculators/inr-to-robux" options={{ title: 'INR to Robux' }} />
                <Stack.Screen name="calculators/robux-to-usd" options={{ title: 'Robux to USD' }} />
                <Stack.Screen name="calculators/robux-to-inr" options={{ title: 'Robux to INR' }} />
                <Stack.Screen name="calculators/btc-to-robux" options={{ title: 'Bitcoin to Robux' }} />
                <Stack.Screen name="calculators/robux-to-btc" options={{ title: 'Robux to Bitcoin' }} />
                <Stack.Screen name="calculators/obc-to-robux" options={{ title: 'OBC to Robux' }} />
                <Stack.Screen name="calculators/bc-to-robux" options={{ title: 'BC to Robux' }} />
            </Stack>
            <CoinRewardPopup
                visible={rewardPopup.visible}
                amount={rewardPopup.amount}
                source={rewardPopup.source}
                onClose={hideRewardPopup}
            />
        </>
    );
}

export default function RootLayout() {
    return (
        <CoinProvider>
            <AppContent />
        </CoinProvider>
    );
}
