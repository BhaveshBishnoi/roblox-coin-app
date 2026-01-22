import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Gift, Clock } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useCoins } from '../context/CoinContext';
import { useAdAction } from '../hooks/useAdAction';

export default function Daily() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const triggerAd = useAdAction();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('daily', 24);
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('daily', 24));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClaim = () => {
        if (!available) return;

        triggerAd(() => {
            addCoins(100, 'Daily Reward');
            setCooldown('daily');
            setAvailable(false);
        });
    };

    return (
        <Container>
            <View style={styles.center}>
                <View style={[styles.iconContainer, available && styles.iconActive]}>
                    <Gift size={80} color={available ? Colors.primary : Colors.textSecondary} />
                </View>
                <Title>Daily Bonus</Title>
                <Text style={styles.desc}>
                    Return every day to claim your free 100 coins!
                </Text>

                {available ? (
                    <SafeButton
                        title="CLAIM 100 COINS"
                        onPress={handleClaim}
                        variant="primary"
                        style={styles.btn}
                        textStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    />
                ) : (
                    <View style={styles.claimed}>
                        <Clock size={24} color={Colors.textSecondary} style={{ marginBottom: 10 }} />
                        <Text style={styles.claimedTitle}>CLAIMED!</Text>
                        <Text style={styles.claimedText}>Next Reward in: {timeLeft}</Text>
                    </View>
                )}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    iconContainer: {
        padding: 40,
        backgroundColor: Colors.surface,
        borderRadius: 100,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    iconActive: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(0, 214, 50, 0.1)',
    },
    desc: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 16,
        lineHeight: 24,
    },
    btn: {
        width: '100%',
        paddingVertical: 12,
    },
    claimed: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    claimedTitle: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    claimedText: {
        color: Colors.textSecondary,
        fontSize: 14,
        fontVariant: ['tabular-nums'],
    }
});
