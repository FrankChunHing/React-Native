import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, SectionList, FlatList, TouchableOpacity } from 'react-native';
import { Raleway_200ExtraLight } from "@expo-google-fonts/raleway";
import { Quicksand_300Light } from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";

const QuizGame = () => {
    const [loading, setLoading] = useState(true);
    const [fetchData, setFetchData] = useState([]);
    const [toggledQuestions, setToggledQuestions] = useState([])
    const [pressedAnswers, setPressedAnswers] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [score, setScore] = useState(0)
    const [questionAnswered, setQuestionAnswered] = useState(0)

    const [fontsLoaded] = useFonts({
        Raleway_200ExtraLight,
        Quicksand_300Light,
      });


    function replacingCharacters(str){
        return str.replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'")                    
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&Omicron;/g, 'Ο')
                .replace(/&Nu;/g, 'Ν')
                .replace(/&Pi;/g, 'Π')
                .replace(/&Sigma;/g, 'Σ')
                .replace(/&reg;/g, '®')
                .replace(/&tilde;/g, '˜')
                .replace(/&circ;/g, 'ˆ')
                .replace(/&lsaquo;/g, '‹')
                .replace(/&rsaquo;/g, '›')
                .replace(/&eacute;/g, 'é')

                
    }


    const fetchQuizData = async () => {
        const url = `https://opentdb.com/api.php?amount=10&type=multiple`;
        let fetchLength = fetchData.length;
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log("API response data:", data);
            if (!data.results) {
                throw new Error('No results found in API response');
            }

            const handleData = data.results.map((item, index) => {
                
                const shuffledList = [...item.incorrect_answers, item.correct_answer]
                for (let i = shuffledList.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
                }

                return {
                id: ( index + fetchLength).toString(),
                question: `${replacingCharacters(item.question)}`,
                answers: shuffledList.map((item) => replacingCharacters(item)),
                correct_answer: replacingCharacters(item.correct_answer)}})

            setLoading(false);
            console.log('handleData', handleData)
            fetchData.length <= 0 ? setFetchData(handleData) : // fetchData = array 
                    setFetchData((prev) => [
                        ...prev,
                        ...handleData
                    ])
            
        }   catch (error) {
            console.error('could not fetch Quiz data', error);
            backupFetch();
        }
        
    }

    async function backupFetch(){
        console.log("firing backup")
        try {
          const res = await fetch(`https://the-trivia-api.com/v2/questions`)
          const data = await res.json();
          console.log(data)
          const handledData = data.map((item, index) => {

            const shuffledList = [...item.incorrectAnswers, item.correctAnswer]
            for (let i = shuffledList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
            }
          return {
            id: index,
            question: item.question.text,
            answers: shuffledList,
            correct_answer: item.correctAnswer,
          }})
          setLoading(false);
          console.log('handleData', handledData)
          fetchData.length <= 0 ? setFetchData(handledData) : // fetchData = array 
                  setFetchData((prev) => [
                      ...prev,
                      ...handledData
                  ])
                } catch(error){
                    console.error('could not fetch backup Quiz data', error);
                }}


    useEffect( ()=>{
        fetchQuizData()
},[]);



    const handleRefresh = React.useCallback(() => {
        setRefreshing(true);
        setLoading(true);
        setFetchData([]);
        setToggledQuestions([]);
        setPressedAnswers({});
        setScore(0);
        setQuestionAnswered(0);
        fetchQuizData();
        setRefreshing(false);

      }, []);



    const renderItem = ({ item }) => (
        <View style={styles.questionContainer}>
            <Text style={styles.question}>{item.question}</Text>
            {item.answers.map((answer) => {
                const isCorrect = answer === item.correct_answer;
                const isPressed = pressedAnswers[item.id] === answer;
                const backgroundColor = (toggledQuestions.includes(item.id)
                    && isCorrect)
                    ? 'green'
                    : (toggledQuestions.includes(item.id)
                    && isPressed)
                    ? 'red'
                    : 'white';
                const color = ((toggledQuestions.includes(item.id) && isPressed)
                    || (toggledQuestions.includes(item.id) && isCorrect)) ?
                    'white' : 'black';
                return (
                    <TouchableOpacity
                        key={answer}
                        onPress={() => handlePress(item.id, answer)}
                        style={[styles.item, { backgroundColor }]}>
                        <View style={styles.itemContent}>
                            <Text style={[styles.answers, { color }]}>{answer}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );


    function handlePress(id, answer){
        if (toggledQuestions.includes(id)){
            return
        }
        setToggledQuestions((prev) => [
            ...prev,
            id
        ])
        setPressedAnswers((prev) => ({
            ...prev,
            [id]: answer
    }))
        setQuestionAnswered((prev) => prev + 1)
        if (fetchData[id]?.correct_answer === answer){
            setScore((prev) => prev + 1)
        }
    }

    function loadList(){
        fetchQuizData()
    }


    if (loading || !fontsLoaded)  {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Quiz Game</Text>
            {questionAnswered !== 0 && <Text style={styles.header}>Your score: {score}/{questionAnswered}</Text>}
                <FlatList data ={fetchData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={[toggledQuestions, pressedAnswers]}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            <TouchableOpacity onPress={loadList} style={styles.button}>
                <Text style={styles.buttonText}>Load more questions</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        fontFamily: 'Roboto', // Add font family to the container style
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'OpenSans', 
    },
    questionContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'OpenSans', 
    },
    item: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    answers: {
        fontSize: 20,
        fontFamily: 'Quicksand_300Light', 
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18, 
        fontFamily: 'Raleway_200ExtraLight', 
        
    },
});

export default QuizGame