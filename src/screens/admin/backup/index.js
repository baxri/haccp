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
import { RealmFile } from '../../../database/realm';
import Upload from 'react-native-background-upload'
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'react-native-fetch-blob';
import { PATH, PATH_REALM, PATH_REALM_FILE, PATH_ZIP, realmFilePath, writeZip } from '../../../utilities/index';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { RestartAndroid } from 'react-native-restart-android'
import { styles } from '../../../utilities/styles';


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

        let download = 'http://upload.bibi.ge/admin/download/' + backup_id;

        this._showLoader();

        // aetTimeout(async () => {
        try {

            let res = await RNFetchBlob.fetch('GET', download, {});
            let status = res.info().status;

            if (status == 200) {
                let base64Str = res.base64();

                let IMAGES = PATH;
                let DB = PATH_REALM + "/" + PATH_REALM_FILE;

                let filename = await writeZip(base64Str);

                // Delete all images
                let files = await RNFetchBlob.fs.ls(PATH);

                if (files.length > 0) {
                    files.map(file => {
                        RNFetchBlob.fs.unlink(IMAGES + '/' + file).then(() => { })
                    });
                }

                //Remove realm file
                RNFetchBlob.fs.unlink(DB);

                if (!RNFetchBlob.fs.exists(DB)) {
                    throw Strings.CANNOT_DElETE_DATABASE_FILE;
                }

                const sourcePath = PATH_ZIP + "/" + filename;
                const targetPath = IMAGES;

                await unzip(sourcePath, targetPath);

                // Move realm file to db destination
                let copy = await RNFetchBlob.fs.cp(targetPath + '/' + PATH_REALM_FILE, DB);

                // Check if db file is copied
                if (!(await RNFetchBlob.fs.exists(DB))) {
                    throw Strings.CANNOT_COPY_DATABASE_FILE;
                }

                // Remove db file from zip
                RNFetchBlob.fs.unlink(targetPath + '/' + PATH_REALM_FILE);

                this._hideLoader();
                RestartAndroid.restart();

            } else {
                throw Strings.PROBLEM_DOWNLOADING_BACKUP;
            }

        } catch (error) {
            this._hideLoader();
            alert(error);
        }
        // }, 1000);
    }

    _sync = async () => {

        let ID = DeviceInfo.getUniqueID();
        let file = RealmFile();
        let name = this.state.name;

        if (name.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_NAME, ToastAndroid.LONG); return;
        }

        this._showLoader();

        setTimeout(() => {

            RNFetchBlob.fs.ls(PATH)
                .then((files) => {

                    let formFiles = [];
                    formFiles.push({ name: 'realm', filename: PATH_REALM_FILE, data: RNFetchBlob.wrap(RealmFile()) });

                    if (files.length > 0) {
                        files.map((file => {
                            formFiles.push({ name: 'images[]', filename: file, data: RNFetchBlob.wrap(PATH + "/" + file) });
                        }));
                    }

                    RNFetchBlob.fetch('POST', 'http://upload.bibi.ge/api/upload', {
                        'haccp-device': ID,
                        'name': name,
                        'Content-Type': 'multipart/form-data',
                    }, formFiles).then((resp) => {
                        this._hideLoader();
                        this.props.navigation.navigate("AdminHome");

                        // if (resp.data.length > 0) {
                            // alert(resp.data);
                        // }

                        ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
                    }).catch((err) => {
                        this._hideLoader();
                        alert(err);
                    });
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

                        <View style={this.state.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.BACKUP_NAME}
                                value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                            {this.state.name.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.name.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        {this.state.connected == 1 && <Button primary style={styles.button} onPress={() => { this._sync() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.UPLOAD}</Text>
                            </Left>
                            <Right>
                                <Icon name='sync' style={{ color: 'white', }} />
                            </Right>
                        </Button>}

                        {!this.state.connected && <Button danger style={styles.button}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.NO_CONNECTION}</Text>
                            </Left>
                            <Right>
                                <Icon name='wifi' style={{ color: 'white', }} />
                            </Right>
                        </Button>}


                        <View style={{ height: 100, }}></View>

                        <H2 style={{ textAlign: 'center', color: 'red', marginBottom: 25, }}>{Strings.DANGER_ZONE}</H2>
                        <H3 style={{ textAlign: 'center', color: 'red', marginBottom: 25 }}>{Strings.RESTORE_WARNING}</H3>

                        <View style={this.state.backup_id.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
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
                    </View>
                </Content >
            </Container>
        );
    }
}

