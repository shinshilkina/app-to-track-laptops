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
    renderElement('div', 'button__login', 'Логин/пароль', liElement);
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
    
    sendHttpRequest('POST', 'http://localhost:5000/employees/update', {
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

function formatCheckData(id, name, position, phone) {
    typeof id != "number" ? id = parseInt(id, 10): null;
    typeof name != "string" ? name = name.toString(): null;
    typeof position != "string" ? position = position.toString(): null;
    typeof phone != "number" ? phone = parseInt(phone, 10): null;
}

const sendData = (name, position, phone) => {
    sendHttpRequest('POST', 'http://localhost:5000/employees/add', {
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

function renderUpdateArea(id, name, position, phone, updateEmployeeArea) {
    const [employeeId,employeeName, employeePosition, employeePhone] = getElementsOfUpdateArea();

    employeeId.textContent = id;
    employeeName.placeholder=name;
    employeePhone.placeholder=phone;
    employeePosition.placeholder=position;

    listenUpdButtons();
}

function getElementsOfUpdateArea() {
    const updateEmployeeArea = document.body.querySelector('main').querySelector('.update');

    const employeeId = updateEmployeeArea.querySelector('.update__id');
    const employeeName = updateEmployeeArea.querySelector('.update__name');
    const employeePosition = updateEmployeeArea.querySelector('.update__position');
    const employeePhone = updateEmployeeArea.querySelector('.update__phone');
    const buttonSave = updateEmployeeArea.querySelector('.update__buttons__save');
    const buttonCancel = updateEmployeeArea.querySelector('.update__buttons__cancel');

    return ([employeeId, employeeName, employeePosition, employeePhone, buttonSave, buttonCancel]);
}

function getElementsOfAddArea () {
    const addArea = document.querySelector('.add');
    const name = addArea.querySelector('.add__name');
    const position = addArea.querySelector('.add__position');
    const phone = addArea.querySelector('.add__phone');
    const buttonSave = addArea.querySelector('.add__buttons__save');
    const buttonCancel = addArea.querySelector('.add__buttons__cancel');
    return [name, position, phone, buttonCancel, buttonSave, addArea];
}

function clearAddArea(name, position, phone) {
    name.value = '';
    position.value = '';
    phone.value = '';
}

function getValuesOfAddArea() {
    const [name, position, phone] = getElementsOfAddArea();
    const nameValue = name.value;
    const positionValue = position.value;
    let phoneValue = parseInt(phone.value, 10);
    isNaN(phoneValue) ? phoneValue = parseInt('000000000' , 10): null;
    return [nameValue, positionValue, phoneValue];
}

function getValuesOfUpdateArea() {
    const [id, name, position, phone] = getElementsOfUpdateArea();
    const idValue = parseInt(id.textContent, 10);
    const nameValue = name.value;
    const positionValue = position.value;
    let phoneValue = parseInt(phone.value, 10);
    isNaN(phoneValue) ? phoneValue = parseInt('000000000' , 10): null;
    return [idValue, nameValue, positionValue, phoneValue];
}

function getValuesOfEmployeeProfile(viewElement) {
    const idElement = parseInt( viewElement.querySelector('.id_employee').textContent, 10);
    const name = viewElement.querySelector('.name').textContent;
    const position = viewElement.querySelector('.position').textContent;
    const phone = parseInt(viewElement.querySelector('.phone_number').textContent, 10);
    return [idElement, name, position, phone];
}


function comparisonValuesSave () {
    //find element from update area in listing employees
    const [id, newName, newPosition, newPhone] = getValuesOfUpdateArea();

    let viewElement;
    const viewLists = document.body.querySelectorAll('.view__element');
    for (let list of viewLists) {
        const idList = parseInt( list.querySelector('.id_employee').textContent, 10);
        idList === id ? viewElement = list : null ;
    }
    const [oldId,oldName, oldPosition, oldPhone] = getValuesOfEmployeeProfile(viewElement);

    //comparison changes
    let queryName, queryPosition, queryPhone;
    oldName === newName ? queryName = oldName :
        newName != '' ? queryName = newName: queryName = oldName;
    oldPosition === newPosition ? queryPosition = oldPosition :
        newPosition != '' ? queryPosition = newPosition : queryPosition = oldPosition;
    oldPhone === newPhone ? queryPhone = oldPhone :
        isNaN(newPhone) ? queryPhone=oldPhone : queryPhone = newPhone ;

    updateData(id, queryName, queryPosition, queryPhone);
    const updateEmployeeArea = document.body.querySelector('main').querySelector('.update');
    updateEmployeeArea.classList.toggle('unvisible');
    refreshView.click();
}

document.addEventListener("DOMContentLoaded", getData);
const refreshView = document.querySelector('.view__refresh');
const buttonAddEmployee = document.querySelector('.view__add-employee');

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
            const [idElement, name, position, phone] = getValuesOfEmployeeProfile(this.parentElement);
            const updateEmployeeArea = document.body.querySelector('main').querySelector('.update');
            updateEmployeeArea.classList.toggle('unvisible');
            renderUpdateArea(idElement,name, position, phone, updateEmployeeArea);
        })
    }
}

function listenUpdButtons() {
    const [employeeId, employeeName, employeePosition, employeePhone, buttonSave, buttonCancel] = getElementsOfUpdateArea();
    buttonSave.addEventListener('click', function (event) {
        comparisonValuesSave();
    });
    buttonCancel.addEventListener('click', function (event) {
        document.body.querySelector('main').querySelector('.update').classList.toggle('unvisible');
    });
}

refreshView.addEventListener('click', function (event) {
    const updateEmployeeArea = document.body.querySelector('main').querySelector('.update');
    if (!updateEmployeeArea.classList.contains('unvisible')) {
        updateEmployeeArea.classList.add('unvisible');
    }

    const listEmployees = document.querySelector('.view_list');
    listEmployees.remove();
    const main = document.querySelector('main');
    renderElement('ul', 'view_list', '', main);
    getData();
});

buttonAddEmployee.addEventListener('click', function (event) {
    const addArea = document.querySelector('.add');
    addArea.classList.toggle('unvisible');
    addArea.classList.contains('unvisible') ? null : listenAddEmployeeButtons();
});

function listenAddEmployeeButtons() {
    const [name, position, phone, buttonCancel, buttonSave, addArea]= getElementsOfAddArea();
    buttonCancel.addEventListener('click', function (event) {
        addArea.classList.toggle('unvisible');
    });
    buttonSave.addEventListener('click', function (event) {
        const [queryName, queryPosition, queryPhone] = getValuesOfAddArea();
        sendData(queryName, queryPosition, queryPhone);
        clearAddArea(name, position, phone);
        addArea.classList.toggle('unvisible');
    });
}

