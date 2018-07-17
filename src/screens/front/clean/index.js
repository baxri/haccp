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
import { CleanSchedulesFront as CleanSchedules, addControle, addArchive, cleanDone, checkCleanDone } from '../../../database/realm';
import { FilePicturePath, writePicture, toDate, toYM, renderFieldDanger, renderOption, renderFieldSuccess, guid } from '../../../utilities/index';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';

export class FrontCleanIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.CLEANING_SCHEDULE,
            drawerIcon: ({ tintColor }) => (
                <Icon name='snow' style={{ color: tintColor, }} />
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
            active: true,
            loading: 1,
            userId: null,
            userSession: '',
            userSessionType: '',

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

    _loadItems = async () => {
        let items = await CleanSchedules();
        let newItems = [];

        items.map(async (schedule, index) => {
            let done = await checkCleanDone(schedule.equipment);
            if (done.length > 0) {
                newItems.push({ ...{ done: 1 }, ...schedule });
            } else {
                newItems.push({ ...{ done: 0 }, ...schedule });
            }
        });

        this.setState({ listViewData: newItems, refreshing: false });
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
        Alert.alert(
            Strings.DELETE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._cleanDone(schedule) },
            ],
            { cancelable: false }
        )
    }

    _cleanDone(schedule) {

        this._showLoader();

        setTimeout(() => {

            addControle(this.state.userId, {
                equipment: schedule.equipment,

                source: '',
                signature: '',

                produit: '',
                fourniser: '',
                dubl: '',

                aspect: 0,
                du_produit: '',

                intact: 0,
                conforme: 0,
                autres: '',
                actions: '',
                confirmed: 1,

                temperatures: [],
                type: 3,

                quantity: 0,
                valorisation: '',
                causes: '',
                devenir: '',
                traitment: '',

                date: this.state.date,
                created_at: this.state.created_at,
            }).then(res => {

                cleanDone(schedule.equipment);

                addArchive(this.state.date, this.state.YM, true, this.state.userId);

                // this.props.navigation.navigate('Home');
                this._loadItems();
                this._hideLoader();
                ToastAndroid.show(Strings.SCHEDULE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
            }).catch(error => {
                alert(error);
            });

        }, 500);
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
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize, }}>{data.type == 1 ? Strings.MONTHLY : Strings.WEEKLY} </Text>
                                    </View>

                                </Left>
                                <Right>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 150, }}>
                                        {data.done == 0 && <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, }} full success onPress={_ => this._askCleanDone(data)}>
                                            <Text style={[{ color: 'white' }, styles.text]}>{Strings.CLEAN}</Text>
                                        </Button>}

                                        {data.done == 1 && <Button style={{ flex: 1, height: 65, borderLeftWidth: 0, }} full disabled>
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