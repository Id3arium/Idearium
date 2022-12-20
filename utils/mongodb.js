import mongoose from 'mongoose';

const connection = {}

export default async function connectToDatabase() {
  if (connection.isConnected) { return }

  const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })

  connection.isConnected = db.connections[0].readyState
  console.log('Coonection status:', connection.isConnected)
  
  // connection.once('open', () => {
  //   console.log('MongoDB database connection established successfully!!!')
  // })
} 

