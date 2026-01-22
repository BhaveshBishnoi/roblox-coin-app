import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { Colors } from '../constants/Colors';
import { SafeButton } from '../components/SafeButton';

const TIPS = [
    {
        title: "How to get rich in Adopt Me?",
        content: "Trade your pets wisely! Look for neon pets and participate in every event update."
    },
    {
        title: "Latest Promo Codes",
        content: "Check official Roblox social media pages for new codes like SPIDERCOLA or TWEETROBLOX."
    },
    {
        title: "Building Tips",
        content: "Use Roblox Studio to create your own games. It's the best way to earn Robux legitimately!"
    },
    {
        title: "Trading System",
        content: "Always check the value of items before accepting a trade. Beware of scams!"
    }
];

export default function Tips() {
    return (
        <Container>
            <Title>TIPS & TRICKS</Title>
            <ScrollView showsVerticalScrollIndicator={false}>
                {TIPS.map((tip, i) => (
                    <View key={i} style={styles.card}>
                        <Text style={styles.cardTitle}>{tip.title}</Text>
                        <Text style={styles.cardContent}>{tip.content}</Text>
                        <SafeButton
                            title="READ MORE"
                            variant="surface"
                            gradientColors={[Colors.surfaceHighlight, '#333']}
                            style={{ marginTop: 10, alignSelf: 'flex-start' }}
                            textStyle={{ fontSize: 12, color: '#AAA' }}
                        />
                    </View>
                ))}
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    cardContent: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    }
});
