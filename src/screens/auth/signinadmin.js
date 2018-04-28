import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ToastAndroid

} from 'react-native';

import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Icon, Left, Right } from 'native-base';


export class SignInAdminScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            password: '',
        };

        this._bootstrapAsync();

        // Need func parameter (this is a requred parameter for this screen)
        this.props.navigation.state.params.func();
    }

    static navigationOptions = {
        title: 'SignIn Administrator',
    };

    _bootstrapAsync = async () => {
        const adminPassword = await AsyncStorage.getItem('adminPasswordV2');

        this.setState({
            loading: 0,
        });

        // If admin not exists yet lets create/setup it
        if (!adminPassword) {
            this.props.navigation.navigate('SetupAdmin');
        }
    };

    _loginAdmin = async () => {
        const adminPassword = await AsyncStorage.getItem('adminPasswordV2');

        try {

            if (adminPassword !== this.state.password) {
                throw Error('Password is incorrect');
            }

            let token = Math.floor(Date.now() / 1000);

            //Store token data
            await AsyncStorage.setItem('userSession', token + "");

            // Store user type
            // user - fron user
            // admin - admin user
            await AsyncStorage.setItem('userSessionType', 'admin');

            //Navigate to application home page       
            this.props.navigation.navigate('StackAdmin');
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }

    }

    render() {
        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Content>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>Administrator Login</H1>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <Form>
                            <Item floatingLabel style={styles.input}>
                                <Label>Enter password </Label>
                                <Input onChangeText={(value) => { this.setState({ password: value }) }} />
                            </Item>
                            <View style={{ alignItems: 'center', marginBottom: 10 }}>

                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Button primary style={styles.button} onPress={() => { this._loginAdmin() }}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>CONNECTION</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='log-in' style={{ color: 'white', }} />
                                    </Right>
                                </Button>
                                <Button light style={styles.button} onPress={() => { this.props.navigation.navigate('EntryPoint'); }}>
                                    <Left >
                                        <Text>BACK (SIGN IN)</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='arrow-back' />
                                    </Right>
                                </Button>
                            </View>
                        </Form>
                    </View>
                </Content >
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: 400,
        paddingBottom: 10,
    },
    button: {
        width: 400,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 40,
        marginLeft: 15,
        padding: 20,
    },
});