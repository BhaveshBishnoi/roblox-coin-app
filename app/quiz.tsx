import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { QUIZZES, Quiz, getRandomQuiz } from '../constants/QuizData';
import { useCoins } from '../context/CoinContext';
import { CheckCircle, XCircle, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function QuizPage() {
    const { addCoins, checkCooldown, setCooldown, getRemainingTime } = useCoins();
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showQuizSelection, setShowQuizSelection] = useState(true);

    const [available, setAvailable] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            const isReady = checkCooldown('quiz', 2); // 2 hours cooldown
            setAvailable(isReady);
            if (!isReady) {
                setTimeLeft(getRemainingTime('quiz', 2));
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    const startQuiz = (quiz: Quiz) => {
        setCurrentQuiz(quiz);
        setShowQuizSelection(false);
        setCurrent(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null || !currentQuiz) return;

        setSelectedAnswer(index);
        const correct = index === currentQuiz.questions[current].correct;
        setIsCorrect(correct);

        if (correct) setScore(score + currentQuiz.reward / currentQuiz.questions.length);

        setTimeout(() => {
            if (current < currentQuiz.questions.length - 1) {
                setCurrent(current + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                finishQuiz(score + (correct ? currentQuiz.reward / currentQuiz.questions.length : 0));
            }
        }, 1500);
    };

    const finishQuiz = (finalScore: number) => {
        setShowResult(true);
        if (finalScore > 0) {
            addCoins(Math.round(finalScore), 'Quiz Reward');
            setCooldown('quiz');
            setAvailable(false);
        }
    };

    const reset = () => {
        setShowQuizSelection(true);
        setCurrentQuiz(null);
        setCurrent(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    // Locked state
    if (!available && !showResult) {
        return (
            <Container safeArea={false}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.lockedCard}>
                        <Text style={styles.lockedLabel}>Next quiz in</Text>
                        <Text style={styles.lockedTime}>{timeLeft}</Text>
                    </View>
                </ScrollView>
            </Container>
        );
    }

    // Result state
    if (showResult && currentQuiz) {
        const accuracy = Math.round((score / currentQuiz.reward) * 100);
        const correctAnswers = Math.round(score / (currentQuiz.reward / currentQuiz.questions.length));

        return (
            <Container safeArea={false}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>You Earned</Text>
                        <Text style={styles.resultScore}>{Math.round(score)}</Text>
                        <Text style={styles.resultCoins}>COINS</Text>

                        <View style={styles.resultStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{accuracy}%</Text>
                                <Text style={styles.statLabel}>Accuracy</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{correctAnswers}/{currentQuiz.questions.length}</Text>
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

    // Quiz selection state
    if (showQuizSelection) {
        return (
            <Container safeArea={false}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.quizGrid}>
                        {QUIZZES.map((quiz) => (
                            <View key={quiz.id} style={styles.quizCardWrapper}>
                                <SafeButton
                                    onPress={() => startQuiz(quiz)}
                                    style={styles.quizCard}
                                    variant="surface"
                                >
                                    <View style={styles.quizCardContent}>
                                        <View style={[
                                            styles.difficultyBadge,
                                            {
                                                backgroundColor:
                                                    quiz.difficulty === 'Easy' ? '#D1FAE5' :
                                                        quiz.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2'
                                            }
                                        ]}>
                                            <Text style={[
                                                styles.difficultyText,
                                                {
                                                    color:
                                                        quiz.difficulty === 'Easy' ? '#059669' :
                                                            quiz.difficulty === 'Medium' ? '#D97706' : '#DC2626'
                                                }
                                            ]}>{quiz.difficulty}</Text>
                                        </View>
                                        <Text style={styles.quizTitle}>{quiz.title}</Text>
                                        <Text style={styles.quizCategory}>{quiz.category}</Text>
                                        <View style={styles.quizFooter}>
                                            <Text style={styles.quizQuestions}>{quiz.questions.length} Questions</Text>
                                            <View style={styles.rewardBadge}>
                                                <Star size={12} color={Colors.accent} fill={Colors.accent} />
                                                <Text style={styles.rewardText}>{quiz.reward}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </SafeButton>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Container>
        );
    }

    // Quiz in progress
    if (!currentQuiz) return null;

    const question = currentQuiz.questions[current];

    return (
        <Container safeArea={false}>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Question {current + 1} of {currentQuiz.questions.length}</Text>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#8B5CF6', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${((current + 1) / currentQuiz.questions.length) * 100}%` }]}
                        />
                    </View>
                </View>

                {/* Quiz Info */}
                <View style={styles.quizInfo}>
                    <Text style={styles.quizInfoTitle}>{currentQuiz.title}</Text>
                    <Text style={styles.quizInfoScore}>Score: {Math.round(score)}</Text>
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
        paddingHorizontal: 18,
        paddingTop: 16,
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
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 28,
        fontWeight: '500',
        paddingHorizontal: 20,
    },
    lockedCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
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
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
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
    quizGrid: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quizCardWrapper: {
        width: (width - 48) / 2,
    },
    quizCard: {
        width: '100%',
        borderRadius: 16,
        marginVertical: 0,
        overflow: 'hidden',
    },
    quizCardContent: {
        padding: 16,
        minHeight: 160,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    quizTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    quizCategory: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    quizFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    quizQuestions: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textTertiary,
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    rewardText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.accent,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 20,
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
        backgroundColor: Colors.borderLight,
        borderRadius: 100,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 100,
    },
    quizInfo: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    quizInfoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    quizInfoScore: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.purple,
    },
    questionCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 26,
        letterSpacing: -0.3,
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
