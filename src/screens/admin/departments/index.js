import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ListView,
    FlatList,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon, Fab, List, ListItem, RefreshControl } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Departments, DeleteDepartment } from '../../../database/realm';

export class AdminDepartmentsIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Departments',
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Departments" />,
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
        Departments().then(items => {
            this.setState({ listViewData: items });
        }).catch(error => {
            alert(error);
        });;
    }

    _deleteRow(id) {
        DeleteDepartment(id).then(item => {
            this._loadItems();
        }).catch(error => {
            alert(error);
        });;
    }

    _editRow(data) {
        this.props.navigation.navigate('AdminDepartmentsItem', data);
    }

    _onRefresh() {
        this.setState({ refreshig: true });
    }

    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <Container>
                <Content>
                    <List
                        refreshing={this.state.refreshig}
                        onRefresh={this._onRefresh}

                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem style={{ height: 70, padding: 15, }}>
                                <Text> {data.name} </Text>
                            </ListItem>}
                        renderLeftHiddenRow={data =>
                            <Button full onPress={_ => this._editRow(data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this._deleteRow(data.id)}>
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
                    onPress={() => {
                        this.props.navigation.navigate('AdminDepartmentsItem', {
                            id: "",
                            name: "",
                        });
                    }}>
                    <Icon name="add" />
                </Fab>
            </Container>
        );
    }
}