import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Easing
} from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Clock, Lock, Sparkles, Frown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FLIP_DURATION = 600;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card values: mostly "Better luck next time", only 1-2 cards have coins (5-20 points)
const generateCardValues = () => {
    const values = [
        'Better luck next time',
        'Better luck next time',
        'Better luck next time',
        'Better luck next time',
        'Better luck next time',
        'Better luck next time',
    ];

    // Randomly place 1-2 winning cards with 5-20 points
    const winningCount = Math.random() > 0.5 ? 2 : 1;
    const winningPositions = new Set<number>();

    while (winningPositions.size < winningCount) {
        winningPositions.add(Math.floor(Math.random() * 6));
    }

    winningPositions.forEach(pos => {
        const points = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
        values[pos] = `${points}`;
    });

    return values;
};

interface CardProps {
    value: string;
    onFlip: () => void;
    disabled: boolean;
    index: number;
}

function Card({ value, onFlip, disabled, index }: CardProps) {
    const isFlipped = useSharedValue(0);
    const scale = useSharedValue(1);
    const [revealed, setRevealed] = useState(false);
    const triggerAd = useAdAction();

    const isWinning = value !== 'Better luck next time';

    const handlePress = () => {
        if (revealed || disabled) return;

        triggerAd(() => {
            setRevealed(true);
            scale.value = withSpring(0.95, { damping: 10 });
            setTimeout(() => {
                scale.value = withSpring(1, { damping: 8 });
                isFlipped.value = withTiming(180, {
                    duration: FLIP_DURATION,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
                });
            }, 100);
            onFlip();
        });
    };

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const frontStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(isFlipped.value, [0, 180], [0, 180]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            opacity: isFlipped.value < 90 ? 1 : 0,
        };
    });

    const backStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(isFlipped.value, [0, 180], [180, 360]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            opacity: isFlipped.value > 90 ? 1 : 0,
        };
    });

    return (
        <Animated.View style={[styles.cardWrapper, containerStyle]}>
            <Pressable onPress={handlePress} style={styles.cardContainer}>
                {/* Front of card */}
                <Animated.View style={[styles.card, frontStyle]}>
                    <LinearGradient
                        colors={disabled && !revealed
                            ? ['#2D2D2D', '#1A1A1A']
                            : ['#6366F1', '#8B5CF6', '#D946EF']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardGradient}
                    >
                        <View style={styles.cardContent}>
                            {disabled && !revealed ? (
                                <Lock size={48} color="#666" />
                            ) : (
                                <>
                                    <Sparkles size={32} color="#FFF" style={{ opacity: 0.8 }} />
                                    <Text style={styles.questionMark}>?</Text>
                                    <Text style={styles.tapText}>TAP ME</Text>
                                </>
                            )}
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Back of card */}
                <Animated.View style={[styles.card, backStyle]}>
                    <LinearGradient
                        colors={isWinning
                            ? ['#10B981', '#059669', '#047857']
                            : ['#EF4444', '#DC2626', '#B91C1C']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardGradient}
                    >
                        <View style={styles.cardContent}>
                            {isWinning ? (
                                <>
                                    <Sparkles size={40} color="#FFF" />
                                    <Text style={styles.valueText}>{value}</Text>
                                    <Text style={styles.coinsLabel}>COINS!</Text>
                                </>
                            ) : (
                                <>
                                    <Frown size={40} color="#FFF" style={{ opacity: 0.9 }} />
                                    <Text style={styles.luckText}>{value}</Text>
                                </>
                            )}
                        </View>
                    </LinearGradient>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
}

export default function Flip() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [cardValues, setCardValues] = useState<string[]>([]);
    const isMounted = React.useRef(true);
    const hasGeneratedValues = React.useRef(false);

    useEffect(() => {
        isMounted.current = true;
        // Generate initial card values on mount
        setCardValues(generateCardValues());
        hasGeneratedValues.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('flip', 1);
            if (isMounted.current) {
                const wasAvailable = available;
                setAvailable(isReady);

                if (!isReady) {
                    setTimeLeft(getRemainingTime('flip', 1));
                } else {
                    setTimeLeft(null);
                    // Only generate new values when transitioning from unavailable to available
                    if (!wasAvailable && isReady && hasGeneratedValues.current) {
                        setCardValues(generateCardValues());
                    }
                }
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [available, checkCooldown, getRemainingTime]);

    const handleFlip = (val: string) => {
        if (val === 'Better luck next time') {
            setCooldown('flip');
            setAvailable(false);
            Alert.alert("😢 No Luck This Time", "Better luck next time! Come back in 1 hour to try again.");
        } else {
            const amount = parseInt(val, 10);
            addCoins(amount, 'Flip Card');
            setCooldown('flip');
            setAvailable(false);
            Alert.alert("🎉 WINNER!", `Congratulations! You won ${amount} Coins! Come back in 1 hour.`);
        }
    };

    return (
        <Container>
            <View style={styles.header}>
                <Text style={styles.title}>🎴 Flip Cards</Text>
                <Text style={styles.description}>
                    Choose a card and test your luck! Most cards have no reward, but a lucky few contain 5-20 coins!
                </Text>
            </View>

            {available ? (
                <View style={styles.instructionContainer}>
                    <Sparkles size={20} color={Colors.primary} />
                    <Text style={styles.subtitle}>Tap any card to reveal your fortune!</Text>
                </View>
            ) : (
                <View style={styles.cooldownWrapper}>
                    <View style={styles.cooldownContainer}>
                        <Clock size={20} color={Colors.red} />
                        <Text style={styles.cooldownText}>Next Flip in {timeLeft}</Text>
                    </View>
                </View>
            )}

            <View style={styles.grid}>
                {cardValues.map((val, i) => (
                    <Card
                        key={i}
                        value={val}
                        onFlip={() => handleFlip(val)}
                        disabled={!available}
                        index={i}
                    />
                ))}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 12,
        marginHorizontal: 20,
    },
    subtitle: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
    cooldownWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },
    cooldownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    cooldownText: {
        color: Colors.red,
        fontWeight: 'bold',
        fontSize: 15,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 12,
        flex: 1,
    },
    cardWrapper: {
        width: (SCREEN_WIDTH - 48) / 2,
        height: (SCREEN_HEIGHT - 320) / 3,
        minHeight: 160,
    },
    cardContainer: {
        flex: 1,
    },
    card: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 3,
    },
    cardContent: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    questionMark: {
        fontSize: 56,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tapText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 2,
        opacity: 0.9,
    },
    valueText: {
        fontSize: 48,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    coinsLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    luckText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 20,
    },
});
