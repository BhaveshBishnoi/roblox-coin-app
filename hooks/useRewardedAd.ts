import { useEffect, useState, useCallback, useRef } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : '/22846411849,23306138618/JBM_RBXRewards_Rewarded';

const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

export function useRewardedAd() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEarned, setIsEarned] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadAd = useCallback(() => {
        rewardedAd.load();
    }, []);

    useEffect(() => {
        const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setIsLoaded(true);
        });

        const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
            console.log('User earned reward of ', reward);
            setIsEarned(true);
        });

        const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
            setIsClosed(true);
            setIsLoaded(false);
            loadAd(); // Preload the next ad
        });

        const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
            console.error('Rewarded Ad failed to load', error);
            setError(error);
            setIsLoaded(false);
        });

        loadAd();

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, [loadAd]);

    const show = useCallback(() => {
        if (isLoaded) {
            rewardedAd.show();
            setIsEarned(false); // Reset for new showing
            setIsClosed(false);
        } else {
            console.warn('Ad not loaded yet');
            loadAd(); // Try loading again if not loaded
        }
    }, [isLoaded, loadAd]);

    return { isLoaded, isEarned, isClosed, error, show };
}
