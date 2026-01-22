import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAdAction } from '../hooks/useAdAction';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    onPress?: () => void;
    title?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradientColors?: readonly [string, string, ...string[]];
    variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'purple' | 'surface';
    icon?: React.ReactNode;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function SafeButton({ onPress, title, style, textStyle, gradientColors, variant = 'primary', icon, children, disabled }: Props) {
    const triggerAd = useAdAction();

    const handlePress = () => {
        if (disabled) return;
        triggerAd(onPress);
    };

    const getColors = (): readonly [string, string, ...string[]] => {
        if (gradientColors) return gradientColors;
        if (disabled) return ['#444', '#333'];
        switch (variant) {
            case 'secondary': return [Colors.secondary, '#0066CC'];
            case 'danger': return [Colors.red, '#CC0000'];
            case 'accent': return [Colors.accent, '#FFA500'];
            case 'purple': return [Colors.purple, '#6600CC'];
            case 'surface': return [Colors.surface, Colors.surfaceHighlight];
            default: return [Colors.primary, '#008F22'];
        }
    };

    const getTextColor = () => {
        if (textStyle && (textStyle as TextStyle).color) return {}; // specific override
        if (disabled) return { color: '#AAA' };
        switch (variant) {
            case 'purple':
            case 'danger':
            case 'secondary':
            case 'surface':
                return { color: '#FFF' };
            default:
                return { color: '#000' };
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={[styles.container, style]} disabled={disabled}>
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
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: '800',
        fontSize: 16,
        textTransform: 'uppercase',
    }
});
