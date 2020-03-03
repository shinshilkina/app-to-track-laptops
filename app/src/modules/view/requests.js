module.exports = () => {

    const buttonsLogin = document.querySelectorAll('.button__login');


    for (let button of buttonsLogin) {
        button.addEventListener('click', function (event) {
            const id_employee = this.parentElement.querySelector('.id_employee');
            console.log(id_employee);
        });
    }
};
