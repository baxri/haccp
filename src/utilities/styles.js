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
        borderLeftColor: 'gray',
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        paddingLeft: 20,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    inputNoPadding: {
        marginBottom: 20,
        borderLeftColor: 'gray',
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },


    inputDanger: {
        marginBottom: 20,
        borderLeftColor: AppColor,
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        paddingLeft: 20,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    inputSuccess: {
        marginBottom: 20,
        borderLeftColor: 'green',
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        paddingLeft: 20,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    inputSuccessNoPadding: {
        marginBottom: 20,
        borderLeftColor: 'green',
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    inputInline: {
        flex: 1,
        marginBottom: 20,
        borderWidth: 0,
        height: 70,
        paddingLeft: 0,
        fontSize: inputAndButtonFontSize,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    inputInlineIcon: {
        margin: 20,
    },

    inputInlineIconDisabled: {
        color: 'lightgray',
        margin: 20,
    },

    inputInlineIconSuccess: {
        margin: 20,
        color: 'green',
    },

    inputInlineIconDanger: {
        margin: 20,
        color: AppColor,
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

    textButton: {
        fontSize: inputAndButtonFontSize,
        textDecorationLine: 'underline',
    },

    label: {
        fontSize: inputAndButtonFontSize,
        marginBottom: 10,
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
        borderLeftColor: 'gray',
        borderRightColor: 'gray',
        borderTopColor: 'gray',
        borderBottomColor: 'gray',

        // borderColor: 'gray',
        borderWidth: 1,
        borderLeftWidth: 4,
        height: 70,
        marginBottom: 20,
    },

    DropdownContainerDanger: {
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

    DropdownContainerSuccess: {
        borderLeftColor: 'green',
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
    },
    // @END DropDown selector


    //Radio button styles

    RadioContainer: {
        borderWidth: 0,
        height: 70,
        marginBottom: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    radioButton: {
        height: 70,
        width: 150,
        backgroundColor: 'lightgray',
        // marginLeft: 5,
        justifyContent: 'center'
    },

    radioButtonSelected: {
        width: 150,
        height: 70,
        backgroundColor: 'green',
        // marginLeft: 5,
        justifyContent: 'center'

    },

    //@END radio button styles

});