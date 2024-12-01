const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");


const schema = new mongoose.Schema({
  firstName: { type: String,required:true,maxLength:50,minLength:3},
  lastName: { type: String,required:true},
  emailId: { type: String,required:true,unique:true,trim:true,lowerCase:true,
             validate(value){
              if(!validator.isEmail(value)){
                throw new Error('Invalid email address'+value);
              }

             }

  },
  password: { 
    type: String,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error('Your password is not strong');
      }
    }
  },
  photoURL: { type: String,},
  Age: { type: Number,min:1 },
  Gender: { type: String, 
    validate(value){
      if(!['male','female','others'].includes(value)){
          throw new Error('Gender data is not correct');
      }
  } },
  About:{type:String, default:"I'm a developer",maxLength:150,minLength:3},
  skills:{type:[String]}
},{timestamps:true});



schema.methods.getJWT = async function(){
      const user = this;
      const token = jwt.sign({ _id: userObj._id }, "DevTinder@!1410",
        { expiresIn: new Date(Date.now() + 8 * 3600000) });
      return token;
};

schema.methods.validatePwdFromDB = async function(passwordInputByUser){
     const user = this;
     const passwordHash = user.password;
     const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);
     return isValidPassword;
}


const User = mongoose.model("User", schema);
module.exports = { User };
