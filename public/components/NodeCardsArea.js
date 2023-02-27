'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import {atom, useAtom, useSetAtom, useAtomValue, createStore} from 'jotai';
import {useHydrateAtoms} from 'jotai/utils';
// import { ForceGraph3D } from "react-force-graph";
import {nodesAtom, currentNodeAtom, weightedRandomNodeAtom} from '@/public/atoms.js';

export default function NodeCardsArea(nodesFromServer) {
	useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]])

	const [currentNode, setCurrentNode] = useAtom(currentNodeAtom)
    const weightedRandomNode = useAtomValue(weightedRandomNodeAtom)
	const wordsPerMinute = 200
	useEffect( () => {
		setCurrentNode(!currentNode ? weightedRandomNode : currentNode)
		// console.log("rerendering NodeCardsArea", "nodesList", nodesList)
	}, [currentNode])

    function getCurrentNodeCardDuration(wordsPerMinute) { 
        if (currentNode == null) { return 0 }
        const wordCount = currentNode.title.split(' ').length + currentNode.content.split(' ').length
        const nonSpaceCharCount = currentNode.title.length + currentNode.content.length - (wordCount - 1)
        const wordLength = nonSpaceCharCount / wordCount

        const averageWordLength = 5.1
        let readingTimeScaler = wordLength / averageWordLength
        const readingSpeedInSeconds = readingTimeScaler * (wordCount / (wordsPerMinute/60)) 
        return readingSpeedInSeconds
    }

	return (
		<StyledNodeCardsArea id="node-cards-area">
			{/* <ForceGraph3D graphData={gData()}/> */}
			<NodeCard
				duration = {getCurrentNodeCardDuration(wordsPerMinute)}
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
