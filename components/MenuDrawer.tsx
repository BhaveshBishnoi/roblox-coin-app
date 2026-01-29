import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import {
    Home,
    Calendar,
    Target,
    Gift,
    Brain,
    Flame,
    Lightbulb,
    Wallet,
    X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface MenuDrawerProps {
    visible: boolean;
    onClose: () => void;
    slideAnim: Animated.Value;
}

export function MenuDrawer({ visible, onClose, slideAnim }: MenuDrawerProps) {
    const router = useRouter();

    const menuItems = [
        { icon: Home, label: 'Home', route: '/', color: Colors.primary },
        { icon: Calendar, label: 'Daily Coins', route: '/daily', color: Colors.success },
        { icon: Target, label: 'Lucky Wheel', route: '/wheel', color: Colors.accent },
        { icon: Gift, label: 'Scratch Card', route: '/scratch', color: Colors.secondary },
        { icon: Brain, label: 'Roblox Quiz', route: '/quiz', color: Colors.purple },
        { icon: Flame, label: 'Flip Cards', route: '/flip', color: Colors.danger },
        { icon: Lightbulb, label: 'Tips & Tricks', route: '/tips', color: Colors.accent },
        { icon: Wallet, label: 'My Wallet', route: '/wallet', color: Colors.info },
    ];

    const handleNavigate = (route: string) => {
        onClose();
        setTimeout(() => {
            if (route === '/') {
                router.push('/');
            } else {
                router.push(route as any);
            }
        }, 300);
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
                            outputRange: [0, 1]
                        })
                    }
                ]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
            </Animated.View>

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{
                            translateX: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-DRAWER_WIDTH, 0]
                            })
                        }]
                    }
                ]}
            >
                <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Roblox Coins</Text>
                        <Text style={styles.headerSubtitle}>Earn Free Robux</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={24} color="#fff" strokeWidth={2.5} />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.menuContent}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => handleNavigate(item.route)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                                <item.icon size={22} color={item.color} strokeWidth={2.5} />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Version 1.0.0</Text>
                    <Text style={styles.footerSubtext}>Made with ❤️ for Roblox fans</Text>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: Colors.surface,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 16,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 0.3,
    },
    closeBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuContent: {
        flex: 1,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        letterSpacing: -0.3,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 11,
        fontWeight: '500',
        color: Colors.textTertiary,
    },
});
