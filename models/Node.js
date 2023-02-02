import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';
const NodeSchema = new mongoose.Schema({
  _id: {
    type: String,
    default : uuidv4(),
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, "Title can't exceed 100 characters"]
  },
  content: {
    type: String,
    // required: true
  },
  inspiration: {
    type: String,
    required: [true, "Y no inspiration?"]
  },
  frequency: {
    type: Number,
    // required: true
  },
  ranking: {
    type: Number,
    // required: true
  }
})

export const Node = mongoose.models.Node || mongoose.model('Node', NodeSchema)