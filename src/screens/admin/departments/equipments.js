import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ListView,
    FlatList,
    RefreshControl,

} from 'react-native';
import { Container, Footer, Header, Content, Button, Text, Picker, H1, Icon, Fab, List, ListItem, CheckBox, Left, Right, FooterTab } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import Strings from '../../../language/fr'

export class AdminDepartmentsEquipmentsModal extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle HeaderText={Strings.CHOOSE_EQUIPMENTS} />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            preCheckedData: this.props.navigation.state.params.value,
            equipments_select: this.props.navigation.state.params.equipments_select,
            // preCheckedData: [
            //     "2:equipment-2:true",
            // ],
            listViewData: [
                "1:equipment-1:false",
                "2:equipment-2:false",
                "3:equipment-3:false",
                "4:equipment-4:false",
                "5:equipment-5:false",
            ],

            formatedData: [

            ],
        };

    }

    componentDidMount = async () => {
        let populate = await this._unserializeList();

        this.setState({ formatedData: populate });

    };
   

    _serializeList() {
        return new Promise((resolve => {
            let populate = [];

            this.state.formatedData.map((item) => {
                if (item.checked) {
                    let str = item.id + ":" + item.name + ":true";
                    populate.push(str);
                }
            });

            resolve(populate);
        }));
    }

    _unserializeList() {
        return new Promise((resolve => {
            let populate = [];

           
            this.state.equipments_select.map((item) => {

                let obj = {
                    // id: this._id(item),
                    // name: this._name(item),
                    // checked: this._checked(item),

                    id: item.id,
                    name: item.name,
                    checked: false,
                }

                let checked = this.state.preCheckedData.filter((row) => {
                    // return this._id(item) == this._id(row)
                    return item.id == this._id(row)
                });

                if (checked.length > 0) {
                    obj.checked = true;
                }

                populate.push(obj);
            });

            resolve(populate);
        }));
    }

    _toggleCheckbox(rowId) {

        let list = this.state.formatedData;

        // alert(list[rowId].name);

        if (list[rowId].checked)
            list[rowId].checked = false;
        else
            list[rowId].checked = true;

        this.setState({ formatedData: list });
    }

    _confirm = async () => {

        let checked = await this._serializeList();

        // alert(checked);

        this.props.navigation.goBack();
        this.props.navigation.state.params.equipmentsChoosed(checked);
    }

    _id(item) {
        return item.split(":")[0];
    }

    _name(item) {
        return item.split(":")[1];
    }

    _checked(item) {
        if (item.split(":")[2] == "true")
            return true;
        else
            return false;
    }

    _check(item) {
        let id = this._id(item);
        let name = this._name(item);
        return id + ":" + name + ":true";
    }

    _uncheck(item) {
        let id = this._id(item);
        let name = this._name(item);
        return id + ":" + name + ":false";
    }

    render() {        

        return (
            <Container>
                <Content>
                    <List
                        dataSource={this.ds.cloneWithRows(this.state.formatedData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 70, padding: 15, }} onPress={() => { this._toggleCheckbox(rowId) }}>
                                <Left>
                                    <Text>{data.name}</Text>
                                </Left>
                                <Right>
                                    <CheckBox checked={data.checked} onPress={() => { this._toggleCheckbox(rowId) }} />
                                </Right>
                            </ListItem>}
                        renderLeftHiddenRow={data =>
                            <Button full onPress={_ => this._editRow(data)}>
                                <Icon active name="build" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this._deleteRow(data.id, secId, rowId, rowMap)}>
                                <Icon active name="trash" />
                            </Button>}
                        leftOpenValue={0}
                        rightOpenValue={0}
                    />
                </Content>
                <Footer styles={{ height: 100 }}>
                    <FooterTab styles={{ height: 100 }}>
                        <Button light onPress={() => this.props.navigation.goBack()}>
                            <Text>{Strings.BACK}</Text>
                        </Button>
                        <Button full primary onPress={_ => this._confirm()} styles={{
                            positon: 'absolute',
                            bottom: 0,
                            height: 100,
                            padding: 20,
                        }}>
                            <Text style={{ color: 'white', }}>{Strings.CONFIRM}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}