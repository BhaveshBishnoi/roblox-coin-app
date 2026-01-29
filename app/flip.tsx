import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Clock, Lock } from 'lucide-react-native';

const FLIP_DURATION = 500;
const VALUES = ['10', '50', '5', '100', '20', '500'];

function Card({ value, onFlip, disabled }: { value: string, onFlip: () => void, disabled: boolean }) {
    const isFlipped = useSharedValue(0);
    const [revealed, setRevealed] = useState(false);
    const triggerAd = useAdAction();

    const handlePress = () => {
        if (revealed || disabled) return;
        triggerAd(() => {
            setRevealed(true);
            isFlipped.value = withTiming(180, { duration: FLIP_DURATION });
            onFlip();
        });
    };

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
        <Pressable onPress={handlePress} style={styles.cardContainer}>
            <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
                {disabled && !revealed ? (
                    <Lock size={24} color={Colors.textSecondary} />
                ) : (
                    <Text style={styles.questionMark}>?</Text>
                )}
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
                <Text style={styles.value}>{value}</Text>
            </Animated.View>
        </Pressable>
    )
}

export default function Flip() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('flip', 1);
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('flip', 1));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleFlip = (val: string) => {
        const amount = parseInt(val, 10);
        addCoins(amount, 'Flip Card');
        setCooldown('flip');
        setAvailable(false);
        Alert.alert("YOU FOUND COINS!", `You got ${amount} Coins! Come back in 1 hour.`);
    };

    return (
        <Container>

            {available ? (
                <Text style={styles.subtitle}>Tap a card to flip it!</Text>
            ) : (
                <View style={[styles.center, { marginBottom: 20 }]}>
                    <View style={styles.cooldownContainer}>
                        <Clock size={16} color={Colors.red} />
                        <Text style={styles.cooldownText}>Next Flip in {timeLeft}</Text>
                    </View>
                </View>
            )}

            <View style={styles.grid}>
                {VALUES.map((val, i) => (
                    <View key={i} style={styles.wrapper}>
                        <Card
                            value={val}
                            onFlip={() => handleFlip(val)}
                            disabled={!available}
                        />
                    </View>
                ))}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
    },
    subtitle: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    cooldownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    cooldownText: {
        color: Colors.red,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    wrapper: {
        width: '28%',
        aspectRatio: 0.7,
    },
    cardContainer: {
        flex: 1,
    },
    card: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
        borderWidth: 2,
    },
    cardFront: {
        backgroundColor: Colors.surfaceHighlight,
        borderColor: Colors.border,
    },
    cardBack: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    questionMark: {
        fontSize: 32,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
    }
});
