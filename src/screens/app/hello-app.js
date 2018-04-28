import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';

export class HelloAppScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userSession: '',
            userSessionType: '',
        };

        this._bootstrapAsync();

        // Need func parameter (this is a requred parameter for this screen)
        this.props.navigation.state.params.func();
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
                <Text>Hello My App: {this.state.userSession}</Text>
                <Text>Type: {this.state.userSessionType}</Text>
            </View>
        );
    }
}