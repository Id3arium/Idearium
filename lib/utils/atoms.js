"use client";
import { atom, useAtomValue, createStore } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import _ from 'lodash';
import { fetchNodes } from '@/utils/api.js';

export const nodesAtom = atomWithDefault(get => get(fetchedNodesAtom));
// export const nodesAtom = atom([]);
export const deletedNodesAtom = atom([])
export const currentTimelineIndexAtom = atom(-1)
export const uniqueTimelineNodeIDsAtom = atom(new Set())
export const nodeTimelineAtom = atom([])
export const nodeTimelineLengthAtom = atom((get) => get(nodeTimelineAtom).length)

const fetchedNodesAtom = atom(
	async (get) => {
		const data = await fetchNodes();
		return data;
	},
	(get, set, update) => set(fetchedNodesAtom, update)
);

export const currentNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex == -1) { console.log("currentNodeAtom empty timeline"); return null }
	return get(nodeTimelineAtom)[currentTimelineIndex]
})

export const addToNodeTimelineAtom = atom(null, (get, set, node) => {
	set(nodeTimelineAtom, [...get(nodeTimelineAtom), node])
	set(moveToNextTimelineNodeAtom)
	set(uniqueTimelineNodeIDsAtom, (prevID) => {
		const next = new Set(prevID);
		next.add(node.id);
		return next;
	});
})

export const removeFromNodeTimelineAtom = atom(null, (get, set, node) => {
	const nodeTimeline = get(nodeTimelineAtom);
	const currentIndex = get(currentTimelineIndexAtom);
	const indexesToRemove = findNodeIndexes(nodeTimeline, node);
	if (indexesToRemove.length == 0) { return }

	const prunedTimeline = nodeTimeline.filter((node, index) => !indexesToRemove.includes(index))
	let newCurrentIndex = getCurrentIndexAfterPruning(currentIndex, indexesToRemove);

	set(nodeTimelineAtom, prunedTimeline)
	set(currentTimelineIndexAtom, _.clamp(newCurrentIndex, 0, prunedTimeline.length - 1))
	set(uniqueTimelineNodeIDsAtom, (prevID) => {
		const next = new Set(prevID);
		next.delete(node.id);
		return next;
	});
})

function findNodeIndexes(nodeTimeline, node) {
	let instanceIndexes = [];
	for (let i = nodeTimeline.length - 1; i >= 0; i--) {
		if (nodeTimeline[i].id === node.id) {
			instanceIndexes.push(i);
		}
	}
	return instanceIndexes;
}

function getCurrentIndexAfterPruning(currentIndex, indexesToRemove) {
	let newCurrentIndex = currentIndex;
	const nodesRemovedBeforeCurrent = indexesToRemove.filter((i) => i < currentIndex).length;
	if (nodesRemovedBeforeCurrent > 0) {
		newCurrentIndex -= nodesRemovedBeforeCurrent;
	} else if (indexesToRemove.includes(currentIndex)) {
		newCurrentIndex = Math.max(...indexesToRemove.filter((i) => i < currentIndex));
	}
	return newCurrentIndex;
}


export const onNextNodeAtom = atom(null, (get, set, nextNode) => {
	console.log("onNextNodeAtom nextNode", nextNode)
	if (nextNode === null) { return }
	const isAtEndOfList = get(currentTimelineIndexAtom) === get(nodeTimelineAtom).length - 1
	if (isAtEndOfList) {
		set(addToNodeTimelineAtom, nextNode)
	} else {
		set(moveToNextTimelineNodeAtom)
	}
})

export const onPrevNodeAtom = atom(null, (get, set) => {
	set(moveToPrevTimelineNodeAtom)
})

export const moveToNextTimelineNodeAtom = atom(null, (get, set) => {
	const newCurrentTimelineIndex = _.min([(get(currentTimelineIndexAtom) + 1), (get(nodeTimelineLengthAtom) - 1)])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const moveToPrevTimelineNodeAtom = atom(null, (get, set) => {
	const newCurrentTimelineIndex = _.max([0, get(currentTimelineIndexAtom) - 1])
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const upDistributeFrequencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = 1;
	set(nodesAtom, redistributeNodeFrequencies(nodeID, numerator))
})

export const downDistributeFrequencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = -1;
	set(nodesAtom, redistributeNodeFrequencies(nodeID, numerator))
})

function redistributeNodeFrequencies(nodeID, numerator) {
	const nodes = get(nodesAtom)
	const nodesCount = nodes.length
	const freqModifier = numerator / (nodesCount * nodesCount)
	const nodeIndex = nodes.findIndex(node => node.id == nodeID)

	const newFrequency = nodes[nodeIndex].frequency + nodesCount * freqModifier
	let tempNodes = [...nodes]
	console.log(`atoms.redistributeNodeFrequencies: node ${nodeIndex} freq changed from ${nodes[nodeIndex].frequency} to ${newFrequency} by ${nodesCount * freqModifier}`)

	if (_.inRange(newFrequency, 0, 1)) {
		tempNodes[nodeIndex].frequency = newFrequency
		tempNodes.forEach(node => { node.frequency -= freqModifier })
	}
	return tempNodes
}

export async function redistributeNodeFrequencies2(frequencyChange, nodeIdx) {
	console.log("atoms.redistributeNodeFrequencies: ", frequencyChange, nodeIdx)
	try {
		const nodes = get(nodesAtom)
		const nodesCount = nodes.length
		const numerator = frequencyChange
		const freqModifier = numerator / (nodesCount * nodesCount)

		const newFrequency = nodes[nodeIdx].frequency + (nodesCount * freqModifier)
		if (_.inRange(newFrequency, 0, 1)) {
			nodes[nodeIdx].frequency = newFrequency
			nodes.forEach((node) => { node.frequency -= freqModifier; })

			// update nodes in server

			return nodes[nodeIdx]
		}
		return null
	} catch (error) {
		console.log("atoms.redistributeNodeFrequencies error:", error)
		return error
	}
}

// function getWeightedRandomNode() {
export const nextRandomNodeAtom = atom(async (get) => {
	const nodes = await get(nodesAtom)
	console.log("nextRandomNodeAtom nodes", nodes)

	if (nodes.length == 0) { console.log("nextRandomNodeAtom expected non-empty list of nodes") }
	const randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
	// nodes.forEach(node => console.log(node))
	for (let i = 0; i < nodes.length; i++) {
		//likelyhood of randNum being inside the range is = to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + nodes[i].frequency)
		if (isRandNumInNodeRange) {
			console.log("nextRandomNodeAtom randNum", randNum, "frequencySigma", frequencySigma, "id", nodes[i].id)
			return nodes[i]
		} else {
			frequencySigma += nodes[i].frequency
		}
	}
	console.log("nextRandomNodeAtom returnning last node")
	return nodes[nodes.length - 1];
})



