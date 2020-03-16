import './employee.scss';
import renderTable from '../../modules/render_view/render.pug';
import {
    getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops, sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId, getlaptopFromId
} from '../../modules/requests';
import '../../modules/refreshView';
import {windowUpdIns, getElements,getNewRow} from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";
import renderDivShowMore from "../../modules/render_view/renderDivDeviceMore.pug";
import {listenButtonsDeviceUpdDel} from "../../modules/render_view/renderDivDeviceMore";
import {deleteParamsFromDevice, redactDivAllAboutDevice} from "../device/device";


const getData = () => {
    /**
     * @type {Promise<Object>}
     */
    const responseData = getEmployees();
    responseData.then((data) => {
        renderView({
            headers: [
                {
                    class: 'id_employee',
                    title: 'id'
                },
                {
                    class: 'name',
                    title: 'Имя'
                },
                {
                    class: 'position',
                    title: 'Должность'
                },
                {
                    class: 'phone_number',
                    title: 'Номер телефона'
                },
                {
                    class: 'devices',
                    title: 'Устройства'
                },
                {
                    class: 'buttons',
                    title: ''
                }
            ],
            rows: data
        });
        const paramIdelements = document.querySelectorAll('main .employee .id_employee');
        getDevicesDiv(paramIdelements, 'id_employee').then(() => listenButtons());
    })
};

function getDevicesDiv(paramIdelements, paramSearch) {
    return getlaptops().then((laptops) => {
        laptops.map((laptop) => {
            for (let param of paramIdelements) {
                const id = param.textContent;
                if (laptop[paramSearch] == id) {
                    const row = param.parentElement;
                    const deviceTh = row.querySelector('.devices');
                    const divDevice = document.createElement('div');
                    const newline = "\r\n";
                    divDevice.textContent =laptop['manufacturer'] + ',' + newline + 'Инвернтарный номер:' + laptop['inventory_number'];
                    divDevice.type = 'button';
                    divDevice.classList.add('div-device');
                    divDevice.dataset.value = laptop['id_device'];
                    deviceTh.append(divDevice);
                }
            }
        });
    });
}

/**
 * @param data{Object}
 */
function renderView(data) {
    const tableHTML = renderTable(data);
    const viewArea = document.querySelector('.list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
}

function listenButtons() {
    const buttonsDelete = document.querySelectorAll('main .employee .button__delete');
    for (let button of buttonsDelete){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id = row.querySelector('.id_employee').textContent;
            deleteEmployee(id).then(() => {
                deleteParamsFromDevice('id_employee', id).then(() => {
                    const area = row.parentElement.parentElement.parentElement.parentElement;
                    refreshView(area);
                });
            });
        });
    }

    const buttonsUpdate = document.querySelectorAll('main .employee .button__update');
    for (let button of buttonsUpdate){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            if (!document.querySelector('.update')) {
                windowUpdIns(row,'update');
            } else {
                const window = document.querySelector('.update');
                const prevId = this.parentElement.parentElement.querySelector('.id_employee').textContent;
                const newID = window.querySelector('.id_employee').value;
                window.remove();
                if (newID != prevId){
                    windowUpdIns(row,'update');
                }
            }
        });
    }
    const buttonsDevice = document.querySelectorAll('main .employee .element .div-device');
    for (let button of buttonsDevice) {
        button.addEventListener('click', function (event) {
            const id = this.dataset.value;
            const elements = getlaptopFromId(id);
            elements.then((res) => {
                const divHTML = renderDivShowMore(res);
                const viewArea = document.querySelector("main");
                viewArea.insertAdjacentHTML('beforeend', divHTML);
                redactDivAllAboutDevice();
                listenButtonsDeviceUpdDel();
            }).catch(e => console.error(e));
        });
    }
}

const addButton = document.querySelector('.view .add-employee');
addButton.addEventListener('click', function (event) {
    const row = document.querySelector('.view .header');
    windowUpdIns(row,'insert');
});

document.addEventListener("DOMContentLoaded", getData);

export {getData, getDevicesDiv};
