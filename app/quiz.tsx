import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { useCoins } from '../context/CoinContext';
import { Clock } from 'lucide-react-native';

const QUESTIONS = [
    {
        q: "Who is the creator of Roblox?",
        options: ["David Baszucki", "Erik Cassel", "Both", "None"],
        correct: 2 // Both
    },
    {
        q: "What is the currency in Roblox?",
        options: ["Coins", "Robux", "Tix", "Dollars"],
        correct: 1
    },
    {
        q: "When was Roblox released?",
        options: ["2004", "2006", "2010", "2008"],
        correct: 1 // 2006
    }
];

export default function Quiz() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('quiz', 1);
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('quiz', 1));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAnswer = (index: number) => {
        const isCorrect = index === QUESTIONS[current].correct;
        if (isCorrect) setScore(score + 10);

        if (current < QUESTIONS.length - 1) {
            setCurrent(current + 1);
        } else {
            finishQuiz(score + (isCorrect ? 10 : 0));
        }
    };

    const finishQuiz = (finalScore: number) => {
        setShowResult(true);
        if (finalScore > 0) {
            addCoins(finalScore, 'Quiz Reward');
            setCooldown('quiz');
            setAvailable(false);
        }
    };

    const reset = () => {
        // Only allow reset if available? Or let them play for fun without rewards?
        // Usually cooldown means usage limit.
        // If they finished and got reward, they can't play again for 1h.
        // So this button should probably take them back or be disabled.
        // But if they failed (0 coins), maybe they CAN try again?
        // Logic: "Limit of 1hr" typically applies to "winning" or "attempting".
        // I will apply it to "finishing the quiz".
        if (!available) {
            Alert.alert("Cooldown", "Please wait for the cooldown to finish.");
            return;
        }
        setCurrent(0);
        setScore(0);
        setShowResult(false);
    }

    if (!available && !showResult) {
        return (
            <Container>
                <View style={styles.center}>
                    <Title>ROBLOX QUIZ</Title>
                    <View style={styles.cooldownContainer}>
                        <Clock size={40} color={Colors.red} style={{ marginBottom: 20 }} />
                        <Text style={styles.cooldownTitle}>Quiz Locked</Text>
                        <Text style={styles.cooldownText}>Next Quiz in {timeLeft}</Text>
                    </View>
                </View>
            </Container>
        );
    }

    if (showResult) {
        return (
            <Container>
                <View style={styles.center}>
                    <Title>QUIZ COMPLETE!</Title>
                    <Text style={styles.scoreTitle}>You Earned:</Text>
                    <Text style={styles.score}>{score} Coins</Text>
                    <SafeButton
                        title="BACK TO HOME"
                        onPress={() => { }} // Navigation would be handled by router.back() usually, but here we just leave it. The user can use back button.
                        variant="primary"
                        style={{ marginTop: 40, width: 200 }}
                    />
                </View>
            </Container>
        )
    }

    const question = QUESTIONS[current];

    return (
        <Container>
            <View style={styles.header}>
                <Title>ROBLOX QUIZ</Title>
                <Text style={styles.progress}>Question {current + 1} / {QUESTIONS.length}</Text>
            </View>

            <View style={styles.questionCard}>
                <Text style={styles.questionText}>{question.q}</Text>
            </View>

            <View style={styles.options}>
                {question.options.map((opt, idx) => (
                    <SafeButton
                        key={idx}
                        title={opt}
                        onPress={() => handleAnswer(idx)}
                        variant="primary"
                        gradientColors={['#2A2A2A', '#222']}
                        style={styles.optionBtn}
                        textStyle={{ color: '#FFF' }}
                    />
                ))}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    progress: {
        color: Colors.textSecondary,
    },
    scoreTitle: {
        fontSize: 24,
        color: Colors.text,
        marginBottom: 10,
    },
    score: {
        fontSize: 48,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    questionCard: {
        backgroundColor: Colors.surface,
        padding: 30,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },
    options: {
        gap: 10,
    },
    optionBtn: {
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cooldownContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.red,
    },
    cooldownTitle: {
        color: Colors.red,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cooldownText: {
        color: Colors.textSecondary,
        fontSize: 18,
    }
});
