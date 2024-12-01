const express = require("express");
const profileRouter = express.Router();
const { USER_AUTH } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User } = require("../model/User");
const validator = require("validator");

profileRouter.get("/profile/view", USER_AUTH, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.send("Error" + e.message);
  }
});

profileRouter.patch("/profile/edit", USER_AUTH, async (req, res) => {
  try {
    const userObj = req.user;
    const body = req.body;
    const ALLOWED_UPDATE = ["Gender", "About", "skills", "photoURL"];
    const isUpdateAllowed = Object.keys(body).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }

    if (body?.skills.length > 10) {
      throw new Error("skills cannot be more than 10");
    }
    Object.keys(body).forEach((key) => (userObj[key] = body[key]));
    console.log(userObj);
    await userObj.save();
    res.json({
      message: `${
        userObj.firstName + ","
      }your profile was updated successfully!!`,
      data: userObj,
    });
  } catch (err) {
    res.status(400).send("Update FAILED!!" + err.message);
  }
});

profileRouter.patch("/profile/password/edit", USER_AUTH, async (req, res) => {
  try {
    const userObj = req.user;
    const body = req.body;
    const { currentPassword, newPassword } = body;
    const ALLOWED_UPDATE = ["currentPassword", "newPassword"];
    const isUpdateAllowed = Object.keys(body).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Password update not allowed,since request param's does not match");
    }
    console.log(userObj);
    console.log(currentPassword + newPassword);
    if (!userObj) {
      throw new error(
        "You are not authorized, make this transaction,Please login to RESET password"
      );
    }
    const isOldPwdValid = await bcrypt.compare(currentPassword, userObj.password);
    if (!isOldPwdValid) {
      throw new Error("Old password is not correct !!!");
    } else {
      if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Your new password is not strong");
      }
      const passwordHash = await bcrypt.hash(newPassword, 10);
      userObj.password = passwordHash;
      await userObj.save();
      res.json({"message":"Thanks, Your new password is successfully updated in our DB !!"});
    }
  } catch (err) {
    res.status(400).send("Update FAILED!!" + err.message);
  }
});

module.exports = profileRouter;
