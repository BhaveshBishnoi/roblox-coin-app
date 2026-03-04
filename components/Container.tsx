import React from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Container({
    children,
    style,
    safeArea = true,
}: {
    children: React.ReactNode;
    style?: any;
    safeArea?: boolean;
}) {
    const insets = useSafeAreaInsets();

    const topPad = Platform.OS === 'android'
        ? (RNStatusBar.currentHeight ?? 0)
        : insets.top;

    return (
        <View style={styles.root}>
            <StatusBar style="light" backgroundColor="transparent" translucent />
            <View
                style={[
                    styles.inner,
                    safeArea && {
                        paddingTop: topPad,
                        paddingBottom: insets.bottom,
                    },
                    style,
                ]}
            >
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0A0A1A',
    },
    inner: {
        flex: 1,
    },
});
