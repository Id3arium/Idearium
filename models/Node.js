import mongoose from 'mongoose'

const NodeSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    // required: true
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
    // required: [true, "Y no inspiration?"]
  },
  frequancy: {
    type: Number,
    // required: true
  },
  ranking: {
    type: Number,
    // required: true
  }
})

export const Node = mongoose.models.Node || mongoose.model('Node', NodeSchema)