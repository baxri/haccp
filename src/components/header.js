import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View

} from 'react-native';
import { Container, Header, Content, Button, Text, Picker, H1, Icon } from 'native-base';
import { styles, inputAndButtonFontSize } from '../../src/utilities/styles';

export class Menu extends React.Component {
    render() {
        return (
            <View>
                <Button style={{ height: 55, padding: 10, color: 'red', }} transparent onPress={() => {
                    this.props.navigation.navigate('DrawerOpen');
                }}>
                    <Icon name='menu' style={{ color: 'white', }} />
                </Button>
            </View>
        );
    }
}

export class Space extends React.Component {
    render() {
        return (
            <View>
                
            </View>
        );
    }
}

export class Equipments extends React.Component {
    render() {
        return (
            <View>
                <Button style={{ height: 55, padding: 10, color: 'red', }} transparent onPress={() => {
                    this.props.navigation.navigate('AdminEquipments');
                }}>
                    <Icon name='analytics' style={{ color: 'white', }} />
                </Button>
            </View>
        );
    }
}

export class NoBackButton extends React.Component {
    render() {
        return (
            <View>

            </View>
        );
    }
}

export class LogoTitle extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: inputAndButtonFontSize, }}>{this.props.HeaderText}</Text>
            </View>
        );
    }
}