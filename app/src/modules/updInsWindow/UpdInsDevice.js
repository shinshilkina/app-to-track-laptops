import './UpdInsDevice.scss';
import renderDivUpdIns from "./UpdInsDevice.pug";
import dropdownHTML from "../dropdown/dropdown.pug";
import listenDropdownShow from "../dropdown/dropdown";
import {
    getEmployees,
    getOffice,
    getlaptopFromSerialNumber,
    getEmployeeFindId,
    getOfficeFindId,
    sendlaptops
} from "../requests";
import {getNewRow} from "./window";
import refreshView from "../refreshView";

const stats = {
   0: 'на складе',
   1: 'в эксплуатации',
   2: 'в ремонте',
   3: 'списан'
};
const operationSystemsValues = {
  0: 'Windows',
  1: 'MacOS',
  2: 'Linux'
};

function listenUpdInsDeviceArea(area, type) {
    const dataInputs = area.querySelectorAll('.date_added, .write_off_date');
    dataInputs.forEach(element => {
        let date = new Date(element.value);
        date = getFormattedDate(date);
        element.value = date;
        element.type = "date";
    });

    const statusInput = area.querySelector('.status');
    renderDropdown(stats, statusInput);

    const operationSystems = area.querySelector('.OS');
    renderDropdown(operationSystemsValues, operationSystems);

    const promise1 = getDataForDevice(area, '.employee-data', getEmployees());
    const promise2 = getDataForDevice(area, '.office-data', getOffice());

    Promise.all([promise1, promise2])
        .then(() => listenDropdownShow(area));

    let inputsNumber = area.querySelectorAll('.serial_number, .inventory_number');
    for (let input of inputsNumber) {
        input.setAttribute('maxLength', 10);
        if (type === 'update'){
            input.setAttribute('disabled', true);
        }
    }

    const depreciationElem = area.querySelector('.depreciation');
    depreciationRender(area, depreciationElem);
    const buttonCancel = area.querySelector('.cancel');
    buttonCancel.addEventListener('click', function (event) {
        area.remove();
    });

    saveChanges(area, type);
}

function saveChanges(area, type) {
    const buttonSave = area.querySelector('.save');
    buttonSave.addEventListener('click', function (event) {
        if (type==='insert') {
            let result = true;
            result = checkInputsNotNull(area);

            const dropdownEmployee = area.querySelector('.employee-data');
            const InputIdEmployee = area.querySelector('.id_employee');
            let writeIdEmployee;
            if (dropdownEmployee.value){
                writeIdEmployee = writeIdInInput(area, dropdownEmployee, InputIdEmployee, 'employee');
            }

            const dropdownOffice = area.querySelector('.office-data');
            const InputIdOffice = area.querySelector('.id_office');
            let writeIdOffice;
            if (dropdownOffice.value){
                writeIdOffice = writeIdInInput(area, dropdownOffice, InputIdOffice, 'office');
            }
            let newDataRows;
            Promise.all([writeIdEmployee, writeIdOffice])
                .then(() => {
                    const inventoryNumbers = getlaptopFromSerialNumber();
                    inventoryNumbers
                        .then((res) => {
                            const inventoryNumber = area.querySelector('.inventory_number').value;
                            for (let i = 0; i < res.length; i++){
                                const ObjEntries = Object.values(res[i]);
                                ObjEntries.map((elem) => {
                                    if ( elem === inventoryNumber) {
                                        alert('Ноутбук с данным инвентарным номером уже существует!');
                                        result = false;
                                    }
                                });
                            }
                            if (result === true) {
                                newDataRows.shift();
                                newDataRows.splice(15, 2);
                                const addDeviceRequest = sendlaptops(newDataRows);
                                addDeviceRequest.then(() => {
                                    area.remove();
                                    setTimeout(refreshView,500);
                                }).catch(e => console.error(e));
                            }

                        })
                        .catch(e => console.error(e));
                });

        }
    });
}

/**
 *
 * @param area
 * @param dropdown
 * @param inputId
 * @param typeQuery
 * @returns {Promise<* | void>}
 */
function writeIdInInput(area, dropdown, inputId, typeQuery) {
    let data = [];
    data = dropdown.value.split(',');
    let query;
    if (typeQuery==='employee'){
        query = getEmployeeFindId(data);
        return query
            .then((res) => {
                inputId.value = Object.values(res[0]);
            })
            .catch(e => console.error(e));
    } else if (typeQuery === 'office'){
        query = getOfficeFindId(data);
        return query
            .then((res) => {
                inputId.value = Object.values(res[0]);
            })
            .catch(e => console.error(e));
    }
}

function checkInputsNotNull(area) {
    const rowElements = area.querySelectorAll("input");
    for (let i = 3; i < rowElements.length; i ++) {
        const oldValue = rowElements[i].value;
        if (!oldValue) {
            alert('Не все поля заполнены!');
            return false;
        }
    }
    return true;
}

function depreciationRender(area, depreciationElem) {
    const depreciationDiv = document.createElement("div");
    depreciationDiv.className = 'depreciation__div';
    depreciationElem.after(depreciationDiv);

    const depreciationCheckbox = document.createElement("input");
    depreciationCheckbox.className = 'checkbox';
    depreciationCheckbox.type='checkbox';
    if (depreciationElem.value === '1') {
        depreciationCheckbox.setAttribute('checked', true);
    }
    depreciationDiv.appendChild(depreciationCheckbox);

    const depreciationLabel = document.createElement("div");
    depreciationLabel.className = 'label';
    if (depreciationElem.value === '1') {
        depreciationLabel.textContent='Амортизирован';
    } else {
        depreciationLabel.textContent='Не амортизирован';
    }
    depreciationDiv.appendChild(depreciationLabel);

    listenDepreciation(area, depreciationElem);
}

function listenDepreciation(area, depreciationElem) {
    const depreciationDiv = area.querySelector(".depreciation__div");
    const depreciationCheckbox = depreciationDiv.querySelector(".checkbox");
    const depreciationLabel = depreciationDiv.querySelector(".label");
    depreciationCheckbox.addEventListener('change', function() {
        if(this.checked) {
            depreciationLabel.textContent = 'Амортизирован';
            depreciationElem.value = '1';
            return true;
        } else {
            depreciationLabel.textContent='Не амортизирован';
            depreciationElem.value =  '0';
            return false;
        }
    });
}

function renderDropdown(elements, input) {
    input.classList.add('dropdown__area');
    const dropdown = dropdownHTML(elements);
    input.insertAdjacentHTML('afterend', dropdown);
}

function getDataForDevice(area, classNameElement, query) {
    const input = area.querySelector(classNameElement);
    const queryPromise= query;
    let values = {};
    return queryPromise.then((res) => {
        for (let i = 0; i < res.length; i++){
            let ObjEntries = Object.values(res[i]);
            ObjEntries.shift();
            values[i] = ObjEntries;
        }
        renderDropdown(values, input);
    }).catch(e => console.error(e));
}

function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
}

export default listenUpdInsDeviceArea;
