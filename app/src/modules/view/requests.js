const doWork = () => {

    const buttonsLogin = document.querySelectorAll('.button__login');
    console.log('hello');

    for (let button of buttonsLogin) {
        button.addEventListener('click', function (event) {
            const id_employee = this.parentElement.querySelector('.id_employee');
            console.log(id_employee);
        });
    }
}; export default doWork;
