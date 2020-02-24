import './view.scss';

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
            console.log(responseData[i].name);
            console.log(responseData[i].position);
            console.log(responseData[i].phone_number);
            renderView(responseData[i]);
        }
        return responseData;
    });
};

function renderView(data) {
    const viewArea = document.querySelector('.view_list');
    let newElem = document.createElement('li');

    newElem.classList.add('view__element');
    viewArea.appendChild(newElem);

    let elemID = document.createElement('div');
    elemID.classList.add('id_employee');
    elemID.textContent = data.id_employee;

    renderElement('div', 'name', data.name, newElem);
    renderElement('div', 'position', data.position, newElem);
    renderElement('div', 'phone_number', data.phone_number, newElem);
    renderElement('button', 'button__delete', 'delete', newElem);
    renderElement('button', 'button__update', 'update', newElem);
}

function renderElement(tagName, className, data, parent) {
    let element = document.createElement(tagName);
    element.classList.add(className);
    element.textContent = data;

    parent.appendChild(element);
}
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

document.addEventListener("DOMContentLoaded", getData);
