import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing, ScrollView, ImageStyle, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
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
    const sparkle1 = useRef(new Animated.Value(0)).current;
    const sparkle2 = useRef(new Animated.Value(0)).current;
    const sparkle3 = useRef(new Animated.Value(0)).current;

    const [cardAnimations] = useState(
        Array(8).fill(0).map(() => ({
            scale: useRef(new Animated.Value(0)).current,
            opacity: useRef(new Animated.Value(0)).current,
        }))
    );

    useEffect(() => {
        // Coin pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(coinScale, {
                    toValue: 1.15,
                    duration: 1200,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(coinScale, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                })
            ])
        ).start();

        // Hero card float animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(heroFloat, {
                    toValue: -6,
                    duration: 2500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(heroFloat, {
                    toValue: 0,
                    duration: 2500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                })
            ])
        ).start();

        // Sparkle animations
        const createSparkleAnimation = (sparkle: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(sparkle, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.ease),
                    }),
                    Animated.timing(sparkle, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                        easing: Easing.in(Easing.ease),
                    })
                ])
            ).start();
        };

        createSparkleAnimation(sparkle1, 0);
        createSparkleAnimation(sparkle2, 400);
        createSparkleAnimation(sparkle3, 800);

        // Staggered card entrance animations
        cardAnimations.forEach((anim, index) => {
            Animated.parallel([
                Animated.timing(anim.scale, {
                    toValue: 1,
                    duration: 500,
                    delay: index * 80,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.back(1.2)),
                }),
                Animated.timing(anim.opacity, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 80,
                    useNativeDriver: true,
                })
            ]).start();
        });
    }, []);

    const handleNavigation = async (route: string) => {
        try {
            await WebBrowser.openBrowserAsync('https://games.biographydata.org/');
        } catch (error) {
            console.error('Failed to open browser:', error);
        }
        // Navigate after opening browser
        router.push(route as any);
    };

    const features = [
        { id: 'daily', title: 'Daily Coins', icon: ICONS.daily, route: '/daily', variant: 'primary', gradient: ['#10B981', '#059669'] as const },
        { id: 'wheel', title: 'Lucky Wheel', icon: ICONS.wheel, route: '/wheel', variant: 'accent', gradient: ['#F59E0B', '#D97706'] as const },
        { id: 'scratch', title: 'Scratch Card', icon: ICONS.scratch, route: '/scratch', variant: 'secondary', gradient: ['#6366F1', '#4F46E5'] as const },
        { id: 'quiz', title: 'Roblox Quiz', icon: ICONS.quiz, route: '/quiz', variant: 'purple', gradient: ['#8B5CF6', '#7C3AED'] as const },
        { id: 'flip', title: 'Flip Cards', icon: ICONS.flip, route: '/flip', variant: 'danger', gradient: ['#EF4444', '#DC2626'] as const },
        { id: 'tips', title: 'Tips & Tricks', icon: ICONS.tips, route: '/tips', variant: 'accent', gradient: ['#F59E0B', '#D97706'] as const },
        { id: 'wallet', title: 'My Wallet', icon: ICONS.wallet, route: '/wallet', variant: 'secondary', gradient: ['#06B6D4', '#0891B2'] as const },
        { id: 'settings', title: 'Settings', icon: ICONS.settings, route: '/settings', variant: 'purple', gradient: ['#6366F1', '#4F46E5'] as const },
    ];



    return (
        <Container safeArea={false}>
            {/* Dark Background */}
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.bgBlob, styles.bgBlobTR]} />
            <View style={[styles.bgBlob, styles.bgBlobBL]} />

            <AppHeader title="RBX Calc & Rewards" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}></Text>
                    <Text style={styles.welcomeSub}></Text>
                </View>

                {/* Hero Card */}
                <Animated.View style={{ transform: [{ translateY: heroFloat }] }}>
                    <LinearGradient
                        colors={['#1E293B', '#334155', '#475569']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.hero}
                    >
                        <View style={styles.heroGlow} />

                        <View style={styles.heroContent}>
                            <Text style={styles.heroTitle}>Get Free{'\n'}Robux</Text>
                            <Text style={styles.heroSub}>Play games • Complete tasks • Earn rewards</Text>

                            {/* Calculator Button */}
                            <SafeButton
                                title="💰 Robux Calculator"
                                onPress={() => handleNavigation('/calculator')}
                                variant="surface"
                                style={styles.calculatorButton}
                                textStyle={{ fontSize: 15, color: '#0F172A' }}
                            />
                        </View>

                        <Animated.View style={[styles.heroCoinContainer, { transform: [{ scale: coinScale }] }]}>
                            <Image source={ICONS.coin} style={styles.heroCoinImage as ImageStyle} />
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

                {/* Ad Banner 1 — After Hero */}
                <AdBanner />

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Earn Coins</Text>
                    <Text style={styles.sectionSubtitle}>Choose your favorite way to earn</Text>
                </View>

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
                                activeOpacity={0.9}
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

                {/* Ad Banner 2 — Bottom */}
                <AdBanner />
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    bgBlob: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        opacity: 0.08,
    },
    bgBlobTR: {
        top: -60,
        right: -60,
        backgroundColor: '#6366F1',
    },
    bgBlobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#10B981',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 14,
        paddingTop: 80,
        paddingBottom: 24,
    },
    welcomeSection: {
        marginBottom: 12,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    welcomeSub: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.5)',
    },
    hero: {
        minHeight: 190,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    heroGlow: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    heroContent: {
        zIndex: 1,
        width: '65%',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '900',
        lineHeight: 36,
        letterSpacing: -1,
        marginBottom: 6,
    },
    heroSub: {
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: -0.2,
        marginBottom: 14,
    },
    calculatorButton: {
        width: '100%',
        marginVertical: 0,
        minHeight: 48,           // reduced from 48
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    heroCoinContainer: {
        position: 'absolute',
        right: 8,
        bottom: 16,
        top: 16,
        justifyContent: 'center',
    },
    heroCoinImage: {
        width: 95,               // reduced from 110
        height: 95,
        opacity: 1,
    } as ImageStyle,
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
    },
    sectionHeader: {
        marginBottom: 12,
        paddingHorizontal: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.45)',
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,                 // reduced from 16
        marginBottom: 12,
    },
    gridItem: {
        width: (width - 40) / 2, // adjusted for new horizontal padding (14*2 + 12 gap)
        aspectRatio: 0.9,        // slightly taller ratio
    },
    cardContainer: {
        flex: 1,
        borderRadius: 20,        // reduced from 24
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 20,
        padding: 2,
        overflow: 'hidden',
    },
    cardShine: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        transform: [{ scaleX: 1.5 }],
    },
    cardContent: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,             // reduced from 20
    },
    cardIconHighlight: {
        width: 70,               // reduced from 70
        height: 70,
        borderRadius: 20,        // reduced from 20
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        marginTop: 6,
    },
    cardIcon: {
        width: 42,               // reduced from 42
        height: 42,
    } as ImageStyle,
    cardText: {
        fontSize: 16,            // reduced from 16
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: 8,         // reduced from 8
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    }
});