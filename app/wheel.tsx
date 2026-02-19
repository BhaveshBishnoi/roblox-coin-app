import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, Pressable } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Text as SvgText, G, Circle } from 'react-native-svg';
import { useCoins } from '../context/CoinContext';
import { Clock, ChevronLeft, Zap, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const SEGMENTS = ['10', '50', '100', 'JACKPOT', '20', '500', '5', 'LOSE'];
const WHEEL_COLORS = [
    '#10B981', // 10  — green
    '#6366F1', // 50  — indigo
    '#F59E0B', // 100 — amber
    '#EC4899', // JACKPOT – pink
    '#06B6D4', // 20  — cyan
    '#EF4444', // 500 – red
    '#8B5CF6', // 5   — purple
    '#334155', // LOSE – dark slate
];

const { width } = Dimensions.get('window');
const SIZE = Math.min(width * 0.82, 320);
const RADIUS = SIZE / 2;

export default function Wheel() {
    const router = useRouter();
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const rotation = useSharedValue(0);
    const [spinning, setSpinning] = useState(false);
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const isMounted = React.useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        const updateStatus = () => {
            try {
                const isReady = checkCooldown('wheel', 3);
                if (isMounted.current) {
                    setAvailable(isReady);
                    setTimeLeft(isReady ? null : (getRemainingTime('wheel', 3) || '0h 0m'));
                }
            } catch (e) {
                if (isMounted.current) setAvailable(false);
            }
        };
        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [checkCooldown, getRemainingTime]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const createSector = (index: number, total: number) => {
        const angle = (2 * Math.PI) / total;
        const start = index * angle;
        const end = (index + 1) * angle;
        const x1 = RADIUS + RADIUS * Math.cos(start);
        const y1 = RADIUS + RADIUS * Math.sin(start);
        const x2 = RADIUS + RADIUS * Math.cos(end);
        const y2 = RADIUS + RADIUS * Math.sin(end);
        return `M${RADIUS},${RADIUS} L${x1},${y1} A${RADIUS},${RADIUS} 0 0,1 ${x2},${y2} Z`;
    };

    const calculateWinningSegment = (finalRotation: number) => {
        const normalizedRotation = finalRotation % 360;
        const segmentAngle = 360 / SEGMENTS.length;
        const adjustedRotation = (360 - normalizedRotation + segmentAngle / 2) % 360;
        return SEGMENTS[Math.floor(adjustedRotation / segmentAngle) % SEGMENTS.length];
    };

    const handleResult = (finalRotation: number) => {
        if (!isMounted.current) return;
        const seg = calculateWinningSegment(finalRotation);
        setSpinning(false);
        setCooldown('wheel');
        setAvailable(false);

        if (seg === 'LOSE') {
            Alert.alert('😢 Better Luck Next Time!', 'You didn\'t win this time. Try again in 3 hours!');
        } else if (seg === 'JACKPOT') {
            addCoins(1000, 'Wheel Jackpot');
            Alert.alert('🎉 JACKPOT!', 'Amazing! You won 1000 Coins!');
        } else {
            const amount = parseInt(seg, 10);
            addCoins(amount, 'Wheel Spin');
            Alert.alert('🎊 WINNER!', `Congratulations! You won ${amount} Coins!`);
        }
    };

    const spin = () => {
        if (!available || spinning) return;
        try {
            setSpinning(true);
            const fullSpins = 5 + Math.floor(Math.random() * 3);
            const randomAngle = Math.random() * 360;
            const finalRotation = fullSpins * 360 + randomAngle;
            rotation.value = withTiming(finalRotation, {
                duration: 4000,
                easing: Easing.out(Easing.cubic),
            }, (finished) => {
                if (finished && isMounted.current) runOnJS(handleResult)(finalRotation);
            });
        } catch (e) {
            if (isMounted.current) setSpinning(false);
            Alert.alert('Error', 'Failed to spin. Please try again.');
        }
    };

    const prizes = SEGMENTS.map((seg, i) => ({ label: seg, color: WHEEL_COLORS[i] }));

    return (
        <Container safeArea={false}>
            {/* Dark Background */}
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
                <Text style={styles.headerTitle}>Lucky Wheel</Text>
                <View style={styles.headerBadge}>
                    <Trophy size={13} color="#F59E0B" strokeWidth={2.5} />
                    <Text style={styles.headerBadgeText}>500</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces
            >
                {/* Cooldown / Ready Banner */}
                {!available && timeLeft ? (
                    <View style={styles.cooldownBanner}>
                        <LinearGradient
                            colors={['rgba(239,68,68,0.15)', 'rgba(220,38,38,0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.cooldownBannerInner}
                        >
                            <Clock size={18} color="#F87171" strokeWidth={2} />
                            <View style={styles.cooldownTexts}>
                                <Text style={styles.cooldownLabel}>Next spin in</Text>
                                <Text style={styles.cooldownTimer}>{timeLeft}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                ) : available ? (
                    <View style={styles.readyBanner}>
                        <LinearGradient
                            colors={['rgba(16,185,129,0.15)', 'rgba(5,150,105,0.08)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.readyBannerInner}
                        >
                            <Zap size={18} color="#10B981" strokeWidth={2.5} fill="#10B981" />
                            <Text style={styles.readyText}>Your spin is ready — give it a whirl!</Text>
                        </LinearGradient>
                    </View>
                ) : null}

                {/* Wheel Container */}
                <View style={styles.wheelSection}>
                    {/* Outer glow ring */}
                    <View style={[
                        styles.wheelGlowRing,
                        spinning && styles.wheelGlowRingActive,
                        !available && styles.wheelGlowRingLocked,
                    ]} />

                    {/* Arrow pointer */}
                    <View style={styles.arrowWrap}>
                        <View style={styles.arrowShadow} />
                        <View style={styles.arrow} />
                    </View>

                    {/* SVG Wheel */}
                    <Animated.View
                        style={[
                            styles.wheel,
                            animatedStyle,
                            !available && { opacity: 0.55 },
                        ]}
                    >
                        <Svg height={SIZE} width={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                            <G>
                                {SEGMENTS.map((seg, i) => {
                                    const angle =
                                        (360 / SEGMENTS.length) * i + (360 / SEGMENTS.length) / 2;
                                    const textRadius = RADIUS * 0.68;
                                    const textAngle =
                                        (i * (2 * Math.PI / SEGMENTS.length)) +
                                        ((2 * Math.PI / SEGMENTS.length) / 2);
                                    const tx = RADIUS + textRadius * Math.cos(textAngle);
                                    const ty = RADIUS + textRadius * Math.sin(textAngle);
                                    return (
                                        <G key={i}>
                                            <Path
                                                d={createSector(i, SEGMENTS.length)}
                                                fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                                                stroke="#0A0A1A"
                                                strokeWidth="2.5"
                                            />
                                            <SvgText
                                                x={tx}
                                                y={ty}
                                                fill="rgba(255,255,255,0.95)"
                                                textAnchor="middle"
                                                alignmentBaseline="middle"
                                                fontSize={seg === 'JACKPOT' || seg === 'LOSE' ? '10' : '13'}
                                                fontWeight="bold"
                                                transform={`rotate(${angle}, ${tx}, ${ty})`}
                                            >
                                                {seg}
                                            </SvgText>
                                        </G>
                                    );
                                })}
                                {/* Center hub */}
                                <Circle
                                    cx={RADIUS}
                                    cy={RADIUS}
                                    r={RADIUS * 0.12}
                                    fill="#0A0A1A"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="2"
                                />
                            </G>
                        </Svg>
                    </Animated.View>
                </View>

                {/* Spin Button */}
                <SafeButton
                    title={spinning ? '🌀  SPINNING...' : available ? '🎯  SPIN THE WHEEL' : '🔒  LOCKED'}
                    onPress={spin}
                    disabled={spinning || !available}
                    variant={available ? 'accent' : 'secondary'}
                    style={styles.spinBtn}
                />

                {/* Prize Legend */}
                <View style={styles.legendSection}>
                    <Text style={styles.legendTitle}>Prizes</Text>
                    <View style={styles.legendGrid}>
                        {prizes.map((prize) => (
                            <View key={prize.label} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: prize.color }]} />
                                <Text style={styles.legendLabel}>
                                    {prize.label === 'JACKPOT' ? '🏆 Jackpot' :
                                        prize.label === 'LOSE' ? '😢 Miss' :
                                            `🪙 ${prize.label}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoEmoji}>ℹ️</Text>
                    <Text style={styles.infoText}>
                        Spin once every 3 hours. Land on JACKPOT to win 1,000 coins!
                    </Text>
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
        backgroundColor: '#F59E0B',
    },
    blobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#6366F1',
    },

    /* Header */
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(245,158,11,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.3)',
    },
    headerBadgeText: {
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: '800',
    },

    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },

    /* Banners */
    cooldownBanner: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.25)',
    },
    cooldownBannerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    cooldownTexts: {
        flex: 1,
    },
    cooldownLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    cooldownTimer: {
        fontSize: 22,
        fontWeight: '900',
        color: '#F87171',
        letterSpacing: -0.5,
        fontVariant: ['tabular-nums'],
    },
    readyBanner: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.25)',
    },
    readyBannerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    readyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
        flex: 1,
    },

    /* Wheel */
    wheelSection: {
        width: SIZE + 28,
        height: SIZE + 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 4,
    },
    wheelGlowRing: {
        position: 'absolute',
        width: SIZE + 24,
        height: SIZE + 24,
        borderRadius: (SIZE + 24) / 2,
        borderWidth: 3,
        borderColor: 'rgba(245,158,11,0.25)',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    wheelGlowRingActive: {
        borderColor: 'rgba(245,158,11,0.55)',
        shadowOpacity: 0.6,
    },
    wheelGlowRingLocked: {
        borderColor: 'rgba(255,255,255,0.07)',
        shadowOpacity: 0,
    },
    arrowWrap: {
        position: 'absolute',
        top: -4,
        zIndex: 20,
        alignItems: 'center',
    },
    arrowShadow: {
        position: 'absolute',
        top: 4,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderTopWidth: 28,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(0,0,0,0.4)',
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 14,
        borderRightWidth: 14,
        borderTopWidth: 28,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
    },
    wheel: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },

    /* Spin Button */
    spinBtn: {
        width: '88%',
        height: 58,
        marginTop: 16,
        marginBottom: 24,
    },

    /* Prize Legend */
    legendSection: {
        width: '100%',
        marginBottom: 16,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        marginBottom: 12,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        width: (width - 32 - 10) / 2 - 5,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        flexShrink: 0,
    },
    legendLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: -0.2,
    },

    /* Info Card */
    infoCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    infoEmoji: {
        fontSize: 22,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: 'rgba(255,255,255,0.45)',
        fontWeight: '500',
        lineHeight: 20,
    },
});
