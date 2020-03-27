import './header.scss';
import refreshView from "../../modules/refreshView";

const buttons = document.querySelectorAll('.header .button');

for (let button of buttons){
    button.addEventListener('click', function (event) {
        const newActivePageClass = this.parentElement.className;
        const prevActivePage = document.querySelector('.active');
        const employeeArea = document.querySelector('main .employee');
        const deviceArea = document.querySelector('main .device');
        const officeArea = document.querySelector('main .office');
        const FAQArea = document.querySelector('main .FAQ');
        const windowsInsertUpdate = document.querySelectorAll('main .window');
        for (let wind of windowsInsertUpdate) {
            wind.remove();
        }
        const windShowMoreAboutDevice = document.querySelector('main .view-div-more');
        windShowMoreAboutDevice ? windShowMoreAboutDevice.remove() : null;

        prevActivePage.classList.toggle('active');
        prevActivePage.classList.toggle('invisible');
        if (newActivePageClass==='employees') {
            employeeArea.classList.toggle('active');
            employeeArea.classList.toggle('invisible');
            refreshView(employeeArea);
        } else if (newActivePageClass==='device') {
            deviceArea.classList.toggle('active');
            deviceArea.classList.toggle('invisible');
            refreshView(deviceArea);
        } else if (newActivePageClass==='office') {
            officeArea.classList.toggle('active');
            officeArea.classList.toggle('invisible');
            refreshView(officeArea);
        }else if (newActivePageClass==='FAQ') {
            FAQArea.classList.toggle('active');
            FAQArea.classList.toggle('invisible');
        }
    });
}
