import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Gift, Clock, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Daily() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const triggerAd = useAdAction();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('daily', 24);
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('daily', 24));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClaim = () => {
        if (!available) return;

        triggerAd(() => {
            addCoins(100, 'Daily Reward');
            setCooldown('daily');
            setAvailable(false);
        });
    };

    return (
        <Container safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Icon Container */}
                <LinearGradient
                    colors={available ? ['#22c55e', '#16a34a'] : ['#64748b', '#475569']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                >
                    <View style={styles.iconGlow} />
                    <Gift size={64} color="#fff" strokeWidth={2} />
                </LinearGradient>

                {/* Title */}
                <Text style={styles.title}>Daily Bonus</Text>
                <Text style={styles.subtitle}>
                    Return every day to claim your free 100 coins!
                </Text>

                {/* Status Card */}
                {available ? (
                    <View style={styles.statusCard}>
                        <View style={styles.statusIconContainer}>
                            <CheckCircle size={32} color={Colors.success} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.statusTitle}>Ready to Claim!</Text>
                        <Text style={styles.statusSub}>Your daily reward is available</Text>

                        <View style={styles.rewardBox}>
                            <Text style={styles.rewardAmount}>100</Text>
                            <Text style={styles.rewardLabel}>Coins</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.statusCard}>
                        <View style={[styles.statusIconContainer, { backgroundColor: '#fee2e2' }]}>
                            <Clock size={32} color={Colors.red} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.statusTitle}>Already Claimed</Text>
                        <Text style={styles.statusSub}>Come back tomorrow for your next reward</Text>

                        <View style={styles.timerBox}>
                            <Text style={styles.timerLabel}>Next reward in</Text>
                            <Text style={styles.timerText}>{timeLeft}</Text>
                        </View>
                    </View>
                )}

                {/* Claim Button */}
                <SafeButton
                    title={available ? "CLAIM 100 COINS" : "CLAIMED"}
                    onPress={handleClaim}
                    variant={available ? "primary" : "secondary"}
                    disabled={!available}
                    style={styles.claimBtn}
                    icon={available ? <Gift color="#fff" size={20} strokeWidth={2.5} /> : undefined}
                />

                {/* Info Cards */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>🎁</Text>
                        <Text style={styles.infoTitle}>Daily Rewards</Text>
                        <Text style={styles.infoText}>Claim 100 coins every 24 hours</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>⏰</Text>
                        <Text style={styles.infoTitle}>Never Miss Out</Text>
                        <Text style={styles.infoText}>Set a reminder to claim daily</Text>
                    </View>
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
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    iconGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
        marginBottom: 32,
        paddingHorizontal: 20,
        lineHeight: 22,
        fontWeight: '500',
    },
    statusCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    statusIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#dcfce7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 6,
        letterSpacing: -0.4,
    },
    statusSub: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 24,
        fontWeight: '500',
    },
    rewardBox: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: '#f0fdf4',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#22c55e',
    },
    rewardAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: Colors.success,
        letterSpacing: -1,
    },
    rewardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.success,
        marginTop: 4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    timerBox: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: '#fef2f2',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fecaca',
    },
    timerLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timerText: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.red,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.5,
    },
    claimBtn: {
        width: '100%',
        height: 56,
        marginBottom: 32,
    },
    infoSection: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    infoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    infoText: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
        fontWeight: '500',
    },
});
