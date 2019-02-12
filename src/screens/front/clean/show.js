import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,
    Alert,
    Dimensions,
    TextInput,
    Keyboard,

} from 'react-native';
import { Fab, Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { LogoTitle, Menu } from '../../../components/header';
import { addControle, User, addArchive, cleanDone } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import Strings from '../../../language/fr';
import { FilePicturePath, writePicture, toDate, toYM, renderRadios, renderFieldDanger, renderOption, renderFieldSuccess, } from '../../../utilities/index';
import { styles } from '../../../utilities/styles';
import { imagePickerOptions } from '../../../utilities/image-picker';

// WE ARE NOT USING THIS PAGE

export class FrontCleanShowScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.RECEPTION_CHECK,
            drawerIcon: ({ tintColor }) => (
                <Icon name='eye' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.RECEPTION_CHECK} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            schedule: props.navigation.state.params,
            controle: {},
            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const user = await User(userID);

        this.setState({
            userId: userID,
            userObj: user,
        });

        this._hideLoader();
    };

    _showLoader() {
        this.setState({ loader: 1 });
    }

    _hideLoader() {
        this.setState({ loader: 0 });
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    render() {

        return (
            <Container style={{ flex: 1 }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loader} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, paddingTop: 35, }}>

                    <Text style={[styles.text]}>{Strings.DEPARTMENT}: {this.state.schedule.department.name}</Text>
                    <Text style={[styles.text, { marginBottom: 30, }]}>{Strings.EQUIPMENTS}: {this.state.schedule.equipment.name}</Text>
                </Content>


            </Container >
        );
    }
}


// const styles = StyleSheet.create({
//     input: {
//         paddingBottom: 10,
//         marginBottom: 25,
//     },
// });