"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import _ from "lodash";

export default function NodeCardsArea() {
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
