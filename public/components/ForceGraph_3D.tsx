'use client';
import React, { useCallback, useRef, useEffect, useState } from "react";
import ForceGraph3D, { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import styled from 'styled-components'

type NodeObject = object & {
   id?: string | number;
   x?: number;
   y?: number;
   z?: number;
   vx?: number;
   vy?: number;
   vz?: number;
   fx?: number;
   fy?: number;
   fz?: number;
};

type LinkObject = object & {
   source?: string | number | NodeObject;
   target?: string | number | NodeObject;
};
type Coords = { x: number; y: number; z: number; }
type FCwithRef<P = {}, R = {}> = React.FunctionComponent<P & { ref?: React.MutableRefObject<R | undefined> }>;

export default function ForceGraph_3D() {
   let graphRef = useRef<ForceGraphMethods>();
   let hasAutomaticActions = useRef(true);

   const N = 300;
   // const data = {
   //     nodes: [...Array(N).keys()].map((i) => ({ id: i })),
   //     links: [...Array(N).keys()]
   //         .filter((id) => id)
   //         .map((id) => ({
   //             source: id,
   //             target: Math.round(Math.random() * (id - 1)),
   //         })),
   // };
   const data: { nodes: NodeObject[], links: LinkObject[] } = {
      nodes: Array.from(Array(N).keys()).map((i) => ({ id: i })),
      links: Array.from(Array(N).keys())
         .filter((id) => id)
         .map((id) => ({
            source: id,
            target: Math.round(Math.random() * (id - 1)),
         })),
   };

   function executeOverAutomaticActions(callbackFn: () => any): void {
      hasAutomaticActions.current = false;
      callbackFn();
      hasAutomaticActions.current = true;
   }

   const handleClick = useCallback(
      (node: NodeObject) => {
         hasAutomaticActions.current = false;
         const distance = 40;
         const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
         if (graphRef.current) {
            graphRef.current.cameraPosition(
               {
                  x: node.x * distRatio,
                  y: node.y * distRatio,
                  z: node.z * distRatio,
               },
               node as Coords,
               3000
            );
         }
         setTimeout(() => {
            hasAutomaticActions.current = true;
         }, 10000);
      },
      [graphRef]
   );

   useEffect(() => {
      let distanceFromCenter = 1450
      // graphRef.current.cameraPosition({ z: distanceFromCenter });

      // Camera orbit
      let angle = 0;
      const rotationSpeed = 0.001;
      // const rotationSpeed = .01; 
      const rotationInterval = setInterval(() => {
         if (hasAutomaticActions.current) {
            graphRef.current.cameraPosition({
               x: distanceFromCenter * Math.sin(angle),
               z: distanceFromCenter * Math.cos(angle),
            });
            angle -= rotationSpeed;
         }

      }, 10);
      return () => {
         clearInterval(rotationInterval); // Clear the interval when the component is unmounted
      };
   }, []);

   return (
      <DivForceGraph3D>
         <ForceGraph3D
         ref={graphRef}
         graphData={data}
         nodeLabel="id"
         nodeAutoColorBy="group"
         onNodeClick={(node, event) => {
            executeOverAutomaticActions(() => handleClick(node))
         }}
         onNodeRightClick={(node, event) => {
         }}
         onNodeDrag={(node, translate) => {
         }}
         onNodeDragEnd={(node, translate) => {
         }}
         onLinkClick={(link, event) => {
         }}
         onLinkRightClick={(link, event) => {
         }}
         onBackgroundClick={(event) => {
         }}
         onBackgroundRightClick={(event) => {
         }}
      />
      </DivForceGraph3D>
   );
}

let DivForceGraph3D = styled.div`
    // border: 2px solid #888;
    // background-color: blue;
    // margin: 0px auto;
    // width: 1040px;
    // height: 100hv;
  `;