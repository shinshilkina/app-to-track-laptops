const mysql = require('mysql2/promise');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());

const employees = require('./employees');
const offices = require('./offices');
const device = require('./device');

let mysqlConnection = null;
let tryIndex = 0;
const getActiveConnection = async () => {
  tryIndex++;
  if (!mysqlConnection) {
    try {
      mysqlConnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: 3306,
        user: 'asya',
        password: '1234',
        database: 'users'
      });
      tryIndex = 0;
    } catch (e) {
      if (tryIndex > 5) {
        throw e;
      }
      const utf = await addUTF();
      return getActiveConnection();
    }
  }
    return mysqlConnection;
};

  const mysqlQuery = async (query, args) => {
    const connection = await getActiveConnection();
    return connection.execute(query, args);
  };

  const addUTF = async () => {
    await mysqlQuery(
        `SET NAMES utf8;`
    );
  };
  const PORT = 5000;

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  });

  const restAPIerror = async(res, e) => {
    console.error(e);
    res.status(500).send('Server Error2');
  };


  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

async function updateAmo() {
  try {
     await mysqlQuery('UPDATE device SET depreciation = 0 WHERE date_amo < SYSDATE();');
  } catch(e) {
    console.error(e);
  }
  setTimeout(updateAmo, 60 * 1000);
}

updateAmo().then(() => {
  employees(app, mysqlQuery, restAPIerror);
  offices(app, mysqlQuery, restAPIerror);
  device(app, mysqlQuery, restAPIerror);
});
