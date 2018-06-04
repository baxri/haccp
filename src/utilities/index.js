import RNFetchBlob from 'react-native-fetch-blob';
import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Keyboard,
    Dimensions,
    TextInput,
    Picker,
    TouchableOpacity,

} from 'react-native';
import { Container, Header, Content, Button, Text, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import Strings from '../language/fr'
import { styles, inputAndButtonFontSize } from '../utilities/styles';
import { CustomPicker } from 'react-native-custom-picker';


export const FILE_VERSION = '2';
export const APP_PICTURE_FOLDER = 'HACCPIMAGES-' + FILE_VERSION;
export const APP_REALM_FOLDER = 'HACCPDATA';

export const PATH = RNFetchBlob.fs.dirs.SDCardDir + '/' + APP_PICTURE_FOLDER;
export const PATH_REALM = RNFetchBlob.fs.dirs.DocumentDir + '/' + APP_REALM_FOLDER;
export const PATH_ZIP = RNFetchBlob.fs.dirs.SDCardDir + '/ZIPS';

export const PATH_REALM_FILE = 'haccp-db-' + FILE_VERSION + '.realm';

export const reverseFormat = (date) => {
    let ar = date.split("-");
    return ar[2] + "-" + ar[1] + "-" + ar[0];
};

export const initFolders = async () => {

    try {
        let a = await RNFetchBlob.fs.mkdir(PATH + '/');
    } catch (error) { rr }

    try {
        let b = await RNFetchBlob.fs.mkdir(PATH_REALM + '/');


    } catch (error) { }
};

export const realmFilePath = () => {
    return PATH_REALM + '/' + PATH_REALM_FILE;
};

export const FilePicturePath = () => {
    return 'file://' + PATH + '/';
};

export const writePicture = async (result) => {
    var filename = Math.floor(Date.now() / 1000) + '.png';
    var filepath = PATH + "/" + filename;

    try {
        let writed = await RNFetchBlob.fs.writeFile(filepath, result, 'base64');
        return filename;
    } catch (error) {
        alert(error);
    }
};

export const writeZip = async (result) => {
    var filename = Math.floor(Date.now() / 1000) + '.zip';
    var filepath = PATH_ZIP + "/" + filename;

    try {
        let writed = await RNFetchBlob.fs.writeFile(filepath, result, 'base64');
        return filename;
    } catch (error) {
        alert(error);
    }
};

export const toDate = (date) => {
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
}


export const renderOption = (settings) => {
    const { item, getLabel } = settings
    return (
        <View style={styles.optionContainer}>
            <View style={styles.innerContainer}>
                <Text style={{ color: item.color, alignSelf: 'flex-start' }}>{getLabel(item)}</Text>
            </View>
        </View>
    )
}

export const renderField = (settings) => {
    const { selectedItem, defaultText, getLabel, clear } = settings
    return (
        <View style={styles.DropdownContainer}>
            <View>
                {!selectedItem && <View style={styles.innerContainer}>
                    <Text style={{ fontSize: inputAndButtonFontSize }}>
                        {defaultText}
                    </Text>
                    <Text style={{ fontSize: inputAndButtonFontSize }}>
                        <Icon name='ios-arrow-down' />
                    </Text>
                </View>}
                {selectedItem && (
                    <View style={styles.innerContainer}>
                        <Text style={{ fontSize: inputAndButtonFontSize }}>
                            {getLabel(selectedItem)}
                        </Text>
                        <Text style={{ fontSize: inputAndButtonFontSize }}>
                            <Icon name='ios-arrow-down' />
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}

