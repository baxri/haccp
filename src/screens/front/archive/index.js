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
            selectedStartDate: new Date().toISOString().substring(0, 10),
        };
        this.onDateChange = this.onDateChange.bind(this);

        this._bootstrapAsync();
    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date.format('YYYY-MM-DD'),
        });

        this.props.navigation.navigate('ArchiveList', {
            selectedStartDate: date.format('YYYY-MM-DD')
        });
    }

    _bootstrapAsync = async () => {

    };

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <Container style={{ paddingTop: 20, }}>
                <Content>
                    <CalendarPicker onDateChange={this.onDateChange} />
                </Content>
                <Footer styles={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <FooterTab styles={{ height: 100, }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <H2 style={{ color: 'white' }}>{startDate}</H2>
                        </View>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}