'use client';
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import {useAtomValue} from 'jotai';
import {useHydrateAtoms} from 'jotai/utils';
import _ from "lodash";
// import { ForceGraph3D } from "react-force-graph";
import {nodesAtom, currentNodeAtom} from '@/public/atoms.js';

export default function NodeCardsArea(nodesFromServer) {
	useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]])

	const wordsPerMinute = 50
	const currentNode = useAtomValue(currentNodeAtom)

    function getCurrentNodeCardDuration(wordsPerMinute) { 
        if (currentNode == null) { return 0 }
        const wordCount = currentNode.title.split(' ').length + currentNode.content.split(' ').length
        const nonSpaceCharCount = currentNode.title.length + currentNode.content.length - (wordCount - 1)
        const wordLength = nonSpaceCharCount / wordCount

        const averageWordLength = 5.1
        let readingTimeScaler = wordLength / averageWordLength
        const readingSpeedInSeconds = readingTimeScaler * (wordCount / (wordsPerMinute / 60)) 
        return _.round(readingSpeedInSeconds, 2)
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
