import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function Title({ children }: { children: string }) {
    return (
        <View style={styles.wrapper}>
            {/* Soft green glow bloom */}
            <View style={styles.glow} />
            <Text style={styles.text}>{children}</Text>
            {/* Gradient underline accent */}
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
        backgroundColor: 'transparent',
    },
    glow: {
        position: 'absolute',
        width: 180,
        height: 36,
        borderRadius: 50,
        backgroundColor: '#10B981',
        opacity: 0.1,
        top: 6,
        alignSelf: 'center',
    },
    text: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: -0.8,
        backgroundColor: 'transparent',
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
