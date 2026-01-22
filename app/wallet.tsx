import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { useCoins } from '../context/CoinContext';
import { Wallet as WalletIcon, CheckCircle, Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GOAL = 10000;

export default function Wallet() {
    const { balance } = useCoins();
    const progress = Math.min((balance / GOAL) * 100, 100);
    const canRedeem = balance >= GOAL;

    const handleRedeem = () => {
        if (!canRedeem) {
            Alert.alert("Locked", `You need ${GOAL - balance} more coins to withdraw!`);
            return;
        }
        Linking.openURL('https://bhaveshbishnoi.com');
    };

    return (
        <Container>
            <View style={styles.center}>
                <View style={styles.balanceCard}>
                    <Text style={styles.label}>TOTAL BALANCE</Text>
                    <View style={styles.row}>
                        <WalletIcon size={32} color={Colors.accent} />
                        <Text style={styles.amount}>{balance.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.goalSection}>
                    <View style={styles.goalHeader}>
                        <Text style={styles.goalTitle}>Withdrawal Goal</Text>
                        <Text style={styles.goalText}>{balance} / {GOAL}</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={[Colors.primary, Colors.success]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                    <Text style={styles.goalSub}>Reach {GOAL} coins to withdraw RBX!</Text>
                </View>

                <View style={styles.actions}>
                    <SafeButton
                        title={canRedeem ? "WITHDRAW NOW" : "LOCKED"}
                        onPress={handleRedeem}
                        variant={canRedeem ? "primary" : "secondary"}
                        icon={canRedeem ? <CheckCircle color="#000" size={20} /> : <Lock color="#FFF" size={20} />}
                        disabled={!canRedeem}
                        style={styles.redeemBtn}
                    />
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        paddingTop: 20,
    },
    balanceCard: {
        backgroundColor: Colors.surface,
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 30,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 14,
        letterSpacing: 2,
        marginBottom: 10,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    amount: {
        fontSize: 48,
        color: '#FFF',
        fontWeight: '900',
    },
    goalSection: {
        marginBottom: 40,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    goalTitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    goalText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: Colors.surface,
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.surfaceHighlight,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 100,
    },
    goalSub: {
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
    actions: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    redeemBtn: {
        width: '100%',
        height: 60,
    }
});
