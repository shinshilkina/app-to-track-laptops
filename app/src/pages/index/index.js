'use strict';
import './index.scss';
//import '../../server/script';

const getBtn = document.querySelector('.list');
const addBtn = document.querySelector('.add');
const delBtn = document.querySelector('.delete');

const sendHttpRequest = (method, url, data) => {
    console.log(JSON.stringify(data));
    return fetch(url, {
        method: method,
        cache: 'reload',
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        if (response.status >= 400) {
            return response.json().then(errResData => {
                const error = new Error('Something went wrong!');
                error.data = errResData;
                throw error;
            });
        }
        return response.json();
    });
};

const getData = () => {
    sendHttpRequest('GET', 'http://localhost:5000/employees/list').then(responseData => {
        for (let i = 0; i < responseData.length; i++) {
            console.log(responseData[i]);
            // log details
            console.log(responseData[i].name);
            console.log(responseData[i].position);
            console.log(responseData[i].phone_number);
        }
        console.log(responseData);
    });
};
const sendData = () => {
    sendHttpRequest('POST', 'http://localhost:5000/employees/add', {
        name: 'Слава',
        position: 'аспирант',
        phone_number: 11111111
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};
const deleteData = () => {
    sendHttpRequest('POST', 'http://localhost:5000/employees/delete', {
        id_employee: 6
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};


getBtn.addEventListener('click', getData);
addBtn.addEventListener('click', sendData);
delBtn.addEventListener('click', deleteData);



