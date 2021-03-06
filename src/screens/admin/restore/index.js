import React from 'react';
import {
    AsyncStorage,
    View,
    ToastAndroid,
    TextInput,
    Dimensions,

} from 'react-native';
import { Container, Content, Button, Text, H1, Icon, Left, Right } from 'native-base';
import { LogoTitle, Menu, UploadIcon } from '../../../components/header';
import Strings from '../../../language/fr'
import { styles } from '../../../utilities/styles';

export class AdminRestoreIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: 'RESTORE',
            drawerIcon: ({ tintColor }) => (
                <Icon name='lock' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText="RESTORE" />,
            headerRight: <UploadIcon navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);
        this._bootstrapAsync();

        this.state = {
            password: '',
            passwordConfirm: '',
            dimesions: { width, height } = Dimensions.get('window'),
        };
    }

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

            //Navigate to admin home page           
            this.props.navigation.navigate('AdminHome');
            ToastAndroid.show(Strings.PASSWORD_CHANGED, ToastAndroid.LONG);
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _onLayout() {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {


    };

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>{Strings.CHANGE_PASSWORD}</H1>
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
                                placeholder={Strings.CONFIRM_PASSWORD}
                                value={this.state.passwordConfirm} onChangeText={(value) => { this.setState({ passwordConfirm: value }) }} />
                            {this.state.passwordConfirm.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.passwordConfirm.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <Button danger style={styles.button}
                            onPress={() => { this._setupAdmin() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE}</Text>
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

