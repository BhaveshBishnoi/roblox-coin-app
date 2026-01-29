import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';
import { useCoins } from '../context/CoinContext';
import { Clock } from 'lucide-react-native';

const SEGMENTS = ['10', '50', '100', 'JACKPOT', '20', '500', '5', 'LOSE'];
const WHEEL_COLORS = [Colors.red, Colors.secondary, Colors.primary, Colors.accent, Colors.purple, '#FF8800', '#00D632', '#444'];
const SIZE = Dimensions.get('window').width * 0.8;
const RADIUS = SIZE / 2;

export default function Wheel() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const rotation = useSharedValue(0);
    const [spinning, setSpinning] = useState(false);
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            try {
                const isReady = checkCooldown('wheel', 3); // 3 hours cooldown
                setAvailable(isReady);
                if (!isReady) {
                    const remaining = getRemainingTime('wheel', 3);
                    setTimeLeft(remaining || '0h 0m');
                } else {
                    setTimeLeft(null);
                }
            } catch (error) {
                console.error('Error updating wheel status:', error);
                setAvailable(false);
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [checkCooldown, getRemainingTime]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const createSector = (index: number, total: number) => {
        const angle = 2 * Math.PI / total;
        const start = index * angle;
        const end = (index + 1) * angle;

        const x1 = RADIUS + RADIUS * Math.cos(start);
        const y1 = RADIUS + RADIUS * Math.sin(start);
        const x2 = RADIUS + RADIUS * Math.cos(end);
        const y2 = RADIUS + RADIUS * Math.sin(end);

        return `M${RADIUS},${RADIUS} L${x1},${y1} A${RADIUS},${RADIUS} 0 0,1 ${x2},${y2} Z`;
    };

    const handleResult = () => {
        try {
            setSpinning(false);
            // Mock result: 100 coins
            addCoins(100, 'Wheel Spin');
            setCooldown('wheel');
            setAvailable(false);
            Alert.alert("WINNER!", "You won 100 Coins!");
        } catch (error) {
            console.error('Error handling wheel result:', error);
            setSpinning(false);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const spin = () => {
        if (!available || spinning) return;

        try {
            setSpinning(true);
            const randomRotation = 360 * 5 + Math.random() * 360;
            rotation.value = withTiming(randomRotation, {
                duration: 4000,
                easing: Easing.out(Easing.cubic),
            }, (finished) => {
                if (finished) {
                    runOnJS(handleResult)();
                }
            });
        } catch (error) {
            console.error('Error spinning wheel:', error);
            setSpinning(false);
            Alert.alert("Error", "Failed to spin wheel. Please try again.");
        }
    };

    return (
        <Container>
            <View style={styles.center}>
                {!available && timeLeft && (
                    <View style={styles.cooldownContainer}>
                        <Clock size={16} color={Colors.danger} />
                        <Text style={styles.cooldownText}>Next Spin in {timeLeft}</Text>
                    </View>
                )}

                <View style={[styles.wheelContainer, !available && { opacity: 0.5 }]}>
                    <View style={styles.arrowContainer}>
                        <View style={styles.arrow} />
                    </View>

                    <Animated.View style={[styles.wheel, animatedStyle]}>
                        <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                            <G>
                                {SEGMENTS.map((seg, i) => {
                                    const angle = (360 / SEGMENTS.length) * i + (360 / SEGMENTS.length) / 2;
                                    const textRadius = RADIUS * 0.7;
                                    const textAngle = (i * (2 * Math.PI / SEGMENTS.length)) + ((2 * Math.PI / SEGMENTS.length) / 2);
                                    const tx = RADIUS + textRadius * Math.cos(textAngle);
                                    const ty = RADIUS + textRadius * Math.sin(textAngle);

                                    return (
                                        <G key={i}>
                                            <Path
                                                d={createSector(i, SEGMENTS.length)}
                                                fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                                                stroke="#1a1a1a"
                                                strokeWidth="2"
                                            />
                                            <SvgText
                                                x={tx}
                                                y={ty}
                                                fill="white"
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                                fontSize="14"
                                                fontWeight="bold"
                                                transform={`rotate(${angle}, ${tx}, ${ty})`}
                                            >
                                                {seg}
                                            </SvgText>
                                        </G>
                                    );
                                })}
                            </G>
                        </Svg>
                    </Animated.View>
                </View>

                <SafeButton
                    title={spinning ? "SPINNING..." : available ? "SPIN NOW" : "COOLDOWN"}
                    onPress={spin}
                    disabled={spinning || !available}
                    variant={available ? "accent" : "secondary"}
                    style={{ width: '80%', marginTop: 20, height: 56 }}
                />
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        paddingTop: 20,
        flex: 1,
    },
    cooldownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 10,
    },
    cooldownText: {
        color: Colors.red,
        fontWeight: 'bold',
    },
    wheelContainer: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    wheel: {
        width: SIZE,
        height: SIZE,
    },
    arrowContainer: {
        position: 'absolute',
        top: -20,
        zIndex: 10,
        left: SIZE / 2 - 15,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 30,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    }
});
