const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true,ref:"User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId, required: true,ref:"User" },
    status: {
      type: String,
      enum: {
        values: ["Ignored", "Accepted", "Rejected", "Intrested"],
        message: `{VALUE} is incorrect status type `,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("A connection cannot be made by yourself !!");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = { ConnectionRequest };
