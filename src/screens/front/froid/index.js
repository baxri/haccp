import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,
    Alert,
    Dimensions,
    TextInput,
    Keyboard,


} from 'react-native';
import { Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addControle, Controles, Pictures, User, Fourniseurs } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';
import Modal from "react-native-modal";
import Strings from '../../../language/fr';
import { FilePicturePath, writePicture, toDate, renderFieldDanger, renderOption, renderFieldSuccess } from '../../../utilities/index';
import { CustomPicker } from 'react-native-custom-picker';
import { styles } from '../../../utilities/styles';


export class FroidIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.CONTROLE_FROID,
            drawerIcon: ({ tintColor }) => (
                <Icon name='snow' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.CONTROLE_FROID + "(" + (typeof params.test == "undefined" ? 0 : params.test) + ")"} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            isModalVisible: false,
            dimesions: { width, height } = Dimensions.get('window'),

            userId: null,
            userObj: {
                name: '',
                lastname: '',
            },

            signature: '',
            equipments: [],

            autres: '',
            actions: '',

            confirmed: 0,
            fourniseur: null,
            date: toDate(new Date()),
            created_at: new Date(),

            dimesions: { width, height } = Dimensions.get('window'),
            fourniseurs: [],

        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const user = await User(userID);
        const controles = await Controles(userID);
        const fourniseurs = await Fourniseurs();

        this._parseEquipments(user.department.equipments);

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
            fourniseurs: fourniseurs,
        });

        this.props.navigation.setParams({
            test: controles.length
        });
    };

    _parseEquipments(equipments) {

        let ret = [];

        equipments.map(equipment => {

            let slice = equipment.split(":");

            let obj = {
                id: slice[0],
                name: slice[1],
                value: [0],
            };

            ret.push(obj);
        });



        this.setState({ equipments: ret });
    }

    _changeEquipment(row, index, value) {

        let ret = [];

        this.state.equipments.map(equipment => {

            if (equipment.id == row.id) {
                equipment.value[index] = value;
            }

            ret.push(equipment);
        });

        this.setState({ equipments: ret });
    }

    _addRow(row) {
        let ret = [];

        this.state.equipments.map(equipment => {

            if (equipment.id == row.id) {
                equipment.value.push(0);
            }

            ret.push(equipment);
        });

        this.setState({ equipments: ret });
    }

    _encodeEquipment() {

        let ret = [];

        this.state.equipments.map(equipment => {


            let str = equipment.id + ":" + equipment.name + ":" + equipment.value.join(",");

            console.log(str);

            ret.push(str);
        });

        return ret;
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    componentDidMount() {
        this._loadItems();
    };

    componentDidFocus() {
        this._loadItems();
    };

    _loadItems = async () => {

    }

    _showSignatureView() {
        this._signatureView.show(true);
    }

    _onSave = async (result) => {
        writePicture(result.encoded).then(filename => {
            this.setState({ signature: filename });
            this._signatureView.show(false);
        });
    }

    _checkAspect(value) {
        this.setState({
            aspect: value
        });
    }

    _checkIntact(value) {
        this.setState({
            intact: value
        });
    }

    _checkConforme(value) {
        this.setState({
            conforme: value
        });
    }

    _radioSelected(val1, val2) {
        return val1 == val2;
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    _save(confirmed = 0) {

        let equipments = this._encodeEquipment();

        this.setState({ confirmed: confirmed });

        if (confirmed == 0 && !this.state.signature) {
            ToastAndroid.show(Strings.PLEASE_ADD_A_SIGNATURE, ToastAndroid.LONG); return;
        }

        if (!this.state.fourniseur) {
            ToastAndroid.show(Strings.SELECT_FOURNISSEUR, ToastAndroid.LONG); return;
        }

        let equipmentError = false;

        this.state.equipments.map(equipment => {
            equipment.value.map(value => {
                if (!value) equipmentError = true;
            });
        });

        if (equipmentError) {
            ToastAndroid.show(Strings.EQUIPMENTS_REQUIRED, ToastAndroid.LONG); return;
        }

        Alert.alert(
            Strings.CONTROLE_FROID,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._store(confirmed) },
            ],
            { cancelable: false }
        )
    }

    _store(confirmed) {
        this._showLoader();

        setTimeout(() => {

            let equipments = this._encodeEquipment();




            addControle(this.state.userId, {
                source: '',
                signature: this.state.signature,

                produit: '',
                fourniser: '',
                dubl: '',

                aspect: 0,
                du_produit: '',

                intact: 0,
                conforme: 0,
                autres: this.state.autres,
                actions: this.state.actions,
                confirmed: this.state.confirmed,

                fourniseur: this.state.fourniseur,

                equipments: equipments,
                type: 1,

                quantity: 0,
                valorisation: '',
                causes: '',
                devenir: '',
                traitment: '',
                traitment_date: this.state.date,

                date: this.state.date,
                created_at: this.state.created_at,
            }).then(res => {
                this.props.navigation.navigate('Home');
                this._hideLoader();
                ToastAndroid.show(Strings.CONTROLE_FROID_SUCCESSFULL_SAVED, ToastAndroid.LONG);
            }).catch(error => {
                alert(error);
            });

        }, 2000);
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    render() {
        let { image } = this.state;

        return (
            <Container style={{ flex: 1 }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, paddingTop: 35, }}>
                    <View style={{ alignItems: 'center', width: 550, height: 220, marginBottom: 50, }}>
                        <Grid style={{ width: 550 }}>
                            <Row>
                                <Col style={{ padding: 5, borderColor: 'red', flex: 0.5, }}>
                                    {this.state.signature == '' && <Button style={{ flex: 1, }} full light onPress={this._showSignatureView.bind(this)} >
                                        <Icon name='create' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}

                                    {this.state.signature != '' && <View style={{ flex: 1, backgroundColor: 'white' }}><Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: FilePicturePath() + this.state.signature }}
                                    /></View>}
                                </Col>
                            </Row>
                        </Grid>
                    </View>

                    <Text style={[styles.text, { marginBottom: 30, }]}>{Strings.USER}: {this.state.userObj.name} {this.state.userObj.lastname}</Text>

                    <CustomPicker
                        optionTemplate={renderOption}
                        fieldTemplate={renderFieldSuccess}
                        placeholder={Strings.SELECT_FOURNISSEUR}
                        getLabel={item => item.name}

                        options={this.state.fourniseurs}
                        value={this.state.fourniseur}

                        onValueChange={value => {
                            this.setState({ fourniseur: value });
                        }}

                        onFocus={() => Keyboard.dismiss()}
                    />

                    {this.state.equipments.map((row) => {
                        return <View style={{ marginBottom: 20, }}>
                            <Text style={[{ marginBottom: 10, }, styles.text]}>{row.name}</Text>
                            {row.value.map((val, index) => {
                                return <View style={(val > 0 ? styles.inputSuccess : styles.inputDanger)}>
                                    <TextInput
                                        autoFocus={true}
                                        keyboardType="numeric"
                                        style={styles.inputInline}
                                        underlineColorAndroid="transparent"
                                        placeholder={Strings.TEMPERATURE}
                                        value={val} onChangeText={(value) => { this._changeEquipment(row, index, value) }} />
                                    <Icon name='thermometer' style={styles.inputInlineIconDisabled} />
                                </View>
                            })}
                            <View style={{ flex: 1 }}>
                                <Button danger onPress={() => this._addRow(row)} style={{ alignSelf: 'flex-end' }}>
                                    <Icon active name='add-circle' />
                                </Button>
                            </View>
                        </View>
                    })}

                    <View style={styles.input}>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.inputInline}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.AUTRES}
                            value={this.state.autres} onChangeText={(value) => { this.setState({ autres: value }) }} />
                        <Icon name='thermometer' style={styles.inputInlineIconDisabled} />
                    </View>

                    <Textarea style={[styles.textarea, { marginBottom: 85, }]} rowSpan={5} bordered placeholder={Strings.AUTRES_CORECTIVES} onChangeText={(value) => { this.setState({ actions: value }) }} />


                    <SignatureView
                        ref={r => this._signatureView = r}
                        rotateClockwise={!!false}
                        onSave={this._onSave.bind(this)}
                    />

                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={{ flex: 1, backgroundColor: 'white', padding: 20, }}>
                            <Text style={{ marginBottom: 20, }}>Action corectives</Text>
                            <Textarea style={{ marginBottom: 50, }} rowSpan={5} bordered placeholder={Strings.ACTION_CORECTIVES} onChangeText={(value) => { this.setState({ actions: value }) }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Button danger onPress={this._toggleModal} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.CANCEL}</Text>
                                        <Icon name='close' style={{ color: 'white', }} />
                                    </View>
                                </Button>
                                <Button full success onPress={_ => this._store(0)} style={{ marginLeft: 20, }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.CONFIRM}</Text>
                                        <Icon name='checkmark' style={{ color: 'white', }} />
                                    </View>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button danger onPress={_ => this._save(0)} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.NOT_CONFIRM}</Text>
                                <Icon name='close' style={{ color: 'white', }} />
                            </View>
                        </Button>
                        <Button full success onPress={_ => this._save(1)} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.CONFIRM}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

