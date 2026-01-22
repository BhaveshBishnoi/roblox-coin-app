import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { Colors } from '../constants/Colors';
import { useAdAction } from '../hooks/useAdAction';
import { Trophy } from 'lucide-react-native';

const PRIZES = ['10', '5', '50', '5', '20', '1000', '10', '2', '500'];

function ScratchCard({ prize }: { prize: string }) {
    const [scratched, setScratched] = useState(false);
    const triggerAd = useAdAction();

    const handleScratch = () => {
        if (scratched) return;
        triggerAd(() => setScratched(true));
    };

    return (
        <Pressable
            onPress={handleScratch}
            style={[styles.card, scratched ? styles.cardScratched : styles.cardCover]}
        >
            {scratched ? (
                <View style={styles.prizeContent}>
                    <Text style={styles.prizeText}>{prize}</Text>
                    <Trophy size={20} color={Colors.accent} />
                </View>
            ) : (
                <Text style={styles.coverText}>Tap to Scratch</Text>
            )}
        </Pressable>
    );
}

export default function Scratch() {
    return (
        <Container>
            <View style={styles.center}>
                <Title>SCRATCH & WIN</Title>
                <Text style={styles.subtitle}>Tap a card to reveal your prize!</Text>

                <View style={styles.grid}>
                    {PRIZES.map((prize, index) => (
                        <View key={index} style={styles.cardContainer}>
                            <ScratchCard prize={prize} />
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
    },
    subtitle: {
        color: Colors.textSecondary,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    cardContainer: {
        width: '30%',
        aspectRatio: 1,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    cardCover: {
        backgroundColor: Colors.surfaceHighlight,
        borderColor: Colors.border,
    },
    cardScratched: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    coverText: {
        color: Colors.textSecondary,
        fontSize: 10,
        textAlign: 'center',
        padding: 4,
    },
    prizeContent: {
        alignItems: 'center',
    },
    prizeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
