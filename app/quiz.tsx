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
            <Container>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        colors={['#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.lockedIconContainer}
                    >
                        <Text style={styles.lockedIcon}>🔒</Text>
                    </LinearGradient>

                    <Text style={styles.lockedTitle}>Quiz Locked</Text>
                    <Text style={styles.lockedSubtitle}>Come back later to test your Roblox knowledge!</Text>

                    <View style={styles.lockedCard}>
                        <Text style={styles.lockedLabel}>Next quiz available in</Text>
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
            <Container>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>🎉 Quiz Complete!</Text>
                        <Text style={styles.headerSubtitle}>
                            Great job! Here are your results
                        </Text>
                    </View>

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
            <Container>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>🧠 Quiz Challenge</Text>
                        <Text style={styles.headerSubtitle}>
                            Test your Roblox knowledge and earn coins!
                        </Text>
                    </View>

                    {/* Quiz Grid */}
                    <View style={styles.quizGrid}>
                        {QUIZZES.map((quiz) => (
                            <View key={quiz.id} style={styles.quizCardWrapper}>
                                <SafeButton
                                    onPress={() => startQuiz(quiz)}
                                    style={styles.quizCard}
                                    variant="surface"
                                >
                                    <LinearGradient
                                        colors={[
                                            quiz.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.08)' :
                                                quiz.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.08)' :
                                                    'rgba(239, 68, 68, 0.08)',
                                            'rgba(255, 255, 255, 0)'
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={styles.quizCardGradient}
                                    >
                                        <View style={styles.quizCardContent}>
                                            {/* Difficulty Badge */}
                                            <LinearGradient
                                                colors={
                                                    quiz.difficulty === 'Easy' ? ['#10B981', '#059669'] :
                                                        quiz.difficulty === 'Medium' ? ['#F59E0B', '#D97706'] :
                                                            ['#EF4444', '#DC2626']
                                                }
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={styles.difficultyBadge}
                                            >
                                                <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
                                            </LinearGradient>

                                            {/* Quiz Info */}
                                            <View style={styles.quizTitleContainer}>
                                                <Text style={styles.quizTitle} numberOfLines={2}>{quiz.title}</Text>
                                                <Text style={styles.quizCategory} numberOfLines={1}>{quiz.category}</Text>
                                            </View>

                                            {/* Divider */}
                                            <View style={styles.cardDivider} />

                                            {/* Footer */}
                                            <View style={styles.quizFooter}>
                                                <View style={styles.questionsInfo}>
                                                    <Text style={styles.quizQuestions}>📝 {quiz.questions.length} Questions</Text>
                                                </View>
                                                <LinearGradient
                                                    colors={['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={styles.rewardBadge}
                                                >
                                                    <Star size={16} color={Colors.accent} fill={Colors.accent} />
                                                    <Text style={styles.rewardText}>{quiz.reward}</Text>
                                                </LinearGradient>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </SafeButton>
                            </View>
                        ))}
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>💡</Text>
                        <Text style={styles.infoTitle}>How it works</Text>
                        <Text style={styles.infoText}>
                            Choose a quiz, answer all questions correctly to earn maximum coins. You can play once every 2 hours!
                        </Text>
                    </View>
                </ScrollView>
            </Container>
        );
    }

    // Quiz in progress
    if (!currentQuiz) return null;

    const question = currentQuiz.questions[current];

    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {current + 1} of {currentQuiz.questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#8B5CF6', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.progressFill,
                                { width: `${((current + 1) / currentQuiz.questions.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                {/* Quiz Info */}
                <View style={styles.quizInfo}>
                    <Text style={styles.quizInfoTitle}>{currentQuiz.title}</Text>
                    <View style={styles.scoreContainer}>
                        <Star size={16} color={Colors.purple} fill={Colors.purple} />
                        <Text style={styles.quizInfoScore}>{Math.round(score)}</Text>
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
        paddingTop: 16,
        paddingBottom: 40,
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
    lockedIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    lockedIcon: {
        fontSize: 48,
    },
    lockedTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.text,
        letterSpacing: -0.5,
        marginBottom: 12,
        textAlign: 'center',
    },
    lockedSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    infoIcon: {
        fontSize: 36,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 19,
        fontWeight: '500',
    },
    questionsInfo: {
        flex: 1,
    },
    quizGrid: {
        width: '100%',
        gap: 14,
        marginBottom: 24,
    },
    quizCardWrapper: {
        width: '100%',
    },
    quizCard: {
        width: '100%',
        borderRadius: 20,
        marginVertical: 0,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    quizCardGradient: {
        width: '100%',
        height: '100%',
    },
    quizCardContent: {
        padding: 20,
        minHeight: 140,
        justifyContent: 'space-between',
    },
    quizTitleContainer: {
        flex: 1,
        marginBottom: 12,
    },
    cardDivider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginBottom: 12,
    },
    difficultyBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        color: '#fff',
        textTransform: 'uppercase',
    },
    quizTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 6,
        letterSpacing: -0.4,
        lineHeight: 22,
    },
    quizCategory: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
        opacity: 0.8,
    },
    quizFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    quizQuestions: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textTertiary,
        letterSpacing: 0.2,
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    rewardText: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.accent,
        letterSpacing: -0.2,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 10,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
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
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    quizInfoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    quizInfoScore: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.purple,
    },
    questionCard: {
        width: '100%',
        backgroundColor: Colors.surface,
        padding: 28,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        minHeight: 140,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 19,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    options: {
        width: '100%',
        gap: 12,
    },
    optionBtn: {
        width: '100%',
        minHeight: 60,
    },
    optionSelected: {
        transform: [{ scale: 0.98 }],
    },
});
