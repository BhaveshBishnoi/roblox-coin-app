import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : '/22846411849,23306138618/JBM_RBXRewards_Appopen';

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

export function useAppOpenAd() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isShowing, setIsShowing] = useState(false);

    const loadAd = useCallback(() => {
        appOpenAd.load();
    }, []);

    useEffect(() => {
        const unsubscribeLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
            setIsLoaded(true);
        });

        const unsubscribeOpened = appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
            setIsShowing(true);
        });

        const unsubscribeClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
            setIsLoaded(false);
            setIsShowing(false);
            loadAd();
        });

        const unsubscribeError = appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
            console.error('App Open Ad failed to load', error);
            setIsLoaded(false);
            // Retry loading after a delay or just leave it
        });

        loadAd();

        return () => {
            unsubscribeLoaded();
            unsubscribeOpened();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, [loadAd]);

    // Handle app state changes to show ad on resume
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isLoaded && !isShowing) {
                appOpenAd.show();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [isLoaded, isShowing]);

    return { isLoaded };
}
