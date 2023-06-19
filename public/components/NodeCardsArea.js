"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import _ from "lodash";
import { nodesAtom, currentNodeAtom } from "@/public/atoms.js";
import { useEffect } from "react";

export default function NodeCardsArea(nodesFromServer) {
    // useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]]);

    // const currentNode = useAtomValue(currentNodeAtom);

    // useEffect(() => {
    //     if (currentNode == null) {
    //     }
    // }, []);

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
