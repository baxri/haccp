import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    ToastAndroid
} from 'react-native';

import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Icon, Left, Right } from 'native-base';
import Strings from '../../language/fr'
import { styles } from '../../utilities/styles';

export class SignInAdminScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            password: '',

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this.props.navigation.state.params.func();
    }

    static navigationOptions = {
        title: 'ADMINISTRATOR_LOGIN',
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

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.ADMINISTRATOR_LOGIN}</H1>
                    </View>

                    <View style={styles.container}>

                        <View style={this.state.password.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
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
                    </View>
                </Content >
            </Container>
        );
    }
}
