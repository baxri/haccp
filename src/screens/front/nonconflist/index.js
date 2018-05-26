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
import { Container, Header, Content, Button, Text, Picker, H2, H3, Icon, FooterTab, Footer, List, ListItem, Left, Right, Body, Thumbnail } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";

import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { Controles, ControlesRange } from '../../../database/realm';
import CalendarPicker from 'react-native-calendar-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';
import DatePicker from 'react-native-datepicker';

export class NonconflistIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.NONCONFORMELIST,
            drawerIcon: ({ tintColor }) => (
                <Icon name='list-box' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.NONCONFORMELIST} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 0,
            disabledDays: [],
            start_date: new Date().toISOString().substring(0, 10),
            end_date: new Date().toISOString().substring(0, 10),
            controles: [],
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        this._loadControles();
    };

    _loadControles = async () => {
        let userID = await AsyncStorage.getItem('userSessionId');
        let controles = await ControlesRange(userID, this.state.start_date, this.state.end_date);

        this.setState({
            controles: controles,
        });
    }

    componentDidMount() {
    };

    componentDidFocus() {
    };

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <Container>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <View style={{ flexDirection: 'row', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <DatePicker
                        style={{ width: 200, marginBottom: 30, marginTop: 30, }}
                        date={reverseFormat(this.state.start_date)}
                        mode="date"
                        placeholder="select date"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        format="DD-MM-YYYY"
                        androidMode="spinner"
                        onDateChange={(date) => {
                            this.setState({
                                start_date: reverseFormat(date)
                            })
                            this._loadControles();
                        }}
                    />
                    <DatePicker
                        style={{ width: 200, marginBottom: 30, marginTop: 30, }}
                        date={reverseFormat(this.state.end_date)}
                        mode="date"
                        placeholder="select date"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        androidMode="spinner"
                        format="DD-MM-YYYY"
                        onDateChange={(date) => {
                            this.setState({
                                end_date: reverseFormat(date)
                            });
                            this._loadControles();
                        }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {!this.state.controles.length && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name='alert' fontSize={50} size={50} style={{ color: 'lightgray', fontSize: 100, }} />
                        <Text style={{ color: 'lightgray', fontSize: 25, }} >{Strings.THERE_IS_NO_NONCONFORMELIST}</Text>
                    </View>}

                    <List>
                        {this.state.controles.map(row => {
                            return <ListItem avatar onPress={() => this.props.navigation.navigate('NonConformeDetails', { controle: row })} style={{ marginTop: 15, }}>
                                <Left>

                                </Left>
                                <Body >
                                    {row.type == 0 && <H3>{Strings.RECEPTION_CHECK} - {row.user.name}</H3>}
                                    {row.type == 1 && <H3>{Strings.CONTROLE_FROID} - {row.user.name}</H3>}
                                    {row.type == 2 && <H3>{Strings.NONCONFORME} - {row.user.name}</H3>}
                                    {/* {row.type == 0 && <Thumbnail source={{ uri: row.source }} />} */}
                                    {/* {row.type == 1 && <Thumbnail source={{ uri: row.signature }} />} */}
                                </Body>
                                <Right>
                                    <H3 note> {reverseFormat(row.date)}</H3>
                                </Right>
                            </ListItem>;
                        })}
                    </List>
                </View>
            </Container>
        );
    }
}