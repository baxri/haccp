// Luncher icon generator
// https://romannurik.github.io/AndroidAssetStudio/

console.disableYellowBox = true;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, DrawerNavigator, SwitchNavigator } from 'react-navigation';
import { Root, Button, Icon } from 'native-base';

import { EntryPointScreen } from './src/screens/entry-point';
import { SignInScreen } from './src/screens/auth/signin';
import { SignInAdminScreen } from './src/screens/auth/signinadmin';
import { SetupAdminScreen } from './src/screens/auth/setupadmin';


// Admin Screens
import { AdminHomeIndexScreen } from './src/screens/admin/home/index';

import { AdminEquipmentsIndexScreen } from './src/screens/admin/equipments/index';
import { AdminEquipmentsItemScreen } from './src/screens/admin/equipments/item';

import { AdminFournisseurIndexScreen } from './src/screens/admin/fournisseur/index';
import { AdminFournisseurItemScreen } from './src/screens/admin/fournisseur/item';

import { AdminUsersIndexScreen } from './src/screens/admin/users/index';
import { AdminUsersItemScreen } from './src/screens/admin/users/item';

import { AdminDepartmentsIndexScreen } from './src/screens/admin/departments/index';
import { AdminDepartmentsItemScreen } from './src/screens/admin/departments/item';
import { AdminDepartmentsEquipmentsModal } from './src/screens/admin/departments/equipments';

import { AdminBackupIndexScreen } from './src/screens/admin/backup/index';
import { AdminBackupRestoreScreen } from './src/screens/admin/backup/restore';

import { AdminCleanItemScreen } from './src/screens/admin/clean/item';
import { AdminCleanIndexScreen } from './src/screens/admin/clean/index';
import { AdminPasswordIndexScreen } from './src/screens/admin/password/index';
import { AdminRestoreIndexScreen } from './src/screens/admin/restore/index';
// End Admin Screens

// Front Screens
import { HomeIndexScreen } from './src/screens/front/home/index';
import { TraceIndexScreen } from './src/screens/front/Trace/index';
import { ControleIndexScreen } from './src/screens/front/controle/index';
import { NonConformeIndexScreen } from './src/screens/front/nonconforme/index';
import { FroidIndexScreen } from './src/screens/front/froid/index';
import { FrontCleanIndexScreen } from './src/screens/front/clean/index';
import { FrontCleanDoneScreen } from './src/screens/front/clean/done';
import { FrontCleanShowScreen } from './src/screens/front/clean/show';

import { ArchiveIndexScreen } from './src/screens/front/archive/index';
import { ArchiveListScreen } from './src/screens/front/archive/list';
import { ArchiveGalleryScreen } from './src/screens/front/archive/gallery';
import { ArchiveDetailsScreen } from './src/screens/front/archive/details';


import { NonconflistIndexScreen } from './src/screens/front/nonconflist/index';
import { NonConformeDetailsScreen } from './src/screens/front//nonconflist/details';

import { HelpScreen } from './src/screens/front/help';

// End Front Screens

import { LogOutScreen } from './src/screens/auth/logout';

// import { Sentry } from 'react-native-sentry';
// Sentry.config('https://65085d84c4984fafa1700fa8b2d22e51:0faf6ebe99da4922b9f9f0c6d8988907@sentry.io/1222245').install();


// const headerBackground = '#1E2EB4';
const headerBackground = '#BB0000';
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
    ControleHelp: HelpScreen,
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
    FroidGallery: ArchiveGalleryScreen,
    FroidHelp: HelpScreen,
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
    NonconformeHelp: HelpScreen,
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
    NonConformeGallery: ArchiveGalleryScreen,
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

const FrontCleanStack = StackNavigator(
  {
    FrontCleanIndex: FrontCleanIndexScreen,
    FrontCleanDone: FrontCleanDoneScreen,
    FrontCleanShow: FrontCleanShowScreen,
  },
  {
    initialRouteName: 'FrontCleanIndex',
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
  Nonconflist: NonconlistfStack,
  Archive: ArchiveStack,
  Nonconlistf: NonconlistfStack,
  FrontClean: FrontCleanStack,
  AdminLogout: LogOutScreen,
},
  {
    initialRouteName: 'Home',
    drawerBackgroundColor: '#2E2E2E',
    activeTintColor: 'white',
    contentOptions: {
      activeTintColor: '#BB0000',
      inactiveTintColor: 'white',
      activeBackgroundColor: '#D6D6D6',
    }

  });
// END FRONT =====================================================================

// START ADMIN =====================================================================
const AdminHomeStack = StackNavigator(
  {
    AdminHomeIndex: AdminHomeIndexScreen,
    // AdminHomeDetails: AdminHomeDetailsScreen,
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

const AdminFournisseurStack = StackNavigator(
  {
    AdminFournisseurIndex: AdminFournisseurIndexScreen,
    AdminFournisseurItem: AdminFournisseurItemScreen,
  },
  {
    initialRouteName: 'AdminFournisseurIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminEquipmentsStack = StackNavigator(
  {
    AdminEquipmentsIndex: AdminEquipmentsIndexScreen,
    AdminEquipmentsItem: AdminEquipmentsItemScreen,
  },
  {
    initialRouteName: 'AdminEquipmentsIndex',
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
    AdminBackupRestore: AdminBackupRestoreScreen,
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

const AdminPasswordStack = StackNavigator(
  {
    AdminPasswordIndex: AdminPasswordIndexScreen,
  },
  {
    initialRouteName: 'AdminPasswordIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminRestoreStack = StackNavigator(
  {
    AdminRestoreIndex: AdminRestoreIndexScreen,
  },
  {
    initialRouteName: 'AdminRestoreIndex',
    navigationOptions: {
      headerStyle: {
        backgroundColor: headerBackground,
      },
      headerTintColor: headerTextColor,
    }
  }
);

const AdminCleanStack = StackNavigator(
  {
    AdminCleanItem: AdminCleanItemScreen,
    AdminCleanIndex: AdminCleanIndexScreen,
  },
  {
    initialRouteName: 'AdminCleanIndex',
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
  AdminFournisseur: AdminFournisseurStack,
  AdminEquipments: AdminEquipmentsStack,
  AdminDepartments: AdminDepartmentsStack,
  AdminUsers: AdminUsersStack,
  AdminBackup: AdminBackupStack,
  AdminPassword: AdminPasswordStack,
  // AdminRestore: AdminRestoreStack,
  AdminClean: AdminCleanStack,
  AdminLogout: LogOutScreen,
},
  {
    initialRouteName: 'AdminHome',
    drawerBackgroundColor: '#2E2E2E',
    activeTintColor: 'white',
    contentOptions: {
      activeTintColor: '#BB0000',
      inactiveTintColor: 'white',
      activeBackgroundColor: '#D6D6D6',
    }
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
