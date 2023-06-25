const { connect_DB, disconnect_DB, execute_query, db} = require('./DB_connect.js');
/* WHAT'S THIS FOR?
 * Create necessary tables in your databse 
 * Populate the table with some existing data
 */
connect_DB();

//CREATE INSTRUCTOR TABLE
function createInstructorTable(){
    const createInstructors = `
    CREATE TABLE IF NOT EXISTS Instructors(
        instructor_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE
    )
    `;
    execute_query(createInstructors);
    
}

//CREATE COURSES TABLE
function createCoursesTable(){
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
}


//CREATE LEARNERS TABLE
function createLearnersTable(){
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
}


//CREATE LEADS TABLE
function createLeadsTable(){
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
}


//CREATE COMMENTS TABLE
function createCommentsTable(){
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
}

/*
CREATE TABLES
*/

createInstructorTable();
createCoursesTable();
createLearnersTable();
createLeadsTable();
createCommentsTable();

disconnect_DB();