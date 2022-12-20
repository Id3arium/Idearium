import connectToDatabase from '../../../utils/mongodb.js'
import {Node} from '../../../models/Node.js'
import express from 'express'

const app = express()
const port = 3000

connectToDatabase()

export default async function handler(req, res){
    const { method } = req
    switch (method) {
        case 'GET':
            try {
                const nodes = await Node.find({})
                res.status(200).json({ sucess: true, data: nodes})
            } catch (error){
                res.status(400).json({ sucess: false})
            }
            break;
        case 'POST':
            try {
                const node = await Node.create(req.body)
                res.status(201).json({ sucess: true, data: node})
            } catch (error){
                res.status(400).json({ sucess: false})
            }
            break;
        default:
            res.status(400).json({ sucess: false})
            break;
    }
} 

// app.get('/Nodes', (req, res) => {
//   res.json({ test: 'test' })
// })

// app.post('/Nodes', (req, res) => {
//   // Get the todo text from the request body
//   const { text } = req.body
//   // Generate a new id
//   const id = Nodes.length + 1
//   // Add the new todo to the Nodes array
//   Nodes.push({ id, text, completed: false })
//   // Return the new todo
//   res.json({ id, text, completed: false })
// })

// app.put('/Nodes/:id', (req, res) => {
//   // Get the todo id from the request parameters
//   const { id } = req.params
//   // Get the updated text and completed flag from the request body
//   const { text, completed } = req.body
//   // Find the index of the todo with the matching id
//   const todoIndex = Nodes.findIndex(todo => todo.id === parseInt(id))
//   // If a todo with the matching id was found, update it
//   if (todoIndex >= 0) {
//     Nodes[todoIndex] = { id: parseInt(id), text, completed }
//     res.json({ id: parseInt(id), text, completed })
//   } else {
//     // If no todo was found, return an error
//     res.status(404).json({ error: 'Todo not found' })
//   }
// })

// app.delete('/Nodes/:id', (req, res) => {
//   // Get the todo id from the request parameters
//   const { id } = req.params
//   // Find the index of the todo with the matching id
//   const todoIndex = Nodes.findIndex(todo => todo.id === parseInt(id))
//   // If a todo with the matching id was found, delete it
//   if (todoIndex >= 0) {
//     Nodes.splice(todoIndex, 1)
//     res.json({ message: 'Todo deleted' })
//   } else {
//     // If no todo was found, return an error
//     res.status(404).json({ error: 'Todo not found' })
//   }
// })

// app.listen(port, () => {
//   console.log(`API listening on port ${port}`)
// })
