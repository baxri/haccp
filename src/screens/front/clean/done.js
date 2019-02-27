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

import { LogoTitle, Menu } from '../../../components/header';
import { addControle, User, addArchive, cleanDone } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import Strings from '../../../language/fr';
import { FilePicturePath, writePicture, toDate, toYM, renderRadios, renderFieldDanger, renderOption, renderFieldSuccess, } from '../../../utilities/index';
import { styles } from '../../../utilities/styles';
import { imagePickerOptions } from '../../../utilities/image-picker';

export class FrontCleanDoneScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.RECEPTION_CHECK,
            drawerIcon: ({ tintColor }) => (
                <Icon name='eye' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.RECEPTION_CHECK} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            schedule: props.navigation.state.params,

            source: null,
            signature: null,
            note: '',
            date: toDate(new Date()),
            YM: toYM((new Date())),
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

        this.setState({
            userId: userID,
            userObj: user,
        });

        this._hideLoader();
    };

    _showLoader() {
        this.setState({ loader: 1 });
    }

    _hideLoader() {
        this.setState({ loader: 0 });
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

    _onSave = async (result) => {
        writePicture(result.encoded).then(filename => {
            this.setState({ signature: filename });
            this._signatureView.show(false);
        });
    }

    _save() {

        if (!this.state.source) {
            ToastAndroid.show(Strings.PLEASE_TAKE_A_PICTURE, ToastAndroid.LONG); return;
        }

        Alert.alert(
            Strings.CLEANING_SCHEDULE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._store() },
            ],
            { cancelable: false }
        )
    }

    _store() {

        const { source, note, userId, date, YM, created_at, schedule } = this.state;

        this._showLoader();

        setTimeout(() => {

            addControle(userId, {
                equipment: schedule.equipment,

                source: source,
                signature: '',

                produit: '',
                fourniser: '',
                dubl: '',

                aspect: 0,
                du_produit: '',

                intact: 0,
                conforme: 0,
                autres: note,
                actions: '',
                confirmed: 1,

                temperatures: [],
                type: 3,

                quantity: 0,
                valorisation: '',
                causes: '',
                devenir: '',
                traitment: '',

                date: date,
                created_at: created_at,
            }).then(res => {

                cleanDone(schedule.equipment, schedule.department, schedule, userId).then(item => {
                }).catch(error => {
                    alert(error);
                });

                addArchive(date, YM, true, userId);

                this.props.navigation.navigate('FrontCleanIndex');
                Keyboard.dismiss();
                this._hideLoader();
                ToastAndroid.show(Strings.SCHEDULE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
            }).catch(error => {
                Keyboard.dismiss();
                this._hideLoader();
                alert(error);
            });
        }, 2000);
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    render() {

        return (
            <Container style={{ flex: 1 }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loader} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, paddingTop: 35, }}>

                    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>

                        <View style={{ width: 300, height: 300, marginBottom: 50, }}>
                            {!this.state.source && <Button style={{ flex: 1 }} full light onPress={this._pickImage} >
                                <Icon name='camera' fontSize={50} size={50} style={{ color: 'gray', fontSize: 80, }} />
                            </Button>}
                            {this.state.source && <View style={{ flex: 1, }}>
                                <View style={{ flex: 0.75, zIndex: 0 }}>
                                    <Image
                                        resizeMode={'cover'}
                                        style={{ flex: 1 }}
                                        source={{ uri: FilePicturePath() + this.state.source }}
                                    />
                                </View>
                                <Button style={[styles.button, { zIndex: 1, height: 70, width: 300, position: 'absolute', bottom: 0, }]} onPress={this._pickImage}>
                                    <Left >
                                        <Text style={[{ color: 'white', }, styles.text]}>{Strings.EDIT}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='attach' style={{ color: 'white', }} />
                                    </Right>
                                </Button>
                            </View>}
                        </View>

                    </View>

                    <Text style={[styles.text]}>{Strings.DEPARTMENT}: {this.state.schedule.department.name}</Text>
                    <Text style={[styles.text, { marginBottom: 30, }]}>{Strings.EQUIPMENTS}: {this.state.schedule.equipment.name}</Text>
                    <Textarea style={[styles.textarea, {}]} rowSpan={5} bordered placeholder={Strings.COMMENT} onChangeText={(value) => { this.setState({ note: value }) }} />
                    {/* <Text style={[{ color: 'gray', marginBottom: 85, }]}>Some additional comments goes here</Text> */}
                </Content>

                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button full success onPress={_ => this._save()} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', paddingTop: 5, }}>{Strings.DONE}</Text>
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