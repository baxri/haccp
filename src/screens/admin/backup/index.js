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

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, H2, H3, Form, Item, Label, Input, Toast, Root, Icon, Left, Right } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr'
import { RealmFile, ControlesAfterDate, DeleteControle } from '../../../database/realm';
import Upload from 'react-native-background-upload'
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH, PATH_TEMP, PATH_REALM, PATH_REALM_FILE, PATH_REALM_FILE_TEMP, PATH_ZIP, realmFilePath, realmFilePathTemp, writeZip, initImages } from '../../../utilities/index';
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
        let connected = await NetInfo.isConnected.fetch();
        this.setState({ connected: connected ? 1 : 0 });
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
                        alert(err.message);
                    });


                // this._hideLoader();
                // return;

                // RNFetchBlobOld.fs.ls(PATH).then(async files => {


                // }).catch(error => {
                //     this._hideLoader();
                //     bugsnag.notify(new Error("CATCH " + error));
                //     alert(error);
                // });

            } else {
                throw new Error(Strings.PROBLEM_DOWNLOADING_BACKUP);
            }

        } catch (error) {
            this._hideLoader();
            bugsnag.notify(new Error(error));
            alert(error);
        }

    }

    _deleteOldData = async () => {

        // this._showLoader();

        setTimeout(async () => {
            try {

                let ID = DeviceInfo.getUniqueID();
                let name = 'TEMP BACKUP';
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

                //Delete all temp images
                if (imagesTemp.length > 0) {
                    imagesTemp.map(async filename => {
                        try {
                            let dest = PATH_TEMP + "/" + filename;
                            await RNFetchBlob.fs.unlink(dest);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }

                //Copy all images in temp folders
                if (images.length > 0) {
                    images.map(async filename => {
                        let source = PATH + "/" + filename;
                        let dest = PATH_TEMP + "/" + filename;

                        try {
                            await RNFetchBlob.fs.cp(source, dest);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }

                if (images.length != imagesTemp.length) {
                    throw new Error("problem in copping file");
                }

                //select archivage date
                let date = new Date().toISOString().substring(0, 10);

                // Retrive and delete data after this date from temp db file
                let controles = await ControlesAfterDate(date);

                console.log(date);
                return;


                

                controles.map(async controle => {
                    await DeleteControle(controle.id);
                });





                return;
                alert(exists);
            } catch (error) {
                this._hideLoader();
                alert(error);
            }
        }, 500);
    }

    _sync = async () => {

        bugsnag.leaveBreadcrumb('Start _sync function');

        let ID = DeviceInfo.getUniqueID();
        let file = RealmFile();
        let name = this.state.name;

        bugsnag.leaveBreadcrumb('Prepare device ID for upload deviceID' + ID);
        bugsnag.leaveBreadcrumb('Get Realm file' + file);

        if (name.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_NAME, ToastAndroid.LONG); return;
        }

        this._showLoader();

        await initImages();

        setTimeout(() => {

            bugsnag.leaveBreadcrumb('Retrive all files with: RNFetchBlobOld.fs.ls');

            RNFetchBlobOld.fs.ls(PATH)
                .then((files) => {

                    bugsnag.leaveBreadcrumb(files.length + " files retrived");

                    let formFiles = [];
                    formFiles.push({ name: 'realm', filename: PATH_REALM_FILE, data: RNFetchBlob.wrap(RealmFile()) });

                    if (files.length > 0) {

                        bugsnag.leaveBreadcrumb("Start files to add in form");

                        files.map((file => {
                            formFiles.push({ name: 'images[]', filename: file, data: RNFetchBlob.wrap(PATH + "/" + file) });
                        }));

                        bugsnag.leaveBreadcrumb("End Start files to add in form");
                    }

                    bugsnag.leaveBreadcrumb("Form is ready and now make a request to the upload server...");

                    RNFetchBlob.fetch('POST', 'http://haccp.milady.io/api/upload', {
                        'haccp-device': ID,
                        'name': name,
                        'Content-Type': 'multipart/form-data',
                    }, formFiles).then((resp) => {

                        alert(resp.text());

                        bugsnag.leaveBreadcrumb("File upload response sucessfully received!...");
                        this._hideLoader();
                        this.props.navigation.navigate("AdminHome");

                        // if (resp.data.length > 0) {
                        // alert(resp.data);
                        // }

                        ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
                    }).catch((err) => {
                        this._hideLoader();
                        bugsnag.notify(new Error(error));
                        alert(err);
                    });
                }).catch(error => {
                    this._hideLoader();
                    bugsnag.notify(new Error(error));
                    alert(err);
                });
        }, 500);
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



                            <Button primary style={styles.button} onPress={() => { this._deleteOldData() }}>
                                <Left >
                                    <Text style={[{ color: 'white', }, styles.text]}>
                                        DELETE OLD DATA
                                    </Text>
                                </Left>
                                <Right>
                                    <Icon name='sync' style={{ color: 'white', }} />
                                </Right>
                            </Button>




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
                        </View>}
                    </View>
                </Content >
            </Container>
        );
    }
}

