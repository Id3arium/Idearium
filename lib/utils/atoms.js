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
export const nodeIDsTimelineAtom = atom([]);
export const nodeTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length);
export const deletedNodesAtom = atom([]);

export const clientNodesAtom = atom({});
export const nodesAtom = atom(
	(get) => get(clientNodesAtom),
	async (get, set, newNodes) => {
		set(clientNodesAtom, newNodes);
		try {
			const serverNodes = await API.updateNodesInDB(Object.values(newNodes));
			console.log("nodesAtom setting serverNodes", serverNodes)

			set(clientNodesAtom, serverNodes);
		} catch (error) {
			console.error("nodesAtom Failed to update nodes in DB:", error);
		}
	}
);

export const currentNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex == -1) { console.log("currentNodeAtom empty timeline"); return null }
	const currentNodeID = get(nodeIDsTimelineAtom)[currentTimelineIndex]
	const currentNode = get(nodesAtom)[currentNodeID]
	console.log("currentNodeAtom currentNode", currentNode.id)
	return currentNode
})

export const addNodeAtom = atom(null, async (get, set, newNode) => {
	set(downRegulateFrequenciesAtom)
	const nodes = get(nodesAtom);
	
	set(clientNodesAtom, { ...nodes, [newNode.id]: newNode });
	set(addToNodeTimelineAtom, newNode);

	try {
		const createdNode = await API.createNodeInDB(newNode);
		set(nodesAtom, { ...nodes, [createdNode.id]: createdNode } )
	} catch (error) {
		console.error("addNodeAtom Failed to add node in DB:", error);
	}
});

export const removeNodeAtom = atom(null, async (get, set, nodeID) => {

	const nodes = get(clientNodesAtom);
	set(removeFromNodeTimelineAtom, nodeID);
	
	delete nodes[nodeID]
	set(clientNodesAtom, { ...nodes })
	// TODO: update node rankings too

	try {
		await API.removeNodeInDB(nodeID);
		set(nodesAtom, { ...nodes } )
	} catch (error) {
		console.error("removeNodeAtom Failed to remove node in DB:", error);
	}

	set(upRegulateFrequenciesAtom)
});

export const removeFromNodeTimelineAtom = atom(null, (get, set, nodeID) => {
	const nodeTimeline = get(nodeIDsTimelineAtom);
	const currentIndex = get(currentTimelineIndexAtom);
	const indexesToPrune = findIndexes(nodeTimeline, nodeID);
	if (indexesToPrune.length == 0) { return }

	const prunedTimeline = nodeTimeline.filter((node, index) => !indexesToPrune.includes(index))
	let newCurrentIndex = getCurrentIndexAfterPruning(currentIndex, indexesToPrune);

	set(nodeIDsTimelineAtom, prunedTimeline)
	set(currentTimelineIndexAtom, _.clamp(newCurrentIndex, 0, prunedTimeline.length - 1))
})

export const moveToEndOfTimelineAtom = atom(null, (get, set) => {
	const nodeTimelineLength = get(nodeTimelineLengthAtom);
	set(currentTimelineIndexAtom, nodeTimelineLength - 1);
});

function findIndexes(nodeTimeline, nodeID) {
	let instanceIndexes = [];
	for (let i = nodeTimeline.length - 1; i >= 0; i--) {
		if (nodeTimeline[i] === nodeID) {
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

export const addToNodeTimelineAtom = atom(null, (get, set, node) => {
	set(nodeIDsTimelineAtom, [...get(nodeIDsTimelineAtom), node.id])
	set(moveToNextTimelineNodeAtom)
})

export const onNextNodeAtom = atom(null, (get, set, nextNode) => {
	if (nextNode === null) { return }
	const isAtEndOfList = get(currentTimelineIndexAtom) === get(nodeIDsTimelineAtom).length - 1
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

export const resetNodeFrequenciesAtom = atom(null, (get, set) => {
	const nodesDict = get(nodesAtom)
	const averageFreq = 1 / Object.keys(nodesDict).length

	for (const nodeID in nodesDict) {
		nodesDict[nodeID].frequency = averageFreq;
	}
	set(nodesAtom, { ...nodesDict });
})

export const upRegulateFrequenciesAtom = atom(null, (get, set) => {
	const nodesCount = Object.keys(get(nodesAtom)).length
	console.log("atoms.upRegulateFrequenciesAtom: by ", (nodesCount + 1), "/", nodesCount)
	
	set(amplifyFrequenciesAtom, (nodesCount + 1) / nodesCount);
})

export const downRegulateFrequenciesAtom = atom(null, (get, set) => {
	const nodesCount = Object.keys(get(nodesAtom)).length
	console.log("atoms.downRegulateFrequenciesAtom: by", nodesCount , "/", (nodesCount+ 1))
	set(amplifyFrequenciesAtom, nodesCount / (nodesCount + 1));
})

export const redistributeFrequenciesAtom = atom(null, (get, set, frequencyChange, nodeID) => {
	const nodesDict = get(nodesAtom)
	console.log("atoms.redistributeNodeFrequencies: ", frequencyChange, nodeID)
	const nodesCount = Object.keys(nodesDict).length
	const freqModifier = frequencyChange / (nodesCount * nodesCount)

	const newFrequency = get(nodesAtom)[nodeID].frequency + (nodesCount * freqModifier)
	if (_.inRange(newFrequency, 0, 1)) {
		nodesDict[nodeID].frequency = newFrequency
		for (const nodeID in nodesDict) {
			nodesDict[nodeID].frequency += freqModifier;
		}
		set(nodesAtom, { ...nodesDict });
	}
})

export const amplifyFrequenciesAtom = atom(null, (get, set, freqModifier) => {
	const nodesDict = get(clientNodesAtom)
	for (const nodeID in nodesDict) {
		nodesDict[nodeID].frequency *= freqModifier;
	}
	set(clientNodesAtom, { ...nodesDict });
})