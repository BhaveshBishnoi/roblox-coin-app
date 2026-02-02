import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components/Container';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { TrendingUp } from 'lucide-react-native';

export default function OBCToRobuxCalculator() {
    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalculatorComponent
                    title="OBC to Robux"
                    description="Outrageous Builders Club conversion (Legacy)"
                    icon={<TrendingUp size={32} color="#FFF" strokeWidth={2.5} />}
                    gradient={['#A855F7', '#9333EA']}
                    fromLabel="OBC"
                    toLabel="Robux"
                    rate={15}
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
