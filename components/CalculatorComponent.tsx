import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { SafeButton } from './SafeButton';
import { Colors } from '../constants/Colors';
import { ArrowRightLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface CalculatorComponentProps {
    title: string;
    icon: React.ReactNode;
    gradient: readonly [string, string];
    fromLabel: string;
    toLabel: string;
    rate: number;
    fromSymbol?: string;
    toSymbol?: string;
    description?: string;
}

export function CalculatorComponent({
    title,
    icon,
    gradient,
    fromLabel,
    toLabel,
    rate,
    fromSymbol = '',
    toSymbol = '',
    description,
}: CalculatorComponentProps) {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('0');

    const handleCalculate = () => {
        const value = parseFloat(inputValue);
        if (isNaN(value) || value < 0) {
            setResult('0');
            return;
        }
        const calculated = value * rate;
        setResult(calculated.toLocaleString('en-US', { maximumFractionDigits: 8 }));
    };

    const handleSwap = () => {
        setInputValue(result.replace(/,/g, ''));
        setResult('0');
    };

    const handleClear = () => {
        setInputValue('');
        setResult('0');
    };

    return (
        <View style={styles.container}>
            {/* Header Card */}
            <LinearGradient
                colors={[...gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>{title}</Text>
                        {description && (
                            <Text style={styles.description}>{description}</Text>
                        )}
                    </View>
                </View>
            </LinearGradient>

            {/* Calculator Card */}
            <View style={styles.calculatorCard}>
                {/* From Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{fromLabel}</Text>
                    <View style={styles.inputContainer}>
                        {fromSymbol && <Text style={styles.currencySymbol}>{fromSymbol}</Text>}
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder="0"
                            placeholderTextColor={Colors.textTertiary}
                            keyboardType="decimal-pad"
                            onSubmitEditing={handleCalculate}
                        />
                    </View>
                </View>

                {/* Swap Button */}
                <View style={styles.swapContainer}>
                    <SafeButton
                        onPress={handleSwap}
                        style={styles.swapButton}
                        variant="surface"
                    >
                        <ArrowRightLeft size={20} color={Colors.primary} strokeWidth={2.5} />
                    </SafeButton>
                </View>

                {/* To Result */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{toLabel}</Text>
                    <View style={[styles.inputContainer, styles.resultContainer]}>
                        {toSymbol && <Text style={styles.currencySymbolResult}>{toSymbol}</Text>}
                        <Text style={styles.resultText} numberOfLines={1}>{result}</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <SafeButton
                        title="Clear"
                        onPress={handleClear}
                        variant="surface"
                        style={styles.clearButton}
                    />
                    <SafeButton
                        title="Calculate"
                        onPress={handleCalculate}
                        variant="primary"
                        style={styles.calculateButton}
                    />
                </View>

                {/* Rate Info */}
                <View style={styles.rateInfo}>
                    <Text style={styles.rateLabel}>Conversion Rate</Text>
                    <Text style={styles.rateText}>
                        1 {fromLabel} = {rate.toLocaleString('en-US', { maximumFractionDigits: 8 })} {toLabel}
                    </Text>
                </View>
            </View>

            {/* Info Note */}
            <View style={styles.noteCard}>
                <Text style={styles.noteIcon}>ℹ️</Text>
                <Text style={styles.noteText}>
                    This is an approximate conversion rate. Actual rates may vary based on Roblox's official pricing and current market conditions.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: -0.2,
    },
    calculatorCard: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: Colors.border,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginRight: 10,
    },
    currencySymbolResult: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.primary,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text,
        padding: 0,
    },
    resultContainer: {
        backgroundColor: Colors.primaryLight,
        borderColor: Colors.primary,
    },
    resultText: {
        flex: 1,
        fontSize: 28,
        fontWeight: '900',
        color: Colors.primary,
    },
    swapContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    swapButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 0,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    clearButton: {
        flex: 1,
        height: 52,
        marginVertical: 0,
    },
    calculateButton: {
        flex: 2,
        height: 52,
        marginVertical: 0,
    },
    rateInfo: {
        backgroundColor: Colors.background,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
    },
    rateLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    rateText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: -0.2,
    },
    noteCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    noteIcon: {
        fontSize: 20,
    },
    noteText: {
        flex: 1,
        fontSize: 12,
        color: Colors.textSecondary,
        lineHeight: 18,
        fontWeight: '500',
    },
});
