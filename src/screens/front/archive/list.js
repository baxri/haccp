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
    };

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
                                    <Text style={{ color: 'lightgray', fontSize: 25, }} >There is no Recep. controls yet</Text>
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
                        <Col>

                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
}