import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';
const NodeSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    required: true
  }
  ,id: {
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
  },
  inspiration: {
    type: String,
    required: [true, "Y no inspiration?"]
  },
  frequency: {
    type: Number,
  },
  ranking: {
    type: Number,
  }
})

export const Node = mongoose.models.Node || mongoose.model('Node', NodeSchema)