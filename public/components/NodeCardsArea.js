'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { atom, useAtom } from 'jotai';
import { useNodesTimelineStore } from './../Store';

export const nodesAtom = atom([])
export const currNodeIDAtom = atom('')
export const getNodesListAtom = atom( (get) => get(nodesAtom).map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const nodeIDsTimelineAtom = atom([])
export const currTimelineIdxAtom = atom('')

export default function NodeCardsArea({nodesData}) {
    const [nodes, setNodes] = useAtom(nodesAtom)
    const [currNodeID, setCurrNodeID] = useAtom(currNodeIDAtom)
    const [nodeIDsTimeline, setNodeIDsTimeline] = useAtom(nodeIDsTimelineAtom)
    const [currTimelineIdx, setCurrTimelineIdx] = useAtom(currTimelineIdxAtom)

	setNodes(nodesData)
    const [nodesList] = useAtom(getNodesListAtom)

	useEffect( () => {
		// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	}, [])

	// if (nodeIDsTimeline.length === 0){
	// 	setNodeIDsTimeline((prev) => [...prev, getWeightedRandomNodeID()] )
	// 	// addNodeIDToTimeline()
	// }

	// function onNextNodeCard(){
	// 	let isAtEndOfTimeline = currTimelineIdx === nodeIDsTimeline.length - 1
	// 	if(isAtEndOfTimeline) {
	// 		let newNodeID = getWeightedRandomNodeID()
	// 		while(newNodeID === nodeIDsTimeline.at(-1)){
	// 			newNodeID = getWeightedRandomNodeID()
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

	function getWeightedRandomNodeID() {
		let randNum = Math.random(); // range of [0,1)
		let counter = 0;
		for (let i = 0; i < nodes.length; i++) {
			let currNodeFreq = nodes[i].frequency
			//likelyhood of randNum being inside the range is === to the nodes appearance frequency
			let isRandNumInNodeRange = randNum >= counter && randNum < (counter + currNodeFreq)
			if (isRandNumInNodeRange) {
				return nodes[i].id
			} else {
				counter += currNodeFreq
			}
		}
	}

	// function changeNodeFrquency(nodeID, isIncreased) {
	// 	let numNodes = nodes.length;
	// 	let numerator = isIncreased ? 1 : -1;
	// 	let freqModifier = numerator / (numNodes * numNodes);

	// 	let newFrequency = nodes[nodeID].frequency + numNodes * freqModifier;

	// 	let tempNodes = [...nodes]
	// 	if (Math.abs(1 - newFrequency) >= 1e-12) {
	// 		tempNodes[nodeID].frequency = newFrequency;

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
            {/* <div> Node Cards Area </div> */}
			
		 	<NodeCard 
		 		// onNext={onNextNodeCard} 
		 		// onPrev={onPrevNodeCard} 
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
