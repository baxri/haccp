import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Alert,
    ToastAndroid,
    Dimensions,
    TextInput,
} from 'react-native';

// import { Text } from 'react-native-elements';
import { Container, Header, Content, Button, Text, Picker, H1, Icon, Left, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../language/fr'
import { Departments } from '../../database/realm';

import { renderOption, renderField, renderFieldDanger } from '../../utilities/index'
import { CustomPicker } from 'react-native-custom-picker';
import { styles, inputAndButtonFontSize } from '../../utilities/styles';


export class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 0,
            department: '',
            user: null,

            departments: [],
            users: [],

            dimesions: { width, height } = Dimensions.get('window'),
        };
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    static navigationOptions = {
        title: 'SIGNIN',
    };

    componentDidMount() {
        this._loadItems();
    };

    _loadItems = async () => {
        let items = await Departments();
        this.setState({ departments: items });

        if (items.length > 0) {
            this.setState({ users: items[0].users });

            if (items[0].users.length > 0) {
                this.setState({ user: items[0].users[0] });
            }
        }
    }

    _changeDepartment = async (itemValue) => {
        this.setState({ department: itemValue, user: null });
        this.setState({ users: itemValue.users });

        if (itemValue.users.length > 0) {
            this.setState({ user: itemValue.users[0] });
        }
    }


    _login = async () => {

        try {

            let token = Math.floor(Date.now() / 1000);

            //Store token data
            await AsyncStorage.setItem('userSession', token + "");

            // Store user type
            // user - fron user
            // admin - admin user
            await AsyncStorage.setItem('userSessionType', 'user');
            await AsyncStorage.setItem('userSessionId', this.state.user.id);

            //Navigate to application home page       
            this.props.navigation.navigate('StackFront');
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    render() {

        return (
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>HACCP</H1>
                    </View>

                    {this.state.departments.length == 0 && <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: 'red' }}>{Strings.THERE_IS_NO_DEPARTMENTS}</Text>
                    </View>}

                    <View style={styles.container}>

                        {this.state.departments.length > 0 && <View>
                            <CustomPicker
                                optionTemplate={renderOption}
                                fieldTemplate={renderFieldDanger}
                                placeholder={Strings.SELECT_DEPARTMENT}
                                getLabel={item => item.name}

                                options={this.state.departments}
                                value={this.state.department}

                                onValueChange={(value) => this._changeDepartment(value)}
                            />

                            {this.state.users.length == 0 && <View style={{ margin: 15, }}>
                                <Text style={[styles.text, { color: 'red' }]}>{Strings.THERE_IS_NO_USERS}</Text>
                            </View>}

                            {this.state.users.length > 0 && <CustomPicker
                                optionTemplate={renderOption}
                                fieldTemplate={renderFieldDanger}
                                getLabel={item => item.name}
                                placeholder={Strings.SELECT_USER}
                                options={this.state.users}
                                value={this.state.user}

                                onValueChange={value => {
                                    this.setState({ user: value });
                                }}
                            />}

                            <View>

                                <View>
                                    {this.state.user && <Button danger style={styles.button} onPress={this._login}>
                                        <Left >
                                            <Text style={[styles.text, { color: 'white', }]}>{Strings.CONNECTION}</Text>
                                        </Left>
                                        <Right>
                                            <Icon name='log-in' style={{ color: 'white', }} />
                                        </Right>
                                    </Button>}

                                    {!this.state.user && <Button disabled style={styles.button}>
                                        <Left >
                                            <Text style={[styles.text, { color: 'white', }]}>{Strings.CONNECTION}</Text>
                                        </Left>
                                        <Right>
                                            <Icon name='log-in' style={{ color: 'white', }} />
                                        </Right>
                                    </Button>}
                                </View>
                            </View>
                        </View>}

                        <View>
                            <Button light style={styles.buttonOriginal} onPress={() => {
                                this.props.navigation.navigate('SignInAdmin', {
                                    func: () => { }
                                });
                            }}>
                                <Left >
                                    <Text style={[styles.text]}>{Strings.SIGN_IN_AS_ADMIN}</Text>
                                </Left>
                                <Right>
                                    <Icon name='settings' />
                                </Right>
                            </Button>
                        </View>

                    </View>
                </Content>
            </Container>
        );
    }
}