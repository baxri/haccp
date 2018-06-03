import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ToastAndroid,
    NetInfo,
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
        };

        this._bootstrapAsync();
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
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

        let download = 'http://upload.bibi.ge/admin/download/21';

        let res = await RNFetchBlob.fetch('GET', download, {});
        let status = res.info().status;

        if (status == 200) {
            let base64Str = res.base64();
            // the following conversions are done in js, it's SYNC
            // let text = res.text()
            // let json = res.json()

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
            RNFetchBlob.fs.unlink(DB).then(() => { })

            const sourcePath = PATH_ZIP + "/" + filename;
            const targetPath = IMAGES;

            unzip(sourcePath, targetPath).then((path) => {

                // Move realm file to db destination
                RNFetchBlob.fs.cp(targetPath + '/' + PATH_REALM_FILE, DB).then((mv) => {

                    RNFetchBlob.fs.exists(DB)
                        .then((exist) => {
                            RNFetchBlob.fs.unlink(targetPath + '/' + PATH_REALM_FILE).then(() => { });

                            alert(exist);
                        })
                        .catch((error) => { alert(error) })

                }).catch((error) => { alert(error) })

            })
                .catch((error) => {
                    alert(error);
                });

        } else {
            alert("Error code" + status);
        }

        return;
    }

    _sync = async () => {

        let ID = DeviceInfo.getUniqueID();
        let file = RealmFile();
        let name = this.state.name;

        if (name.length == 0) {
            ToastAndroid.show(Strings.PLEASE_ENTER_BACKUP_NAME, ToastAndroid.LONG); return;
        }

        setTimeout(() => {

            console.log(PATH);

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

                        if (resp.data.length > 0) {
                            alert(resp.data);
                        }

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
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />

                <Content>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.BACKUP}</H1>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <Form>

                            <View style={{ alignItems: 'center' }}>

                                <H3 style={{ marginBottom: 10, }}>{Strings.UNIQUE_ID}: {DeviceInfo.getUniqueID()}</H3>
                                <H3 style={{ marginBottom: 30, }}>{Strings.APP_ID}: {DeviceInfo.getInstanceID()}</H3>
                                {/* <H3 style={{ marginBottom: 30, }}>{RealmFile()}</H3>
                                <H3 style={{ marginBottom: 30, }}>{PATH}</H3> */}


                                <Item floatingLabel style={styles.input}>
                                    <Label>{Strings.BACKUP_NAME}</Label>
                                    <Input onChangeText={(value) => { this.setState({ name: value }) }} />
                                </Item>

                                {this.state.connected == 1 && <Button primary style={styles.button} onPress={() => { this._sync() }}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.UPLOAD}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='sync' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}

                                {!this.state.connected && <Button danger style={styles.button}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.NO_CONNECTION}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='wifi' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}

                                <View style={{ height: 150, }}></View>

                                <Item floatingLabel style={styles.input}>
                                    <Label>{Strings.BACKUP_ID}</Label>
                                    <Input eyboardType="numeric" onChangeText={(value) => { this.setState({ backup_id: value }) }} />
                                </Item>

                                {true && <Button primary style={styles.button} onPress={() => { this._restore() }}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.RESTORE}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='cloud-download' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}

                            </View>
                        </Form>
                    </View>
                </Content >
            </Container>
        );
    }
}



const styles = StyleSheet.create({
    input: {
        width: 400,
        paddingBottom: 10,
    },
    button: {
        width: 400,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 40,
        marginLeft: 15,
        padding: 20,
    },
});