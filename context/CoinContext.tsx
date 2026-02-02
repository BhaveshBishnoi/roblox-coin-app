import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
    id: string;
    type: 'earn' | 'spend';
    amount: number;
    source: string;
    date: number;
}

interface RewardPopup {
    visible: boolean;
    amount: number;
    source: string;
}

interface CoinContextType {
    balance: number;
    transactions: Transaction[];
    rewardPopup: RewardPopup;
    addCoins: (amount: number, source: string) => void;
    subtractCoins: (amount: number) => boolean;
    checkCooldown: (key: string, durationHours: number) => boolean;
    setCooldown: (key: string) => void;
    getRemainingTime: (key: string, durationHours: number) => string | null;
    hideRewardPopup: () => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export function useCoins() {
    const context = useContext(CoinContext);
    if (!context) throw new Error('useCoins must be used within a CoinProvider');
    return context;
}

export function CoinProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
    const [rewardPopup, setRewardPopup] = useState<RewardPopup>({
        visible: false,
        amount: 0,
        source: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedBalance = await AsyncStorage.getItem('roblox_coins');
            const storedCooldowns = await AsyncStorage.getItem('roblox_cooldowns');
            const storedHistory = await AsyncStorage.getItem('roblox_history');

            if (storedBalance) setBalance(parseInt(storedBalance, 10));
            if (storedCooldowns) setCooldowns(JSON.parse(storedCooldowns));
            if (storedHistory) setTransactions(JSON.parse(storedHistory));
        } catch (e) {
            console.error("Failed to load data", e);
        }
    };

    const addCoins = async (amount: number, source: string) => {
        const newBalance = balance + amount;
        setBalance(newBalance);

        const newTx: Transaction = {
            id: Date.now().toString(),
            type: 'earn',
            amount,
            source,
            date: Date.now()
        };
        const newHistory = [newTx, ...transactions].slice(0, 50); // Keep last 50
        setTransactions(newHistory);

        await AsyncStorage.multiSet([
            ['roblox_coins', newBalance.toString()],
            ['roblox_history', JSON.stringify(newHistory)]
        ]);

        // Show reward popup
        setRewardPopup({
            visible: true,
            amount,
            source,
        });
    };

    const hideRewardPopup = () => {
        setRewardPopup({
            visible: false,
            amount: 0,
            source: '',
        });
    };

    const subtractCoins = (amount: number) => {
        if (balance >= amount) {
            const newBalance = balance - amount;
            setBalance(newBalance);
            AsyncStorage.setItem('roblox_coins', newBalance.toString());
            return true;
        }
        return false;
    };

    const setCooldown = async (key: string) => {
        const now = Date.now();
        const newCooldowns = { ...cooldowns, [key]: now };
        setCooldowns(newCooldowns);
        await AsyncStorage.setItem('roblox_cooldowns', JSON.stringify(newCooldowns));
    };

    const checkCooldown = (key: string, durationHours: number) => {
        const lastTime = cooldowns[key];
        if (!lastTime) return true; // Available

        const now = Date.now();
        const diff = now - lastTime;
        const durationMs = durationHours * 60 * 60 * 1000;

        return diff >= durationMs;
    };

    const getRemainingTime = (key: string, durationHours: number): string | null => {
        const lastTime = cooldowns[key];
        if (!lastTime) return null;

        const now = Date.now();
        const diff = now - lastTime;
        const durationMs = durationHours * 60 * 60 * 1000;

        if (diff >= durationMs) return null;

        const remainingMs = durationMs - diff;
        const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
        const hours = Math.floor((remainingMs / (1000 * 60 * 60)));
        const seconds = Math.floor((remainingMs / 1000) % 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <CoinContext.Provider value={{ balance, transactions, rewardPopup, addCoins, subtractCoins, checkCooldown, setCooldown, getRemainingTime, hideRewardPopup }}>
            {children}
        </CoinContext.Provider>
    );
}
