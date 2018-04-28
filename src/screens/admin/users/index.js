import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    
} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';


export class AdminUsersIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Users',
            drawerIcon: ({ tintColor }) => (
                <Icon name='people' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Users" />,
            headerRight: <Menu navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
            userSession: '',
            userSessionType: '',
        };

        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userSession = await AsyncStorage.getItem('userSession');
        const userSessionType = await AsyncStorage.getItem('userSessionType');

        this.setState({
            loading: 0,
            userSession: userSession,
            userSessionType: userSessionType,
        });
    };




    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>ADMIN USERS INDEX SCREEN: {this.state.userSession}</Text>
                <Text>Type: {this.state.userSessionType}</Text>
            </View>
        );
    }
}