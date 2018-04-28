import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, DrawerNavigator, SwitchNavigator } from 'react-navigation';
import { Root, Button, Icon } from 'native-base';

import { EntryPointScreen } from './src/screens/entry-point';
import { SignInScreen } from './src/screens/auth/signin';
import { SignInAdminScreen } from './src/screens/auth/signinadmin';
import { SetupAdminScreen } from './src/screens/auth/setupadmin';


import { HelloAppScreen } from './src/screens/app/hello-app';

import { AdminHomeIndexScreen } from './src/screens/admin/home/index';
import { AdminHomeDetailsScreen } from './src/screens/admin/home/details';


import { AdminUsersIndexScreen } from './src/screens/admin/users/index';

console.disableYellowBox = true;



const AuthStack = StackNavigator(
  {
    SignIn: SignInScreen,
    SignInAdmin: SignInAdminScreen,
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none',
  }
);

const SetupAdminStack = StackNavigator(
  {
    SetupAdminScreen: SetupAdminScreen,
  },
  {
    initialRouteName: 'SetupAdminScreen',
    headerMode: 'none',
  }
);


const DrawerStackFront = DrawerNavigator({
  HelloAppFront: HelloAppScreen
},
  {
    initialRouteName: 'HelloAppFront',

    // headerMode: 'none',
  });


// =====================================================================
const AdminHomeStack = StackNavigator(
  {
    AdminHomeIndex: AdminHomeIndexScreen,
    AdminHomeDetails: AdminHomeDetailsScreen,
  },
  {
    initialRouteName: 'AdminHomeIndex',
  }
);

const AdminUsersStack = StackNavigator(
  {
    AdminUsersIndex: AdminUsersIndexScreen,
  },
  {
    initialRouteName: 'AdminUsersIndex',
  }
);

const DrawerStackAdmin = DrawerNavigator({
  AdminHome: AdminHomeStack,
  AdminUsers: AdminUsersStack,
},
  {
    initialRouteName: 'AdminHome',
  });

// =====================================================================



const RootWrapper = SwitchNavigator(
  {
    EntryPoint: EntryPointScreen,
    StackFront: DrawerStackFront,
    StackAdmin: DrawerStackAdmin,
    Auth: AuthStack,
    SetupAdmin: SetupAdminStack,
  },
  {
    initialRouteName: 'EntryPoint',
  }
);


export default () =>
  <Root>
    <RootWrapper />
  </Root>;








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
