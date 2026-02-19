import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export function Container({
    children,
    style,
    safeArea = true,
}: {
    children: React.ReactNode;
    style?: any;
    safeArea?: boolean;
}) {
    return (
        <View style={styles.root}>
            {/* Light status bar icons for dark backgrounds */}
            <StatusBar style="light" backgroundColor="transparent" translucent />

            {safeArea ? (
                <SafeAreaView
                    style={[
                        styles.safeArea,
                        { paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
                    ]}
                >
                    <View style={[styles.inner, style]}>{children}</View>
                </SafeAreaView>
            ) : (
                <View style={[styles.inner, style]}>{children}</View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0A0A1A', // dark fallback so no flash on load
    },
    safeArea: {
        flex: 1,
    },
    inner: {
        flex: 1,
    },
});
