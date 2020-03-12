import './window.scss';
import windowUpdate from "./window.pug";
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
    const popUp = windowUpdate(rowElements);
    area.insertAdjacentHTML('beforeend', popUp);
    const popUpR = document.querySelector('.window');
    popUpR.classList.add(type);
    const title = popUpR.querySelector('.title');
    if (type === 'update') {
        title.textContent = 'Изменить';
    } else if (type === 'insert') {
        title.textContent = 'Добаваить';
    }

    listenButtonsWindow(popUpR, rowElements);
};

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
    const activePage = document.querySelector("main").querySelector('.active');
    buttonCancel.addEventListener('click', function (event) {
        popUp.remove();
    });

    buttonSave.addEventListener('click', function (event) {
        const values = getNewRow(popUp, rowElements);
        if (popUp.classList.contains('update')) {
            if (activePage.classList.contains('employee')) {
                const update = updateEmployee(values);
                update.then(setTimeout(refreshView,500, activePage));
            } else
            if (activePage.classList.contains('office')) {
                const update = updateOffice(values);
                update.then(setTimeout(refreshView,500, activePage));
            } else
            if (activePage.classList.contains('device')) {
                const update = updatelaptops(values);
                update.then(setTimeout(refreshView,500, activePage));
            }
        } else if (popUp.classList.contains('insert')) {
            debugger
            values.splice(0, 1);
            const verifyValues = checkElementsInsert(popUp, rowElements);
            if (verifyValues) {
                if (activePage.classList.contains('employee')) {
                    const insert = sendEmployee(values);
                    insert.then(setTimeout(refreshView,500));
                } else if (activePage.classList.contains('office')) {
                    const insert = sendOffice(values);
                    insert.then(setTimeout(refreshView,500));
                }else if (activePage.classList.contains('office')) {
                    const insert = sendlaptops(values);
                    insert.then(setTimeout(refreshView,500));
                }
            }
        }
        popUp.remove();
    });
}

function checkElementsInsert(popUp, rowElements) {
    debugger
    const newValues = getNewRow(popUp, rowElements);
    let startIndex;
    if (rowElements[0].className==='id_device') {
        startIndex = 3;
    } else {
        startIndex= 1;
    }
    for (let i = startIndex; i < rowElements.length; i ++) {
        const oldValue = rowElements[i].value;
        if (newValues[i]===oldValue) {
            return false;
        }
    }
    return true;
}

function getNewRow(window, rowElements) {
    const newValues = [];
    for (let i = 0; i < rowElements.length; i ++) {
        const element = rowElements[i];
        const classElement = "." + element.className;
        newValues.push(window.querySelector(classElement).value);
    }
    return newValues;
}

export {windowUpdIns, getElements,getNewRow};
