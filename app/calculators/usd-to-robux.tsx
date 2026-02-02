import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { DollarSign } from 'lucide-react-native';

export default function USDToRobuxCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="USD to Robux"
                    description="Convert US Dollars to Robux"
                    icon={<DollarSign size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#10B981', '#059669']}
                    fromLabel="USD"
                    toLabel="Robux"
                    rate={80}
                    fromSymbol="$"
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
