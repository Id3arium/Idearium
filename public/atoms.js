import { atom, createStore } from 'jotai';

export const nodesAtom = atom([])
export const currentNodeAtom = atom(null)
export const nodeIDsTimelineAtom = atom([])
export const currentTimelineIndexAtom = atom(-1)

// export const getNodesListAtom = atom( (get) => get(nodesStateAtom).nodes.map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )
export const getNodesListAtom = atom( (get) => get(nodesAtom).map((node) => <li key={node._id}> {node._id} {node.title} { node.content} </li>) )

//gets a random node, but nodes with higher frequency are more likely to be chosen
export const getWeightedRandomNodeAtom = atom( (get) => {
	const nodes = get(nodesAtom)
	if (!nodes) { return null; }
	let randNum = Math.random(); // range of [0,1)
	let frequencySigma = 0; //the sum of all node frequencies must add up to ~1 

	for (let i = 0; i < nodes.length; i++) {
		let currentNodeFrequency = nodes[i].frequency
		//likelyhood of randNum being inside the range is === to the nodes appearance frequency
		let isRandNumInNodeRange = randNum >= frequencySigma && randNum < (frequencySigma + currentNodeFrequency)
		if (isRandNumInNodeRange) {
			console.log("random node is", nodes[i]._id)
			return nodes[i]
		} else {
			frequencySigma += currentNodeFrequency
		}
	}
})

export const previousNodeAtom = atom((get) => {
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	if (currentTimelineIndex > 0) {
		const newCurrentTimelineIndex = currentTimelineIndex - 1
		const nodeIDsTimeline = get(nodeIDsTimelineAtom)
		const nodes = get(nodesAtom)
		const newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
		set(currentNodeAtom, newCurrentNode)
		set(currentTimelineIndexAtom, newCurrentTimelineIndex)
		// set(nodesStateAtom, (prev) => ({
		// 	...prev,
		// 	currentNode: newCurrentNode,
		// 	currentTimelineIndex: newCurrentTimelineIndex
		// }))
	}
})

export const nextNodeAtom = atom((get) => {
	const nodes = get(nodesAtom)
	const nodeIDsTimeline = get(nodeIDsTimelineAtom)
	const currentTimelineIndex = get(currentTimelineIndexAtom)
	
	const newCurrentTimelineIndex = currentTimelineIndex + 1
	const atEndOfTimeline = currentTimelineIndex === nodeIDsTimeline.length - 1
	let newCurrentNode = null

	if (atEndOfTimeline){
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[currentTimelineIndex])
	} else {
		newCurrentNode = nodes.find(node => node.id === nodeIDsTimeline[newCurrentTimelineIndex])
	}
	set(currentNodeAtom, newCurrentNode)
	set(currentTimelineIndexAtom, newCurrentTimelineIndex)
	// set(nodesStateAtom, (prev) => ({
	// 	...prev,
	// 	currentNode: newCurrentNode,
	// 	currentTimelineIndex: newCurrentTimelineIndex
	// }))
})

export const nodesStore = createStore({
	nodes: nodesAtom,
	currentNode: currentNodeAtom,
	nodeIDsTimeline: nodeIDsTimelineAtom,
	currentTimelineIndex: currentTimelineIndexAtom 
})