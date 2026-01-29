import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { useCoins } from '../context/CoinContext';
import { Trophy, Lock, Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
            style={[
                styles.card,
                scratched && styles.cardScratched,
                disabled && !scratched && styles.cardDisabled
            ]}
        >
            {scratched ? (
                <LinearGradient
                    colors={['#fbbf24', '#f59e0b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.prizeContent}
                >
                    <Sparkles size={20} color="#fff" strokeWidth={2.5} />
                    <Text style={styles.prizeText}>{prize}</Text>
                    <Text style={styles.prizeLabel}>COINS</Text>
                </LinearGradient>
            ) : (
                <View style={styles.cardCover}>
                    {disabled ? (
                        <Lock size={24} color="#94a3b8" strokeWidth={2} />
                    ) : (
                        <>
                            <Trophy size={28} color="#64748b" strokeWidth={2} />
                            <Text style={styles.scratchText}>TAP</Text>
                        </>
                    )}
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
        setCooldown('scratch');
        Alert.alert("🎉 CONGRATULATIONS!", `You won ${amount} Coins!\n\nCome back in 1 hour for another chance.`);
        setAvailable(false);
    };

    return (
        <Container safeArea={false}>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Cooldown Banner */}
                {!available && (
                    <View style={styles.cooldownBanner}>
                        <Clock size={20} color={Colors.red} strokeWidth={2.5} />
                        <View style={styles.cooldownText}>
                            <Text style={styles.cooldownLabel}>Next scratch in</Text>
                            <Text style={styles.cooldownTime}>{timeLeft}</Text>
                        </View>
                    </View>
                )}

                {/* Cards Grid */}
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

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>💡</Text>
                    <Text style={styles.infoTitle}>How it works</Text>
                    <Text style={styles.infoText}>
                        Tap any card to scratch and reveal your prize. You can play once every hour!
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 20,
    },
    cooldownBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fef2f2',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    cooldownText: {
        flex: 1,
    },
    cooldownLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cooldownTime: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.red,
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.3,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    cardContainer: {
        flexBasis: '31%',
        aspectRatio: 1,
    },
    card: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardCover: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },
    cardDisabled: {
        opacity: 0.5,
    },
    cardScratched: {
        transform: [{ scale: 1.05 }],
    },
    scratchText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: 1,
    },
    prizeContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    prizeText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -0.5,
    },
    prizeLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 1,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    infoIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    infoTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
});
