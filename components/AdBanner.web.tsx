import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AdBanner = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>AdBanner Placeholder (Web)</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        width: '100%',
        height: 250,
        backgroundColor: '#f0f0f0',
    },
    text: {
        color: '#888',
    }
});
