const jwt = require("jsonwebtoken");
const { User } = require("../model/User");

const USER_AUTH = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const token = cookie.token;
    const cookieData = jwt.verify(token, "DevTinder@!1410");
    const loggedUser = cookieData._id;
    const userObj = await User.findById(loggedUser);
    if (!userObj) {
      throw new Error("User does not exsist");
    }
    req.user = userObj;
    next();
  } catch (e) {
    res.send("Error" + e.message);
  }
};

module.exports = { USER_AUTH };
