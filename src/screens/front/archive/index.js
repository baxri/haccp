import React from 'react';
import {
    AsyncStorage,

} from 'react-native';
import { Container, Content, Icon } from 'native-base';

import { LogoTitle, Menu } from '../../../components/header';
import { ArchivesList, User } from '../../../database/realm';
import CalendarPicker from 'react-native-calendar-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr';
import { toDate, toYM } from '../../../utilities/index';

export class ArchiveIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: Strings.ARCHIVE,
            drawerIcon: ({ tintColor }) => (
                <Icon name='calendar' style={{ color: tintColor, }} />
            ),
            headerLeft: <Menu navigation={navigation} />,
            headerTitle: <LogoTitle HeaderText={Strings.ARCHIVE} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            loading: 0,
            disabledDays: [],
            customDatesStyles: [],
            // selectedStartDate: new Date().toISOString().substring(0, 10),
            selectedStartDate: toDate(new Date()),
            YM: toYM((new Date())),
        };
        this.onDateChange = this.onDateChange.bind(this);
        this.onMonthChange = this.onMonthChange.bind(this);

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userID = await AsyncStorage.getItem('userSessionId');

        this.setState({
            userId: userID,
        });

        this._setDisabledDays((new Date()).getMonth(), (new Date()).getFullYear());
    };

    onDateChange(date) {
        this.setState({
            selectedStartDate: date.format('YYYY-MM-DD'),
        });

        this.props.navigation.navigate('ArchiveList', {
            selectedStartDate: date.format('YYYY-MM-DD')
        });
    }

    onMonthChange(date) {



        this._setDisabledDays(date.format('M') - 1, date.format('YYYY'));
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _setDisabledDays = async (month, year) => {

        month = month * 1;

        this._showLoader();

        let userID = await AsyncStorage.getItem('userSessionId');

        // let pictures = await Pictures(userID, null, month, year);
        // let controles = await Controles(userID, null, month, year);
        let user = await User(userID);

        let YM = year + "-" + ((month + 1) < 10 ? "0" + (month + 1) : (month + 1));
        let archive = await ArchivesList(YM);

        // console.log(this.state.YM);

        // console.log(archive);
        // return;

        setTimeout(() => {

            var date = new Date(year, month);
            var days = [];

            while (date.getMonth() === month) {

                let str = toDate(date);
                let add = 1;
                let dateStyle = null;

                archive.map(archiveDate => {
                    if (archiveDate.id == str + user.department.id) {
                        add = 0;

                        if (archiveDate.color) {
                            dateStyle = {
                                date: str,
                                textStyle: {
                                    color: 'white',
                                },
                                style: {
                                    backgroundColor: "#00BD22",
                                    color: 'white',
                                },
                            };
                        } else {
                            dateStyle = {
                                date: str,
                                textStyle: {
                                    color: 'white',
                                },
                                style: {
                                    backgroundColor: "#FF846A",
                                    color: 'white',
                                },
                            };
                        }
                    }
                });

                if (dateStyle) {
                    let customDatesStyles = this.state.customDatesStyles;
                    customDatesStyles.push(dateStyle);
                    this.setState({ customDatesStyles: customDatesStyles });
                }

                if (add) {
                    days.push(str);
                }

                date.setDate(date.getDate() + 1);
            }

            this.setState({ disabledDays: days });
            this._hideLoader();
        }, 500)
    }

    render() {
        const { selectedStartDate } = this.state;

        return (
            <Container style={{ paddingTop: 20, }}>
                <Spinner visible={this.state.loading} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
                <Content>
                    <CalendarPicker
                        weekdays={[Strings.SUN, Strings.MON, Strings.TUE, Strings.WED, Strings.THU, Strings.FRI, Strings.SAT]}
                        months={[Strings.JANUARY, Strings.FEBRUARY, Strings.MARCH, Strings.APRIL, Strings.MAY, Strings.JUNE, Strings.JULY, Strings.AUGUST, Strings.SEPTEMBER, Strings.OCTOBER, Strings.NOVEMBER, Strings.DECEMBER]}
                        previousTitle={Strings.PREVIOUS}
                        nextTitle={Strings.NEXT}
                        onDateChange={this.onDateChange}
                        onMonthChange={this.onMonthChange}
                        disabledDates={this.state.disabledDays}
                        customDatesStyles={this.state.customDatesStyles}
                        selectedDayColor='gray'
                        textStyle={{
                            fontSize: 20,
                            color: '#494949',
                            fontSize: 25,
                        }}

                    />
                </Content>

            </Container>
        );
    }
}