import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : '/22846411849,23306138618/JBM_RBXRewards_Rewarded';

export function useRewardedAd() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEarned, setIsEarned] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isShowingRef = useRef(false);

    const rewardedAd = useMemo(() => {
        return RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });
    }, []);

    const loadAd = useCallback(() => {
        if (!isShowingRef.current) {
            try { rewardedAd.load(); } catch (_) { }
        }
    }, [rewardedAd]);

    useEffect(() => {
        const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setIsLoaded(true);
        });

        const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
            console.log('User earned reward:', reward);
            setIsEarned(true);
        });

        const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
            isShowingRef.current = false;
            setIsLoaded(false);
            setIsClosed(true);   // signals useAdAction to fire callback
            rewardedAd.load();   // preload next
        });

        const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (err) => {
            console.error('Rewarded Ad failed to load', err);
            setError(err);
            setIsLoaded(false);
            isShowingRef.current = false;
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
        if (isLoaded && !isShowingRef.current) {
            try {
                // CRITICAL: reset isClosed so useAdAction detects the new false→true transition
                setIsClosed(false);
                setIsEarned(false);
                isShowingRef.current = true;
                rewardedAd.show();
            } catch (e) {
                console.error('Failed to show ad:', e);
                isShowingRef.current = false;
                loadAd();
            }
        } else if (!isLoaded) {
            console.warn('Rewarded ad not loaded yet, preloading...');
            loadAd();
        }
    }, [isLoaded, rewardedAd, loadAd]);

    return { isLoaded, isEarned, isClosed, error, show, loadAd };
}
