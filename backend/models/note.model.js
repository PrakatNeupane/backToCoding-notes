import mongoose from "mongoose";
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdOn: { type: Date, default: new Date().getTime() },
  userId: { type: String, required: true },
});

export default mongoose.model("Note", noteSchema);
