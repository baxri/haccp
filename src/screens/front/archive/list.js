import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Image,
    ToastAndroid,
    Dimensions,
    Modal

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H2, Icon, FooterTab, Footer, List, ListItem, Left, Right, Body, Thumbnail } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Pictures, Controles } from '../../../database/realm';
import CalendarPicker from 'react-native-calendar-picker';

export class ArchiveListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={(typeof params.title == "undefined" ? '' : params.title)} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            imagePerRow: 4,
            imageSize: {
                width: 0,
                height: 0,
            },
            images: [],
            pictures: [],
            controles: [],
            selectedStartDate: this.props.navigation.state.params.selectedStartDate,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        let userID = await AsyncStorage.getItem('userSessionId');
        let pictures = await Pictures(userID, this.state.selectedStartDate);
        let controles = await Controles(userID, this.state.selectedStartDate);

        this.props.navigation.setParams({
            title: this.props.navigation.state.params.selectedStartDate,
        });

        this.setState({
            pictures: pictures,
            controles: controles,
        });

        this._calculateSize();
    };

    _calculateSize() {
        let windowWidth = Dimensions.get('window').width;
        let size = windowWidth / this.state.imagePerRow
        this.setState({ imageSize: { width: size, height: size } })
    }

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <Container>
                <Grid>
                    <Row>
                        <Col style={{ borderBottomWidth: 1, borderColor: 'lightgray' }}>
                            <Content>
                                {!this.state.controles.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                                    <Icon name='eye' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                                    <Text style={{ color: 'lightgray', fontSize: 25, }} >There is no Recep. controls</Text>
                                </View>}
                                <List>
                                    {this.state.controles.map(row => {
                                        return <ListItem avatar onPress={() => alert("OK")} style={{ marginTop: 15, }}>
                                            <Left>
                                                <Thumbnail source={{ uri: row.source }} />
                                            </Left>
                                            <Body >
                                                <Text>{row.produit}</Text>
                                                <Text note>{row.fourniser}</Text>
                                            </Body>
                                            <Right>
                                                <Text note> {row.date}</Text>
                                            </Right>
                                        </ListItem>;
                                    })}
                                </List>
                            </Content>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ backgroundColor: 'black' }}>
                            <Content>
                                {!this.state.controles.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, }}>
                                    <Icon name='camera' fontSize={50} size={50} style={{ color: 'white', fontSize: 100, }} />
                                    <Text style={{ color: 'white', fontSize: 25, }} >There is no Pictures</Text>
                                </View>}

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}>

                                    {this.state.pictures.map((row, index) => {
                                        return <Button
                                            style={{ width: this.state.imageSize.width, height: this.state.imageSize.height }}
                                            onPress={() => this.props.navigation.navigate('ArchiveGallery', {
                                                index: index,
                                                pictures: this.state.pictures,
                                            })}>
                                            <Image
                                                resizeMode={'cover'}
                                                style={{ width: this.state.imageSize.width, height: this.state.imageSize.height }}
                                                source={{ uri: row.source }}

                                            />
                                        </Button>
                                    })}
                                </View>
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
}