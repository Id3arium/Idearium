import React, {useState, useEffect}from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";

export default function NodeCardsArea({ nodes }) {
	let nodesTimeline = [getWeightedRandomNodeID()]
  	let [currTimelineIdx, setcurrTimelineIdx] = useState(nodesTimeline[0]);
	//useEffect(() => {
	//	// if user 
	//},[currNodeID])	

	function onNextNodeCard(){
		let isAtEndOfTimeline = currTimelineIdx === nodesTimeline.length - 1
		if(isAtEndOfTimeline) {
			let newNodeID = getWeightedRandomNodeID()
			nodesTimeline.push(newNodeID)
			setcurrTimelineIdx(nodesTimeline.at(-1))
		} else {
			setcurrTimelineIdx(currTimelineIdx+1)
		}
	}

	function onPrevNodeCard(){
		let isAtBegginingOfTimeline = currTimelineIdx = 0
		if(!isAtBegginingOfTimeline) {
			setcurrTimelineIdx(currTimelineIdx-1)
		}
	}

	function updateNodeFrequencies(nodeNumDelta) {
		let oldNumNodes = nodes.length;
		let newNumNodes = oldNumNodes + nodeNumDelta;
		let oldDefaultFreq = 1 / oldNumNodes;
		let newDefaultFreq = 1 / newNumNodes;

		nodes.forEach((node) => {
			if (node.hasOwnProperty("probability")) {
				let probRatio = node.frequency / oldDefaultFreq;
				node.frequency = probRatio * newDefaultFreq;
			}
		});
	}

	function getWeightedRandomNodeID() {
		let interval = 1 / nodes.length;
		let randNum = Math.random(); // range of [0,1)
		let counter = 0;
		nodes.forEach((node) => {
			//check if rand number is between counter and counter + nodes frequency
			if (randNum >= counter && randNum < counter + node.frequency) {
				return node.id;
			} else {
				counter += node.frequency;
			}
		});
	}

	function changeNodeFrquency(nodeId, isIncreased) {
		let numNodes = nodes.length;
		let numerator = isIncreased ? 1 : -1;
		let freqModifier = numerator / (numNodes * numNodes);

		let newFrequency = nodes[nodeId].frequency + numNodes * freqModifier;

		if (Math.abs(1 - newFrequency) >= 1e-12) {
			nodes[nodeId].frequency = newFrequency;

			//redistribute frequencies of other nodes so they still add up to ~1
			nodes.forEach((node) => {
				node.frequency -= freqModifier;
			});
		}
	}
  return (
    <StyledNodeCardsArea>
        <NodeCard 
			nodeData={nodes[nodesTimeline[currTimelineIdx]]} 
			onNext={onNextNodeCard} 
			onPrev={onPrevNodeCard} 
			//onDelete={}
		/>
    </StyledNodeCardsArea>
  );
}

let StyledNodeCardsArea = styled.div`
	overflow-y: hidden;
	height: 600px;
	border: 2px solid black;
`;
