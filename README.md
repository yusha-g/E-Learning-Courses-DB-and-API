# E-Learning-Courses-DB-and-API

# Table of Contents

<b> [1. Files](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#1-files) </b> <br/>

<b> [2. Design](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#2-design) </b> <br/>
&nbsp;&nbsp;&nbsp; [2.1. Database Design](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#21-database-design) <br/>
&nbsp;&nbsp;&nbsp; [2.2. API Endpoints](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#22-api-endpoints) <br/>

<b> [3. Running Guide](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#3-running-guide) </b> <br/>
&nbsp;&nbsp;&nbsp; [3.1. Setup](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#31-setup) <br/>
&nbsp;&nbsp;&nbsp; [3.2. Running Guide](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#32-running-guide) <br/>

<b> [4. Demonstration](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#4-demonstration) </b> <br/>

<b> [5. Resources Used](https://github.com/yusha-g/E-Learning-Courses-DB-and-API#5-resources-used) </b> <br/>

# 1. Files

## 1.1. DB_setup.js

- This file is responsible for setting up the database connection and creating the necessary tables.
- It also inserts some initial data into the tables.

## 1.2. DB_Functions.js

- This file contains various functions that interact with the database.
- It includes functions for
  viewing, adding and updating a course,
  registering a learner,
  creating, updating and searching for a lead,
  and adding a comment.
- Each function corresponds to an API endpoint.
- Created for the sake simplicity, so that app.js can import and utilise it.

## 1.3. app_validate_input.js

- This file includes functions for validating input data for courses, learners, and leads.
- It checks if the input data follows the expected format and returns an error message if any inconsistencies are found.

## 1.4. app.js

- This is the main entrypoint.
- It imports and utilizes functions from DB_Functions and app_validate_input.
- Holds the API endpoints.

# 2. Design

## 2.1. DataBase Design

### Instructors

- instructor_id (primary key, auto increment)
- name
- email (unique)

### Courses

- course_id (primary key, auto increment)
- course_name
- instructor_id (foreign key referencing Instructors table)
- max_seat
- free_seats (≤ max_seats)
- start_date

### Learners

- learner_id (primary key, auto increment)
- name
- email (unique)
- phone_number (unique)
- linkedin (unique)

### Leads

- lead_id (primary key, auto increment)
- course_id (foreign key referencing Courses table)
- learner_id (foreign key referencing Learners table)
- status (Accept / Reject / Waitlist)

### Comments

- comment_id (primary key, auto increment)
- lead_id (foreign key referencing Leads table)
- instructor_id (foreign key referencing Instructors table)
- comment

### Relations

- One instructor can have multiple courses.
- Multiple learners can apply for multiple courses.
- Instructor can add multiple comments for each lead.

### Example Data

1. John Doe (instructor_id=1) teaches JavaScript 101 (course_id=1).
   Alice Johnson (learner_id=1) was accepted into the JavaScript 101 course, indicated by lead_id = 1.
   Against lead_id = 1, John Doe inserts a comment, “Good Job!”
2. John Doe (instructor_id=1) teaches Node.js Basics (courses_id=2).
   Bob Lee (learner_id = 2) was waitlisted from Node.js Basics course, indicated by lead_id = 2.
   Against lead_id = 3, John Doe inserts a comment, “We will update you shortly”
3. Jane Smirth (instructor_id=2) teaches Python Basics (course_id=3).
   Riya De (learder_id=3) was rejected from Python Basics course, indicated by lead_id=3.
   Against lead_id=3, Jane Smith inserts a comment, “Unfortunately, registration has ended”.

### Constraints when Inserting data

1. Unique keys should be maintained
2. Cannot add new Course if a course with the same course_name and instructor_id exists.
3. Students are waitlisted in a courses if free_seats ≤ 0
   If course has already started, the student is automatically rejected.
4. Only instructors teaching the course can insert comments to their corresponding leads.

## 2.2. API Endpoints

### View courses API

- Method: GET
- Endpoint: **`/course`**
- Parameters: none
- Action: View existing courses

### Create course API

- Method: POST
- Endpoint: **`/course`**
- Request Body: { course_name, instructor_id, max_seat, free_seats, start_date }
- Actions: Create a new course in the Courses table with the provided details.

### Update course details API

- Method: PUT
- Endpoint: **`/course/:id`**
- Parameter: { course_name, instructor_id, max_seat, free_seats, start_date }
- Actions: Update the course details in the Courses table based on the provided course ID.

### Course registration API [Lead creation]

- Method: POST
- Endpoint: **`/courses/:course_id/register/:learner_id`**
- Parameters: { course_id, learner_id, status }
- Actions: Create a new learner in the Learners table and create a new lead in the Leads table linking the course and learner.

### Lead update API

- Method: PUT
- Endpoint: **`/leads/:id`**
- Parameters: { }
- Actions: Update the lead status in the Leads table based on the provided lead ID.

### Lead search API

- Method: GET
- Endpoint: **`/leads/:email`**
- Parameters: {}
- Actions: Retrieve leads from the Leads table based on the provided email.

### Add comment API

- Method: POST
- Endpoint: **`/leads/comments`**
- Parameters: { instructor_id, comment }
- Actions: Create a new comment in the Comments table for the specified lead and instructor.

# 3. Running Guide

## 3.1. Installing Dependencies

Before running the application, make sure you have the following dependencies installed:

1. npm
2. express
3. dotenv
4. mysql2
5. nodemon

## 3.1. Setup

### 3.1.1. Environment Setup

- Ensure that you have Node.js installed on your system.
- Clone or download the code files to your local machine.
- Install Dependencies:  
  `npm install express
npm install dotenv
npm install mysql2
npm install --save-dev nodemon`

### 3.1.2. Database Setup

- Create a **`.env`** file in the project directory and configure the following environment variables:
  `DB_HOST = <your_database_host>, 
DB_USERNAME = <your_username>, 
DB_PASSWORD = <your_password>, 
DB = <your_database_name>,
DB_SOCKETPATH = <your_socketpath> (/Applications/MAMP/tmp/mysql/mysql.sock for MAC)`
- Import the database schema and example data using the DB_setup.js script. Run the following command:
  `node DB_setup.js`
  This will create the necessary tables and populate them with example data.
  NOTE: DON’T RUN THE SCRIPT MORE THAN ONCE AS DUPLICATE VALUES WILL BE INSERTED

## 3.2. Running Guide

1. Open a command line interface and navigate to the project directory.
2. Run the following command to start the server:
   `npm run devStart`
3. The server will start running, and you should see a message indicating that the server is listening on a specific port (e.g., 8000 in our case).
   The application is now running, and you can access the API endpoints described above.

# 4. Demonstration
https://youtu.be/QmSgvp4dH80

# 5. Resources Used

- ExpressJs Tutorial: [https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified](https://www.youtube.com/watch?v=SccSCuHhOw0&ab_channel=WebDevSimplified)
- [https://www.sammeechward.com/connect-to-mysql-from-node](https://www.sammeechward.com/connect-to-mysql-from-node)
