import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { useCoins } from '../context/CoinContext';
import { Wallet as WalletIcon, CheckCircle, Lock, TrendingUp, ChevronLeft, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const GOAL = 10000;

export default function Wallet() {
    const router = useRouter();
    const { balance, transactions } = useCoins();
    const progress = Math.min((balance / GOAL) * 100, 100);
    const canRedeem = balance >= GOAL;

    const handleRedeem = async () => {
        if (!canRedeem) {
            Alert.alert('Locked', `You need ${(GOAL - balance).toLocaleString()} more coins to withdraw!`);
            return;
        }
        await WebBrowser.openBrowserAsync('https://games.biographydata.org');
    };

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
                <Text style={styles.headerTitle}>My Wallet</Text>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>🪙 {balance.toLocaleString()}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces
            >
                {/* Balance Card */}
                <LinearGradient
                    colors={['#064E3B', '#065F46', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceShine} />
                    <View style={styles.balanceShineBottom} />
                    <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
                    <View style={styles.balanceRow}>
                        <WalletIcon size={36} color="#fff" strokeWidth={1.5} />
                        <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.balanceSub}>Roblox Coins</Text>
                </LinearGradient>

                {/* Goal Section */}
                <View style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                        <View style={styles.goalTitleRow}>
                            <TrendingUp size={18} color="#10B981" strokeWidth={2.5} />
                            <Text style={styles.goalTitle}>Withdrawal Goal</Text>
                        </View>
                        <Text style={styles.goalProgress}>{balance.toLocaleString()} / {GOAL.toLocaleString()}</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#059669', '#10B981']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                    <Text style={styles.goalSub}>
                        {canRedeem
                            ? '🎉 Goal reached! You can withdraw now'
                            : `${(GOAL - balance).toLocaleString()} more coins to unlock withdrawal`}
                    </Text>
                </View>

                {/* Withdraw Button */}
                <SafeButton
                    title={canRedeem ? 'WITHDRAW NOW' : 'LOCKED — Need More Coins'}
                    onPress={handleRedeem}
                    variant={canRedeem ? 'primary' : 'secondary'}
                    icon={
                        canRedeem
                            ? <ArrowUpRight color="#fff" size={20} strokeWidth={2.5} />
                            : <Lock color="#FFF" size={20} strokeWidth={2.5} />
                    }
                    disabled={!canRedeem}
                    style={styles.redeemBtn}
                />

                {/* Transaction History */}
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>Recent Activity</Text>

                    {transactions && transactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>💰</Text>
                            <Text style={styles.emptyText}>No transactions yet</Text>
                            <Text style={styles.emptySub}>Start earning coins by playing games!</Text>
                        </View>
                    ) : (
                        <View style={styles.txList}>
                            {transactions && transactions.map((tx, i) => (
                                <View
                                    key={tx.id}
                                    style={[
                                        styles.txRow,
                                        i < transactions.length - 1 && styles.txRowBorder,
                                    ]}
                                >
                                    <LinearGradient
                                        colors={['#059669', '#10B981']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.txIconContainer}
                                    >
                                        <Text style={styles.txIcon}>🪙</Text>
                                    </LinearGradient>
                                    <View style={styles.txInfo}>
                                        <Text style={styles.txSource}>{tx.source}</Text>
                                        <Text style={styles.txDate}>
                                            {new Date(tx.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </Text>
                                    </View>
                                    <Text style={styles.txAmount}>+{tx.amount}</Text>
                                </View>
                            ))}
                        </View>
                    )}
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
        opacity: 0.1,
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
    balanceCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
    },
    balanceShine: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    balanceShineBottom: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        letterSpacing: 2.5,
        marginBottom: 12,
        fontWeight: '800',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    balanceAmount: {
        fontSize: 52,
        color: '#fff',
        fontWeight: '900',
        letterSpacing: -2,
    },
    balanceSub: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 14,
        marginTop: 6,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    goalCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    goalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    goalTitle: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: -0.3,
    },
    goalProgress: {
        color: '#10B981',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: -0.2,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 100,
    },
    goalSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    redeemBtn: {
        width: '100%',
        height: 56,
        marginBottom: 28,
    },
    historySection: {
        marginTop: 4,
    },
    historyTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 14,
        letterSpacing: -0.4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    emptySub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    txList: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
    },
    txRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    txIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    txIcon: {
        fontSize: 20,
    },
    txInfo: {
        flex: 1,
    },
    txSource: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 3,
        letterSpacing: -0.2,
    },
    txDate: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '500',
    },
    txAmount: {
        color: '#10B981',
        fontWeight: '800',
        fontSize: 17,
        letterSpacing: -0.3,
    },
});
