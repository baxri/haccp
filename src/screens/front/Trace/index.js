import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H3, Icon, FooterTab, Footer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Departments, Users } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';


var ImagePicker = require('react-native-image-picker');

export class TraceIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Traceability',
            drawerIcon: ({ tintColor }) => (
                <Icon name='camera' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Traceability" />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,

            created_at: new Date(),
            dateString: new Date().toISOString().substring(0, 10),
            source: '',
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

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

    _confirm() {

        this._showLoader();

        setTimeout(() => {
            this._hideLoader();
            alert(this.state.source);
        }, 2000);
    }

    render() {
        let { image } = this.state;
        return (
            <Container style={{ alignItems: 'center', paddingTop: 110, }}>
                <Spinner visible={this.state.loading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                <Content>
                    <View style={{ width: 400, height: 300 }}>
                        {this.state.source.length == 0 && <Button style={{ flex: 1, }} full light onPress={this._pickImage} >
                            <Icon name='camera' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                        </Button>}
                        {/* <Text>IMAGE URL: {this.state.avatarSource}</Text> */}

                        {this.state.source.length > 0 && <Image
                            resizeMode={'contain'}
                            style={{ flex: 1, }}
                            source={{ uri: this.state.source }}
                        />}
                    </View>
                    <View style={{ alignItems: 'center', paddingTop: 40, }}>
                        <H3>Today is : {this.state.created_at.toDateString()}</H3>
                    </View>
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