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

//LISTENING FOR ERRORS
db.on('error', function(err) {
    console.log("COULDN'T CONNECT TO DATABASE:\n", err);
});
    

export async function viewCourses(){
    const Q = `
    SELECT * FROM Courses;   
    ;`;
    const [courses] = await db.query(Q);
    return courses;
}

export async function addCourse(courseObj){
    const Q = `
    INSERT INTO Courses (course_name, instructor_id, max_seat, free_seats, start_date) VALUES 
        (?,?,?,?,?)
    ;`;
    
    //Cannot add a course if a record with same course_name and instructor_id exists
    const checkExistingRecords = `
    SELECT course_id FROM Courses WHERE course_name = ? AND instructor_id = ?;
    `;
    const [r] = await db.query(checkExistingRecords,[courseObj[0],courseObj[1]])

    if(r.length == 0){  //IF NO SUCH RECORDS EXIST, WE ARE GOOD TO GO
        try{
            await db.query(Q,courseObj);
            return "Successfully Added to Courses DB"
        }catch(err){
            console.log("Error Adding Course!")
        }
    }
    else{
        return "Course Already Exists!"
    }  
}

export async function removeCourse(id){
    const Q=``;
}

export async function updateCourse(id, course_name, instructor_id, max_seat, free_seats, start_date){
    const Q=``;
    return Q;
}