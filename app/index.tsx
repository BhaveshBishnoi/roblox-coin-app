import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { useCoins } from '../context/CoinContext';
import {
    Dices,
    Gift,
    Gamepad2,
    CreditCard,
    Zap,
    BookOpen
} from 'lucide-react-native';

export default function Home() {
    const router = useRouter();

    const { balance } = useCoins();

    const features = [
        { id: 'daily', title: 'Daily Coins', icon: Gift, route: '/daily', variant: 'primary' },
        { id: 'wheel', title: 'Lucky Wheel', icon: Zap, route: '/wheel', variant: 'accent' },
        { id: 'scratch', title: 'Scratch Card', icon: CreditCard, route: '/scratch', variant: 'secondary' },
        { id: 'quiz', title: 'Roblox Quiz', icon: Gamepad2, route: '/quiz', variant: 'purple' },
        { id: 'flip', title: 'Flip Cards', icon: Dices, route: '/flip', variant: 'danger' },
        { id: 'tips', title: 'Tips & Tricks', icon: BookOpen, route: '/tips', variant: 'surface' },
    ];

    return (
        <Container>
            <View style={styles.header}>
                <Text style={styles.subtitle}>GET FREE</Text>
                <Title>ROBLOX COINS</Title>
                <SafeButton
                    title={`${balance} COINS`}
                    icon={<CreditCard size={16} color="#000" />}
                    onPress={() => router.push('/wallet')}
                    style={{ marginTop: 10, paddingHorizontal: 20, height: 40, minHeight: 0 }}
                    textStyle={{ fontSize: 14 }}
                    variant="accent"
                />
            </View>

            <View style={styles.grid}>
                {features.map((feature) => (
                    <View key={feature.id} style={styles.gridItem}>
                        <SafeButton
                            onPress={() => router.push(feature.route as any)}
                            style={styles.card}
                            variant={feature.variant as any}
                        >
                            <View style={styles.cardContent}>
                                <feature.icon size={48} color="#000" strokeWidth={2.5} />
                                <Text style={styles.cardText}>{feature.title}</Text>
                            </View>
                        </SafeButton>
                    </View>
                ))}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: '#FFFFFF',
        opacity: 0.6,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: -15,
        marginTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    gridItem: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: 16,
    },
    card: {
        flex: 1,
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 24,
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    cardText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        textTransform: 'uppercase',
    }
});
