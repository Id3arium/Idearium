import dynamic from 'next/dynamic';
import styles from "./page.module.css";
// import styled from "styled-components";
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
// import IdeaCompositionArea from '../public/components/IdeaCompositionArea.js';
import mongoose from 'mongoose';
import {Node} from '../models/Node.js';

export default async function Home() {

	// const [nodes, setNodes] = useNodesStore(state => [state.nodes, state.setNodes])  //causes useref is not a funcion error
	
	async function getNodesFromDB(){
		await mongoose.connect(process.env.IDEARIUM_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// const data = await db.collection('asdfg').toArray();
		let nodes = await Node.find({}).exec()
		let nodesJSON = JSON.parse(JSON.stringify(nodes))
		await mongoose.connection.close();
		return nodesJSON
	}
	
	let nodesFromServer = await getNodesFromDB()

	// useEffect(() => {
	// 	let nodesJSON = JSON.parse(nodesString)
	// 	console.log("setting the nodes:", nodesJSON)
	// 	setNodes(nodesJSON)
	// }, [nodesString])

	// setWordCounts()

	// function getNodeCharCount(node) {
	// 	//let titleCount = node.title.split(" ").filter(word => word !== "").length
	// 	let titleCount = node.title.length
	// 	let contentCount = node.content.length
	// 	return titleCount + contentCount
	// }

	// function addNode(newNodeData){
	// 	let updatedNodes = updateNodeFrequencies(nodes)
	// 	let newNode = {
	// 		id: nodes.length,
	// 		title: newNodeData.title,
	// 		content: newNodeData.content,
	// 		inspiration: newNodeData.inspiration,
	// 		frequency: 1 / (nodes.length+1),
	// 		charCount: getNodeCharCount(newNodeData)
	// 	}
	// 	let newNodes = [...updatedNodes, newNode]
	// 	setNodes(newNodes)
	// }

	// function updateNodeFrequencies(nodes) {
	// 	let newFreqScalar = nodes.length / (nodes.length + 1)
	//     nodes.forEach((node) => {
	// 		node.frequency = node.frequency * newFreqScalar
	//     });
	// 	return nodes
	// }

	// function setWordCounts(){
	// 	nodes.forEach(node => {
	// 		node.charCount = getNodeCharCount(node)
	// 	});
	// }
	return (
		<main className={styles.main}>
			{/* <Provider store={nodesStore}> */}
				<div id="Home">
					<div>Hello World</div>
					<NodeCardsArea nodes={nodesFromServer} />
				</div>
			{/* </Provider> */}
		</main>
	);
}
