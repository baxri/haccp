import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';


export class SignInAdminScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: 1,
        };

        this._bootstrapAsync();
    }

    static navigationOptions = {
        title: 'SignIn Administrator',
    };

    _bootstrapAsync = async () => {
        const adminPassword = await AsyncStorage.getItem('adminPasswordV1');

        alert(adminPassword)

        this.setState({
            loading: 0,
        });

        // If admin not exists yet lets create/setup it
        if (!adminPassword) {
            this.props.navigation.navigate('SetupAdmin');
        }
    };

    render() {

        if (this.state.loading) {
            return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>SignInAdminScreen</Text>
            </View>
        );
    }
}