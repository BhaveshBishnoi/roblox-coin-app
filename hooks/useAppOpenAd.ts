import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
    ? TestIds.APP_OPEN
    : '/22846411849,23306138618/JBM_RBXRewards_Appopen';

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

export function useAppOpenAd() {
    const [isLoaded, setIsLoaded] = useState(false);
    const isShowing = useRef(false);
    const appState = useRef(AppState.currentState);

    const loadAd = useCallback(() => {
        try {
            appOpenAd.load();
        } catch (e) {
            console.warn('App Open Ad load error:', e);
        }
    }, []);

    const tryShowAd = useCallback(() => {
        if (isLoaded && !isShowing.current) {
            try {
                isShowing.current = true;
                appOpenAd.show();
            } catch (e) {
                isShowing.current = false;
                console.warn('App Open Ad show error:', e);
            }
        }
    }, [isLoaded]);

    useEffect(() => {
        const unsubLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
            setIsLoaded(true);
        });

        const unsubOpened = appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
            isShowing.current = true;
        });

        const unsubClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
            isShowing.current = false;
            setIsLoaded(false);
            loadAd(); // Reload for next resume
        });

        const unsubError = appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
            setIsLoaded(false);
            isShowing.current = false;
        });

        loadAd();

        return () => {
            unsubLoaded();
            unsubOpened();
            unsubClosed();
            unsubError();
        };
    }, [loadAd]);

    // Show on first launch
    useEffect(() => {
        if (isLoaded && AppState.currentState === 'active') {
            tryShowAd();
        }
    }, [isLoaded]);

    // Show each time the app comes back to foreground
    useEffect(() => {
        const handleAppStateChange = (nextState: AppStateStatus) => {
            const prev = appState.current;
            appState.current = nextState;
            // Only trigger when coming from background/inactive → active
            if ((prev === 'background' || prev === 'inactive') && nextState === 'active') {
                tryShowAd();
            }
        };
        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => sub.remove();
    }, [tryShowAd]);

    return { isLoaded };
}
