import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';


export class EntryPointScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }
    static navigationOptions = {
        title: 'EntryPoint',
    };

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = () => {
        // var userToken = await AsyncStorage.getItem('userToken');
        // userToken = 1;

        setTimeout(() => {
            // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
            this.props.navigation.navigate('Auth');
        }, 1000);

        // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
        // this.props.navigation.navigate('App');
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