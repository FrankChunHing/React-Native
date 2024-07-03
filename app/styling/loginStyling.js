import { StyleSheet, StatusBar } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: StatusBar.currentHeight || 0,
        backgroundColor: '#ecedef',
    },
    credentialContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        display: 'none',
    },
    text: {
        fontSize: 16,
    },
    form: {
        height: 400,
        width: 360,
        justifyContent: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: 'grey',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center', // Center itself in the parent container
    },
    label: {
        fontSize: 20,
        margin: 5,
        fontWeight: '700'
    },
    input: {
        height: 50,
        borderColor: 'grey',
        borderWidth: 2,
        borderRadius: 4,
        margin: 5,
        paddingHorizontal: 20,
        color: 'blue',
        fontSize: 18,
    },
    hovered: {
        borderColor: 'blue',
    },
    button: {
        marginTop: 30,
        marginLeft: 5,
        marginRight: 5,
        height: 40,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: 'grey',
        shadowOffset: {
            width: 7,
            height: 7,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 30,
        height: 40,
        fontSize: 15,
        color: 'red',
    },
    listContainer: {
        width: '100%',
        display: 'none',
    },
    image: {
        width: 200,
        height: 200,
    },
    eye: {
        width: 30,
        height: 30,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeContainer: {
        position: 'absolute',
        right: 10,
    },
    passwordInput: {
        flex: 1,
    },
    resigerButton: {
        borderRadius: 30,
        width: 200,
        backgroundColor: "red"
    }
});

export default styles;
