"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import _ from "lodash";
import { nodesAtom, currentNodeAtom } from "@/public/atoms.js";
import { useEffect } from "react";
import ForceGraph3D from "@/public/components/ForceGraph3DWrapper.js";

export default function NodeCardsArea(nodesFromServer) {
  useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]]);

  const currentNode = useAtomValue(currentNodeAtom);

  useEffect(() => {
    if (currentNode == null) {
    }
  }, []);

  return (
    <StyledNodeCardsArea id="node-cards-area">
      {/* <ForceGraph3D
        graphData={gData} 
        // nodeAutoColorBy="group"
        // nodeThreeObject={(node) => {
		// 	const sprite = new SpriteText(node.id);
		// 	sprite.color = node.color;
		// 	sprite.textHeight = 8;
		// 	return sprite;
        // */}
      <NodeCard />
      <ForceGraph3D />
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
