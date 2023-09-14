"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import _ from "lodash";
import { useEffect ,useRef} from "react";
import * as API from '@/lib/utils/api.js'
import * as Atoms from '@/lib/utils/atoms.js';

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import useRandomNode from '@/lib/hooks/useRandomNode.js'
import useNodeCardLogic from '@/lib/hooks/useNodeCardLogic.js'
import { HotKeys } from "react-hotkeys";

export default function NodeCardsArea() {
    const hasAddedFirstTimelineNode = useRef(false);
    const { actions, state } = useNodeCardLogic();    


    const [clientNodes, clientNodesNodes] = useAtom(Atoms.clientNodesAtom)
    const onNextNode = useSetAtom(Atoms.onNextNodeAtom)
    const removeNode = useSetAtom(Atoms.removeNodeAtom)
    const resetNodeFrequencies = useSetAtom(Atoms.resetNodeFrequenciesAtom)
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

    const nodeCardKeyMap = {
        flip: 'f',
        prev: ['left'],
        next: ['right'],
        reset: 'ctrl+r',
        delete: 'ctrl+d',
    }
    const nodeCardHandlers = {
        // 'flip': (e) => {e.preventDefault(); actions.flipNodeCard()},
        'prev': (e) => {e.preventDefault(); actions.onPrevCardClicked()},
        'next': (e) => {e.preventDefault(); actions.onNextCardCliked()} ,
        'reset': (e) => {e.preventDefault(); resetNodeFrequencies()},
        'delete': async (e) => {e.preventDefault(); await removeNode(state.currentNode)},
    }
    
    return (
        <StyledNodeCardsArea id="node-cards-area">
            <HotKeys keyMap={nodeCardKeyMap} handlers={nodeCardHandlers} focused="true">
                <NodeCard />
            </HotKeys>
        </StyledNodeCardsArea>
    );
}

let StyledNodeCardsArea = styled.div`
  margin: 20px;
  overflow-y: hidden;
  width: 600px;
`;
