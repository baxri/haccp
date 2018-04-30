import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addUser, editUser, Departments } from '../../../database/realm';


export class AdminUsersItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'User Item',
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText="User Item" />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        // Need id and name parameters (this is a requred parameter for this screen)
        this.state = {
            loading: 1,
            departments: [],

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            department: null,
        };

        this._bootstrapAsync();
        this._loadDepartments();
    }


    _bootstrapAsync = async () => {

    };

    _loadDepartments() {
        Departments().then(items => {
            this.setState({ departments: items, loading: 0 });
        }).catch(error => {
            alert(error);
        });;
    }

    _saveItem() {

        if (this.state.department) {
            if (!this.state.id) {
                addUser(this.state.department, { name: this.state.name }).then(res => {
                    this.props.navigation.navigate('AdminUsersIndex');
                }).catch(error => {
                    alert(error);
                });
            } else {
                editUser(this.state.department, { id: this.state.id, name: this.state.name }).then(res => {
                    this.props.navigation.navigate('AdminUsersIndex');
                }).catch(error => {
                    alert(error);
                });
            }
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
                <Content padder style={{ flex: 1 }}>
                    <Form>
                        <Item floatingLabel style={styles.input}>
                            <Label>User Name </Label>
                            <Input value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                        </Item>

                        <Picker
                            mode="dropdown"
                            style={styles.dropdown}
                            selectedValue={this.state.department}
                            onValueChange={(itemValue, itemIndex) => this.setState({ department: itemValue })}
                        >
                            <Picker.Item label="Select Department" value="" />

                            {this.state.departments.map((i, index) => (
                                <Picker.Item key={index} label={i.name} value={i.id} />
                            ))}


                        </Picker>
                        <View style={{ alignItems: 'center' }}>
                            <Button primary style={styles.button} onPress={() => { this._saveItem() }}>
                                <Left >
                                    <Text style={{ color: 'white', }}>SAVE DEPARTMENT</Text>
                                </Left>
                                <Right>
                                    <Icon name='checkmark' style={{ color: 'white', }} />
                                </Right>
                            </Button>
                        </View>
                    </Form>


                </Content>
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

    dropdown: {
        flex: 1,
    },
    dropdownView: {
        width: 400,
        height: 60,
        padding: 5,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        marginBottom: 20,
        borderBottomColor: 'lightgray',
    },
});