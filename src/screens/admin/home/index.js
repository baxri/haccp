import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Departments, Users } from '../../../database/realm';
import Strings from '../../../language/fr'

export class AdminHomeIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.DASHBOARD,
            drawerIcon: ({ tintColor }) => (
                <Icon name='home' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.DASHBOARD} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            departments: [],
            users: [],
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

    };

    componentDidMount() {
        this._loadItems();
    };

    componentDidFocus() {
        this._loadItems();
    };

    _loadItems = async () => {
        let departments = await Departments();
        let users = await Users();

        this.setState({ departments: departments, users: users });
    }

    render() {
        return (
            <Container>
                <Grid>
                    <Row >
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminDepartments')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='briefcase' fontSize={50} size={50} style={{ color: '#494949', fontSize: 100, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, }} >{Strings.DEPARTMENTS} ({this.state.departments.length})</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminUsers')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='people' fontSize={50} size={50} style={{ color: '#494949', fontSize: 100, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, }} >{Strings.USERS} ({this.state.users.length})</Text>
                                </View>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminBackup')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='sync' fontSize={50} size={50} style={{ color: '#494949', fontSize: 100, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, }} >{Strings.BACKUP}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert(Strings.COMMING_SOON)}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='snow' fontSize={50} size={50} style={{ color: '#494949', fontSize: 100, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, }} >{Strings.CLEANING_SCHEDULE}</Text>
                                </View>
                            </Button>
                        </Col>

                    </Row>
                </Grid>
            </Container>
        );
    }
}