import React, { useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
//import ForceGraph3d from './components/ForceGraph3D';
import CreateArea from "./CreateArea.js";
import styled from "styled-components";
import NodeCardsArea from "./NodeCardsArea.js";
import defaultNodes from "./nodes.json";
import zustand from "zustand";

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
			inspiration: newNode.inspiration
		}
		setNodes([...nodes,newNodeData])
	}

  	useEffect(() => {}, []);

	console.log(gData());
	return (
		<StyledApp id="App">
			<div className="force-graph">
				<ForceGraph3D graphData={gData()} width={850} />
			</div>
			<div>
				<CreateArea onAdd={addNode} />
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
