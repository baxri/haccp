import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Alert,
    ToastAndroid,
} from 'react-native';

// import { Text } from 'react-native-elements';
import { Container, Header, Content, Button, Text, Picker, H1, Icon, Left, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../language/fr'
import { Departments } from '../../database/realm';

export class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 0,
            department: '',
            user: '',

            departments: [],
            users: [],
        };
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
                this.setState({ user: items[0].users[0].id });
            }
        }
    }

    _changeDepartment = async (itemIndex, itemValue) => {
        this.setState({ department: itemValue, user: '' });
        this.setState({ users: this.state.departments[itemIndex].users });

        if (this.state.departments[itemIndex].users.length > 0) {
            this.setState({ user: this.state.departments[itemIndex].users[0].id });
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
            await AsyncStorage.setItem('userSessionId', this.state.user);

            //Navigate to application home page       
            this.props.navigation.navigate('StackFront');
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }

    render() {

        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                <Content >
                    <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <H1>HACCP</H1>
                    </View>

                    {this.state.departments.length == 0 && <View style={{ padding: 30, alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ color: 'red' }}>{Strings.THERE_IS_NO_DEPARTMENTS}</Text>
                    </View>}

                    <View style={{ alignItems: 'center', }}>

                        {this.state.departments.length > 0 && <View>
                            <View style={styles.dropdownView}>
                                <Picker
                                    mode="dropdown"
                                    style={styles.dropdown}
                                    selectedValue={this.state.department}
                                    onValueChange={(itemValue, itemIndex) => this._changeDepartment(itemIndex, itemValue)} >
                                    {this.state.departments.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />)
                                    )}
                                </Picker>
                            </View>

                            {this.state.users.length == 0 && <View style={styles.dropdownView}>
                                <Text style={{ color: 'red' }}>{Strings.THERE_IS_NO_USERS}</Text>
                            </View>}

                            {this.state.users.length > 0 && <View style={styles.dropdownView}>
                                <Picker
                                    mode="dropdown"
                                    style={styles.dropdown}
                                    selectedValue={this.state.user}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ user: itemValue })} >
                                    {this.state.users.map((item, key) => (
                                        <Picker.Item label={item.name + " " + item.lastname} value={item.id} key={key} />)
                                    )}
                                </Picker>
                            </View>}

                            <View>
                                {this.state.user.length > 0 && <Button primary style={styles.button} onPress={this._login}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.CONNECTION}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='log-in' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}

                                {!this.state.user.length && <Button disabled style={styles.button}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>{Strings.CONNECTION}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='log-in' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}
                            </View>
                        </View>}


                        <View>
                            <Button light style={styles.button} onPress={() => {
                                this.props.navigation.navigate('SignInAdmin', {
                                    func: () => { }
                                });
                            }}>
                                <Left >
                                    <Text>{Strings.SIGN_IN_AS_ADMIN}</Text>
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

const styles = StyleSheet.create({
    dropdown: {
        flex: 1,
    },
    dropdownView: {
        width: 400,
        height: 50,
        padding: 5,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        marginBottom: 20,
        borderBottomColor: 'lightgray',
    },

    button: {
        width: 400,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginBottom: 40,
    },
});