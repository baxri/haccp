import React from 'react';
import {
    AsyncStorage,
    View,
    Image,
    ToastAndroid,

} from 'react-native';
import { Container, Content, Button, Text, H3, Icon, FooterTab, Footer } from 'native-base';

import { LogoTitle, Menu } from '../../../components/header';
import { addPicture, addArchive } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';
import { imagePickerOptions } from '../../../utilities/image-picker';
import { FilePicturePath, writePicture, toDate, toYM } from '../../../utilities/index';

var ImagePicker = require('react-native-image-picker');

export class TraceIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: Strings.TRACEABILITY,
            drawerIcon: ({ tintColor }) => (
                <Icon name='camera' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.TRACEABILITY} />,
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
            YM: toYM((new Date())),
            created_at: new Date(),
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');

        this.setState({
            userId: userID,
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
        ImagePicker.launchCamera(imagePickerOptions, (response) => {
            if (response.data) {
                writePicture(response.data).then(filename => {
                    this.setState({ source: filename });
                });
            }
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
            }).then(() => {

                addArchive(this.state.date, this.state.YM, true, this.state.userId);

                this.props.navigation.navigate('Home');
                this._hideLoader();
                ToastAndroid.show(Strings.PICTURE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
            }).catch(error => {
                alert(error);
            });

        }, 2000);
    }

    render() {
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
                        <Button full success onPress={_ => this._confirm()} >
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