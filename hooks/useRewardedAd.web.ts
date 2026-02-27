import { useCallback } from 'react';

export function useRewardedAd() {
    const show = useCallback(() => {
        console.warn('Rewarded ads are not supported on the web.');
    }, []);

    return {
        isLoaded: false,
        isEarned: false,
        isClosed: false,
        error: null,
        show
    };
}
