import './view.scss';
import './requests';

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
        }
        listenButtonsView();
    });
};

function renderView(data) {
    const viewArea = document.querySelector('.view_list');
    renderElement('li', 'view__element', '', viewArea);
    const liElement = viewArea.lastChild;

    renderElement('div', 'id_employee', data.id_employee, liElement);
    renderElement('div', 'name', data.name, liElement);
    renderElement('div', 'position', data.position, liElement);
    renderElement('div', 'phone_number', data.phone_number, liElement);
    renderElement('div', 'button__delete', '', liElement);
    renderElement('div', 'button__update', '', liElement);
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

const updateData = (id, name, position, phone) => {
    
    sendHttpRequest('POST', 'http://localhost:5000/employees/add', {
        id_employee: id,
        name: name,
        position: position,
        phone_number: phone
    })
        .then(responseData => {
            console.log(responseData);
        })
        .catch(err => {
            console.log(err);
        });
};

function renderUpdateArea(id, name, position, phone) {
    const main = document.querySelector('main');
    clearPrevUpdArea(main);

    renderElement('div', 'update', '', main);
    const viewArea = document.querySelector('.update');
    renderElement('div', 'update__title', 'Изменить данные', viewArea);
    renderElement('input', 'update__name', '', viewArea);
    document.querySelector('.update__name').placeholder=name;
    renderElement('input', 'update__position', '', viewArea);
    document.querySelector('.update__position').placeholder=position;
    renderElement('input', 'update__phone', '', viewArea);
    document.querySelector('.update__phone').placeholder=phone;
    renderElement('div', 'update__cancel', 'отменить', viewArea);
    document.querySelector('.update__cancel').type='button';
    renderElement('div', 'update__save', 'сохранить', viewArea);
    document.querySelector('.update__save').type='button';
    listenUpdButtons();
}

function clearPrevUpdArea(main) {
    const updateArea = main.querySelector('.update');
    updateArea != null ? updateArea.remove() : null;
}

function formatCheckData(id, name, position, phone) {
    typeof id != "number" ? id = parseInt(id, 10): null;
    typeof name != "string" ? name = name.toString(): null;
    typeof position != "string" ? position = position.toString(): null;
    typeof phone != "number" ? phone = parseInt(phone, 10): null;
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

document.addEventListener("DOMContentLoaded", getData);
const refreshView = document.querySelector('.view__refresh');

function listenButtonsView() {
    const listEmployees = document.querySelector('.view_list');
    const buttonsDel = listEmployees.querySelectorAll('.button__delete');
    const buttonsUpd = listEmployees.querySelectorAll('.button__update');
    for (let button of buttonsDel) {
        button.addEventListener('click', function (event) {
            const idElement = parseInt( this.parentElement.querySelector('.id_employee').textContent, 10);
            deleteData(idElement);
        });
    }

    for (let button of buttonsUpd) {
        button.addEventListener('click', function (event) {
            const idElement = parseInt( this.parentElement.querySelector('.id_employee').textContent, 10);
            const name = this.parentElement.querySelector('.name').textContent;
            const position = this.parentElement.querySelector('.position').textContent;
            const phone = parseInt( this.parentElement.querySelector('.phone_number').textContent, 10);

            renderUpdateArea(idElement,name, position, phone);
        })
    }
}

function listenUpdButtons() {
    const updateWindow = document.querySelector('.update');
    const buttonSave = updateWindow.querySelector('.update__save');
    const buttonCancel = updateWindow.querySelector('.update__cancel');
    //TODO: make func for button save updates for employees data
    //buttonSave.addEventListener('click');
    buttonCancel.addEventListener('click', function (event) {
        const area = this.parentElement;
        area.remove();
    });
}

refreshView.addEventListener('click', function (event) {
    const listEmployees = document.querySelector('.view_list');
    listEmployees.remove();
    const main = document.querySelector('main');
    renderElement('ul', 'view_list', '', main);
    getData();
});

