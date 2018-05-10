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

} from 'react-native';
import { Textarea, Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer, Form, Item, Label, Input, Radio, ListItem, Right, Left } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addPicture, Pictures, User } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';
import Modal from "react-native-modal";


export class FroidIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Controle froid',
            drawerIcon: ({ tintColor }) => (
                <Icon name='snow' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={"Controle froid" + "(" + (typeof params.test == "undefined" ? 0 : params.test) + ")"} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            isModalVisible: false,

            userId: null,
            userObj: {
                name: '',
                lastname: '',
            },

            signature: null,
            equipments: [],

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

        this._parseEquipments(user.department.equipments);

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
        });

        this.props.navigation.setParams({
            test: pics.length
        });
    };

    _parseEquipments(equipments) {

        let ret = [];

        equipments.map(equipment => {

            let slice = equipment.split(":");

            let obj = {
                id: slice[0],
                name: slice[1],
                value: 0,
            };

            ret.push(obj);
        });

        this.setState({ equipments: ret });
    }

    _changeEquipment(row, value) {

        let ret = [];

        this.state.equipments.map(equipment => {

            if (equipment.id == row.id) {
                equipment.value = value;
            }

            ret.push(equipment);
        });

        this.setState({ equipments: ret });
    }

    _encodeEquipment() {

        let ret = [];

        this.state.equipments.map(equipment => {
            let str = equipment.id + ":" + equipment.name + ":" + equipment.value;
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

    _onSave(result) {
        var dir = RNFS.ExternalStorageDirectoryPath + '/signatures/';
        var filename = Math.floor(Date.now() / 1000) + '.png';
        var path = dir + filename;

        RNFS.mkdir(dir).then((res) => {
            RNFS.writeFile(path, result.encoded, 'base64')
                .then((success) => {
                    this.setState({ signature: 'file://' + path });
                    alert('file://' + path);

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

        let equipments = this._encodeEquipment();

        alert(equipments[0]);

        if (!this.state.signature) {
            ToastAndroid.show("Please add a signature!", ToastAndroid.LONG); return;
        }

        if (!confirmed) {
            this._toggleModal();
        } else {
            Alert.alert(
                'Reception check',
                'Do want to confirm this product?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => this._store(1) },
                ],
                { cancelable: false }
            )
        }
    }

    _store(confirmed) {
        this._showLoader();

        setTimeout(() => {

            // addPicture(this.state.userId, {
            //     source: this.state.source,
            //     date: this.state.date,
            //     created_at: this.state.created_at,
            // }).then(res => {
            //     this.props.navigation.navigate('Home');
            //     this._hideLoader();
            //     ToastAndroid.show("Image successfully saved!", ToastAndroid.LONG);
            // }).catch(error => {
            //     alert(error);
            // });

            this.props.navigation.navigate('Home');
            this._hideLoader();
            ToastAndroid.show("Product successfully saved!", ToastAndroid.LONG);

        }, 2000);
    }

    render() {
        let { image } = this.state;
        return (
            <Container style={{ alignItems: 'center', paddingTop: 60, }}>
                <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                <Content>
                    <View style={{ alignItems: 'center', paddingBottom: 20, }}>
                        <H3>{this.state.userObj.name} {this.state.userObj.lastname}</H3>
                    </View>
                    <View style={{ alignItems: 'center', width: 550, height: 220, marginBottom: 50, }}>
                        <Grid style={{ width: 550 }}>
                            <Row>
                                <Col style={{ padding: 5, borderColor: 'red', flex: 0.5, }}>
                                    {!this.state.signature && <Button style={{ flex: 1, }} full light onPress={this._showSignatureView.bind(this)} >
                                        <Icon name='create' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}

                                    {this.state.signature && <View style={{ flex: 1, backgroundColor: 'white' }}><Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: this.state.signature }}
                                    /></View>}
                                </Col>
                            </Row>
                        </Grid>
                    </View>

                    {this.state.equipments.map((row) => {
                        return <Item style={styles.input}>
                            <Label>{row.name}</Label>
                            <Input value={row.value} onChangeText={(value) => { this._changeEquipment(row, value) }} />
                            <Icon active name='swap' onPress={() => this._changeEquipment(row, ((row.value*1) + 1))} />
                        </Item>
                    })}

                    <Item style={styles.input}>
                        <Label>Autres</Label>
                        <Input value={this.state.produit} onChangeText={(value) => { this.setState({ autres: value }) }} />
                    </Item>

                    <Textarea style={{ marginBottom: 50, }} rowSpan={5} bordered placeholder="Autres corectivets" onChangeText={(value) => { this.setState({ actions: value }) }} />

                    <SignatureView
                        ref={r => this._signatureView = r}
                        rotateClockwise={!!false}
                        onSave={this._onSave.bind(this)}
                    />

                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={{ flex: 1, backgroundColor: 'white', padding: 20, }}>
                            <Text style={{ marginBottom: 20, }}>Action corectives</Text>
                            <Textarea style={{ marginBottom: 50, }} rowSpan={5} bordered placeholder="Action corectives" onChangeText={(value) => { this.setState({ actions: value }) }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Button danger onPress={this._toggleModal} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'white', paddingTop: 5, }}>CLOSE</Text>
                                        <Icon name='close' style={{ color: 'white', }} />
                                    </View>
                                </Button>
                                <Button full success onPress={_ => this._store(0)} style={{ marginLeft: 20, }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'white', paddingTop: 5, }}>SAVE</Text>
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
                                <Text style={{ color: 'white', paddingTop: 5, }}>NOT CONFIRM</Text>
                                <Icon name='close' style={{ color: 'white', }} />
                            </View>
                        </Button>
                        <Button full success onPress={_ => this._save(1)} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>CONFIRM</Text>
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
        width: 550,
        paddingBottom: 10,
        marginBottom: 25,
    },
});