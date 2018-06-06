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
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Equipments, DeleteEquipment, Departments } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';

export class AdminEquipmentsIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.EQUIPMENTS,
            drawerIcon: ({ tintColor }) => (
                <Icon name='analytics' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.EQUIPMENTS} />,
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
            departments: [],
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
        const departments = await Departments();

        this.setState({
            loading: 0,
            userSession: userSession,
            userSessionType: userSessionType,
            departments: departments,
        });
    };

    _loadItems = async () => {
        let items = await Equipments();
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

    _allowDelete(id) {

        let choosed = [];

        this.state.departments.map(department => {
            department.equipments.map(item => {

                let idE = item.split(":")[0]

                if (idE == id) {
                    choosed.push(1);
                }
            });
        });

        if (choosed.length == 0) {
            return true;
        }

        return false;
    }

    _deleteRow(id, secId, rowId, rowMap) {

        rowMap[`${secId}${rowId}`].props.closeRow();

        DeleteEquipment(id).then(item => {
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
                        <Text style={{ color: 'lightgray', fontSize: 25, }} >{Strings.THERE_IS_NO_EQUIPMENTS_YET}</Text>
                    </View>}

                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 100, paddingLeft: 15, }}>
                                <Left>
                                    <View style={{ textAlign: 'left', }}>
                                        <Text style={{ marginBottom: 10, color: 'black', fontSize: inputAndButtonFontSize,}}>{data.name} </Text>
                                    </View>
                                </Left>
                                <Right>
                                    <View style={{ flexDirection: 'row', flex: 1, margin: 0, width: 250, }}>
                                        <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} full light
                                            onPress={() => this.props.navigation.navigate('AdminEquipmentsItem', data)}>
                                            <Icon active name="build" />
                                        </Button>
                                        {this._allowDelete(data.id) && <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} full danger onPress={_ => this._deleteRowAsk(data.id, secId, rowId, rowMap)}>
                                            <Icon active name="trash" />
                                        </Button>}
                                        {!this._allowDelete(data.id) && <Button style={{ flex: 0.5, height: 65, borderLeftWidth: 0, }} full disabled>
                                            <Icon active name="trash" />
                                        </Button>}
                                    </View>
                                </Right>                        
                            </ListItem>}
                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full
                                onPress={() => this.props.navigation.navigate('AdminEquipmentsItem', data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <View style={{ flex: 1, }}>
                                {true && <Button full danger onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            </View>
                        }
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

                    onPress={() => this.props.navigation.navigate('AdminEquipmentsItem', {
                        id: "",
                        name: "",
                        source: null,
                    })}>

                    <Icon name="add" />
                </Fab>
            </Container>
        );
    }
}