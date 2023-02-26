"use client";
import { atom, useAtomValue, createStore } from 'jotai';

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

// export const nodeByIDAtom = atom(
// 	(get, set, nodeID) => get(nodesAtom).find(node => node._id == nodeID),
// 	(get, set, nodeID) => {
// 		let node = get(nodesAtom).find(node => node._id == nodeID)
// 	}
// )

export const addNodeAtom = atom(null, (get, set, newNodeData) => {
	let nodes = get(nodesAtom)
	let newNode = {
		_id: nodes.length,
		title: newNodeData.title,
		content: newNodeData.content,
		inspiration: newNodeData.inspiration,
		frequency: 1 / (nodes.length + 1),
		// charCount: getNodeCharCount(newNodeData)
	}
	let newFreqRatio = nodes.length / (nodes.length + 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })
	
	set(nodesAtom, [...nodes, newNode])
})

export const removeNodeAtom = atom(null, (get, set, nodeID) => {
	let nodes = get(nodesAtom)
	const nodeIndex = nodes.findIndex(node => node._id == nodeID) 
	nodes.splice(nodeIndex,1)

	let newFreqRatio = nodes.length / (nodes.length - 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })

	set(nodesAtom, nodes)
})

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

export const decreaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = -1;
	set(nodesAtom, getUpdatedFrequencies( get(nodesAtom), nodeID, numerator ))
})

export const increaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = 1;
	set(nodesAtom, getUpdatedFrequencies( get(nodesAtom), nodeID, numerator ))
})

function getUpdatedFrequencies(nodes, nodeID, numerator) { 
	console.log("getUpdatedNodeFrequencies nodes",nodes)

	const numNodes = nodes.length
	const freqModifier = numerator / (numNodes * numNodes)
	const nodeIndex = nodes.findIndex(node => node._id == nodeID) 

	const newFrequency = nodes[nodeIndex].frequency + numNodes * freqModifier
	let tempNodes = [...nodes]
	const newFreqIsLessThanOne = Math.abs(1 - newFrequency) >= 1e-12

	if (newFreqIsLessThanOne) {
		tempNodes[nodeIndex].frequency = newFrequency
		tempNodes.forEach( node => { node.frequency -= freqModifier } )
	}
	return tempNodes
}