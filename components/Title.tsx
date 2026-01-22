import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export function Title({ children }: { children: string }) {
    return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.text,
        textAlign: 'center',
        marginVertical: 20,
        textShadowColor: Colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    }
});
