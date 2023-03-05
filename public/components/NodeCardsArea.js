'use client';
import React, {useEffect} from "react";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import {useSetAtom, useAtomValue} from 'jotai';
import {useHydrateAtoms} from 'jotai/utils';
// import { ForceGraph3D } from "react-force-graph";
import {nodesAtom, currentNodeAtom, weightedRandomNodeAtom, addToNodeIDsTimelineAtom} from '@/public/atoms.js';
import {nodeIDsTimelineLengthAtom} from '@/public/atoms.js';

export default function NodeCardsArea(nodesFromServer) {
	useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]])

	const wordsPerMinute = 50

	const currentNode = useAtomValue(currentNodeAtom)
    const nodeIDsTimelineLength = useAtomValue(nodeIDsTimelineLengthAtom)
    const weightedRandomNode = useAtomValue(weightedRandomNodeAtom)

    const addToNodeIDsTimeline = useSetAtom(addToNodeIDsTimelineAtom)

	useEffect( () => {
        if(nodeIDsTimelineLength == 0){
            // console.log("NodeCardsArea new randomNode");
            console.log("NodeCardsArea nodeIDsTimelineLength2",nodeIDsTimelineLength);
            addToNodeIDsTimeline(weightedRandomNode?.id)
        }
    }, [])
    

    function getCurrentNodeCardDuration(wordsPerMinute) { 
        if (currentNode == null) { return 0 }
        const wordCount = currentNode.title.split(' ').length + currentNode.content.split(' ').length
        const nonSpaceCharCount = currentNode.title.length + currentNode.content.length - (wordCount - 1)
        const wordLength = nonSpaceCharCount / wordCount

        const averageWordLength = 5.1
        let readingTimeScaler = wordLength / averageWordLength
        const readingSpeedInSeconds = readingTimeScaler * (wordCount / (wordsPerMinute / 60)) 
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
