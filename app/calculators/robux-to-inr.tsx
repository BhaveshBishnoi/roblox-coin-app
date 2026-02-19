import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { IndianRupee } from 'lucide-react-native';

export default function RobuxToINRCalculator() {
    return (
        <CalcShell title="Robux → INR" accentColor="#EF4444">
            <CalculatorComponent
                title="Robux to INR"
                description="Convert Robux to Indian Rupees"
                icon={<IndianRupee size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#DC2626', '#EF4444']}
                fromLabel="Robux"
                toLabel="INR"
                rate={1.04}
                fromSymbol="R$"
                toSymbol="₹"
            />
        </CalcShell>
    );
}
