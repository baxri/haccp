import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,

    Alert
} from 'react-native';

// import { Text } from 'react-native-elements';
import { Container, Header, Content, Button, Text, Picker, H1, Icon, Left, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

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
        title: 'EntryPoint',
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
    }


    GetSelectedPickerItem = () => {
        Alert.alert(this.state.user);
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
                        <Text style={{ color: 'red' }}>There is no departments yet</Text>
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
                                <Text style={{ color: 'red' }}>There is no users for this department</Text>
                            </View>}

                            {this.state.users.length > 0 && <View style={styles.dropdownView}>
                                <Picker
                                    mode="dropdown"
                                    style={styles.dropdown}
                                    selectedValue={this.state.user}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ user: itemValue })} >
                                    {this.state.users.map((item, key) => (
                                        <Picker.Item label={item.name} value={item.id} key={key} />)
                                    )}
                                </Picker>
                            </View>}

                            <View>
                                {this.state.user.length > 0 && <Button primary style={styles.button} onPress={this.GetSelectedPickerItem}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>CONNECTION</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='log-in' style={{ color: 'white', }} />
                                    </Right>
                                </Button>}

                                {!this.state.user.length && <Button disabled style={styles.button}>
                                    <Left >
                                        <Text style={{ color: 'white', }}>CONNECTION</Text>
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
                                    <Text>SIGN IN AS ADMIN</Text>
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