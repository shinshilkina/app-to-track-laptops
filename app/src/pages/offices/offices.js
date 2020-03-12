import './offices.scss';
import renderTable from '../../modules/render_view/render.pug';
import {getEmployees, deleteEmployee, updateEmployee, sendEmployee,
    getlaptops, deletelaptops, updatelaptops,sendlaptops,
    getOffice, deleteOffice, updateOffice, sendOffice, getEmployeeFromId} from '../../modules/requests';
import '../../modules/refreshView';
import {windowUpdIns, getElements,getNewRow} from '../../modules/updInsWindow/window.js';
import refreshView from "../../modules/refreshView";


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
                    class: 'buttons',
                    title: ''
                }
            ],
            rows: data
        });
        listenButtonsOffice();
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
}

const parent = document.querySelector("main").querySelector('.office');
    const addButton = parent.querySelector(' .add-office');
addButton.addEventListener('click', function (event) {
    const row = document.querySelector("main").querySelector('.office').querySelector('.header');
    windowUpdIns(row,'insert');
});

document.addEventListener("DOMContentLoaded", getDataOffice);

export default getDataOffice;