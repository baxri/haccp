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
import { addDepartment, editDepartment, Equipments } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles } from '../../../utilities/styles';

export class AdminDepartmentsItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.DEPARTMENT,
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.DEPARTMENT} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            equipments_select: [],

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            equipments: this.props.navigation.state.params.equipments,

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
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
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <PopupDialog ref={(popupDialog) => { this.popupDialog = popupDialog; }}>
                        <View>
                            <Text>Hello</Text>
                        </View>
                    </PopupDialog>

                    <View style={styles.container}>


                        {/* <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.DEPARTMENT_NAME}
                            value={this.state.name}
                            onChangeText={(value) => { this.setState({ name: value }) }} /> */}

                        <View style={this.state.name.length > 3 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.EQUIPMENT_NAME}
                                value={this.state.produit} onChangeText={(value) => { this.setState({ name: value }) }} />
                            {this.state.name.length > 3 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.name.length <= 3 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <Button danger style={styles.button} onPress={() => { this._saveItem() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_DEPARTMENT}</Text>
                            </Left>
                            <Right>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </Right>
                        </Button>

                        <Button transparent
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
                            <Text style={[{}, styles.text]}>{Strings.EQUIPMENTS} ({this.state.equipments.length})</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}


