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
    sendlaptops, updatelaptops
} from "../requests";
import {getNewRow} from "./window";
import refreshView from "../refreshView";

const stats = [
    'на складе',
    'в эксплуатации',
    'в ремонте',
    'списан'
];
const operationSystemsValues = [
    'Windows',
    'MacOS',
    'Linux'
];

function makeDropDown (input, options, opt_hiddenInput) {
    return options()
        .then((variants) => {
            input.classList.add('dropdown__area');
            const dropdown = dropdownHTML(variants);
            input.insertAdjacentHTML('afterend', dropdown);

            if (opt_hiddenInput) {
                const hiddenValue = opt_hiddenInput.value;
                const defaultVariant = variants.find((obj) => obj.id == hiddenValue);
                if (defaultVariant) {
                    input.value = defaultVariant.title;
                    input.dataset.value = defaultVariant.id;
                }
            }
        });
}

function addDescriptionDeviceInputs(viewArea) {
    const descriprions = {
        'manufacturer': 'Производитель:',
        'model': 'Модель:',
        'serial_number': 'Серийный номер:',
        'inventory_number': 'Инвернтарный номер:',
        'date_added': 'Дата поступления(ММ-ДД-ГГГГ): ',
        'write_off_date': 'Дата списания(ММ-ДД-ГГГГ):',
        'description': 'Описание: ',
        'OS': 'Операционная система:',
        'status': 'Статус: ',
        'depreciation_lenght': 'Срок амортизации:',
        'employee-data' : 'Работник: ',
        'office-data' : 'Место:'
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

function listenUpdInsDeviceArea(area, type) {
    addDescriptionDeviceInputs(area);
    const dataInputs = area.querySelectorAll('.date_added, .write_off_date');
    dataInputs.forEach(element => {
        let date = new Date(element.value);
        date = getFormattedDate(date);
        element.value = date;
        element.type = "date";
    });

    makeDropDown(
        area.querySelector('.status'),
        () => Promise.resolve(stats.map((title, index) => ({
            title: title,
            id: title
        })))
    );

    makeDropDown(
        area.querySelector('.OS'),
        () => Promise.resolve(operationSystemsValues.map((title, index) => ({
            title: title,
            id: title
        })))
    );

    const promise1 = getDataForDevice(area, '.employee-data', getEmployees, '.id_employee');
    const promise2 = getDataForDevice(area, '.office-data', getOffice, '.id_office');

    Promise.all([promise1, promise2])
        .then(() => {
            listenDropdownShow(area);
        });

    let inputsNumber = area.querySelector('.inventory_number');
    inputsNumber.setAttribute('maxLength', 10);
    if (type === 'update'){
        inputsNumber.setAttribute('disabled', true);
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
        const addParamsFromDropdown = (classInput, classDropdown) => {
            const inputId = area.querySelector(classInput);
            const dropdown= area.querySelector(classDropdown);
            if (inputId.value === ''|| inputId.value === null || inputId.value != dropdown.dataset.value) {
                inputId.value = dropdown.dataset.value;
            }
        };
        addParamsFromDropdown('.id_employee', '.employee-data');
        addParamsFromDropdown('.id_office', '.office-data');

        const fieldsToSend = [
            'id_employee', 'id_office', 'manufacturer', 'model', 'serial_number', 'inventory_number', 'date_added',
            'write_off_date', 'description', 'OS', 'status', 'depreciation', 'depreciation_lenght'
        ];
        const saveDevice = (saveCallback, additionalFields) => {
            const dataOrder = fieldsToSend.concat(additionalFields);
            const newDataRows = Array.from(area.querySelectorAll('input'))
                .filter(input => Array.from(input.classList).some((className) => dataOrder.includes(className)))
                .sort((a, b) => {
                    const findIndex = (node) => Math.min(...Array.from(node.classList).map((className) => dataOrder.indexOf(className)).filter((index) => index !== -1));
                    const indexA = findIndex(a);
                    const indexB = findIndex(b);
                    return indexA - indexB;
                })
                .map((input) => input.value);
            return saveCallback(newDataRows).then(() => {
                area.remove();
                const areaDevice = document.querySelector('main .device');
                refreshView(areaDevice);
            });
        };

        if (type === 'insert') {
            getlaptopFromSerialNumber()
                .then((serials) => {
                    const inventoryNumber = area.querySelector('.inventory_number').value;
                    if (serials.includes(inventoryNumber)) {
                        alert('Ноутбук с данным инвентарным номером уже существует!');
                        return;
                    }
                    return saveDevice(sendlaptops, []);
                })
                .catch(e => console.error(e));

        } else if (type === 'update') {
            return saveDevice(updatelaptops, ['id_device'])
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
        if (oldValue === '') {
            alert('Не все поля заполнены!' + oldValue);
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

function getDataForDevice(area, classNameElement, query, hiddenInput) {
    const input = area.querySelector(classNameElement);

    return makeDropDown(input, () => {
        return query().then((res) => res.map((data) => ({

                id: Object.values(data)[0],
                title: Object.values(data).slice(1).join(', ')
            })));
    }, (hiddenInput) ? area.querySelector(hiddenInput): null);
}

function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
}

export {listenUpdInsDeviceArea, getDataForDevice, getFormattedDate};
