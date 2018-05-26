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
import { PATH, realmFilePath } from '../../../utilities/index';


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
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
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

    _sync = async () => {

        let ID = DeviceInfo.getUniqueID();
        let file = RealmFile();

        this._showLoader();
        const options = {
            url: 'http://upload.bibi.ge/api/upload',
            path: file,
            method: 'POST',
            field: 'dbfile',
            type: 'multipart',
            headers: {
                'content-type': 'application/octet-stream',
                'haccp-device': ID,
            },
        }

        setTimeout(() => {

            Upload.startUpload(options).then((uploadId) => {

                Upload.addListener('progress', uploadId, (data) => {
                })

                Upload.addListener('error', uploadId, (data) => {
                    this._hideLoader();
                    Talert(data.error);
                })

                Upload.addListener('cancelled', uploadId, (data) => {
                    this._hideLoader();
                    ToastAndroid.show(Strings.DATA_UPLOADED_CANCELED, ToastAndroid.LONG);
                })

                Upload.addListener('completed', uploadId, (data) => {
                    this._hideLoader();
                    this.props.navigation.navigate("AdminHome");
                    ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
                })

            }).catch((err) => {
                this._hideLoader();
                alert(err);
            })

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
                                <H3 style={{ marginBottom: 30, }}>{RealmFile()}</H3>
                                <H3 style={{ marginBottom: 30, }}>{PATH}</H3>

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