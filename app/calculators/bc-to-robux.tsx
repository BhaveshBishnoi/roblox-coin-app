import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { TrendingUp } from 'lucide-react-native';

export default function BCToRobuxCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="BC to Robux"
                    description="Builders Club conversion (Legacy)"
                    icon={<TrendingUp size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#EC4899', '#DB2777']}
                    fromLabel="BC"
                    toLabel="Robux"
                    rate={10}
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
