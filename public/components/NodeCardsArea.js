"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import _ from "lodash";
import { useEffect ,useRef} from "react";
import * as API from '@/lib/utils/api.js'
import { clientNodesAtom, onNextNodeAtom } from "@/lib/utils/atoms.js";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import useRandomNode from '@/lib/hooks/useRandomNode.js'

export default function NodeCardsArea() {
    const hasAddedFirstTimelineNode = useRef(false);

    const [clientNodes, clientNodesNodes] = useAtom(clientNodesAtom)
    const onNextNode = useSetAtom(onNextNodeAtom)
    // const nodesCount = useAtomValue(nodesCountAtom)
    const getRandomNode = useRandomNode();

    async function fetchNodes() {
        const fetchedNodes = await API.fetchNodes()
        const nodesDictionary = Object.fromEntries(
            fetchedNodes.map(node => [node.id, node])
        )
        clientNodesNodes(nodesDictionary)
    }

    useEffect(() => {
        fetchNodes()
    }, []);

    useEffect(() => {
        // console.log("NodeCardsArea nodes changed and has", nodesCount)
        
        if (!hasAddedFirstTimelineNode.current) {
            const randNode = getRandomNode()
            if (randNode != null) {
                console.log("NodeCardsArea first node added", randNode)
                onNextNode(randNode);
                hasAddedFirstTimelineNode.current = true;
            }
        }
    }, [clientNodes])
    
    return (
        <StyledNodeCardsArea id="node-cards-area">
            <NodeCard />
        </StyledNodeCardsArea>
    );
}

let StyledNodeCardsArea = styled.div`
  margin: 20px;
  // overflow-y: hidden;
  width: 600px;
`;
