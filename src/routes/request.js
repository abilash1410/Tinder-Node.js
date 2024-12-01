const express = require("express");
const connectionRouter = express.Router();
const { USER_AUTH } = require("../middleware/auth");
const { ConnectionRequest } = require("../model/connectionRequest");
const { User } = require("../model/User");

connectionRouter.post(
  "/request/send/:status/:toUserId",
  USER_AUTH,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ifSenderIdExsist = await User.findById(toUserId);
      if (!ifSenderIdExsist) {
        throw new Error("User not found in DB " + toUserId);
      }

      const findForExsistingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (findForExsistingConnection) {
        throw new Error("Already connection request exsists for " + toUserId);
      }

      const ALLOWED_STATUS = ["Ignored", "Intrested"];
      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid Status " + status);
      }

      const connectionReqObj = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionReqObj.save();
      res.json({
        message:
          req.user.firstName +
          " you have sent the connection request successfully !!",
        connectionReqObj,
      });
    } catch (err) {
      res.json({ message: "Error!!", data: err.message });
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  USER_AUTH,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user._id;
      const ALLOWED_STATUS = ["Accepted", "Rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return req.status(401).json({ message: "Status not allowed !!" });
      }
      const isRequestIdValid = await ConnectionRequest.findById({_id:requestId});
      if(!isRequestIdValid){
        return req.status(401).json({ message: "Request ID not valid" });
      }
      console.log(isRequestIdValid);
      if(isRequestIdValid.status == "Intrested" && isRequestIdValid.toUserId.equals(loggedInUser)){
        isRequestIdValid.status = "Accepted";
        await isRequestIdValid.save();
        res.json({message:"Connection request accepted successfully !!",isRequestIdValid});
      }else{
        res.json({message:"Sorry, Could not accept the request"});
      }
    } catch (err) {
      res.json({"Error!! " :err.message});
    }
  }
);

module.exports = connectionRouter;
