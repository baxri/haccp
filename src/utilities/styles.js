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

export const inputAndButtonFontSize = 20;
export const AppColor = '#BB0000';
export const AppColorSecond = '#494949';

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
        marginBottom: 20,
        borderLeftColor: AppColor,
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,        
        height: 70,
        paddingLeft: 15,
        fontSize: inputAndButtonFontSize,
    },

    textarea: {
        marginBottom: 20,
        borderLeftColor: AppColor,
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,        
        paddingLeft: 15,
        fontSize: inputAndButtonFontSize,
    },


    text: {
        fontSize: inputAndButtonFontSize,
    },

    label: {
        fontSize: inputAndButtonFontSize,
        marginBottom: 5,
    },

    button: {
        height: 70,
        marginTop: 15,
        marginBottom: 20,
        padding: 20,
        backgroundColor: AppColorSecond,
    },

    buttonOriginal: {
        height: 70,
        marginTop: 15,
        marginBottom: 20,
        padding: 20,
    },

    // DropDown selector
    DropdownContainer: {
        borderLeftColor: AppColor,
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        
        // borderColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        marginBottom: 20,
    },
    innerContainer: {
        padding: 15,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
   
    optionContainer: {
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    optionInnerContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    box: {
        width: 20,
        height: 20,
        marginRight: 10
    }
    // @END DropDown selector
    
});