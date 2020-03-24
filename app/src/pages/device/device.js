import './device.scss';
import renderDiv from '../../modules/render_view/renderDiv.pug';
import renderDivShowMore from '../../modules/render_view/renderDivDeviceMore.pug';
import {
    getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops, sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId,
    getOfficeFromId, getlaptopFromId, getlaptopTable
} from '../../modules/requests';
import '../../modules/refreshView';
import {windowUpdIns, getElements,getNewRow} from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";
import {listenButtonsDeviceUpdDel, removeInsUpdDeviceArea} from '../../modules/render_view/renderDivDeviceMore';
import renderDivUpdIns from "../../modules/updInsWindow/UpdInsDevice.pug";
import listenInputs from "../../modules/placeholders";
import {listenUpdInsDeviceArea} from "../../modules/updInsWindow/UpdInsDevice";
import {listenFiltersDevice} from "../../modules/filtres/filters_device";
import {getFormattedDate} from '../../modules/updInsWindow/UpdInsDevice';
const stringify = require('csv-stringify');


const getDataDevice = () => {
    /**
     * @type {Promise<Object>}
     */
    const responseData = getlaptops();
    responseData.then((data) => {
        renderViewDevice({
            rows: data
        });
        listenButtonsShowDevice();
    })
};
listenFiltersDevice();
/**
 * @param data{Object}
 */
function renderViewDevice(data) {
    const tableHTML = renderDiv(data);
    const viewArea = document.querySelector('main .device .list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
    correctHtmlDevice(viewArea);
}

function correctHtmlDevice(viewArea) {
    getDates(viewArea);
    getEmployeeName(viewArea);
    getOfficeValue(viewArea);
    addDescriptionDevice(viewArea);
    const status = viewArea.querySelectorAll('.status');
    for (let stat of status) {
        if (!stat.classList.contains('title') && stat.textContent === '') {
            stat.textContent = 'Не указано';
        }
    }
}

function addDescriptionDevice(viewArea) {
    const descriprions = {
        'manufacturer': 'Производитель:',
        'model': 'Модель:',
        'serial_number': 'Серийный номер:',
        'inventory_number': 'Инвернтарный номер:',
        'date_added': 'Дата поступления(ГГГГ-ММ-ДД): ',
        'write_off_date': 'Дата списания(ГГГГ-ММ-ДД):',
        'description': 'Описание: ',
        'OS': 'Операционная система:',
        'status': 'Статус: ',
        'status_date': 'Дата установки статуса: ',
        'depreciation_lenght': 'Срок амортизации (кол-во месяцев):',
        'date_amo': 'Срок амортизации: ',
        'employee-data' : 'Работник: ',
        'office-data' : 'Место:'
    };
    const addDescription = (element) => {
        const className = element.className;
        const descr = document.createElement('div');
        descr.textContent = descriprions[className];
        descr.classList.add(className, 'title');
        const parentDiv = element.parentNode;
        parentDiv.insertBefore(descr, element);
    };
    const elements = viewArea.querySelectorAll('.element div');
    for (let element of elements) {
        if (typeof descriprions[element.className] !== "undefined") {
            addDescription(element);
        }
    }
}

function listenButtonsShowDevice() {
    const buttonsShowDevice = document.querySelectorAll('main .device .button__more');
    for (let button of buttonsShowDevice){
        button.addEventListener('click', function (event) {
            const viewAreaDevice = document.querySelector('.view-div-more');
            if (viewAreaDevice) {
                viewAreaDevice.remove();
            }
            const row = this.parentElement.parentElement;
            const id_str = row.querySelector('.id_device').textContent;
            const elements = getlaptopFromId(id_str);
            elements.then((res) => {
                const divHTML = renderDivShowMore(res);
                const viewArea = document.querySelector("main");
                viewArea.insertAdjacentHTML('beforeend', divHTML);
                redactDivAllAboutDevice(button);
                listenButtonsDeviceUpdDel();

                const initArea = button.parentElement.parentElement;
                const areaInitParams = initArea.getBoundingClientRect();
                const offsettop = window.scrollY;
                const top = parseInt((areaInitParams.top + offsettop), 10) ;
                document.querySelector('.view-div-more').style = "top:" + top + "px";
            }).catch(e => console.error(e));
        });
    }
}

function redactDivAllAboutDevice(button) {
    const viewDivDevice = document.querySelector('.view-div-more');



    getEmployeeName(viewDivDevice);
    getOfficeValue(viewDivDevice);
    getDates(viewDivDevice);
    addDescriptionDevice(viewDivDevice);
    const status = viewDivDevice.querySelectorAll('.status');
    for (let stat of status) {
        if (!stat.classList.contains('title') && stat.textContent === '') {
            stat.textContent = 'Не указано';
        }
    }
    const depreciation = viewDivDevice.querySelector('.depreciation');
    if (depreciation.textContent === '1') {
        depreciation.textContent = 'Не амортизирован';
    } else depreciation.textContent = 'Амортизирован';
}

const parent = document.querySelector("main").querySelector('.device');
const addButton = parent.querySelector(' .add-device');
addButton.addEventListener('click', function (event) {
    removeInsUpdDeviceArea();
    const data = [
        {
            id_device: "",
            id_employee: "",
            id_office: "",
            manufacturer: "",
            model: "",
            serial_number: "",
            inventory_number: "",
            date_added: "",
            write_off_date: "",
            status: "",
            status_date: "",
            depreciation: "0",
            depreciation_lenght: "",
            date_amo: "",
            description: "",
            OS: ""
        }
    ];

    const divHTML = renderDivUpdIns(data);
    const viewArea = document.querySelector("main");
    viewArea.insertAdjacentHTML('beforeend', divHTML);
    const areaInsertDevice = document.querySelector('.view-div-updIns');
    listenInputs(areaInsertDevice);
    listenUpdInsDeviceArea(areaInsertDevice, 'insert');
});

document.addEventListener("DOMContentLoaded", getDataDevice);

function getDates(viewArea) {
    const dataInputs = viewArea.querySelectorAll('.date_added, .write_off_date, .status_date, .date_amo');
    dataInputs.forEach(element => {
        if (element.textContent !== "") {
            let date = new Date(element.textContent);
            date = getFormattedDate(date);
            element.textContent = date;
        }
        else {
            element.textContent = 'Не указано';
        }
    });
}

function getEmployeeName(viewArea) {
    const employeeId = viewArea.querySelectorAll('.id_employee');
    for (let id of employeeId) {
        getEmployeeFromId(id.textContent).then((data) => {
            if (data.length !== 0) {
                let textContent = [];
                for (let i = 0; i < data.length; i++) {
                    for (let key in data[i]) {
                        textContent.push(data[i][key]);
                    }
                }
                textContent.splice(0, 1);
                textContent.splice(2, 1);
                textContent[1].toString().toLowerCase(textContent[1].toString());
                textContent.join('');
                const employeeArea = id.parentElement.querySelectorAll('.employee-data');
                for (let elem of employeeArea) {
                    if (!elem.classList.contains('title')){
                        elem.textContent = textContent;
                    }
                }
            }

        }).catch(e => console.error(e));
    }
}

function getOfficeValue(viewArea) {
    const officeId = viewArea.querySelectorAll('.id_office');
    for (let id of officeId) {
        getOfficeFromId(id.textContent).then((data) => {
            if (data.length !== 0) {
                let textContent = [];
                for (let i = 0; i < data.length; i++) {
                    for (let key in data[i]) {
                        textContent.push(data[i][key]);
                    }
                }
                textContent.splice(0, 1);
                textContent.join('');
                const officeArea = id.parentElement.querySelectorAll('.office-data');
                const newLine = '\r';
                for (let elem of officeArea) {
                    if (!elem.classList.contains('title')){
                        elem.textContent = textContent.map((elem) => {
                            return newLine + elem;
                        });
                    }
                }
            }

        }).catch(e => console.error(e));
    }

}

function deleteParamsFromDevice(paramName, paramValue) {
    return getlaptops().then((laptops) => {
        laptops.map((laptop) => {
            if (laptop[paramName] == paramValue) {
                laptop[paramName]= '';
                const valuesForRequestUpdate = Object.values(laptop);
                valuesForRequestUpdate[14] = valuesForRequestUpdate[0];
                valuesForRequestUpdate.shift();
                updatelaptops(valuesForRequestUpdate).then((res) => {
                    return res;
                });
            }
        });
    });
}

const printButton = document.querySelector('.save-as-table');
printButton.addEventListener('click', function (event) {
    getlaptopTable();
});


export {getDataDevice, listenButtonsDeviceUpdDel, redactDivAllAboutDevice, deleteParamsFromDevice, addDescriptionDevice};