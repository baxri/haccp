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
import { Container, Header, Tab, Tabs, TabHeading, Content, Button, Picker, H1, H2, H3, Icon, Fab, List, ListItem, Left, Right, H4, H5, } from 'native-base';
import { NoBackButton, LogoTitle, Menu, Space, ProgressBar } from '../../../components/header';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr'
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';
import { PATH_BACKUP, PATH, PATH_REALM, PATH_REALM_FILE, PATH_DOWNLOAD } from '../../../utilities/index';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { RestartAndroid } from 'react-native-restart-android'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';
import { startUpload } from '../../../utilities/backup';

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
        this.ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            active: true,
            loading: 0,
            loadingZip: 0,

            refreshig: false,
            basic: true,
            listViewData: [],
            listViewData2: [],
            dimesions: { width, height } = Dimensions.get('window'),
            zipProgress: 0,
        };
    }

    componentWillUnmount() {
        this.zipProgress.remove()
    }

    componentDidMount = () => {

        this.zipProgress = subscribe((objectProgress) => {
            this.setState({ zipProgress: objectProgress.progress })
        })

        this._loadItems();
        this._loadItems2();
    }

    _onRefresh() {
        this._loadItems();
        this._loadItems2();
    }

    _loadItems = () => {
        RNFS.readDir(PATH_BACKUP).then(files => {
            this.setState({ listViewData: files.reverse(), refreshing: false });
        }).catch(error => {
            // alert(error);
        });
    }

    _loadItems2 = () => {
        RNFS.readDir(PATH_DOWNLOAD).then(files => {
            this.setState({ listViewData2: files.filter(file => file.name.includes(".zip")).reverse(), refreshing: false });
        }).catch(error => {
            // alert(error);
        });
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

        this._showLoaderZip();

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
            let unzipped = await unzip(sourcePath, targetPath);

            let newDbFile = unzipped + '/' + PATH_REALM_FILE;

            console.log(newDbFile);

            let exists = await RNFetchBlob.fs.exists(newDbFile);

            if (!exists) {
                throw new Error('DB_FILE_NOT_FOUND');
            }

            // Move beckup db file to destination
            await RNFetchBlob.fs.cp(unzipped + '/' + PATH_REALM_FILE, DB);

            //Remove realm file from unzipped folder
            RNFetchBlob.fs.unlink(unzipped + '/' + PATH_REALM_FILE);

            //Restart application
            RestartAndroid.restart();
        }).catch(error => {
            this._hideLoaderZip();
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
            this._loadItems2();
            this._hideLoader();
        }).catch(error => {
            this._hideLoader();
        });
    }

    _uploadOnlyAsk(data) {
        Alert.alert(
            Strings.DELETE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._uploadOnly(data) },
            ],
            { cancelable: false }
        )
    }

    _uploadOnly = async (data) => {

        this._showLoader();

        try {
            startUpload(data.path, data.name, '123');
            this._hideLoader();
            ToastAndroid.show(Strings.DATA_SUCCESSFULLY_UPLOADED, ToastAndroid.LONG);
        } catch (error) {
            alert(error);
            this._hideLoader();
        } finally {
            this._hideLoader();
        }

    }

    render() {
        return (
            <Container >
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <ProgressBar visible={this.state.loadingZip} progressValue={parseInt(this.state.zipProgress * 100)} />

                <Tabs style={{ backgroundColor: 'white', flex: 1, }} >
                    <Tab style={{ height: 100, }} heading={<TabHeading style={{ backgroundColor: 'lightgray', }}>
                        <Icon name="folder" style={{ color: 'white', marginRight: 10, }} />
                        <Text style={{ color: 'white', }}>LOCAL</Text>
                    </TabHeading>}>
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
                                        <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 210, }}>
                                            <Button style={{ flex: 3.3, height: 65, borderLeftWidth: 0, marginRight: 5, }} full danger onPress={_ => this._deleteRowAsk(data, secId, rowId, rowMap)}>
                                                <Icon active name="trash" />
                                            </Button>
                                            <Button style={{ flex: 3.3, height: 65, borderLeftWidth: 0, marginRight: 5, }} full danger onPress={_ => this._restoreAsk(data)}>
                                                <Icon active name="build" />
                                            </Button>
                                            <Button style={{ flex: 3.4, height: 65, borderLeftWidth: 0, }} full danger onPress={_ => this._uploadOnlyAsk(data)}>
                                                <Icon active name="cloud-upload" />
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
                            leftOpenValue={0}
                            rightOpenValue={0}
                        />
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: 'lightgray' }}>
                        <Icon name="download" style={{ color: 'white', marginRight: 10, }} />
                        <Text style={{ color: 'white', }}>DOWNLOADS</Text>
                    </TabHeading>}>
                        {!this.state.listViewData2.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                            <Icon name='snow' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                            <Text style={{ color: 'lightgray', fontSize: 25, marginTop: 20, }} >THERE IS NO DOWNLOADS YET</Text>
                        </View>}

                        <List
                            dataSource={this.ds.cloneWithRows(this.state.listViewData2)}
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
                                            <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, marginRight: 5, }} full danger onPress={_ => this._deleteRowAsk(data, secId, rowId, rowMap)}>
                                                <Icon active name="trash" />
                                            </Button>
                                            <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, marginRight: 5, }} full danger onPress={_ => this._restoreAsk(data)}>
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
                            leftOpenValue={0}
                            rightOpenValue={0}
                        />

                    </Tab>
                </Tabs>



                {/* </Content> */}
            </Container>
        );
    }
}

