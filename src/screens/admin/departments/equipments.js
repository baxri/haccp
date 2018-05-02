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
            listViewData: [
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
                {
                    name: "equipment-22",
                    checked: false,
                },
            ],
        };
    }

    _toggleCheckbox(rowId) {

        let list = this.state.listViewData;

        if (list[rowId].checked) {
            list[rowId].checked = false;
        } else {
            list[rowId].checked = true;
        }

        this.setState({
            listViewData: list,
        });
    }

    _confirm() {
        let checked = this.state.listViewData.filter((row) => row.checked);
        alert(checked[0].name);
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