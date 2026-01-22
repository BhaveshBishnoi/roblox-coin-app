import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, withSequence } from 'react-native-reanimated';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';

const FLIP_DURATION = 500;

function Card({ value }: { value: string }) {
    const isFlipped = useSharedValue(0);
    const [revealed, setRevealed] = useState(false);
    const triggerAd = useAdAction();

    const handlePress = () => {
        if (revealed) return;
        triggerAd(() => {
            setRevealed(true);
            isFlipped.value = withTiming(180, { duration: FLIP_DURATION });
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
                <Text style={styles.questionMark}>?</Text>
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
                <Text style={styles.value}>{value}</Text>
            </Animated.View>
        </Pressable>
    )
}

export default function Flip() {
    // Generate random values
    const values = ['10', '50', '5', '100', '20', '500'];

    return (
        <Container>
            <Title>FLIP & WIN</Title>
            <Text style={styles.subtitle}>Tap a card to flip it!</Text>

            <View style={styles.grid}>
                {values.map((val, i) => (
                    <View key={i} style={styles.wrapper}>
                        <Card value={val} />
                    </View>
                ))}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
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
