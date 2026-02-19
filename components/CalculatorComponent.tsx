import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeButton } from './SafeButton';
import { ArrowDownUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

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
    const [result, setResult] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);

    const calculate = useCallback((val: string) => {
        const value = parseFloat(val);
        if (!val || isNaN(value) || value < 0) {
            setResult(null);
            return;
        }
        const calculated = value * rate;
        setResult(calculated.toLocaleString('en-US', { maximumFractionDigits: 8 }));
    }, [rate]);

    const handleChange = (val: string) => {
        setInputValue(val);
        calculate(val);
    };

    const handleSwap = () => {
        if (!result) return;
        setInputValue(result.replace(/,/g, ''));
        setResult(null);
    };

    const handleClear = () => {
        setInputValue('');
        setResult(null);
    };

    const hasResult = result !== null;

    return (
        <View style={styles.container}>
            {/* ── Hero Header Card ── */}
            <LinearGradient
                colors={[...gradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerShine} />
                <View style={styles.iconRing}>{icon}</View>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    {description && (
                        <Text style={styles.headerSub}>{description}</Text>
                    )}
                </View>
            </LinearGradient>

            {/* ── Main Calculator Card ── */}
            <View style={styles.card}>

                {/* FROM input */}
                <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{fromLabel}</Text>
                    <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
                        {fromSymbol ? (
                            <Text style={styles.symbolText}>{fromSymbol}</Text>
                        ) : null}
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={handleChange}
                            placeholder="0"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            keyboardType="decimal-pad"
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            returnKeyType="done"
                        />
                    </View>
                </View>

                {/* Swap / Arrow divider */}
                <View style={styles.swapRow}>
                    <View style={styles.swapLine} />
                    <Pressable
                        onPress={handleSwap}
                        style={({ pressed }) => [styles.swapBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
                    >
                        <LinearGradient
                            colors={[...gradient]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.swapBtnInner}
                        >
                            <ArrowDownUp size={18} color="#FFF" strokeWidth={2.5} />
                        </LinearGradient>
                    </Pressable>
                    <View style={styles.swapLine} />
                </View>

                {/* TO result */}
                <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{toLabel}</Text>
                    <LinearGradient
                        colors={hasResult
                            ? [`${gradient[0]}22`, `${gradient[1]}11`]
                            : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.resultRow, hasResult && { borderColor: `${gradient[0]}55` }]}
                    >
                        {toSymbol ? (
                            <Text style={[styles.symbolText, hasResult && { color: gradient[0] }]}>
                                {toSymbol}
                            </Text>
                        ) : null}
                        <Text
                            style={[styles.resultText, hasResult && { color: gradient[0] }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {hasResult ? result : '0'}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Rate chip */}
                <View style={styles.rateChip}>
                    <View style={[styles.rateDot, { backgroundColor: gradient[0] }]} />
                    <Text style={styles.rateText}>
                        1 {fromLabel} = {rate.toLocaleString('en-US', { maximumFractionDigits: 8 })} {toLabel}
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.btnRow}>
                    <SafeButton
                        title="Clear"
                        onPress={handleClear}
                        variant="surface"
                        style={styles.clearBtn}
                    />
                    <SafeButton
                        title="Calculate"
                        onPress={() => calculate(inputValue)}
                        variant="primary"
                        gradientColors={[...gradient]}
                        style={styles.calcBtn}
                    />
                </View>
            </View>

            {/* ── Note ── */}
            <View style={styles.noteCard}>
                <Text style={styles.noteEmoji}>ℹ️</Text>
                <Text style={styles.noteText}>
                    Approximate conversion rate. Actual rates may vary based on Roblox's official pricing and market conditions.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    /* Header */
    header: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    headerShine: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    iconRing: {
        width: 52,
        height: 52,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.28)',
        flexShrink: 0,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 3,
    },
    headerSub: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.75)',
    },

    /* Main card */
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    /* Fields */
    fieldWrap: {
        marginBottom: 4,
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 8,
        marginLeft: 2,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.10)',
        marginBottom: 4,
    },
    inputRowFocused: {
        borderColor: 'rgba(99,102,241,0.6)',
        backgroundColor: 'rgba(99,102,241,0.07)',
    },
    symbolText: {
        fontSize: 22,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.55)',
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 26,
        fontWeight: '800',
        color: '#FFF',
        padding: 0,
        letterSpacing: -0.5,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.06)',
        marginBottom: 4,
        minHeight: 56,
    },
    resultText: {
        flex: 1,
        fontSize: 26,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: -0.5,
    },

    /* Swap */
    swapRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 10,
    },
    swapLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    swapBtn: {
        width: 40,
        height: 40,
    },
    swapBtnInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },

    /* Rate */
    rateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        alignSelf: 'flex-start',
    },
    rateDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        flexShrink: 0,
    },
    rateText: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: -0.2,
    },

    /* Buttons */
    btnRow: {
        flexDirection: 'row',
        gap: 10,
    },
    clearBtn: {
        flex: 1,
        height: 50,
        marginVertical: 0,
    },
    calcBtn: {
        flex: 2,
        height: 50,
        marginVertical: 0,
    },

    /* Note */
    noteCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    noteEmoji: {
        fontSize: 16,
        lineHeight: 20,
    },
    noteText: {
        flex: 1,
        fontSize: 12,
        color: 'rgba(255,255,255,0.35)',
        lineHeight: 18,
        fontWeight: '500',
    },
});
