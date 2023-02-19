// import connectToDatabase from '../../../utils/mongodb.js'
// import {Node} from '../../../models/Node.js'
// import express from 'express'

// const app = express()
// const port = 3000

// console.log("connecting to Database")
// await connectToDatabase()
// console.log("connected to Database")

// export default async function handler(req, res){
//     const { method } = req
//     switch (method) {
//         case 'GET':
//             try {
//                 const nodes = await Node.find({})
//                 res.status(200).json({ request: req.method, sucess: true, data: nodes})
//             } catch (error){
//                 res.status(400).json({ request: req.method, sucess: false})
//             }
//             break;
//         case 'POST':
//             try {
//                 const node = await Node.create(req.body)
//                 res.status(201).json({ request: req.method, sucess: true, data: node})
//             } catch (error){
//                 res.status(400).json({ request: req.method, sucess: false})
//             }
//             break;
//         default:
//             res.status(400).json({ request: req.method, sucess: false})
//             break;
//     }
// } 

// app.get('/nodes', (req, res) => {
//     Person.find((error, nodes) => {
//         if (error) {
//             res.status(500).send({ request: req.method, error: error});
//         } else {
//             res.send(nodes);
//         }
//     })
// })

// app.post('/nodes', (req, res) => {
//   const { text } = req.body
//   const id = Node.length + 1
//   Node.push({ id, text, completed: false })
//   res.json({ id, text, completed: false })
// })

// app.put('/nodes/:id', (req, res) => {
//   const { id } = req.params
//   const { text, completed } = req.body
//   const todoIndex = Node.findIndex(todo => todo.id === parseInt(id))
//   if (todoIndex >= 0) {
//     Node[todoIndex] = { id: parseInt(id), text, completed }
//     res.json({ id: parseInt(id), text, completed })
//   } else {
//     res.status(404).json({ error: 'Todo not found' })
//   }
// })

// app.delete('/nodes/:id', (req, res) => {
//   const { id } = req.params
//   const todoIndex = Node.findIndex(todo => todo.id === parseInt(id))
//   if (todoIndex >= 0) {
//     Node.splice(todoIndex, 1)
//     res.json({ message: 'Node deleted' })
//   } else {
//     res.status(404).json({ error: 'Node not found' })
//   }
// })

// // app.listen(port, () => {
// //   console.log(`API listening on port ${port}`)
// // })
