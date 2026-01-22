import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Trophy, Lock, Clock } from 'lucide-react-native';

const PRIZES = ['10', '5', '50', '5', '20', '1000', '10', '2', '500'];

function ScratchCard({ prize, onReveal, disabled }: { prize: string, onReveal: () => void, disabled: boolean }) {
    const [scratched, setScratched] = useState(false);
    const triggerAd = useAdAction();

    const handleScratch = () => {
        if (scratched || disabled) return;
        triggerAd(() => {
            setScratched(true);
            onReveal();
        });
    };

    return (
        <Pressable
            onPress={handleScratch}
            style={[styles.card, scratched ? styles.cardScratched : styles.cardCover, disabled && !scratched && styles.cardDisabled]}
        >
            {scratched ? (
                <View style={styles.prizeContent}>
                    <Text style={styles.prizeText}>{prize}</Text>
                    <Trophy size={16} color={Colors.accent} />
                </View>
            ) : (
                <View style={{ alignItems: 'center' }}>
                    {disabled ? <Lock size={20} color={Colors.textSecondary} /> : <Trophy size={20} color={Colors.textSecondary} />}
                </View>
            )}
        </Pressable>
    );
}

export default function Scratch() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('scratch', 1);
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('scratch', 1));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleWin = (amountStr: string) => {
        const amount = parseInt(amountStr, 10);
        addCoins(amount, 'Scratch Win');
        setCooldown('scratch'); // Trigger 1h cooldown immediately after one scratch? 
        // Or should we allow scratching ALL cards then cooldown? 
        // User said "if scratched once then add limit". 
        // Usually scratchcards are "daily batch" or "one card". 
        // I will implement: Pick ONE card, win, then cooldown.
        Alert.alert("CONGRATULATIONS!", `You won ${amount} Coins! Come back in 1 hour.`);
        setAvailable(false);
    };

    return (
        <Container>
            <View style={styles.center}>
                <Title>SCRATCH & WIN</Title>

                {available ? (
                    <Text style={styles.subtitle}>Pick a card to reveal your prize!</Text>
                ) : (
                    <View style={styles.cooldownContainer}>
                        <Clock size={16} color={Colors.red} />
                        <Text style={styles.cooldownText}>Next Scratch in {timeLeft}</Text>
                    </View>
                )}

                <View style={styles.grid}>
                    {PRIZES.map((prize, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <ScratchCard
                                prize={prize}
                                onReveal={() => handleWin(prize)}
                                disabled={!available}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 10,
    },
    subtitle: {
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    cooldownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    cooldownText: {
        color: Colors.red,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 10,
    },
    cardContainer: {
        width: '30%',
        aspectRatio: 1,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    cardCover: {
        backgroundColor: Colors.surface,
        borderColor: Colors.border,
    },
    cardDisabled: {
        opacity: 0.5,
        backgroundColor: '#111',
    },
    cardScratched: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    prizeContent: {
        alignItems: 'center',
        gap: 4
    },
    prizeText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 20,
    }
});
