export function validateCourses(courseObj){
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
        typeof courseObj[0] !== 'string' || 
        typeof courseObj[1] !== 'number' || 
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

//========VALIDATE LEARNER INFO==========
export function validateLearner(learnerObj){
    const learnerFormat=`
    {
        "name": "string", 
        "email":"string (abc@email.com)", 
        "phone_number": number (1234567890), 
        "linkedin": "string (linkedin.com/in/abc)"
    }
    `;
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneFormatRegex = /^\d{10}$/;
    const linkedinFormatRegex = /^linkedin\.com\/in\/[a-zA-Z0-9\-]+$/;

    //make sure all parameters are supplied
    if(learnerObj.length !== 4)
        return "Insufficient Parameters. Should be of the form:\n"+learnerFormat

    //check type validity
    if(
        typeof learnerObj[0] !== 'string' ||
        ! emailFormatRegex.test(learnerObj[1]) ||
        ! phoneFormatRegex.test(learnerObj[2]) ||
        ! linkedinFormatRegex.test(learnerObj[3]) 
    )
        return "Type Error! Should be of the form:\n"+learnerFormat
    
    return 0;
}

//========VALIDATE LEAD INFO==========
export function validateLead(lead_info){
    const leadFormat = `
    {
        "course_id": number, 
        "learner_id": number, 
        "status": "string (Accept / Reject / Waitlist)" :
    }
    `;
    if(lead_info.length !== 3){
        return "Insufficient Parameters. Should be of the form:\n"+leadFormat;
    }

    if(
        typeof lead_info[0] !== 'number' ||
        typeof lead_info[1] !== 'number' ||
        !( lead_info[2] == "Accept" || lead_info[2] == "Reject" || lead_info[2] == "Waitlist" )
    ){
        return "Type Error! Should be of the form:\n"+leadFormat;
    }
    return 0;

}

export function validateComment(comment_info){
    const commentFormat = `
    {
        "lead_id":number, 
        "instructor_id":number, 
        "comment":"string"
    }
    `;
    if(comment_info.length !== 3){
        return "Insufficient Parameters. Should be of the form:\n"+commentFormat;
    }

    if(
        typeof comment_info[0] !== 'number' ||
        typeof comment_info[1] !== 'number' ||
        typeof comment_info[2] !== 'string'
    ){
        return "Type Error! Should be of the form:\n"+commentFormat;
    }
    return 0;
}