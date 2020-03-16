import './offices.scss';
import renderTable from '../../modules/render_view/render.pug';
import {
    getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops, sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId, getlaptopFromId
} from '../../modules/requests';
import '../../modules/refreshView';
import {windowUpdIns, getElements,getNewRow} from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";
import {getDevicesDiv} from "../employee/employee";
import renderDivShowMore from "../../modules/render_view/renderDivDeviceMore.pug";
import {listenButtonsDeviceUpdDel, redactDivAllAboutDevice} from "../device/device";


const getDataOffice = () => {
    /**
     * @type {Promise<Object>}
     */
    const responseData = getOffice();
    responseData.then((data) => {
        renderViewOffice({
            headers: [
                {
                    class: 'id_office',
                    title: 'id'
                },
                {
                    class: 'office',
                    title: 'Кабинет'
                },
                {
                    class: 'housing',
                    title: 'Корпус'
                },
                {
                    class: 'type',
                    title: 'Тип кабинета'
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
        const paramIdelements = document.querySelectorAll('main .office .id_office');
        getDevicesDiv(paramIdelements, 'id_office').then(() => listenButtonsOffice());
    })
};

/**
 * @param data{Object}
 */
function renderViewOffice(data) {
    const tableHTML = renderTable(data);
    const viewArea = document.querySelector("main").querySelector('.office').querySelector('.list');
    viewArea.insertAdjacentHTML('beforeend', tableHTML);
}

function listenButtonsOffice() {
    const buttonsDeleteOffice = document.querySelector("main").querySelector('.office').querySelectorAll('.button__delete');
    for (let button of buttonsDeleteOffice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            const id = row.querySelector('.id_office').textContent;
            const deleteRow = deleteOffice(id);
            const area = row.parentElement.parentElement.parentElement.parentElement;
            deleteRow.then(setTimeout(refreshView,500, area));
        });
    }

    const buttonsUpdateOffice = document.querySelector("main").querySelector('.office').querySelectorAll('.button__update');

    for (let button of buttonsUpdateOffice){
        button.addEventListener('click', function (event) {
            const row = this.parentElement.parentElement;
            if (!document.querySelector('.update')) {
                windowUpdIns(row,'update');
            } else {
                const popUp = document.querySelector('.update');
                const prevId = this.parentElement.parentElement.querySelector('.id_office').textContent;
                const newID = popUp.querySelector('.id_office').value;
                popUp.remove();
                if (newID != prevId){
                    windowUpdIns(row,'update');
                }
            }
        });
    }
    const buttonsDevice = document.querySelectorAll('main .office .element .div-device');
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

const parent = document.querySelector("main").querySelector('.office');
    const addButton = parent.querySelector(' .add-office');
addButton.addEventListener('click', function (event) {
    const row = document.querySelector("main").querySelector('.office').querySelector('.header');
    windowUpdIns(row,'insert');
});

document.addEventListener("DOMContentLoaded", getDataOffice);

export default getDataOffice;