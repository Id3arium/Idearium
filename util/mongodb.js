import mongoose from 'mongoose';

const connection = {}

export default async function connectToDatabase() {
  if (connection.isConnected) { return }

  const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  mongoose.set('strictQuery', false)

  connection.isConnected = db.connections[0].readyState
  console.log('Coonection status:', connection.isConnected)
  
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully!!!')
  })
} 

// import { MongoClient } from 'mongodb';

// const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(err => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });