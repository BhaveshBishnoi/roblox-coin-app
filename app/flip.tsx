import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Dimensions, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Easing,
    withSequence,
    withRepeat,
    withDelay,
    runOnJS,
} from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Clock, Zap, Star, Trophy, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const FLIP_DURATION = 700;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const generateCoinValue = () => Math.floor(Math.random() * 10) + 1;

// Floating particle component
const Particle = ({ delay, x, emoji }: { delay: number; x: number; emoji: string }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(-120, { duration: 2000, easing: Easing.out(Easing.ease) }),
                -1,
                false
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: 400 }),
                    withTiming(1, { duration: 1200 }),
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
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
        </Animated.View>
    );
};

export default function Flip() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const router = useRouter();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [coinValue, setCoinValue] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const [showParticles, setShowParticles] = useState(false);

    const flipRotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const glowScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);
    const cardFloat = useSharedValue(0);
    const triggerAd = useAdAction();

    // Floating animation for idle card
    useEffect(() => {
        cardFloat.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        pulseOpacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        glowScale.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('flip', 1);
            setAvailable(isReady);

            if (!isReady) {
                setTimeLeft(getRemainingTime('flip', 1));
            } else {
                setTimeLeft(null);
                if (hasFlipped) {
                    setIsFlipped(false);
                    setHasFlipped(false);
                    flipRotation.value = 0;
                    setCoinValue(generateCoinValue());
                    setShowParticles(false);
                }
            }
        };

        setCoinValue(generateCoinValue());
        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [hasFlipped, checkCooldown, getRemainingTime]);

    const handleFlip = () => {
        if (!available || isFlipped) return;

        triggerAd(() => {
            setIsFlipped(true);
            setHasFlipped(true);

            scale.value = withSequence(
                withSpring(0.93, { damping: 12 }),
                withSpring(1.06, { damping: 8 }),
                withSpring(1, { damping: 12 })
            );

            flipRotation.value = withTiming(180, {
                duration: FLIP_DURATION,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });

            setTimeout(() => {
                setShowParticles(true);
                addCoins(coinValue, 'Flip Card');
                setCooldown('flip');
                setAvailable(false);

                Alert.alert(
                    "🎉 You Won!",
                    `${coinValue} Coins added to your wallet!\nCome back in 1 hour for another flip.`,
                    [{ text: '🔥 Awesome!' }]
                );
            }, FLIP_DURATION + 150);
        });
    };

    const cardWrapperStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: isFlipped ? 0 : cardFloat.value },
        ],
    }));

    const frontStyle = useAnimatedStyle(() => {
        const rotate = interpolate(flipRotation.value, [0, 180], [0, 180]);
        return {
            transform: [{ rotateY: `${rotate}deg` }],
            opacity: flipRotation.value < 90 ? 1 : 0,
        };
    });

    const backStyle = useAnimatedStyle(() => {
        const rotate = interpolate(flipRotation.value, [0, 180], [180, 360]);
        return {
            transform: [{ rotateY: `${rotate}deg` }],
            opacity: flipRotation.value > 90 ? 1 : 0,
        };
    });

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: pulseOpacity.value,
    }));

    const particles = [
        { x: CARD_WIDTH * 0.1, emoji: '✨', delay: 0 },
        { x: CARD_WIDTH * 0.25, emoji: '🪙', delay: 200 },
        { x: CARD_WIDTH * 0.45, emoji: '⭐', delay: 400 },
        { x: CARD_WIDTH * 0.65, emoji: '🎊', delay: 150 },
        { x: CARD_WIDTH * 0.82, emoji: '✨', delay: 300 },
    ];

    return (
        <Container safeArea={false}>
            {/* Background */}
            <LinearGradient
                colors={['#0A0A1A', '#0F0F2E', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Ambient glow blobs */}
            <View style={[styles.blob, styles.blobTopRight]} />
            <View style={[styles.blob, styles.blobBottomLeft]} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </Pressable>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Lucky Flip</Text>
                </View>
                <View style={styles.coinBadge}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.coinBadgeText}>1-10</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Prize text */}
                <View style={styles.prizeRow}>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6', '#D946EF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.prizeBadge}
                    >
                        <Zap size={14} color="#FFF" fill="#FFF" />
                        <Text style={styles.prizeText}>Guaranteed Coins Every Flip</Text>
                    </LinearGradient>
                </View>

                {/* Status */}
                {available && !isFlipped ? (
                    <View style={styles.statusReady}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusReadyText}>Ready to flip!</Text>
                    </View>
                ) : !available ? (
                    <View style={styles.cooldownPill}>
                        <Clock size={15} color="#F87171" />
                        <Text style={styles.cooldownText}>Next flip in {timeLeft}</Text>
                    </View>
                ) : null}

                {/* Card */}
                <View style={styles.cardArea}>
                    {/* Glow behind card */}
                    {available && !isFlipped && (
                        <Animated.View style={[styles.cardGlow, glowStyle]} />
                    )}
                    {isFlipped && (
                        <View style={styles.cardGlowWin} />
                    )}

                    <Animated.View style={[styles.cardWrapper, cardWrapperStyle]}>
                        <Pressable
                            onPress={handleFlip}
                            style={styles.cardPressable}
                            disabled={!available || isFlipped}
                        >
                            {/* Front */}
                            <Animated.View style={[styles.card, frontStyle]}>
                                {!available ? (
                                    <LinearGradient
                                        colors={['#1C1C2E', '#16213E', '#0F3460']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.cardGradient}
                                    >
                                        <View style={styles.cardInner}>
                                            <View style={styles.lockedIconRing}>
                                                <Clock size={36} color="#475569" />
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
                                ) : (
                                    <LinearGradient
                                        colors={['#4F46E5', '#7C3AED', '#9333EA', '#C026D3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.cardGradient}
                                    >
                                        {/* Shine overlay */}
                                        <View style={styles.cardShine} />
                                        <View style={styles.cardShineBottom} />

                                        <View style={styles.cardInner}>
                                            {/* Card pattern */}
                                            <View style={styles.cardPattern}>
                                                {[...Array(6)].map((_, i) => (
                                                    <View key={i} style={styles.patternDot} />
                                                ))}
                                            </View>

                                            <View style={styles.bigQuestionContainer}>
                                                <Text style={styles.questionMark}>?</Text>
                                            </View>

                                            <View style={styles.tapHint}>
                                                <Zap size={16} color="#FFF" fill="#FFF" />
                                                <Text style={styles.tapText}>TAP TO REVEAL</Text>
                                            </View>

                                            <View style={styles.hintBadge}>
                                                <Star size={13} color="#FDE68A" fill="#FDE68A" />
                                                <Text style={styles.hintText}>Win up to 10 coins</Text>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                )}
                            </Animated.View>

                            {/* Back */}
                            <Animated.View style={[styles.card, backStyle]}>
                                <LinearGradient
                                    colors={['#065F46', '#059669', '#10B981', '#34D399']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardShine} />

                                    <View style={styles.cardInner}>
                                        <Trophy size={48} color="#FFF" fill="rgba(255,255,255,0.2)" />

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
                        </Pressable>
                    </Animated.View>

                    {/* Particles after win */}
                    {showParticles && (
                        <View style={styles.particleContainer}>
                            {particles.map((p, i) => (
                                <Particle key={i} x={p.x} emoji={p.emoji} delay={p.delay} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Bottom info strip */}
                <View style={styles.infoStrip}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>⏱</Text>
                        <Text style={styles.infoLabel}>Every Hour</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>🪙</Text>
                        <Text style={styles.infoLabel}>1-10 Coins</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoEmoji}>💯</Text>
                        <Text style={styles.infoLabel}>Guaranteed</Text>
                    </View>
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.12,
    },
    blobTopRight: {
        top: -80,
        right: -80,
        backgroundColor: '#8B5CF6',
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
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
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
        backgroundColor: '#7C3AED',
        shadowColor: '#7C3AED',
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
        opacity: 0.4,
    },
    cardWrapper: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
    },
    cardPressable: {
        flex: 1,
    },
    card: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 28,
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 16,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 28,
    },
    cardShine: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.12)',
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
        gap: 12,
    },
    cardPattern: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    patternDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    bigQuestionContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    questionMark: {
        fontSize: 80,
        color: '#FFFFFF',
        fontWeight: '900',
        lineHeight: 90,
    },
    tapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginTop: 4,
    },
    tapText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 2,
    },
    hintBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    hintText: {
        color: '#FDE68A',
        fontSize: 13,
        fontWeight: '700',
    },
    lockedIconRing: {
        width: 88,
        height: 88,
        borderRadius: 44,
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
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    lockedTimerText: {
        color: '#94A3B8',
        fontSize: 16,
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
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    winValue: {
        fontSize: 72,
        color: '#FFFFFF',
        fontWeight: '900',
        letterSpacing: -4,
        lineHeight: 76,
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
        height: 140,
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