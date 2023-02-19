// import connectToDatabase from '../../../utils/mongodb.js'
// import { Node } from '../../../models/Node.js'

// console.log("connecting to Database")
// await connectToDatabase()
// console.log("connected to Database")

// export default async function handler(req, res) {
//     const { query: { id }, method } = req

//     switch (method) {
//         case 'GET':
//             try {
//                 const node = await Node.findById(id)
//                 if (!node) {
//                     return res.status(400).json({ sucess: false })
//                 }
//                 res.status(200).json({ sucess: true, data: node })
//             } catch (error) {
//                 res.status(400).json({ sucess: false })
//             }
//             break
//         case 'PUT':
//                 try {
//                     const updatedNode = await Node.findByIdAndUpdate(id, req.body, {
//                         new: true,
//                         runValidators: true,
//                     })
//                     if (!updatedNode) {
//                         return res.status(400).json({ sucess: false})
//                     }
//                     res.status(200).json({ sucess: true, data: updatedNode })
//                 } catch (error){
//                     res.status(400).json({ sucess: false})
//                 }
//                 break;
//         case 'DELETE':
//             try {
//                 const deletedNode = await Node.deleteOne({_id: id})
//                 if (!deletedNode) {
//                     return res.status(400).json({ sucess: false})
//                 }
//                 res.status(200).json({ sucess: true, data: {} })
//             } catch (error){
//                 res.status(400).json({ sucess: false})
//             }
//             break;
//         default:
//             res.status(400).json({ sucess: false})
//             break;
//     }

// } 