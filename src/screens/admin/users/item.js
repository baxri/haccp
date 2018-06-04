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
    Picker,
    TouchableOpacity,

} from 'react-native';
import { Container, Header, Content, Button, Text, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addUser, editUser, Departments } from '../../../database/realm';
import Strings from '../../../language/fr'
import { styles, inputAndButtonFontSize } from '../../../utilities/styles';
import { renderOption, renderField } from '../../../utilities/index'
import { CustomPicker } from 'react-native-custom-picker';

export class AdminUsersItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: Strings.USER,
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText={Strings.USER} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            departments: [],

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
            lastname: this.props.navigation.state.params.lastname,
            department: this.props.navigation.state.params.department,

            dimesions: { width, height } = Dimensions.get('window'),
        };

        this._bootstrapAsync();
        this._loadDepartments();
    }

    _onLayout(e) {
        this.setState({ dimesions: { width, height } = Dimensions.get('window') })
    }

    _bootstrapAsync = async () => {

    };

    _loadDepartments() {
        Departments().then(items => {
            this.setState({ departments: items, loading: 0 });
        }).catch(error => {
            alert(error);
        });;
    }

    _saveItem() {

        if (this.state.department) {
            if (!this.state.id) {
                addUser(this.state.department.id, { name: this.state.name, lastname: this.state.lastname }).then(res => {
                    this.props.navigation.navigate('AdminUsersIndex');
                    Keyboard.dismiss();
                }).catch(error => {
                    alert(error);
                });
            } else {
                editUser(this.state.department.id, { id: this.state.id, name: this.state.name, lastname: this.state.lastname }).then(res => {
                    this.props.navigation.navigate('AdminUsersIndex');
                    Keyboard.dismiss();
                }).catch(error => {
                    alert(error);
                });
            }
        }
    }

    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        const options = ['One', 'Two', 'Three', 'Four', 'Five'];


        return (
            <Container style={{ flex: 1, paddingTop: 50, }} onLayout={this._onLayout.bind(this)}>
                <Content style={{ width: this.state.dimesions.width, paddingLeft: 30, paddingRight: 30, }}>

                    <View style={styles.container}>

                        <CustomPicker
                            optionTemplate={renderOption}
                            fieldTemplate={renderField}
                            placeholder={Strings.SELECT_DEPARTMENT}
                            getLabel={item => item.name}

                            options={this.state.departments}
                            value={this.state.department}

                            onValueChange={value => {
                                this.setState({ department: value });
                            }}
                        />

                        {/* <View style={styles.dropdownView}>
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.department}
                                onValueChange={(itemValue, itemIndex) => this.setState({ department: itemValue })}
                            >
                                <Picker.Item textStyle={{ fontSize: 25 }} label={Strings.SELECT_DEPARTMENT} value="" />

                                {this.state.departments.map((i, index) => (
                                    <Picker.Item key={index} label={i.name} value={i.id} />
                                ))}

                            </Picker>
                        </View> */}

                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.FIRST_NAME}
                            value={this.state.name}
                            onChangeText={(value) => { this.setState({ name: value }) }} />

                        <TextInput style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={Strings.LAST_NAME}
                            value={this.state.lastname}
                            onChangeText={(value) => { this.setState({ lastname: value }) }} />

                        <Button danger style={styles.button} onPress={() => { this._saveItem() }}>
                            <Left >
                                <Text style={[{ color: 'white', }, styles.text]}>{Strings.SAVE_USER}</Text>
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

