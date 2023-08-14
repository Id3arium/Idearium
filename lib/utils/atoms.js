"use client";
import { atom, useAtomValue, useAtom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';
import { Node } from '../interfaces/Node';
import * as API from '@/utils/api.js';
// export const nodesAtom = atom<Record<string, Node>>({});
// export const deletedNodesAtom = atom<Record<string, Node>>({});
// export const currentTimelineIndexAtom = atom<number>(-1);
// export const nodeTimelineAtom = atom<Node[]>([]);
// export const nodeTimelineLengthAtom = atom<number>((get) => get(nodeTimelineAtom).length);
// export const nodesCountAtom = atom<number>((get) => {
// 	const nodesCount = Object.keys(get(nodesAtom)).length;
// 	console.log("nodesCountAtom", nodesCount);
// 	return nodesCount;
// });

export const currentTimelineIndexAtom = atom(-1);
export const nodeTimelineAtom = atom([]);
export const nodeTimelineLengthAtom = atom((get) => get(nodeTimelineAtom).length);
export const deletedNodesAtom = atom([]);

export const clientNodesAtom = atom({});
export const nodesAtom = atom(
	(get) => get(clientNodesAtom),
	async (get, set, newNodes) => {
		try {
			const serverNodes = await API.updateNodesInDB(newNodes);
			set(clientNodesAtom, serverNodes); 
		} catch (error) {
			console.error("nodesAtom Failed to update nodes in DB:", error, "updating nodes in client");
			set(nodesAtom, newNodes);
		}
	}
);

export const currentNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex == -1) { console.log("currentNodeAtom empty timeline"); return null }
	const currentNode = get(nodeTimelineAtom)[currentTimelineIndex]
	console.log("currentNodeAtom currentTimelineIndex", currentTimelineIndex, "currentNode", currentNode)
	return currentNode
})

export const addNodeAtom = atom(null, (get, set, newNode) => {
	const currentNodes = get(nodesAtom);
	set(nodesAtom, { ...currentNodes, [newNode.id]: newNode });
	console.log("addNodeAtom nodes[newNode.id].id", newNode.id);

	const frequencyDelta = newNode.frequency;
	set(redistributeFrequenciesAtom, frequencyDelta, newNode.id);

	set(addToNodeTimelineAtom, newNode);
});

export const removeNodeAtom = atom(null, (get, set, nodeIDToRemove) => {
	const nodes = { [nodeIDToRemove]: _, ...newNodes } = get(nodesAtom);
	const nodeToDelete = nodes[nodeIDToRemove]

	const frequencyDelta = -nodeToDelete.frequency
	set(redistributeFrequenciesAtom, frequencyDelta, nodeToDelete.id)
	// TODO: update node rankings too

	console.log("removeNodeAtom nodes after removing", nodeIDToRemove, newNodes)

	set(nodesAtom, newNodes);
	set(removeFromNodeTimelineAtom, nodeIDToRemove);
});

export const addToNodeTimelineAtom = atom(null, (get, set, node) => {
	set(nodeTimelineAtom, [...get(nodeTimelineAtom), node])
	set(moveToNextTimelineNodeAtom)
})

export const removeFromNodeTimelineAtom = atom(null, (get, set, nodeID) => {
	const nodeTimeline = get(nodeTimelineAtom);
	const currentIndex = get(currentTimelineIndexAtom);
	const indexesToRemove = findNodeIndexes(nodeTimeline, nodeID);
	if (indexesToRemove.length == 0) { return }

	const prunedTimeline = nodeTimeline.filter((node, index) => !indexesToRemove.includes(index))
	let newCurrentIndex = getCurrentIndexAfterPruning(currentIndex, indexesToRemove);

	set(nodeTimelineAtom, prunedTimeline)
	set(currentTimelineIndexAtom, _.clamp(newCurrentIndex, 0, prunedTimeline.length - 1))
})

export const moveToEndOfTimelineAtom = atom(null, (get, set) => {
	const nodeTimelineLength = get(nodeTimelineLengthAtom);
	set(currentTimelineIndexAtom, nodeTimelineLength - 1);
});

function findNodeIndexes(nodeTimeline, nodeID) {
	let instanceIndexes = [];
	for (let i = nodeTimeline.length - 1; i >= 0; i--) {
		if (nodeTimeline[i].id === nodeID) {
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
	set(redistributeFrequenciesAtom, numerator, nodeID)
	// set(nodesAtom, redistributeNodeFrequencies(nodeID, numerator))
})

export const downDistributeFrequencyAtom = atom(null, (get, set, nodeID) => {
	let numerator = -1;
	set(redistributeFrequenciesAtom, numerator, nodeID)
	// set(nodesAtom, redistributeNodeFrequencies(nodeID, numerator))
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

export const redistributeFrequenciesAtom = atom(null, (get, set, frequencyChange, nodeID) => {
	console.log("atoms.redistributeNodeFrequencies: ", frequencyChange, nodeID)
	const nodesDict = get(nodesAtom)
	const nodesCount = Object.keys(nodesDict).length
	const freqModifier = frequencyChange / (nodesCount * nodesCount)

	const newFrequency = nodesDict[nodeID].frequency + (nodesCount * freqModifier)
	if (_.inRange(newFrequency, 0, 1)) {
		nodesDict[nodeID].frequency = newFrequency
		for (const nodeID in nodesDict) {
			nodesDict[nodeID].frequency -= freqModifier;
		}
		set(nodesAtom, { ...nodesDict })
	}
})

export const resetNodeFrequenciesAtom = atom(null, (get, set) => {
	const nodesDict = get(nodesAtom)
	const defaultFrequency = 1 / Object.keys(nodesDict).length

	for (const nodeID in nodesDict) {
		nodesDict[nodeID].frequency = defaultFrequency;
	}
	set(nodesAtom, { ...nodesDict })
	// API.resetNodeFrequencies()
	console.log("atoms.resetNodeFrequencies to: ", defaultFrequency)
})




