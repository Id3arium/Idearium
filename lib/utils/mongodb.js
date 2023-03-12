import {mongoose} from 'mongoose';

export default async function connectToDatabase() {
    try {
        const db = mongoose.connect(process.env.IDEARIUM_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Connection error:', error);
    }
    // db.once('open', () => {
    //     console.log('MongoDB database connection established successfully!!!')
    // })
}

// export default async function connectToDatabase() {
//     if (connection.isConnected) { return }

//     const db = await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })

//     connection.isConnected = db.connections[0].readyState
//     console.log('Coonection status:', connection.isConnected)
// }

