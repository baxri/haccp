import React from 'react';
// import { Realm } from 'realm';
const Realm = require('realm');


const UserSchema = {
    primaryKey: 'id',
    name: 'User',

    properties: {
        id: 'string',    // primary key        
        name: 'string',
        lastname: 'string',
        department: 'Department',
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

const schemaVersion = 10;
const schemas = [UserSchema, DepartmentSchema];

export const file = () => {
    return Realm.defaultPath;
}

export const addDepartment = (item) => new Promise((resolve, reject) => {
    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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


export const Departments = (item) => new Promise((resolve, reject) => {

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const items = realm.objects('Department').sorted('name', true);
            resolve(items);
        })
        .catch(error => {
            reject(error);
        });
});

export const DeleteDepartment = (id) => new Promise((resolve, reject) => {

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
        .then(realm => {
            const items = realm.objects('User').sorted('name', true);;
            resolve(items);
        })
        .catch(error => {
            reject(error);
        });
});

export const DeleteUser = (id) => new Promise((resolve, reject) => {

    Realm.open({ schema: schemas, schemaVersion: schemaVersion, })
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