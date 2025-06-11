import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  createdOn: { type: String },
  fullName: { type: Date, default: new Date().getTime() },
});

export default mongoose.model("User", userSchema);
