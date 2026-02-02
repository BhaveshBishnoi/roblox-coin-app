import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions } from 'react-native';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Trophy, Lock, Clock, Sparkles, Frown, Gift } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Generate card values: mostly "Better luck next time", only 1-2 cards have coins (5-20 points)
const generateCardValues = () => {
    const values = [
        'Better luck next time',
        'Better luck next time',
        'Better luck next time',
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
        winningPositions.add(Math.floor(Math.random() * 9));
    }

    winningPositions.forEach(pos => {
        const points = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
        values[pos] = `${points}`;
    });

    return values;
};

interface ScratchCardProps {
    prize: string;
    onReveal: () => void;
    disabled: boolean;
    index: number;
}

function ScratchCard({ prize, onReveal, disabled, index }: ScratchCardProps) {
    const [scratched, setScratched] = useState(false);
    const triggerAd = useAdAction();
    const isWinning = prize !== 'Better luck next time';

    const handleScratch = () => {
        if (scratched || disabled) return;
        triggerAd(() => {
            setScratched(true);
            onReveal();
        });
    };

    return (
        <Pressable
            onPress={handleScratch}
            style={[
                styles.card,
                scratched && styles.cardScratched,
                disabled && !scratched && styles.cardDisabled
            ]}
        >
            {scratched ? (
                <LinearGradient
                    colors={isWinning
                        ? ['#10B981', '#059669', '#047857']
                        : ['#EF4444', '#DC2626', '#B91C1C']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.prizeContent}
                >
                    {isWinning ? (
                        <>
                            <Sparkles size={24} color="#fff" strokeWidth={2.5} />
                            <Text style={styles.prizeText}>{prize}</Text>
                            <Text style={styles.prizeLabel}>COINS!</Text>
                        </>
                    ) : (
                        <>
                            <Frown size={24} color="#fff" strokeWidth={2.5} />
                            <Text style={styles.loseText}>No Luck</Text>
                        </>
                    )}
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={disabled
                        ? ['#94A3B8', '#64748B']
                        : ['#8B5CF6', '#7C3AED', '#6D28D9']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardCover}
                >
                    {disabled ? (
                        <Lock size={28} color="#fff" strokeWidth={2.5} />
                    ) : (
                        <>
                            <Gift size={32} color="#fff" strokeWidth={2.5} />
                            <Text style={styles.scratchText}>SCRATCH</Text>
                        </>
                    )}
                </LinearGradient>
            )}
        </Pressable>
    );
}

export default function Scratch() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [cardValues, setCardValues] = useState<string[]>([]);
    const [scratchedCount, setScratchedCount] = useState(0);
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
            const isReady = checkCooldown('scratch', 1);
            if (isMounted.current) {
                const wasAvailable = available;
                setAvailable(isReady);

                if (!isReady) {
                    setTimeLeft(getRemainingTime('scratch', 1));
                } else {
                    setTimeLeft(null);
                    // Only generate new values when transitioning from unavailable to available
                    if (!wasAvailable && isReady && hasGeneratedValues.current) {
                        setCardValues(generateCardValues());
                        setScratchedCount(0);
                    }
                }
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [available, checkCooldown, getRemainingTime]);

    const handleReveal = (prize: string) => {
        const newCount = scratchedCount + 1;
        setScratchedCount(newCount);

        if (prize === 'Better luck next time') {
            // Only show alert and set cooldown after scratching all cards or first card
            if (newCount === 1) {
                setTimeout(() => {
                    setCooldown('scratch');
                    setAvailable(false);
                    Alert.alert("😢 No Luck This Time", "Better luck next time! Come back in 1 hour to try again.");
                }, 500);
            }
        } else {
            const amount = parseInt(prize, 10);
            setTimeout(() => {
                addCoins(amount, 'Scratch Win');
                setCooldown('scratch');
                setAvailable(false);
                Alert.alert("🎉 WINNER!", `Congratulations! You won ${amount} Coins!\n\nCome back in 1 hour for another chance.`);
            }, 500);
        }
    };

    return (
        <Container>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🎫 Scratch Cards</Text>
                    <Text style={styles.subtitle}>
                        Scratch to reveal your prize! Most cards have no reward, but a lucky few contain 5-20 coins!
                    </Text>
                </View>

                {/* Cooldown Banner */}
                {!available && timeLeft && (
                    <View style={styles.cooldownBanner}>
                        <Clock size={20} color={Colors.red} strokeWidth={2.5} />
                        <View style={styles.cooldownTextContainer}>
                            <Text style={styles.cooldownLabel}>Next scratch in</Text>
                            <Text style={styles.cooldownTime}>{timeLeft}</Text>
                        </View>
                    </View>
                )}

                {/* Instruction */}
                {available && (
                    <View style={styles.instructionContainer}>
                        <Sparkles size={20} color={Colors.primary} />
                        <Text style={styles.instructionText}>Tap any card to scratch and reveal!</Text>
                    </View>
                )}

                {/* Cards Grid - 3x3 */}
                <View style={styles.gridContainer}>
                    <View style={styles.grid}>
                        {cardValues.map((prize, index) => (
                            <View key={index} style={styles.cardWrapper}>
                                <ScratchCard
                                    prize={prize}
                                    onReveal={() => handleReveal(prize)}
                                    disabled={!available}
                                    index={index}
                                />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>💡</Text>
                    <Text style={styles.infoTitle}>How it works</Text>
                    <Text style={styles.infoText}>
                        Scratch any card to reveal your prize. Only 1-2 cards contain coins (5-20), the rest say "Better luck next time". Play once every hour!
                    </Text>
                </View>
            </View>
        </Container>
    );
}

const CARD_SIZE = (SCREEN_WIDTH - 64) / 3; // 3 cards per row with proper spacing

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 10,
    },
    cooldownBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    cooldownTextContainer: {
        flex: 1,
    },
    cooldownLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cooldownTime: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.red,
        letterSpacing: -0.3,
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: 12,
    },
    instructionText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    gridContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    cardWrapper: {
        width: CARD_SIZE,
        height: CARD_SIZE,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    cardDisabled: {
        opacity: 0.6,
    },
    cardScratched: {
        transform: [{ scale: 0.98 }],
    },
    cardCover: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    scratchText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 1.5,
    },
    prizeContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    prizeText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    prizeLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: 1.5,
    },
    loseText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    infoIcon: {
        fontSize: 36,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 19,
        fontWeight: '500',
    },
});
