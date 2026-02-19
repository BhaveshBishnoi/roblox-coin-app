import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Container } from '../components/Container';
import { useAdAction } from '../hooks/useAdAction';
import { Calculator, DollarSign, IndianRupee, Bitcoin, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AdBanner } from '../components/AdBanner';

const { width } = Dimensions.get('window');

export default function CalculatorHub() {
    const router = useRouter();
    const triggerAd = useAdAction();

    const handleNavigation = async (route: string) => {
        try {
            await WebBrowser.openBrowserAsync('https://games.biographydata.org/');
        } catch (error) {
            console.error('Failed to open browser:', error);
        }
        triggerAd(() => router.push(route as any));
    };

    const calculators = [
        {
            id: 'usd-to-robux',
            title: 'USD → Robux',
            description: 'Convert US Dollars to Robux',
            icon: DollarSign,
            gradient: ['#059669', '#10B981'] as const,
            route: '/calculators/usd-to-robux',
        },
        {
            id: 'inr-to-robux',
            title: 'INR → Robux',
            description: 'Convert Indian Rupees to Robux',
            icon: IndianRupee,
            gradient: ['#D97706', '#F59E0B'] as const,
            route: '/calculators/inr-to-robux',
        },
        {
            id: 'robux-to-usd',
            title: 'Robux → USD',
            description: 'Convert Robux to US Dollars',
            icon: DollarSign,
            gradient: ['#7C3AED', '#A855F7'] as const,
            route: '/calculators/robux-to-usd',
        },
        {
            id: 'robux-to-inr',
            title: 'Robux → INR',
            description: 'Convert Robux to Rupees',
            icon: IndianRupee,
            gradient: ['#DC2626', '#EF4444'] as const,
            route: '/calculators/robux-to-inr',
        },
        {
            id: 'btc-to-robux',
            title: 'BTC → Robux',
            description: 'Convert Bitcoin to Robux',
            icon: Bitcoin,
            gradient: ['#EA580C', '#F97316'] as const,
            route: '/calculators/btc-to-robux',
        },
        {
            id: 'robux-to-btc',
            title: 'Robux → BTC',
            description: 'Convert Robux to Bitcoin',
            icon: Bitcoin,
            gradient: ['#0891B2', '#06B6D4'] as const,
            route: '/calculators/robux-to-btc',
        },
        {
            id: 'obc-to-robux',
            title: 'OBC → Robux',
            description: 'Outrageous Builders Club',
            icon: TrendingUp,
            gradient: ['#9333EA', '#A855F7'] as const,
            route: '/calculators/obc-to-robux',
        },
        {
            id: 'bc-to-robux',
            title: 'BC → Robux',
            description: 'Builders Club to Robux',
            icon: TrendingUp,
            gradient: ['#DB2777', '#EC4899'] as const,
            route: '/calculators/bc-to-robux',
        },
    ];

    return (
        <Container safeArea={false}>
            {/* Background */}
            <LinearGradient
                colors={['#0A0A1A', '#0D0D24', '#0A0A1A']}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.blob, styles.blobTR]} />
            <View style={[styles.blob, styles.blobBL]} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Calculators</Text>
                <View style={styles.headerBadge}>
                    <Calculator size={14} color="#10B981" strokeWidth={2.5} />
                    <Text style={styles.headerBadgeText}>{calculators.length}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero strip */}
                <LinearGradient
                    colors={['#064E3B', '#065F46', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroStrip}
                >
                    <View style={styles.heroShine} />
                    <View style={styles.heroIconRing}>
                        <Calculator size={28} color="#FFF" strokeWidth={2} />
                    </View>
                    <View style={styles.heroText}>
                        <Text style={styles.heroTitle}>Robux Calculators</Text>
                        <Text style={styles.heroSub}>Instant currency conversions</Text>
                    </View>
                </LinearGradient>

                {/* Calculator list */}
                <View style={styles.list}>
                    {calculators.map((calc, i) => (
                        <TouchableOpacity
                            key={calc.id}
                            activeOpacity={0.75}
                            onPress={() => handleNavigation(calc.route)}
                            style={styles.row}
                        >
                            {/* Icon */}
                            <LinearGradient
                                colors={calc.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.rowIcon}
                            >
                                <calc.icon size={22} color="#FFF" strokeWidth={2} />
                            </LinearGradient>

                            {/* Text */}
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{calc.title}</Text>
                                <Text style={styles.rowSub}>{calc.description}</Text>
                            </View>

                            {/* Arrow */}
                            <View style={[styles.arrowBox, { backgroundColor: `${calc.gradient[1]}18` }]}>
                                <ChevronRight size={16} color={calc.gradient[1]} strokeWidth={2.5} />
                            </View>

                            {/* Divider (skip last) */}
                            {i < calculators.length - 1 && <View style={styles.rowDivider} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Note */}
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
    blob: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        opacity: 0.08,
    },
    blobTR: {
        top: -60,
        right: -60,
        backgroundColor: '#10B981',
    },
    blobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#6366F1',
    },
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
        backgroundColor: 'rgba(16,185,129,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
    },
    headerBadgeText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '800',
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    heroStrip: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    heroShine: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    heroIconRing: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
        flexShrink: 0,
    },
    heroText: {
        flex: 1,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.4,
        marginBottom: 3,
    },
    heroSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '500',
    },
    list: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    rowIcon: {
        width: 46,
        height: 46,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowText: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    rowSub: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.4)',
    },
    arrowBox: {
        width: 30,
        height: 30,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowDivider: {
        position: 'absolute',
        bottom: 0,
        left: 76,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    noteCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        marginBottom: 16,
    },
    noteText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '500',
    },
});