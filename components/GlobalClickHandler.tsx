import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const REDIRECT_URL = 'https://games.biographydata.org/';

export function GlobalClickHandler({ children }: { children: React.ReactNode }) {
    const handleGlobalClick = async () => {
        try {
            await WebBrowser.openBrowserAsync(REDIRECT_URL);
        } catch (error) {
            console.error('Failed to open browser:', error);
        }
    };

    return (
        <View style={styles.container}>
            {children}
            <Pressable
                style={styles.overlay}
                onPress={handleGlobalClick}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        backgroundColor: 'transparent',
    },
});
