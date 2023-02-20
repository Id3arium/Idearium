'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { atom, useAtom } from 'jotai';
import { useNodesTimelineStore } from './../Store';

export const nodesAtom = atom([])
export const currNodeIdxAtom = atom(0)
export const nodeIDsTimelineAtom = atom([])
export const currTimelineIdxAtom = atom('')

// export const getNodesListAtom = atom( (get) => get(nodesStateAtom).nodes.map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const getNodesListAtom = atom( (get) => get(nodesAtom).map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const nodesStateAtom = atom({
	nodes: [],
	currentNode: null,
	nodeIDsTimeline: [],
	currentTimelineIndex: -1 // new atom to keep track of the current index in the timeline
})

export const previousNodeAtom = atom((get, set) => {
	const currentTimelineIndex = get(nodesStateAtom).currentTimelineIndex
	if (currentTimelineIndex > 0) {
		const newCurrentTimelineIndex = currentTimelineIndex - 1
		const nodeIDsTimeline = get(nodesStateAtom).nodeIDsTimeline
		const nodes = get(nodesStateAtom).nodes
		const newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
		set(nodesStateAtom, (prev) => ({
			...prev,
			currentNode: newCurrentNode,
			currentTimelineIndex: newCurrentTimelineIndex
		}))
	}
})

export const nextNodeAtom = atom((get) => {
	const currentTimelineIndex = get(nodesStateAtom).currentTimelineIndex
	const nodeIDsTimeline = get(nodesStateAtom).nodeIDsTimeline
	const nodes = get(nodesStateAtom).nodes
	
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	const atEndOfTimeline = currentTimelineIndex === nodeIDsTimeline.length - 1
	let newCurrentNode = null

	if (atEndOfTimeline){
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[currentTimelineIndex])
	} else {
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(nodesStateAtom, (prev) => ({
		...prev,
		currentNode: newCurrentNode,
		currentTimelineIndex: newCurrentTimelineIndex
	}))
})

export default function NodeCardsArea({nodesData}) {
    // const [nodesState, setNodesState] = useAtom(nodesStateAtom)
	// setNodesState( prev => ({...prev, nodes: nodesData}) )

	const [nodes, setNodes] = useAtom(nodesAtom)

	setNodes(nodesData)
    const [nodesList] = useAtom(getNodesListAtom)

	useEffect( () => {
		// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	}, [nodes])

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

	// function getWeightedRandomNode() {
	// 	let randNum = Math.random(); // range of [0,1)
	// 	let counter = 0;
	// 	for (let i = 0; i < nodes.length; i++) {
	// 		let currNodeFreq = nodes[i].frequency
	// 		//likelyhood of randNum being inside the range is === to the nodes appearance frequency
	// 		let isRandNumInNodeRange = randNum >= counter && randNum < (counter + currNodeFreq)
	// 		if (isRandNumInNodeRange) {
	// 			return nodes[i]
	// 		} else {
	// 			counter += currNodeFreq
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
        
		<StyledNodeCardsArea id="node-cards-area">
            <div> Node Cards Area </div>
			<ul>{ nodesList }</ul>
		 	<NodeCard 
		 		// onIncreaseNodeFreq={increaseNodeFreq} 
		 		// onDecreaseNodeFreq={decreaseNodeFreq} 
		 		// nodeData = {nodes[currNodeID]}
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
