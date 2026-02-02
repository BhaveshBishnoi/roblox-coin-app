import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { Bitcoin } from 'lucide-react-native';

export default function BTCToRobuxCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="Bitcoin to Robux"
                    description="Convert Bitcoin to Robux"
                    icon={<Bitcoin size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#F97316', '#EA580C']}
                    fromLabel="BTC"
                    toLabel="Robux"
                    rate={3500000}
                    fromSymbol="₿"
                    toSymbol="R$"
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
