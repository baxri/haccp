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


} from 'react-native';
import { Fab, Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addControle, addArchive, User } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';
import Modal from "react-native-modal";
import Strings from '../../../language/fr';
import Upload from 'react-native-background-upload'
import DatePicker from 'react-native-datepicker'
import { reverseFormat } from '../../../utilities/index';
import { FilePicturePath, writePicture, toDate, toYM } from '../../../utilities/index';
import { styles } from '../../../utilities/styles';


export class NonConformeIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.NONCONFORME,
            drawerIcon: ({ tintColor }) => (
                <Icon name='alert' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.NONCONFORME} />,
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

            source: '',
            signature: '',

            produit: '',
            quantity: 0,
            valorisation: '',
            causes: '',
            devenir: '',
            traitment: '',
            traitment_date: toDate((new Date())),

            date: toDate((new Date())),
            created_at: new Date(),
            YM: toYM((new Date())),

            dimesions: { width, height } = Dimensions.get('window'),
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

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
        });

        // this.props.navigation.setParams({
        //     test: controles.length
        // });
    };

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

    _pickImage = () => {

        var options = {
            quality: 1,
            storageOptions: {
                cameraRoll: false,
            }
        };

        ImagePicker.launchCamera(options, (response) => {
            writePicture(response.data).then(filename => {
                this.setState({ source: filename });
            });
        });
    };

    _onSave = async (result) => {
        writePicture(result.encoded).then(filename => {
            this.setState({ signature: filename });
            this._signatureView.show(false);
        });
    }

    _showSignatureView() {
        this._signatureView.show(true);
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

        if (!this.state.produit) {
            ToastAndroid.show(Strings.PRODUCT, ToastAndroid.LONG); return;
        }

        if (!this.state.source) {
            // ToastAndroid.show(Strings.PLEASE_TAKE_A_PICTURE, ToastAndroid.LONG); return;
        }

        if (!this.state.signature) {
            // ToastAndroid.show(Strings.PLEASE_ADD_A_SIGNATURE, ToastAndroid.LONG); return;
        }

        Alert.alert(
            Strings.RECEPTION_CHECK,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._store(1) },
            ],
            { cancelable: false }
        )
    }

    _store(confirmed) {
        this._showLoader();

        setTimeout(() => {

            addControle(this.state.userId, {
                source: this.state.source,
                signature: this.state.signature,

                produit: this.state.produit,

                fourniser: '',
                dubl: '',

                aspect: 0,
                du_produit: '',

                intact: 0,
                conforme: 0,
                autres: '',
                actions: '',
                // confirmed: this.state.confirmed,
                confirmed: 1,

                // equipments: [],
                temperatures: [],
                type: 2,

                quantity: this.state.quantity,
                valorisation: this.state.valorisation,
                causes: this.state.causes,
                devenir: this.state.devenir,
                traitment: this.state.traitment,
                traitment_date: this.state.traitment_date,

                date: this.state.date,
                created_at: this.state.created_at,
            }).then(res => {

                addArchive(this.state.date, this.state.YM, true, this.state.userId);

                this.props.navigation.navigate('Home');
                this._hideLoader();
                ToastAndroid.show(Strings.RECEPTION_CHECK_SUCCESSFULL_SAVED, ToastAndroid.LONG);
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
                                    {this.state.source == '' && <Button style={{ flex: 1, }} full light onPress={this._pickImage} >
                                        <Icon name='camera' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}
                                    {this.state.source != '' && <View style={{ flex: 1, backgroundColor: 'white' }}><Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: FilePicturePath() + this.state.source }}
                                    /></View>}
                                </Col>
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


                    <View style={this.state.produit.length > 3 ? styles.inputSuccess : styles.inputDanger}>
                        <TextInput
                            style={styles.inputInline}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.PRODUCT}
                            value={this.state.produit} onChangeText={(value) => { this.setState({ produit: value }) }} />
                        {this.state.produit.length > 3 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                        {this.state.produit.length <= 3 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                    </View>

                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={Strings.QUANTITY}
                        value={this.state.quantity} onChangeText={(value) => { this.setState({ quantity: value }) }} />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={Strings.VALORISATION}
                        value={this.state.valorisation} onChangeText={(value) => { this.setState({ valorisation: value }) }} />


                    <Textarea style={[styles.textarea,]} rowSpan={5} bordered placeholder={Strings.CAUSES} onChangeText={(value) => { this.setState({ causes: value }) }} />
                    <Textarea style={[styles.textarea,]} rowSpan={5} bordered placeholder={Strings.DEVENIR} onChangeText={(value) => { this.setState({ devenir: value }) }} />

                    <Text style={{ marginBottom: 15, }}>{Strings.TRAITMENT_DATE}</Text>

                    <DatePicker
                        style={{ width: 300, height: 70, }}
                        customStyles={{
                            dateTouchBody: {
                                marginBottom: 20,
                                borderLeftColor: 'green',
                                borderRightColor: 'gray',
                                borderTopColor: 'gray',
                                borderBottomColor: 'gray',
                                borderWidth: 1,
                                borderLeftWidth: 4,
                                height: 70,
                                fontSize: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',

                            },
                            dateText: {
                                fontSize: 20,

                            },
                            dateInput: {
                                borderWidth: 0,
                                marginLeft: -115,
                            }
                        }}
                        date={reverseFormat(this.state.traitment_date)}
                        mode="date"
                        placeholder="select date"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        format="DD-MM-YYYY"
                        androidMode="spinner"
                        onDateChange={(date) => { this.setState({ traitment_date: reverseFormat(date) }) }}
                    />



                    <View style={{ height: 100, }}></View>

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

                    onPress={() => this.props.navigation.navigate('NonconformeHelp', {
                        title: Strings.NONCONFORME,
                        source: 'nonconforme',
                    })}>

                    <Icon name="help" />
                </Fab>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button full success onPress={_ => this._save(1)} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.SAVE}</Text>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </View>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
