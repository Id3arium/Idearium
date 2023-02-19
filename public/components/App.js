// import React, { useEffect, useState } from "react";
// // import { ForceGraph3D } from "react-force-graph";
// // import IdeaCompositionArea from "./IdeaCompositionArea.js";
// import styled from "styled-components";
// import NodeCardsArea from "./NodeCardsArea.js";
// import { useNodesStore } from "../Store.js";

// function App() {

// 	// const {nodes, setNodes} = useNodesStore()
// 	const nodes = useNodesStore(state => state.nodes)
// 	const setNodes = useNodesStore(state => state.setNodes)

// 	// connectToNodesDB()
	
// 	setWordCounts()
// 	function getNodeCharCount (node) {
// 		//let titleCount = node.title.split(" ").filter(word => word !== "").length
// 		let titleCount = node.title.length
// 		let contentCount = node.content.length
// 		return titleCount + contentCount
// 	}

//   	let gData = () => {
// 		// Random tree
// 		const clusterSize = nodes.length;
// 		return {
// 		nodes: [...Array(clusterSize).keys()].map((i) => ({ id: i })),
// 		links: [...Array(clusterSize).keys()].filter((id) => id).map((id) => ({
// 			source: id,
// 			target: Math.round(Math.random() * (id - 1)),
// 			})),
// 		};
// 	};

// 	function addNode(newNodeData){
// 		let upDatedNodes = updateNodeFrequencies(nodes)
// 		let newNode = {
// 			id: nodes.length,
// 			title: newNodeData.title,
// 			content: newNodeData.content,
// 			inspiration: newNodeData.inspiration,
// 			frequency: 1 / (nodes.length+1),
// 			charCount: getNodeCharCount(newNodeData)
// 		}
// 		let newNodes = [...upDatedNodes,newNode]
// 		setNodes(newNodes)
// 	}

// 	function updateNodeFrequencies(nodes) {
//         let oldNumNodes = nodes.length
//         let newNumNodes = oldNumNodes + 1
//         let oldDefaultFreq = 1 / oldNumNodes
//         let newDefaultFreq = 1 / newNumNodes

//         nodes.forEach((node) => {
// 			let probRatio = node.frequency / oldDefaultFreq
// 			node.frequency = probRatio * newDefaultFreq
//         });
// 		return nodes
//     }

// 	function setWordCounts(){
// 		nodes.forEach(node => {
// 			node.charCount = getNodeCharCount(node)
// 		});
// 	}
				
// 	return (
// 		<StyledApp id="App">
// 			<div className="force-graph">
// 				{/* <ForceGraph3D graphData={gData()}/> */}
// 			</div>
// 			<div>
// 				{/* <IdeaCompositionArea onAdd={addNode} /> */}
// 				<NodeCardsArea/>
				
// 			</div>
// 		</StyledApp>
// 	);
// }

// export default App;

// let StyledApp = styled.div`
// 	height: 100%;
// 	display: flex;
// 	text-align: center;
// `;
