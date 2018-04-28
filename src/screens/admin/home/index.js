import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';
import { NoBackButton, LogoTitle, Menu } from '../../../components/header';


export class AdminHomeIndexScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            drawerLabel: 'Dashboard',
            drawerIcon: ({ tintColor }) => (
                <Icon name='home' style={{ color: tintColor, }} />
            ),
            headerLeft: <NoBackButton />,
            headerTitle: <LogoTitle HeaderText="Dashboard" />,
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
                <Text>ADMIN HOME INDEX SCREEN: {this.state.userSession}</Text>
                <Text>Type: {this.state.userSessionType}</Text>


                <Button onPress={() => { this.props.navigation.navigate('AdminHomeDetails'); }}>
                    <Text>GO TO DETAILS</Text>
                </Button>
            </View>
        );
    }
}