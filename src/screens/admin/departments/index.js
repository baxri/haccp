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
import { Departments, DeleteDepartment } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';

export class AdminDepartmentsIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.DEPARTMENTS,
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.DEPARTMENTS} />,
            headerRight: <Equipments navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            active: true,
            loading: 1,
            userSession: '',
            userSessionType: '',

            refreshig: false,
            basic: true,
            listViewData: [],
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
        const userSession = await AsyncStorage.getItem('userSession');
        const userSessionType = await AsyncStorage.getItem('userSessionType');

        this.setState({
            loading: 0,
            userSession: userSession,
            userSessionType: userSessionType,
        });
    };

    _loadItems = async () => {
        let items = await Departments();
        this.setState({ listViewData: items, refreshing: false });
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


    _deleteRow(id, secId, rowId, rowMap) {

        rowMap[`${secId}${rowId}`].props.closeRow();

        if (this.state.listViewData[rowId].users.length > 0) {
            return;
        }

        DeleteDepartment(id).then(item => {
            rowMap[`${secId}${rowId}`].props.closeRow();
            this._loadItems();
        }).catch(error => {
            alert(error);
        });;
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
                        <Icon name='briefcase' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                        <Text style={{ color: 'lightgray', fontSize: 25, }} >{Strings.THERE_IS_NO_DEPARTMENTS_YET}</Text>
                    </View>}

                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 100, paddingLeft: 15, }}>
                                <Left>
                                    <View style={{ textAlign: 'left', }}>
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize, }}>{data.name} </Text>
                                        <Text style={{ marginBottom: 5 }}>{Strings.USERS}: {data.users.length} </Text>
                                        <Text>{Strings.EQUIPMENTS}:  ({data.equipments.length}) </Text>
                                    </View>

                                </Left>
                                <Right>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 250, }}>

                                        <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} full light
                                            onPress={() => this.props.navigation.navigate('AdminDepartmentsItem', data)}>
                                            <Icon active name="build" />
                                        </Button>

                                        {data.users.length > 0 && <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} disabled full onPress={_ => this._deleteRowAsk(data.id, secId, rowId, rowMap)}>
                                            <Icon active name="trash" />
                                        </Button>}
                                        {data.users.length == 0 && <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} full danger onPress={_ => this._deleteRowAsk(data.id, secId, rowId, rowMap)}>
                                            <Icon active name="trash" />
                                        </Button>}
                                    </View>
                                </Right>
                            </ListItem>}
                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full
                                onPress={() => this.props.navigation.navigate('AdminDepartmentsItem', data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <View style={{ flex: 1, }}>
                                {data.users.length > 0 && <Button disabled full onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                                {data.users.length == 0 && <Button full danger onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            </View>
                        }
                        // leftOpenValue={75}
                        // rightOpenValue={-75}

                        leftOpenValue={0}
                        rightOpenValue={0}
                    />
                </Content>
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#494949' }}
                    position="bottomRight"

                    onPress={() => this.props.navigation.navigate('AdminDepartmentsItem', {
                        id: "",
                        name: "",
                        equipments: [],
                        fourniseurs: [],
                    })}>

                    <Icon name="add" />
                </Fab>
            </Container>
        );
    }
}