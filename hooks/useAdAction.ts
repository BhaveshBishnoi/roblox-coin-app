import { useCallback, useEffect, useRef } from 'react';
import { useRewardedAd } from './useRewardedAd';

export function useAdAction() {
    const { isLoaded, isClosed, isEarned, show, loadAd } = useRewardedAd();

    // Use refs to avoid stale-closure issues
    const pendingCallbackRef = useRef<(() => void) | null>(null);
    const isActiveSessionRef = useRef(false); // true only between show() and close

    // When ad closes during an active session → fire callback
    useEffect(() => {
        if (isClosed && isActiveSessionRef.current) {
            isActiveSessionRef.current = false;
            const cb = pendingCallbackRef.current;
            pendingCallbackRef.current = null;
            cb?.();
        }
    }, [isClosed]);

    const execute = useCallback((callback?: () => void) => {
        if (isLoaded) {
            pendingCallbackRef.current = callback ?? null;
            isActiveSessionRef.current = true;
            show();
        } else {
            // Ad not loaded — execute the callback directly and preload for next time
            console.log('Ad not loaded, executing action directly and preloading');
            loadAd();
            callback?.();
        }
    }, [isLoaded, show, loadAd]);

    return execute;
}
