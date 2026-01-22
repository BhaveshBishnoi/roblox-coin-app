import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

export function Container({ children, style, safeArea = true }: { children: React.ReactNode, style?: any, safeArea?: boolean }) {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" backgroundColor={Colors.background} />
            <LinearGradient
                colors={[Colors.background, '#1a0b1a']} // Subtle gradient to dark purple/black
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background]}
            >
                {safeArea ? (
                    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}>
                        <View style={[{ flex: 1, paddingHorizontal: 16 }, style]}>
                            {children}
                        </View>
                    </SafeAreaView>
                ) : (
                    <View style={[{ flex: 1 }, style]}>{children}</View>
                )}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
});
