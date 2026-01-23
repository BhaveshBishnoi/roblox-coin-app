import React from 'react';
import { View, Text, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { useCoins } from '../context/CoinContext';
import { Wallet as WalletIcon, CheckCircle, Lock, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GOAL = 10000;

export default function Wallet() {
    const { balance, transactions } = useCoins();
    const progress = Math.min((balance / GOAL) * 100, 100);
    const canRedeem = balance >= GOAL;

    const handleRedeem = () => {
        if (!canRedeem) {
            Alert.alert("Locked", `You need ${(GOAL - balance).toLocaleString()} more coins to withdraw!`);
            return;
        }
        Linking.openURL('https://bhaveshbishnoi.com');
    };

    return (
        <Container safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Balance Card */}
                <LinearGradient
                    colors={['#22c55e', '#16a34a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceGlow} />
                    <Text style={styles.label}>TOTAL BALANCE</Text>
                    <View style={styles.row}>
                        <WalletIcon size={36} color="#fff" strokeWidth={2} />
                        <Text style={styles.amount}>{balance.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.balanceSub}>Roblox Coins</Text>
                </LinearGradient>

                {/* Goal Section */}
                <View style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                        <View style={styles.goalTitleRow}>
                            <TrendingUp size={20} color={Colors.primary} strokeWidth={2.5} />
                            <Text style={styles.goalTitle}>Withdrawal Goal</Text>
                        </View>
                        <Text style={styles.goalText}>{balance.toLocaleString()} / {GOAL.toLocaleString()}</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#22c55e', '#16a34a']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                    <Text style={styles.goalSub}>
                        {canRedeem ? '🎉 Goal reached! You can withdraw now' : `${(GOAL - balance).toLocaleString()} more coins to unlock withdrawal`}
                    </Text>
                </View>

                {/* Withdraw Button */}
                <SafeButton
                    title={canRedeem ? "WITHDRAW NOW" : "LOCKED"}
                    onPress={handleRedeem}
                    variant={canRedeem ? "primary" : "secondary"}
                    icon={canRedeem ? <CheckCircle color="#fff" size={20} strokeWidth={2.5} /> : <Lock color="#FFF" size={20} strokeWidth={2.5} />}
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
                            {transactions && transactions.map((tx) => (
                                <View key={tx.id} style={styles.txRow}>
                                    <View style={styles.txIconContainer}>
                                        <Text style={styles.txIcon}>🪙</Text>
                                    </View>
                                    <View style={styles.txInfo}>
                                        <Text style={styles.txSource}>{tx.source}</Text>
                                        <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 100,
        paddingBottom: 40,
    },
    balanceCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 12,
        overflow: 'hidden',
    },
    balanceGlow: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: 12,
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amount: {
        fontSize: 52,
        color: '#fff',
        fontWeight: '900',
        letterSpacing: -1,
    },
    balanceSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '500',
    },
    goalCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    goalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    goalTitle: {
        color: Colors.text,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: -0.3,
    },
    goalText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: -0.2,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 100,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 100,
    },
    goalSub: {
        color: Colors.textSecondary,
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    redeemBtn: {
        width: '100%',
        height: 56,
        marginBottom: 32,
    },
    historySection: {
        marginTop: 8,
    },
    historyTitle: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: -0.4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    emptySub: {
        color: Colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    txList: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    txIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    txIcon: {
        fontSize: 20,
    },
    txInfo: {
        flex: 1,
    },
    txSource: {
        color: Colors.text,
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    txDate: {
        color: Colors.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    txAmount: {
        color: Colors.success,
        fontWeight: '700',
        fontSize: 17,
        letterSpacing: -0.3,
    }
});
