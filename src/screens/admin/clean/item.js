import React from 'react';
import {
    View,
    ToastAndroid,
    Dimensions,
    Alert,
    Keyboard
} from 'react-native';
import { List, ListItem, CheckBox, FooterTab, Footer, Container, Content, Button, Text, H3, Left, Right, Icon } from 'native-base';
import { LogoTitle } from '../../../components/header';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../../language/fr'
import { DepartmentsWithEquipments, addCleanSchedule, editCleanSchedule } from '../../../database/realm';
import { styles } from '../../../utilities/styles';
import { CustomPicker } from 'react-native-custom-picker';
import { renderOption, renderFieldDanger, renderFieldSuccess } from '../../../utilities/index'

export class AdminCleanItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {

        return {
            drawerLabel: Strings.CLEANING_SCHEDULE,
            drawerIcon: ({ tintColor }) => (
                <Icon name='snow' style={{ color: tintColor, }} />
            ),
            headerTitle: <LogoTitle HeaderText={Strings.CLEANING_SCHEDULE} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.navigation.state.params.id,
            department: this.props.navigation.state.params.department,
            equipment: this.props.navigation.state.params.equipment,
            type: null,
            days: [],

            departments: [],
            types: [
                { name: Strings.MONTHLY, value: 1 },
                { name: Strings.WEEKLY, value: 2 },
                { name: Strings.DAILY, value: 3 }
            ],
            weekly: [
                { name: Strings.MON, value: 1 },
                { name: Strings.TUE, value: 2 },
                { name: Strings.WED, value: 3 },
                { name: Strings.THU, value: 4 },
                { name: Strings.FRI, value: 5 },
                { name: Strings.SAT, value: 6 },
                { name: Strings.SUN, value: 7 },
            ],
            monthly: [
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: '4', value: 4 },
                { name: '5', value: 5 },
                { name: '6', value: 6 },
                { name: '7', value: 7 },
                { name: '8', value: 8 },
                { name: '9', value: 9 },
                { name: '10', value: 10 },
                { name: '11', value: 11 },
                { name: '12', value: 12 },
                { name: '13', value: 13 },
                { name: '14', value: 14 },
                { name: '15', value: 15 },
                { name: '16', value: 16 },
                { name: '17', value: 17 },
                { name: '18', value: 18 },
                { name: '19', value: 19 },
                { name: '20', value: 20 },
                { name: '21', value: 21 },
                { name: '22', value: 22 },
                { name: '23', value: 23 },
                { name: '24', value: 24 },
                { name: '25', value: 25 },
                { name: '26', value: 26 },
                { name: '27', value: 27 },
                { name: '28', value: 28 },
                { name: '29', value: 29 },
                { name: '30', value: 30 },
                { name: '31', value: 31 },

            ],
            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
    }

    _showLoader() {
        this.setState({ loading: 1 });
    }

    _hideLoader() {
        this.setState({ loading: 0 });
    }

    _onLayout() {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {
        this.setState({ departments: await DepartmentsWithEquipments() });
        
        if (this.props.navigation.state.params.type > 0) {
            this.setState({ type: this.state.types[this.props.navigation.state.params.type - 1] });
        }

        if (this.props.navigation.state.params.id.length > 0) {
            this._organizeEditDays(this.props.navigation.state.params);
        }
    };

    _organizeEditDays(item) {

        let days = [];

        if (item.monday == 1) days.push(1);
        if (item.tuesday == 1) days.push(2);
        if (item.wednesday == 1) days.push(3);
        if (item.thursday == 1) days.push(4);
        if (item.friday == 1) days.push(5);
        if (item.saturday == 1) days.push(6);
        if (item.sunday == 1) days.push(7);

        this.state.monthly.map(object => {
            if (item['day_' + object.value] == 1) {
                days.push(object.value);
            }
        });

        this.setState({ days: days });
    }

    _changeDepartment = async (itemValue) => {
        this.setState({ department: itemValue, equipment: null, type: null, days: [] });
    }

    _changeEquipment = async (itemValue) => {
        this.setState({ equipment: itemValue });
    }

    _changeType = async (itemValue) => {
        this.setState({ type: itemValue, days: [] });
    }

    _toggleDay = (value) => {

        let days = this.state.days;
        let index = days.indexOf(value);

        if (index < 0) {
            days.push(value)
        } else {
            days.splice(index, 1);
        }

        this.setState({ days: days });
    }

    _clickSave = () => {
        Alert.alert(
            Strings.CLEANING_SCHEDULE_SAVE,
            Strings.ARE_YOU_SURE,
            [
                { text: Strings.CANCEL, style: 'cancel' },
                { text: Strings.OK, onPress: () => this._save() },
            ],
            { cancelable: false }
        )
    }

    _save = async () => {

        this._showLoader();

        let form = {
            department: this.state.department,
            equipment: this.state.equipment,
            type: this.state.type.value,
        };

        setTimeout(async () => {

            realmObject = {};
            let monthlyObject = {};
            let weeklyObject = {};
            let weekDays = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            
            // Fill monthly object with empty values
            this.state.monthly.map(object => {
                monthlyObject['day_' + object.value] = 0;
            })

            // Fill weekly object with 
            weekDays.map(value => {
                weeklyObject[value] = 0;
            })


            if (this.state.type.value == 1) {
                // Monthly
                this.state.days.map(day => {
                    monthlyObject['day_' + day] = 1;
                })
            } else if (this.state.type.value == 3) {
                // Dailly   
                for (let i = 1; i <= 31; i++) {
                    monthlyObject['day_' + i] = 1;
                }
            } else {
                // Weekly 
                this.state.days.map(day => {
                    weeklyObject[weekDays[day]] = 1;
                })
            }

            // Combine all the fields
            realmObject = { ...form, ...monthlyObject, ...weeklyObject };

            if (this.state.id.length > 0) {
                editCleanSchedule({ ...{ id: this.state.id }, ...realmObject }).then(() => {
                    this.props.navigation.navigate('AdminCleanIndex');
                    Keyboard.dismiss();
                    this._hideLoader();
                    ToastAndroid.show(Strings.SCHEDULE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
                }).catch(error => {
                    Keyboard.dismiss();
                    this._hideLoader();
                    alert(error);
                });
            } else {
                addCleanSchedule(realmObject).then(() => {
                    this.props.navigation.navigate('AdminCleanIndex');
                    Keyboard.dismiss();
                    this._hideLoader();
                    ToastAndroid.show(Strings.SCHEDULE_SUCCESSFULL_SAVED, ToastAndroid.LONG);
                }).catch(error => {
                    Keyboard.dismiss();
                    this._hideLoader();
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

                        {this.state.departments.length == 0 && <H3 style={{ marginTop: 30, textAlign: 'center' }}>{Strings.THERE_IS_NO_DEPARTMENTS}</H3>}

                        {this.state.departments.length > 0 && <View>
                            <CustomPicker
                                optionTemplate={renderOption}
                                fieldTemplate={this.state.department !== null ? renderFieldSuccess : renderFieldDanger}
                                placeholder={Strings.SELECT_DEPARTMENT}
                                getLabel={item => item.name}

                                options={this.state.departments}
                                value={this.state.department}

                                onValueChange={(value) => this._changeDepartment(value)}
                            />

                            {this.state.department !== null && <CustomPicker
                                optionTemplate={renderOption}
                                fieldTemplate={this.state.equipment !== null ? renderFieldSuccess : renderFieldDanger}
                                placeholder={Strings.SELECT_EQUIPMENTS}
                                getLabel={item => item.name}
                                options={this.state.department.equipments}
                                value={this.state.equipment}
                                onValueChange={(value) => this._changeEquipment(value)}
                            />}



                            {this.state.equipment !== null && <CustomPicker
                                optionTemplate={renderOption}
                                fieldTemplate={this.state.type !== null ? renderFieldSuccess : renderFieldDanger}
                                placeholder={Strings.SELECT_TYPE}
                                getLabel={item => item.name}
                                options={this.state.types}
                                value={this.state.type}
                                onValueChange={(value) => this._changeType(value)}
                            />}

                            {this.state.type !== null && this.state.type.value == 1 && <View style={{ borderLeftWidth: 5, borderLeftColor: 'lightgray' }}><List>
                                {this.state.monthly.map((data) => {
                                    return <ListItem style={{ height: 70, }} onPress={() => { this._toggleDay(data.value) }}>
                                        <Left>
                                            <Text>{data.name}</Text>
                                        </Left>
                                        <Right>
                                            <CheckBox style={{ marginRight: 15, }} checked={this.state.days.includes(data.value)} onPress={() => { this._toggleDay(data.value) }} />
                                        </Right>
                                    </ListItem>;
                                })}
                            </List></View>}

                            {this.state.type !== null && this.state.type.value == 2 && <View style={{ borderLeftWidth: 5, borderLeftColor: 'lightgray' }}><List>
                                {this.state.weekly.map((data) => {
                                    return <ListItem style={{ height: 70, }} onPress={() => { this._toggleDay(data.value) }}>
                                        <Left>
                                            <Text>{data.name}</Text>
                                        </Left>
                                        <Right>
                                            <CheckBox style={{ marginRight: 15, }} checked={this.state.days.includes(data.value)} onPress={() => { this._toggleDay(data.value) }} />
                                        </Right>
                                    </ListItem>;
                                })}
                            </List></View>}

                        </View>}



                        
                    </View>
                </Content >

                
                {this.state.department !== null && this.state.equipment !== null && this.state.type !== null && ( this.state.days.length > 0 || this.state.type.value == 3 ) && <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}><Button full success onPress={_ => this._clickSave()} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[{ color: 'white', paddingTop: 5, }, styles.text]}>{Strings.SAVE}</Text>
                            <Icon name='checkmark' style={{ color: 'white', }} />
                        </View>
                    </Button></FooterTab>
                </Footer>}

            </Container>
        );
    }
}

