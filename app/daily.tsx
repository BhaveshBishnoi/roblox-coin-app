import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { AppHeader } from '../components/AppHeader';
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
            const isReady = checkCooldown('daily', 24); // 24 hours cooldown
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
            <AppHeader title="Daily Bonus" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Icon Container */}
                <LinearGradient
                    colors={available ? ['#10B981', '#059669'] : ['#64748b', '#475569']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer}
                >
                    <View style={styles.iconGlow} />
                    <Gift size={56} color="#fff" strokeWidth={2} />
                </LinearGradient>

                {/* Title */}
                <Text style={styles.title}>Daily Bonus</Text>
                <Text style={styles.subtitle}>
                    Return every 24 hours to claim your free 100 coins!
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
                        <View style={[styles.statusIconContainer, { backgroundColor: '#FEE2E2' }]}>
                            <Clock size={32} color={Colors.danger} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.statusTitle}>Already Claimed</Text>
                        <Text style={styles.statusSub}>Come back in 24 hours for your next reward</Text>

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
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 110,
        height: 110,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
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
        fontSize: 28,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 28,
        paddingHorizontal: 20,
        lineHeight: 22,
        fontWeight: '500',
    },
    statusCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    statusIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#D1FAE5',
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
        textAlign: 'center',
    },
    rewardBox: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        backgroundColor: Colors.primaryLight,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
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
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FECACA',
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
        color: Colors.danger,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.5,
    },
    claimBtn: {
        width: '100%',
        height: 56,
        marginBottom: 28,
    },
    infoSection: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: Colors.borderLight,
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
