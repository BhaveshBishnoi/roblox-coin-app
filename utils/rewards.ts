/**
 * Centralized logic for calculating coin rewards.
 * Returns a value between 1 and 10.
 */
export function generateCoinReward(): number {
    return Math.floor(Math.random() * 10) + 1;
}
