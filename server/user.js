module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/user/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM user'
            );
            res.status(200).send({
                rows
            });
        } catch (e) {
            restAPIerror(res, e);
        }
    });


    app.post('/user/add', async (req, res) => {
        const {id_employee, login, password} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO user(id_employee, login, password) VALUES (?, ?, ?);`,
                [id_employee, login, password]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/user/delete', async (req, res) => {
        const {id} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM user WHERE id_user = ?;`,
                [id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/user/update', async (req, res) => {
        const {id_employee, login, password, id} = req.body;
        try {
            await mysqlQuery(
                `UPDATE user SET id_employee = ?, 
                    login = ?, password = ? 
                    WHERE id_user = ?;`,
                [id_employee, login, password, id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res,e);
        }
    });
};