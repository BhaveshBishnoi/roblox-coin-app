import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { TrendingUp } from 'lucide-react-native';

export default function BCToRobuxCalculator() {
    return (
        <CalcShell title="BC → Robux" accentColor="#EC4899">
            <CalculatorComponent
                title="BC to Robux"
                description="Builders Club conversion (Legacy)"
                icon={<TrendingUp size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#DB2777', '#EC4899']}
                fromLabel="BC"
                toLabel="Robux"
                rate={10}
                toSymbol="R$"
            />
        </CalcShell>
    );
}
