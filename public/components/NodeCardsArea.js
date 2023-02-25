'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import {atom, useAtom, useSetAtom, useAtomValue, createStore} from 'jotai';
import {useHydrateAtoms} from 'jotai/utils';
// import { ForceGraph3D } from "react-force-graph";
import {nodesAtom, currentNodeAtom} from '@/public/atoms.js';

export default function NodeCardsArea(nodesFromServer) {
	useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]])

	const [currentNode, setCurrentNode] = useAtom(currentNodeAtom)
	const nodes = useAtomValue(nodesAtom)
	const weightedRandomNode = getWeightedRandomNode(nodes)
	
	useEffect( () => {
		setCurrentNode(!currentNode ? weightedRandomNode : currentNode)

		// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	}, [currentNode,weightedRandomNode])

	// if (nodeIDsTimeline.length === 0){
	// 	setNodeIDsTimeline((prev) => [...prev, getWeightedRandomNode()] )
	// 	// addNodeIDToTimeline()
	// }

	return (
		<StyledNodeCardsArea id="node-cards-area">
			<div> Node Cards Area </div>
			{/* <ForceGraph3D graphData={gData()}/> */}
			<NodeCard
				nodeData = {currentNode}
				duration = {50}
			/>
		</StyledNodeCardsArea>
	);
}

let StyledNodeCardsArea = styled.div`
	position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
	margin: 20px;
	overflow-y: hidden;
	width: 600px;
`;
