"use client";
import { atom, createStore } from 'jotai';

// export const nodeIdsTimelineStore = createStore({
// 	timeline: nodeIDsTimelineAtom,
// 	currentIndex: currentTimelineIndexAtom,
// 	length: nodeIDsTimelineLengthAtom
// })

export const nodesAtom = atom([])
export const currentNodeAtom = atom(null)
export const currentTimelineIndexAtom = atom(-1)
export const nodeIDsTimelineAtom = atom([])
export const nodeIDsTimelineLengthAtom = atom((get) => get(nodeIDsTimelineAtom).length)

export const weightedRandomNodeAtom = atom( (get) => {
	const nodes = get(nodesAtom)
	if (!nodes) { return null; }
	let randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].id === get(currentNodeAtom).id) { continue; }
		let currentNodeFrequency = nodes[i].frequency
		let isGTEfreqSigma = randNum >= frequencySigma
		let isLTNewFrequencySigma = randNum < (frequencySigma + currentNodeFrequency)
		//likelyhood of randNum being inside the range is === to the nodes appearance frequency
		let isRandNumInNodeRange = isGTEfreqSigma && isLTNewFrequencySigma
		if (isRandNumInNodeRange){
			return nodes[i]
		} else {
			frequencySigma += currentNodeFrequency
		}
	}
})

export const onPrevNodeCardAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	let newCurrentNode = get(currentNodeAtom)
	let newCurrentTimelineIndex = currentTimelineIndex
	if (currentTimelineIndex !== 0){
		newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
		newCurrentTimelineIndex = currentTimelineIndex - 1
	}
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
})

export const onNextNodeCardAtom = atom(null, (get, set) => {
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	let newCurrentNode = null
	if (currentTimelineIndex === nodeIDsTimeline.length - 1){
		newCurrentNode = get(weightedRandomNodeAtom)
	} else {
		newCurrentNode = get(nodesAtom).find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
		// set(nodesStateAtom, (prev) => ({
	// 	...prev,
	// 	currentNode: newCurrentNode,
	// 	currentTimelineIndex: newCurrentTimelineIndex
	// }))
})


// function onPrevNodeCard(){
// 	let isAtBeginningOfTimeline = currTimelineIdx === 0
// 	if(!isAtBeginningOfTimeline) {
// 		setCurrTimelineIdx(currTimelineIdx-1)
// 		return nodeIDsTimeline[currTimelineIdx+1]
// 	}
// }



