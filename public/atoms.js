"use client";
import { atom, createStore } from 'jotai';

// export const nodeIdsTimelineStore = createStore({
// 	timeline: nodeIDsTimelineAtom,
// 	currentIndex: currentTimelineIndexAtom,
// 	length: nodeIDsTimelineLengthAtom
// })

// export const nodesStore = createStore({
// 	nodes: nodesAtom,
// 	currentNode: currentNodeAtom,
// 	nodeIDsTimeline: nodeIDsTimelineAtom,
// 	currentTimelineIndex: currentTimelineIndexAtom 
// })

export const nodesAtom = atom([])
export const currentNodeAtom = atom(null)
export const currentTimelineIndexAtom = atom(-1)
export const nodeIDsTimelineAtom = atom([])
export const nodeIDsTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length)

export const nodeByIDAtom = atom(
	(get, set, nodeID) => get(nodesAtom).find(node => node._id == nodeID),
	(get, set, nodeID) => {
		let node = get(nodesAtom).find(node => node._id == nodeID)
	}
)

export const weightedRandomNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	let randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i]._id === get(currentNodeAtom)?._id) { continue; }
		//likelyhood of randNum being inside the range is = to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + nodes[i].frequency)
		if (isRandNumInNodeRange) {
			return nodes[i]
		} else {
			frequencySigma += nodes[i].frequency
		}
	}
	return null;
})

export const onPrevNodeCardAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	const newCurrentTimelineIndex = currentTimelineIndex == 0 ? 0 : currentTimelineIndex - 1
	const newCurrentNode = get(nodesAtom).find(node => node._id === nodeIDsTimeline[newCurrentTimelineIndex])
	
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const onNextNodeCardAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	let newCurrentNode = null
	let isAtEndOfList = currentTimelineIndex === nodeIDsTimeline.length - 1
	if (isAtEndOfList) {
		newCurrentNode = get(weightedRandomNodeAtom)
		set(nodeIDsTimelineAtom, [...nodeIDsTimeline, newCurrentNode?._id])
	} else {
		newCurrentNode = get(nodesAtom).find(node => node._id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const increaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	const nodes = get(nodesAtom)

	let numNodes = nodes.length;
	let numerator = 1;
	// let freqModifier = numerator / (numNodes * numNodes);

	// let newFrequency = nodes[nodeIdx].frequency + numNodes * freqModifier;

	// let tempNodes = [...nodes]
	// if (Math.abs(1 - newFrequency) >= 1e-12) {
	// 	tempNodes[nodeIdx].frequency = newFrequency;

	// 	tempNodes.forEach((node) => {
	// 		node.frequency -= freqModifier;
	// 	});
	// }
	// setNodes(tempNodes)
})

export const decreaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	const nodes = get(nodesAtom)

	let numNodes = nodes.length;
	let numerator = 1;
	let freqModifier = numerator / (numNodes * numNodes);

	// let currentNode = get(getNodeByID(nodeID))
	// console.log("decreaseNodeFrquencyAtom currentNode",currentNode)
	// let newFrequency = nodes[nodeIdx].frequency + numNodes * freqModifier;

	// let tempNodes = [...nodes]
	// if (Math.abs(1 - newFrequency) >= 1e-12) {
	// 	tempNodes[nodeIdx].frequency = newFrequency;

	// 	tempNodes.forEach((node) => {
	// 		node.frequency -= freqModifier;
	// 	});
	// }
	// setNodes(tempNodes)
})

// function onPrevNodeCard(){
// 	let isAtBeginningOfTimeline = currTimelineIdx === 0
// 	if(!isAtBeginningOfTimeline) {
// 		setCurrTimelineIdx(currTimelineIdx-1)
// 		return nodeIDsTimeline[currTimelineIdx+1]
// 	}
// }



