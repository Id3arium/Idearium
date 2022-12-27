import create from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import nodesFromJSON from "./nodes.json";

let nodesStore = (set) => ({
	nodes: nodesFromJSON,
	setNodes: (newNodes) => set((state) => ({nodes: [...newNodes]}))
})

let nodeCardStore = (set) => ({
	frontSideVisible: true,
	isHovered: false,
	setFrontSideVisible: (isVisible) => set((state) => ({frontSideVisible: isVisible})),
	setIsHovered: (isHovered) => set((state) => ({isHovered: isHovered})),
})

let nodesTimelineStore = (set) => ({
	nodeIDsTimeline: [],
	currTimelineIdx: 0,
	currNodeID:0,
	isAtEndOfTimeline: true,
	setCurrTimelineIdx: (idx) => set((state) => ({
		currTimelineIdx: idx,
		currNodeID: state.nodeIDsTimeline[idx],
		isAtEndOfTimeline: idx+1 === state.nodeIDsTimeline.length
	})),
	addNodeIDToTimeline: (newNodeID) => set((state) => ({
		currTimelineIdx: state.nodeIDsTimeline.length,
		currNodeID: newNodeID,
		isAtEndOfTimeline: true,
		nodeIDsTimeline: [...state.nodeIDsTimeline,newNodeID],
	})),
})

export const useNodesStore = create(persist(devtools(nodesStore), {name:'nodes'}))
export const useNodeCardStore = create(devtools(nodeCardStore))
export const useNodesTimelineStore = create(devtools(nodesTimelineStore))