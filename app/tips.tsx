import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Container } from '../components/Container';
import { Shield, Zap, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const TIPS = [
    {
        icon: '🎮',
        title: 'How to Get Rich in Adopt Me?',
        content: 'Trade your pets wisely! Look for neon pets and participate in every event update to maximize your earnings.',
        gradient: ['#059669', '#10B981'] as const,
    },
    {
        icon: '🎁',
        title: 'Latest Promo Codes',
        content: 'Check official Roblox social media pages for new codes like SPIDERCOLA or TWEETROBLOX for free items.',
        gradient: ['#2563EB', '#3B82F6'] as const,
    },
    {
        icon: '🏗️',
        title: 'Building Tips',
        content: "Use Roblox Studio to create your own games. It's the best way to earn Robux legitimately and showcase creativity!",
        gradient: ['#7C3AED', '#A855F7'] as const,
    },
    {
        icon: '💎',
        title: 'Trading System',
        content: 'Always check the value of items before accepting a trade. Beware of scams and never share your password!',
        gradient: ['#D97706', '#F59E0B'] as const,
    },
    {
        icon: '⚡',
        title: 'Daily Rewards',
        content: 'Log in every day to claim free rewards and bonuses. Consistency is key to building your coin balance!',
        gradient: ['#DC2626', '#EF4444'] as const,
    },
    {
        icon: '🎯',
        title: 'Complete Challenges',
        content: 'Participate in all available games and challenges to maximize your coin earnings throughout the day.',
        gradient: ['#0891B2', '#06B6D4'] as const,
    },
];

export default function Tips() {
    const router = useRouter();

    return (
        <Container safeArea={false}>
            {/* Background */}
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.blob, styles.blobTR]} />
            <View style={[styles.blob, styles.blobBL]} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.headerTitle}>Tips & Tricks</Text>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>🔥 {TIPS.length}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces
            >
                {/* Hero strip */}
                <LinearGradient
                    colors={['#1E1B4B', '#312E81', '#4338CA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroStrip}
                >
                    <View style={styles.heroShine} />
                    <Text style={styles.heroEmoji}>💡</Text>
                    <View>
                        <Text style={styles.heroTitle}>Pro Tips for Roblox</Text>
                        <Text style={styles.heroSub}>Level up your gameplay & earnings</Text>
                    </View>
                </LinearGradient>

                {/* Tips list */}
                <View style={styles.tipsList}>
                    {TIPS.map((tip, i) => (
                        <View key={i} style={styles.tipCard}>
                            {/* Left accent bar */}
                            <LinearGradient
                                colors={tip.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.tipAccentBar}
                            />

                            <View style={styles.tipBody}>
                                <View style={styles.tipTopRow}>
                                    {/* Icon bubble */}
                                    <LinearGradient
                                        colors={tip.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.tipIconBubble}
                                    >
                                        <Text style={styles.tipIconText}>{tip.icon}</Text>
                                    </LinearGradient>

                                    {/* Zap badge */}
                                    <View style={styles.zapBadge}>
                                        <Zap size={12} color={tip.gradient[1]} fill={tip.gradient[1]} />
                                        <Text style={[styles.zapText, { color: tip.gradient[1] }]}>TIP</Text>
                                    </View>
                                </View>

                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipContent}>{tip.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Safety card */}
                <View style={styles.safetyCard}>
                    <LinearGradient
                        colors={['#064E3B', '#065F46', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.safetyGradient}
                    >
                        <View style={styles.safetyShine} />
                        <View style={styles.safetyIconRing}>
                            <Shield size={28} color="#FFF" strokeWidth={2} />
                        </View>
                        <Text style={styles.safetyTitle}>Stay Safe Online</Text>
                        <Text style={styles.safetyText}>
                            Never share your password or personal information. Always verify official Roblox communications.
                        </Text>
                    </LinearGradient>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        opacity: 0.08,
    },
    blobTR: {
        top: -60,
        right: -60,
        backgroundColor: '#F59E0B',
    },
    blobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#6366F1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
    },
    backButton: {
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
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: 'rgba(245,158,11,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.3)',
    },
    headerBadgeText: {
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: '800',
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    heroStrip: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    heroShine: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    heroEmoji: {
        fontSize: 40,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.4,
        marginBottom: 3,
    },
    heroSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '500',
    },
    tipsList: {
        gap: 12,
        marginBottom: 20,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
    },
    tipAccentBar: {
        width: 4,
        borderRadius: 4,
    },
    tipBody: {
        flex: 1,
        padding: 16,
        gap: 8,
    },
    tipTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    tipIconBubble: {
        width: 44,
        height: 44,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipIconText: {
        fontSize: 22,
    },
    zapBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    zapText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
    },
    tipContent: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 19,
        fontWeight: '500',
    },
    safetyCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    safetyGradient: {
        padding: 24,
        alignItems: 'center',
        gap: 10,
    },
    safetyShine: {
        position: 'absolute',
        top: -40,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.08)',
        transform: [{ scaleX: 2 }],
    },
    safetyIconRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    safetyTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.4,
    },
    safetyText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
});