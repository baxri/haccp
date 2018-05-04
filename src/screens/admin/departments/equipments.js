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


export class AdminDepartmentsEquipmentsModal extends React.Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            preCheckedData: this.props.navigation.state.params.value,
            listViewData: [
                "1:equipment-1:false",
                "2:equipment-2:false",
                "3:equipment-3:false",
                "4:equipment-4:false",
                "5:equipment-5:false",
            ],
        };


    }

    componentDidMount() {
        this._preCheck();
    };

    componentDidFocus() {
    };


    _preCheck() {

        let checkedList = this.state.listViewData.map((item) => {

            let checked = this.state.preCheckedData.filter((row) => {
                return this._id(item) == this._id(row)
            });

            if (checked.length > 0) {
                item = this._check(item);
            }

            return item;
        });

        // this.setState({ listViewData: [] });

        this.setState({ listViewData: checkedList });
    }

    _toggleCheckbox(rowId) {
        let list = this.state.listViewData;

        if (this._checked(list[rowId]))
            list[rowId] = this._uncheck(list[rowId]);
        else
            list[rowId] = this._check(list[rowId]);

        this.setState({ listViewData: list });
    }

    _confirm() {
        let checked = this.state.listViewData.filter((row) => this._checked(row));
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
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={(data, secId, rowId, rowMap) =>
                            <ListItem style={{ height: 70, padding: 15, }} onPress={() => { this._toggleCheckbox(rowId) }}>
                                <Left>
                                    <Text>{this._name(data)}</Text>
                                </Left>
                                <Right>
                                    <CheckBox checked={this._checked(data)} onPress={() => { this._toggleCheckbox(rowId) }} />
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
                        <Button full primary onPress={_ => this._confirm()} styles={{
                            positon: 'absolute',
                            bottom: 0,
                            height: 100,
                            padding: 20,
                        }}>
                            <Text style={{ color: 'white', }}>CONFIRM</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}