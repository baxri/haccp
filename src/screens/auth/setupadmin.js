import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    View,
    Dimensions,
    TextInput,
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import Strings from '../../language/fr';
import {styles} from '../../utilities/styles';

export class SetupAdminScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();

        this.state = {
            password: '',
            passwordConfirm: '',
            dimesions: { width, height } = Dimensions.get('window'),
        };
    }

    static navigationOptions = {
        title: Strings.SETUP_ADMINISTRATOR,
    };

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {

    };

    _setupAdmin = async () => {

        const password = this.state.password;
        const passwordConfirm = this.state.passwordConfirm;

        try {

            if (password.length == 0) {
                throw Error(Strings.PASSWORD_REQUIRED);
            }

            if (password != passwordConfirm) {
                throw Error(Strings.PASSWORD_NOT_MUTCHED);
            }

            //Save admin password
            await AsyncStorage.setItem('adminPasswordV7', password);

            //Navigate to admin login page           
            this.props.navigation.navigate('SignInAdmin', {
                func: () => {
                    ToastAndroid.show(Strings.ADMINISTRATOR_SUCCESSFULLY_CREATED, ToastAndroid.LONG);
                }
            });
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.SETUP_ADMINISTRATOR}</H1>
                    </View>

                    <View style={styles.container}>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.ENTER_PASSWORD}
                            secureTextEntry={true}
                            onChangeText={(value) => { this.setState({ password: value }) }} />

                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.CONFIRM_PASSWORD}
                            secureTextEntry={true}
                            onChangeText={(value) => { this.setState({ passwordConfirm: value }) }} />

                        <Button danger style={styles.button}
                            onPress={() => { this._setupAdmin() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SETUP}</Text>
                            </Left>
                            <Right>
                                <Icon name='bookmark' style={{ color: 'white', }} />
                            </Right>
                        </Button>
                    </View>
                </Content >
            </Container>
        );
    }
}