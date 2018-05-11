import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addPicture, Pictures } from '../../../database/realm';


export class ArchiveIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Archive',
            drawerIcon: ({ tintColor }) => (
                <Icon name='calendar' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={"Archive"} />,
            // headerRight: <Menu navigation={navigation} />,
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
        let { image } = this.state;
        return (
            <Container style={{ alignItems: 'center' }}>
                <Content>
                    <View>
                        <H3>CALENDAR</H3>
                    </View>
                </Content>
            </Container>
        );
    }
}