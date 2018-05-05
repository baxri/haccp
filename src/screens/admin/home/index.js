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


export class AdminHomeIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Dashboard',
            drawerIcon: ({ tintColor }) => (
                <Icon name='home' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Dashboard" />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

    };

    render() {
        return (
            <Container>
                <Grid>
                    <Row >
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminDepartments')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='briefcase' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 100, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 25, marginTop: 20, }} >Departments</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminUsers')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='people' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 100, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 25, marginTop: 20, }} >Users</Text>
                                </View>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('AdminBackup')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='sync' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 100, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 25, marginTop: 20, }} >Backup</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert("Cleaning Schedule (leave that for now I have to define that)")}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='snow' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 100, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 25, marginTop: 20, }} >Cleaning Schedule</Text>
                                </View>
                            </Button>
                        </Col>

                    </Row>
                </Grid>
            </Container>
        );
    }
}