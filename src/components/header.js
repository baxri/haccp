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
import * as Progress from 'react-native-progress';
import Image from 'react-native-scalable-image';


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

export class ProgressBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.visible == 1 && <View style={{
                flex: 1,
                position: "absolute",
                zIndex: 100,
                backgroundColor: "white",
                alignItems: 'center',
                justifyContent: 'center',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                // borderColor: 'red',
                // borderWidth: 1,
                // opacity: 0.9,
            }}>

                <Progress.Bar progress={this.props.progressValue / 100} width={300} color="red" />
                <H1 style={{ fontSize: 30, color: 'gray', marginTop: 30, }}>{this.props.progressValue}%</H1>
            </View>
        );
    }
}
