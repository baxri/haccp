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
    Image,

} from 'react-native';
import { List, ListItem, CheckBox, FooterTab, Footer, Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addDepartment, editDepartment, Equipments } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles } from '../../../utilities/styles';
import { FilePicturePath, writePicture, toDate } from '../../../utilities/index';

var ImagePicker = require('react-native-image-picker');

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

            equipment_name: '',
            equipment_image: '',
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

    _pickImage = () => {

        var options = {
            quality: 0.5,
            storageOptions: {
                cameraRoll: false,
            }
        };

        ImagePicker.launchCamera(options, (response) => {
            writePicture(response.data).then(filename => {
                this.setState({ equipment_image: filename });
            });
        });
    };


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

                        <View style={this.state.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.EQUIPMENT_NAME}
                                value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                            {this.state.name.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.name.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <View style={{ borderLeftWidth: 5, borderLeftColor: 'lightgray' }}>
                            <List>
                                {this.state.equipments_select.map(data => {
                                    return <ListItem style={{ height: 70, }} onPress={() => { this._toggleCheckbox(rowId) }}>
                                        <Left>
                                            <Text>{data.name}</Text>
                                        </Left>
                                        <Right>
                                            <CheckBox checked={data.checked} onPress={() => { this._toggleCheckbox(rowId) }} />
                                        </Right>
                                    </ListItem>;
                                })}
                            </List>
                        </View>

                        <View style={[{ marginTop: 20, }, styles.inputSuccessNoPadding]}>
                            {!this.state.equipment_image && <Button transparent style={{ height: 70, width: 70, marginRight: 15, }} full onPress={this._pickImage} >
                                <Icon name='checkmark' />
                            </Button>}
                            {this.state.equipment_image.length > 0 && <Image
                                resizeMode={'contain'}
                                style={{ borderWidth: 2,  width: 70, height: 70,  }}
                                source={{ uri: FilePicturePath() + this.state.equipment_image }}
                            />}
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.EQUIPMENT_NAME}
                                value={this.state.equipment_name} onChangeText={(value) => { this.setState({ equipment_name: value }) }} />
                            <Button transparent style={{ height: 70, width: 70, marginLeft: 15, }} full onPress={() => alert('etert')} >
                                <Icon name='add' />
                            </Button>
                        </View>


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

                            }}>
                            <Text style={[{}, styles.text]}>{Strings.EQUIPMENTS} ({this.state.equipments.length})</Text>
                        </Button>
                    </View>
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button full success onPress={_ => this._saveItem()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_DEPARTMENT}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}


