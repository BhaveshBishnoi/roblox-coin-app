import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, TrendingUp } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface CoinRewardPopupProps {
    visible: boolean;
    amount: number;
    source: string;
    onClose: () => void;
}

export function CoinRewardPopup({ visible, amount, source, onClose }: CoinRewardPopupProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const coinRotate = useRef(new Animated.Value(0)).current;
    const sparkle1 = useRef(new Animated.Value(0)).current;
    const sparkle2 = useRef(new Animated.Value(0)).current;
    const sparkle3 = useRef(new Animated.Value(0)).current;
    const confetti1 = useRef(new Animated.Value(0)).current;
    const confetti2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            coinRotate.setValue(0);
            sparkle1.setValue(0);
            sparkle2.setValue(0);
            sparkle3.setValue(0);
            confetti1.setValue(0);
            confetti2.setValue(0);

            // Main popup animation
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Coin rotation
            Animated.loop(
                Animated.timing(coinRotate, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Sparkle animations
            const createSparkleAnimation = (sparkle: Animated.Value, delay: number) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.delay(delay),
                        Animated.timing(sparkle, {
                            toValue: 1,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                        Animated.timing(sparkle, {
                            toValue: 0,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            };

            createSparkleAnimation(sparkle1, 0);
            createSparkleAnimation(sparkle2, 200);
            createSparkleAnimation(sparkle3, 400);

            // Confetti animation
            Animated.parallel([
                Animated.timing(confetti1, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(confetti2, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const spin = coinRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const confetti1Y = confetti1.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 300],
    });

    const confetti2Y = confetti2.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 350],
    });

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['#10B981', '#059669', '#047857']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        {/* Confetti */}
                        <Animated.View
                            style={[
                                styles.confetti,
                                { left: '20%', transform: [{ translateY: confetti1Y }, { rotate: '45deg' }] },
                            ]}
                        >
                            <Sparkles size={20} color="#FCD34D" fill="#FCD34D" />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.confetti,
                                { right: '20%', transform: [{ translateY: confetti2Y }, { rotate: '-45deg' }] },
                            ]}
                        >
                            <Sparkles size={24} color="#FCA5A5" fill="#FCA5A5" />
                        </Animated.View>

                        {/* Sparkles */}
                        <Animated.View
                            style={[
                                styles.sparkle,
                                { top: 30, left: 30, opacity: sparkle1, transform: [{ scale: sparkle1 }] },
                            ]}
                        >
                            <Sparkles size={16} color="#FCD34D" fill="#FCD34D" />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.sparkle,
                                { top: 50, right: 40, opacity: sparkle2, transform: [{ scale: sparkle2 }] },
                            ]}
                        >
                            <Sparkles size={14} color="#FFF" fill="#FFF" />
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.sparkle,
                                { bottom: 60, left: 50, opacity: sparkle3, transform: [{ scale: sparkle3 }] },
                            ]}
                        >
                            <Sparkles size={18} color="#A7F3D0" fill="#A7F3D0" />
                        </Animated.View>

                        {/* Content */}
                        <View style={styles.content}>
                            {/* Success Badge */}
                            <View style={styles.badge}>
                                <TrendingUp size={16} color="#10B981" strokeWidth={3} />
                                <Text style={styles.badgeText}>SUCCESS!</Text>
                            </View>

                            {/* Coin Icon */}
                            <Animated.View
                                style={[
                                    styles.coinContainer,
                                    { transform: [{ rotate: spin }] },
                                ]}
                            >
                                <View style={styles.coinOuter}>
                                    <View style={styles.coinInner}>
                                        <Text style={styles.coinSymbol}>💰</Text>
                                    </View>
                                </View>
                            </Animated.View>

                            {/* Amount */}
                            <Text style={styles.title}>You Got</Text>
                            <Text style={styles.amount}>+{amount}</Text>
                            <Text style={styles.coinsLabel}>COINS</Text>

                            {/* Source */}
                            <View style={styles.sourceContainer}>
                                <View style={styles.sourceDivider} />
                                <Text style={styles.source}>{source}</Text>
                                <View style={styles.sourceDivider} />
                            </View>

                            {/* Tap to close hint */}
                            <Text style={styles.hint}>Tap anywhere to continue</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: width - 60,
        maxWidth: 360,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
    },
    gradient: {
        padding: 32,
        alignItems: 'center',
        position: 'relative',
    },
    confetti: {
        position: 'absolute',
        zIndex: 1,
    },
    sparkle: {
        position: 'absolute',
        zIndex: 2,
    },
    content: {
        alignItems: 'center',
        zIndex: 3,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    coinContainer: {
        marginBottom: 20,
    },
    coinOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    coinInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinSymbol: {
        fontSize: 56,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    amount: {
        fontSize: 64,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -2,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    coinsLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 3,
        marginBottom: 24,
        opacity: 0.95,
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sourceDivider: {
        width: 30,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    source: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
        opacity: 0.9,
        letterSpacing: 0.3,
    },
    hint: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        letterSpacing: 0.3,
    },
});
