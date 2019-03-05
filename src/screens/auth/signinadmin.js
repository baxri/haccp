import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    ToastAndroid,
    Alert,
    NetInfo,
} from 'react-native';

import { Container, Header, Content, Button, Text, Picker, H1, H3, Form, Item, Label, Input, Toast, Root, Icon, Left, Right } from 'native-base';
import Strings from '../../language/fr'
import { styles } from '../../utilities/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';

export class SignInAdminScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            password: '',
            device_id: DeviceInfo.getUniqueID(),

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this.props.navigation.state.params.func();
        this._bootstrapAsync();
    }

    static navigationOptions = {
        title: 'ADMINISTRATOR_LOGIN',
    };

    _bootstrapAsync = async () => {
        // this.setState({ connected: connected ? 1 : 0 });
    };

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _loginAdmin = async () => {
        const adminPassword = await AsyncStorage.getItem('adminPasswordV8');

        try {

            if (adminPassword !== this.state.password) {
                throw Error(Strings.INVALID_PASSWORD);
            }

            let token = Math.floor(Date.now() / 1000);

            //Store token data
            await AsyncStorage.setItem('userSession', token + "");

            // Store user type
            // user - fron user
            // admin - admin user
            await AsyncStorage.setItem('userSessionType', 'admin');

            this.props.navigation.navigate('StackAdmin');
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    async _resetPassword() {
        try {
           

            Alert.alert(
                Strings.RESET_PASSWORD,
                Strings.ARE_YOU_SURE_YOU_WANT_RESET_PASSWORD,
                [
                    { text: Strings.CANCEL, style: 'cancel' },
                    { text: Strings.OK, onPress: () => this._reset() },
                ],
                { cancelable: false }
            )

        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    _showLoader() {
        this.setState({ loader: 1 });
    }

    _hideLoader() {
        this.setState({ loader: 0 });
    }

    async _reset() {
        try {

            let connected = await NetInfo.isConnected.fetch();

            if(!connected){
                throw new Error(Strings.NO_CONNECTION);
            }

            this._showLoader();

            let password = Math.floor(1000 + Math.random() * 9000);
            await AsyncStorage.setItem('adminPasswordV8', password + "");

            fetch('http://haccp.milady.io/api/password/send?password=' + password + "&device=" + this.state.device_id)
                .then((response) => {

                })
                .then((responseJson) => {
                    this._hideLoader();
                    ToastAndroid.show(Strings.PASSWORD_RESETED_CONTACT_TO_ADMINISTRATOR, ToastAndroid.LONG);
                }).catch(error => { this._hideLoader(); throw Exception(error) });

        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loader} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.ADMINISTRATOR_LOGIN}</H1>
                        <H3 style={{ marginTop: 20, }}>{Strings.DEVICE_ID}: {this.state.device_id}</H3>
                    </View>

                    <View style={styles.container}>

                        <View style={this.state.password.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                autoFocus={true}
                                secureTextEntry={true}
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.ENTER_PASSWORD}
                                value={this.state.password} onChangeText={(value) => { this.setState({ password: value }) }} />
                            {this.state.password.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.password.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <Button danger style={styles.button} onPress={() => { this._loginAdmin() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.CONNECTION}</Text>
                            </Left>
                            <Right>
                                <Icon name='log-in' style={{ color: 'white', }} />
                            </Right>
                        </Button>
                        
                        <Button light style={styles.buttonOriginal}
                            onPress={() => { this.props.navigation.navigate('SignIn'); }}>
                            <Left >
                                <Text style={[styles.text]}>{Strings.BACK_TO_SIGNIN}</Text>
                            </Left>
                            <Right>
                                <Icon name='arrow-back' />
                            </Right>
                        </Button>

                        <Button light style={[styles.buttonOriginal]}
                            onPress={() => { this._resetPassword() }}>
                            <Left >
                                <Text style={[styles.text]}>{Strings.RESET_PASSWORD}</Text>
                            </Left>
                            <Right>
                                <Icon name='lock' />
                            </Right>
                        </Button>
                    </View>
                </Content >
            </Container>
        );
    }
}
