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

    _bootstrapAsync = async () => {

        const userSession = await AsyncStorage.getItem('userSession');
        const userSessionType = await AsyncStorage.getItem('userSessionType');

        // Set up navigation stack for admin and user (default is Auth)
        let stack = 'Auth';

        if (userSession) {
            stack = 'StackUser';

            if (userSessionType == 'admin') {
                stack = 'StackAdmin';
            }
        }

        //You can remove timeout it just to show loader with more duration :)
        setTimeout(() => {
            this.props.navigation.navigate(stack, {
                func: () => {

                }
            });
        }, 1000);
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