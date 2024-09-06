import mongoose from "mongoose";
import { INote } from "../types/modelTypes/NoteTypes";

interface INoteSchema extends INote, Document {}

const NoteSchema = new mongoose.Schema<INoteSchema>({
  title: {
    type: String,
    required: true,
  },
    topics: {
        type: [String],
        required: true,
    },
  content: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model<INoteSchema>("Note", NoteSchema);

export default Note;
