import React from 'react';
import { View, Text, StyleSheet, ScrollView, Share, Alert, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import {
    Share2,
    Star,
    Shield,
    Send,
    ChevronRight,
    Info,
    ChevronLeft,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const APP_VERSION = '1.0.0';
const TELEGRAM_URL = 'https://t.me/+YeKVAqx3DNhjZWY1';
const PRIVACY_URL = 'https://rbx.dhakshsolutions.com/privacy-policy';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.kappytech.rbxcalc';

const SettingRow = ({
    icon: Icon,
    label,
    subtitle,
    color,
    gradient,
    onPress,
    isLast = false,
}: {
    icon: any;
    label: string;
    subtitle: string;
    color: string;
    gradient: readonly [string, string];
    onPress: () => void;
    isLast?: boolean;
}) => (
    <>
        <Pressable
            onPress={onPress}
            android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
        >
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rowIcon}
            >
                <Icon size={20} color="#FFF" strokeWidth={2} />
            </LinearGradient>
            <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowSub}>{subtitle}</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2.5} />
        </Pressable>
        {!isLast && <View style={styles.rowDivider} />}
    </>
);

export default function Settings() {
    const router = useRouter();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this awesome Roblox Coins app! Download now: ${PLAY_STORE_URL}`,
                title: 'Roblox Coins App',
            });
        } catch (e) { }
    };

    const handleRate = () => WebBrowser.openBrowserAsync(PLAY_STORE_URL);
    const handlePrivacy = () => WebBrowser.openBrowserAsync(PRIVACY_URL);
    const handleTelegram = () => WebBrowser.openBrowserAsync(TELEGRAM_URL);

    const handleVersion = () =>
        Alert.alert('App Version', `Version ${APP_VERSION}\n\nMade with ❤️ for Roblox fans`, [
            { text: 'OK' },
        ]);

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
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* App card */}
                <LinearGradient
                    colors={['#1E1B4B', '#312E81', '#4338CA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.appCard}
                >
                    <View style={styles.appCardShine} />
                    <View style={styles.appIconBox}>
                        <Text style={styles.appIconEmoji}>🎮</Text>
                    </View>
                    <Text style={styles.appName}>RBX Calc & Rewards</Text>
                    <Text style={styles.appTagline}>Free Robux coins, daily rewards & more</Text>
                    <View style={styles.versionPill}>
                        <Text style={styles.versionPillText}>v{APP_VERSION}</Text>
                    </View>
                </LinearGradient>

                {/* Section: General */}
                <Text style={styles.sectionLabel}>GENERAL</Text>
                <View style={styles.card}>
                    <SettingRow
                        icon={Share2}
                        label="Share App"
                        subtitle="Invite your friends"
                        color="#10B981"
                        gradient={['#059669', '#10B981']}
                        onPress={handleShare}
                    />
                    <SettingRow
                        icon={Star}
                        label="Rate on Play Store"
                        subtitle="Show your support ⭐"
                        color="#F59E0B"
                        gradient={['#D97706', '#F59E0B']}
                        onPress={handleRate}
                        isLast
                    />
                </View>

                {/* Section: Support */}
                <Text style={styles.sectionLabel}>SUPPORT</Text>
                <View style={styles.card}>
                    <SettingRow
                        icon={Send}
                        label="Join Telegram"
                        subtitle="Updates & community"
                        color="#38BDF8"
                        gradient={['#0284C7', '#38BDF8']}
                        onPress={handleTelegram}
                        isLast
                    />
                </View>

                {/* Section: Legal */}
                <Text style={styles.sectionLabel}>LEGAL</Text>
                <View style={styles.card}>
                    <SettingRow
                        icon={Shield}
                        label="Privacy Policy"
                        subtitle="How we handle your data"
                        color="#A78BFA"
                        gradient={['#7C3AED', '#A78BFA']}
                        onPress={handlePrivacy}
                    />
                    <SettingRow
                        icon={Info}
                        label="App Version"
                        subtitle={`v${APP_VERSION} — Made with ❤️`}
                        color="#94A3B8"
                        gradient={['#475569', '#94A3B8']}
                        onPress={handleVersion}
                        isLast
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ for Roblox fans</Text>
                    <Text style={styles.footerSub}>© 2026 RBX Calc & Rewards</Text>
                </View>
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
        backgroundColor: '#6366F1',
    },
    blobBL: {
        bottom: -60,
        left: -60,
        backgroundColor: '#10B981',
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
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    appCard: {
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginBottom: 28,
        overflow: 'hidden',
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    appCardShine: {
        position: 'absolute',
        top: -60,
        left: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.08)',
        transform: [{ scaleX: 2 }],
    },
    appIconBox: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    appIconEmoji: {
        fontSize: 36,
    },
    appName: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    appTagline: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 14,
    },
    versionPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    versionPillText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    rowIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowText: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    rowSub: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.45)',
    },
    rowDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginLeft: 72,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 16,
        gap: 4,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.3)',
    },
    footerSub: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.2)',
    },
});