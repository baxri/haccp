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
            // headerRight: <Menu navigation={navigation} />,
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
            fourniser: '',
            dubl: '',

            aspect: 0,
            du_produit: '',

            intact: 0,
            conforme: 0,

            autres: '',
            actions: '',

            confirmed: 0,

            date: new Date().toISOString().substring(0, 10),
            created_at: new Date(),
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const user = await User(userID);
        const controles = await Controles(userID);

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
        });

        this.props.navigation.setParams({
            test: controles.length
        });
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
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                cameraRoll: false,
            }
        };

        ImagePicker.launchCamera(options, (response) => {

            let source = { uri: response.uri };

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
                source: source.uri,
            });

        });
    };


    _showSignatureView() {
        this._signatureView.show(true);
    }

    _onSave(result) {
        var dir = RNFS.ExternalStorageDirectoryPath + '/signatures/';
        var filename = Math.floor(Date.now() / 1000) + '.png';
        var path = dir + filename;

        RNFS.mkdir(dir).then((res) => {
            RNFS.writeFile(path, result.encoded, 'base64')
                .then((success) => {
                    this.setState({ signature: 'file:/' + path });
                })
                .catch((err) => { alert(err.message) });
        }).catch((err => { alert(err) }));
        this._signatureView.show(false);
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

            // this.props.navigation.navigate('Home');
            // this._hideLoader();
            // ToastAndroid.show("Controle successfully saved!", ToastAndroid.LONG);

        }, 2000);
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    render() {
        let { image } = this.state;
        return (
            <Container style={{ alignItems: 'center', paddingTop: 60, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
                    <View style={{ alignItems: 'center', paddingBottom: 20, }}>
                        <H3>{this.state.userObj.name} {this.state.userObj.lastname}</H3>
                    </View>
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
                                        source={{ uri: this.state.source }}
                                    /></View>}
                                </Col>
                                <Col style={{ padding: 5, borderColor: 'red', flex: 0.5, }}>
                                    {this.state.signature == '' && <Button style={{ flex: 1, }} full light onPress={this._showSignatureView.bind(this)} >
                                        <Icon name='create' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}

                                    {this.state.signature != '' && <View style={{ flex: 1, backgroundColor: 'white' }}><Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: this.state.signature }}
                                    /></View>}
                                </Col>
                            </Row>
                        </Grid>
                    </View>


                    <Item floatingLabel style={styles.input}>
                        <Label>{Strings.PRODUCT}</Label>
                        <Input value={this.state.produit} onChangeText={(value) => { this.setState({ produit: value }) }} />
                    </Item>
                    <Item floatingLabel style={styles.input}>
                        <Label>{Strings.FOURNISER}</Label>
                        <Input value={this.state.fourniser} onChangeText={(value) => { this.setState({ fourniser: value }) }} />
                    </Item>
                    <Item floatingLabel style={styles.input}>
                        <Label>{Strings.DUBL}</Label>
                        <Input value={this.state.dubl} onChangeText={(value) => { this.setState({ dubl: value }) }} />
                    </Item>


                    <Grid style={{ marginBottom: 25 }}>
                        <Row>
                            <Col>
                                <Text>{Strings.ASPECT}: </Text>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkAspect(0) }}>{Strings.BON}</Text>
                                    <Radio selected={this._radioSelected(0, this.state.aspect)} onPress={() => { this._checkAspect(0) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkAspect(1) }}>{Strings.MAUVAIS}</Text>
                                    <Radio selected={this._radioSelected(1, this.state.aspect)} onPress={() => { this._checkAspect(1) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                        </Row>
                    </Grid>


                    <Item floatingLabel style={styles.input}>
                        <Label>{Strings.DUPRODUIT}t</Label>
                        <Input value={this.state.du_produit} onChangeText={(value) => { this.setState({ du_produit: value }) }} />
                    </Item>


                    <Grid style={{ marginBottom: 25 }}>
                        <Row>
                            <Col>
                                <Text>{Strings.EMBALAGE_INTATC}: </Text>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkIntact(0) }}>{Strings.NO}</Text>
                                    <Radio selected={this._radioSelected(0, this.state.intact)} onPress={() => { this._checkIntact(0) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkIntact(1) }}>{Strings.YES}</Text>
                                    <Radio selected={this._radioSelected(1, this.state.intact)} onPress={() => { this._checkIntact(1) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                        </Row>
                    </Grid>


                    <Grid style={{ marginBottom: 25 }}>
                        <Row>
                            <Col>
                                <Text>{Strings.ETIQUTAGE_CONF}: </Text>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkConforme(0) }}>{Strings.NO}</Text>
                                    <Radio selected={this._radioSelected(0, this.state.conforme)} onPress={() => { this._checkConforme(0) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                            <Col>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text onPress={() => { this._checkConforme(1) }}>{Strings.YES}</Text>
                                    <Radio selected={this._radioSelected(1, this.state.conforme)} onPress={() => { this._checkConforme(1) }} style={{ marginLeft: 20, }} />
                                </View>
                            </Col>
                        </Row>
                    </Grid>

                    <Textarea style={{ marginBottom: 50, }} rowSpan={5} bordered placeholder={Strings.AUTRES} onChangeText={(value) => { this.setState({ autres: value }) }} />

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


const styles = StyleSheet.create({
    input: {
        paddingBottom: 10,
        marginBottom: 25,
    },
});