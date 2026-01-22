import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/Container';
import { Title } from '../components/Title';
import { SafeButton } from '../components/SafeButton';
import { Colors } from '../constants/Colors';
import { CheckCircle, XCircle } from 'lucide-react-native';

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
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (index: number) => {
        const isCorrect = index === QUESTIONS[current].correct;
        if (isCorrect) setScore(score + 10);

        if (current < QUESTIONS.length - 1) {
            setCurrent(current + 1);
        } else {
            setShowResult(true);
        }
    };

    const reset = () => {
        setCurrent(0);
        setScore(0);
        setShowResult(false);
    }

    if (showResult) {
        return (
            <Container>
                <View style={styles.center}>
                    <Title>QUIZ COMPLETE!</Title>
                    <Text style={styles.scoreTitle}>You Earned:</Text>
                    <Text style={styles.score}>{score} Coins</Text>
                    <SafeButton title="PLAY AGAIN" onPress={reset} variant="primary" style={{ marginTop: 40, width: 200 }} />
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
    }
});
