import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    onPress?: () => void;
    title?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    gradientColors?: readonly [string, string, ...string[]];
    variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'purple' | 'surface';
    icon?: React.ReactNode;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function SafeButton({ onPress, title, style, textStyle, gradientColors, variant = 'primary', icon, children, disabled }: Props) {
    const handlePress = () => {
        if (disabled) return;
        onPress?.();
    };

    const getColors = (): readonly [string, string, ...string[]] => {
        if (gradientColors) return gradientColors;
        if (disabled) return ['#E5E7EB', '#D1D5DB'];

        switch (variant) {
            case 'secondary': return ['#60A5FA', '#2563EB'];
            case 'danger': return ['#F87171', '#DC2626'];
            case 'accent': return ['#FACC15', '#EAB308'];
            case 'purple': return ['#C084FC', '#9333EA'];
            case 'surface': return ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.06)'] as const;
            default: return ['#4ADE80', '#16A34A'];
        }
    };

    const getTextColor = () => {
        if (textStyle && (textStyle as TextStyle).color) return {};
        if (disabled) return { color: '#9CA3AF' };

        switch (variant) {
            case 'surface':
                return { color: 'rgba(255,255,255,0.75)' };
            default:
                return { color: '#FFFFFF' };
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={[styles.container, style]} disabled={disabled}>
            <LinearGradient
                colors={getColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {icon}
                {title ? <Text style={[styles.text, getTextColor(), textStyle, icon ? { marginLeft: 8 } : undefined]}>{title}</Text> : null}
                {children}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 0,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        backgroundColor: 'transparent',
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 24,
    },
    text: {
        fontWeight: '800',
        fontSize: 16,
        textTransform: 'uppercase',
    }
});
