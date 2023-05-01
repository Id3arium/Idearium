"use client";
import { atom, useAtomValue, createStore } from 'jotai';
import _ from 'lodash';
export const nodesAtom = atom([])
export const deletedNodesAtom = atom([])
export const currentNodeAtom = atom(null)
export const currentTimelineIndexAtom = atom(-1)
export const nodeIDsTimelineAtom = atom([])
export const nodeIDsTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length)

export const getNodeAtTimelineIndex = atom((get) => (idx) => {
	let nodes = get(nodesAtom)
	if (!nodes) {return}
	console.log("getNodeAtTimelineIndex nodes:", nodes)
	return nodes.find(node => node.idx === get(nodeIDsTimelineAtom)[idx])
})

// export const currentNodeAtom = atom((get) => {
// 	const currentTimelineIndex = get(currentTimelineIndexAtom)
// 	if (currentTimelineIndex == -1) { console.log("currentNodeAtom empty timeline"); return null }
// 	return get(getNodeAtTimelineIndex)(currentTimelineIndex)
// })

export const addToNodeIDsTimelineAtom = atom(null, (get, set, nodeID) => { 
	set(nodeIDsTimelineAtom, [...get(nodeIDsTimelineAtom), nodeID])
	set(moveToNextTimelineNodeAtom)
})

export const addNodeAtom = atom(null, (get, set, newNode) => {
	if (newNode == null) { return; }
	console.log("addNodeAtom new node:",newNode)
	let nodes = get(nodesAtom)
	let newFreqRatio = nodes.length / (nodes.length + 1)
	console.log("newFreqRatio = ", nodes.length, "/", (nodes.length + 1), "=", newFreqRatio)
	nodes.forEach((node, i) => {
		node.frequency *= newFreqRatio
		console.log("node", node.idx, "freq", node.frequency,)
	})
	console.log("addNewNodeAtom newNode:", addNodeAtom)
	set(nodesAtom, [...nodes, newNode])
	set(addToNodeIDsTimelineAtom, newNode.idx)
})

export const removeNodeAtom = atom(null, (get, set, nodeIdx) => {
	if (nodeIdx == null) { return }
	let nodes = get(nodesAtom)
	const nodeIndex = nodes.findIndex(node => node.idx == nodeIdx)
	if (nodes.length == 0 || nodeIndex == -1) { return }
	
	nodes.splice(nodeIndex, 1)

	if (nodes.length == 1) {
		nodes[0].frequency = 1
	} else {
		const newFreqRatio = (nodes.length + 1) / (nodes.length)
		nodes.forEach((node, i) => {
			node.frequency *= newFreqRatio
		})
	}
	set(nodesAtom, nodes)
	set(removeFromNodeIDsTimelineAtom, nodeIdx)

})

export const removeFromNodeIDsTimelineAtom = atom(null, (get, set, nodeID) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom);
	const currentIndex = get(currentTimelineIndexAtom);
	
	const removedIndexes = getRemovedIndexes();
	if (removedIndexes.length == 0) { return }
	
	let newCurrentIndex = getNewCurrentIndex();
	const newTimeline = nodeIDsTimeline.filter((nodeID, index) => !removedIndexes.includes(index))
	set(nodeIDsTimelineAtom, newTimeline)
	set(currentTimelineIndexAtom, _.clamp(newCurrentIndex, 0, newTimeline.length - 1))

	function getNewCurrentIndex() {
		let newCurrentIndex = currentIndex;
		const nodeIDsRemovedBeforeCurrent = removedIndexes.filter((i) => i < currentIndex).length;
		if (nodeIDsRemovedBeforeCurrent > 0) {
			newCurrentIndex -= nodeIDsRemovedBeforeCurrent;
		} else if (removedIndexes.includes(currentIndex)) {
			newCurrentIndex = Math.max(...removedIndexes.filter((i) => i < currentIndex));
		}
		return newCurrentIndex;
	}

	function getRemovedIndexes() {
		let removedIndexes = []
		for (let i = nodeIDsTimeline.length - 1; i >= 0; i--) {
			if (nodeIDsTimeline[i] === nodeID) {
				removedIndexes.push(i);
			}
		}
		return removedIndexes
	}
})

export const onNextNodeAtom = atom(null, (get, set, nextNode) => {
	console.log('atoms.onNextNodeAtom nextNode',nextNode)
	const isAtEndOfList = get(currentTimelineIndexAtom) === get(nodeIDsTimelineAtom).length - 1
	if (isAtEndOfList) {
		set(addToNodeIDsTimelineAtom, nextNode.idx)
	} else {
		set(moveToNextTimelineNodeAtom)
	}
})

export const onPrevNodeAtom = atom(null, (get, set) => {
	set(moveToPrevTimelineNodeAtom)
})

export const moveToNextTimelineNodeAtom = atom(null, (get, set) => {
	const newCurrentTimelineIndex = _.min([ (get(currentTimelineIndexAtom) + 1), (get(nodeIDsTimelineLengthAtom) - 1)  ])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const moveToPrevTimelineNodeAtom = atom(null, (get, set) => {
	const newCurrentTimelineIndex = _.max([0, get(currentTimelineIndexAtom) - 1])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const weightedRandomNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	if (nodes.length < 2) {
        console.log("cant choose a random node");
        return nodes.length === 1 ? nodes[0] : null;
    }
	
	let randNode = getWeightedRandomNode(nodes)

	if ( get(currentTimelineIndexAtom) == -1 ) { return randNode }
	while (randNode.idx == get(currentNodeAtom).idx){
		randNode = getWeightedRandomNode(nodes)
	}
	return randNode
})

export const increaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = 1;
	set(nodesAtom, getUpdatedFrequencies(get(nodesAtom), nodeID, numerator))
})

export const decreaseNodeFrquencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = -1;
	set(nodesAtom, getUpdatedFrequencies(get(nodesAtom), nodeID, numerator))
})

function getUpdatedFrequencies(nodes, nodeIdx, numerator) { 
	const numNodes = nodes.length
	const freqModifier = numerator / (numNodes * numNodes)
	const nodeIndex = nodes.findIndex(node => node.idx == nodeIdx) 

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
	nodes.forEach( node => console.log(node) )
	for (let i = 0; i < nodes.length; i++) {
		//likelyhood of randNum being inside the range is = to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + nodes[i].frequency)
		if (isRandNumInNodeRange) {
			console.log("getWeightedRandomNode randNum", randNum, "frequencySigma", frequencySigma, "id", nodes[i].id)
			return nodes[i]
		} else {
			frequencySigma += nodes[i].frequency
		}
	}
	console.log("getWeightedRandomNode returnning last node")
	return nodes[nodes.length - 1];
}

