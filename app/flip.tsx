import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Easing,
    withSequence
} from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Clock, Sparkles, Star, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FLIP_DURATION = 700;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Generate random coin value between 1-10
const generateCoinValue = () => {
    return Math.floor(Math.random() * 10) + 1;
};

export default function Flip() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [coinValue, setCoinValue] = useState<number>(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);

    const flipRotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0);
    const triggerAd = useAdAction();

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('flip', 1);
            setAvailable(isReady);

            if (!isReady) {
                setTimeLeft(getRemainingTime('flip', 1));
            } else {
                setTimeLeft(null);
                // Reset for new flip
                if (hasFlipped) {
                    setIsFlipped(false);
                    setHasFlipped(false);
                    flipRotation.value = 0;
                    setCoinValue(generateCoinValue());
                }
            }
        };

        // Generate initial coin value
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

            // Animate card flip
            scale.value = withSequence(
                withSpring(0.95, { damping: 10 }),
                withSpring(1.05, { damping: 8 }),
                withSpring(1, { damping: 10 })
            );

            flipRotation.value = withTiming(180, {
                duration: FLIP_DURATION,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });

            glowOpacity.value = withSequence(
                withTiming(1, { duration: 300 }),
                withTiming(0.6, { duration: 500 })
            );

            // Award coins after flip animation
            setTimeout(() => {
                addCoins(coinValue, 'Flip Card');
                setCooldown('flip');
                setAvailable(false);

                Alert.alert(
                    "🎉 Congratulations!",
                    `You won ${coinValue} Coins! Come back in 1 hour for another flip.`,
                    [{ text: 'Awesome!' }]
                );
            }, FLIP_DURATION + 200);
        });
    };

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const frontStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipRotation.value, [0, 180], [0, 180]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            opacity: flipRotation.value < 90 ? 1 : 0,
        };
    });

    const backStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipRotation.value, [0, 180], [180, 360]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            opacity: flipRotation.value > 90 ? 1 : 0,
        };
    });

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <Container>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🎴 Lucky Flip</Text>
                    <Text style={styles.description}>
                        Flip the card to reveal your prize! Win 1-10 coins every time!
                    </Text>
                </View>

                {/* Status Banner */}
                {available && !isFlipped ? (
                    <View style={styles.instructionContainer}>
                        <Sparkles size={20} color={Colors.primary} />
                        <Text style={styles.subtitle}>Tap the card to flip and win!</Text>
                    </View>
                ) : !available ? (
                    <View style={styles.cooldownWrapper}>
                        <View style={styles.cooldownContainer}>
                            <Clock size={20} color={Colors.red} />
                            <Text style={styles.cooldownText}>Next Flip in {timeLeft}</Text>
                        </View>
                    </View>
                ) : null}

                {/* Card Container */}
                <View style={styles.cardArea}>
                    <Animated.View style={[styles.cardWrapper, containerStyle]}>
                        {/* Glow Effect */}
                        {isFlipped && (
                            <Animated.View style={[styles.glowEffect, glowStyle]} />
                        )}

                        <Pressable
                            onPress={handleFlip}
                            style={styles.cardContainer}
                            disabled={!available || isFlipped}
                        >
                            {/* Front of card */}
                            <Animated.View style={[styles.card, frontStyle]}>
                                <LinearGradient
                                    colors={!available && !isFlipped
                                        ? ['#2D2D2D', '#1A1A1A']
                                        : ['#6366F1', '#8B5CF6', '#D946EF']
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardContent}>
                                        {!available && !isFlipped ? (
                                            <>
                                                <Clock size={64} color="#666" />
                                                <Text style={styles.lockedText}>LOCKED</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={48} color="#FFF" style={{ opacity: 0.9 }} />
                                                <Text style={styles.questionMark}>?</Text>
                                                <Text style={styles.tapText}>TAP TO FLIP</Text>
                                                <View style={styles.prizeHint}>
                                                    <Star size={16} color="#FFF" fill="#FFF" />
                                                    <Text style={styles.hintText}>Win 1-10 Coins</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </Animated.View>

                            {/* Back of card */}
                            <Animated.View style={[styles.card, backStyle]}>
                                <LinearGradient
                                    colors={['#10B981', '#059669', '#047857']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardContent}>
                                        <Trophy size={56} color="#FFF" />
                                        <Text style={styles.winText}>YOU WON!</Text>
                                        <Text style={styles.valueText}>{coinValue}</Text>
                                        <Text style={styles.coinsLabel}>COINS</Text>
                                        <View style={styles.confetti}>
                                            <Text style={styles.confettiEmoji}>🎉</Text>
                                            <Text style={styles.confettiEmoji}>✨</Text>
                                            <Text style={styles.confettiEmoji}>🎊</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Animated.View>
                        </Pressable>
                    </Animated.View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>💡</Text>
                    <Text style={styles.infoTitle}>How it works</Text>
                    <Text style={styles.infoText}>
                        Every flip guarantees you 1-10 coins! Come back every hour for another chance to win.
                    </Text>
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    subtitle: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    cooldownWrapper: {
        alignItems: 'center',
        marginBottom: 32,
    },
    cooldownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    cooldownText: {
        color: Colors.red,
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: -0.2,
    },
    cardArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    cardWrapper: {
        width: SCREEN_WIDTH - 60,
        height: (SCREEN_WIDTH - 60) * 1.4,
        maxHeight: 500,
        position: 'relative',
    },
    glowEffect: {
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        backgroundColor: '#10B981',
        borderRadius: 40,
        opacity: 0.3,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 15,
    },
    cardContainer: {
        flex: 1,
    },
    card: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 28,
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 28,
        padding: 4,
    },
    cardContent: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    questionMark: {
        fontSize: 120,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
        marginVertical: 8,
    },
    tapText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 3,
        opacity: 0.95,
    },
    prizeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 8,
    },
    hintText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    lockedText: {
        fontSize: 20,
        color: '#666',
        fontWeight: '800',
        letterSpacing: 2,
        marginTop: 12,
    },
    winText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '900',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    valueText: {
        fontSize: 96,
        color: '#FFFFFF',
        fontWeight: '900',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
        letterSpacing: -4,
        marginVertical: 8,
    },
    coinsLabel: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 3,
    },
    confetti: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    confettiEmoji: {
        fontSize: 28,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        marginTop: 20,
    },
    infoIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
});
