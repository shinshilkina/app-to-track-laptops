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
            renderView(responseData[i]);
            listenButtons();
        }
    });
};

function renderView(data) {
    const viewArea = document.querySelector('.view_list');
    let newElem = document.createElement('li');

    newElem.classList.add('view__element');
    viewArea.appendChild(newElem);

    renderElement('div', 'id_employee', data.id_employee, newElem);
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

const deleteData = (id) => {
    sendHttpRequest('POST', 'http://localhost:5000/employees/delete', {
        id_employee: id
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
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


document.addEventListener("DOMContentLoaded", getData);

function listenButtons() {
    const buttonsDel = document.querySelectorAll('.button__delete');
    for (let button of buttonsDel) {
        button.addEventListener('click', function (event) {
            const idElement = parseInt( this.parentElement.querySelector('.id_employee').textContent, 10);
            deleteData(idElement);
        });
    }
}
