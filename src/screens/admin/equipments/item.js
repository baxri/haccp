import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Keyboard,
    Dimensions,
    TextInput,
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addEquipment, editEquipment } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles } from '../../../utilities/styles';

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

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
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
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={styles.container}>
                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.EQUIPMENT_NAME}
                            value={this.state.name}
                            onChangeText={(value) => { this.setState({ name: value }) }} />

                        <Button danger onPress={() => { this._saveItem() }} style={styles.button}>
                            <Left>
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_EQUIPMENT}</Text>
                            </Left>
                            <Right>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </Right>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}