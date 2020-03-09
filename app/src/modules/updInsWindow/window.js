import './window.scss';
import windowUpdate from "./window.pug";
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee} from '../requests';
import refreshEmployee from "../refreshView";

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
    buttonCancel.addEventListener('click', function (event) {
        popUp.remove();
    });

    buttonSave.addEventListener('click', function (event) {
        const values = getNewRow(popUp, rowElements);
        if (popUp.classList.contains('update')) {
            const update = updateEmployee(values);
            update.then(setTimeout(refreshEmployee,500));
        } else if (popUp.classList.contains('insert')) {
            values.splice(0, 1);
            const verifyValues = checkElementsInsert(popUp, rowElements);
            if (verifyValues) {
                const insert = sendEmployee(values);
                insert.then(setTimeout(refreshEmployee,500));
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
    for (let i = 0; i < rowElements.length; i ++) {
        const element = rowElements[i];
        const classElement = "." + element.className;
        newValues.push(window.querySelector(classElement).value);
    }
    return newValues;
}

export default windowUpdIns;
