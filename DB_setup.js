import mysql from 'mysql2'
import dotenv from 'dotenv' //loads environment variables from .env file
dotenv.config()

/* NOTE!!
 * REMEMBER TO CREATE YOUR OWN .env FILE BEFORE RUNNING THIS SCRIPT!
 * things to add in the .env file ->    DB_HOST ('localhost'), 
 *                                      DB_USERNAME, 
 *                                      DB_PASSWORD, 
 *                                      DB (database name),
 *                                      DB_SOCKETPATH (/Applications/MAMP/tmp/mysql/mysql.sock for MAC) 
 */

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    socketPath: process.env.DB_SOCKETPATH
})


function execute_query(Q){
    db.query(Q,(err)=>{
        if(err)
            console.log("Error executing query: "+Q+"\n"+err);
        else
            console.log("Query Successfully executed! "+Q); 
    })
}
db.connect((err)=>{
    if(err)
        console.log("Unable to establish connection with Database! \n"+err)
    else{
        console.log("=============Successfully Connected to DataBase!=============")
        //CREATE INSTRUCTORS TABLE
        const createInstructors = `
        CREATE TABLE IF NOT EXISTS Instructors(
            instructor_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE
        )
        `;
        execute_query(createInstructors);

        //Create Courses
        const createCourses = `
        CREATE TABLE IF NOT EXISTS Courses(
            course_id INT PRIMARY KEY AUTO_INCREMENT,
            course_name VARCHAR(255),
            instructor_id INT,
            max_seat INT,
            free_seats INT CHECK (free_seats <= max_seat),
            start_date DATE,
            FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        )
        `;
        execute_query(createCourses);

        //CREATE LEARNERS
        const createLearners = `
        CREATE TABLE IF NOT EXISTS Learners(
            learner_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            phone_number VARCHAR(20),
            linkedin VARCHAR(255) UNIQUE
        )
        `
        execute_query(createLearners);

        //CREATE LEADS TABLE
        const createLeads = `
        CREATE TABLE IF NOT EXISTS Leads(
            lead_id INT PRIMARY KEY AUTO_INCREMENT,
            course_id INT,
            learner_id INT,
            status ENUM('Accept', 'Reject', 'Waitlist'),
            FOREIGN KEY (course_id) REFERENCES Courses(course_id),
            FOREIGN KEY (learner_id) REFERENCES Learners(learner_id)
        )
        `
        execute_query(createLeads);

        //CREATE COMMENTS TABLE
        const createComments = `
        CREATE TABLE IF NOT EXISTS Comments(
            comment_id INT PRIMARY KEY AUTO_INCREMENT,
            lead_id INT,
            instructor_id INT,
            comment TEXT,
            FOREIGN KEY (lead_id) REFERENCES Leads(lead_id),
            FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        )
        `;
        execute_query(createComments);

        //==========POPULATE TABLES
        const insertInstructors = `
            INSERT INTO Instructors (name, email) VALUES 
            ('John Doe', 'johndoe@example.com'),
            ('Jane Smith', 'janesmith@example.com');
        `;
        execute_query(insertInstructors);

        const insertCourses = `
        INSERT INTO Courses (course_name, instructor_id, max_seat, free_seats, start_date) VALUES 
        ('JavaScript 101', 1, 30, 21, '2023-07-31'),
        ('Node.js Basics', 1, 30, 0, '2023-07-03'),
        ('Python Basics', 2, 25, 4, '2023-05-03')
        ;`;
        execute_query(insertCourses);

        const insertLearners = `
        INSERT INTO Learners (name, email, phone_number, linkedin) VALUES 
            ('Alice Johnson','alicejohnson@example.com',123456789,'linkedin.com/alice'),
            ('Bob Lee','boblee@example.com',9876543210,'linkedin.com/bob'),
            ('Riya De','riyade@example.com',9786756453,'linkedin.com/riya')
        ;`;
        execute_query(insertLearners);

        const insertLead=`
            INSERT INTO Leads (course_id, learner_id, status) VALUES 
            (1,1,'Accept'),
            (2,2,'Waitlist'),
            (3,3,'Reject')
        ;`;
        execute_query(insertLead)

        const insertComments = `
        INSERT INTO Comments (lead_id, instructor_id, comment) VALUES 
        (1,1,"Good job!"),
        (2,1,"We will update you shortly"),
        (3,2,"Unfortunately, registration has ended")
        ;`;
        execute_query(insertComments)


        //disconnect
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
})
