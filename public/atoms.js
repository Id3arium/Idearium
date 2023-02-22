"use client";
import { atom, createStore } from 'jotai';

export const testAtom = atom(0)
export const test2Atom = atom("test2")

export const testStore = createStore({
	test: testAtom,
	test2: test2Atom,
})

// const decrementCountAtom = atom(
// 	(get) => get(countAtom),
// 	(get, set, _arg) => set(countAtom, get(countAtom) - 1)
// )

// export const getNodesListAtom = atom( (get) => get(nodesStateAtom).nodes.map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
// export const getNodesListAtom = atom( (get) => get(nodesAtom).map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )

// export const previousNodeAtom = atom((get) => {
// 	const currentTimelineIndex = get(currentTimelineIndexAtom)
// 	if (currentTimelineIndex > 0) {
// 		const newCurrentTimelineIndex = currentTimelineIndex - 1
// 		const nodeIDsTimeline = get(nodeIDsTimelineAtom)
// 		const nodes = get(nodesAtom)
// 		const newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
// 		set(currentNodeAtom, newCurrentNode)
// 		set(currentTimelineIndexAtom, newCurrentTimelineIndex)
// 		// set(nodesStateAtom, (prev) => ({
// 		// 	...prev,
// 		// 	currentNode: newCurrentNode,
// 		// 	currentTimelineIndex: newCurrentTimelineIndex
// 		// }))
// 	}
// })

// export const nextNodeAtom = atom((get) => {
// 	const nodes = get(nodesAtom)
// 	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
// 	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
// 	const newCurrentTimelineIndex = currentTimelineIndex + 1
// 	const atEndOfTimeline = currentTimelineIndex === nodeIDsTimeline.length - 1
// 	let newCurrentNode = null

// 	if (atEndOfTimeline){
// 		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[currentTimelineIndex])
// 	} else {
// 		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
// 	}
// 	set(currentNodeAtom, newCurrentNode)
// 	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
// 	// set(nodesStateAtom, (prev) => ({
// 	// 	...prev,
// 	// 	currentNode: newCurrentNode,
// 	// 	currentTimelineIndex: newCurrentTimelineIndex
// 	// }))
// })

// export const nodesStore = createStore({
// 	nodes: nodesAtom,
// 	currentNode: currentNodeAtom,
// 	nodeIDsTimeline: nodeIDsTimelineAtom,
// 	currentTimelineIndex: currentTimelineIndexAtom 
// })

