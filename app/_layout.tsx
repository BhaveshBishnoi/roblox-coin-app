import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { CoinProvider, useCoins } from '../context/CoinContext';
import { CoinRewardPopup } from '../components/CoinRewardPopup';

function AppContent() {
    const { rewardPopup, hideRewardPopup } = useCoins();

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
                    animation: 'slide_from_right'
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
