import React from 'react';
import { CalcShell } from '../../components/CalcShell';
import { CalculatorComponent } from '../../components/CalculatorComponent';
import { IndianRupee } from 'lucide-react-native';

export default function INRToRobuxCalculator() {
    return (
        <CalcShell title="INR → Robux" accentColor="#F59E0B">
            <CalculatorComponent
                title="INR to Robux"
                description="Convert Indian Rupees to Robux"
                icon={<IndianRupee size={28} color="#FFF" strokeWidth={2.5} />}
                gradient={['#D97706', '#F59E0B']}
                fromLabel="INR"
                toLabel="Robux"
                rate={0.96}
                fromSymbol="₹"
                toSymbol="R$"
            />
        </CalcShell>
    );
}
