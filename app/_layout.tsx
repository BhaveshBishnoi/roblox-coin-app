import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';
import { CoinProvider } from '../context/CoinContext';

export default function RootLayout() {
    return (
        <CoinProvider>
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
            </Stack>
        </CoinProvider>
    );
}
