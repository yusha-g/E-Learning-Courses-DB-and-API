import express, { response } from 'express';
import {viewCourses, updateCourse, addCourse, removeCourse, registerLead, registerLearner} from './DB_Functions.js'
import {validateCourses, validateLearner} from './app_validate_input.js'

const app = express() //setup server
app.listen(8000,()=>{ //run app on port 8000
    console.log("Server Started!")
})    

app.use(express.json());

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

//============view courses
app.get('/course', async(req, res)=>{
    const courses = await viewCourses();
    res.send(courses)
});

//============add a new course
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

//============delete a course by id -- if time permits it
app.delete('/course/:id',async (req, res)=>{
    let id = req.params.id;
    id = Number(id);    //if id is alphanumeric, id will become NaN
    let msg;
    if( !isNaN(id) ){
        msg = await removeCourse(id);
    }
    else
        msg = "Type Error: id should be a number";
    res.send(msg);
})

//============update existing course
app.put('/course/:id', async (req, res)=>{
    const courses = req.body;
    const courseObj = Object.values(courses);   //extracting values
    let msg = validateCourses(courseObj);       //validate json 
    if(msg == 0){
        let id = req.params.id;
        id = Number(id);    //if id is alphanumeric, id will become NaN
        if( !isNaN(id) ){
            msg = await updateCourse(id,courseObj);
        }
        else
            msg = "Type Error: id should be a number";
        res.send(msg);
    }
    else{
        res.send(msg);
    }
})

//============register new user - concequently create a lead
app.post('/courses/:id/register', async (req, res)=>{
    let c_id = Number ( req.params.id );   //course_id
    let learner_info = req.body;
    let learnerObj = Object.values(learner_info);   
    let msg = validateLearner(learnerObj);
    let msg_2="";
    if(msg == 0){
        if( !isNaN(c_id)){
            msg = await registerLearner(learnerObj);
            //send course id and learner email to retrieve corresponding learner id
            msg_2 = await registerLead(c_id, learnerObj[1]);    
        }
        else
            msg = "Type Error: course and learner id should be a number";
        res.send(msg+"\n"+msg_2);
    }
    else
        res.send(msg);

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


