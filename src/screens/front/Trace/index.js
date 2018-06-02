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
import { addPicture, Pictures } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';
import RNFetchBlob from 'react-native-fetch-blob';
import { FilePicturePath, writePicture, toDate } from '../../../utilities/index';

var ImagePicker = require('react-native-image-picker');

export class TraceIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.TRACEABILITY,
            drawerIcon: ({ tintColor }) => (
                <Icon name='camera' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.TRACEABILITY + "(" + (typeof params.test == "undefined" ? 0 : params.test) + ")"} />,
            // headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,

            userId: null,
            source: '',
            date: toDate((new Date())),
            created_at: new Date(),
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');
        const pics = await Pictures(userID);

        this.setState({
            userId: userID,
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
            quality: 1,
            storageOptions: {
                cameraRoll: false,
            }
        };

        ImagePicker.launchCamera(options, (response) => {

            // let source = { uri: response.uri };
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            writePicture(response.data).then(filename => {
                this.setState({ source: filename });
            });
        });
    };

    _confirm() {

        if (this.state.userId == null) {
            ToastAndroid.show("USER_ID_IS_NULL", ToastAndroid.LONG);
            return;
        }

        if (this.state.source.length == 0) {
            ToastAndroid.show(Strings.PLEASE_TAKE_A_PICTURE, ToastAndroid.LONG);
            return;
        }

        this._showLoader();

        setTimeout(() => {
            addPicture(this.state.userId, {
                source: this.state.source,
                date: this.state.date,
                created_at: this.state.created_at,
            }).then(res => {
                this.props.navigation.navigate('Home');
                this._hideLoader();
                ToastAndroid.show(Strings.PICTURE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
            }).catch(error => {
                alert(error);
            });

        }, 2000);
    }

    render() {
        let { image } = this.state;
        return (
            <Container style={{ alignItems: 'center', paddingTop: 110, }}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content>
                    <View style={{ width: 400, height: 300 }}>
                        {this.state.source.length == 0 && <Button style={{ flex: 1, }} full light onPress={this._pickImage} >
                            <Icon name='camera' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                        </Button>}
                        {this.state.source.length > 0 && <Image
                            resizeMode={'contain'}
                            style={{ flex: 1, }}
                            source={{ uri: FilePicturePath() + this.state.source }}
                        />}
                    </View>
                    <View style={{ alignItems: 'center', paddingTop: 40, }}>
                        <H3>{reverseFormat(this.state.date)}</H3>
                    </View>
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button light onPress={() => this.props.navigation.navigate('Home')}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ paddingTop: 5, }}>{Strings.CANCEL}</Text>
                                <Icon name='close' />
                            </View>
                        </Button>
                        <Button full danger onPress={_ => this._confirm()} >
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