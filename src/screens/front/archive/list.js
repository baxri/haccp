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
import { Container, Header, Content, Button, Text, Picker, H2, Icon, FooterTab, Footer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addPicture, Pictures } from '../../../database/realm';
import CalendarPicker from 'react-native-calendar-picker';

export class ArchiveListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            // drawerLabel: 'Pictures and',
            // drawerIcon: ({ tintColor }) => (
            //     <Icon name='calendar' style={{ color: tintColor, }} />
            // ),
            // headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={(typeof params.title == "undefined" ? '' : params.title)} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedStartDate: 'OK OK OK',
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        this.props.navigation.setParams({
            title: this.props.navigation.state.params.selectedStartDate,
        });
    };

    render() {
        const { selectedStartDate } = this.state;

        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <Container>
                <Content>
                    <H2>{startDate}</H2>
                </Content>
            </Container>
        );
    }
}