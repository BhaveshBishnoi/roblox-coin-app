import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useRewardedAd } from './useRewardedAd';

export function useAdAction() {
    const { isLoaded, isClosed, isEarned, show, loadAd } = useRewardedAd();

    // Use refs to avoid stale-closure issues
    const pendingCallbackRef = useRef<(() => void) | null>(null);
    const isActiveSessionRef = useRef(false); // true only between show() and close

    // When ad closes during an active session → fire callback if earned
    useEffect(() => {
        if (isClosed && isActiveSessionRef.current) {
            isActiveSessionRef.current = false;
            const cb = pendingCallbackRef.current;
            pendingCallbackRef.current = null;

            if (isEarned) {
                cb?.();
            } else {
                console.log('Ad closed without earning reward');
                Alert.alert(
                    'Reward Not Earned',
                    'You must watch the full video to skip the wait time.',
                    [{ text: 'OK' }]
                );
            }
        }
    }, [isClosed, isEarned]);

    const execute = useCallback((callback?: () => void) => {
        if (isLoaded) {
            pendingCallbackRef.current = callback ?? null;
            isActiveSessionRef.current = true;
            show();
        } else {
            // Ad not loaded — do NOT execute callback directly
            console.log('Ad not loaded, cannot show reward ad.');
            Alert.alert(
                'Ad Not Ready',
                'The rewarded ad is still loading or unavailable right now. Please try again soon.',
                [{ text: 'OK' }]
            );
            loadAd(); // aggressively preload for next time
        }
    }, [isLoaded, show, loadAd]);

    return execute;
}
