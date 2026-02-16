import { useCallback, useEffect, useState } from 'react';
import { useRewardedAd } from './useRewardedAd';

// Fallback or additional behavior if needed, but primarily we use the Rewarded Ad now

export function useAdAction() {
    const { isLoaded, isClosed, show, isEarned } = useRewardedAd();
    const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

    // Watch for ad close to trigger the callback
    useEffect(() => {
        if (isClosed && pendingCallback) {
            // User closed the ad. We can check isEarned here if we want to enforce reward.
            // For now, we execute the callback regardless of reward status (as is common for "interstitial-like" behavior)
            // or we could validte isEarned.
            pendingCallback();
            setPendingCallback(null);
        }
    }, [isClosed, pendingCallback]);

    const execute = useCallback((callback?: () => void) => {
        if (isLoaded) {
            if (callback) setPendingCallback(() => callback);
            show();
        } else {
            console.log('Ad not loaded, executing action directly');
            if (callback) {
                callback();
            }
        }
    }, [isLoaded, show]);

    return execute;
}

