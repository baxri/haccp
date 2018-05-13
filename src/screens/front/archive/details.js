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

export class ArchiveDetailsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={"Reception Details"} />,
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
                        <H1 style={{ marginBottom: 25, }}>PRODUCT: {this.state.item.produit}</H1>

                        {this.state.item.confirmed == 1 && <View style={{ flexDirection: 'row' }}>
                            <Button iconLeft success>
                                <Icon name='checkmark' />
                                <Text>CONFIRMED</Text>
                            </Button>
                        </View>}
                        {this.state.item.confirmed == 0 && <View><Button iconLeft danger>
                            <Icon name='close' />
                            <Text>NOT CONFIRMED</Text>
                        </Button></View>}

                        <H3 style={{ marginTop: 20, }}>FOURNISER: {this.state.item.fourniser}</H3>
                        <H3>DUBL: {this.state.item.dubl}</H3>
                        <H3>ASPECT: {this.state.item.aspect}</H3>
                        <H3>DU PRODUIT: {this.state.item.du_produit}</H3>
                        <H3>intact: {this.state.item.intact}</H3>
                        <H3>conforme: {this.state.item.conforme}</H3>
                        <H3>autres: {this.state.item.autres}</H3>
                        <H3>actions: {this.state.item.actions}</H3>

                        <H3>date: {this.state.item.date}</H3>
                        <H3>created_at: {this.state.item.created_at.toString()}</H3>


                    </View>

                </View>
            </Container>
        );
    }
}