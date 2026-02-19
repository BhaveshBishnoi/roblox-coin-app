import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function Title({ children }: { children: string }) {
    return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
    text: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginVertical: 16,
        letterSpacing: -0.5,
        textShadowColor: '#10B981',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 12,
    },
});
