import './device.scss';
import renderDiv from '../../modules/render_view/renderDiv.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId} from '../../modules/requests';
import '../../modules/refreshView';
import windowUpdIns from '../../modules/updInsWindow/window.js';
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
        listenButtonsDevice();
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
    getEmployeeName(viewArea)
}

function listenButtonsDevice() {
    const buttonsDeleteDevice = document.querySelector("main").querySelector('.device').querySelectorAll('.button__delete');
    for (let button of buttonsDeleteDevice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id = row.querySelector('.id_device').textContent;
            const deleteRow = deletelaptops(id);
            const area = row.parentElement.parentElement.parentElement.parentElement;
            deleteRow.then(setTimeout(refreshView,500, area));
        });
    }

    const buttonsUpdateDevice = document.querySelector("main").querySelector('.device').querySelectorAll('.button__update');

    for (let button of buttonsUpdateDevice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            if (!document.querySelector('.update')) {
                windowUpdIns(row,'update');
            } else {
                const popUp = document.querySelector('.update');
                const prevId = this.parentElement.parentElement.querySelector('.id_device').textContent;
                const newID = popUp.querySelector('.id_device').value;
                popUp.remove();
                if (newID != prevId){
                    windowUpdIns(row,'update');
                }
            }
        });
    }
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
    const request = getEmployeeFromId(employeeId);
    request.then(employeeArea.textContent = request).catch(e => console.error(e));
}

export default getDataDevice;