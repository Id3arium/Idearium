"use client";
import { atom, useAtomValue, createStore } from 'jotai';
import _ from 'lodash';
export const nodesAtom = atom([])
export const deletedNodesAtom = atom([])
// export const currentNodeAtom = atom(null)
export const currentTimelineIndexAtom = atom(-1)
export const nodeIDsTimelineAtom = atom([])
export const nodeIDsTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length)

export const getNodeAtTimelineIndex = atom((get) => (idx) => {
	const nodes = get(nodesAtom)
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	return nodes.find(node => node.id === nodeIDsTimeline[idx])
})

export const currentNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex >= 0) {
		return get(getNodeAtTimelineIndex)(currentTimelineIndex)
	}
	console.log("currentNodeAtom empty timeline")
	return null
})

export const addToNodeIDsTimelineAtom = atom(null, (get, set, nodeID) => { 
	console.log("addToNodeIDsTimelineAtom nodeID:",nodeID)
	set(nodeIDsTimelineAtom, [...get(nodeIDsTimelineAtom), nodeID])
	set(moveToNextTimelineNodeAtom)
})

// export const removeFromNodeIDsTimelineAtom = atom(null, (get, set, nodeID) => {
// 	let nodeIDsTimeline = get(nodeIDsTimelineAtom)
// 	const nodeIndex = nodes.findIndex(node => node.id == nodeID) 
// 	nodes.splice(nodeIndex, 1)
// 	//for each id in timeline:
// 		//if 
// 			//if i is < curr idx:
			
// 	for (let i = 0; i < nodeIDsTimeline.length; i++) {
// 		const nodeID = array[i];
		
// 	}
	
// 	nodeIDsTimeline.filter(x => x !== nodeID)
// 	set(nodeIDsTimelineAtom, nodeIDsTimeline.filter(x => x !== nodeID) )
// 	set(moveToPrevTimelineNodeAtom)
// })

export const removeFromNodeIDsTimelineAtom = atom(null, (get, set, nodeID) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom);
	const currentIndex = get(currentTimelineIndexAtom);
	// console.log("removing nodeID", nodeID+1, "nodeIDsTimeline", nodeIDsTimeline, "currentIndex", currentIndex)
	const removedIndexes = [];
	for (let i = nodeIDsTimeline.length - 1; i >= 0; i--) {
		if (nodeIDsTimeline[i] === nodeID) {
			removedIndexes.push(i);
		}
	}
	if (removedIndexes.length == 0) { return }
	
	let newCurrentIndex = currentIndex;
	const nodeIDsRemovedBeforeCurrent = removedIndexes.filter((i) => i < currentIndex).length
	if (nodeIDsRemovedBeforeCurrent > 0) {
		newCurrentIndex -= nodeIDsRemovedBeforeCurrent
	} else if (removedIndexes.includes(currentIndex)) {
		newCurrentIndex = Math.max(...removedIndexes.filter((i) => i < currentIndex))
		// set(moveToPrevTimelineNodeAtom)
	}
	const newTimeline = nodeIDsTimeline.filter((nodeID, index) => !removedIndexes.includes(index))
	// console.log("removing nodeID", nodeID+1, "newTimeline", newTimeline, "newCurrentIndex", newCurrentIndex)
	set(nodeIDsTimelineAtom, newTimeline)
	set(currentTimelineIndexAtom, _.clamp(newCurrentIndex, 0, nodeIDsTimeline.length - 1))

  })

export const addNodeAtom = atom(null, (get, set, newNode) => {
	let nodes = get(nodesAtom)
	
	let newFreqRatio = nodes.length / (nodes.length + 1)
	nodes.forEach(node => { node.frequency *= newFreqRatio })
	
	set(nodesAtom, [...nodes, newNode])
	set(addToNodeIDsTimelineAtom)
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
	let maxIdx = get(nodeIDsTimelineLengthAtom) - 1
	let newCurrentTimelineIndex = _.min([maxIdx, get(currentTimelineIndexAtom) + 1])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const moveToPrevTimelineNodeAtom = atom(null, (get, set) => {
	const newCurrentTimelineIndex = _.max([0, get(currentTimelineIndexAtom) - 1])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const weightedRandomNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	if (nodes.length == 0) { console.log("empty nodes array, cant choose a random node"); return null }

	let randNode = getWeightedRandomNode(nodes)
	if (get(currentTimelineIndexAtom) == -1) { console.log("empty timeline, choosing 1st node"); return randNode }

	while (randNode.id == get(currentNodeAtom).id){
		randNode = getWeightedRandomNode(nodes)
	}
	console.log("randNode chosen:", randNode.id)
	return randNode
})

export const onPrevNodeAtom = atom(null, (get, set) => {
	set(moveToPrevTimelineNodeAtom)
})

export const onNextNodeAtom = atom(null, (get, set) => {
	let isAtEndOfList = get(currentTimelineIndexAtom) === get(nodeIDsTimelineAtom).length - 1
	if (isAtEndOfList) {
		set(addToNodeIDsTimelineAtom, get(weightedRandomNodeAtom).id)
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

function getWeightedRandomNode(nodes) {
	if (nodes.length == 0) { console.log("getWeightedRandomNode expected non-empty list of nodes") } 
	const randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
	for (let i = 0; i < nodes.length; i++) {
		//likelyhood of randNum being inside the range is = to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + nodes[i].frequency)
		if (isRandNumInNodeRange) {
			return nodes[i]
		} else {
			frequencySigma += nodes[i].frequency
		}
	}
}