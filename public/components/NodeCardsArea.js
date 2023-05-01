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
	
	const currentNode = useAtomValue(currentNodeAtom)

   

	return (
		<StyledNodeCardsArea id="node-cards-area">
			{/* <ForceGraph3D graphData={gData()}/> */}
			<NodeCard />
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
