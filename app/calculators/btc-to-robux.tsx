import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { Bitcoin } from 'lucide-react-native';

export default function BTCToRobuxCalculator() {
    return (
        <CalcShell title="BTC → Robux" accentColor="#F97316">
            <CalculatorComponent
                title="Bitcoin to Robux"
                description="Convert Bitcoin to Robux"
                icon={<Bitcoin size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#EA580C', '#F97316']}
                fromLabel="BTC"
                toLabel="Robux"
                rate={3500000}
                fromSymbol="₿"
                toSymbol="R$"
            />
        </CalcShell>
    );
}
