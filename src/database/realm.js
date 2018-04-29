import React from 'react';
// import { Realm } from 'realm';
const Realm = require('realm');


const DepartmentSchema = {
    primaryKey: 'id',
    name: 'Department',

    properties: {
        id: 'string',    // primary key
        name: 'string',
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


// const schemas = [DepartmentSchema];

export const addDepartment = (item) => new Promise((resolve, reject) => {

    Realm.open({ schema: [DepartmentSchema], schemaVersion: 2, })
        .then(realm => {
            // Create Realm objects and write to local storage
            realm.write(() => {
                const department = realm.create('Department', {
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

export const editDepartment = (item) => new Promise((resolve, reject) => {

    Realm.open({ schema: [DepartmentSchema], schemaVersion: 2, })
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

    Realm.open({ schema: [DepartmentSchema], schemaVersion: 2, })
        .then(realm => {
            const items = realm.objects('Department');
            resolve(items);
        })
        .catch(error => {
            reject(error);
        });
});

export const DeleteDepartment = (id) => new Promise((resolve, reject) => {

    Realm.open({ schema: [DepartmentSchema], schemaVersion: 2, })
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