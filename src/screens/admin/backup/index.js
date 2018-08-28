import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ToastAndroid,
    NetInfo,
    TextInput,
    Dimensions,
    Alert,
    Linking
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, H2, H3, Form, Item, Label, Input, Toast, Root, Icon, Left, Right } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr'
import {
    RealmFile,
    ControlesAfterDate,
    PicturesAfterDate,
    ArchivesAfterDate,

    ControlesBeforeDate,
    PicturesBeforeDate,
    ArchivesBeforeDate,

    Delete,
    DeleteFromTemp
} from '../../../database/realm';
import Upload from 'react-native-background-upload'
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH, PATH_TEMP, PATH_REALM, PATH_REALM_FILE, PATH_REALM_FILE_TEMP, PATH_ZIP, realmFilePath, realmFilePathTemp, writeZip, initImages, toDate, reverseFormat } from '../../../utilities/index';
import { upload } from '../../../utilities/backup';

import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { RestartAndroid } from 'react-native-restart-android'
import { styles } from '../../../utilities/styles';
import { Client } from 'bugsnag-react-native';
var RNFS = require('react-native-fs');

const bugsnag = new Client();

export class AdminBackupIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.BACKUP,
            drawerIcon: ({ tintColor }) => (
                <Icon name='sync' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.BACKUP} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            backup_id: '',
            loading: 0,
            connected: 0,
            date: new Date().toISOString().substring(0, 10),
            dimesions: { width, height } = Dimensions.get('window'),
            past_year: null,
        };

        this._bootstrapAsync();
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        let date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        let connected = await NetInfo.isConnected.fetch();
        this.setState({ connected: connected ? 1 : 0, past_year: date });
    };

    _restore = async () => {
        let backup_id = this.state.backup_id;

        if (backup_id.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_ID, ToastAndroid.LONG); return;
        }

        let download = 'http://haccp.milady.io/admin/download/' + backup_id;
        this._showLoader();

        bugsnag.leaveBreadcrumb('Init images folder...');
        await initImages();

        try {

            bugsnag.leaveBreadcrumb('Start _restore function try block.');

            var filename = Math.floor(Date.now() / 1000) + '.zip';
            bugsnag.leaveBreadcrumb('Generate random .zip filename with Math filename: ' + filename);

            var filepath = PATH_ZIP + "/" + filename;

            bugsnag.leaveBreadcrumb('Starting RNFetchBlob download method...');
            let res = await RNFetchBlob.config({
                fileCache: true,
                path: filepath
            }).fetch('GET', download, {});
            bugsnag.leaveBreadcrumb('Received download response...');

            let status = res.info().status;
            bugsnag.leaveBreadcrumb('Download response http status = ' + status);

            if (status == 200) {
                let IMAGES = PATH;
                let DB = PATH_REALM + "/" + PATH_REALM_FILE;

                let filename = res.path();
                bugsnag.leaveBreadcrumb('Retrive file path from download response ' + filename);

                bugsnag.leaveBreadcrumb('Start Listing all local images with: RNFetchBlobOld.fs.ls');

                // get a list of files and directories in the main bundle
                RNFS.readDir(PATH) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
                    .then(async (files) => {
                        bugsnag.leaveBreadcrumb(files.length + ' images Loaded from local store');
                        if (files.length > 0) {
                            bugsnag.leaveBreadcrumb('Start deleting all images...');
                            files.map(file => {
                                RNFetchBlobOld.fs.unlink(IMAGES + '/' + file).then(() => { })
                            });
                            bugsnag.leaveBreadcrumb('Finish deleting all images...');
                        }

                        bugsnag.leaveBreadcrumb('Delete realm file...');
                        RNFetchBlob.fs.unlink(DB);

                        if (!RNFetchBlob.fs.exists(DB)) {
                            throw new Error(Strings.CANNOT_DElETE_DATABASE_FILE);
                        }

                        const sourcePath = res.path();
                        const targetPath = IMAGES;

                        bugsnag.leaveBreadcrumb('Downloaded path: ' + sourcePath);
                        bugsnag.leaveBreadcrumb('Target path: ' + targetPath);

                        bugsnag.leaveBreadcrumb('Start unzipping downloaded bundle...');
                        await unzip(sourcePath, targetPath);
                        bugsnag.leaveBreadcrumb('Unziping finished...');

                        bugsnag.leaveBreadcrumb('Move downloaded realm file to destination...');
                        let copy = await RNFetchBlob.fs.cp(targetPath + '/' + PATH_REALM_FILE, DB);

                        if (!(await RNFetchBlob.fs.exists(DB))) {
                            throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
                        }

                        bugsnag.leaveBreadcrumb('Remove realm file from downloaded bundle it is already copied :)');
                        RNFetchBlob.fs.unlink(targetPath + '/' + PATH_REALM_FILE);

                        this._hideLoader();
                        RestartAndroid.restart();

                    })
                    .catch((error) => {
                        this._hideLoader();
                        bugsnag.notify(new Error("NEW CATCH " + error.message));
                        // alert(error);
                        alert(error.message);
                    });

            } else {
                throw new Error(Strings.PROBLEM_DOWNLOADING_BACKUP);
            }

        } catch (error) {
            this._hideLoader();
            bugsnag.notify(new Error(error));
            alert(error);
        }

    }

    _askDeleteOldData = async () => {
        try {
            Alert.alert(
                Strings.RESET_PASSWORD,
                Strings.ARE_YOU_SURE_YOU_WANT_RESET_PASSWORD,
                [
                    { text: Strings.CANCEL, style: 'cancel' },
                    { text: Strings.OK, onPress: () => this._deleteOldData() },
                ],
                { cancelable: false }
            )

        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    _deleteOldData = async () => {

        await initImages();
        this._showLoader();

        try {
            let name = 'BACKUP BEFORE: ' + reverseFormat(toDate(this.state.past_year));
            let TEMP_DB_PATH = realmFilePathTemp();
            let DB = realmFilePath();

            // Check if temporary database file is exsists
            let exists = await RNFetchBlob.fs.exists(TEMP_DB_PATH)

            // Delete temporary database file if it exists
            if (exists) {
                await RNFetchBlob.fs.unlink(TEMP_DB_PATH);
            }

            // Copy real database file to temporary file
            await RNFetchBlob.fs.cp(DB, TEMP_DB_PATH);

            exists = await RNFetchBlob.fs.exists(TEMP_DB_PATH)

            // Check if file is copied
            if (!exists) {
                throw new Error('CANNOT_COPY_DB_FILE_TO_TEMPORARY_DB_FILE');
            }

            //retrive all images
            let images = await RNFetchBlobOld.fs.ls(PATH);

            //retrive temp images
            let imagesTemp = await RNFetchBlobOld.fs.ls(PATH_TEMP);

            console.log("original: " + images.length);
            console.log("temp: " + imagesTemp.length);

            //Delete all temp images
            if (imagesTemp.length > 0) {
                for (let i = 0; i < imagesTemp.length; i++) {
                    let filename = images[i];
                    let dest = PATH_TEMP + "/" + filename;
                    await RNFetchBlob.fs.unlink(dest);
                }
            }

            let imagesTempAfterDelete = await RNFetchBlobOld.fs.ls(PATH_TEMP);
            console.log("temp after delete: " + imagesTempAfterDelete.length);

            //Copy all images in temp folders
            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    let filename = images[i];
                    let source = PATH + "/" + filename;
                    let dest = PATH_TEMP + "/" + filename;
                    await RNFetchBlob.fs.cp(source, dest);
                }
            }

            let imagesTempRefreshed = await RNFetchBlobOld.fs.ls(PATH_TEMP);
            console.log("temp after copy: " + imagesTempRefreshed.length);

            if (images.length != imagesTempRefreshed.length) {
                throw new Error("problem in copping file");
            }

            //select archivage date
            // let date = new Date().toISOString().substring(0, 10);
            let date = toDate(this.state.past_year);

            console.log(date);

            // Retrive data after this date from temp db file
            let controles = await ControlesAfterDate(date, TEMP_DB_PATH);
            let pictures = await PicturesAfterDate(date, TEMP_DB_PATH);
            let archive = await ArchivesAfterDate(date, TEMP_DB_PATH);

            let controlesBefore = await ControlesBeforeDate(date);
            let picturesBefore = await PicturesBeforeDate(date);
            let archiveBefore = await ArchivesBeforeDate(date);

            console.log(controles.length);
            console.log(pictures.length);
            console.log(archive.length);

            console.log('--------------------------------');

            console.log(controlesBefore.length);
            console.log(picturesBefore.length);
            console.log(archiveBefore.length);

            // Delete data after this date from temp db file
            for (let i = 0; i < controles.length; i++) {
                let item = controles[i];

                if (item.source.length > 0) {
                    let file = PATH_TEMP + "/" + item.source;
                    await RNFetchBlob.fs.unlink(file);
                    console.log(file);
                }

                if (item.signature.length > 0) {
                    let signature = PATH_TEMP + "/" + item.signature;
                    await RNFetchBlob.fs.unlink(signature);
                    console.log(signature);
                }
            }

            for (let i = 0; i < pictures.length; i++) {
                let item = pictures[i];
                if (item.source.length > 0) {
                    let file = PATH_TEMP + "/" + item.source;
                    await RNFetchBlob.fs.unlink(file);
                    console.log(file);
                }
            }

            await DeleteFromTemp(controles, TEMP_DB_PATH);
            await DeleteFromTemp(pictures, TEMP_DB_PATH);
            await DeleteFromTemp(archive, TEMP_DB_PATH);

            let adminPassword = await AsyncStorage.getItem('adminPasswordV8');

            await upload(PATH_TEMP, TEMP_DB_PATH, name, adminPassword);

            // Retrive data before this date from original db file
            let controlesBeforeFromRealDB = await ControlesBeforeDate(date);
            let picturesBeforeFromRealDB = await PicturesBeforeDate(date);
            let archiveBeforeFromRealDB = await ArchivesBeforeDate(date);

            console.log('Data before ' + date + ':');
            console.log(controlesBeforeFromRealDB.length);
            console.log(picturesBeforeFromRealDB.length);
            console.log(archiveBeforeFromRealDB.length);

            await Delete(controlesBeforeFromRealDB);
            await Delete(picturesBeforeFromRealDB);
            await Delete(archiveBeforeFromRealDB);

            this.props.navigation.navigate("AdminHome");
            ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
        } catch (error) {
            alert(error);
        } finally {
            this._hideLoader();
        }
    }

    _sync = async () => {

        let adminPassword = await AsyncStorage.getItem('adminPasswordV8');
        await initImages();

        if (this.state.name.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_NAME, ToastAndroid.LONG); return;
        }

        this._showLoader();

        try {
            await upload(PATH, RealmFile(), this.state.name, adminPassword);
            this.props.navigation.navigate("AdminHome");
            ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
        } catch (error) {
            alert(error);
        } finally {
            this._hideLoader();
        }
    };

    _update = () => {
        Linking.openURL('http://haccp.milady.io/app-center/app-release.apk');
    };

    render() {
        return (
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />

                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={styles.container}>

                        <H3 style={{ marginBottom: 10, textAlign: 'center' }}>{Strings.UNIQUE_ID}: {DeviceInfo.getUniqueID()}</H3>
                        <H3 style={{ marginBottom: 30, textAlign: 'center' }}>{Strings.APP_ID}: {DeviceInfo.getInstanceID()}</H3>

                        <H3 style={{ marginBottom: 30, textAlign: 'center' }}>{PATH}</H3>

                        {!this.state.connected && <H3 style={{ marginTop: 100, textAlign: 'center', color: 'red' }}>{Strings.NO_CONNECTION}</H3>}

                        {this.state.connected == 1 && <View>

                            <View style={this.state.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                                <TextInput
                                    style={styles.inputInline}
                                    underlineColorAndroid="transparent"
                                    placeholder={Strings.BACKUP_NAME}
                                    value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                                {this.state.name.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                                {this.state.name.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                            </View>
                            <Button primary style={styles.button} onPress={() => { this._sync() }}>
                                <Left >
                                    <Text style={[{ color: 'white', }, styles.text]}>{Strings.UPLOAD}</Text>
                                </Left>
                                <Right>
                                    <Icon name='sync' style={{ color: 'white', }} />
                                </Right>
                            </Button>
                            <View style={{ height: 100, }}></View>
                            <H2 style={{ textAlign: 'center', color: 'red', marginBottom: 25, }}>{Strings.DANGER_ZONE}</H2>
                            <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.RESTORE_WARNING}</H3>
                            <View style={this.state.backup_id.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                                <TextInput
                                    keyboardType="numeric"
                                    style={styles.inputInline}
                                    underlineColorAndroid="transparent"
                                    placeholder={Strings.BACKUP_ID}
                                    value={this.state.backup_id} onChangeText={(value) => { this.setState({ backup_id: value }) }} />
                                {this.state.backup_id.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                                {this.state.backup_id.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                            </View>
                            <Button danger style={styles.button} onPress={() => { this._restore() }}>
                                <Left >
                                    <Text style={[{ color: 'white', }, styles.text]}>{Strings.RESTORE}</Text>
                                </Left>
                                <Right>
                                    <Icon name='cloud-download' style={{ color: 'white', }} />
                                </Right>
                            </Button>


                            {/* <View style={{ height: 50, }}></View>
                            <H2 style={{ textAlign: 'center', color: 'red', marginBottom: 25, }}>{Strings.DANGER_ZONE}</H2>
                            <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.DELETE_OLD_DATA_WARNING}</H3>
                            <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.BACKUP_DATA_BEFORE}: {reverseFormat(toDate(this.state.past_year))}</H3>
                            <Button primary style={[styles.button, { marginBottom: 30 }]} onPress={() => { this._askDeleteOldData() }}>
                                <Left >
                                    <Text style={[{ color: 'white', }, styles.text]}>
                                        {Strings.DELETE_OLD_DATA}
                                    </Text>
                                </Left>
                                <Right>
                                    <Icon name='sync' style={{ color: 'white', }} />
                                </Right>
                            </Button> */}

                            <View style={{ height: 50, }}></View>
                            <H2 style={{ textAlign: 'center', color: 'red', marginBottom: 25, }}>{Strings.DOWNLOAD_LATEST_APK}</H2>
                            <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.BEFORE_UPDATE_PLEASE_MAKE_A_BACKUP}</H3>
                            <Button primary style={[styles.button, { marginBottom: 50 }]} onPress={() => { this._update() }}>
                                <Left>
                                    <Text style={[{ color: 'white', }, styles.text]}>
                                        {Strings.DOWNLOAD}
                                    </Text>
                                </Left>
                                <Right>
                                    <Icon name='cloud-download' style={{ color: 'white', }} />
                                </Right>
                            </Button>
                        </View>}
                    </View>
                </Content >
            </Container>
        );
    }
}

