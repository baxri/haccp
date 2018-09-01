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
    PermissionsAndroid,

} from 'react-native';
import { Container, Header, Content, Button, Text, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import Strings from '../language/fr'
import { styles, inputAndButtonFontSize } from '../utilities/styles';
import { CustomPicker } from 'react-native-custom-picker';
import { Client } from 'bugsnag-react-native';
var RNFS = require('react-native-fs');

const bugsnag = new Client();

export const FILE_VERSION = '8';
export const APP_PICTURE_FOLDER = 'HACCPIMAGES-' + FILE_VERSION;
export const APP_PICTURE_FOLDER_TEMP = 'TEMP-HACCPIMAGES-' + FILE_VERSION;
export const APP_REALM_FOLDER = 'HACCPDATA';
export const APP_TEMP_REALM_FOLDER = 'TEMP-HACCPDATA';

export const PATH = RNFetchBlob.fs.dirs.PictureDir + '/' + APP_PICTURE_FOLDER;
export const PATH_TEMP = RNFetchBlob.fs.dirs.PictureDir + '/' + APP_PICTURE_FOLDER_TEMP;
export const PATH_REALM = RNFetchBlob.fs.dirs.DocumentDir + '/' + APP_REALM_FOLDER;
export const PATH_REALM_TEMP = RNFetchBlob.fs.dirs.DocumentDir + '/' + APP_TEMP_REALM_FOLDER;

export const PATH_ZIP = RNFetchBlob.fs.dirs.DownloadDir + '/RESTORES';
export const PATH_BACKUP = RNFetchBlob.fs.dirs.DownloadDir + '/BACKUPS';
export const LOOSE_IMAGES = RNFetchBlob.fs.dirs.DownloadDir + '/LOOSEIMAGES';

export const PATH_REALM_FILE = 'haccp-db-' + FILE_VERSION + '.realm';
export const PATH_REALM_FILE_TEMP = 'temp-haccp-db-' + FILE_VERSION + '.realm';

export const reverseFormat = (date) => {
    let ar = date.split("-");
    return ar[2] + "-" + ar[1] + "-" + ar[0];
};

export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const initImages = async () => {

    try {

        const granted_write = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                'title': 'WRITE_EXTERNAL_STORAGE',
                'message': 'MESSAGE'
            }
        )

        const granted_read = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                'title': 'READ_EXTERNAL_STORAGE',
                'message': 'MESSAGE'
            }
        )

        console.log(granted_read);
        console.log(granted_write);

        let a = await RNFS.mkdir(PATH + "/");
        let temp = await RNFS.mkdir(PATH_TEMP + "/");

    } catch (error) {
        alert(error);
        // bugsnag.notify(new Error(error));
    }
};

export const initFolders = async () => {

    initImages();

    try {
        let a = await RNFS.mkdir(PATH_REALM + "/");
        let b = await RNFS.mkdir(PATH_REALM_TEMP + "/");
        // let b = await RNFetchBlob.fs.mkdir(PATH_REALM + '/');
        // let c = await RNFetchBlob.fs.mkdir(PATH_REALM_TEMP + '/');

    } catch (error) {
        alert(error)
    }
};


export const realmFilePath = () => {
    return PATH_REALM + '/' + PATH_REALM_FILE;
};

export const realmFilePathTemp = () => {
    let temprealmFile = Math.floor(1000 + Math.random() * 9000) + '.realm';
    return PATH_REALM_TEMP + '/' + temprealmFile;
};

export const FilePicturePath = () => {
    return 'file://' + PATH + '/';
};

export const FilePicturePathTemp = () => {
    return 'file://' + PATH_TEMP + '/';
};

export const writePicture = async (result) => {
    var filename = Math.floor(Date.now() / 1000) + '.jpg';
    var filepath = PATH + "/" + filename;

    try {
        let writed = await RNFetchBlob.fs.writeFile(filepath, result, 'base64');
        return filename;
    } catch (error) {
        alert(error);
    }
};

export const writePictureTemp = async (result) => {
    var filename = Math.floor(Date.now() / 1000) + '.jpg';
    var filepath = PATH_TEMP + "/" + filename;

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

export const toYM = (date) => {
    var mm = date.getMonth() + 1;
    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
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

export const renderFieldDanger = (settings) => {
    const { selectedItem, defaultText, getLabel, clear } = settings
    return (
        <View style={styles.DropdownContainerDanger}>
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

export const renderFieldSuccess = (settings) => {
    const { selectedItem, defaultText, getLabel, clear } = settings
    return (
        <View style={styles.DropdownContainerSuccess}>
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

export const renderRadios = (label, items, click, value = 0) => {
    return (
        <View style={styles.RadioContainer}>
            <View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                {items.map(item => {
                    return <Button onPress={() => { click(item.value) }} style={value == item.value ? styles.radioButtonSelected : styles.radioButton}><Text style={styles.text}>{item.text}</Text></Button>;
                })}

            </View>
        </View>
    )
}