import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { DollarSign } from 'lucide-react-native';

export default function RobuxToUSDCalculator() {
    return (
        <CalcShell title="Robux → USD" accentColor="#8B5CF6">
            <CalculatorComponent
                title="Robux to USD"
                description="Convert Robux to US Dollars"
                icon={<DollarSign size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#7C3AED', '#8B5CF6']}
                fromLabel="Robux"
                toLabel="USD"
                rate={0.0125}
                fromSymbol="R$"
                toSymbol="$"
            />
        </CalcShell>
    );
}
