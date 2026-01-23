import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { Lightbulb, TrendingUp, Shield, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TIPS = [
    {
        icon: '🎮',
        title: "How to get rich in Adopt Me?",
        content: "Trade your pets wisely! Look for neon pets and participate in every event update to maximize your earnings.",
        color: ['#22c55e', '#16a34a'] as const
    },
    {
        icon: '🎁',
        title: "Latest Promo Codes",
        content: "Check official Roblox social media pages for new codes like SPIDERCOLA or TWEETROBLOX for free items.",
        color: ['#3b82f6', '#2563eb'] as const
    },
    {
        icon: '🏗️',
        title: "Building Tips",
        content: "Use Roblox Studio to create your own games. It's the best way to earn Robux legitimately and showcase creativity!",
        color: ['#a855f7', '#9333ea'] as const
    },
    {
        icon: '💎',
        title: "Trading System",
        content: "Always check the value of items before accepting a trade. Beware of scams and never share your password!",
        color: ['#f59e0b', '#d97706'] as const
    },
    {
        icon: '⚡',
        title: "Daily Rewards",
        content: "Log in every day to claim free rewards and bonuses. Consistency is key to building your coin balance!",
        color: ['#ef4444', '#dc2626'] as const
    },
    {
        icon: '🎯',
        title: "Complete Challenges",
        content: "Participate in all available games and challenges to maximize your coin earnings throughout the day.",
        color: ['#06b6d4', '#0891b2'] as const
    }
];

export default function Tips() {
    return (
        <Container safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={['#fbbf24', '#f59e0b']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconContainer}
                    >
                        <Lightbulb size={40} color="#fff" strokeWidth={2.5} />
                    </LinearGradient>
                    <Text style={styles.title}>Tips & Tricks</Text>
                    <Text style={styles.subtitle}>Expert advice to maximize your Roblox experience</Text>
                </View>

                {/* Tips Grid */}
                <View style={styles.tipsGrid}>
                    {TIPS.map((tip, i) => (
                        <View key={i} style={styles.tipCard}>
                            <View style={styles.tipHeader}>
                                <View style={styles.tipIconContainer}>
                                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                                </View>
                                <LinearGradient
                                    colors={tip.color}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.tipBadge}
                                >
                                    <Zap size={12} color="#fff" strokeWidth={3} />
                                </LinearGradient>
                            </View>
                            <Text style={styles.tipTitle}>{tip.title}</Text>
                            <Text style={styles.tipContent}>{tip.content}</Text>
                        </View>
                    ))}
                </View>

                {/* Bottom Info */}
                <View style={styles.infoCard}>
                    <Shield size={24} color={Colors.primary} strokeWidth={2.5} />
                    <Text style={styles.infoTitle}>Stay Safe</Text>
                    <Text style={styles.infoText}>
                        Never share your password or personal information. Always verify official Roblox communications.
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 100,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    tipsGrid: {
        gap: 16,
        marginBottom: 24,
    },
    tipCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    tipHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipIcon: {
        fontSize: 24,
    },
    tipBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    tipContent: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 21,
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: '#f0fdf4',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#bbf7d0',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 12,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 21,
        fontWeight: '500',
    },
});
