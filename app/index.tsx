import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing, ScrollView, ImageStyle, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { AppHeader } from '../components/AppHeader';
import { useCoins } from '../context/CoinContext';
import { Colors } from '../constants/Colors';
import { TrendingUp, Users, Award, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

    const stats = [
        { label: 'Active Users', value: '50K+', icon: Users, color: '#10B981' },
        { label: 'Coins Earned', value: '10M+', icon: TrendingUp, color: '#F59E0B' },
        { label: 'Daily Rewards', value: '1000+', icon: Award, color: '#8B5CF6' },
    ];

    return (
        <Container safeArea={false}>
            <AppHeader title="Roblox Coins" />

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
                        {/* Animated sparkles */}
                        <Animated.View style={[styles.sparkle, {
                            top: 20,
                            left: 30,
                            opacity: sparkle1,
                            transform: [{ scale: sparkle1 }]
                        }]}>
                            <Sparkles size={16} color="#fbbf24" fill="#fbbf24" />
                        </Animated.View>
                        <Animated.View style={[styles.sparkle, {
                            top: 60,
                            left: 60,
                            opacity: sparkle2,
                            transform: [{ scale: sparkle2 }]
                        }]}>
                            <Sparkles size={12} color="#22c55e" fill="#22c55e" />
                        </Animated.View>
                        <Animated.View style={[styles.sparkle, {
                            top: 40,
                            right: 80,
                            opacity: sparkle3,
                            transform: [{ scale: sparkle3 }]
                        }]}>
                            <Sparkles size={14} color="#a855f7" fill="#a855f7" />
                        </Animated.View>

                        <View style={styles.heroGlow} />
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.15)', 'transparent']}
                            style={styles.heroGradientOverlay}
                        />

                        <View style={styles.heroContent}>
                            <View style={styles.heroBadge}>
                                <Sparkles size={12} color="#10B981" strokeWidth={2.5} />
                                <Text style={styles.heroBadgeText}>FREE ROBUX</Text>
                            </View>
                            <Text style={styles.heroTitle}>Get Free{'\n'}Roblox Coins</Text>
                            <Text style={styles.heroSub}>Play games • Complete tasks • Earn rewards</Text>
                        </View>

                        <Animated.View style={[styles.heroCoinContainer, { transform: [{ scale: coinScale }] }]}>
                            <Image source={ICONS.coin} style={styles.heroCoinImage as ImageStyle} />
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                                <stat.icon size={20} color={stat.color} strokeWidth={2.5} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

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
                            <SafeButton
                                onPress={() => router.push(feature.route as any)}
                                style={styles.card}
                                variant={feature.variant as any}
                            >
                                <LinearGradient
                                    colors={feature.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardShine} />
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardIconContainer}>
                                            <Image source={feature.icon} style={styles.cardIcon} resizeMode="contain" />
                                        </View>
                                        <Text style={styles.cardText} numberOfLines={2}>{feature.title}</Text>
                                    </View>
                                </LinearGradient>
                            </SafeButton>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 80,
        paddingBottom: 40,
    },
    welcomeSection: {
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    welcomeSub: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    hero: {
        height: 200,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        justifyContent: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    heroGlow: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    heroGradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sparkle: {
        position: 'absolute',
        zIndex: 2,
    },
    heroContent: {
        zIndex: 1,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    heroBadgeText: {
        color: '#10B981',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 38,
        letterSpacing: -0.8,
    },
    heroSub: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    heroCoinContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    heroCoinImage: {
        width: 80,
        height: 80,
        opacity: 0.9,
    } as ImageStyle,
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: Colors.borderLight,
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
        fontSize: 18,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    gridItem: {
        width: (width - 54) / 2,
        aspectRatio: 1,
    },
    card: {
        flex: 1,
        borderRadius: 18,
        marginVertical: 0,
        height: '100%',
        overflow: 'hidden',
    },
    cardGradient: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    cardShine: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderBottomLeftRadius: 100,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        gap: 12,
    },
    cardIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardIcon: {
        width: 40,
        height: 40,
    } as ImageStyle,
    cardText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 19,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    }
});
