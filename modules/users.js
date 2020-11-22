const bcrypt = require('bcrypt');
const database = require('./../modules/database');

function doesUserExist(username, onError, onSuccess){
    database.dataQuery('SELECT (username) FROM accounts WHERE username = ?', onError,
        (data) => {
            return onSuccess((data.rows > 0))
        });
}

exports.userExists = doesUserExist;

exports.createUser = function (username, password, onError, onSuccess){
    if (username && password){
        doesUserExist(username, onError, (exists) => {
            if (exists){
                onError("Username already exists!")
            } else {
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(password, salt, (error, hash) => {
                        const query = {
                            text: "INSERT INTO users(name, pass) VALUES($n, $p)",
                            values: [username, hash]
                        };

                        database.dataQuery(query, onErrorLocal, onSuccessLocal)

                        function onErrorLocal(data){
                            onError(data);
                        }

                        function onSuccessLocal(data){
                            console.log("Created user: " + username);
                            onSuccess(data);
                        }
                    })
                })
            }
        })
    }
}

exports.loginUser = function (username, password, onError, onSuccess){

}