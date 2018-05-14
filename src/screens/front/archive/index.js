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
import { addPicture, Pictures, Controles } from '../../../database/realm';
import CalendarPicker from 'react-native-calendar-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';

export class ArchiveIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.ARCHIVE,
            drawerIcon: ({ tintColor }) => (
                <Icon name='calendar' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.ARCHIVE} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            disabledDays: [],
            selectedStartDate: new Date().toISOString().substring(0, 10),
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        this._setDisabledDays((new Date()).getMonth() + 1, (new Date()).getFullYear());
    };

    onDateChange(date) {
        this.setState({
            selectedStartDate: date.format('YYYY-MM-DD'),
        });

        this.props.navigation.navigate('ArchiveList', {
            selectedStartDate: date.format('YYYY-MM-DD')
        });
    }

    onMonthChange(date) {
        this._setDisabledDays(date.format('M'), date.format('YYYY'));
    }

    componentDidMount() {

    };

    componentDidFocus() {
    };

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _setDisabledDays = async (month, year) => {

        this._showLoader();

        let userID = await AsyncStorage.getItem('userSessionId');
        let pictures = await Pictures(userID, null, month, year);
        let controles = await Controles(userID, null, month, year);

        setTimeout(() => {
            month = month * 1 - 1;
            var date = new Date(year, month, 1);
            var days = [];
            while (date.getMonth() === month) {
                date.setDate(date.getDate() + 1);

                let str = new Date(date).toISOString().substring(0, 10);
                let add = 1;

                pictures.map(row => {
                    if (row.date == str) {
                        add = 0;
                    }
                });

                if (add == 1) {
                    controles.map(row => {
                        if (row.date == str) {
                            add = 0;
                        }
                    });
                }

                if (add) {
                    days.push(str);
                }
            }

            this.setState({ disabledDays: days });
            this._hideLoader();
        }, 500)
    }

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <Container style={{ paddingTop: 20, }}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content>
                    <CalendarPicker onDateChange={this.onDateChange} onMonthChange={this.onMonthChange} disabledDates={this.state.disabledDays} />
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