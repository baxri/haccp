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
import { Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addControle, Controles, Pictures, User } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';
import Modal from "react-native-modal";
import Strings from '../../../language/fr';
import Upload from 'react-native-background-upload'
import RNFetchBlob from 'react-native-fetch-blob';
import { FilePicturePath, writePicture, toDate } from '../../../utilities/index';
import { styles } from '../../../utilities/styles';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

export class ControleIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.RECEPTION_CHECK,
            drawerIcon: ({ tintColor }) => (
                <Icon name='eye' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.RECEPTION_CHECK + "(" + (typeof params.test == "undefined" ? 0 : params.test) + ")"} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loader: 1,
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
            fourniser: '',
            dubl: '',

            aspect: 0,
            du_produit: '',

            intact: 1,
            conforme: 1,

            autres: '',
            actions: '',

            confirmed: 0,

            date: toDate(new Date()),
            created_at: new Date(),

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
        const controles = await Controles(userID);

        this.setState({
            userId: userID,
            userObj: user,
        });

        this._hideLoader();

        this.props.navigation.setParams({
            test: controles.length
        });
    };

    _showLoader() {
        this.setState({ loader: 1 });
    }

    _hideLoader() {
        this.setState({ loader: 0 });
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

        if (!this.state.fourniser) {
            ToastAndroid.show(Strings.FOURNISER, ToastAndroid.LONG); return;
        }

        if (!this.state.source) {
            // ToastAndroid.show(Strings.PLEASE_TAKE_A_PICTURE, ToastAndroid.LONG); return;
        }

        if (confirmed == 0 && !this.state.signature) {
            ToastAndroid.show(Strings.PLEASE_ADD_A_SIGNATURE, ToastAndroid.LONG); return;
        }

        if (!confirmed) {
            this._toggleModal();
        } else {
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
    }

    _store(confirmed) {
        this._showLoader();

        setTimeout(() => {

            addControle(this.state.userId, {
                source: this.state.source,
                signature: this.state.signature,

                produit: this.state.produit,
                fourniser: this.state.fourniser,
                dubl: this.state.dubl,

                aspect: this.state.aspect,
                du_produit: this.state.du_produit,

                intact: this.state.intact,
                conforme: this.state.conforme,
                autres: this.state.autres,
                actions: this.state.actions,
                confirmed: this.state.confirmed,

                equipments: [],
                type: 0,

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

        var aspect_props = [
            { label: Strings.BON, value: 0 },
            { label: Strings.MAUVAIS, value: 1 }
        ];

        var yesno_props = [
            { label: Strings.NO, value: 0 },
            { label: Strings.YES, value: 1 }
        ];

        return (
            <Container style={{ flex: 1 }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loader} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
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

                    <View style={this.state.fourniser.length > 3 ? styles.inputSuccess : styles.inputDanger}>
                        <TextInput
                            style={styles.inputInline}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.FOURNISER}
                            value={this.state.fourniser} onChangeText={(value) => { this.setState({ fourniser: value }) }} />
                        {this.state.fourniser.length > 3 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                        {this.state.fourniser.length <= 3 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                    </View>

                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={Strings.DUBL}
                        value={this.state.dubl} onChangeText={(value) => { this.setState({ dubl: value }) }} />


                    <Text style={styles.label}>{Strings.ASPECT}</Text>
                    <RadioForm
                        radio_props={aspect_props}
                        initial={0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        radioStyle={{ paddingRight: 20, paddingBottom: 20 }}
                        buttonColor={'gray'}
                        selectedButtonColor={'gray'}
                        onPress={(value) => { this.setState({ aspect: value }) }}
                    />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder={Strings.DUPRODUIT}
                        value={this.state.ddu_produitubl} onChangeText={(value) => { this.setState({ du_produit: value }) }} />

                    <Text style={styles.label}>{Strings.EMBALAGE_INTATC}</Text>
                    <RadioForm
                        radio_props={yesno_props}
                        initial={1}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'gray'}
                        selectedButtonColor={'gray'}
                        radioStyle={{ paddingRight: 20, paddingBottom: 20 }}
                        onPress={(value) => { this.setState({ intact: value }) }}
                    />


                    <Text style={styles.label}>{Strings.ETIQUTAGE_CONF}</Text>
                    <RadioForm
                        radio_props={yesno_props}
                        initial={1}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'gray'}
                        selectedButtonColor={'gray'}
                        radioStyle={{ paddingRight: 20, paddingBottom: 20 }}
                        onPress={(value) => { this.setState({ conforme: value }) }}
                    />

                    <Textarea style={[styles.textarea, { marginBottom: 85, }]} rowSpan={5} bordered placeholder={Strings.AUTRES} onChangeText={(value) => { this.setState({ autres: value }) }} />

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
            </Container >
        );
    }
}


// const styles = StyleSheet.create({
//     input: {
//         paddingBottom: 10,
//         marginBottom: 25,
//     },
// });