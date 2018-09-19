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
    ListView,
    RefreshControl,
    Text,
    Alert,
} from 'react-native';
import { Container, Header, Content, Button, Picker, H1, H2, H3, Icon, Fab, List, ListItem, Left, Right, H4, H5, } from 'native-base';
import { NoBackButton, LogoTitle, Menu, Space } from '../../../components/header';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr'
import { RealmFile } from '../../../database/realm';
import Upload from 'react-native-background-upload'
import DeviceInfo from 'react-native-device-info';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import RNFetchBlobOld from 'react-native-fetch-blob';
import { PATH_BACKUP, PATH, PATH_REALM, PATH_REALM_FILE } from '../../../utilities/index';
import { MainBundlePath, DocumentDirectoryPath } from 'react-native-fs'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { RestartAndroid } from 'react-native-restart-android'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';

export class AdminBackupRestoreScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.BACKUPS,
            drawerIcon: ({ tintColor }) => (
                <Icon name='lock' style={{ color: tintColor, }} />
            ),
            headerTitle: <LogoTitle HeaderText={Strings.BACKUPS} />,
            headerRight: <Space />,

        };
    };

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            active: true,
            loading: 0,

            refreshig: false,
            basic: true,
            listViewData: [],
            dimesions: { width, height } = Dimensions.get('window'),
        };
    }

    componentDidMount = () => {
        this._loadItems();
    }

    _onRefresh() {
        this._loadItems();
    }

    _loadItems = () => {
        RNFS.readDir(PATH_BACKUP).then(files => {
            this.setState({ listViewData: files.reverse(), refreshing: false });
        }).catch(error => {
            //alert(error);
        });
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

    _restoreAsk(zip) {
        Alert.alert(
            Strings.DELETE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._restore(zip) },
            ],
            { cancelable: false }
        )
    }

    _restore(zip) {

        this._showLoader();

        let zipPath = zip.path;
        let DB = PATH_REALM + "/" + PATH_REALM_FILE;

        RNFS.readDir(PATH).then(async files => {
            //Delete all images
            if (files.length > 0) {
                files.map(file => {
                    RNFetchBlob.fs.unlink(PATH + '/' + file).then(() => { })
                });
            }

            //Delete db file
            RNFetchBlob.fs.unlink(DB);

            const sourcePath = zipPath;
            const targetPath = PATH;

            //Unzip backup
            await unzip(sourcePath, targetPath);

            // Move beckup db file to destination
            await RNFetchBlob.fs.cp(targetPath + '/' + PATH_REALM_FILE, DB);

            //Remove realm file from unzipped folder
            RNFetchBlob.fs.unlink(targetPath + '/' + PATH_REALM_FILE);

            //Restart application
            RestartAndroid.restart();

        }).catch(error => {
            this._hideLoader();
            alert(error);
        });
    }


    _deleteRowAsk(data, secId, rowId, rowMap) {
        Alert.alert(
            Strings.DELETE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._deleteRow(data, secId, rowId, rowMap) },
            ],
            { cancelable: false }
        )
    }

    _deleteRow(data, secId, rowId, rowMap) {

        this._showLoader();

        //Delete zip file
        RNFetchBlob.fs.unlink(data.path).then(() => {
            rowMap[`${secId}${rowId}`].props.closeRow();
            this._loadItems();
            this._hideLoader();
        }).catch(error => {
            this._hideLoader();
        });
    }

    render() {
        return (
            <Container>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => { this._onRefresh() }} />
                }>

                    {!this.state.listViewData.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                        <Icon name='snow' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                        <Text style={{ color: 'lightgray', fontSize: 25, marginTop: 20, }} >THERE IS NO BACKUPS YET</Text>
                    </View>}

                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 100, paddingLeft: 15, }}>
                                <Left>
                                    <View style={{ textAlign: 'left', }}>
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize, }}>{data.name} </Text>
                                        <Text style={{ marginBottom: 10, color: 'gray' }}>{Strings.CLICK_ICON_RIGHT_TO_RESTORE_THIS_BACKUP}</Text>
                                    </View>
                                </Left>
                                <Right>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 140, }}>
                                        <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, marginRight: 5, }} full danger onPress={_ => this._deleteRowAsk(data, secId, rowId, rowMap)}>
                                            <Icon active name="trash" />
                                        </Button>
                                        <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, }} full danger onPress={_ => this._restoreAsk(data)}>
                                            <Icon active name="build" />
                                        </Button>
                                    </View>
                                </Right>
                            </ListItem>}
                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full
                                onPress={() => this.props.navigation.navigate('AdminCleanItem', data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <View style={{ flex: 1, }}>
                                <Button disabled full onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>
                            </View>
                        }
                        // leftOpenValue={75}
                        // rightOpenValue={-75}

                        leftOpenValue={0}
                        rightOpenValue={0}
                    />
                </Content>
            </Container>
        );
    }
}

