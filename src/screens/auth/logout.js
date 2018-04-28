import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';

export class LogOutScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    static navigationOptions = {
        drawerLabel: 'LogOut',
        drawerIcon: ({ tintColor }) => (
            <Icon name='log-out' style={{ color: tintColor, }} />
        ),
    };


    _bootstrapAsync = async () => {

        //Clear Session
        await AsyncStorage.setItem('userSession', "");
        await AsyncStorage.setItem('userSessionType', "");

        //Navigate to sign in
        this.props.navigation.navigate('EntryPoint');
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}