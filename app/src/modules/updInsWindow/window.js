import './window.scss';
import windowUpdate from "./window.pug";
import windowUpdateType from './windowUpdate.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice} from '../../modules/requests';
import refreshView from "../refreshView";

/**
 *
 * @param row{Object}
 * @param type{string}
 */
const windowUpdIns = (row, type) => {
    catchPopUp();
    const area = document.querySelector("main");
    const rowElements = getElements(row);
    if (type === 'insert') {
        const popUp = windowUpdate(rowElements);
        area.insertAdjacentHTML('beforeend', popUp);
    } else {
        const popUp = windowUpdateType(rowElements);
        area.insertAdjacentHTML('beforeend', popUp);
    }
    const popUpR = document.querySelector('.window');
    popUpR.classList.add(type);

    const phoneNumber = popUpR.querySelector('.phone_number');
    if (phoneNumber) {
        phoneNumber.setAttribute('maxLength', 25);
    }

    const title = popUpR.querySelector('.title');
    if (type === 'update') {
        title.textContent = 'Изменить';
    } else if (type === 'insert') {
        title.textContent = 'Добаваить';
    }
    addDescriptionOfficeAndEmployeesInputs(popUpR);
    listenButtonsWindow(popUpR, rowElements);
};

function addDescriptionOfficeAndEmployeesInputs(viewArea) {
    const descriprions = {
        'name': 'ФИО:',
        'position': 'Должность:',
        'phone_number': 'Номер телефона:',
        'office': 'Кабинет:',
        'housing': 'Корпус: ',
        'type': 'Тип кабинета:'
    };
    const addDescription = (element) => {
        const className = element.className;
        const descr = document.createElement('div');
        descr.textContent = descriprions[className];
        descr.classList.add(className + '-title');
        const parentDiv = element.parentNode;
        parentDiv.insertBefore(descr, element);
    };
    const elements = viewArea.querySelectorAll('input');
    for (let element of elements) {
        if (typeof descriprions[element.className] !== "undefined") {
            addDescription(element);
        }
    }
}

function catchPopUp() {
    const popUp = document.querySelector('.window');
    if (popUp) {
        popUp.remove();
    }
}

/**
 * @param row{Object}
 * @returns {[]}
 */
function getElements(row) {
    let rowElements = [];
    for ( let i = 0; i < row.children.length - 1; i++ ) {
        rowElements.push(
            {
                className: row.children[i].className,
                value: row.children[i].textContent
            }
        );
    }
    return rowElements;
}

function listenButtonsWindow(popUp, rowElements) {
    const buttonSave = popUp.querySelector('.save');
    const buttonCancel = popUp.querySelector('.cancel');
    let activePage = document.querySelector("main").querySelector('.active');
    let refreshPage;
    if (activePage.classList.contains('employee')) {
        refreshPage = document.querySelector("main").querySelector('.employee');
    } else
    if (activePage.classList.contains('office')) {
        refreshPage = document.querySelector("main").querySelector('.office');
    }

    buttonCancel.addEventListener('click', function (event) {
        popUp.remove();
    });

    buttonSave.addEventListener('click', function (event) {
        let values = getNewRow(popUp, rowElements);
        values.map((value) => {
            return value
        });
        if (popUp.classList.contains('update')) {
            if (activePage.classList.contains('employee')) {
                const update = updateEmployee(values);
                update.then(() => refreshView(refreshPage));
            } else
            if (activePage.classList.contains('office')) {
                const update = updateOffice(values);
                update.then(() => refreshView(refreshPage));
            }
        } else if (popUp.classList.contains('insert')) {
            values.splice(0, 1);
            let flag = true;
            for (let i = 0; i < values.length; i++) {
                values[i] === '' ? flag = false : null;
            }
            if (flag === true) {
                if (activePage.classList.contains('employee')) {
                    const insert = sendEmployee(values);
                    insert.then(() => refreshView(refreshPage));
                } else if (activePage.classList.contains('office')) {
                    const insert = sendOffice(values);
                    insert.then(() => refreshView(refreshPage));
                }
            }
        }
        popUp.remove();
    });
}

function checkElementsInsert(popUp, rowElements) {
    const newValues = getNewRow(popUp, rowElements);
    for (let i = 1; i < rowElements.length; i ++) {
        const oldValue = rowElements[i].value;
        if (newValues[i]===oldValue) {
            return false;
        }
    }
    return true;
}

function getNewRow(window, rowElements) {
    const newValues = [];
    let messageParams = '';
    for (let i = 0; i < rowElements.length - 1; i ++) {
        const obj = rowElements[i];
        const className = '.' + obj['className'];
        const element = window.querySelector(className);
        if (element.classList.contains('dropdown__area')){
            element.classList.toggle('dropdown__area');
        }
        const classElement = "." + element.className;
        newValues.push(window.querySelector(classElement).value);
        if (window.querySelector(classElement).value === '' &&
        classElement != '.id_office' && classElement != '.id_employee') {
            messageParams += window.querySelector(classElement).placeholder + ', ';
        }
    }
    if (messageParams !== '') {
        messageParams = messageParams.substring(0, messageParams.length-2);
        alert('Не заполнены основные поля: ' + messageParams);
    }
    return newValues;
}

export {windowUpdIns, getElements,getNewRow, checkElementsInsert};
