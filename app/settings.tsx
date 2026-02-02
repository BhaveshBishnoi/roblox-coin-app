import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Share, Alert } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import {
    Share2,
    Star,
    Info,
    Shield,
    Send,
    ExternalLink
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const APP_VERSION = '1.0.0';
const TELEGRAM_URL = 'https://t.me/your_channel'; // Replace with your Telegram channel
const PRIVACY_URL = 'https://games.biographydata.org/privacy';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.bhaveshbishnoi.roblox';

export default function Settings() {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this awesome Roblox Coins app! Download now: ${PLAY_STORE_URL}`,
                title: 'Roblox Coins App'
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleRate = () => {
        Linking.openURL(PLAY_STORE_URL);
    };

    const handlePrivacy = () => {
        Linking.openURL(PRIVACY_URL);
    };

    const handleTelegram = () => {
        Linking.openURL(TELEGRAM_URL);
    };

    const handleVersion = () => {
        Alert.alert(
            'App Version',
            `Version ${APP_VERSION}\n\nMade with ❤️ for Roblox fans`,
            [{ text: 'OK' }]
        );
    };

    const settingsOptions = [
        {
            icon: Share2,
            title: 'Share App',
            subtitle: 'Share with friends',
            onPress: handleShare,
            color: Colors.primary,
        },
        {
            icon: Star,
            title: 'Rate App',
            subtitle: 'Rate us on Play Store',
            onPress: handleRate,
            color: Colors.accent,
        },
        {
            icon: Send,
            title: 'Join Telegram',
            subtitle: 'Get updates & support',
            onPress: handleTelegram,
            color: Colors.secondary,
        },
        {
            icon: Shield,
            title: 'Privacy Policy',
            subtitle: 'Read our privacy policy',
            onPress: handlePrivacy,
            color: Colors.purple,
        },
        {
            icon: Info,
            title: 'Version',
            subtitle: `v${APP_VERSION}`,
            onPress: handleVersion,
            color: Colors.textSecondary,
        },
    ];

    return (
        <Container safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Manage your app preferences</Text>
                </LinearGradient>

                {/* Settings Options */}
                <View style={styles.optionsContainer}>
                    {settingsOptions.map((option, index) => (
                        <SafeButton
                            key={index}
                            onPress={option.onPress}
                            style={styles.optionButton}
                        >
                            <View style={styles.optionContent}>
                                <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                                    <option.icon size={24} color={option.color} strokeWidth={2.5} />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>{option.title}</Text>
                                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                                </View>
                                <ExternalLink size={20} color={Colors.textTertiary} strokeWidth={2} />
                            </View>
                        </SafeButton>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ for Roblox fans</Text>
                    <Text style={styles.footerSubtext}>© 2026 Roblox Coins</Text>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        padding: 24,
        borderRadius: 20,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.85)',
    },
    optionsContainer: {
        gap: 10,
    },
    optionButton: {
        marginVertical: 0,
        borderRadius: 16,
        width: '100%',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
        width: '100%',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    optionText: {
        flex: 1,
        minWidth: 0,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: -0.3,
        marginBottom: 3,
    },
    optionSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    footerText: {
        fontSize: 13,
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
