import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator, DrawerNavigator, SwitchNavigator } from 'react-navigation';

import {EntryPointScreen} from './src/screens/entry-point';
import {SignInScreen} from './src/screens/auth/signin';
import {SignInAdminScreen} from './src/screens/auth/signinadmin';
import {HelloAppScreen} from './src/screens/app/hello-app';


const AuthStack = StackNavigator(
  {
    SignIn: SignInScreen,
    SignInAdmin: SignInAdminScreen,
  },
  {
    initialRouteName: 'SignIn',
  }
);


export default SwitchNavigator(
  {
    EntryPoint: EntryPointScreen,
    App: HelloAppScreen,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'EntryPoint',
  }
);










// import React, { Component } from 'react';
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// export default class App extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit App.js
//         </Text>
//         <Text style={styles.instructions}>
//           {instructions}
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
