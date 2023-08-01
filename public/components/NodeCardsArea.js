"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import _ from "lodash";
import { useEffect } from "react";
import * as API from '@/lib/utils/api.js'
import { nodesAtom } from "@/lib/utils/atoms.js";
import { useAtom, useSetAtom } from "jotai";

export default function NodeCardsArea() {
    // useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]]);

    // const currentNode = useAtomValue(currentNodeAtom);
    const [nodes, setNodes] = useAtom(nodesAtom)

    async function fetchNodes() {
        const fetchedNodes = await API.fetchNodes()
        setNodes([...fetchedNodes])
    }

    useEffect(() => {
        fetchNodes()
    }, []);
    
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
