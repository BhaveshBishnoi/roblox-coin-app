import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { Bitcoin } from 'lucide-react-native';

export default function RobuxToBTCCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="Robux to Bitcoin"
                    description="Convert Robux to Bitcoin"
                    icon={<Bitcoin size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#06B6D4', '#0891B2']}
                    fromLabel="Robux"
                    toLabel="BTC"
                    rate={0.00000029}
                    fromSymbol="R$"
                    toSymbol="₿"
                />
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
});
