import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function Title({ children }: { children: string }) {
    return (
        <View style={styles.wrapper}>
            {/* Glow bloom behind text */}
            <View style={styles.glow} />
            <Text style={styles.text}>{children}</Text>
            {/* Subtle underline accent */}
            <LinearGradient
                colors={['transparent', '#10B981', '#6366F1', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.underline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginVertical: 18,
    },
    glow: {
        position: 'absolute',
        width: 180,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#10B981',
        opacity: 0.12,
        top: 4,
        alignSelf: 'center',
        // blur approximated via large borderRadius — real blur needs MaskedView
    },
    text: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: -0.8,
        // Layered text shadow for depth: green glow + dark offset
        textShadowColor: '#10B981',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
    },
    underline: {
        height: 2,
        width: 120,
        borderRadius: 2,
        marginTop: 6,
        opacity: 0.7,
    },
});
