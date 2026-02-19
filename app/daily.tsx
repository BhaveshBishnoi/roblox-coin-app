import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Gift, Clock, CheckCircle, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function Daily() {
    const router = useRouter();
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
                <Text style={styles.headerTitle}>Daily Reward</Text>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>🎁 100</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces
            >
                {/* Icon Hero */}
                <LinearGradient
                    colors={available ? ['#064E3B', '#065F46', '#059669'] : ['#1C1C2E', '#1E293B', '#334155']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconCard}
                >
                    <View style={styles.iconShine} />
                    <View style={styles.iconRing}>
                        <Gift size={52} color="#FFF" strokeWidth={1.5} />
                    </View>
                    <Text style={styles.iconCardTitle}>
                        {available ? 'Claim Your Daily' : 'Come Back Soon'}
                    </Text>
                    <Text style={styles.iconCardSub}>
                        {available ? 'Your reward is ready to claim' : 'Daily reward refreshes every 24 hours'}
                    </Text>
                </LinearGradient>

                {/* Status Card */}
                {available ? (
                    <View style={styles.statusCard}>
                        <View style={styles.statusTop}>
                            <LinearGradient
                                colors={['#059669', '#10B981']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statusIconRing}
                            >
                                <CheckCircle size={28} color="#FFF" strokeWidth={2} />
                            </LinearGradient>
                            <View style={styles.statusTexts}>
                                <Text style={styles.statusTitle}>Ready to Claim!</Text>
                                <Text style={styles.statusSub}>Your daily reward is available</Text>
                            </View>
                        </View>

                        <LinearGradient
                            colors={['rgba(5,150,105,0.15)', 'rgba(16,185,129,0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.rewardBox}
                        >
                            <Text style={styles.rewardLabel}>COINS</Text>
                        </LinearGradient>
                    </View>
                ) : (
                    <View style={styles.statusCard}>
                        <View style={styles.statusTop}>
                            <LinearGradient
                                colors={['#7F1D1D', '#991B1B']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statusIconRing}
                            >
                                <Clock size={28} color="#FFF" strokeWidth={2} />
                            </LinearGradient>
                            <View style={styles.statusTexts}>
                                <Text style={styles.statusTitle}>Already Claimed</Text>
                                <Text style={styles.statusSub}>Come back in 24 hours</Text>
                            </View>
                        </View>

                        <View style={styles.timerBox}>
                            <Text style={styles.timerLabel}>Next reward in</Text>
                            <Text style={styles.timerText}>{timeLeft}</Text>
                        </View>
                    </View>
                )}

                {/* Claim Button */}
                <SafeButton
                    title={available ? 'CLAIM WINNER COINS' : 'CLAIMED'}
                    onPress={handleClaim}
                    variant={available ? 'primary' : 'secondary'}
                    disabled={!available}
                    style={styles.claimBtn}
                    icon={available ? <Gift color="#fff" size={20} strokeWidth={2.5} /> : undefined}
                />

                {/* Info Strip */}
                <View style={styles.infoStrip}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>🎁</Text>
                        <Text style={styles.infoLabel}>Daily Gift</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>🪙</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>⏰</Text>
                        <Text style={styles.infoLabel}>Every 24h</Text>
                    </View>
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
        opacity: 0.1,
    },
    blobTR: {
        top: -60,
        right: -60,
        backgroundColor: '#10B981',
    },
    blobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#F59E0B',
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
        backgroundColor: 'rgba(16,185,129,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
    },
    headerBadgeText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '800',
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    iconCard: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 10,
    },
    iconShine: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    iconRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
        marginBottom: 16,
    },
    iconCardTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    iconCardSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '500',
        textAlign: 'center',
    },
    statusCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        gap: 16,
    },
    statusTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    statusIconRing: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    statusTexts: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        marginBottom: 3,
    },
    statusSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
    rewardBox: {
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
    },
    rewardAmount: {
        fontSize: 52,
        fontWeight: '900',
        color: '#10B981',
        letterSpacing: -2,
    },
    rewardLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 2.5,
        marginTop: 2,
    },
    timerBox: {
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
    },
    timerLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1.5,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    timerText: {
        fontSize: 34,
        fontWeight: '900',
        color: '#F87171',
        fontVariant: ['tabular-nums'],
        letterSpacing: -1,
    },
    claimBtn: {
        width: '100%',
        height: 56,
        marginBottom: 20,
    },
    infoStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    infoEmoji: {
        fontSize: 22,
    },
    infoLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    infoDivider: {
        width: 1,
        height: 36,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
