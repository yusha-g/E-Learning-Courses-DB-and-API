import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();
/*
 * Remember to setup your own .env file
 */
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    socketPath: process.env.DB_SOCKETPATH
}).promise();

export async function viewCourses(){
    const Q = `
    SELECT * FROM Courses;   
    ;`;
    const [courses] = await db.query(Q);
    return courses;
}

export async function updateCourse(id){
    const Q=``;
}