import {deletelaptops, getlaptopFromId} from "../requests";
import refreshView from "../refreshView";
import renderDivUpdIns from '../updInsWindow/UpdInsDevice.pug';
import listenInputs from "../placeholders";
import {listenUpdInsDeviceArea} from "../updInsWindow/UpdInsDevice";

function listenButtonsDeviceUpdDel() {
    const buttonDelete = document.querySelector('.view-div-more').querySelector('.button__delete');

    buttonDelete.addEventListener('click', function (event) {
        const row = this.parentElement.parentElement;
        const id = row.querySelector('.id_device').textContent;
        const deleteRow = deletelaptops(id);
        deleteRow.then(() => {
            const area = document.querySelector('main .device');
            refreshView(area);
        });
    });

    const buttonUpdate = document.querySelector('.view-div-more').querySelector('.button__update');

    buttonUpdate.addEventListener('click', function (event) {

        const viewAreaAboutDevice = document.querySelector('.view-div-more');
        viewAreaAboutDevice.remove();
        const row = this.parentElement.parentElement;
        const id_str = row.querySelector('.id_device').textContent;
        const elements = getlaptopFromId(id_str);
        elements.then((res) => {
            const divHTML = renderDivUpdIns(res);
            const viewArea = document.querySelector("main");
            viewArea.insertAdjacentHTML('beforeend', divHTML);
            const areaUpdateDevice = document.querySelector('.view-div-updIns');
            listenInputs(areaUpdateDevice);
            listenUpdInsDeviceArea(areaUpdateDevice, 'update');
        }).catch(e => console.error(e));
    });

    const buttonCancel = document.querySelector('.view-div-more').querySelector('.button__cancel');
    buttonCancel.addEventListener('click', function (event) {
        const area = this.parentElement.parentElement.parentElement;
        area.remove();
    });
}

function removeInsUpdDeviceArea() {
    const area = document.querySelector('.view-div-updIns');
    if (area) {
        area.remove();
    }
}

export {listenButtonsDeviceUpdDel, removeInsUpdDeviceArea};
