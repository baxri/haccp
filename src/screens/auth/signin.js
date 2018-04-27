import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    Picker,
    Alert
} from 'react-native';
import { Button, Text } from 'react-native-elements';

export class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            department: '',
            user: '',
        };
    }

    static navigationOptions = {
        title: 'EntryPoint',
    };


    GetSelectedPickerItem = () => {
        Alert.alert(this.state.user);
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text h1>HACCP</Text>
                <Text style={{ padding: 30, paddingLeft: 100, paddingRight: 100, textAlign: 'center' }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it
                </Text>

                <View style={styles.dropdownView}>
                    <Picker
                        style={styles.dropdown}
                        selectedValue={this.state.department}
                        onValueChange={(itemValue, itemIndex) => this.setState({ department: itemValue })} >
                        <Picker.Item label="SELECT DEPARTMENT" value="" />
                        <Picker.Item label="React Native" value="React Native" />
                        <Picker.Item label="Java" value="Java" />
                        <Picker.Item label="Html" value="Html" />
                        <Picker.Item label="Php" value="Php" />
                        <Picker.Item label="C++" value="C++" />
                        <Picker.Item label="JavaScript" value="JavaScript" />
                    </Picker>
                </View>
                <View style={styles.dropdownView}>
                    <Picker
                        style={styles.dropdown}
                        selectedValue={this.state.user}
                        onValueChange={(itemValue, itemIndex) => this.setState({ user: itemValue })} >
                        <Picker.Item label="SELECT USER" value="" />
                        <Picker.Item label="giorgi.bibilashvili89@gmail.com" value="George Bibilashvili" />
                        <Picker.Item label="jkob.yeang@gmail.com" value="Jakob Yeang" />
                    </Picker>
                </View>
                <Button title='CONNECTION' buttonStyle={styles.button} onPress={this.GetSelectedPickerItem} />
                <Text onPress={() => { this.props.navigation.navigate('SignInAdmin'); }}> I AM AN ADMIN </Text>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    dropdown: {
        flex: 1,
    },
    button: {
        flex: 1,
    },
    dropdownView: {
        width: 300,
        height: 50,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        marginBottom: 20,
        borderBottomColor: 'lightgray',
    },

    button: {
        width: 300,
        height: 50,
        alignItems: 'center',
        padding: 10,
        marginBottom: 40,
    },

});