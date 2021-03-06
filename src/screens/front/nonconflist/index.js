import React from 'react';
import {
    AsyncStorage,
    View,

} from 'react-native';
import { Container, Text, H3, Icon, Footer, List, ListItem, Left, Right, Body } from 'native-base';

import { LogoTitle, Menu } from '../../../components/header';
import { ControlesRange } from '../../../database/realm';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';
import { reverseFormat } from '../../../utilities/index';
import DatePicker from 'react-native-datepicker';
import { styles, AppColorSecond } from '../../../utilities/styles';

export class NonconflistIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

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
            total: 0,
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        this._loadControles();
    };

    _loadControles = async () => {
        let userID = await AsyncStorage.getItem('userSessionId');
        let controles = await ControlesRange(userID, this.state.start_date, this.state.end_date);

        let sum = controles.reduce((total, row) => {
            return total + (row.valorisation * row.quantity);
        }, 0);


        this.setState({
            controles: controles,
            total: sum,
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
                                    <H3>{row.produit}</H3>
                                    <Text>{Strings.QUANTITY}: {row.quantity}</Text>
                                </Body>
                                <Right>
                                    <H3>{(row.valorisation * row.quantity).toFixed(2)}€</H3>
                                    <Text>{Strings.VALORISATION}: {row.valorisation.toFixed(2)}€</Text>
                                </Right>
                            </ListItem>;
                        })}
                    </List>
                </View>

                <Footer>
                    <View style={{ flex: 1, backgroundColor: AppColorSecond, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.Text, { color: 'white', fontSize: 20, }]}>{this.state.total.toFixed(2)} €</Text>
                    </View>
                </Footer>
            </Container>
        );
    }
}