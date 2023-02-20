'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { atom, useAtom } from 'jotai';
import { useNodesTimelineStore } from './../Store';

export const nodesAtom = atom([])
export const currentNodeAtom = atom(null)
export const nodeIDsTimelineAtom = atom([])
export const currentTimelineIndexAtom = atom(-1)

// export const getNodesListAtom = atom( (get) => get(nodesStateAtom).nodes.map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const getNodesListAtom = atom( (get) => get(nodesAtom).map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const nodesStateAtom = atom({
	nodes: [],
	currentNode: null,
	nodeIDsTimeline: [],
	currentTimelineIndex: -1 // new atom to keep track of the current index in the timeline
})

//gets a random node, but nodes with higher frequency are more likely to be chosen
export const getWeightedRandomNodeAtom = atom( (get) => {
	const nodes = get(nodesAtom)
	if (!nodes) { return null; }
	let randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 

	for (let i = 0; i < nodes.length; i++) {
		let currentNodeFrequency = nodes[i].frequency
		console.log("node ", i, "has frequency", nodes[i].frequency)
		//likelyhood of randNum being inside the range is === to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + currentNodeFrequency)
		if (isRandNumInNodeRange) {
			console.log("random node is node at index", i, nodes[i].title)
			return nodes[i]
		} else {
			frequencySigma += currentNodeFrequency
		}
	}
})

export const previousNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex > 0) {
		const newCurrentTimelineIndex = currentTimelineIndex - 1
		const nodeIDsTimeline = get(nodeIDsTimelineAtom)
		const nodes = get(nodesAtom)
		const newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
		set(currentNodeAtom, newCurrentNode)
		set(currentTimelineIndexAtom, newCurrentTimelineIndex)
		// set(nodesStateAtom, (prev) => ({
		// 	...prev,
		// 	currentNode: newCurrentNode,
		// 	currentTimelineIndex: newCurrentTimelineIndex
		// }))
	}
})

export const nextNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	const atEndOfTimeline = currentTimelineIndex === nodeIDsTimeline.length - 1
	let newCurrentNode = null

	if (atEndOfTimeline){
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[currentTimelineIndex])
	} else {
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	// set(nodesStateAtom, (prev) => ({
	// 	...prev,
	// 	currentNode: newCurrentNode,
	// 	currentTimelineIndex: newCurrentTimelineIndex
	// }))
})

export default function NodeCardsArea({nodesData}) {
    // const [nodesState, setNodesState] = useAtom(nodesStateAtom)
	// setNodesState( prev => ({...prev, nodes: nodesData}) )

	const [nodes, setNodes] = useAtom(nodesAtom)
	const [weightedRandomNode] = useAtom(getWeightedRandomNodeAtom)
	const [currentNode, setCurrentNode] = useAtom(currentNodeAtom)

	setNodes(nodesData)
	// setCurrentNode(getWeightedRandomNode(nodes))
	setCurrentNode(weightedRandomNode)

	console.log("NodeCardsArea nodes", nodes)

	useEffect( () => {
		// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	}, [nodes, currentNode])

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
	function getWeightedRandomNode(nodes) {
		let randNum = Math.random(); // range of [0,1)
		let frequencySigma = 0; //the frequency of all nodes must add up to ~1 
		console.log("picking random weighted node from", nodes)
		
		for (let i = 0; i < nodes.length; i++) {
			let currentNodeFrequency = nodes[i].frequency
			console.log("node ", i, "has frequency", nodes[i].frequency)
			//likelyhood of randNum being inside the range is === to the nodes appearance frequency
			let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + currentNodeFrequency)
			if (isRandNumInNodeRange) {
				console.log("random node is node at index", i, nodes[i].title)
				return nodes[i]
			} else {
				frequencySigma += currentNodeFrequency
			}
		}
	}

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
        
		<StyledNodeCardsArea id="node-cards-area">
            <div> Node Cards Area </div>
			
		 	<NodeCard 
		 		// onIncreaseNodeFreq={increaseNodeFreq} 
		 		// onDecreaseNodeFreq={decreaseNodeFreq} 
		 		nodeData = {currentNode}
		 		duration = {1000}
		 		// duration = {currCardDuration}
		 	/>
		</StyledNodeCardsArea>
	);
}

let StyledNodeCardsArea = styled.div`
	position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
	margin: 20px;
	overflow-y: hidden;
	width: 600px;
`;
