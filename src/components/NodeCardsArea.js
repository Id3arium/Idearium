import React, {useState, useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { useNodesStore, useNodesTimelineStore } from "../Store.js";

export default function NodeCardsArea() {
	let nodeIDsTimeline = useNodesTimelineStore(state => state.nodeIDsTimeline)
	let addNodeIDToTimeline = useNodesTimelineStore(state => state.addNodeIDToTimeline)
    let currTimelineIdx = useNodesTimelineStore(state => state.currTimelineIdx)
	let setCurrTimelineIdx = useNodesTimelineStore(state => state.setCurrTimelineIdx)
	let nodes = useNodesStore(state => state.nodes)
	console.log("nodes",nodes)

	if (nodeIDsTimeline.length === 0){
		addNodeIDToTimeline(getWeightedRandomNodeID())
	}

	
	useEffect(() => {
		const intervalID = setInterval(() => {}, 3000);
		return () => {
		  clearInterval(intervalID);
		};
	  }, []);

	function onNextNodeCard(){
		let isAtEndOfTimeline = currTimelineIdx === nodeIDsTimeline.length - 1
		if(isAtEndOfTimeline) {
			let newNodeID = getWeightedRandomNodeID()
			while(newNodeID === nodeIDsTimeline.at(-1)){
				newNodeID = getWeightedRandomNodeID()
			}
			addNodeIDToTimeline(newNodeID)
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

	function changeNodeFrquency(nodeID, isIncreased) {
		let numNodes = nodes.length;
		let numerator = isIncreased ? 1 : -1;
		let freqModifier = numerator / (numNodes * numNodes);

		let newFrequency = nodes[nodeID].frequency + numNodes * freqModifier;

		if (Math.abs(1 - newFrequency) >= 1e-12) {
			nodes[nodeID].frequency = newFrequency;

			nodes.forEach((node) => {
				node.frequency -= freqModifier;
			});
		}
	}

	let increaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, true)
	let decreaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, false)
	return (
		<StyledNodeCardsArea id="node-cards-area">
			<NodeCard 
				onNext={onNextNodeCard} 
				onPrev={onPrevNodeCard} 
				onIncreaseNodeFreq={increaseNodeFreq} 
				onDecreaseNodeFreq={decreaseNodeFreq} 
				timePerWord={100}
			/>
		</StyledNodeCardsArea>
	);
}

let StyledNodeCardsArea = styled.div`
	position: absolute;
	top: 200px;
	left: 100px;
	transform: translate(0%,0%);
	margin: 20px;
	overflow-y: hidden;
	height: 600px;
	width: 600px;
`;
