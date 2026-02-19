import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withRepeat,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Clock, Zap, Star, Trophy, ChevronLeft, Gift } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const generateCoinValue = () => Math.floor(Math.random() * 10) + 1;

// Floating particle
const Particle = ({ delay, x, emoji }: { delay: number; x: number; emoji: string }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(withTiming(-130, { duration: 2200, easing: Easing.out(Easing.ease) }), -1, false)
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(1, { duration: 1400 }),
                    withTiming(0, { duration: 400 })
                ),
                -1,
                false
            )
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
        position: 'absolute',
        left: x,
        bottom: 0,
    }));

    return (
        <Animated.View style={style}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
        </Animated.View>
    );
};

export default function Scratch() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const router = useRouter();
    const triggerAd = useAdAction();

    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [coinValue, setCoinValue] = useState(0);
    const [isScratched, setIsScratched] = useState(false);
    const [hasScratched, setHasScratched] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    const scale = useSharedValue(1);
    const cardFloat = useSharedValue(0);
    const glowScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);
    const revealScale = useSharedValue(0);

    useEffect(() => {
        cardFloat.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        glowScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        pulseOpacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 1500 }),
                withTiming(0.3, { duration: 1500 })
            ),
            -1,
            false
        );
    }, []);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('scratch', 6); // 6 hour cooldown
            setAvailable(isReady);

            if (!isReady) {
                setTimeLeft(getRemainingTime('scratch', 6));
            } else {
                setTimeLeft(null);
                if (hasScratched) {
                    setIsScratched(false);
                    setHasScratched(false);
                    setShowParticles(false);
                    revealScale.value = 0;
                    cardFloat.value = withRepeat(
                        withSequence(
                            withTiming(-8, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
                            withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
                        ),
                        -1,
                        false
                    );
                }
            }
        };

        setCoinValue(generateCoinValue());
        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [hasScratched, checkCooldown, getRemainingTime]);

    const handleScratch = () => {
        if (!available || isScratched) return;

        triggerAd(() => {
            setIsScratched(true);
            setHasScratched(true);

            // Stop floating
            cardFloat.value = withTiming(0, { duration: 300 });

            scale.value = withSequence(
                withSpring(0.92, { damping: 12 }),
                withSpring(1.06, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );

            revealScale.value = withSequence(
                withTiming(0, { duration: 0 }),
                withSpring(1, { damping: 10, stiffness: 120 })
            );

            setTimeout(() => {
                setShowParticles(true);
                addCoins(coinValue, 'Scratch Card');
                setCooldown('scratch');
                setAvailable(false);

                Alert.alert(
                    '🎉 You Won!',
                    `${coinValue} Coins added to your wallet!\nCome back in 6 hours for another scratch.`,
                    [{ text: '🔥 Awesome!' }]
                );
            }, 600);
        });
    };

    const cardWrapperStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: isScratched ? 0 : cardFloat.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: pulseOpacity.value,
    }));

    const revealStyle = useAnimatedStyle(() => ({
        transform: [{ scale: revealScale.value }],
        opacity: revealScale.value,
    }));

    const particles = [
        { x: CARD_WIDTH * 0.08, emoji: '✨', delay: 0 },
        { x: CARD_WIDTH * 0.22, emoji: '🪙', delay: 150 },
        { x: CARD_WIDTH * 0.42, emoji: '⭐', delay: 300 },
        { x: CARD_WIDTH * 0.62, emoji: '🎊', delay: 100 },
        { x: CARD_WIDTH * 0.80, emoji: '✨', delay: 250 },
    ];

    return (
        <Container safeArea={false}>
            {/* Background */}
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Ambient blobs */}
            <View style={[styles.blob, styles.blobTopRight]} />
            <View style={[styles.blob, styles.blobBottomLeft]} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Scratch Card</Text>
                </View>
                <View style={styles.coinBadge}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.coinBadgeText}>1-10</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Prize badge */}
                <View style={styles.prizeRow}>
                    <LinearGradient
                        colors={['#D97706', '#F59E0B', '#FCD34D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.prizeBadge}
                    >
                        <Zap size={14} color="#78350F" fill="#78350F" />
                        <Text style={styles.prizeText}>Scratch & Win Every 6 Hours</Text>
                    </LinearGradient>
                </View>

                {/* Status */}
                {available && !isScratched ? (
                    <View style={styles.statusReady}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusReadyText}>Ready to scratch!</Text>
                    </View>
                ) : !available ? (
                    <View style={styles.cooldownPill}>
                        <Clock size={15} color="#F87171" />
                        <Text style={styles.cooldownText}>Next scratch in {timeLeft}</Text>
                    </View>
                ) : null}

                {/* Card */}
                <View style={styles.cardArea}>
                    {/* Glow */}
                    {available && !isScratched && (
                        <Animated.View style={[styles.cardGlow, glowStyle]} />
                    )}
                    {isScratched && (
                        <View style={styles.cardGlowWin} />
                    )}

                    <Animated.View style={[styles.cardWrapper, cardWrapperStyle]}>
                        <Pressable
                            onPress={handleScratch}
                            style={styles.cardPressable}
                            disabled={!available || isScratched}
                        >
                            {!isScratched ? (
                                /* Unscratched card */
                                available ? (
                                    <LinearGradient
                                        colors={['#92400E', '#D97706', '#F59E0B', '#FCD34D']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardShine} />
                                        <View style={styles.cardShineBottom} />
                                        <View style={styles.cardInner}>
                                            <View style={styles.cardPattern}>
                                                {[...Array(5)].map((_, i) => (
                                                    <View key={i} style={styles.patternDot} />
                                                ))}
                                            </View>
                                            <View style={styles.iconRing}>
                                                <Gift size={52} color="#FFF" strokeWidth={1.5} />
                                            </View>
                                            <View style={styles.tapHint}>
                                                <Zap size={16} color="#78350F" fill="#78350F" />
                                                <Text style={styles.tapText}>TAP TO SCRATCH</Text>
                                            </View>
                                            <View style={styles.hintBadge}>
                                                <Star size={13} color="#92400E" fill="#92400E" />
                                                <Text style={styles.hintText}>Win up to 10 coins</Text>
                                            </View>
                                            <View style={styles.cardPattern}>
                                                {[...Array(5)].map((_, i) => (
                                                    <View key={i} style={styles.patternDot} />
                                                ))}
                                            </View>
                                        </View>
                                    </LinearGradient>
                                ) : (
                                    /* Locked */
                                    <LinearGradient
                                        colors={['#1C1C2E', '#16213E', '#0F3460']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardInner}>
                                            <View style={styles.lockedIconRing}>
                                                <Clock size={40} color="#475569" />
                                            </View>
                                            <Text style={styles.lockedTitle}>LOCKED</Text>
                                            <Text style={styles.lockedSub}>Come back soon</Text>
                                            {timeLeft && (
                                                <View style={styles.lockedTimer}>
                                                    <Text style={styles.lockedTimerText}>{timeLeft}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </LinearGradient>
                                )
                            ) : (
                                /* Revealed — win */
                                <Animated.View style={[StyleSheet.absoluteFill, revealStyle]}>
                                    <LinearGradient
                                        colors={['#065F46', '#059669', '#10B981', '#34D399']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.card}
                                    >
                                        <View style={styles.cardShine} />
                                        <View style={styles.cardInner}>
                                            <Trophy size={52} color="#FFF" fill="rgba(255,255,255,0.15)" />
                                            <Text style={styles.winLabel}>YOU WON</Text>
                                            <View style={styles.winValueContainer}>
                                                <Text style={styles.winValue}>{coinValue}</Text>
                                            </View>
                                            <Text style={styles.winCoinsText}>COINS</Text>
                                            <View style={styles.winEmojis}>
                                                <Text style={styles.winEmoji}>🎉</Text>
                                                <Text style={styles.winEmoji}>🎊</Text>
                                                <Text style={styles.winEmoji}>✨</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </Animated.View>
                            )}
                        </Pressable>
                    </Animated.View>

                    {/* Particles */}
                    {showParticles && (
                        <View style={styles.particleContainer}>
                            {particles.map((p, i) => (
                                <Particle key={i} x={p.x} emoji={p.emoji} delay={p.delay} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Info strip */}
                <View style={styles.infoStrip}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>⏱</Text>
                        <Text style={styles.infoLabel}>Every 6 Hours</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>🪙</Text>
                        <Text style={styles.infoLabel}>1-10 Coins</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>💯</Text>
                        <Text style={styles.infoLabel}>Always Win</Text>
                    </View>
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        opacity: 0.1,
    },
    blobTopRight: {
        top: -80,
        right: -80,
        backgroundColor: '#F59E0B',
    },
    blobBottomLeft: {
        bottom: -80,
        left: -80,
        backgroundColor: '#10B981',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
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
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    coinBadgeText: {
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: '800',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 24,
        alignItems: 'center',
    },
    prizeRow: {
        marginBottom: 14,
    },
    prizeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    prizeText: {
        color: '#78350F',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
    statusReady: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        shadowColor: '#10B981',
        shadowOpacity: 0.8,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
    },
    statusReadyText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '700',
    },
    cooldownPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        marginBottom: 10,
    },
    cooldownText: {
        color: '#F87171',
        fontSize: 14,
        fontWeight: '700',
    },
    cardArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    cardGlow: {
        position: 'absolute',
        width: CARD_WIDTH + 60,
        height: CARD_HEIGHT + 60,
        borderRadius: 40,
        backgroundColor: '#D97706',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 40,
        elevation: 20,
    },
    cardGlowWin: {
        position: 'absolute',
        width: CARD_WIDTH + 60,
        height: CARD_HEIGHT + 60,
        borderRadius: 40,
        backgroundColor: '#059669',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 50,
        elevation: 20,
        opacity: 0.35,
    },
    cardWrapper: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
    },
    cardPressable: {
        flex: 1,
    },
    card: {
        flex: 1,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 16,
    },
    cardShine: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.15)',
        transform: [{ scaleX: 1.8 }],
    },
    cardShineBottom: {
        position: 'absolute',
        bottom: -60,
        right: -60,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    cardInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 14,
    },
    cardPattern: {
        flexDirection: 'row',
        gap: 8,
    },
    patternDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    iconRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    tapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 4,
    },
    tapText: {
        fontSize: 15,
        color: '#78350F',
        fontWeight: '900',
        letterSpacing: 2,
    },
    hintBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    hintText: {
        color: '#78350F',
        fontSize: 13,
        fontWeight: '800',
    },
    lockedIconRing: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(71, 85, 105, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(71, 85, 105, 0.4)',
        marginBottom: 4,
    },
    lockedTitle: {
        color: '#64748B',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 4,
    },
    lockedSub: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    lockedTimer: {
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 16,
        marginTop: 4,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    lockedTimerText: {
        color: '#94A3B8',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    winLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 4,
        marginTop: 8,
    },
    winValueContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    winValue: {
        fontSize: 64,
        color: '#FFFFFF',
        fontWeight: '900',
        letterSpacing: -3,
        lineHeight: 70,
    },
    winCoinsText: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '800',
        letterSpacing: 4,
    },
    winEmojis: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    winEmoji: {
        fontSize: 26,
    },
    particleContainer: {
        position: 'absolute',
        bottom: 0,
        left: 32,
        width: CARD_WIDTH,
        height: 150,
        overflow: 'hidden',
    },
    infoStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 24,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginTop: 16,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    infoEmoji: {
        fontSize: 22,
    },
    infoLabel: {
        color: 'rgba(255,255,255,0.6)',
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