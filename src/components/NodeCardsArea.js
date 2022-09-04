import React, {useState, useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import create from 'zustand'

export const useNodeCardsAreaStore = create((set) => ({
	nodeIDsTimeline: [],
	currTimelineIdx: 0,
	currNodeID:0,
	setCurrTimelineIdx: (idx) => set((state) => ({
		currTimelineIdx: idx,
		currNodeID: state.nodeIDsTimeline[idx]
	})),
	addNodeIDToTimeline: (newNodeID) => set((state) => ({
		nodeIDsTimeline: [...state.nodeIDsTimeline,newNodeID],
	})),
}))

export default function NodeCardsArea(props) {
	let nodeIDsTimeline = useNodeCardsAreaStore(state => state.nodeIDsTimeline)
	let addNodeIDToTimeline = useNodeCardsAreaStore(state => state.addNodeIDToTimeline)
    let currTimelineIdx = useNodeCardsAreaStore(state => state.currTimelineIdx)
	let setCurrTimelineIdx = useNodeCardsAreaStore(state => state.setCurrTimelineIdx)
	let currNodeID = useNodeCardsAreaStore(state => state.currNodeID)

	if (nodeIDsTimeline.length === 0){
		addNodeIDToTimeline(getWeightedRandomNodeID())
		setCurrTimelineIdx(0)
	}

	function onNextNodeCard(){
		let isAtEndOfTimeline = currTimelineIdx === nodeIDsTimeline.length - 1
		if(isAtEndOfTimeline) {
			let newNodeID = getWeightedRandomNodeID()
			while(newNodeID === nodeIDsTimeline.at(-1)){
				newNodeID = getWeightedRandomNodeID()
			}
			addNodeIDToTimeline(newNodeID)
			setCurrTimelineIdx(currTimelineIdx+1)
			console.log("nodesTimeline",nodeIDsTimeline)
		} else {
			setCurrTimelineIdx(currTimelineIdx+1)
		}
	}

	function onPrevNodeCard(){
		let isAtBeginningOfTimeline = currTimelineIdx === 0
		if(!isAtBeginningOfTimeline) {
			setCurrTimelineIdx(currTimelineIdx-1)
		}
	}

	function getWeightedRandomNodeID() {
		let randNum = Math.random(); // range of [0,1)
		let counter = 0;
		for (let i = 0; i < props.nodes.length; i++) {
			let currNodeFreq = props.nodes[i].frequency
			//likelyhood of randNum being inside the range is === to the nodes appearance frequency
			let isRandNumInNodeRange = randNum >= counter && randNum < (counter + currNodeFreq)
			if (isRandNumInNodeRange) {
				return props.nodes[i].id
			} else {
				counter += currNodeFreq
			}
		}
	}

	function changeNodeFrquency(nodeID, isIncreased) {
		let numNodes = props.nodes.length;
		let numerator = isIncreased ? 1 : -1;
		let freqModifier = numerator / (numNodes * numNodes);

		let newFrequency = props.nodes[nodeID].frequency + numNodes * freqModifier;

		if (Math.abs(1 - newFrequency) >= 1e-12) {
			props.nodes[nodeID].frequency = newFrequency;

			props.nodes.forEach((node) => {
				node.frequency -= freqModifier;
			});
		}
	}

	let getCurrNodeData = () => props.nodes[currNodeID]
	let increaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, true)
	let decreaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, false)
	return (
		<StyledNodeCardsArea id="node-cards-area">
			<NodeCard 
				nodeData={getCurrNodeData()} 
				onNext={onNextNodeCard} 
				onPrev={onPrevNodeCard} 
				onIncreaseNodeFreq={increaseNodeFreq} 
				onDecreaseNodeFreq={decreaseNodeFreq} 
			/>
		</StyledNodeCardsArea>
	);
}

let StyledNodeCardsArea = styled.div`
	margin: 20px;
	overflow-y: hidden;
	height: 600px;
	width: 600px;
	border: 2px solid black;
`;
