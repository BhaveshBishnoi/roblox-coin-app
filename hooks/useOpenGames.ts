import { useCallback, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';

const GAMES_URL = 'https://rbx.dhakshsolutions.com/games';

// Minimum gap between browser opens: 3 minutes (in ms)
const MIN_INTERVAL_MS = 3 * 60 * 1000;

export function useOpenGames() {
    const lastOpenedAt = useRef<number>(0);

    return useCallback(async () => {
        const now = Date.now();
        const elapsed = now - lastOpenedAt.current;

        // Skip if opened less than 3 minutes ago
        if (lastOpenedAt.current > 0 && elapsed < MIN_INTERVAL_MS) {
            return;
        }

        lastOpenedAt.current = now;

        try {
            await WebBrowser.openBrowserAsync(GAMES_URL, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                showInRecents: false,
            });
        } catch (e) {
            console.warn('Failed to open games browser:', e);
            // Reset timestamp so next attempt is not blocked
            lastOpenedAt.current = 0;
        }
    }, []);
}
