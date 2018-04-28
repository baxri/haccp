import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';

export class AdminHomeIndexScreen extends React.Component {
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


    static navigationOptions = {
        title: 'EntryPoint',
    };

    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>ADMIN HOME INDEX SCREEN: {this.state.userSession}</Text>
                <Text>Type: {this.state.userSessionType}</Text>
            </View>
        );
    }
}