import {makeDropDown} from "../updInsWindow/UpdInsDevice";
import {getEmployeeNames} from "../requests";

function getDropdownsInFiltersEmployee() {
    const area = document.querySelector('main .filter-employee__items');
    const nameFilter = area.querySelector('.filter-find-employee-name-input');
    const positionFilter = area.querySelector('.filter-find-employee-position-input');

    getDataForDevice(area, '.filter-find-employee-name-input', getEmployeeNames);
}


export {getDropdownsInFiltersEmployee};
