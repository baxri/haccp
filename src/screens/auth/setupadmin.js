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
import { styles } from '../../utilities/styles';

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
            await AsyncStorage.setItem('adminPasswordV8', password);

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

                        <View style={this.state.passwordConfirm.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                secureTextEntry={true}
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.ENTER_PASSWORD}
                                value={this.state.passwordConfirm} onChangeText={(value) => { this.setState({ passwordConfirm: value }) }} />
                            {this.state.passwordConfirm.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.passwordConfirm.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

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