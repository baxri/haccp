import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';


export class Menu extends React.Component {
    render() {
        return (
            <View>
                <Button style={{ height: 55, padding: 10, }} transparent onPress={() => {
                    this.props.navigation.navigate('DrawerOpen');
                }}>
                    <Icon name='menu' />
                </Button>
            </View>
        );
    }
}