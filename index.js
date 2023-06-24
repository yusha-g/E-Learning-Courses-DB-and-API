//Required dependencies
const mysql = require('mysql')

const express = require('express')
const app = express() //setup server
app.listen(8000,()=>{ //run app on port 8000
    console.log("Server Started!")
})    

const dotenv = require("dotenv") //loads environment variables from .env file
dotenv.config()

function mysql_connect(){   //establish mysql connection
    const db = mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "Work_DB",
        socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
    })
    db.connect((err)=>{
        if(err){
            console.log("ERROR CONNECTING TO DATABASE! \n"+err)
        }
        else{
            console.log("Successfully connected to DataBase!")
        }
        return err;
    })
}



/*
==================
|                |
| Express Routes |
|                |
==================
*/

app.get('/', (req, res)=>{
    console.log("Hello")
    res.send("Hi")
});

app.get('/courses', (req, res)=>{
    var err = mysql_connect();
    res.send(err)
    /*
    const name = req.query.name;
    console.log(name)
    res.send({
        'name':name
    });*/
});

