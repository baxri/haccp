import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Keyboard,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addDepartment, editDepartment, Equipments } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'

export class AdminDepartmentsItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.DEPARTMENT,
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.DEPARTMENT} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        // Need id and name parameters (this is a requred parameter for this screen)
        this.state = {
            loading: 0,
            equipments_select: [],

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            equipments: this.props.navigation.state.params.equipments,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        let equipments = await Equipments();

        this.setState({
            loading: 0,
            equipments_select: equipments,
        });
    };

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _saveItem() {

        this._showLoader();

        setTimeout(() => {
            if (!this.state.id) {
                addDepartment({
                    name: this.state.name,
                    equipments: this.state.equipments
                }).then(res => {
                    this.props.navigation.navigate('AdminDepartmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();

                }).catch(error => {
                    alert(error);
                });
            } else {
                editDepartment({
                    id: this.state.id,
                    name: this.state.name,
                    equipments: this.state.equipments
                }).then(res => {
                    this.props.navigation.navigate('AdminDepartmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();

                }).catch(error => {
                    alert(error);
                });
            }
        }, 500);
    }

    _equipmentsChoosed = (data) => {
        this.setState({
            equipments: data,
        });
    };

    render() {

        

        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <PopupDialog
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                >
                    <View>
                        <Text>Hello</Text>
                    </View>
                </PopupDialog>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content padder style={{ flex: 1 }}>
                    <Form>
                        <Item floatingLabel style={styles.input}>
                            <Label>{Strings.DEPARTMENT_NAME}</Label>
                            <Input value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                        </Item>
                        <View style={{ alignItems: 'center' }}>
                            <Button danger style={styles.button} onPress={() => { this._saveItem() }}>
                                <Left >
                                    <Text style={{ color: 'white', }}>{Strings.SAVE_DEPARTMENT}</Text>
                                </Left>
                                <Right>
                                    <Icon name='checkmark' style={{ color: 'white', }} />
                                </Right>
                            </Button>

                            <Button transparent style={styles.button}

                                onPress={() => {

                                    this._showLoader();

                                    setTimeout(() => {
                                        this.props.navigation.navigate('AdminDepartmentsEquipmentsModal', {
                                            equipments_select: this.state.equipments_select,
                                            value: this.state.equipments,
                                            equipmentsChoosed: this._equipmentsChoosed
                                        })

                                        this._hideLoader();
                                    }, 100);

                                }}
                            >
                                <Text>{Strings.EQUIPMENTS} ({this.state.equipments.length})</Text>

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
});