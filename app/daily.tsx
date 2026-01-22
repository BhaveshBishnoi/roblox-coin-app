import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Gift } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

export default function Daily() {
    const [claimed, setClaimed] = useState(false);

    const handleClaim = () => {
        setClaimed(true);
    };

    return (
        <Container>
            <View style={styles.center}>
                <View style={styles.iconContainer}>
                    <Gift size={100} color={pathColors.primary} />
                </View>
                <Title>Daily Bonus</Title>
                <Text style={styles.desc}>
                    Return every day to claim your free coins!
                </Text>

                {!claimed ? (
                    <SafeButton
                        title="CLAIM 100 COINS"
                        onPress={handleClaim}
                        variant="primary"
                        style={styles.btn}
                        textStyle={{ fontSize: 20 }}
                    />
                ) : (
                    <View style={styles.claimed}>
                        <Text style={styles.claimedTitle}>CLAIMED!</Text>
                        <Text style={styles.claimedText}>Next Reward in 24h</Text>
                    </View>
                )}
            </View>
        </Container>
    );
}

const pathColors = {
    primary: Colors.primary
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    iconContainer: {
        padding: 40,
        backgroundColor: 'rgba(0, 224, 84, 0.1)',
        borderRadius: 100,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.primary
    },
    desc: {
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 16,
    },
    btn: {
        width: '100%',
        paddingVertical: 10,
    },
    claimed: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        width: '100%',
    },
    claimedTitle: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    claimedText: {
        color: Colors.text,
        opacity: 0.7,
    }
});
