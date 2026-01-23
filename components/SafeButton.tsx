import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useAdAction } from '../hooks/useAdAction';
import { Colors } from '../constants/Colors';
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
    const triggerAd = useAdAction();

    const handlePress = () => {
        if (disabled) return;
        triggerAd(onPress);
    };

    const getColors = (): readonly [string, string, ...string[]] => {
        if (gradientColors) return gradientColors;
        if (disabled) return ['#E5E7EB', '#D1D5DB'];

        // Brighter, more vibrant gradients
        switch (variant) {
            case 'secondary': return ['#60A5FA', '#2563EB']; // Bright Blue
            case 'danger': return ['#F87171', '#DC2626']; // Soft Red to Bold Red
            case 'accent': return ['#FACC15', '#EAB308']; // Bright Yellow/Gold
            case 'purple': return ['#C084FC', '#9333EA']; // Vivid Purple
            case 'surface': return ['#F9FAFB', '#F3F4F6']; // Subtle White/Gray
            default: return ['#4ADE80', '#16A34A']; // Vibrant Green
        }
    };

    const getTextColor = () => {
        if (textStyle && (textStyle as TextStyle).color) return {};
        if (disabled) return { color: '#9CA3AF' };

        switch (variant) {
            case 'surface':
                return { color: Colors.text };
            default:
                return { color: '#FFFFFF' }; // White text for all colored cards for better contrast
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
        borderRadius: 24, // Softer corners
        padding: 0,
        marginVertical: 6,
        // Softer shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        backgroundColor: 'transparent', // Ensure no background shows through
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '100%', // FORCE FILL
    },
    text: {
        fontWeight: '800',
        fontSize: 16,
        textTransform: 'uppercase',
    }
});
