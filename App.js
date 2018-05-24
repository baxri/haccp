// Luncher icon generator
//https://reiszecke.github.io/AndroidAssetStudioFullsize/icons-launcher.html#foreground.type=clipart&foreground.space.trim=1&foreground.space.pad=0.05&foreground.clipart=res%2Fclipart%2Ficons%2Faction_visibility.svg&foreColor=016da1%2C0&crop=0&backgroundShape=square&backColor=ebfaff%2C100&effects=score

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, DrawerNavigator, SwitchNavigator } from 'react-navigation';
import { Root, Button, Icon } from 'native-base';

import { EntryPointScreen } from './src/screens/entry-point';
import { SignInScreen } from './src/screens/auth/signin';
import { SignInAdminScreen } from './src/screens/auth/signinadmin';
import { SetupAdminScreen } from './src/screens/auth/setupadmin';


import { HelloAppScreen } from './src/screens/app/hello-app';

// Admin Screens
import { AdminHomeIndexScreen } from './src/screens/admin/home/index';
import { AdminHomeDetailsScreen } from './src/screens/admin/home/details';

import { AdminUsersIndexScreen } from './src/screens/admin/users/index';
import { AdminUsersItemScreen } from './src/screens/admin/users/item';

import { AdminDepartmentsIndexScreen } from './src/screens/admin/departments/index';
import { AdminDepartmentsItemScreen } from './src/screens/admin/departments/item';
import { AdminDepartmentsEquipmentsModal } from './src/screens/admin/departments/equipments';

import { AdminBackupIndexScreen } from './src/screens/admin/backup/index';

// End Admin Screens


// Front Screens
import { HomeIndexScreen } from './src/screens/front/home/index';
import { TraceIndexScreen } from './src/screens/front/Trace/index';
import { ControleIndexScreen } from './src/screens/front/controle/index';
import { NonConformeIndexScreen } from './src/screens/front/nonconforme/index';
import { FroidIndexScreen } from './src/screens/front/froid/index';

import { ArchiveIndexScreen } from './src/screens/front/archive/index';
import { ArchiveListScreen } from './src/screens/front/archive/list';
import { ArchiveGalleryScreen } from './src/screens/front/archive/gallery';
import { ArchiveDetailsScreen } from './src/screens/front/archive/details';


import { NonconflistIndexScreen } from './src/screens/front/nonconflist/index';
import { NonConformeDetailsScreen } from './src/screens/front//nonconflist/details';


// End Front Screens


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

const HomeStack = StackNavigator(
  {
    HomeIndex: HomeIndexScreen,
  },
  {
    initialRouteName: 'HomeIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const TraceStack = StackNavigator(
  {
    TraceIndex: TraceIndexScreen,
  },
  {
    initialRouteName: 'TraceIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);


const ControleStack = StackNavigator(
  {
    ControleIndex: ControleIndexScreen,
  },
  {
    initialRouteName: 'ControleIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const FroidStack = StackNavigator(
  {
    FroidIndex: FroidIndexScreen,
  },
  {
    initialRouteName: 'FroidIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const NonConformeStack = StackNavigator(
  {
    NonConformeIndex: NonConformeIndexScreen,
  },
  {
    initialRouteName: 'NonConformeIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const ArchiveStack = StackNavigator(
  {
    ArchiveIndex: ArchiveIndexScreen,
    ArchiveList: ArchiveListScreen,
    ArchiveGallery: ArchiveGalleryScreen,
    ArchiveDetails: ArchiveDetailsScreen,
  },
  {
    initialRouteName: 'ArchiveIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);


const NonconlistfStack = StackNavigator(
  {
    NonconflistIndex: NonconflistIndexScreen,   
    NonConformeDetails: NonConformeDetailsScreen,
  },
  {
    initialRouteName: 'NonconflistIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);


const DrawerStackFront = DrawerNavigator({
  Home: HomeStack,
  Trace: TraceStack,
  Controle: ControleStack,
  Froid: FroidStack,
  NonConforme: NonConformeStack,
  Archive: ArchiveStack,
  Nonconlistf: NonconlistfStack,  
  AdminLogout: LogOutScreen,
},
  {
    initialRouteName: 'Home',
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
