const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function connect(){
    if (process.env.DATABASE_URL){
        let client = new Client({
            //Production
            connectionString: process.env.DATABASE_URL,
            ssl: {rejectUnauthorized: false}
        });
        client.connect();
        return client;
    } else {
        var login = JSON.parse(fs.readFileSync(path.resolve(__dirname) + '\\log.json'));
        var cs = "postgres://" +  login.username + ":" + login.password +"@localhost:" + login.port + "/" + login.database;
        console.log(cs);
        let client = new Client({
            //Development
            connectionString: cs
        });
        client.connect();
        return client;
    }
}

function runSql(error, operation, callback, sql, parameters = null){
    try {
        let client = connect();

        operation(client, sql, (localError, responseData) => {
            client.end();
            if (localError) {
                throw new Error(localError.message);
            } else {
                callback(responseData);
            }
        });
    } catch (localError) {
        error(localError);
    }
}

function runQuery(client, sql, callback, parameters = null){
    if (parameters){
        client.query(sql, callback, parameters);
    } else {
        client.query(sql, callback); 
    }
}

exports.dataQuery = function query(sql, error, callback, parameters = null){
    runSql(error, runQuery, callback, sql, parameters);
}