import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Please add an employee ID"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is requied"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    ticketAssigned: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
        },
      ],
      default: [],
    },
    ticketCreated: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
