const mongoose = require('mongoose');
require('dotenv').config();

connectToNodesDB()

export default function connectToNodesDB() {
    mongoose.connect(process.env.IdeariumURI, { useNewUrlPArser: true });

    const nodeSchema = new mongoose.Schema(
        {
            "id": String,
            "title": String,
            "content": String,
            "inspiration": { type:String, required: [true, "Y no inspiration?"]},
            "frequency": Number,
            "ranking": Number
        }
    )
    const Node = mongoose.model("Node", nodeSchema);

    const genesisNode = new Node({
        "id": 8,
        "title": "Live a Life of Truth in the Service of Love",
        "content": "Truth, means facing the terrifying uncertainty of not saying things I know to be false. To love, means the desire for the good in me to serve the best in others. To see even the most bent, broken, miserable, malevolent, hurt, corrupt, weak, pathetic, contemtible, frustrating or dissapointing beings and instead of dissmising or despising them, to want to help them rise out of their brokenness.",
        "inspiration": "Jordan Peterson",
        "frequency": 0.125
    })

    genesisNode.save().then(() => console.log('saved genesis node'));

    // Node.insertMany(nodesList, (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(added, nodesList)
    //     }

    // })

    Node.find((err, nodesList) => {
        if (err) {
            console.log(err)
        } else {
            console.log(nodesList)
            nodesList.forEach((node) => console.log(node.title ? node.title : `Node ID:${node.id}`))
        }
    })

    function updateNodeContent(nodeID, newContent){
        Node.updateOne({_id: nodeID}, {content: newContent}, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Sucessfully updated node ${nodeID}`)
            }
        })
    }
    
    function deleteNode(nodeID){
        Node.deleteOne({_id: nodeID}, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Sucessfully deleted node ${nodeID}`)
            }
        })
    }
   
    //mogoose.connection.close()
}

