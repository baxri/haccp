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
import { AdminUsersItemScreen } from './src/screens/admin/users/item';

import { AdminDepartmentsIndexScreen } from './src/screens/admin/departments/index';
import { AdminDepartmentsItemScreen } from './src/screens/admin/departments/item';
import { AdminDepartmentsEquipmentsModal } from './src/screens/admin/departments/equipments';

import { AdminBackupIndexScreen } from './src/screens/admin/backup/index';

import { LogOutScreen } from './src/screens/auth/logout';

console.disableYellowBox = true;


const headerBackground = '#1E2EB4';
const headerTextColor = 'white';


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

// START FRONT =====================================================================
const DrawerStackFront = DrawerNavigator({
  HelloAppFront: HelloAppScreen,
  AdminLogout: LogOutScreen,
},
  {
    initialRouteName: 'HelloAppFront',

    // headerMode: 'none',
  });
// END FRONT =====================================================================

// START ADMIN =====================================================================
const AdminHomeStack = StackNavigator(
  {
    AdminHomeIndex: AdminHomeIndexScreen,
    AdminHomeDetails: AdminHomeDetailsScreen,
  },
  {
    initialRouteName: 'AdminHomeIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminUsersStack = StackNavigator(
  {
    AdminUsersIndex: AdminUsersIndexScreen,
    AdminUsersItem: AdminUsersItemScreen,
  },
  {
    initialRouteName: 'AdminUsersIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminDepartmentsStack = StackNavigator(
  {
    AdminDepartmentsIndex: AdminDepartmentsIndexScreen,
    AdminDepartmentsItem: AdminDepartmentsItemScreen,
    AdminDepartmentsEquipmentsModal: AdminDepartmentsEquipmentsModal,
  },
  {
    initialRouteName: 'AdminDepartmentsIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminDepartmentsStackWithModal = StackNavigator(
  {
    AdminDepartmentsStack: AdminDepartmentsStack,
    AdminDepartmentsEquipmentsModal: AdminDepartmentsEquipmentsModal,
  },
  {
    initialRouteName: 'AdminDepartmentsStack',
    mode: 'modal',
    headerMode: 'none',
  }
);

const AdminBackupStack = StackNavigator(
  {
    AdminBackupIndex: AdminBackupIndexScreen,
  },
  {
    initialRouteName: 'AdminBackupIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const DrawerStackAdmin = DrawerNavigator({
  AdminHome: AdminHomeStack,
  AdminDepartments: AdminDepartmentsStack,
  // AdminDepartments: AdminDepartmentsStackWithModal,
  AdminUsers: AdminUsersStack,
  AdminBackup: AdminBackupStack,
  AdminLogout: LogOutScreen,
},
  {
    initialRouteName: 'AdminHome',
  });

// END ADMIN =====================================================================



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
