import express from 'express';
import {viewCourses, updateCourse, addCourse, removeCourse} from './DB_Functions.js'

const app = express() //setup server
app.listen(8000,()=>{ //run app on port 8000
    console.log("Server Started!")
})    

app.use(express.json());

/*
* Middleware for Validation
*/

function validateCourses(courseObj){
    const courseFormat =`
    {
        "course_name": "string",
        "instructor_id": number,
        "max_seat": number, 
        "free_seats": number, 
        "start_date": "YYYY-MM-DD" 
    }`;

    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;  //date format

    //make sure all parameters are supplied
    if(courseObj.length !== 5)  
        return `Insufficient Parameters. Should of the form: `+courseFormat

    //make sure parameters are of valid types
    if(
        (typeof courseObj[0] !== 'string' || 
        typeof courseObj[1]) !== 'number' || 
        typeof courseObj[2] !== 'number' || 
        typeof courseObj[3] !== 'number' ||
        ! dateFormatRegex.test(courseObj[4])
    )
        return `Type Error: Json should be of the form`+courseFormat;
    
    //make sure free_seats < max_seats
    if(courseObj[2] < courseObj[3])
        return "Logical Error: Free seats cannot be greater than Max seats";

    let date = new Date(courseObj[4])
    //check if date is of valid time format
    // & just to be safe, let's also check if it is an instance of Date
    if(!(date instanceof Date) || isNaN(date.getTime()))    
        return "Invalid Date!"

    return 0;
}

/*
==================
|                |
| Express Routes |
|                |
==================
*/

app.get('/', (req, res)=>{ 
    res.send("Server Started!")
});

//view courses
app.get('/course', async(req, res)=>{
    const courses = await viewCourses();
    res.send(courses)
});

//add a new course
app.post('/course', async (req, res)=>{
    const courses = req.body;
    const courseObj = Object.values(courses);   //extracting values
    let msg = validateCourses(courseObj);       //validate json 
    if(msg == 0){    //Successfully Validated
        let query_result = await addCourse(courseObj);
        res.send(query_result);
    }
    else    //Print Error
        res.send(msg)
});

app.delete('/course/:id',(req, res)=>{
    const id = req.params.id;
    removeCourse(id);
})

app.put('/course/:id', (req, res)=>{
    const id = req.params.id;
    const { course_name, instructor_id, max_seat, free_seats, start_date } = req.body;
})


/*
* instructor - name, email
populateInstructorTable('John Doe', 'johndoe@example.com');

* courses - course_name, instructor_id, max_seat, free_seats, start_date
populateCoursesTable('JavaScript 101', 1, 30, 21, '2023-07-31');

* LEARNER - name, email, phone_number, linkedin
populateLearnersTable('Alice Johnson','alicejohnson@example.com',123456789,'linkedin.com/alice')

* LEADS - course_id, learner_id, status
populateLeadsTable(1, 1)

* COMMENTS - lead_id, instructor_id, comment
*/


