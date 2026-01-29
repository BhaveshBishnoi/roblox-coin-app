import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCoins } from '../context/CoinContext';
import { Colors } from '../constants/Colors';
import { Settings } from 'lucide-react-native';
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
    const router = useRouter();

    const openSettings = () => {
        router.push('/settings');
    };

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                {/* Settings Button */}
                <TouchableOpacity onPress={openSettings} style={styles.settingsBtn} activeOpacity={0.7}>
                    <Settings color={Colors.text} size={26} strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Title */}
                {showTitle && title && (
                    <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                )}

                {/* Coin Badge */}
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
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'ios' ? 50 : (RNStatusBar.currentHeight || 0) + 12,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 100,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    settingsBtn: {
        width: 50,
        height: 50,
        borderRadius: 16,
        marginVertical: 0,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 0, 0, 0.06)',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    coinBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        paddingRight: 16,
        borderRadius: 100,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    coinIcon: {
        width: 22,
        height: 22,
    } as ImageStyle,
    coinText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: -0.4,
    },
});
