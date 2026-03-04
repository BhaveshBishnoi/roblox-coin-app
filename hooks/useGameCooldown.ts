import { useState, useEffect } from 'react';
import { useCoins } from '../context/CoinContext';

/**
 * Manages cooldowns and 1-time ad skips for game features.
 * @param key The unique key for the game (e.g. 'daily', 'flip')
 * @param durationHours The cooldown duration in hours
 */
export function useGameCooldown(key: string, durationHours: number) {
    const { checkCooldown, getRemainingTime, setCooldown } = useCoins();
    const [isAvailable, setIsAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [adSkipUsed, setAdSkipUsed] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            const ready = checkCooldown(key, durationHours);

            // If the natural cooldown is done OR we used our 1 ad skip, the feature is available
            setIsAvailable(ready || adSkipUsed);

            if (!ready) {
                setTimeLeft(getRemainingTime(key, durationHours));
            } else {
                setTimeLeft(null);
                // Reset the ad skip flag when the natural cooldown finishes
                setAdSkipUsed(false);
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, [key, durationHours, checkCooldown, getRemainingTime, adSkipUsed]);

    const handleUseFeature = async () => {
        // Natural cooldown starts now
        await setCooldown(key);
        setIsAvailable(false);
        // We just consumed the feature (whether by waiting or via ad skip),
        // but if we used the ad skip, we must ensure it stays 'used' so they can't skip again 
        // until the NEW natural cooldown finishes. If they just waited normally, adSkipUsed is already false.
    };

    const handleAdSkip = () => {
        if (!adSkipUsed) {
            setAdSkipUsed(true);
            setIsAvailable(true); // Temporarily unlock the feature for 1 use
        }
    };

    return {
        isAvailable,       // True if natural cooldown is done OR ad was just watched
        timeLeft,          // Formatted MM:SS or HH:MM:SS
        adSkipUsed,        // True if the ad skip was already used this cycle
        canUseAdSkip: !checkCooldown(key, durationHours) && !adSkipUsed, // True if waiting AND haven't used skip yet
        handleUseFeature,  // Call when game finishes to reset timer
        handleAdSkip       // Call when ad finishes
    };
}
