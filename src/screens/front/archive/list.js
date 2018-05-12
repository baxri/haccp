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
            headerTitle: <LogoTitle HeaderText={(typeof params.title == "undefined" ? '' : params.title)} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedStartDate: this.props.navigation.state.params.selectedStartDate,
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
                <Grid>
                    <Row >
                        <Col style={{ borderBottomWidth: 1, borderColor: 'lightgray' }}>

                        </Col>
                    </Row>
                    <Row>
                        <Col>

                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
}