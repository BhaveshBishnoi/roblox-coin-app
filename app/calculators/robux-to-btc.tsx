import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { Bitcoin } from 'lucide-react-native';

export default function RobuxToBTCCalculator() {
    return (
        <CalcShell title="Robux → BTC" accentColor="#06B6D4">
            <CalculatorComponent
                title="Robux to Bitcoin"
                description="Convert Robux to Bitcoin"
                icon={<Bitcoin size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#0891B2', '#06B6D4']}
                fromLabel="Robux"
                toLabel="BTC"
                rate={0.00000029}
                fromSymbol="R$"
                toSymbol="₿"
            />
        </CalcShell>
    );
}
