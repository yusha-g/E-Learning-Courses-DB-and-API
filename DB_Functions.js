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

//LISTENING FOR ERRORS WHILE ESTABLISHING CONNECTION
db.on('error', function(err) {
    console.log("COULDN'T CONNECT TO DATABASE:\n", err);
});
    
//VIEW EXISTING COURSES IN THE TABLE
export async function viewCourses(){
    const Q = `
    SELECT * FROM Courses;   
    ;`;
    try{
        const [courses] = await db.query(Q);
        return courses;
    }catch(err){
        return "Could Not Fetch Courses"
    }
}

//ADD A NEW COURSE - NOTE: cannot add course if a record with the same course_name and instructor_id exists
export async function addCourse(courseObj){
    const Q = `
    INSERT INTO Courses (course_name, instructor_id, max_seat, free_seats, start_date) VALUES 
        (?,?,?,?,?)
    ;`;
    
    //Retrieve records with matching name and instructor_id 
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

//UPDATE A COURSE
export async function updateCourse(id,courseObj){
    const values = courseObj.concat(id);
    const Q=`
    UPDATE Courses 
    SET course_name = ?, instructor_id = ?, max_seat = ?, free_seats = ?, start_date = ?
    WHERE course_id = ?
    ;`;
    try{
        await db.query(Q, values)
        const [r] = await db.query(`SELECT * FROM Courses WHERE course_id = ?`,[id])
        return "Updated Course\n"+JSON.stringify(r)
    }catch(err){
        return "Could Not Update Course \n"+err
    }
}

//REGISTER NEW LEARNER -- email is unique
export async function registerLearner(learnerObj){  //email id is unique
    console.log(learnerObj)
    const Q=`
        INSERT INTO Learners (name, email, phone_number, linkedin) VALUES (?,?,?,?)
    ;`;
    try{
        await db.query(Q,learnerObj)
        return "User Registered Successfully!"
    }catch(err){
        return "Unable to Register User:"+err;
    }

}

//A LEAD IS CREATED WHENEVER A NEW USER REGISTERS
export async function registerLead(c_id, l_email){
    const get_learner_id=`
    SELECT learner_id FROM Learners WHERE
    email = ?
    ;`;
    try{    //GET LEARNER ID
        let [l_id] = await db.query(get_learner_id,[l_email]);
        l_id = l_id[0].learner_id;
        try{ 
            const [r] = await db.query(
                `SELECT start_date, free_seats FROM Courses
                WHERE course_id=?`,[c_id]);
            const curDate = new Date();
            let status="";
            //SET STATUS
            if(r[0].start_date > curDate)
                status = "Accept";
            else
                status = "Reject";      //Course has already Started!

            if(r[0].free_seat<=0)        //The course instructor can update waitlisted candidates
                status = 'Waitlist';

            try{
                const insertLead=`
                    INSERT INTO Leads (course_id, learner_id, status) VALUES 
                    (?,?,?)
                `;
                await db.query(insertLead,[c_id, l_id, status]);
                return "Lead Created for learner";

            }catch(err){
                return "Error Creating Lead:\n"+err;
            }
        }catch(err){
            return "Error Registering:\n"+err;
        }
    }catch(err){
        return "Learner not registered!:\n",+err;
    }
}

//UPDATE LEAD
export async function updateLead(id, leadInfo){
    const values = leadInfo.concat(id);
    const Q=`
    UPDATE Leads 
    SET course_id = ?, learner_id = ?, status = ?
    WHERE lead_id = ?
    ;`;
    try{
        await db.query(Q,values);
        return "Lead Updated Successfully!";
    }catch(err){
        return "Lead Could not be Updated!";
    }
}

//SEARCH LEAD my learner email (since it's unique)
export async function searchLead(email){
    const Q=`
    SELECT Leads.lead_id, Leads.course_id, Leads.learner_id, Leads.status FROM Leads
    JOIN Learners 
    ON Leads.learner_id = Learners.learner_id
    WHERE Learners.email = ?;
    ;`;
    try{
        const [r]=await db.query(Q,[email]);
        return r[0]
    }catch(err){
        return "Could not retrieve lead"
    }
}

//ADD COMMENT
export async function addComment(commentObj){
    const Q=`
    SELECT * FROM Leads 
    JOIN Courses ON Leads.course_id = Courses.course_id
    WHERE Leads.lead_id = ? AND Courses.instructor_id = ?
    ;`;
    /*
     * Why not just add INSERT in query 'Q'?
     * While it would work just fine, it won't return a statement if the record is not inserted
     */
    try{

        const [r] = await db.query(Q,[commentObj[0],commentObj[1]]) 
        //lead_id and instructor_id
        if(r.length > 0){
            const insertComment = `
            INSERT INTO Comments (lead_id, instructor_id, comment) VALUES
            (?,?,?);
            `
            await db.query(insertComment, commentObj)
            return "Comment added Successfully"
        }else{
            return "The Instructor Does Not Teach the Course corresponding to the Lead";
        }

    }catch(err){
        return "Could not Add Comment:\n"+err;
    }
}