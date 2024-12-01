const express = require("express");
const PORT_NUMBER = 4005;
const app = express();
const { connectDB } = require("./Database/database");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser()); //middleware to get the cookies

const authRouter = require ("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",userRouter);

connectDB()
  .then(() => {
    console.log("Connected to Database successfully !!!");
    app.listen(PORT_NUMBER, () => {
      console.log("server is up and listening on port " + PORT_NUMBER);
    }); //created a web server on port 4003
  })
  .catch((err) => {
    console.error("Error connecting to Database...TRY AGAIN");
  });
console.log("starting TINDER project !!");
