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
export const currentTimelineIndexAtom = atom(0)
export const nodeIDsTimelineAtom = atom([])
export const nodeIDsTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length)
  
export const addNodeAtom = atom(null, (get, set, newNode) => {
	let nodes = get(nodesAtom)
	
	let newFreqRatio = nodes.length / (nodes.length + 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })
	
	set(nodesAtom, [...nodes, newNode])
	set(addToNodeIDsTimelineAtom)
})

export const addToNodeIDsTimelineAtom = atom(null, (get, set, newNodeID) => { 
	set(nodeIDsTimelineAtom, [...get(nodeIDsTimelineAtom), newNodeID])
	set(moveToNextTimelineNodeAtom)
})

export const removeNodeAtom = atom(null, (get, set, nodeID) => {
	let nodes = get(nodesAtom)
	const nodeIndex = nodes.findIndex(node => node.id == nodeID) 
	nodes.splice(nodeIndex, 1)

	let newFreqRatio = nodes.length / (nodes.length - 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })

	set(nodesAtom, nodes)
})

export const moveToNextTimelineNodeAtom = atom(null, (get, set) => {
	let nodeIDsTimeline = get(nodeIDsTimelineAtom)
	let maxIdx = nodeIDsTimeline.length - 1
	let newCurrentTimelineIndex = _.min([maxIdx, get(currentTimelineIndexAtom) + 1])
	let newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	set(currentNodeAtom, newCurrentNode)
})

export const moveToPrevTimelineNodeAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const newCurrentTimelineIndex = _.max([0, get(currentTimelineIndexAtom) - 1])
	const newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	set(currentNodeAtom, newCurrentNode)
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
	set(moveToPrevTimelineNodeAtom)
})

export const onNextNodeAtom = atom(null, (get, set) => {
	let isAtEndOfList = get(currentTimelineIndexAtom) === get(nodeIDsTimelineAtom).length - 1
	if (isAtEndOfList) {
		let newCurrentNode = get(weightedRandomNodeAtom)
		set(addToNodeIDsTimelineAtom, newCurrentNode?.id)
		// set(nodeIDsTimelineAtom, [...nodeIDsTimeline, newCurrentNode?.id])
	} else {
		set(moveToNextTimelineNodeAtom)
	}
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