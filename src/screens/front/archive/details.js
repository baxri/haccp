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
import { Container, Header, Content, Button, Text, Picker, H2, Icon, FooterTab, Footer, H1, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import Strings from '../../../language/fr';

export class ArchiveDetailsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={Strings.RECEPTION_CHECK} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            item: this.props.navigation.state.params.controle,
        };
    }

    render() {
        return (
            <Container>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={{ padding: 10, }}>
                        {this.state.item.source != '' && <View style={{ backgroundColor: 'white', margin: 10, }}><Image
                            resizeMode={'cover'}
                            style={{ width: 200, height: 200, }}
                            source={{ uri: this.state.item.source }}
                        /></View>}

                        {this.state.item.signature != '' && <View style={{ backgroundColor: 'white', borderWidth: 1, margin: 10, }}><Image
                            resizeMode={'cover'}
                            style={{ width: 200, height: 200, }}
                            source={{ uri: this.state.item.signature }}
                        /></View>}
                    </View>

                    <View style={{ paddingTop: 20, }}>
                        <H1 style={{ marginBottom: 25, }}>{Strings.PRODUCT}: {this.state.item.produit}</H1>

                        {this.state.item.confirmed == 1 && <View style={{ flexDirection: 'row' }}>
                            <Button iconLeft success>
                                <Icon name='checkmark' />
                                <Text>{Strings.CONFIRMED}</Text>
                            </Button>
                        </View>}
                        {this.state.item.confirmed == 0 && <View><Button iconLeft danger>
                            <Icon name='close' />
                            <Text>{Strings.NOT_CONFIRMED}</Text>
                        </Button></View>}

                        <H3 style={{ marginTop: 20, }}>{Strings.FOURNISER}: {this.state.item.fourniser}</H3>
                        <H3>{Strings.DUBL}: {this.state.item.dubl}</H3>
                        <H3>{Strings.ASPECT}: {this.state.item.aspect}</H3>
                        <H3>{Strings.DUPRODUIT}T: {this.state.item.du_produit}</H3>
                        <H3>{Strings.EMBALAGE_INTATC}: {this.state.item.intact}</H3>
                        <H3>{Strings.ETIQUTAGE_CONF}: {this.state.item.conforme}</H3>
                        <H3>{Strings.AUTRES}: {this.state.item.autres}</H3>
                        <H3>{Strings.ACTION_CORECTIVES}: {this.state.item.actions}</H3>

                        <H3>{Strings.DATE}: {this.state.item.date}</H3>
                        <H3>{Strings.DATETIME}: {this.state.item.created_at.toString()}</H3>
                    </View>
                </View>
            </Container>
        );
    }
}