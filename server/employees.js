module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/employees/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM employees ORDER BY id_employee;'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.get('/employees/list/name', async (req, res) => {
        try{
            const [rows] = await mysqlQuery(
                'SELECT name FROM employees;'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.get('/employees/list/position', async (req, res) => {
        try{
            const [rows] = await mysqlQuery(
                'SELECT position FROM employees;'
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.post('/employees/list/find_id', async (req, res) => {
        const {name, position, phone_number} = req.body;
        try{
            const [rows, fields] = await mysqlQuery(
                `SELECT id_employee FROM employees WHERE name = ? and position = ? and
                    phone_number = ?;`,
                [name, position, phone_number]
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.post('/employees/list/id', async (req, res) => {
        const {id_employee} = req.body;
        try{
            const [rows, fields] = await mysqlQuery(
                `SELECT * FROM employees WHERE id_employee = ?;`,
                [id_employee]
            );
            res.status(200).send(rows);
        } catch (e) {
            restAPIerror(res, e);
        }
    });
    app.post('/employees/add', async (req, res) => {
        const {name, position, phone_number} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO employees(name, position, phone_number) VALUES (?, ?, ?);`,
                [name, position, phone_number]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/employees/delete', async (req, res) => {
        const {id_employee} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM employees WHERE id_employee = ?;`,
                [id_employee]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/employees/update', async (req, res) => {
        const {name, position, phone_number, id_employee} = req.body;
        try {
            await mysqlQuery(
                `UPDATE employees SET name = ?, 
                    position = ?, phone_number = ? 
                    WHERE id_employee = ?;`,
                [name, position, phone_number, id_employee]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res,e);
        }
    });
};