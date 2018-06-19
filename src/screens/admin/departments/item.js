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
import { List, ListItem, CheckBox, FooterTab, Footer, Container, Header, Content, Button, Text, Picker, H1, H2, H3, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addDepartment, editDepartment, Equipments, addEquipment, Fourniseurs, addFourniseur } from '../../../database/realm';

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
            equipments_selected: [],

            fourniseur_select: [],
            fourniseur_selected: [],

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            equipments: this.props.navigation.state.params.equipments,
            fourniseurs: this.props.navigation.state.params.fourniseurs,

            dimesions: { width, height } = Dimensions.get('window'),

            equipment_name: '',
            equipment_image: '',

            fourniseur_name: '',

            show_add_equipment: false,
            show_add_fourniseur: false,
            active: 0,
        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        this._loadEquipments();
        this._loadFourniseurs();
    };

    _loadEquipments = async () => {

        let equipments = await Equipments();

        this.setState({
            loading: 0,
            equipments_select: equipments,
        });

        if (this.state.equipments.length > 0) {
            this.setState({ equipments_selected: this.state.equipments.map(r => r.id) });
        }
    };

    _loadFourniseurs = async () => {

        let fourniseurs = await Fourniseurs();


        this.setState({
            loading: 0,
            fourniseur_select: fourniseurs,
        });

        if (this.state.fourniseurs.length > 0) {
            this.setState({ fourniseur_selected: this.state.fourniseurs.map(r => r.id) });
        }

    };


    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _toggleCheckboxEquipments(data) {

        let equipments_selected = this.state.equipments_selected;

        let index = equipments_selected.indexOf(data.id);

        if (index < 0) {
            equipments_selected.push(data.id)
        } else {
            equipments_selected.splice(index, 1);
        }

        this.setState({ equipments_selected: equipments_selected });
    }

    _toggleCheckboxFourniseur(data) {

        let fourniseur_selected = this.state.fourniseur_selected;

        let index = fourniseur_selected.indexOf(data.id);

        if (index < 0) {
            fourniseur_selected.push(data.id)
        } else {
            fourniseur_selected.splice(index, 1);
        }

        this.setState({ fourniseur_selected: fourniseur_selected });
    }

    _pickImage = () => {

        var options = {
            quality: 0.5,
            storageOptions: {
                cameraRoll: false,
            }
        };

        ImagePicker.launchCamera(options, (response) => {
            if (response.data) {
                writePicture(response.data).then(filename => {
                    this.setState({ equipment_image: filename });
                });
            }
        });
    };

    _saveEquipment() {

        this._showLoader();

        setTimeout(() => {
            addEquipment({
                name: this.state.equipment_name,
                source: this.state.equipment_image,
            }).then(res => {

                this._loadEquipments();

                this.setState({
                    equipment_name: '',
                    equipment_image: '',
                    show_add_equipment: false,
                });

                Keyboard.dismiss();
                this._hideLoader();
            }).catch(error => {
                alert(error);
            });
        }, 500);
    }

    _saveFourniseur() {
        this._showLoader();

        setTimeout(() => {
            addFourniseur({
                name: this.state.fourniseur_name,
            }).then(res => {
                this._loadFourniseurs();

                this.setState({
                    fourniseur_name: '',
                });

                Keyboard.dismiss();
                this._hideLoader();
            }).catch(error => {
                alert(error);
            });
        }, 500);
    }

    _saveItem() {

        this._showLoader();
        let equipments = this.state.equipments_select.filter(row => this.state.equipments_selected.includes(row.id));
        let fourniseurs = this.state.fourniseur_select.filter(row => this.state.fourniseur_selected.includes(row.id));

        setTimeout(() => {
            if (!this.state.id) {
                addDepartment({
                    name: this.state.name,
                    equipments: equipments,
                    fourniseurs: fourniseurs,
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
                    equipments: equipments,
                    fourniseurs: fourniseurs,
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

                        <Text style={styles.label}>{Strings.EQUIPMENTS}:</Text>

                        <View style={{ borderWidth: 1, borderColor: 'lightgray', borderStyle: 'dashed' }}>
                            {this.state.equipments_select.length > 0 && <View style={{ borderLeftWidth: 5, borderLeftColor: 'lightgray' }}><List>
                                {this.state.equipments_select.map((data) => {
                                    return <ListItem style={{ height: 70, }} onPress={() => { this._toggleCheckboxEquipments(data) }}>
                                        <Left>
                                            <Text>{data.name}</Text>
                                        </Left>
                                        <Right>
                                            <CheckBox style={{ marginRight: 15, }} checked={this.state.equipments_selected.includes(data.id)} onPress={() => { this._toggleCheckboxEquipments(data) }} />
                                        </Right>
                                    </ListItem>;
                                })}
                            </List></View>}

                            {this.state.equipments_select.length == 0 && <View style={{ margin: 20, height: 70, alignItems: 'center', justifyContent: 'center' }}>
                                <H2 style={{ color: 'lightgray' }}>{Strings.THERE_IS_NO_EQUIPMENTS_YET}</H2>
                            </View>}
                        </View>

                        {this.state.active != 1 && <Button transparent full style={{ borderWidth: 1, height: 70, marginTop: 20, }}
                            onPress={() => this.setState({ active: 1 })}>
                            <Text> + {Strings.ADD_MORE_EQUIPMENTS}</Text>
                        </Button>}

                        {this.state.active == 1 && <View style={[{ marginTop: 20, }, styles.inputNoPadding]}>
                            {!this.state.equipment_image && <Button transparent style={{ height: 70, width: 70, marginRight: 15, }} full onPress={this._pickImage} >
                                <Icon style={{ color: 'gray' }} name='camera' />
                            </Button>}
                            {this.state.equipment_image.length > 0 && <Image
                                resizeMode={'contain'}
                                style={{ borderWidth: 2, width: 70, height: 70, marginRight: 15, }}
                                source={{ uri: FilePicturePath() + this.state.equipment_image }}
                            />}
                            <TextInput
                                autoFocus={true}
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.EQUIPMENT_NAME}
                                value={this.state.equipment_name} onChangeText={(value) => { this.setState({ equipment_name: value }) }} />
                            {this.state.equipment_name.length > 0 && <Button transparent style={{ height: 70, width: 70, marginLeft: 15, }} full onPress={() => this._saveEquipment()} >
                                <Icon name='add' />
                            </Button>}
                            {this.state.equipment_name.length == 0 && <Button transparent style={{ height: 70, width: 70, marginLeft: 15, }} full onPress={() => this.setState({ active: 0, equipment_image: '' })} >
                                <Icon name='close' />
                            </Button>}
                        </View>}



                        <Text style={[styles.label, { marginTop: 20 }]}>{Strings.SELECT_FOURNISSEUR}:</Text>

                        <View style={{ borderWidth: 1, borderColor: 'lightgray', borderStyle: 'dashed' }}>
                            {this.state.fourniseur_select.length > 0 && <View style={{ borderLeftWidth: 5, borderLeftColor: 'lightgray', }}><List>
                                {this.state.fourniseur_select.map((data) => {
                                    return <ListItem style={{ height: 70, }} onPress={() => { this._toggleCheckboxFourniseur(data) }}>
                                        <Left>
                                            <Text>{data.name}</Text>
                                        </Left>
                                        <Right >
                                            <CheckBox style={{ marginRight: 15, }} checked={this.state.fourniseur_selected.includes(data.id)} onPress={() => { this._toggleCheckboxFourniseur(data) }} />
                                        </Right>
                                    </ListItem>;
                                })}
                            </List></View>}

                            {this.state.fourniseur_select.length == 0 && <View style={{ margin: 20, height: 70, alignItems: 'center', justifyContent: 'center' }}>
                                <H2 style={{ color: 'gray' }}>{Strings.THERE_IS_NO_FOURNISSEUR_YET}</H2>
                            </View>}

                        </View>

                        <View style={{ marginBottom: 30, }}>
                            {this.state.active != 2 && <Button transparent full style={{ borderWidth: 1, height: 70, marginTop: 20, }}
                                onPress={() => this.setState({ active: 2 })}>
                                <Text> + {Strings.ADD_MORE_FOURNISSEUR}</Text>
                            </Button>}

                            {this.state.active == 2 && <View style={[{ marginTop: 20, }, styles.input]}>
                                <TextInput
                                    autoFocus={true}
                                    style={styles.inputInline}
                                    underlineColorAndroid="transparent"
                                    placeholder={Strings.FOURNISSEUR_NAME}
                                    value={this.state.fourniseur_name} onChangeText={(value) => { this.setState({ fourniseur_name: value }) }} />
                                {this.state.fourniseur_name.length > 0 && <Button transparent style={{ height: 70, width: 70, marginLeft: 15, }} full onPress={() => this._saveFourniseur()} >
                                    <Icon name='add' />
                                </Button>}
                                {!this.state.fourniseur_name.length && <Button transparent style={{ height: 70, width: 70, marginLeft: 15, }} full onPress={() => this.setState({ active: 0 })} >
                                    <Icon name='close' />
                                </Button>}
                            </View>}

                        </View>
                    </View>
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>

                        {(this.state.active == 1 && this.state.equipment_name.length > 0) && <Button full success onPress={_ => this._saveEquipment()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_EQUIPMENT}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}

                        {(this.state.active == 1 && this.state.equipment_name.length == 0) && <Button full disabled>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_EQUIPMENT}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}




                        {(this.state.active == 2 && this.state.fourniseur_name.length > 0) && <Button full success onPress={_ => this._saveFourniseur()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_FOURNISSEUR}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}

                        {(this.state.active == 2 && this.state.fourniseur_name.length == 0) && <Button full disabled>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_FOURNISSEUR}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}




                        {(this.state.active == 0 && this.state.name.length > 0) && <Button full success onPress={_ => this._saveItem()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_DEPARTMENT}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}

                        {(this.state.active == 0 && this.state.name.length == 0) && <Button full disabled>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE_DEPARTMENT}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>}


                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}


