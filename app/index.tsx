import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing, ScrollView, ImageStyle, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { AppHeader } from '../components/AppHeader';
import { useCoins } from '../context/CoinContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../components/AdBanner';

const ICONS = {
    daily: require('../assets/icons/calender.png'),
    wheel: require('../assets/icons/target.png'),
    scratch: require('../assets/icons/gift.png'),
    quiz: require('../assets/icons/minecraft.png'),
    flip: require('../assets/icons/fire.png'),
    tips: require('../assets/icons/crown.png'),
    wallet: require('../assets/icons/coin.png'),
    settings: require('../assets/icons/target.png'),
    coin: require('../assets/icons/coin.png')
};

const { width } = Dimensions.get('window');

export default function Home() {
    const router = useRouter();
    const { balance } = useCoins();

    const coinScale = useRef(new Animated.Value(1)).current;
    const heroFloat = useRef(new Animated.Value(0)).current;

    const [cardAnimations] = useState(
        Array(8).fill(0).map(() => ({
            scale: useRef(new Animated.Value(0)).current,
            opacity: useRef(new Animated.Value(0)).current,
        }))
    );

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(coinScale, { toValue: 1.12, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(coinScale, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(heroFloat, { toValue: -4, duration: 2800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(heroFloat, { toValue: 0, duration: 2800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
            ])
        ).start();

        cardAnimations.forEach((anim, index) => {
            Animated.parallel([
                Animated.timing(anim.scale, { toValue: 1, duration: 400, delay: index * 60, useNativeDriver: true, easing: Easing.out(Easing.back(1.1)) }),
                Animated.timing(anim.opacity, { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true })
            ]).start();
        });
    }, []);

    const handleNavigation = async (route: string) => {
        try {
            await WebBrowser.openBrowserAsync('https://games.biographydata.org/');
        } catch (error) {
            console.error('Failed to open browser:', error);
        }
        router.push(route as any);
    };

    const features = [
        { id: 'daily', title: 'Daily Coins', icon: ICONS.daily, route: '/daily', gradient: ['#10B981', '#059669'] as const },
        { id: 'wheel', title: 'Lucky Wheel', icon: ICONS.wheel, route: '/wheel', gradient: ['#F59E0B', '#D97706'] as const },
        { id: 'scratch', title: 'Scratch Card', icon: ICONS.scratch, route: '/scratch', gradient: ['#6366F1', '#4F46E5'] as const },
        { id: 'quiz', title: 'Roblox Quiz', icon: ICONS.quiz, route: '/quiz', gradient: ['#8B5CF6', '#7C3AED'] as const },
        { id: 'flip', title: 'Flip Cards', icon: ICONS.flip, route: '/flip', gradient: ['#EF4444', '#DC2626'] as const },
        { id: 'tips', title: 'Tips & Tricks', icon: ICONS.tips, route: '/tips', gradient: ['#F59E0B', '#D97706'] as const },
        { id: 'wallet', title: 'My Wallet', icon: ICONS.wallet, route: '/wallet', gradient: ['#06B6D4', '#0891B2'] as const },
        { id: 'settings', title: 'Settings', icon: ICONS.settings, route: '/settings', gradient: ['#6366F1', '#4F46E5'] as const },
    ];

    return (
        <Container safeArea={false}>
            <LinearGradient colors={['#0A0A1A', '#0D0D24', '#0A0A1A']} style={StyleSheet.absoluteFillObject} />

            <AppHeader title="RBX Calc & Rewards" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Hero Card */}
                <Animated.View style={{ transform: [{ translateY: heroFloat }] }}>
                    <LinearGradient
                        colors={['#1E293B', '#334155', '#475569']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>Get Free Robux</Text>
                            <Text style={styles.heroSub}>Play • Complete tasks • Earn</Text>
                            <SafeButton
                                title="💰 Robux Calculator"
                                onPress={() => handleNavigation('/calculator')}
                                variant="surface"
                                style={styles.calculatorButton}
                                textStyle={{ fontSize: 13, color: '#0F172A' }}
                            />
                        </View>
                        <Animated.View style={[styles.heroCoinContainer, { transform: [{ scale: coinScale }] }]}>
                            <Image source={ICONS.coin} style={styles.heroCoinImage as ImageStyle} />
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

                {/* Ad Banner */}
                <AdBanner />

                {/* Section Title */}
                <Text style={styles.sectionTitle}>Earn Coins</Text>

                {/* Grid */}
                <View style={styles.grid}>
                    {features.map((feature, index) => (
                        <Animated.View
                            key={feature.id}
                            style={[
                                styles.gridItem,
                                {
                                    opacity: cardAnimations[index].opacity,
                                    transform: [{ scale: cardAnimations[index].scale }]
                                }
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => handleNavigation(feature.route)}
                                style={styles.cardContainer}
                            >
                                <LinearGradient
                                    colors={feature.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardShine} />
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardIconHighlight}>
                                            <Image source={feature.icon} style={styles.cardIcon} resizeMode="contain" />
                                        </View>
                                        <Text style={styles.cardText}>{feature.title}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
}

const CARD_GAP = 8;
const H_PAD = 10;
const CARD_WIDTH = (width - H_PAD * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: H_PAD,
        paddingTop: 70,
        paddingBottom: 16,
    },

    // Hero
    hero: {
        height: 140,
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroContent: {
        flex: 1,
        zIndex: 1,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    heroSub: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 10,
    },
    calculatorButton: {
        marginVertical: 0,
        minHeight: 36,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    heroCoinContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    heroCoinImage: {
        width: 70,
        height: 70,
    } as ImageStyle,

    // Section
    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        marginBottom: 8,
        marginTop: 2,
    },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CARD_GAP,
    },
    gridItem: {
        width: CARD_WIDTH,
    },
    cardContainer: {
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardGradient: {
        borderRadius: 14,
        overflow: 'hidden',
        paddingVertical: 14,
        paddingHorizontal: 10,
    },
    cardShine: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    cardContent: {
        alignItems: 'center',
        gap: 8,
    },
    cardIconHighlight: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    cardIcon: {
        width: 30,
        height: 30,
    } as ImageStyle,
    cardText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
});