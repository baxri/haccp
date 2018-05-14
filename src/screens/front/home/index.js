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
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('TraceIndex')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='camera' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.TRACEABILITY}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('ControleIndex')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='eye' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.RECEPTION_CHECK}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('FroidIndex')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='snow' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.CONTROLE_FROID}</Text>
                                </View>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert(Strings.COMMING_SOON)}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='thermometer' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.CONTROLE_CHAUD}</Text>
                                </View>
                            </Button>
                        </Col>
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert(Strings.COMMING_SOON)}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='water' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.CLEANING}</Text>
                                </View>
                            </Button>
                        </Col>
                        {/* <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('ArchiveIndex')}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='calendar' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >Archive</Text>
                                </View>
                            </Button>
                        </Col> */}
                        <Col style={{ borderWidth: 1, borderColor: '#F5F5F5' }}>
                            <Button full light style={{ flex: 1 }} onPress={() => alert(Strings.COMMING_SOON)}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name='calendar' fontSize={50} size={50} style={{ color: '#5783FF', fontSize: 80, }} />
                                    <Text style={{ color: '#5783FF', fontSize: 20, marginTop: 20, textAlign: 'center' }} >{Strings.ARCHIVE}</Text>
                                </View>
                            </Button>
                        </Col>
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