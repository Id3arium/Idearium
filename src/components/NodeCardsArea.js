import React, {useState, useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import create from 'zustand'

export const useNodeCardsAreaStore = create((set) => ({
	nodesTimeline: [],
	currTimelineIdx: 0,
	setNodesTimeline: (timeLine) => set((state) => ({nodesTimeline: timeLine})),
	setcurrTimelineIdx: (i) => set((state) => ({currTimelineIdx: i})),

}))

export default function NodeCardsArea(props) {
	let nodesTimeline = useNodeCardsAreaStore(state => state.nodesTimeline)
	let currTimelineIdx = useNodeCardsAreaStore(state => state.currTimelineIdx)
	let setNodesTimeline = useNodeCardsAreaStore(state => state.setNodesTimeline)
	let setCurrTimelineIdx = useNodeCardsAreaStore(state => state.setCurrTimelineIdx)

	if (nodesTimeline.length === 0){
		nodesTimeline = [getWeightedRandomNodeID()]
	}

	function getNodeData(timelineIdx){
		let nodeID = nodesTimeline[timelineIdx]
		let nodeData = props.nodes[nodeID]
		return nodeData
	}
	function onNextNodeCard(){
		let isAtEndOfTimeline = currTimelineIdx === nodesTimeline.length - 1
		if(isAtEndOfTimeline) {
			let newNodeID = getWeightedRandomNodeID()
			while(newNodeID === nodesTimeline.at(-1)){
				newNodeID = getWeightedRandomNodeID()
			}
			setNodesTimeline([...nodesTimeline,newNodeID])
		} 
		setCurrTimelineIdx(currTimelineIdx+1)
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
			let isInCounterRange = randNum >= counter && randNum < (counter + currNodeFreq)
			if (isInCounterRange) {
				return props.nodes[i].id
			} else {
				counter += currNodeFreq
			}
		}
	}

	function changeNodeFrquency(nodeId, isIncreased) {
		let numNodes = props.nodes.length;
		let numerator = isIncreased ? 1 : -1;
		let freqModifier = numerator / (numNodes * numNodes);

		let newFrequency = props.nodes[nodeId].frequency + numNodes * freqModifier;

		if (Math.abs(1 - newFrequency) >= 1e-12) {
			props.nodes[nodeId].frequency = newFrequency;

			props.nodes.forEach((node) => {
				node.frequency -= freqModifier;
			});
		}
	}

	function updateNodeFrequencies(nodeNumDelta) {
        let oldNumNodes = props.nodes.length;
        let newNumNodes = oldNumNodes + nodeNumDelta;
        let oldDefaultFreq = 1 / oldNumNodes;
        let newDefaultFreq = 1 / newNumNodes;

        props.nodes.forEach((node) => {
            if (node.hasOwnProperty("frequency")) {
                let probRatio = node.frequency / oldDefaultFreq;
                node.frequency = probRatio * newDefaultFreq;
            }
        });
    }

	let increaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, true)
	let decreaseNodeFreq = (nodeID) => changeNodeFrquency(nodeID, false)
	return (
		<StyledNodeCardsArea id="node-cards-area">
			<NodeCard 
				nodeData={getNodeData(currTimelineIdx)} 
				onNext={onNextNodeCard} 
				onPrev={onPrevNodeCard} 
				onIncreaseNodeFreq={increaseNodeFreq} 
				onDecreaseNodeFreq={decreaseNodeFreq} 
				timelineSize={nodesTimeline.length}
				currTimelineIdx={currTimelineIdx}
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
