import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { TrendingUp } from 'lucide-react-native';

export default function OBCToRobuxCalculator() {
    return (
        <CalcShell title="OBC → Robux" accentColor="#A855F7">
            <CalculatorComponent
                title="OBC to Robux"
                description="Outrageous Builders Club (Legacy)"
                icon={<TrendingUp size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#9333EA', '#A855F7']}
                fromLabel="OBC"
                toLabel="Robux"
                rate={15}
                toSymbol="R$"
            />
        </CalcShell>
    );
}
