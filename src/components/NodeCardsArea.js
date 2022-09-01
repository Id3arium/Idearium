import React, {useState, useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";

export default function NodeCardsArea(props) {
	let nodesTimeline = [getWeightedRandomNodeID()]
  	let [currTimelineIdx, setcurrTimelineIdx] = useState(0);
	  
	function getNodeData(timelineIdx){
		let nodeID = nodesTimeline[timelineIdx]
		let nodeData = props.nodes[nodeID]
		return nodeData
	}
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
		let oldNumNodes = props.nodes.length;
		let newNumNodes = oldNumNodes + nodeNumDelta;
		let oldDefaultFreq = 1 / oldNumNodes;
		let newDefaultFreq = 1 / newNumNodes;

		props.nodes.forEach((node) => {
			if (node.hasOwnProperty("probability")) {
				let probRatio = node.frequency / oldDefaultFreq;
				node.frequency = probRatio * newDefaultFreq;
			}
		});
	}

	function getWeightedRandomNodeID() {
		let randNum = Math.random(); // range of [0,1)
		let counter = 0;
		for (let i = 0; i < props.nodes.length; i++) {
			let currNodeFreq = props.nodes[i].frequency
			let isInCounterRange = randNum >= counter && randNum < (counter + currNodeFreq)
			if (isInCounterRange) {
				return props.nodes[i].id
			} else {
				counter += currNodeFreq
			}
		}
		return props.nodes[-1].id
	}

	function changeNodeFrquency(nodeId, isIncreased) {
		let numNodes = props.nodes.length;
		let numerator = isIncreased ? 1 : -1;
		let freqModifier = numerator / (numNodes * numNodes);

		let newFrequency = props.nodes[nodeId].frequency + numNodes * freqModifier;

		if (Math.abs(1 - newFrequency) >= 1e-12) {
			props.nodes[nodeId].frequency = newFrequency;

			//redistribute frequencies of other nodes so they still add up to ~1
			props.nodes.forEach((node) => {
				node.frequency -= freqModifier;
			});
		}
	}
  return (
    <StyledNodeCardsArea id="node-cards-area">
        <NodeCard 
			nodeData={getNodeData(currTimelineIdx)} 
			onNext={onNextNodeCard} 
			onPrev={onPrevNodeCard} 
			//onDelete={}
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
