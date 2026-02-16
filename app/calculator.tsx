import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/Container';
import { useAdAction } from '../hooks/useAdAction';
import { Colors } from '../constants/Colors';
import { Calculator, DollarSign, IndianRupee, Bitcoin, TrendingUp, Sparkles, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../components/AdBanner';

const { width } = Dimensions.get('window');

export default function CalculatorHub() {
    const router = useRouter();
    const triggerAd = useAdAction();

    const calculators = [
        {
            id: 'usd-to-robux',
            title: 'USD to Robux',
            description: 'Convert US Dollars',
            icon: DollarSign,
            gradient: ['#10B981', '#059669'] as const,
            route: '/calculators/usd-to-robux',
        },
        {
            id: 'inr-to-robux',
            title: 'INR to Robux',
            description: 'Convert Indian Rupees',
            icon: IndianRupee,
            gradient: ['#F59E0B', '#D97706'] as const,
            route: '/calculators/inr-to-robux',
        },
        {
            id: 'robux-to-usd',
            title: 'Robux to USD',
            description: 'Convert to Dollars',
            icon: DollarSign,
            gradient: ['#8B5CF6', '#7C3AED'] as const,
            route: '/calculators/robux-to-usd',
        },
        {
            id: 'robux-to-inr',
            title: 'Robux to INR',
            description: 'Convert to Rupees',
            icon: IndianRupee,
            gradient: ['#EF4444', '#DC2626'] as const,
            route: '/calculators/robux-to-inr',
        },
        {
            id: 'btc-to-robux',
            title: 'Bitcoin to Robux',
            description: 'Convert Bitcoin',
            icon: Bitcoin,
            gradient: ['#F97316', '#EA580C'] as const,
            route: '/calculators/btc-to-robux',
        },
        {
            id: 'robux-to-btc',
            title: 'Robux to Bitcoin',
            description: 'Convert to BTC',
            icon: Bitcoin,
            gradient: ['#06B6D4', '#0891B2'] as const,
            route: '/calculators/robux-to-btc',
        },
        {
            id: 'obc-to-robux',
            title: 'OBC to Robux',
            description: 'Outrageous Builders Club',
            icon: TrendingUp,
            gradient: ['#A855F7', '#9333EA'] as const,
            route: '/calculators/obc-to-robux',
        },
        {
            id: 'bc-to-robux',
            title: 'BC to Robux',
            description: 'Builders Club',
            icon: TrendingUp,
            gradient: ['#EC4899', '#DB2777'] as const,
            route: '/calculators/bc-to-robux',
        },
    ];

    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <Calculator size={32} color={Colors.primary} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.headerTitle}>Robux Calculators</Text>
                    <Text style={styles.headerSubtitle}>
                        Choose a calculator to convert between currencies
                    </Text>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Sparkles size={24} color={Colors.accent} fill={Colors.accent} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Quick & Easy</Text>
                        <Text style={styles.infoText}>
                            Select any calculator below for instant conversions
                        </Text>
                    </View>
                </View>

                {/* Calculator Grid */}
                <View style={styles.grid}>
                    {calculators.map((calc) => (
                        <TouchableOpacity
                            key={calc.id}
                            style={[
                                styles.cardWrapper,
                                { shadowColor: calc.gradient[0] } // Dynamic colored shadow
                            ]}
                            onPress={() => triggerAd(() => router.push(calc.route as any))}
                            activeOpacity={0.85}
                        >
                            <View style={styles.cardInner}>
                                {/* Top Section - Gradient */}
                                <LinearGradient
                                    colors={calc.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardTop}
                                >
                                    <View style={styles.iconCircle}>
                                        <calc.icon size={32} color="#FFFFFF" strokeWidth={2.5} />
                                    </View>

                                    {/* Decorative subtle overlay */}
                                    <View style={styles.cardOverlay} />
                                </LinearGradient>

                                {/* Bottom Section - Content */}
                                <View style={styles.cardBottom}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>
                                        {calc.title}
                                    </Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.cardDescription} numberOfLines={1}>
                                        {calc.description}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Note */}
                <View style={styles.noteCard}>
                    <Text style={styles.noteText}>
                        💡 All conversion rates are approximate and based on current Roblox pricing
                    </Text>
                </View>

                <AdBanner />
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: Colors.textSecondary,
        lineHeight: 16,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    cardWrapper: {
        width: (width - 56) / 2,
        height: 190,
        marginBottom: 8,
        borderRadius: 24,
        // Premium Shadow
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        backgroundColor: 'transparent', // Needed for shadow to work on wrapper
    },
    cardInner: {
        flex: 1,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    cardTop: {
        flex: 0.65, // 65% height
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glassy effect
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBottom: {
        flex: 0.35, // 35% height
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    divider: {
        width: 24,
        height: 2,
        backgroundColor: Colors.borderLight,
        marginVertical: 6,
        borderRadius: 1,
    },
    cardDescription: {
        fontSize: 11,
        fontWeight: '500',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    noteCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        alignItems: 'center',
    },
    noteText: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },
});

