import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "../config";
import { IUser } from "../types/modelTypes/UserType";
import Plan from "./Plans";

interface IUserModel extends IUser, Document {}


const userSchema = new mongoose.Schema<IUserModel>({
  full_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  current_level: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  completed_questions: [String],
  avg_response_time: {
    type: Number,
    default: 0,
  },
  avg_intensity: {
    type: Number,
    default: 0,
  },
  plans: [Plan.schema],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(config.server.rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log("error occured on saving user data", error);
  }
});

const User = mongoose.model<IUserModel>("User", userSchema);

export default User;
