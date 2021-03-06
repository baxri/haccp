import { realmFilePath, toDate } from '../../src/utilities/index';
import Realm from 'realm';
import { AsyncStorage } from 'react-native';
// const Realm = require('realm');

const ArchiveSchema = {
    primaryKey: 'id',
    name: 'ArchiveV5',

    properties: {
        id: 'string',    // primary key (dates)
        date: 'string?',    // primary key (dates)
        color: 'bool?',
        YM: 'string',
        created_at: 'date?',
    }
};

const FourniseurSchema = {
    primaryKey: 'id',
    name: 'Fourniseur',

    properties: {
        id: 'string',    // primary key
        name: 'string',
        controles: { type: 'linkingObjects', objectType: 'Controle', property: 'fourniseur' },
        departments: { type: 'linkingObjects', objectType: 'Department', property: 'fourniseurs' },
    }
};

const EquipmentSchema = {
    primaryKey: 'id',
    name: 'Equipment',

    properties: {
        id: 'string',
        source: 'string?',    // primary key
        name: 'string',
        departments: { type: 'linkingObjects', objectType: 'Department', property: 'equipments' },
        cleanschedules: { type: 'linkingObjects', objectType: 'CleanSchedule', property: 'equipment' },
        cleansdone: { type: 'linkingObjects', objectType: 'CleanDone', property: 'equipment' },
    }
};

const TemperatureSchema = {
    primaryKey: 'id',
    name: 'Temperature',

    properties: {
        id: 'string', // primary key
        values: 'string[]',
        equipment: 'Equipment',
    }
};

const ProductSchema = {
    primaryKey: 'id',
    name: 'Product',

    properties: {
        id: 'string', // primary key
        name: 'string',
        temperature: 'string',
        controle: { type: 'linkingObjects', objectType: 'Controle', property: 'products' },
    }
};

const CleanDoneSchema = {
    primaryKey: 'id',
    name: 'CleanDone',

    properties: {
        id: 'string', // primary key
        user: 'User?',
        schedule: 'CleanSchedule?',
        department: 'Department?',
        equipment: 'Equipment',
        date: 'string',
        created_at: 'date',
    }
};

const CleanScheduleSchema = {
    primaryKey: 'id',
    name: 'CleanSchedule',

    properties: {

        id: 'string', // primary key
        equipment: 'Equipment',
        department: 'Department',
        type: 'int',

        monday: 'int?',
        tuesday: 'int?',
        wednesday: 'int?',
        thursday: 'int?',
        friday: 'int?',
        saturday: 'int?',
        sunday: 'int?',
        day_1: 'int?',
        day_2: 'int?',
        day_3: 'int?',
        day_4: 'int?',
        day_5: 'int?',
        day_6: 'int?',
        day_7: 'int?',
        day_8: 'int?',
        day_9: 'int?',
        day_10: 'int?',
        day_11: 'int?',
        day_12: 'int?',
        day_13: 'int?',
        day_14: 'int?',
        day_15: 'int?',
        day_16: 'int?',
        day_17: 'int?',
        day_18: 'int?',
        day_19: 'int?',
        day_20: 'int?',
        day_21: 'int?',
        day_22: 'int?',
        day_23: 'int?',
        day_24: 'int?',
        day_25: 'int?',
        day_26: 'int?',
        day_27: 'int?',
        day_28: 'int?',
        day_29: 'int?',
        day_30: 'int?',
        day_31: 'int?',

        cleans: { type: 'linkingObjects', objectType: 'CleanDone', property: 'schedule' },

    }
};

const ControleSchema = {
    primaryKey: 'id',
    name: 'Controle',

    properties: {
        id: 'string',    // primary key
        source: 'string',
        signature: 'string',

        produit: 'string',
        fourniser: 'string',
        dubl: 'string',

        aspect: 'int',
        du_produit: 'string',

        intact: 'int',
        conforme: 'int',

        autres: 'string',
        actions: 'string',

        confirmed: 'int',

        // equipments: 'string[]',
        temperatures: 'Temperature[]',
        products: 'Product[]',


        quantity: 'int',
        valorisation: 'double',
        causes: 'string',
        devenir: 'string',
        traitment: 'string',
        traitment_date: 'date?',

        fourniseur: 'Fourniseur?',

        type: 'int',
        date: 'string',
        created_at: 'date',
        user: 'User',
        department: 'Department',

        equipment: 'Equipment?',
    }
};


const PictureSchema = {
    primaryKey: 'id',
    name: 'Picture',

    properties: {
        id: 'string',    // primary key
        source: 'string',
        date: 'string',
        created_at: 'date',
        user: 'User',
        department: 'Department',
    }
};

const UserSchema = {
    primaryKey: 'id',
    name: 'User',

    properties: {
        id: 'string',    // primary key        
        name: 'string',
        lastname: 'string',
        department: 'Department',
        pictures: { type: 'linkingObjects', objectType: 'Picture', property: 'user' },
        controles: { type: 'linkingObjects', objectType: 'Controle', property: 'user' },
        cleansdone: { type: 'linkingObjects', objectType: 'CleanDone', property: 'user' },
    }
};

const DepartmentSchema = {
    primaryKey: 'id',
    name: 'Department',

    properties: {
        id: 'string',    // primary key
        name: 'string',
        equipments: 'Equipment[]',
        fourniseurs: 'Fourniseur[]',
        users: { type: 'linkingObjects', objectType: 'User', property: 'department' },
        controles: { type: 'linkingObjects', objectType: 'Controle', property: 'department' },
        pictures: { type: 'linkingObjects', objectType: 'Picture', property: 'department' },
        cleanschedules: { type: 'linkingObjects', objectType: 'CleanSchedule', property: 'department' },
        cleansdone: { type: 'linkingObjects', objectType: 'CleanDone', property: 'department' },
    }
};

const _guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const schemaVersion = 72;
const schemas = [CleanDoneSchema, CleanScheduleSchema, ArchiveSchema, UserSchema, DepartmentSchema, PictureSchema, ControleSchema, EquipmentSchema, FourniseurSchema, TemperatureSchema, ProductSchema];
const realmPath = realmFilePath();

export const RealmFile = () => {
    return realmPath;
}

// alert(realmPath);

export const cleanDone = (equipment = null, department = null, schedule = null, userID) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            realm.write(() => {

                let date = toDate(new Date());
                let created_at = new Date();
                let userObject = realm.objectForPrimaryKey('User', userID);

                let obj = {
                    id: _guid(),
                    user: userObject,
                    schedule: schedule,
                    equipment: equipment,
                    department: department,
                    date: date,
                    created_at: created_at,
                };

                const item = realm.create('CleanDone', obj);
                resolve(item);
            });
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const checkCleanDone = async (equipment) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(() => {
            let date = toDate(new Date());
            const items = equipment.cleansdone.filtered('date = $0', date);
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const allDoneCleans = async () => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(async realm => {
            let date = toDate(new Date());
            const userID = await AsyncStorage.getItem('userSessionId');
            let userObject = realm.objectForPrimaryKey('User', userID);

            // const items = realm.objects('CleanDone').filtered('date = $0', date);
            const items = userObject.department.cleansdone.filtered('date = $0', date);
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const User = (userId) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            let userObject = realm.objectForPrimaryKey('User', userId);
            resolve(userObject);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const addCleanSchedule = (item) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            realm.write(() => {
                item.id = _guid();
                const department = realm.create('CleanSchedule', item);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const editCleanSchedule = (item) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('CleanSchedule', item, true);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const CleanSchedules = async () => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('CleanSchedule');
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const CleanSchedulesFront = async () => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(async realm => {

            const userID = await AsyncStorage.getItem('userSessionId');

            let date = new Date();
            let userObject = realm.objectForPrimaryKey('User', userID);

            let day = date.getDate();
            let weekDay = date.getDay();
            let weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            let monthField = 'day_' + day;
            let weekField = weekDays[weekDay];

            const items = userObject.department.cleanschedules.filtered(monthField + ' = $0 OR ' + weekField + ' = $1', 1, 1);
            // const items = realm.objects('CleanSchedule').filtered(monthField + ' = $0 OR ' + weekField + ' = $1', 1, 1);;
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const DeleteCleanSchedule = (id) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('CleanSchedule', { id: id }, true);
                realm.delete(department);
                resolve();
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const addArchive = (date, YM, color, userId = '') => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {

                let userObject = realm.objectForPrimaryKey('User', userId);
                let created_at = new Date();

                let archive = realm.create('ArchiveV5', { id: date + userObject.department.id, date: date, YM: YM, created_at: created_at }, true);
                let archiveFetched = archive;

                if (archive.color === null || archive.color) {
                    archiveFetched = realm.create('ArchiveV5', {
                        id: date + userObject.department.id,
                        color: color,
                    }, true);
                }

                resolve(archiveFetched);
            });
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const ArchivesList = async (YM) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('ArchiveV5').filtered('YM = $0', YM);
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

// Fourniseur ==============================================================================

export const addFourniseur = (item) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {
                const department = realm.create('Fourniseur', {
                    id: _guid(),
                    name: item.name,
                });

                resolve(department);

            });
        })
        .catch(error => {
            reject(error);
        });
});

export const editFourniseur = (item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Update Realm objects and write to local storage
            realm.write(() => {
                let department = realm.create('Fourniseur', item, true);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const Fourniseurs = async () => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('Fourniseur');//.sorted('name', true);
            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const DeleteFourniseur = (id) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('Fourniseur', { id: id }, true);
                realm.delete(department);
                resolve();
            });
        })
        .catch(error => {
            reject(error);
        });
});


// Equipments ==============================================================================

export const addEquipment = (item) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {
                const department = realm.create('Equipment', {
                    id: _guid(),
                    name: item.name,
                    source: (item.source ? item.source : null)
                });

                resolve(department);

            });
        })
        .catch(error => {
            reject(error);
        });
});

export const editEquipment = (item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Update Realm objects and write to local storage
            realm.write(() => {
                let department = realm.create('Equipment', item, true);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const Equipments = async () => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            try {
                const items = realm.objects('Equipment');//.sorted('name', true);

                resolve(items);
            } catch (error) {
                alert(error);
            }
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const DeleteEquipment = (id) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('Equipment', { id: id }, true);
                realm.delete(department);
                resolve();
            });
        })
        .catch(error => {
            reject(error);
        });
});

// END Equipments ==============================================================================

export const addDepartment = (item) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {
                const department = realm.create('Department', {
                    id: _guid(),
                    name: item.name,
                    equipments: item.equipments,
                    fourniseurs: item.fourniseurs,
                });

                resolve(department);

            });
        })
        .catch(error => {
            reject(error);
        });
});

export const editDepartment = (item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Update Realm objects and write to local storage
            realm.write(() => {
                let department = realm.create('Department', item, true);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const Departments = async () => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('Department').sorted('name', true);
            resolve(items);
        })
        .catch(error => {
            setTimeout(() => {
                alert(error);
                reject(error);
            }, 1000);
        });


});

export const DepartmentsWithEquipments = async () => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('Department').filtered('equipments.@size > 0').sorted('name', true);
            resolve(items);
        })
        .catch(error => {
            setTimeout(() => {
                alert(error);
                reject(error);
            }, 1000);
        });


});

export const DeleteDepartment = (id) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('Department', { id: id }, true);
                realm.delete(department);
                resolve();
            });
        })
        .catch(error => {
            reject(error);
        });
});






export const addUser = (departmentId, item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {

                let departmentObject = realm.objectForPrimaryKey('Department', departmentId);

                const department = realm.create('User', {
                    id: _guid(),
                    name: item.name,
                    lastname: item.lastname,
                    department: departmentObject,
                });

                resolve(department);

            });
        })
        .catch(error => {
            reject(error);
        });
});

export const editUser = (departmentId, item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Update Realm objects and write to local storage

            let departmentObject = realm.objectForPrimaryKey('Department', departmentId);

            item.department = departmentObject;

            realm.write(() => {
                let department = realm.create('User', item, true);
                resolve(department);
            });
        })
        .catch(error => {
            reject(error);
        });
});


export const Users = () => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const items = realm.objects('User').sorted('name', true);;
            resolve(items);
        })
        .catch(error => {
            reject(error);
        });
});

export const DeleteUser = (id) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let department = realm.create('User', { id: id }, true);
                realm.delete(department);
                resolve();
            });
        })
        .catch(error => {
            reject(error);
        });
});



// PICTURES ============================================================================

export const addPicture = (userId, item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {

                let userObject = realm.objectForPrimaryKey('User', userId);

                const picture = realm.create('Picture', {
                    id: _guid(),
                    source: item.source,
                    date: item.date,
                    created_at: item.created_at,
                    user: userObject,
                    department: userObject.department,
                });

                resolve(picture);
            });
        })
        .catch(error => {
            reject(error);
        });
});


export const Pictures = (userId, date = null, month = null, year = null) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            let userObject = realm.objectForPrimaryKey('User', userId);

            if (month != null && year != null) {

                // month = month * 1 - 1;
                // var from = new Date(year, month, 1);
                // var to = new Date(year, month, 31);

                month = month * 1;
                var from = new Date(year, month - 1, 1);
                var to = new Date(year, month + 1, 32);

                resolve(userObject.department.pictures.filtered('created_at >= $0 && created_at <= $1', from, to));
            } else {
                if (date == null)
                    resolve(userObject.department.pictures);
                else
                    resolve(userObject.department.pictures.filtered('date = $0', date));
            }
        })
        .catch(error => {
            reject(error);
        });
});


// END PICTURES ============================================================================


// CONTROLE RECEPS ============================================================================

export const addControle = (userId, item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let userObject = realm.objectForPrimaryKey('User', userId);

                const controle = realm.create('Controle', {
                    id: _guid(),
                    user: userObject,
                    department: userObject.department,

                    products: (item.products ? item.products : []),

                    source: item.source,
                    signature: item.signature,

                    produit: item.produit,
                    fourniser: item.fourniser,
                    dubl: item.dubl,

                    aspect: item.aspect,
                    du_produit: item.du_produit,

                    intact: item.intact,
                    conforme: item.conforme,

                    autres: item.autres,
                    actions: item.actions,

                    // equipments: item.equipments,
                    temperatures: item.temperatures,

                    type: item.type,

                    quantity: item.quantity * 1,
                    valorisation: item.valorisation * 1,
                    causes: item.causes,
                    devenir: item.devenir,
                    traitment: item.traitment,
                    traitment_date: item.traitment_date,

                    fourniseur: (item.fourniseur ? item.fourniseur : null),

                    confirmed: item.confirmed,
                    date: item.date,
                    created_at: item.created_at,

                    equipment: (item.equipment ? item.equipment : null),
                });
                resolve(controle);
            });
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});


export const Controles = (userId, date = null, month = null, year = null) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            let userObject = realm.objectForPrimaryKey('User', userId);

            if (month != null && year != null) {

                month = month * 1;
                var from = new Date(year, month - 1, 28);
                var to = new Date(year, month + 1, 1);

                resolve(userObject.department.controles.filtered('created_at >= $0 && created_at <= $1', from, to));
            } else {
                if (date == null) {
                    let controles = userObject.department.controles;
                    resolve(controles);
                } else
                    resolve(userObject.department.controles.filtered('date = $0', date));
            }
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});

export const ControlesWithDateAndConfirmed = (userId, date = null, confirmed = null) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            let userObject = realm.objectForPrimaryKey('User', userId);
            resolve(userObject.controles.filtered('date = $0 && confirmed = $1', date, confirmed));
        })
        .catch(error => {
            alert(error);
            reject(error);
        });
});


export const ControlesRange = (userId, dateFrom = null, DateTo = null) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            let userObject = realm.objectForPrimaryKey('User', userId);
            var from = new Date(dateFrom);
            var to = new Date(DateTo);
            to.setDate(to.getDate() + 1);
            resolve(userObject.department.controles.filtered('created_at >= $0 && created_at <= $1 and type=2', from, to));
        })
        .catch(error => {
            reject(error);
        });
});


// END CONTROLE RECEPS ============================================================================



// WORK FOR TEMPORARY DATABASE FOR BACKUP =========================================

export const ControlesBeforeDate = (date = null) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            const result = realm.objects('Controle').filtered('created_at <= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});

export const ControlesAfterDate = (date = null, path) => new Promise((resolve, reject) => {
    Realm.open({ path: path, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            const result = realm.objects('Controle').filtered('created_at >= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});


export const PicturesAfterDate = (date = null, path) => new Promise((resolve, reject) => {
    Realm.open({ path: path, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            console.log(d.toString());
            const result = realm.objects('Picture').filtered('created_at >= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});

export const PicturesBeforeDate = (date = null) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            console.log(d.toString());
            const result = realm.objects('Picture').filtered('created_at <= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});

export const ArchivesAfterDate = (date = null, path) => new Promise((resolve, reject) => {
    Realm.open({ path: path, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            console.log(d.toString());
            const result = realm.objects('ArchiveV5').filtered('created_at >= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});

export const ArchivesBeforeDate = (date = null) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const d = new Date(date);
            console.log(d.toString());
            const result = realm.objects('ArchiveV5').filtered('created_at <= $0', d);
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
});

export const DeleteFromTemp = (deleteItems, path) => new Promise((resolve, reject) => {
    Realm.open({ path: path, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                // let item1 = realm.create(entity, { id: id }, true);
                realm.delete(deleteItems);
                resolve("OK");
            });
        })
        .catch(error => {
            reject(error);
        });
});

export const Delete = (deleteItems) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                // let item1 = realm.create(entity, { id: id }, true);
                realm.delete(deleteItems);
                resolve("OK");
            });
        })
        .catch(error => {
            reject(error);
        });
});