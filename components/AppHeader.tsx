import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCoins } from '../context/CoinContext';
import { Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageStyle } from 'react-native';

const ICONS = {
    coin: require('../assets/icons/coin.png'),
};

interface AppHeaderProps {
    title?: string;
    showTitle?: boolean;
}

export function AppHeader({ title, showTitle = true }: AppHeaderProps) {
    const { balance } = useCoins();
    const router = useRouter();

    return (
        <View style={styles.header}>
            {/* Frosted glass blur effect via dark overlay */}
            <View style={styles.headerBg} />

            <View style={styles.headerContent}>
                {/* Settings Button */}
                <TouchableOpacity
                    onPress={() => router.push('/settings')}
                    style={styles.settingsBtn}
                    activeOpacity={0.7}
                >
                    <Settings color="rgba(255,255,255,0.8)" size={22} strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Title */}
                {showTitle && title && (
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title}
                    </Text>
                )}

                {/* Coin Badge */}
                <LinearGradient
                    colors={['#059669', '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.coinBadge}
                >
                    <Image source={ICONS.coin} style={styles.coinIcon as ImageStyle} />
                    <Text style={styles.coinText}>{balance.toLocaleString()}</Text>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingTop: Platform.OS === 'ios' ? 50 : (RNStatusBar.currentHeight || 0) + 10,
        paddingBottom: 14,
        paddingHorizontal: 18,
    },
    headerBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10,10,26,0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.07)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsBtn: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.4,
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 100,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    coinIcon: {
        width: 20,
        height: 20,
    } as ImageStyle,
    coinText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: -0.4,
    },
});
