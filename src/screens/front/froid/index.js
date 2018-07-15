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
import { Fab, Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addControle, User, addArchive } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';
import Modal from "react-native-modal";
import Strings from '../../../language/fr';
import { FilePicturePath, writePicture, toDate, toYM, renderFieldDanger, renderOption, renderFieldSuccess, guid } from '../../../utilities/index';
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
            headerTitle: <LogoTitle HeaderText={Strings.CONTROLE_FROID} />,
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

            products: [
                // { name: 'Test Product', temperature: '0', }
            ],

            signature: '',
            equipments: [],

            autres: '',
            actions: '',

            confirmed: 0,
            fourniseur: null,
            date: toDate(new Date()),
            YM: toYM((new Date())),
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
        // const controles = await Controles(userID);
        const fourniseurs = user.department.fourniseurs;

        this._parseEquipments(user.department.equipments);

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
            fourniseurs: fourniseurs,
        });

        // this.props.navigation.setParams({
        //     test: controles.length
        // });
    };

    _parseEquipments(equipments) {

        let ret = [];

        equipments.map(equipment => {
            let obj = {
                id: guid(),
                equipment: equipment,
                values: [''],
            };

            ret.push(obj);
        });

        this.setState({ equipments: ret });
    }

    _addProduct() {

        let product = {
            id: guid(),
            name: '',
            temperature: '',
        }

        this.setState({ products: [...this.state.products, product] });
    }

    _changeProductName(index, value) {
        this.state.products[index].name = value;
        this.setState({ products: this.state.products });
    }

    _changeProductTemperature(index, value) {
        this.state.products[index].temperature = value;
        this.setState({ products: this.state.products });
    }

    _changeEquipment(row, index, value) {

        let ret = [];

        this.state.equipments.map(equipment => {

            if (equipment.equipment.id == row.equipment.id) {
                equipment.values[index] = value;
            }

            ret.push(equipment);
        });

        this.setState({ equipments: ret });
    }

    _addRow(row) {
        let ret = [];

        this.state.equipments.map(equipment => {

            if (equipment.equipment.id == row.equipment.id) {
                equipment.values.push('');
            }

            ret.push(equipment);
        });

        this.setState({ equipments: ret, clickedAdd: true });
    }

    _encodeEquipment() {

        let ret = [];

        this.state.equipments.map(equipment => {
            let str = equipment.equipment.id + ":" + equipment.equipment.name + ":" + equipment.equipment.values.join(",");
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

        this.setState({ confirmed: confirmed });

        if (confirmed == 0 && !this.state.signature) {
            ToastAndroid.show(Strings.PLEASE_ADD_A_SIGNATURE, ToastAndroid.LONG); return;
        }

        // if (!this.state.fourniseur) {
        //     ToastAndroid.show(Strings.SELECT_FOURNISSEUR, ToastAndroid.LONG); return;
        // }

        let equipmentError = false;
        let alertMessage = Strings.ARE_YOU_SURE;

        this.state.equipments.map(equipment => {
            equipment.values.map(value => {
                if (value == '') {
                    equipmentError = true;
                    alertMessage = Strings.EQUIPMENTS_REQUIRED;
                }
            });
        });

        // alert(equipmentError);
        // return;

        // if (equipmentError) {
        //     ToastAndroid.show(Strings.EQUIPMENTS_REQUIRED, ToastAndroid.LONG); return;
        // }

        Alert.alert(
            Strings.CONTROLE_FROID,
            alertMessage,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._store(confirmed) },
            ],
            { cancelable: false }
        )
    }

    _store(confirmed) {


        // console.log(this.state.products);
        // return;

        this._showLoader();

        setTimeout(() => {

            addControle(this.state.userId, {
                source: '',
                signature: this.state.signature,
                products: this.state.products,

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

                // fourniseur: this.state.fourniseur,
                temperatures: this.state.equipments,
                type: 1,

                quantity: 0,
                valorisation: '',
                causes: '',
                devenir: '',
                traitment: '',
                traitment_date: this.state.date,

                date: this.state.date,
                created_at: this.state.created_at,

                clickedAdd: false,
            }).then(res => {

                addArchive(this.state.date, this.state.YM, (this.state.confirmed ? true : false), this.state.userId);

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


                    {this.state.products.map((row, index) => {
                        return <View>
                            <View style={row.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                                <TextInput
                                    // autoFocus={true}
                                    // keyboardType="numeric"
                                    style={styles.inputInline}
                                    underlineColorAndroid="transparent"
                                    placeholder={Strings.PRODUCT}
                                    value={row.name} onChangeText={(value) => { this._changeProductName(index, value) }}
                                />
                                {/* <Icon name='thermometer' style={styles.inputInlineIconDisabled} /> */}
                            </View>
                            <View style={row.temperature != '' ? styles.inputSuccess : styles.inputDanger}>
                                <TextInput
                                    // autoFocus={true}
                                    keyboardType="numeric"
                                    style={styles.inputInline}
                                    underlineColorAndroid="transparent"
                                    placeholder={Strings.TEMPERATURE}
                                    value={row.temperature} onChangeText={(value) => { this._changeProductTemperature(index, value) }}
                                />
                                <Icon name='thermometer' style={styles.inputInlineIconDisabled} />
                            </View>
                        </View>
                    })}

                    <View style={{ flex: 1 }}>
                        <Button transparent full style={{ borderWidth: 1, height: 70, marginTop: 10, }} onPress={() => this._addProduct()}>
                            <Text> + {Strings.ADD_MORE_PRODUCTS}</Text>
                        </Button>
                    </View>

                    {this.state.equipments.map((row, index) => {
                        return <View style={{ marginBottom: 20, }}>
                            <View style={{ flexDirection: 'row', marginBottom: 10, borderBottomColor: 'lightgray', borderBottomWidth: 1, paddingBottom: 10, marginBottom: 10, }}>
                                <Button transparent full style={{ height: 50 }} onPress={() => this.props.navigation.navigate('FroidGallery', {
                                    index: index,
                                    pictures: [{ source: row.equipment.source }],
                                })}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={{ width: 50, height: 50, borderRadius: 100, }}
                                        source={{ uri: FilePicturePath() + row.equipment.source }}
                                    />
                                    <Text style={[styles.text]}>{row.equipment.name}</Text></Button>
                            </View>
                            {row.values.map((val, index) => {
                                return <View style={((val > 0 || val < 0 || val === 0) ? styles.inputSuccess : styles.inputDanger)}>
                                    <TextInput
                                        autoFocus={this.state.clickedAdd && true}
                                        keyboardType="numeric"
                                        style={styles.inputInline}
                                        underlineColorAndroid="transparent"
                                        placeholder={Strings.TEMPERATURE}
                                        value={val} onChangeText={(value) => { this._changeEquipment(row, index, value) }}
                                    />
                                    <Icon name='thermometer' style={styles.inputInlineIconDisabled} />
                                </View>
                            })}
                            <View style={{ flex: 1 }}>
                                <Button transparent full style={{ borderWidth: 1, height: 70, marginTop: 10, }} onPress={() => this._addRow(row)}>
                                    <Text> + {Strings.ADD_MORE_TEMPERATURES}</Text>
                                </Button>
                                {/* <Button danger onPress={() => this._addRow(row)} style={{ alignSelf: 'flex-end' }}>
                                    <Icon active name='add-circle' />
                                </Button> */}
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
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#494949', position: 'absolute', left: 10, bottom: 60, }}
                    position="bottomLeft"

                    onPress={() => this.props.navigation.navigate('FroidHelp', {
                        title: Strings.CONTROLE_FROID,
                        source: 'froid',
                    })}>

                    <Icon name="help" />
                </Fab>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button danger onPress={_ => this._save(0)} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.NOT_CONFORM}</Text>
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

