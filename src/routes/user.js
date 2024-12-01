const express = require("express");
const userRouter = express.Router();
const { USER_AUTH } = require("../middleware/auth");
const { ConnectionRequest } = require("../model/connectionRequest");
const { User } = require("../model/User");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "Gender",
  "About",
  "skills",
];
userRouter.get("/user/pendingRequest", USER_AUTH, async (req, res) => {
  try {
    const loggedInuser = req.user._id;
    console.log(loggedInuser);
    const getMyPendingRequest = await ConnectionRequest.find({
      toUserId: loggedInuser,
      status: "Intrested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Pending request fetched sucessfully !!!",
      data: getMyPendingRequest,
    });
  } catch (err) {
    res.json({
      message: "ERROR!!",
      data: "Could not fetch the pending request's",
    });
  }
});

userRouter.get("/user/connections", USER_AUTH, async (req, res) => {
  const loggedInuser = req.user;
  const findMyConnections = await ConnectionRequest.find({
    $or: [
      { status: "Accepted", fromUserId: loggedInuser._id },
      { status: "Accepted", toUserId: loggedInuser._id },
    ],
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = findMyConnections.map((row) => {
    if (row.fromUserId._id == loggedInuser) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
  res.json({ message: "", data });
});

userRouter.get("/get/core/feed", USER_AUTH, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const page = parseInt(req.query.page) || 1;
    let  limit = parseInt(req.query.limit) || 10;
    const skip = (page-1) *limit;
    limit = limit > 50 ? 50:limit;

    const myConnections = await ConnectionRequest.find({
      $or: [{ "fromUserId": loggedInuser}, {"toUserId": loggedInuser }],
    }).select("fromUserId  toUserId");

    console.log(myConnections);
    console.log(loggedInuser);

    const hideUsersFromFeed = new Set();
    myConnections.forEach((record) => {
      hideUsersFromFeed.add(record.fromUserId.toString()),
      hideUsersFromFeed.add(record.toUserId.toString());
    });
    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInuser._id } },
      ],
    }).select(USER_SAFE_DATA)
       .skip(skip)
       .limit(limit);

    res.json({ message: "", data: userFeed });
  } catch (err) {
    res.json({ ERROR: "", data: err.message });
  }
});

module.exports = userRouter;
