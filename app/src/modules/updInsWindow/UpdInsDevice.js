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
        'status_date': 'Дата установки статуса: ',
        'depreciation_lenght': 'Срок амортизации (кол-во месяцев):',
        'date_amo': 'Срок амортизации (ММ-ДД-ГГГГ):',
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

function listenUpdInsDeviceArea(area, type, topAlign) {
    area.style = "top:" + topAlign + "px";

    area.querySelector('.employee-data').readonly = true;
    area.querySelector('.office-data').readonly = true;
    area.querySelector('.status').readonly = true;

    addDescriptionDeviceInputs(area);
    const dataInputs = area.querySelectorAll('.date_added, .write_off_date, .status_date, .date_amo');
    dataInputs.forEach(element => {
        let date = new Date(element.value);
        date = getFormattedDate(date);
        element.value = date;
        element.type = "date";
        element.readOnly = true;
    });
    if (type === 'insert') {
        const dateAdd = area.querySelector('.date_added');
        const today = new Date();
        dateAdd.value = today.toISOString().substr(0, 10);
    }
    changeInputsDate(area);

    const deprLength = area.querySelector('.depreciation_lenght');
    let value = deprLength.value;
    value !== '' ? value = parseInt(value, 10) : value = parseInt('36', 10);
    deprLength.type = 'number';
    deprLength.value = value;
    deprLength.onkeypress = function (e) {
        return false;
    };
    deprLength.max = 32767;
    deprLength.min = 1;

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
    let inputsSerialNumber = area.querySelector('.serial_number');
    inputsSerialNumber.setAttribute('maxLength', 100);

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
                if (typeof dropdown.dataset.value == "undefined") {
                    dropdown.dataset.value=null;
                }
                inputId.value = dropdown.dataset.value;
            }
        };
        addParamsFromDropdown('.id_employee', '.employee-data');
        addParamsFromDropdown('.id_office', '.office-data');

        const fieldsToSend = [
            'id_employee', 'id_office', 'manufacturer', 'model', 'serial_number', 'inventory_number', 'date_added',
            'write_off_date', 'date_amo', 'description', 'OS', 'status', 'status_date', 'depreciation', 'depreciation_lenght'
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
            const notNullInputs = area.querySelectorAll('.model, .manufacturer, .inventory_number');
            let messageParams = '';
            notNullInputs.forEach(element => {
                if (element.value === '') {
                    messageParams += element.placeholder + ', ';
                }
            });
            if (messageParams !== '') {
                messageParams = messageParams.substring(0, messageParams.length-2);
                alert('Не заполнены основные поля: ' + messageParams);
            } else {
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
            }
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

    const depreciationLabel = document.createElement("div");
    depreciationLabel.className = 'label';
    if (depreciationElem.value === '0') {
        depreciationLabel.textContent='Амортизирован';
    } else {
        depreciationLabel.textContent='Не амортизирован';
    }
    depreciationDiv.appendChild(depreciationLabel);
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

function changeInputsDate(area) {
    const statusInput = area.querySelector('.status');
    statusInput.readOnly = true;
    const statusValue = statusInput.value;

    const dateAmo = area.querySelector('.date_amo');
    const statusDate = area.querySelector('.status_date');
    const deprLength = area.querySelector('.depreciation_lenght');
    const dateOff = area.querySelector('.write_off_date');
    const dataOffValue = dateOff.value;
    const dateAmoValue = dateAmo.value;

    statusInput.addEventListener('change', function () {

        if (statusInput.value === 'в эксплуатации' && dateAmo.value === '') {
            const colDepr = parseInt(deprLength.value, 10);
            let date = changeMonths(new Date(Date.now()), +parseInt(deprLength.value , 10)).toString();
            dateAmo.value = date;
        } else if (dateAmoValue !== dateAmo.value) {
            dateAmo.value = dateAmoValue;
        }

        if (statusInput.value === 'списан' && dateOff.value === '') {
            const today = new Date();
            dateOff.value = today.toISOString().substr(0, 10);
        } else if (dataOffValue !== dateOff.value) {
            dateOff.value = dataOffValue;
        }

        if (statusValue !== statusInput.value) {
            const today = new Date();
            statusDate.value = today.toISOString().substr(0, 10);
        }

        checkDepreciation(area);
    });

    deprLength.addEventListener('change', function () {
        if (dateAmo.value !== '') {
            let date = changeMonths(new Date(Date.now()), +parseInt(deprLength.value , 10)).toString();
            dateAmo.value = date;
        }

        checkDepreciation(area);
    })
}

function checkDepreciation(area) {
    const amo = area.querySelector('.depreciation');

    const statusInput = area.querySelector('.status');
    const statusValue = statusInput.value;

    const amoLabel = area.querySelector('.depreciation__div .label');
    const dateAmo = area.querySelector('.date_amo').value;



    if (dateAmo !== '') {
        const dateAmoDate = new Date(area.querySelector('.date_amo').value);
        const today = new Date(Date.now());
        if (dateAmoDate < today) {
            amo.value = 0;
            amoLabel.textContent = 'Амортизирован';
        } else  {
            amo.value = 1;
            amoLabel.textContent = 'Не амортизирован';
        }
    } else  {
        amo.value = 0;
        amoLabel.textContent = 'Амортизирован';
    }

    if (statusValue === 'списан') {
        amo.value = 0;
        amoLabel.textContent = 'Амортизирован';
    }
}

function changeMonths(date, months) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + months);

    if (date.getDate() != d) {
        date.setDate(0);
    }
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);

    date = date.getFullYear()+"-"+(month)+"-"+(day) ;
    return date;
}

export {listenUpdInsDeviceArea, getDataForDevice, getFormattedDate, makeDropDown};
