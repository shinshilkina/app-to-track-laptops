module.exports = (app, mysqlQuery, restAPIerror) => {
    app.get('/requests/list', async (req, res) => {
        try{
            const [rows, fields] = await mysqlQuery(
                'SELECT * FROM requests'
            );
            res.status(200).send({
                rows
            });
        } catch (e) {
            restAPIerror(res, e);
        }
    });

    app.post('/requests/add', async (req, res) => {
        const {id_user, id_device, date, description} = req.body;
        try {
            await mysqlQuery(
                `INSERT INTO requests(id_user, id_device, date, description) VALUES (?, ?, ?, ?);`,
                [id_user, id_device, date, description]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/requests/delete', async (req, res) => {
        const {id} = req.body;
        try{
            await mysqlQuery(
                `DELETE FROM requests WHERE id_request = ?;`,
                [id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res, e);
        }
    });
    app.post('/requests/update', async (req, res) => {
        const {id_user, id_device, date, description, id} = req.body;
        try {
            await mysqlQuery(
                `UPDATE requests SET ofid_userfice = ?, 
                    id_device = ?, date = ?, description = ?
                    WHERE id_request = ?;`,
                [id_user, id_device, date, description, id]
            );
            res.status(200).send({
                success: true
            });
        }catch (e){
            restAPIerror(res,e);
        }
    });
};