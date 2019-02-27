import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ListView,
    FlatList,
    RefreshControl,
    ToastAndroid,
    Text,
    Alert,

} from 'react-native';
import { Container, Header, Content, Button, Picker, H1, H2, H3, Icon, Fab, List, ListItem, Left, Right, H4, H5, } from 'native-base';
import { NoBackButton, LogoTitle, Menu, Equipments } from '../../../components/header';
import { CleanSchedulesFront as CleanSchedules, addControle, addArchive, cleanDone, allDoneCleans } from '../../../database/realm';
import { FilePicturePath, writePicture, toDate, toYM, renderFieldDanger, renderOption, renderFieldSuccess, guid } from '../../../utilities/index';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';
import { imagePickerOptions } from '../../../utilities/image-picker';
import { launchCamera } from 'react-native-image-picker';

export class FrontCleanIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.CLEANING_SCHEDULE,
            drawerIcon: ({ tintColor }) => (
                <Icon name='brush' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.CLEANING_SCHEDULE} />,
            // headerRight: <Equipments navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            done: [],
            active: true,
            loading: 1,
            userId: null,
            userSession: '',
            userSessionType: '',
            source: null,

            refreshig: false,
            basic: true,
            listViewData: [],
            date: toDate(new Date()),
            YM: toYM((new Date())),
            created_at: new Date(),
        };

        this._bootstrapAsync();
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    componentDidMount() {
        this._loadItems();
    };

    componentDidFocus() {
        this._loadItems();
    };

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const userSession = await AsyncStorage.getItem('userSession');
        const userSessionType = await AsyncStorage.getItem('userSessionType');

        this.setState({
            userId: userID,
            loading: 0,
            userSession: userSession,
            userSessionType: userSessionType,
        });
    };

    _done = (schedule) => {
        let done = this.state.done;
        let index = done.indexOf(schedule.id + "-" + schedule.equipment.id);
        if (index > -1) {
            return true;
        }
        return false;
    }

    _loadItems = async () => {
        try {
            let items = await CleanSchedules();
            let cleans = await allDoneCleans();
            let done = [];

            cleans.map(row => {
                if (row.schedule) {
                    done.push(row.schedule.id + "-" + row.equipment.id);
                } else {
                    done.push(row.equipment.id);
                }
            });

            this.setState({ listViewData: items, refreshing: false, done: done });
        } catch (error) {
            alert(error);
        }
    }

    _deleteRowAsk(id, secId, rowId, rowMap) {
        Alert.alert(
            Strings.DELETE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._deleteRow(id, secId, rowId, rowMap) },
            ],
            { cancelable: false }
        )
    }

    _askCleanDone(schedule) {

        // This is new stuff to navigate on new page 
        this.props.navigation.navigate('FrontCleanDone', schedule)

        // This is an old stuff
        // Alert.alert(
        //     Strings.DELETE,
        //     Strings.ARE_YOU_SURE,
        //     [
        //         { text: Strings.CANCEL, style: 'cancel' },
        //         { text: Strings.OK, onPress: () => this._pickImage(schedule) },
        //     ],
        //     { cancelable: false }
        // )
    }

    _onRefresh() {
        this._loadItems();
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
                        <Text style={{ color: 'lightgray', fontSize: 25, marginTop: 20, }} >{Strings.THERE_IS_NO_SCHEDULES_YET}</Text>
                    </View>}

                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 100, paddingLeft: 15, }}>
                                <Left>
                                    <View style={{ textAlign: 'left', }}>
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize, }}>{data.equipment.name} </Text>
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize, }}>
                                            {data.type == 1 && Strings.MONTHLY}
                                            {data.type == 2 && Strings.WEEKLY}
                                            {data.type == 3 && Strings.DAILY}
                                        </Text>
                                    </View>

                                </Left>
                                <Right>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 230, }}>
                                        {!this._done(data) && <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, }} full success onPress={_ => this._askCleanDone(data)}>
                                            <Text style={[{ color: 'white' }, styles.text]}>{Strings.CLEAN}</Text>
                                        </Button>}

                                        {this._done(data) && <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, }} full
                                            onPress={() => this.props.navigation.navigate('ArchiveList', {
                                                selectedStartDate: this.state.date
                                            })}>
                                            <Text style={[{ color: 'white' }, styles.text]}>{Strings.DONE}</Text>
                                        </Button>}
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