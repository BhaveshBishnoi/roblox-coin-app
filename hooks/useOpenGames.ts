import { useCallback, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';

const GAMES_URL = 'https://rbx.dhakshsolutions.com/games';

export function useOpenGames() {
    const isOpenRef = useRef(false);

    return useCallback(async () => {
        // Prevent double-open if already showing
        if (isOpenRef.current) return;
        isOpenRef.current = true;

        try {
            await WebBrowser.openBrowserAsync(GAMES_URL, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                showInRecents: false,
            });
        } catch (e) {
            console.warn('Failed to open games browser:', e);
        } finally {
            isOpenRef.current = false;
        }
    }, []);
}
