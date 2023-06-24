const { connect_DB, disconnect_DB} = require('./mySQL_connect.js');

var db = connect_DB();

function createInstructorTable(){
    //create instructors table
    const createInstructors = `
    CREATE TABLE IF NOT EXISTS Instructors(
        instructor_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255)
    )
    `;
    db.query(createInstructors,(err)=>{
        if(err)
            console.log("Error creating Instructors table: "+err);
        else
            console.log("Instructor Table Created!");  
    })
}
createInstructorTable();

disconnect_DB(db);
