import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Keyboard,
    Dimensions,
    TextInput,
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addFourniseur, editFourniseur } from '../../../database/realm';

import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog from 'react-native-popup-dialog';
import Strings from '../../../language/fr'
import { styles } from '../../../utilities/styles';

export class AdminFournisseurItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.FOURNISSEUR,
            drawerIcon: ({ tintColor }) => (
                <Icon name='git-compare' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.FOURNISSEUR} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {

        this.setState({
            loading: 0,
        });
    };

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _saveItem() {

        this._showLoader();

        setTimeout(() => {
            if (!this.state.id) {
                addFourniseur({
                    name: this.state.name,
                }).then(res => {
                    this.props.navigation.navigate('AdminFournisseurIndex');
                    Keyboard.dismiss();
                    this._hideLoader();

                }).catch(error => {
                    alert(error);
                });
            } else {
                editFourniseur({
                    id: this.state.id,
                    name: this.state.name,
                }).then(res => {
                    this.props.navigation.navigate('AdminFournisseurIndex');
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
                    <View style={styles.container}>

                        <View style={this.state.name.length > 0 ? styles.inputSuccess : styles.inputDanger}>
                            <TextInput
                                style={styles.inputInline}
                                underlineColorAndroid="transparent"
                                placeholder={Strings.FOURNISSEUR_NAME}
                                value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                            {this.state.name.length > 0 && <Icon name='checkmark' style={styles.inputInlineIconSuccess} />}
                            {this.state.name.length <= 0 && <Icon name='checkmark' style={styles.inputInlineIconDisabled} />}
                        </View>

                        <Button danger onPress={() => { this._saveItem() }} style={styles.button}>
                            <Left>
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_FOURNISSEUR}</Text>
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