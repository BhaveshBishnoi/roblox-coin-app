import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { IndianRupee } from 'lucide-react-native';

export default function INRToRobuxCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="INR to Robux"
                    description="Convert Indian Rupees to Robux"
                    icon={<IndianRupee size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#F59E0B', '#D97706']}
                    fromLabel="INR"
                    toLabel="Robux"
                    rate={0.96}
                    fromSymbol="₹"
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
