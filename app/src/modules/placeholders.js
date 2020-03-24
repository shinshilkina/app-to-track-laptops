const device = ['Номер устройства', 'Номер работника', 'Номер кабинета', 'Производитель',
    'Модель', 'Серийный номер', 'Инвентарный номер', 'Дата поступления', 'Дата списания',
    'Статус', 'Дата установки статуса',  'Дата амортизации', 'Амортизация',  'Срок амортизации',
    'Описание', 'Операционная система', 'Данные о работнике',  'Данные о месте'];


function listenInputs (area) {
    const inputs = area.querySelectorAll('input');
    if (area.classList.contains('device')){
        for (let i = 0; i < inputs.length ; i++) {
            inputs[i].placeholder = device[i];
        }
    }
}

export default listenInputs;
