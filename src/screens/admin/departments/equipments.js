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
            preCheckedData: [
                {
                    id: 2,
                    name: "equipment-2",
                },
            ],
            listViewData: [
                {
                    id: 1,
                    name: "equipment-1",
                    checked: false,
                },
                {
                    id: 2,
                    name: "equipment-2",
                    checked: false,
                },
                {
                    id: 3,
                    name: "equipment-3",
                    checked: false,
                },
                {
                    id: 4,
                    name: "equipment-4",
                    checked: false,
                },
                {
                    id: 5,
                    name: "equipment-5",
                    checked: false,
                },
                {
                    id: 6,
                    name: "equipment-6",
                    checked: false,
                },
            ],
        };

        this._preCheck();
    }

    _preCheck() {
        this.state.listViewData.map((item) => {
            if (this.state.preCheckedData.filter((row) => item.id == row.id).length > 0) {
                item.checked = true;
            }
            return item;
        });
    }

    _toggleCheckbox(rowId) {
        let list = this.state.listViewData;

        if (list[rowId].checked)
            list[rowId].checked = false;
        else
            list[rowId].checked = true;

        this.setState({ listViewData: list });
    }

    _confirm() {
        let checked = this.state.listViewData.filter((row) => row.checked);
        this.props.navigation.goBack();
        this.props.navigation.state.params.equipmentsChoosed(checked);
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