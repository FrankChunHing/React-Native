import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, SectionList } from 'react-native';

const Quiz = () => {
    const [fetchedQuizData, setFetchedQuizData] = useState([]);

    const fetchQuizData = async () => {
        const url = `https://opentdb.com/api.php?amount=5&type=multiple`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            // Transform the data into a format suitable for SectionList
            const sections = data.results.map((item, index) => ({
                title: `Question ${index + 1}: ${item.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}`,
                data: [{
                    question: item.question,
                    correct_answer: item.correct_answer,
                    incorrect_answers: item.incorrect_answers
                }],
            }));
            setFetchedQuizData(sections);
        } catch (error) {
            console.error('could not fetch Quiz data', error);
        }
    };

    useEffect(() => {
        fetchQuizData();
        console.log(fetchedQuizData);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.questionContainer}>
            <Text style={styles.answerText}>{item.correct_answer}</Text>
            {item.incorrect_answers.map((answer, index) => (
                <Text key={index} style={styles.answerText}>{answer}</Text>
            ))}
        </View>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {fetchedQuizData.length === 0 ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <SectionList
                    sections={fetchedQuizData}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    questionContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 1,
    },
    answerText: {
        fontSize: 14,
        marginBottom: 4,
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#ececec',
        borderRadius: 8,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Quiz;
