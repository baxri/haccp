import React from 'react';
import {
    View,
    Image,
    Dimensions,
    TextInput,
    Keyboard,
} from 'react-native';
import { Container, Content, Button, Text, Icon, Right, Left } from 'native-base';

import { LogoTitle, UploadIcon } from '../../../components/header';
import { addEquipment, editEquipment } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';

var ImagePicker = require('react-native-image-picker');
import Strings from '../../../language/fr';
import { FilePicturePath, writePicture } from '../../../utilities/index';
import { imagePickerOptions } from '../../../utilities/image-picker';
import { styles } from '../../../utilities/styles';

export class AdminEquipmentsItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: Strings.EQUIPMENTS,
            drawerIcon: ({ tintColor }) => (
                <Icon name='analytics' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.EQUIPMENTS} />,
            headerRight: <UploadIcon navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            source: this.props.navigation.state.params.source,

            sourcePath: null,

            dimesions: { width, height } = Dimensions.get('window'),
        };
    }

    componentDidMount() {
        if (this.state.source) {
            this.setState({ sourcePath: FilePicturePath() + this.state.source });
        }
    }

    _onLayout() {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    // _pickImage = () => {
    //     ImagePicker.launchCamera(imagePickerOptions, (response) => {
    //         if (response.data) {
    //             writePictureTemp(response.data).then(filename => {
    //                 this.setState({
    //                     source: filename,
    //                     sourcePath: FilePicturePathTemp() + filename,
    //                 });
    //             });
    //         }
    //     });
    // };

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

    _saveItem() {

        this._showLoader();
        setTimeout(() => {
            if (!this.state.id) {
                addEquipment({
                    name: this.state.name,
                    source: this.state.source,
                }).then(() => {
                    this.props.navigation.navigate('AdminEquipmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();
                }).catch(error => {
                    alert(error);
                });
            } else {
                editEquipment({
                    id: this.state.id,
                    name: this.state.name,
                    source: this.state.source,

                }).then(() => {
                    this.props.navigation.navigate('AdminEquipmentsIndex');
                    Keyboard.dismiss();
                    this._hideLoader();
                }).catch(error => {
                    alert(error);
                });
            }

        }, 500);
    }

    render() {
        return (
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>
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
                                        <Text style={[{ color: 'white', }, styles.text]}>{Strings.EDIT_IMAGE}</Text>
                                    </Left>
                                    <Right>
                                        <Icon name='attach' style={{ color: 'white', }} />
                                    </Right>
                                </Button>
                            </View>}
                        </View>


                        <View style={this.state.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.EQUIPMENT_NAME}
                                value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                            {this.state.name.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.name.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <Button danger onPress={() => { this._saveItem() }} style={styles.button}>
                            <Left>
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_EQUIPMENT}</Text>
                            </Left>
                            <Right>
                                <Icon name='checkmark' style={{ color: 'white', }} />
                            </Right>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}