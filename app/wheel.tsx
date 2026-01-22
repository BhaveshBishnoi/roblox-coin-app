import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';

const SEGMENTS = ['10', '50', '100', 'JACKPOT', '20', '500', '5', 'LOSE'];
const WHEEL_COLORS = [Colors.red, Colors.secondary, Colors.primary, Colors.accent, Colors.purple, '#FF8800', '#00D632', '#444'];
const SIZE = Dimensions.get('window').width * 0.8;
const RADIUS = SIZE / 2;

export default function Wheel() {
    const rotation = useSharedValue(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const createSector = (index: number, total: number) => {
        const angle = 2 * Math.PI / total;
        const start = index * angle;
        const end = (index + 1) * angle;

        // Adjust angles to start from top (subtract PI/2)? standard is right (0).
        // Let's just use standard and rotate the whole wheel if needed.

        const x1 = RADIUS + RADIUS * Math.cos(start);
        const y1 = RADIUS + RADIUS * Math.sin(start);
        const x2 = RADIUS + RADIUS * Math.cos(end);
        const y2 = RADIUS + RADIUS * Math.sin(end);

        // Large arc flag is 0 because 8 segments < 180 deg
        return `M${RADIUS},${RADIUS} L${x1},${y1} A${RADIUS},${RADIUS} 0 0,1 ${x2},${y2} Z`;
    };

    const handleResult = () => {
        setSpinning(false);
        // Calculate which segment is at the arrow (Top, 270deg or -90deg)
        // For now just random mock
        setResult("100 COINS");
    };

    const spin = () => {
        setResult(null);
        setSpinning(true);
        const randomRotation = 360 * 5 + Math.random() * 360;
        rotation.value = withTiming(randomRotation, {
            duration: 4000,
            easing: Easing.out(Easing.cubic),
        }, (finished) => {
            if (finished) runOnJS(handleResult)();
        });
    };

    return (
        <Container>
            <View style={styles.center}>
                <Title>LUCKY WHEEL</Title>

                <View style={styles.wheelContainer}>
                    {/* Arrow Indicator */}
                    <View style={styles.arrowContainer}>
                        <View style={styles.arrow} />
                    </View>

                    <Animated.View style={[styles.wheel, animatedStyle]}>
                        <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                            <G>
                                {SEGMENTS.map((seg, i) => {
                                    const angle = (360 / SEGMENTS.length) * i + (360 / SEGMENTS.length) / 2;
                                    // Text Position
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
                                                transform={`rotate(${angle}, ${tx}, ${ty})`} // Rotate text to match spoke
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

                {result && <Text style={styles.resultText}>You won {result}!</Text>}

                <SafeButton
                    title={spinning ? "SPINNING..." : "SPIN NOW"}
                    onPress={spin}
                    disabled={spinning}
                    variant="accent"
                    style={{ width: '80%', marginTop: 20 }}
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
        top: -20, // Move arrow slightly outside
        zIndex: 10,
        // Center horizontally
        left: SIZE / 2 - 15,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 30, // Pointing down
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    resultText: {
        fontSize: 24,
        color: Colors.accent,
        fontWeight: 'bold',
        marginTop: 20,
    }
});
