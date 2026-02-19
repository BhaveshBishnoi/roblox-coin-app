import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Container } from '../components/Container';
import { SafeButton } from '../components/SafeButton';
import { QUIZZES, Quiz } from '../constants/QuizData';
import { useCoins } from '../context/CoinContext';
import { CheckCircle, XCircle, Star, ChevronLeft, Clock, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function QuizPage() {
    const router = useRouter();
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
            const isReady = checkCooldown('quiz', 2);
            setAvailable(isReady);
            if (!isReady) setTimeLeft(getRemainingTime('quiz', 2));
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

    const DIFF_GRADIENTS: Record<string, readonly [string, string]> = {
        Easy: ['#059669', '#10B981'],
        Medium: ['#D97706', '#F59E0B'],
        Hard: ['#DC2626', '#EF4444'],
    };

    /* ─── Locked Screen ─── */
    if (!available && !showResult && showQuizSelection) {
        return (
            <Container safeArea={false}>
                <LinearGradient colors={['#0A0A1A', '#0D0D24', '#0A0A1A']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.blob, { top: -60, right: -60, backgroundColor: '#8B5CF6' }]} />
                <View style={[styles.blob, { bottom: -60, left: -60, backgroundColor: '#10B981' }]} />

                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Roblox Quiz</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.lockedCenter}>
                    <LinearGradient
                        colors={['#4C1D95', '#5B21B6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.lockedIconCard}
                    >
                        <View style={styles.lockedIconShine} />
                        <Text style={styles.lockedEmoji}>🔒</Text>
                    </LinearGradient>
                    <Text style={styles.lockedTitle}>Quiz Locked</Text>
                    <Text style={styles.lockedSub}>Come back later to test your Roblox knowledge!</Text>

                    <View style={styles.lockedTimerCard}>
                        <Clock size={20} color="#A78BFA" strokeWidth={2} />
                        <View>
                            <Text style={styles.lockedTimerLabel}>Next quiz available in</Text>
                            <Text style={styles.lockedTimerText}>{timeLeft}</Text>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    /* ─── Result Screen ─── */
    if (showResult && currentQuiz) {
        const accuracy = Math.round((score / currentQuiz.reward) * 100);
        const correctAnswers = Math.round(score / (currentQuiz.reward / currentQuiz.questions.length));

        return (
            <Container safeArea={false}>
                <LinearGradient colors={['#0A0A1A', '#0D0D24', '#0A0A1A']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.blob, { top: -60, right: -60, backgroundColor: '#8B5CF6' }]} />

                <View style={styles.header}>
                    <Pressable onPress={reset} style={styles.backButton}>
                        <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Results</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Result Hero */}
                    <LinearGradient
                        colors={score > 0 ? ['#064E3B', '#065F46', '#059669'] : ['#1C1C2E', '#16213E', '#1E293B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.resultHero}
                    >
                        <View style={styles.resultHeroShine} />
                        <Text style={styles.resultEmoji}>{score > 0 ? '🏆' : '😔'}</Text>
                        <Text style={styles.resultTitle}>{score > 0 ? 'Quiz Complete!' : 'Better Luck Next Time'}</Text>
                        <Text style={styles.resultSub}>Here are your results</Text>
                    </LinearGradient>

                    {/* Score Card */}
                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreLabel}>YOU EARNED</Text>
                        <Text style={styles.scoreValue}>{Math.round(score)}</Text>
                        <Text style={styles.scoreCoins}>COINS</Text>

                        <View style={styles.statRow}>
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

                    <SafeButton title="DONE" onPress={reset} variant="primary" style={styles.doneBtn} />
                </ScrollView>
            </Container>
        );
    }

    /* ─── Quiz Selection ─── */
    if (showQuizSelection) {
        return (
            <Container safeArea={false}>
                <LinearGradient colors={['#0A0A1A', '#0D0D24', '#0A0A1A']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.blob, { top: -60, right: -60, backgroundColor: '#8B5CF6' }]} />
                <View style={[styles.blob, { bottom: -60, left: -60, backgroundColor: '#10B981' }]} />

                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Roblox Quiz</Text>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>🧠 {QUIZZES.length}</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {/* Hero Strip */}
                    <LinearGradient
                        colors={['#1E1B4B', '#312E81', '#4338CA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroStrip}
                    >
                        <View style={styles.heroShine} />
                        <Text style={styles.heroEmoji}>🧠</Text>
                        <View>
                            <Text style={styles.heroTitle}>Quiz Challenge</Text>
                            <Text style={styles.heroSub}>Test your Roblox knowledge & earn coins</Text>
                        </View>
                    </LinearGradient>

                    {/* Quiz Cards */}
                    <View style={styles.quizGrid}>
                        {QUIZZES.map((quiz) => (
                            <Pressable
                                key={quiz.id}
                                onPress={() => startQuiz(quiz)}
                                android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
                                style={({ pressed }) => [styles.quizCard, pressed && { opacity: 0.85 }]}
                            >
                                <View style={styles.quizCardLeft}>
                                    <LinearGradient
                                        colors={DIFF_GRADIENTS[quiz.difficulty] ?? ['#475569', '#64748B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.diffBadge}
                                    >
                                        <Text style={styles.diffText}>{quiz.difficulty.toUpperCase()}</Text>
                                    </LinearGradient>
                                    <Text style={styles.quizTitle} numberOfLines={2}>{quiz.title}</Text>
                                    <Text style={styles.quizCategory}>{quiz.category}</Text>
                                </View>

                                <View style={styles.quizCardRight}>
                                    <View style={styles.questionsChip}>
                                        <Text style={styles.questionsText}>📝 {quiz.questions.length}</Text>
                                    </View>
                                    <View style={styles.rewardChip}>
                                        <Star size={13} color="#F59E0B" fill="#F59E0B" />
                                        <Text style={styles.rewardText}>{quiz.reward}</Text>
                                    </View>
                                    <Zap size={20} color="rgba(255,255,255,0.2)" strokeWidth={2} />
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoEmoji}>💡</Text>
                        <Text style={styles.infoTitle}>How it works</Text>
                        <Text style={styles.infoText}>
                            Choose a quiz, answer all questions correctly to earn maximum coins. You can play once every 2 hours!
                        </Text>
                    </View>
                </ScrollView>
            </Container>
        );
    }

    /* ─── Quiz In Progress ─── */
    if (!currentQuiz) return null;
    const question = currentQuiz.questions[current];

    return (
        <Container safeArea={false}>
            <LinearGradient colors={['#0A0A1A', '#0D0D24', '#0A0A1A']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.blob, { top: -60, right: -60, backgroundColor: '#8B5CF6' }]} />

            <View style={styles.header}>
                <Pressable onPress={reset} style={styles.backButton}>
                    <ChevronLeft size={22} color="#FFF" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>{currentQuiz.title}</Text>
                <View style={styles.scoreChip}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.scoreChipText}>{Math.round(score)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Progress */}
                <View style={styles.progressWrap}>
                    <Text style={styles.progressLabel}>
                        Question {current + 1} of {currentQuiz.questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#7C3AED', '#A855F7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.progressFill,
                                { width: `${((current + 1) / currentQuiz.questions.length) * 100}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* Question */}
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
                                variant={showCorrect ? 'primary' : showWrong ? 'danger' : 'surface'}
                                style={[styles.optionBtn, isSelected && styles.optionSelected]}
                                icon={
                                    showCorrect ? <CheckCircle size={20} color="#fff" strokeWidth={2.5} /> :
                                        showWrong ? <XCircle size={20} color="#fff" strokeWidth={2.5} /> : undefined
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
    blob: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        opacity: 0.1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    headerBadge: {
        backgroundColor: 'rgba(139,92,246,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.3)',
    },
    headerBadgeText: {
        color: '#A78BFA',
        fontSize: 13,
        fontWeight: '800',
    },
    scoreChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(245,158,11,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.3)',
    },
    scoreChipText: {
        color: '#F59E0B',
        fontSize: 13,
        fontWeight: '800',
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    /* Locked */
    lockedCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    lockedIconCard: {
        width: 110,
        height: 110,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    lockedIconShine: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    lockedEmoji: {
        fontSize: 52,
    },
    lockedTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 10,
    },
    lockedSub: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 28,
        lineHeight: 22,
    },
    lockedTimerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.2)',
        width: '100%',
    },
    lockedTimerLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    lockedTimerText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#A78BFA',
        letterSpacing: -1,
        fontVariant: ['tabular-nums'],
    },

    /* Results */
    resultHero: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 10,
    },
    resultHeroShine: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    resultEmoji: {
        fontSize: 56,
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    resultSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    scoreCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    scoreLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2.5,
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: '900',
        color: '#10B981',
        letterSpacing: -3,
    },
    scoreCoins: {
        fontSize: 14,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 2.5,
        marginBottom: 24,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    doneBtn: {
        width: '100%',
        height: 56,
    },

    /* Quiz Selection */
    heroStrip: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    heroShine: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    heroEmoji: {
        fontSize: 40,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.4,
        marginBottom: 3,
    },
    heroSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },
    quizGrid: {
        gap: 12,
        marginBottom: 20,
    },
    quizCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        gap: 12,
    },
    quizCardLeft: {
        flex: 1,
        gap: 6,
    },
    diffBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 2,
    },
    diffText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.8,
    },
    quizTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: -0.3,
        lineHeight: 21,
    },
    quizCategory: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.4)',
    },
    quizCardRight: {
        alignItems: 'center',
        gap: 8,
    },
    questionsChip: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    questionsText: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
    },
    rewardChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(245,158,11,0.12)',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.25)',
    },
    rewardText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#F59E0B',
    },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 18,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
    },
    infoEmoji: {
        fontSize: 36,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    infoText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },

    /* In-Progress Quiz */
    progressWrap: {
        marginBottom: 20,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.45)',
        marginBottom: 10,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 100,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 100,
    },
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 28,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        minHeight: 140,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: 28,
        letterSpacing: -0.3,
    },
    options: {
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
