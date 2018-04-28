import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,

    Alert
} from 'react-native';

// import { Text } from 'react-native-elements';
import { Container, Header, Content, Button, Text, Picker, H1 } from 'native-base';

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
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, }}>
                <Content >
                    <View style={{ alignItems: 'center', marginBottom: 50 }}>
                        <H1>Lorem Ipsum is simply dummy text</H1>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <View style={styles.dropdownView}>
                            <Picker
                                mode="dropdown"
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
                                mode="dropdown"
                                style={styles.dropdown}
                                selectedValue={this.state.user}
                                onValueChange={(itemValue, itemIndex) => this.setState({ user: itemValue })} >
                                <Picker.Item label="SELECT USER" value="" />
                                <Picker.Item label="giorgi.bibilashvili89@gmail.com" value="George Bibilashvili" />
                                <Picker.Item label="jkob.yeang@gmail.com" value="Jakob Yeang" />
                            </Picker>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Button primary style={styles.button} onPress={this.GetSelectedPickerItem}>
                                <Text>CONNECTION</Text>
                            </Button>
                            <Button light style={styles.button} onPress={() => { this.props.navigation.navigate('SignInAdmin'); }}>
                                <Text>I AM AN ADMIN</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    dropdown: {
        flex: 1,
    },
    dropdownView: {
        width: 300,
        height: 50,
        padding: 5,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        marginBottom: 20,
        borderBottomColor: 'lightgray',
    },

    button: {
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 40,
    },
});