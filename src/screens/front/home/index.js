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
import Strings from '../../../language/fr';
import { CleanSchedulesFront as CleanSchedules, allDoneCleans } from '../../../database/realm';
import { sprintf } from 'sprintf-js';

export class HomeIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.DASHBOARD,
            drawerIcon: ({ tintColor }) => (
                <Icon name='home' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.DASHBOARD} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            departments: [],
            users: [],
            tasks: [],
            done: [],
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        let tasks = await CleanSchedules();
        let done = await allDoneCleans();

        this.setState({ tasks: tasks, done: done });
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
                    {(this.state.tasks.length - this.state.done.length) > 0 && <Row style={{ margin: 30, height: 150, borderStyle: 'dotted', }}>
                        <Col style={{ borderWidth: 3, borderColor: 'red' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('FrontCleanIndex')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='alert' fontSize={50} size={50} style={{ color: 'red', fontSize: 50, marginBottom: 20, }} />
                                    <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }} >
                                        {sprintf(Strings.YOU_HAVEN_TASKS_TO_DONE_TODAY, this.state.tasks.length, this.state.done.length, this.state.tasks.length)}
                                    </Text>
                                </View>
                            </Button>
                        </Col>
                    </Row >}
                    <Row >
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Trace')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='camera' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.TRACEABILITY}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Controle')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='eye' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.RECEPTION_CHECK}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Froid')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='snow' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.CONTROLE_FROID}</Text>
                                </View>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('NonConforme')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='alert' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.NONCONFORME}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Nonconflist')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='list-box' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.NONCONFORMELIST}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Archive')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='calendar' fontSize={50} size={50} style={{ color: '#494949', fontSize: 80, }} />
                                    <Text style={{ color: '#494949', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.ARCHIVE}</Text>
                                </View>
                            </Button>
                        </Col>
                        {/* <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert(Strings.COMMING_SOON)}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='calendar' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.ARCHIVE}</Text>
                                </View>
                            </Button>
                        </Col> */}
                    </Row>
                    {/* <Row>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert('navigate')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='alert' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center', }} >Product control</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert('navigate')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='keypad' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >Summary</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>

                        </Col>
                    </Row> */}
                </Grid>
            </Container>
        );
    }
}