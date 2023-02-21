'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { useAtom, Provider, useStore } from 'jotai';
import { nodesStore, nodesAtom, currentNodeAtom, getWeightedRandomNodeAtom } from '@/public/atoms.js';

export default function NodeCardsArea({nodesData}) {
	const [nodes, setNodes] = useAtom(nodesAtom)
	const [currentNode, setCurrentNode] = useAtom(currentNodeAtom)
	const [weightedRandomNode] = useAtom(getWeightedRandomNodeAtom)
    
	setNodes(nodesData)
	setCurrentNode(weightedRandomNode)
	// console.log("NodeCardsArea nodes", nodes)
	console.log("NodeCardsArea currentNode", currentNode?._id)
	// setCurrentNode(getWeightedRandomNode(nodes))
	// useEffect( () => {
	// 	// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	// }, [nodes, currentNode])

	// if (nodeIDsTimeline.length === 0){
	// 	setNodeIDsTimeline((prev) => [...prev, getWeightedRandomNode()] )
	// 	// addNodeIDToTimeline()
	// }

	// function onNextNodeCard(){
	// 	let isAtEndOfTimeline = currTimelineIdx === nodeIDsTimeline.length - 1
	// 	if(isAtEndOfTimeline) {
	// 		let newNodeID = getWeightedRandomNode()
	// 		while(newNodeID === nodeIDsTimeline.at(-1)){
	// 			newNodeID = getWeightedRandomNode()
	// 		}
	// 		addNodeIDToTimeline(newNodeID)
	// 		return newNodeID
	// 	} else {
	// 		setCurrTimelineIdx(currTimelineIdx+1)
	// 		return nodeIDsTimeline[currTimelineIdx+1]
	// 	}
	// }

	// function onPrevNodeCard(){
	// 	let isAtBeginningOfTimeline = currTimelineIdx === 0
	// 	if(!isAtBeginningOfTimeline) {
	// 		setCurrTimelineIdx(currTimelineIdx-1)
	// 		return nodeIDsTimeline[currTimelineIdx+1]
	// 	}
	// }

	// gets a random node, but nodes with higher frequency are more likely to be chosen
	// function getWeightedRandomNode(nodes) {
	// 	let randNum = Math.random(); 	// range of [0,1)
	// 	let frequencySigma = 0; 	//the frequency of all nodes must add up to ~1 
	// 	for (let i = 0; i < nodes.length; i++) {
	// 		let currentNodeFrequency = nodes[i].frequency
	// 		//likelyhood of randNum being inside the range is === to the nodes appearance frequency
	// 		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + currentNodeFrequency)
	// 		if (isRandNumInNodeRange) {
	// 			console.log("random node is node at index", i, nodes[i].title)
	// 			return nodes[i]
	// 		} else {
	// 			frequencySigma += currentNodeFrequency
	// 		}
	// 	}
	// }
	// function changeNodeFrquency(nodeIdx, isIncreased) {
	// 	let numNodes = nodes.length;
	// 	let numerator = isIncreased ? 1 : -1;
	// 	let freqModifier = numerator / (numNodes * numNodes);

	// 	let newFrequency = nodes[nodeIdx].frequency + numNodes * freqModifier;

	// 	let tempNodes = [...nodes]
	// 	if (Math.abs(1 - newFrequency) >= 1e-12) {
	// 		tempNodes[nodeIdx].frequency = newFrequency;

	// 		tempNodes.forEach((node) => {
	// 			node.frequency -= freqModifier;
	// 		});
	// 	}
	// 	setNodes(tempNodes)
	// }

	// let increaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, true)
	// let decreaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, false)
	return (
		<div id="node-cards-area">
            <div> Node Cards Area </div>
			{/* <button onClick={() => { setCurrentNode(getWeightedRandomNode(nodes))}}>
				randomize
			</button> */}
			<ul>
              <li key={currentNode?._id}> {currentNode?._id} {currentNode?.title} { currentNode?.content} </li> 
            </ul>
			<Provider>
				<NodeCard
					// onIncreaseNodeFreq={increaseNodeFreq} 
					// onDecreaseNodeFreq={decreaseNodeFreq} 
					// nodeData = {currentNode}
					duration = {1000}
				/>
			</Provider>
		</div>
	);
}

// let StyledNodeCardsArea = styled.div`
// 	position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -70%);
// 	margin: 20px;
// 	overflow-y: hidden;
// 	width: 600px;
// `;
