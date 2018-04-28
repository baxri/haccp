import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    View,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root } from 'native-base';

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
        title: 'Setup Administrator',
    };

    _bootstrapAsync = async () => {

    };

    _setupAdmin = async () => {

        const password = this.state.password;
        const passwordConfirm = this.state.passwordConfirm;

        try {

            if (password.length == 0) {
                throw Error('Please enter password');
            }

            if (password != passwordConfirm) {
                throw Error("Password dont mutches");
            }

            //Save admin password
            await AsyncStorage.setItem('adminPasswordV1', password);

            //Navigate to admin login page           
            this.props.navigation.navigate('SignInAdmin', {
                func: () => {
                    ToastAndroid.show('Administrator Succssfully created', ToastAndroid.LONG);
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
                        <View style={{ padding: 30 }}>
                            <H1>Setup administrator password for login</H1>
                        </View>
                        <View style={{ alignItems: 'center', }}>
                            <Form>
                                <Item floatingLabel style={styles.input}>
                                    <Label>Enter new password </Label>
                                    <Input onChangeText={(value) => { this.setState({ password: value }) }} />
                                </Item>
                                <Item floatingLabel style={styles.input}>
                                    <Label>Confirm password</Label>
                                    <Input onChangeText={(value) => { this.setState({ passwordConfirm: value }) }} />
                                </Item>
                                <View style={{ alignItems: 'center', marginBottom: 10 }}>

                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Button primary style={styles.button} onPress={() => { this._setupAdmin() }}>
                                        <Text>SETUP</Text>
                                    </Button>
                                    <Button light style={styles.button} onPress={() => { this.props.navigation.navigate('EntryPoint'); }}>
                                        <Text>I will setup later</Text>
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
        width: 300,
    },
    button: {
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 40,
        marginLeft: 15,
    },
});