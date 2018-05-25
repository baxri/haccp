import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    View,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import Strings from '../../language/fr';

export class SetupAdminScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();

        this.state = {
            password: '',
            passwordConfirm: '',
        };
    }

    static navigationOptions = {
        title: Strings.SETUP_ADMINISTRATOR,
    };

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
            await AsyncStorage.setItem('adminPasswordV5', password);

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
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Content padder style={{ flex: 1 }}>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.SETUP_ADMINISTRATOR}</H1>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <Form>
                            <Item floatingLabel style={styles.input}>
                                <Label>{Strings.ENTER_PASSWORD}</Label>
                                <Input secureTextEntry={true} onChangeText={(value) => { this.setState({ password: value }) }} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>{Strings.CONFIRM_PASSWORD}</Label>
                                <Input secureTextEntry={true} onChangeText={(value) => { this.setState({ passwordConfirm: value }) }} />
                            </Item>
                            <View style={{ alignItems: 'center', marginBottom: 10 }}>

                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Button danger style={styles.button}
                                    onPress={() => { this._setupAdmin() }}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.SETUP}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='bookmark' style={{ color: 'white', }} />
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