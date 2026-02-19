import { useEffect, useState, useCallback, useMemo } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : '/22846411849,23306138618/JBM_RBXRewards_Rewarded';

export function useRewardedAd() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEarned, setIsEarned] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Create a new instance for each use of the hook to avoid global state conflicts
    const rewardedAd = useMemo(() => {
        return RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });
    }, []);

    const loadAd = useCallback(() => {
        // Only load if not already loaded (though createsForAdRequest makes a new one, so it starts unloaded)
        rewardedAd.load();
    }, [rewardedAd]);

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
            // We don't auto-reload here because this instance is likely tied to the component's lifecycle
            // If the user wants to show another ad, they might re-mount or we can expose a reload function
            // But for now, let's auto-reload to keep the existing behavior if they keep the component open
            rewardedAd.load();
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
    }, [rewardedAd, loadAd]);

    const show = useCallback(() => {
        if (isLoaded) {
            try {
                rewardedAd.show();
                setIsEarned(false); // Reset for new showing
                setIsClosed(false);
            } catch (e) {
                console.error("Failed to show ad:", e);
                // Fallback: try to load again if show failed
                loadAd();
            }
        } else {
            console.warn('Ad not loaded yet');
            loadAd(); // Try loading again if not loaded
        }
    }, [isLoaded, loadAd, rewardedAd]);

    return { isLoaded, isEarned, isClosed, error, show };
}
