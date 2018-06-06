import React from 'react';
import { NetInfo } from 'react-native';
import { Form } from 'native-base';
import { realmFilePath } from '../../src/utilities/index';


const Realm = require('realm');

const FourniseurSchema = {
    primaryKey: 'id',
    name: 'Fourniseur',

    properties: {
        id: 'string',    // primary key
        name: 'string',
        controles: { type: 'linkingObjects', objectType: 'Controle', property: 'fourniseur' }
    }
};

const EquipmentSchema = {
    primaryKey: 'id',
    name: 'Equipment',

    properties: {
        id: 'string',
        source: 'string?',    // primary key
        name: 'string',
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

        equipments: 'string[]',

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
    }
};


const DepartmentSchema = {
    primaryKey: 'id',
    name: 'Department',

    properties: {
        id: 'string',    // primary key
        name: 'string',
        equipments: 'string[]',
        users: { type: 'linkingObjects', objectType: 'User', property: 'department' }
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

const schemaVersion = 21;
const schemas = [UserSchema, DepartmentSchema, PictureSchema, ControleSchema, EquipmentSchema, FourniseurSchema];
const realmPath = realmFilePath();

export const RealmFile = () => {
    // return Realm.defaultPath;
    return realmPath;
}

export const User = (userId) => new Promise((resolve, reject) => {
    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            realm.write(() => {
                let userObject = realm.objectForPrimaryKey('User', userId);
                resolve(userObject);
            });
        })
        .catch(error => {
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

export const Fourniseurs = async (item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('Fourniseur').sorted('name', true);
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
                    source:(item.source ? item.source : null) 
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

export const Equipments = async (item) => new Promise((resolve, reject) => {

    Realm.open({ path: realmPath, schema: schemas, schemaVersion: schemaVersion })
        .then(realm => {
            const items = realm.objects('Equipment').sorted('name', true);

           

            resolve(items);
        })
        .catch(error => {
            alert(error);
            reject(error);
            // setTimeout(() => {
            //     alert(error);
            //     reject(error);
            // }, 1000);
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

export const Departments = async (item) => new Promise((resolve, reject) => {

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


export const Users = (item) => new Promise((resolve, reject) => {

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
                var from = new Date(year, month-1, 1);
                var to = new Date(year, month+1, 32);

                resolve(userObject.pictures.filtered('created_at >= $0 && created_at <= $1', from, to));
            } else {
                if (date == null)
                    resolve(userObject.pictures);
                else
                    resolve(userObject.pictures.filtered('date = $0', date));
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

                    equipments: item.equipments,
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
                var from = new Date(year, month-1, 1);
                var to = new Date(year, month+1, 32);

                resolve(userObject.controles.filtered('created_at >= $0 && created_at <= $1', from, to));
            } else {
                if (date == null)
                    resolve(userObject.controles);
                else
                    resolve(userObject.controles.filtered('date = $0', date));
            }
        })
        .catch(error => {
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
            resolve(userObject.controles.filtered('created_at >= $0 && created_at <= $1 and type=2', from, to));
        })
        .catch(error => {
            reject(error);
        });
});


// END CONTROLE RECEPS ============================================================================