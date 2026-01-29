import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeButton } from './SafeButton';
import { MenuDrawer } from './MenuDrawer';
import { useCoins } from '../context/CoinContext';
import { Colors } from '../constants/Colors';
import { Menu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageStyle } from 'react-native';

const ICONS = {
    coin: require('../assets/icons/coin.png')
};

interface AppHeaderProps {
    title?: string;
    showTitle?: boolean;
}

export function AppHeader({ title, showTitle = true }: AppHeaderProps) {
    const { balance } = useCoins();
    const [menuVisible, setMenuVisible] = useState(false);
    const menuSlideAnim = useRef(new Animated.Value(0)).current;

    const openMenu = () => {
        setMenuVisible(true);
        Animated.spring(menuSlideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(menuSlideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setMenuVisible(false));
    };

    return (
        <>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <SafeButton onPress={openMenu} style={styles.menuBtn} variant="surface">
                        <Menu color="#64748b" size={22} strokeWidth={2.5} />
                    </SafeButton>

                    {showTitle && title && (
                        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                    )}

                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.coinBadge}
                    >
                        <Image source={ICONS.coin} style={styles.coinIcon as ImageStyle} />
                        <Text style={styles.coinText}>{balance.toLocaleString()}</Text>
                    </LinearGradient>
                </View>
            </View>

            <MenuDrawer
                visible={menuVisible}
                onClose={closeMenu}
                slideAnim={menuSlideAnim}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 8 : 8,
        paddingBottom: 12,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        marginVertical: 0,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: -0.4,
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        paddingRight: 14,
        borderRadius: 100,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    coinIcon: {
        width: 18,
        height: 18,
    } as ImageStyle,
    coinText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: -0.3,
    },
});
