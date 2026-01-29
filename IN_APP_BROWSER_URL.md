# ✅ In-App Browser Link Updated!

## 🎯 What Was Done

All clicks and actions in the app now open the URL:
**`https://games.biographydata.org`**

## 📱 Where It Opens

The in-app browser opens on **EVERY action** in the app:

### **1. Daily Bonus** (`/app/daily.tsx`)
- ✅ When claiming daily 100 coins
- Opens: `https://games.biographydata.org`

### **2. Lucky Wheel** (`/app/wheel.tsx`)
- ✅ When spinning the wheel
- Opens: `https://games.biographydata.org`

### **3. Scratch Cards** (`/app/scratch.tsx`)
- ✅ When scratching any card
- Opens: `https://games.biographydata.org`

### **4. Quiz** (`/app/quiz.tsx`)
- ✅ When starting a quiz
- ✅ When answering questions
- Opens: `https://games.biographydata.org`

### **5. Flip Cards** (`/app/flip.tsx`)
- ✅ When flipping any card
- Opens: `https://games.biographydata.org`

### **6. Wallet** (`/app/wallet.tsx`)
- ✅ When clicking "Withdraw" button
- Opens: `https://games.biographydata.org`

## 🔧 How It Works

### **useAdAction Hook** (`/hooks/useAdAction.ts`)
```typescript
const TARGET_URL = 'https://games.biographydata.org';

export function useAdAction() {
    const execute = useCallback(async (callback?: () => void) => {
        try {
            // Opens in-app browser
            await WebBrowser.openBrowserAsync(TARGET_URL);
        } catch (error) {
            console.error('Failed to open browser:', error);
        } finally {
            // Execute the reward callback
            if (callback) {
                callback();
            }
        }
    }, []);

    return execute;
}
```

### **Flow:**
1. User clicks/taps any action (claim, spin, scratch, flip, etc.)
2. In-app browser opens → `https://games.biographydata.org`
3. User views the website
4. User closes browser
5. Reward is given (coins added)

## 📊 Summary

**URL:** `https://games.biographydata.org`

**Opens On:**
- ✅ Daily bonus claim
- ✅ Wheel spin
- ✅ Scratch card tap
- ✅ Quiz actions
- ✅ Flip card tap
- ✅ Wallet withdraw

**Browser Type:** In-app browser (expo-web-browser)

**User Experience:**
1. Tap action
2. Browser opens with your website
3. User sees website
4. User closes browser
5. Reward is given

**Your website now opens on every action in the app!** 🚀

---

**Files Using This:**
- `/hooks/useAdAction.ts` - Main hook
- `/app/daily.tsx` - Daily bonus
- `/app/wheel.tsx` - Lucky wheel
- `/app/scratch.tsx` - Scratch cards
- `/app/quiz.tsx` - Quiz
- `/app/flip.tsx` - Flip cards
- `/app/wallet.tsx` - Wallet withdraw

**Status:** ✅ **COMPLETE!**
