import express from 'express';
import {viewCourses} from './DB_Functions.js'

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

app.get('/view-courses', async(req, res)=>{
    const courses = await viewCourses();
    res.send(courses)
});

app.post('/update-course/:id', (req, res)=>{
    const id = req.params.id;
    const { name, max_seats, free_seats, start_date, instructor_id } = req.body;
    updateCourse(id)
})



