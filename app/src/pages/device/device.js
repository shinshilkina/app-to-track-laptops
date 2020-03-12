import './device.scss';
import renderDiv from '../../modules/render_view/renderDiv.pug';
import renderDivShowMore from '../../modules/render_view/renderDivDeviceMore.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId,
    getOfficeFromId, getlaptopFromId} from '../../modules/requests';
import '../../modules/refreshView';
import {windowUpdIns, getElements,getNewRow} from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";


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

/**
 * @param data{Object}
 */
function renderViewDevice(data) {
    const tableHTML = renderDiv(data);
    const viewArea = document.querySelector("main").querySelector('.device').querySelector('.list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
    correctHtmlDevice(viewArea);
}

function correctHtmlDevice(viewArea) {
    const dates = getDates(viewArea); //array
    getEmployeeName(viewArea);
    getOfficeValue(viewArea);
}

function listenButtonsShowDevice() {
    const buttonsShowDevice = document.querySelector("main").querySelector('.device').querySelectorAll('.button__more');
    for (let button of buttonsShowDevice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id_str = row.querySelector('.id_device').textContent;
            const elements = getlaptopFromId(id_str);
            elements.then((res) => {
                console.log(res);
                const divHTML = renderDivShowMore(res);
                const viewArea = document.querySelector("main");
                viewArea.insertAdjacentHTML('beforeend', divHTML);
                redactDivAllAboutDevice();
            }).catch(e => console.error(e));
        });
    }
}

function redactDivAllAboutDevice() {
    const viewDivDevice = document.querySelector('.view-div-more');
    getEmployeeName(viewDivDevice);
    getOfficeValue(viewDivDevice);
    getDates(viewDivDevice);
}

const parent = document.querySelector("main").querySelector('.device');
const addButton = parent.querySelector(' .add-device');
addButton.addEventListener('click', function (event) {
    const row = document.querySelector("main").querySelector('.device').querySelector('.header');
    windowUpdIns(row,'insert device');
});

document.addEventListener("DOMContentLoaded", getDataDevice);

function getDates(viewArea) {
    const dateAddedEl = viewArea.querySelector('.date_added');
    const dateOffEl = viewArea.querySelector('.write_off_date');
    let dateAddedStr = dateAddedEl.textContent.substr(0,10).split("-");
    let dateOffStr = dateOffEl.textContent.substr(0,10).split("-");
    const dateAdd = new Date(parseInt(dateAddedStr[0], 10), parseInt(dateAddedStr[1], 10),
        parseInt(dateAddedStr[2], 10));
    const dateOff = new Date(parseInt(dateOffStr[0], 10), parseInt(dateOffStr[1], 10),
        parseInt(dateOffStr[2], 10));
    dateAddedEl.textContent = 'Дата поступления: ' +dateAdd.getDate()  +'.'
        + dateAdd.getMonth() +'.'+ dateAdd.getFullYear();
    dateOffEl.textContent = 'Дата списания: ' +dateOff.getDate()  +'.'
        + dateOff.getMonth() +'.'+ dateOff.getFullYear();
    return [dateAdd, dateOff];
}

function getEmployeeName(viewArea) {
    const employeeArea = viewArea.querySelector('.employee-data');
    const employeeId = viewArea.querySelector('.id_employee').textContent;
    let request = getEmployeeFromId(employeeId);
    request.then((data) => {
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
        employeeArea.textContent = textContent;
    }).catch(e => console.error(e));
}
function foo() {

}

function getOfficeValue(viewArea) {
    const officeArea = viewArea.querySelector('.office-data');
    const officeId = viewArea.querySelector('.id_office').textContent;
    const request = getOfficeFromId(officeId);
    request.then((data) => {
        let textContent = [];
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                textContent.push(data[i][key]);
            }
        }
        textContent.splice(0, 1);
        textContent.join('');
        officeArea.textContent = 'Место: ' + textContent;
    }).catch(e => console.error(e));
}

export default getDataDevice;