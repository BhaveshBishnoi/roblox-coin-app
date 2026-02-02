import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { IndianRupee } from 'lucide-react-native';

export default function RobuxToINRCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="Robux to INR"
                    description="Convert Robux to Indian Rupees"
                    icon={<IndianRupee size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#EF4444', '#DC2626']}
                    fromLabel="Robux"
                    toLabel="INR"
                    rate={1.04}
                    fromSymbol="R$"
                    toSymbol="₹"
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
