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
import { addEquipment, editEquipment } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'

export class AdminEquipmentsItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.EQUIPMENTS,
            drawerIcon: ({ tintColor }) => (
                <Icon name='analytics' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.EQUIPMENTS} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        this.setState({
            loading: 0,
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
                addEquipment({
                    name: this.state.name,
                }).then(res => {
                    this.props.navigation.navigate('AdminEquipmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();

                }).catch(error => {
                    alert(error);
                });
            } else {
                editEquipment({
                    id: this.state.id,
                    name: this.state.name,                   
                }).then(res => {
                    this.props.navigation.navigate('AdminEquipmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();
                }).catch(error => {
                    alert(error);
                });
            }
        }, 500);
    }

    render() {
        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content padder style={{ flex: 1 }}>
                    <Form>
                        <Item floatingLabel style={styles.input}>
                            <Label>{Strings.EQUIPMENT_NAME}</Label>
                            <Input value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                        </Item>
                        <View style={{ alignItems: 'center' }}>
                            <Button danger style={styles.button} onPress={() => { this._saveItem() }}>
                                <Left >
                                    <Text style={{ color: 'white', }}>{Strings.SAVE_EQUIPMENT}</Text>
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
});