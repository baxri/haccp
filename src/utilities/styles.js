import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    View,
    Dimensions,
    TextInput,
} from 'react-native';

const inputAndButtonFontSize = 20;

export const styles = StyleSheet.create({
    picker: {
        transform: [
            { scaleX: 2 },
            { scaleY: 2 },
        ]
    },
    container: {
        paddingTop: 23
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        height: 70,
        paddingLeft: 15,
        fontSize: inputAndButtonFontSize,
    },

    text: {
        fontSize: inputAndButtonFontSize,
    },

    button: {
        height: 70,
        marginTop: 15,
        marginBottom: 40,
        margin: 15,
        padding: 20,
    },

    dropdown: {
        flex: 1,
        fontSize: inputAndButtonFontSize,
    },
    dropdownView: {
        height: 60,
        padding: 5,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        marginBottom: 50,
        borderBottomColor: 'lightgray',
        marginLeft: 15,
        fontSize: inputAndButtonFontSize,
    },
});