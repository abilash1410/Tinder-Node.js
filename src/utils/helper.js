const validator = require("validator");
const validateRequestData = (request)=>{
    const {firstName,lastName,emailId,password} = request;
    if(!validator.isStrongPassword(password)){
        throw new Error("Your password is not strong");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email");
    }else if (!firstName || !lastName){
        throw new Error("Name is not valid");
    }
}

const validateEditRequestData = (request) => {

};


module.exports = {validateRequestData};