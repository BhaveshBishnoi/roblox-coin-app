import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
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
    const hasShownOnLaunch = useRef(false); // ensures we only ever show once per cold start

    const loadAd = useCallback(() => {
        try {
            appOpenAd.load();
        } catch (e) {
            console.warn('App Open Ad load error:', e);
        }
    }, []);

    const tryShowAd = useCallback(() => {
        if (isLoaded && !isShowing.current && !hasShownOnLaunch.current) {
            try {
                hasShownOnLaunch.current = true;
                isShowing.current = true;
                appOpenAd.show();
            } catch (e) {
                isShowing.current = false;
                hasShownOnLaunch.current = false;
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
            // Do NOT reload — we never want to show again this session
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

    // Show once when the ad first loads on launch (cold start only)
    useEffect(() => {
        if (isLoaded && AppState.currentState === 'active') {
            tryShowAd();
        }
    }, [isLoaded, tryShowAd]);

    // NOTE: No AppState change listener — we intentionally do NOT show on background→foreground

    return { isLoaded };
}
