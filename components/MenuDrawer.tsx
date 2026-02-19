import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Home,
    Calendar,
    Target,
    Gift,
    Brain,
    Flame,
    Lightbulb,
    Wallet,
    Calculator,
    X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.76;

interface MenuDrawerProps {
    visible: boolean;
    onClose: () => void;
    slideAnim: Animated.Value;
}

const MENU_ITEMS = [
    { icon: Home, label: 'Home', route: '/', gradient: ['#059669', '#10B981'] as const },
    { icon: Calendar, label: 'Daily Coins', route: '/daily', gradient: ['#D97706', '#F59E0B'] as const },
    { icon: Target, label: 'Lucky Wheel', route: '/wheel', gradient: ['#EA580C', '#F97316'] as const },
    { icon: Gift, label: 'Scratch Card', route: '/scratch', gradient: ['#4F46E5', '#6366F1'] as const },
    { icon: Brain, label: 'Roblox Quiz', route: '/quiz', gradient: ['#7C3AED', '#A855F7'] as const },
    { icon: Flame, label: 'Flip Cards', route: '/flip', gradient: ['#DC2626', '#EF4444'] as const },
    { icon: Lightbulb, label: 'Tips & Tricks', route: '/tips', gradient: ['#D97706', '#F59E0B'] as const },
    { icon: Wallet, label: 'My Wallet', route: '/wallet', gradient: ['#0891B2', '#06B6D4'] as const },
    { icon: Calculator, label: 'Calculator', route: '/calculator', gradient: ['#059669', '#10B981'] as const },
];

export function MenuDrawer({ visible, onClose, slideAnim }: MenuDrawerProps) {
    const router = useRouter();

    const handleNavigate = (route: string) => {
        onClose();
        setTimeout(() => {
            router.push(route as any);
        }, 280);
    };

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
            </Animated.View>

            {/* Drawer panel */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [
                            {
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-DRAWER_WIDTH, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                {/* Dark glass background */}
                <View style={styles.drawerBg} />

                {/* Header */}
                <LinearGradient
                    colors={['#1E1B4B', '#312E81', '#4338CA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerShine} />
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>RBX Calc & Rewards</Text>
                        <Text style={styles.headerSub}>Earn Free Robux 🪙</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                        <X size={20} color="#fff" strokeWidth={2.5} />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Menu items */}
                <View style={styles.menuList}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => handleNavigate(item.route)}
                            activeOpacity={0.65}
                        >
                            <LinearGradient
                                colors={item.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.menuIconBox}
                            >
                                <item.icon size={18} color="#FFF" strokeWidth={2.5} />
                            </LinearGradient>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <View style={styles.menuChevron}>
                                <View style={styles.chevronLine} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerText}>Made with ❤️ for Roblox fans</Text>
                    <Text style={styles.footerVersion}>v1.0.0</Text>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 999,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
        overflow: 'hidden',
    },
    drawerBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0E0E20',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.07)',
    },

    /* Header */
    header: {
        paddingTop: 60,
        paddingBottom: 22,
        paddingHorizontal: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        overflow: 'hidden',
    },
    headerShine: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.4,
        marginBottom: 4,
    },
    headerSub: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 2,
    },

    /* Menu */
    menuList: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 14,
        gap: 14,
        marginBottom: 2,
    },
    menuIconBox: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: -0.2,
    },
    menuChevron: {
        width: 16,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.25,
    },
    chevronLine: {
        width: 6,
        height: 6,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: '#FFF',
        transform: [{ rotate: '45deg' }],
    },

    /* Footer */
    footer: {
        paddingHorizontal: 18,
        paddingBottom: 30,
        alignItems: 'center',
    },
    footerDivider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.07)',
        marginBottom: 14,
    },
    footerText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
        marginBottom: 4,
    },
    footerVersion: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.18)',
    },
});
