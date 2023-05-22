"use client";
import styled from "styled-components";
import NodeCard from "./NodeCard.js";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import _ from "lodash";
// import { ForceGraph3D } from "react-force-graph";
// import ForceGraph3D from 'react-force-graph-3d';
import { nodesAtom, currentNodeAtom } from "@/public/atoms.js";
import { useEffect } from "react";

// const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
// 	ssr: false
// });

export default function NodeCardsArea(nodesFromServer) {
  useHydrateAtoms([[nodesAtom, nodesFromServer.nodes]]);

  const currentNode = useAtomValue(currentNodeAtom);

  // const N = 300;
  // const gData = {
  //   nodes: [...Array(N).keys()].map((i) => ({ id: i })),
  //   links: [...Array(N).keys()]
  //     .filter((id) => id)
  //     .map((id) => ({
  //       source: id,
  //       target: Math.round(Math.random() * (id - 1)),
  //     })),
  // };

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
