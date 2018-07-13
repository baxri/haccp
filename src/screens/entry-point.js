import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Text
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings from '../../src/language/fr';
import { Login } from '../../src/database/realm';
import { initFolders } from '../../src/utilities/index';




export class EntryPointScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    static navigationOptions = {
        title: 'ENTRYPOINT',
    };

    _bootstrapAsync = async () => {

        initFolders();
        const userSession = await AsyncStorage.getItem('userSession');
        const userSessionType = await AsyncStorage.getItem('userSessionType');
        const adminPassword = await AsyncStorage.getItem('adminPasswordV8');

        let stack = 'Auth';

        if (userSession) {
            // stack = 'Auth';
            stack = 'StackFront';

            if (userSessionType == 'admin') {
                stack = 'StackAdmin';
                // stack = 'Auth';
            }
        }

        if (!adminPassword) {
            stack = 'SetupAdmin';
        }

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
                <Spinner visible={true} textContent={Strings.LOADING} textStyle={{ color: '#FFF' }} />
            </View>
        );
    }
}