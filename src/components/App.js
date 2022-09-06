import React, { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
//import ForceGraph3d from './components/ForceGraph3D';
import IdeaCompositionArea from "./IdeaCompositionArea.js";
import styled from "styled-components";
import NodeCardsArea from "./NodeCardsArea.js";
import nodesFromJSON from "./nodes.json";
import create from 'zustand'

export const useNodesStore = create((set) => ({
	nodes: [],
	setNodes: (newNodes) => set((state) => ({nodes: [...newNodes]}))
}))

function App() {
	const useLocalStorage = (key, initialValue) => {
		const storedValue = JSON.parse(localStorage.getItem(key))
		const [value, setValue] = React.useState( storedValue ?? initialValue)
		
		React.useEffect(() => {
		  localStorage.setItem(key, JSON.stringify(value))
		}, [value, key])
	  
		return [value, setValue]
	};
	
	const [initialNodes, _] = useLocalStorage("nodes", nodesFromJSON);
	
	useEffect(() => {
		setNodes(initialNodes)
		setWordCounts()
	},[])

	const nodes = useNodesStore(state => state.nodes)
	const setNodes = useNodesStore(state => state.setNodes)

	function getNodeWordCount (node) {
		let titleCount = node.title.split(" ").filter(word => word !== "").length
		let contentCount = node.content.split(" ").filter(word => word !== "").length
		return titleCount + contentCount
	}

	useEffect(() => {
		console.log("nodes",nodes)
	},[nodes])

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

	function addNode(newNodeData){
		let upDatedNodes = updateNodeFrequencies(nodes)
		let newNode = {
			id: nodes.length,
			title: newNodeData.title,
			content: newNodeData.content,
			inspiration: newNodeData.inspiration,
			frequency: 1 / (nodes.length+1),
			wordCount: getNodeWordCount(newNodeData)
		}
		let newNodes = [...upDatedNodes,newNode]
		setNodes(newNodes)
	}

	function updateNodeFrequencies(nodes) {
        let oldNumNodes = nodes.length
        let newNumNodes = oldNumNodes + 1
        let oldDefaultFreq = 1 / oldNumNodes
        let newDefaultFreq = 1 / newNumNodes

        nodes.forEach((node) => {
			let probRatio = node.frequency / oldDefaultFreq
			node.frequency = probRatio * newDefaultFreq
        });
		return nodes
    }


	function setWordCounts(){
		nodes.forEach(node => {
			node.wordCount = getNodeWordCount(node)
		});
	}
				
	return (
		<StyledApp id="App">
			<div className="force-graph">
				<ForceGraph3D graphData={gData()} width={850}>
				</ForceGraph3D>
			</div>
			<div>
				<IdeaCompositionArea onAdd={addNode} />
			</div>
		</StyledApp>
	);
}

export default App;

let StyledApp = styled.div`
	display: flex;
	text-align: center;
`;
