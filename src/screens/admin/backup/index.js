import React from 'react';
import {
    AsyncStorage,
    View,
    ToastAndroid,
    NetInfo,
    TextInput,
    Dimensions,
    Alert,
    Linking,
    Keyboard
} from 'react-native';
import { Container, Content, Button, Text, H2, H3, Icon, Left, Right } from 'native-base';
import { LogoTitle, Menu, UploadIcon, ProgressBar } from '../../../components/header';
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
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH_BACKUP, LOOSE_IMAGES, PATH, PATH_TEMP, PATH_REALM_FILE, realmFilePath, realmFilePathTemp, initImages, toDate, reverseFormat } from '../../../utilities/index';
import { upload, startDownload } from '../../../utilities/backup';

import { subscribe } from 'react-native-zip-archive'
import { styles } from '../../../utilities/styles';
var RNFS = require('react-native-fs');

export class AdminBackupIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: Strings.BACKUP,
            drawerIcon: ({ tintColor }) => (
                <Icon name='sync' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.BACKUP} />,
            headerRight: <UploadIcon navigation={navigation} />,
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
            zipProgress: 0,
        };

        this._bootstrapAsync();
    }

    componentDidMount() {
        this.zipProgress = subscribe((objectProgress) => {
            this.setState({ zipProgress: objectProgress.progress })
        })
    }

    componentWillUnmount() {
        this.zipProgress.remove()
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _showLoaderZip() {
        this.setState({ loadingZip: 1 });
    }

    _hideLoaderZip() {
        this.setState({ loadingZip: 0 });
    }

    _onLayout() {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        let date = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        let connected = await NetInfo.isConnected.fetch();
        this.setState({ connected: connected ? 1 : 0, past_year: date });
    };

    _recoverImages = async () => {
        RNFS.readDir(LOOSE_IMAGES).then(files => {

            if (files.length > 0) {

                files.map(file => {
                    console.log(file);
                });

            } else {
                alert('There is no images in LOOSEIMAGES folder!');
            }

        }).catch(error => {
            alert(error);
        });
    }

    _sync = async () => {

        await initImages();

        if (this.state.name.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_NAME, ToastAndroid.LONG); return;
        }
        Keyboard.dismiss();

        // this._showLoaderZip();

        try {

            let DB = RealmFile();
            let name = this.state.name;

            // await upload(PATH, RealmFile(), this.state.name, adminPassword);

            let zipName = name + '.zip';
            let copyFrom = DB;
            let copyTo = PATH + '/' + PATH_REALM_FILE;

            if (!(await RNFetchBlob.fs.exists(copyFrom))) {
                throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
            }

            await RNFetchBlobOld.fs.cp(copyFrom, copyTo);

            if (!(await RNFetchBlob.fs.exists(copyTo))) {
                throw new Error(Strings.CANNOT_COPY_DATABASE_FILE);
            }

            let targetPath = PATH_BACKUP + '/' + zipName;
            let sourcePath = PATH;

            console.log("Start Zipping");
            console.log(targetPath);
            console.log(sourcePath);

            console.log("Finish zipping");

            // this.props.navigation.navigate("AdminHome");
            this.props.navigation.navigate("AdminBackupRestore");
            ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
        } catch (error) {
            alert(error);
            console.log(error);
        } finally {
            this._hideLoaderZip();
        }
    };

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

            let date = toDate(this.state.past_year);

            console.log(date);

            let controles = await ControlesAfterDate(date, TEMP_DB_PATH);
            let pictures = await PicturesAfterDate(date, TEMP_DB_PATH);
            let archive = await ArchivesAfterDate(date, TEMP_DB_PATH);

            let controlesBefore = await ControlesBeforeDate(date);
            let picturesBefore = await PicturesBeforeDate(date);
            let archiveBefore = await ArchivesBeforeDate(date);



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

    _update = () => {
        Linking.openURL('http://haccp.milady.io/app-center/app-release.apk');
    };

    _downloadBackupAsk() {

        let backup_id = this.state.backup_id;

        if (backup_id.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_ID, ToastAndroid.LONG); return;
        }

        this.setState({ backup_id: '' });
        Keyboard.dismiss();
        startDownload(backup_id);
    }

    render() {
        return (
            <Container style={{ flex: 1, paddingTop: 10, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <ProgressBar visible={this.state.loadingZip} progressValue={parseInt(this.state.zipProgress * 100)} />


                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={styles.container}>

                        {/* <Button primary style={[styles.button, { marginBottom: 50 }]} onPress={() => { this._recoverImages() }}>
                            <Left>
                                <Text style={[{ color: 'white', }, styles.text]}>
                                    RECOVER LOOSE IMAGES
                                    </Text>
                            </Left>
                            <Right>
                                <Icon name='cloud-download' style={{ color: 'white', }} />
                            </Right>
                        </Button>
 */}

                        <H3 style={{ marginBottom: 10, textAlign: 'center' }}>{Strings.APPLICATION_DETAILS}:</H3>
                        <Text style={{ marginBottom: 10, textAlign: 'center' }}>{Strings.UNIQUE_ID}: {DeviceInfo.getUniqueID()}</Text>
                        <Text style={{ marginBottom: 30, textAlign: 'center' }}>{Strings.APP_ID}: {DeviceInfo.getInstanceID()}</Text>

                        <H3 style={{ marginBottom: 10, textAlign: 'center' }}>{Strings.APPLICATION_IMAGES}:</H3>
                        <Text style={{ marginBottom: 30, textAlign: 'center' }}>{PATH}</Text>

                        <H3 style={{ marginBottom: 10, textAlign: 'center' }}>{Strings.BACKUPS_FOLDER}:</H3>
                        <Text style={{ marginBottom: 30, textAlign: 'center' }}>{PATH_BACKUP}</Text>

                        <Button full transparent style={{ padding: 10, marginBottom: 20, borderBottom: '1px solid' }} onPress={() => { this.props.navigation.navigate("AdminBackupRestore"); }}>
                            <Text style={[styles.textButton]}>{Strings.BACKUPS_AND_DOWNLOADS}</Text>
                        </Button>

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
                                    <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_LOCAL}</Text>
                                </Left>
                                <Right>
                                    <Icon name='archive' style={{ color: 'white', }} />
                                </Right>
                            </Button>

                            <View style={{ height: 50, }}></View>
                            {/* <H2 style={{ textAlign: 'center', color: 'red', marginBottom: 25, }}>{Strings.DANGER_ZONE}</H2> */}
                            {/* <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.RESTORE_WARNING}</H3> */}
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

                            <Button primary style={[styles.button, { marginBottom: 30 }]} onPress={() => { this._downloadBackupAsk() }}>
                                <Left >
                                    <Text style={[{ color: 'white', }, styles.text]}>
                                        {Strings.DOWNLOAD_BACKUP_FROM_CLOUD}
                                    </Text>
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
                                    <Icon name='sync' style={{ color: 'white', }} />
                                </Right>
                            </Button>
                        </View>}
                    </View>
                </Content >
            </Container>
        );
    }
}

