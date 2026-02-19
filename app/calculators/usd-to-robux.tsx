import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { DollarSign } from 'lucide-react-native';

export default function USDToRobuxCalculator() {
    return (
        <CalcShell title="USD → Robux" accentColor="#10B981">
            <CalculatorComponent
                title="USD to Robux"
                description="Convert US Dollars to Robux"
                icon={<DollarSign size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#059669', '#10B981']}
                fromLabel="USD"
                toLabel="Robux"
                rate={80}
                fromSymbol="$"
                toSymbol="R$"
            />
        </CalcShell>
    );
}
