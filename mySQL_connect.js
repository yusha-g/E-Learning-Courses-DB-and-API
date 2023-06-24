const mysql = require('mysql')

const dotenv = require("dotenv") //loads environment variables from .env file
dotenv.config()

/* NOTE!!
 * REMEMBER TO CREATE YOUR OWN .env FILE BEFORE RUNNING THIS SCRIPT!
 * things to add in the .env file ->    DB_HOST ('localhost'), 
 *                                      DB_USERNAME, 
 *                                      DB_PASSWORD, 
 *                                      DB (database name),
 *                                      DB_SOCKETPATH (/Applications/MAMP/tmp/mysql/mysql.sock for MAC) 
 */
function connect_DB(){
    let db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        socketPath: process.env.DB_SOCKETPATH
    })

    db.connect((err)=>{
        if(err)
            console.log("Error connecting to DataBase! "+err);
        else
            console.log("=============Successfully Connected to DataBase!=============")
    })
    return db;
}


function disconnect_DB(db){ 
    db.end((err)=>{
        if(err){
            console.log("ERROR DISCONNECTING FROM DATABASE! "+err);
            return err;
        }
        else{
            console.log("=============Successfully Disconected!=============")
        }
    })
}

module.exports = {
    connect_DB,
    disconnect_DB
}