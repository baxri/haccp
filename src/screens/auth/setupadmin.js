import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View
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

        let toastDuration = 2000;
        let toastButton = "Okey";
        const password = this.state.password;
        const passwordConfirm = this.state.passwordConfirm;

        if (password.length < 2) {
            Toast.show({ text: "Password must be more than 2 symbols", buttonText: toastButton, duration: toastDuration })
        }

        if (password != passwordConfirm) {
            Toast.show({ text: "Password dont mutches", buttonText: toastButton, duration: toastDuration })
        }

        try {

            //Save admin password
            await AsyncStorage.setItem('adminPasswordV1', password);

            //Navigate to admin login page
            this.props.navigation.navigate('SignInAdmin');
        } catch (error) {
            Toast.show({ text: error, buttonText: toastButton, duration: toastDuration })
        }
    }

    render() {
        return (
            <Root>
                <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                    <Content style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
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
            </Root>
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