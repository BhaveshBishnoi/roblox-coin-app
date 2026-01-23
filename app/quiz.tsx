import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { useCoins } from '../context/CoinContext';
import { Clock, Trophy, CheckCircle, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const QUESTIONS = [
    {
        q: "Who is the creator of Roblox?",
        options: ["David Baszucki", "Erik Cassel", "Both", "None"],
        correct: 2
    },
    {
        q: "What is the currency in Roblox?",
        options: ["Coins", "Robux", "Tix", "Dollars"],
        correct: 1
    },
    {
        q: "When was Roblox released?",
        options: ["2004", "2006", "2010", "2008"],
        correct: 1
    }
];

export default function Quiz() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        const correct = index === QUESTIONS[current].correct;
        setIsCorrect(correct);

        if (correct) setScore(score + 10);

        setTimeout(() => {
            if (current < QUESTIONS.length - 1) {
                setCurrent(current + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                finishQuiz(score + (correct ? 10 : 0));
            }
        }, 1500);
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
        setCurrent(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    if (!available && !showResult) {
        return (
            <Container safeArea={false}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        colors={['#a855f7', '#9333ea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconContainer}
                    >
                        <Clock size={48} color="#fff" strokeWidth={2.5} />
                    </LinearGradient>
                    <Text style={styles.title}>Quiz Locked</Text>
                    <Text style={styles.subtitle}>Come back later to test your knowledge</Text>

                    <View style={styles.lockedCard}>
                        <Text style={styles.lockedLabel}>Next quiz in</Text>
                        <Text style={styles.lockedTime}>{timeLeft}</Text>
                    </View>
                </ScrollView>
            </Container>
        );
    }

    if (showResult) {
        return (
            <Container safeArea={false}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        colors={['#22c55e', '#16a34a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.iconContainer}
                    >
                        <Trophy size={48} color="#fff" strokeWidth={2.5} />
                    </LinearGradient>
                    <Text style={styles.title}>Quiz Complete!</Text>
                    <Text style={styles.subtitle}>Great job on completing the quiz</Text>

                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>You Earned</Text>
                        <Text style={styles.resultScore}>{score}</Text>
                        <Text style={styles.resultCoins}>COINS</Text>

                        <View style={styles.resultStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{Math.round((score / 30) * 100)}%</Text>
                                <Text style={styles.statLabel}>Accuracy</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{score / 10}/{QUESTIONS.length}</Text>
                                <Text style={styles.statLabel}>Correct</Text>
                            </View>
                        </View>
                    </View>

                    <SafeButton
                        title="DONE"
                        onPress={reset}
                        variant="primary"
                        style={styles.doneBtn}
                    />
                </ScrollView>
            </Container>
        );
    }

    const question = QUESTIONS[current];

    return (
        <Container safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Question {current + 1} of {QUESTIONS.length}</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${((current + 1) / QUESTIONS.length) * 100}%` }]} />
                    </View>
                </View>

                {/* Question Card */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{question.q}</Text>
                </View>

                {/* Options */}
                <View style={styles.options}>
                    {question.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrectAnswer = idx === question.correct;
                        const showCorrect = selectedAnswer !== null && isCorrectAnswer;
                        const showWrong = isSelected && !isCorrect;

                        return (
                            <SafeButton
                                key={idx}
                                title={opt}
                                onPress={() => handleAnswer(idx)}
                                variant={showCorrect ? "primary" : showWrong ? "danger" : "surface"}
                                style={[
                                    styles.optionBtn,
                                    isSelected ? styles.optionSelected : undefined
                                ]}
                                icon={
                                    showCorrect ? <CheckCircle size={20} color="#fff" strokeWidth={2.5} /> :
                                        showWrong ? <XCircle size={20} color="#fff" strokeWidth={2.5} /> :
                                            undefined
                                }
                                disabled={selectedAnswer !== null}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 100,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '500',
    },
    lockedCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    lockedLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    lockedTime: {
        fontSize: 36,
        fontWeight: '900',
        color: Colors.text,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1,
    },
    resultCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    resultScore: {
        fontSize: 64,
        fontWeight: '900',
        color: Colors.success,
        letterSpacing: -2,
    },
    resultCoins: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.success,
        marginBottom: 24,
        letterSpacing: 2,
    },
    resultStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: Colors.border,
    },
    doneBtn: {
        width: '100%',
        height: 56,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 100,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 100,
    },
    questionCard: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 28,
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    questionText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 28,
        letterSpacing: -0.4,
    },
    options: {
        width: '100%',
        gap: 12,
    },
    optionBtn: {
        width: '100%',
        height: 56,
    },
    optionSelected: {
        transform: [{ scale: 0.98 }],
    },
});
