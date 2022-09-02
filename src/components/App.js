import React, { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
//import ForceGraph3d from './components/ForceGraph3D';
import IdeaCompositionArea from "./IdeaCompositionArea.js";
import styled from "styled-components";
import NodeCardsArea from "./NodeCardsArea.js";
import defaultNodes from "./nodes.json";
import create from "zustand";

function App() {
	let [nodes,setNodes] = useState(defaultNodes)
  	let gData = () => {
		// Random tree
		const clusterSize = 100;
		return {
		nodes: [...Array(clusterSize).keys()].map((i) => ({ id: i })),
		links: [...Array(clusterSize).keys()]
			.filter((id) => id)
			.map((id) => ({
			source: id,
			target: Math.round(Math.random() * (id - 1)),
			})),
		};
	};

	function addNode(newNode){
		let newNodeData = {
			id: nodes.length,
			title: newNode.title,
			content: newNode.content,
			inspiration: newNode.inspiration,
			frequency:0
		}
		setNodes([...nodes,newNodeData])
		updateNodeFrequencies()
		console.log("nodes",nodes)
	}

	function updateNodeFrequencies(nodeNumDelta) {
        let oldNumNodes = nodes.length;
        let newNumNodes = oldNumNodes + nodeNumDelta;
        let oldDefaultFreq = 1 / oldNumNodes;
        let newDefaultFreq = 1 / newNumNodes;

        nodes.forEach((node) => {
			let probRatio = node.frequency / oldDefaultFreq;
			node.frequency = probRatio * newDefaultFreq;
        });
    }

	//console.log(gData());
	return (
		<StyledApp id="App">
			<div className="force-graph">
				<ForceGraph3D graphData={gData()} width={850} />
			</div>
			<div>
				<IdeaCompositionArea onAdd={addNode} />
				<NodeCardsArea nodes={nodes} />
			</div>
		</StyledApp>
	);
}

export default App;

let StyledApp = styled.div`
	display: flex;
	text-align: center;
`;
