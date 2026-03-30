import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from './Container';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from './AdBanner';
import { useOpenGames } from '../hooks/useOpenGames';

interface CalcShellProps {
    title: string;
    accentColor: string;
    children: React.ReactNode;
}

/**
 * Shared dark wrapper used by all individual calculator pages.
 * Provides: dark gradient background, ambient blobs, header with back button.
 */
export function CalcShell({ title, accentColor, children }: CalcShellProps) {
    const router = useRouter();
    const openGames = useOpenGames();

    return (
        <Container safeArea={false}>
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.blob, { top: -70, right: -70, backgroundColor: accentColor }]} />
            <View style={[styles.blob, { bottom: -70, left: -70, backgroundColor: '#6366F1' }]} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <AdBanner />
                {children}
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingTop: 54,
        paddingBottom: 14,
    },
    back: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#10B981', // Themed primary color (Green)
        letterSpacing: -0.4,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    scroll: {
        paddingHorizontal: 14,
        paddingBottom: 36,
    },
});
