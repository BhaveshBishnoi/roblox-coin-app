import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { DollarSign } from 'lucide-react-native';

export default function RobuxToUSDCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="Robux to USD"
                    description="Convert Robux to US Dollars"
                    icon={<DollarSign size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#8B5CF6', '#7C3AED']}
                    fromLabel="Robux"
                    toLabel="USD"
                    rate={0.0125}
                    fromSymbol="R$"
                    toSymbol="$"
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
