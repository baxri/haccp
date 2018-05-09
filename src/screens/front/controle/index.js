import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addPicture, Pictures, User } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import RNFS from 'react-native-fs';
import SignatureView from './signature';

export class ControleIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Controle reception',
            drawerIcon: ({ tintColor }) => (
                <Icon name='camera' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText={"Controle reception" + "(" + (typeof params.test == "undefined" ? 0 : params.test) + ")"} />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,

            userId: null,
            userObj: {
                name: '',
                lastname: '',
            },

            source: '',
            signature: '',

            date: new Date().toISOString().substring(0, 10),
            created_at: new Date(),
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const user = await User(userID);

        this.setState({
            userId: userID,
            userObj: user,
            loading: 0,
        });

        this.props.navigation.setParams({
            test: pics.length
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
            quality: 0.5,
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
                    this.setState({ signature: 'file://' + path });
                    alert('file://' + path);

                })
                .catch((err) => { alert(err.message) });
        }).catch((err => { alert(err) }));
        this._signatureView.show(false);
    }


    _confirm() {
        alert("OK");
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

                    <View style={{ alignItems: 'center', width: 600, height: 220, }}>
                        <Grid style={{ width: 600 }}>
                            <Row>
                                <Col style={{ padding: 5, borderColor: 'red', flex: 0.5, }}>
                                    {this.state.source.length == 0 && <Button style={{ flex: 1, }} full light onPress={this._pickImage} >
                                        <Icon name='camera' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}
                                    {this.state.source.length > 0 && <Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: this.state.source }}
                                    />}
                                </Col>
                                <Col style={{ padding: 5, borderColor: 'red', flex: 0.5, }}>
                                    {this.state.signature.length == 0 && <Button style={{ flex: 1, }} full light onPress={this._showSignatureView.bind(this)} >
                                        <Icon name='create' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                                    </Button>}

                                    {this.state.signature.length > 0 && <View style={{ flex: 1, backgroundColor: 'white' }}><Image
                                        resizeMode={'contain'}
                                        style={{ flex: 1, }}
                                        source={{ uri: this.state.signature }}
                                    /></View>}
                                </Col>
                            </Row>
                        </Grid>
                    </View>

                    <Form style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center' }}>


                    </Form>



                    <SignatureView
                        ref={r => this._signatureView = r}
                        rotateClockwise={!!false}
                        onSave={this._onSave.bind(this)}
                    />
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button light onPress={() => this.props.navigation.navigate('Home')}>
                            <Text>CANCEL</Text>
                        </Button>
                        <Button full primary onPress={_ => this._confirm()} >
                            <Text style={{ color: 'white', }}>CONFIRM</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}