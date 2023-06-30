import express, { response } from 'express';
import {
    viewCourses, updateCourse, addCourse, 
    registerLead, registerLearner, updateLead, searchLead,
    addComment
} from './DB_Functions.js';
import {validateCourses, validateLearner, validateLead, validateComment} from './app_validate_input.js';

const app = express(); //setup server
app.listen(8000,()=>{ //run app on port 8000
    console.log("Server Started!");
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
    res.send("Server Started!");
});

//============view courses
app.get('/course', async(req, res)=>{
    const courses = await viewCourses();    //in app_validate_input.js
    res.send(courses);
});

//============add a new course
app.post('/course', async (req, res)=>{
    const courses = req.body;
    const courseObj = Object.values(courses);   //extracting values
    let msg = validateCourses(courseObj);       //in app_validate_input.js
    if(msg == 0){    //Successfully Validated
        let query_result = await addCourse(courseObj);
        res.send(query_result);
    }
    else    //Print Error
        res.send(msg);
});


//============update existing course
app.put('/course/:id', async (req, res)=>{
    const courses = req.body;
    const courseObj = Object.values(courses);   //extracting values
    let msg = validateCourses(courseObj);       //in app_validate_input.js 
    if(msg == 0){       //successfully validated!
        let id = req.params.id;
        id = Number(id);    //if id is alphanumeric, id will typecasting will make it NaN
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

//============register new user - consequently create a lead
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
            msg = "Type Error: course id should be a number";
        res.send(msg+"\n"+msg_2);
    }
    else
        res.send(msg);

})

//============update existing lead
app.put('/leads/:id', async (req, res)=>{
    let id = Number (req.params.id);
    let lead_info = req.body;
    let leadObj = Object.values(lead_info);
    let msg = "";
    if( !isNaN(id) ){
        msg = validateLead(leadObj)
        if (msg == 0){
            msg = await updateLead(id, leadObj);
        }
    }
    else
        msg = "Type Error: lead id should be a number"
        
    res.send(msg)
})

//============search lead by learner email
app.get('/leads/:email', async (req, res)=>{
    let email = req.params.email;
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let msg =""
    if(emailFormatRegex.test(email)){   //CHECK IF PARAMETER IS A VALID EMAIL
        msg = await searchLead(email);
    }
    else
        msg = "Parameter should be a valid email address!";
    res.send(msg);
})

//============add comment====alt- leads/:id/comment
app.post('/leads/comment', async (req, res)=>{
    const comment_info = req.body;
    const commentObj = Object.values(comment_info);
    let msg = validateComment(commentObj)
    if(msg == 0){
        msg = await addComment(commentObj);
    }
    res.send(msg);
    
})



