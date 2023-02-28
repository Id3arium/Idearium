"use client";
import { atom, useAtomValue, createStore } from 'jotai';
import _ from 'lodash';

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
// 	(get, set, nodeID) => get(nodesAtom).find(node => node.id== nodeID),
// 	(get, set, nodeID) => {
// 		let node = get(nodesAtom).find(node => node.id == nodeID)
// 	}
// )    					

export const addNodeAtom = atom(null, (get, set, newNode) => {
	let nodes = get(nodesAtom)
	// let newNode = {
	//  _id: uuidv4(),
	// 	id: nodes.length,
	// 	title: newNodeData.title,
	// 	content: newNodeData.content,
	// 	inspiration: newNodeData.inspiration,
	// 	frequency: 1 / (nodes.length + 1),
	// 	// charCount: getNodeCharCount(newNodeData)
	// }
	let newFreqRatio = nodes.length / (nodes.length + 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })
	
	set(nodesAtom, [...nodes, newNode])
	set(currentTimelineIndexAtom, get(currentTimelineIndexAtom) + 1 )
	set(currentNodeAtom, newNode)
})

export const removeNodeAtom = atom(null, (get, set, nodeID) => {
	let nodes = get(nodesAtom)
	const nodeIndex = nodes.findIndex(node => node.id == nodeID) 
	nodes.splice(nodeIndex, 1)

	let newFreqRatio = nodes.length / (nodes.length - 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })

	set(nodesAtom, nodes)
})

export const weightedRandomNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	let randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].id === get(currentNodeAtom)?.id) { continue; }
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

export const onPrevNodeAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	const newCurrentTimelineIndex = currentTimelineIndex == 0 ? 0 : currentTimelineIndex - 1
	
	const newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	set(currentNodeAtom, newCurrentNode)
})

export const onNextNodeAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	
	let newCurrentNode = null
	let isAtEndOfList = currentTimelineIndex === nodeIDsTimeline.length - 1
	if (isAtEndOfList) {
		newCurrentNode = get(weightedRandomNodeAtom)
		set(nodeIDsTimelineAtom, [...nodeIDsTimeline, newCurrentNode?.id])
	} else {
		newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	set(currentNodeAtom, newCurrentNode)
})

export const decreaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = -1;
	set(nodesAtom, getUpdatedFrequencies(get(nodesAtom), nodeID, numerator))
})

export const increaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = 1;
	set(nodesAtom, getUpdatedFrequencies(get(nodesAtom), nodeID, numerator))
})

function getUpdatedFrequencies(nodes, nodeID, numerator) { 
	console.log("getUpdatedNodeFrequencies nodes", nodes)

	const numNodes = nodes.length
	const freqModifier = numerator / (numNodes * numNodes)
	const nodeIndex = nodes.findIndex(node => node.id == nodeID) 

	const newFrequency = nodes[nodeIndex].frequency + numNodes * freqModifier
	let tempNodes = [...nodes]

	if (_.inRange(newFrequency, 0, 1)) {
		tempNodes[nodeIndex].frequency = newFrequency
		tempNodes.forEach( node => { node.frequency -= freqModifier } )
	}
	return tempNodes
}