import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';

const TARGET_URL = 'https://games.biographydata.org';

export function useAdAction() {
    const execute = useCallback(async (callback?: () => void) => {
        try {
            // Open the browser modally. 
            // On iOS, this waits until the user closes it (if using openAuthSession, but openBrowserAsync usually returns immediately or handles simple presentation).
            // However, for an "Ad" effect, we want the user to see it.
            await WebBrowser.openBrowserAsync(TARGET_URL);
        } catch (error) {
            console.error('Failed to open browser:', error);
        } finally {
            // Execute the actual action once the browser interaction is initiated/done
            if (callback) {
                callback();
            }
        }
    }, []);

    return execute;
}
