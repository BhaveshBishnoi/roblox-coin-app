import React, { useEffect, useRef, useState } from 'react';
import {
    View, StyleSheet, Text, Image, Animated, Easing,
    ScrollView, ImageStyle, Dimensions, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { AppHeader } from '../components/AppHeader';
import { useCoins } from '../context/CoinContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../components/AdBanner';
import { useOpenGames } from '../hooks/useOpenGames';

const ICONS = {
    daily: require('../assets/icons/calender.png'),
    wheel: require('../assets/icons/target.png'),
    scratch: require('../assets/icons/gift.png'),
    quiz: require('../assets/icons/minecraft.png'),
    flip: require('../assets/icons/fire.png'),
    tips: require('../assets/icons/crown.png'),
    wallet: require('../assets/icons/coin.png'),
    settings: require('../assets/icons/target.png'),
    coin: require('../assets/icons/coin.png'),
};

const { width } = Dimensions.get('window');

const FEATURES = [
    { id: 'daily', title: 'Daily Coins', icon: ICONS.daily, route: '/daily', gradient: ['#10B981', '#059669'] as const },
    { id: 'wheel', title: 'Lucky Wheel', icon: ICONS.wheel, route: '/wheel', gradient: ['#F59E0B', '#D97706'] as const },
    { id: 'scratch', title: 'Scratch Card', icon: ICONS.scratch, route: '/scratch', gradient: ['#6366F1', '#4F46E5'] as const },
    { id: 'quiz', title: 'Roblox Quiz', icon: ICONS.quiz, route: '/quiz', gradient: ['#8B5CF6', '#7C3AED'] as const },
    { id: 'flip', title: 'Flip Cards', icon: ICONS.flip, route: '/flip', gradient: ['#EF4444', '#DC2626'] as const },
    { id: 'tips', title: 'Tips & Tricks', icon: ICONS.tips, route: '/tips', gradient: ['#F59E0B', '#D97706'] as const },
    { id: 'wallet', title: 'My Wallet', icon: ICONS.wallet, route: '/wallet', gradient: ['#06B6D4', '#0891B2'] as const },
    { id: 'settings', title: 'Settings', icon: ICONS.settings, route: '/settings', gradient: ['#6366F1', '#4F46E5'] as const },
];

export default function Home() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { balance, setStartupBrowserClosed } = useCoins();
    const openGames = useOpenGames();

    const coinScale = useRef(new Animated.Value(1)).current;
    const heroFloat = useRef(new Animated.Value(0)).current;

    const [cardAnimations] = useState(() =>
        FEATURES.map(() => ({
            scale: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }))
    );

    useEffect(() => {
        // Coin pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(coinScale, { toValue: 1.12, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(coinScale, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ])
        ).start();

        // Hero float
        Animated.loop(
            Animated.sequence([
                Animated.timing(heroFloat, { toValue: -4, duration: 2800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                Animated.timing(heroFloat, { toValue: 0, duration: 2800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
            ])
        ).start();

        // Staggered card entrance
        cardAnimations.forEach((anim, i) => {
            Animated.parallel([
                Animated.timing(anim.scale, { toValue: 1, duration: 400, delay: i * 60, useNativeDriver: true, easing: Easing.out(Easing.back(1.1)) }),
                Animated.timing(anim.opacity, { toValue: 1, duration: 300, delay: i * 60, useNativeDriver: true }),
            ]).start();
        });

        // Open games browser on fresh launch and then signal closure
        const initBrowser = async () => {
            setTimeout(async () => {
                await openGames();
                setStartupBrowserClosed(true);
            }, 500);
        };
        initBrowser();
    }, []);

    // Opens games URL in browser, then navigates to the feature route after closing
    const navigate = async (route: string) => {
        await openGames();
        router.push(route as any);
    };

    return (
        <Container safeArea={false}>
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header — has its own platform-aware safe area padding */}
            <AppHeader title="RBX Calc & Rewards" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 16 },
                ]}
                showsVerticalScrollIndicator={false}
                bounces
            >
                {/* ── Hero Card ── */}
                <Animated.View style={{ transform: [{ translateY: heroFloat }] }}>
                    <LinearGradient
                        colors={['#1E293B', '#334155', '#475569']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.heroShine} />
                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>Get Robux Coins</Text>
                            <Text style={styles.heroSub}>Play • Complete tasks • Earn</Text>
                            <SafeButton
                                title="💰 Robux Calculator"
                                onPress={() => navigate('/calculator')}
                                variant="surface"
                                style={styles.calcBtn}
                                textStyle={{ fontSize: 13, color: '#fff' }}
                            />
                        </View>
                        <Animated.View style={[styles.heroCoinWrap, { transform: [{ scale: coinScale }] }]}>
                            <Image source={ICONS.coin} style={styles.heroCoinImage as ImageStyle} />
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

                {/* ── Ad Banner ── */}
                <AdBanner />

                {/* ── Section Title ── */}
                <Text style={styles.sectionTitle}>Earn Coins</Text>

                {/* ── Feature Grid ── */}
                <View style={styles.grid}>
                    {FEATURES.map((feature, index) => (
                        <Animated.View
                            key={feature.id}
                            style={[
                                styles.gridItem,
                                {
                                    opacity: cardAnimations[index].opacity,
                                    transform: [{ scale: cardAnimations[index].scale }],
                                },
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.82}
                                onPress={() => navigate(feature.route)}
                                style={styles.card}
                            >
                                <LinearGradient
                                    colors={feature.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardShine} />
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardIconWrap}>
                                            <Image
                                                source={feature.icon}
                                                style={styles.cardIcon as ImageStyle}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <Text style={styles.cardLabel}>{feature.title}</Text>
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

const CARD_GAP = 10;
const H_PAD = 12;
const CARD_WIDTH = (width - H_PAD * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: H_PAD,
        paddingTop: 12,
    },

    /* Hero */
    hero: {
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    heroShine: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    heroContent: {
        flex: 1,
        zIndex: 1,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 21,
        fontWeight: '900',
        letterSpacing: -0.5,
        marginBottom: 3,
    },
    heroSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 12,
    },
    calcBtn: {
        marginVertical: 0,
        minHeight: 30,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        backgroundColor: '#079364ff',
    },
    heroCoinWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    heroCoinImage: {
        width: 72,
        height: 72,
    } as ImageStyle,

    /* Section */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        marginBottom: 10,
        marginTop: 4,
    },

    /* Grid */
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CARD_GAP,
    },
    gridItem: {
        width: CARD_WIDTH,
    },
    card: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 5,
    },
    cardGradient: {
        borderRadius: 16,
        overflow: 'hidden',
        paddingVertical: 18,
        paddingHorizontal: 10,
    },
    cardShine: {
        position: 'absolute',
        top: -28,
        left: -28,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.14)',
    },
    cardContent: {
        alignItems: 'center',
        gap: 10,
    },
    cardIconWrap: {
        width: 54,
        height: 54,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.28)',
    },
    cardIcon: {
        width: 30,
        height: 30,
    } as ImageStyle,
    cardLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
});