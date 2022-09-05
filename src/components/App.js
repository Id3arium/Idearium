import React, { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
//import ForceGraph3d from './components/ForceGraph3D';
import IdeaCompositionArea from "./IdeaCompositionArea.js";
import styled from "styled-components";
import NodeCardsArea from "./NodeCardsArea.js";
import defaultNodes from "./nodes.json";
import create from "zustand";

const useLocalStorage = (key, initialValue) => {
	const storedValue = JSON.parse(localStorage.getItem(key))
	const [value, setValue] = React.useState( storedValue ?? initialValue)
	
	React.useEffect(() => {
	  localStorage.setItem(key, JSON.stringify(value))
	}, [value, key])
  
	return [value, setValue]
};

function App() {
	const [nodes, setNodes] = useLocalStorage("nodes", defaultNodes);

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
		setNodes((prevNodes)=>{
			updateNodeFrequencies()
			let newNodeData = {
				id: nodes.length,
				title: newNode.title,
				content: newNode.content,
				inspiration: newNode.inspiration,
				frequency: 1 / (prevNodes.length+1)
			}
			return [...prevNodes,newNodeData]
		})
		console.log("nodes",nodes)
	}

	function updateNodeFrequencies() {
        let oldNumNodes = nodes.length
        let newNumNodes = oldNumNodes + 1
        let oldDefaultFreq = 1 / oldNumNodes
        let newDefaultFreq = 1 / newNumNodes

        nodes.forEach((node) => {
			let probRatio = node.frequency / oldDefaultFreq
			node.frequency = probRatio * newDefaultFreq
        });
    }

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
