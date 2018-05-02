import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Form, Item, Label, Input, Toast, Root, Left, Right, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';
import { addDepartment, editDepartment } from '../../../database/realm';



export class AdminDepartmentsItemScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Departments Item',
            drawerIcon: ({ tintColor }) => (
                <Icon name='briefcase' style={{ color: tintColor, }} />
            ),

            headerTitle: <LogoTitle HeaderText="Departments Item" />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        // Need id and name parameters (this is a requred parameter for this screen)
        this.state = {
            loading: 0,

            id: this.props.navigation.state.params.id,
            name: this.props.navigation.state.params.name,
        };

        this._bootstrapAsync();
    }


    _bootstrapAsync = async () => {

        this.setState({
            loading: 0,
        });
    };

    _saveItem() {
        if (!this.state.id) {
            addDepartment({ name: this.state.name }).then(res => {
                this.props.navigation.navigate('AdminDepartmentsIndex');
            }).catch(error => {
                alert(res.name);
            });
        } else {
            editDepartment({ id: this.state.id, name: this.state.name }).then(res => {
                this.props.navigation.navigate('AdminDepartmentsIndex');
            }).catch(error => {
                alert(res.name);
            });
        }
    }

    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Content padder style={{ flex: 1 }}>
                    <Form>
                        <Item floatingLabel style={styles.input}>
                            <Label>Department Name </Label>
                            <Input value={this.state.name} onChangeText={(value) => { this.setState({ name: value }) }} />
                        </Item>
                        <View style={{ alignItems: 'center' }}>
                            <Button primary style={styles.button} onPress={() => { this._saveItem() }}>
                                <Left >
                                    <Text style={{ color: 'white', }}>SAVE DEPARTMENT</Text>
                                </Left>
                                <Right>
                                    <Icon name='checkmark' style={{ color: 'white', }} />
                                </Right>
                            </Button>

                            <Button primary style={styles.button}
                                onPress={() => this.props.navigation.navigate('AdminDepartmentsEquipmentsModal')}
                            >
                                <Left >
                                    <Text style={{ color: 'white', }}>EQUIPMENTS</Text>
                                </Left>
                                <Right>
                                    <Icon name='checkmark' style={{ color: 'white', }} />
                                </Right>
                            </Button>

                        </View>
                    </Form>
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    input: {
        width: 400,
        paddingBottom: 10,
    },

    button: {
        width: 400,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 40,
        marginLeft: 15,
        padding: 20,
    },
});