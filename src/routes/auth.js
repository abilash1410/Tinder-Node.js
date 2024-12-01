const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../model/User");
const { validateRequestData } = require("../utils/helper");
const jwt = require("jsonwebtoken");

authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const userObj = await User.findOne({ emailId: emailId });
      if (!userObj) {
        throw new Error("Invalid credentials");
      }
      //const isPwdValid = await User.validatePwdFromDB(password);

      const isPwdValid = await bcrypt.compare(password, userObj.password);
      if (!isPwdValid) {
        throw new Error("Invalid credentials");
      } else {

        const token = jwt.sign({ _id: userObj._id }, "DevTinder@!1410",
          { expiresIn: "1d" });
       // const token = await User.getJWT();
        res.cookie("token", token,{
          expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
        });
        res.send("Login is successfull !!!!");
      }
    } catch (e) {
      res.send(e.message);
    }
  });

  authRouter.post("/signup", async (req, res) => {
    const { firstName, lastName, emailId, password,photoURL } = req.body;
    try {
      //valdiate sign up data
      validateRequestData(req.body);
      // Store hash in your password DB.
      //Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        photoURL
      });
      await user.save();
      res.send("User data saved successfully");
    } catch (err) {
      res.send("Error " + err.message);
    }
  });

  authRouter.post("/logout",async (req,res) => {
    res.cookie('token',null,{
      expires: new Date(Date.now()) // cookie will be removed right now 
    }) 
    .send("Logged out successfully !!!!!!!!");
  })

  module.exports = authRouter;

