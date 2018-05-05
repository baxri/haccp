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

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon, Fab, List, ListItem, Left, Right } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Users, DeleteUser } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';

export class AdminUsersIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Users',
            drawerIcon: ({ tintColor }) => (
                <Icon name='people' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Users" />,
            headerRight: <Menu navigation={navigation} />,
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

    _loadItems() {
        Users().then(items => {
            this.setState({ listViewData: items, refreshing: false });
        }).catch(error => {
            alert(error);
        });;
    }

    _deleteRow(id, secId, rowId, rowMap) {

        rowMap[`${secId}${rowId}`].props.closeRow();

        DeleteUser(id).then(item => {
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
                <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                <Content refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => { this._onRefresh() }} />
                }>

                    {!this.state.listViewData.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                        <Icon name='people' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                        <Text style={{ color: 'lightgray', fontSize: 25, }} >There is no users yet</Text>
                    </View>}

                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem style={{ height: 70, padding: 15, }}>
                                <Left>
                                    <Text>{data.name} {data.lastname} ({data.department.name})</Text>
                                </Left>
                                <Right>
                                    <Text></Text>
                                </Right>
                            </ListItem>}
                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full
                                onPress={() => this.props.navigation.navigate('AdminUsersItem', data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                <Icon active name="trash" />
                            </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />

                </Content>
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"

                    onPress={() => this.props.navigation.navigate('AdminUsersItem', {
                        id: "",
                        name: "",
                        lastname: "",
                        department: {
                            id: ''
                        }
                    })}>
                    <Icon name="add" />
                </Fab>
            </Container>
        );
    }
}