'use client';
import React, { useCallback, useRef, useEffect, useState } from "react";
import ForceGraph3D, { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";
import styled from 'styled-components'

import { Object3D, Vector3, Scene, Camera, WebGLRenderer } from 'three';

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

export default function ForceGraph_3D() {
   const containerRef = useRef<HTMLDivElement>(null);
   const graphRef = useRef<ForceGraphMethods>(null);
   const isRotatingRef = useRef<boolean>(true);
   const angleRef = useRef<number>(0);

   const camPosRef = useRef<Coords | undefined>({ x: 0, y: 0, z: 300 });
   const rotationSpeed = 0.000042;
   const N = 500;

   const data: { nodes: NodeObject[], links: LinkObject[] } = {
      nodes: Array.from(Array(N).keys()).map((i) => ({ id: i })),
      links: Array.from(Array(N).keys())
         .filter((id) => id)
         .map((id) => ({
            source: id,
            target: Math.round(Math.random() * (id - 1)),
         })),
   };

   useEffect(() => {
      startRotationAnimation()
   }, []);

   const startRotationAnimation = (): () => any => {
      let distanceFromCenter = 1300
      console.log("isRotating", isRotatingRef.current)

      const rotationInterval = setInterval(() => {
         if (isRotatingRef.current) {
            camPosRef.current.x = distanceFromCenter * Math.sin(angleRef.current)
            camPosRef.current.z = distanceFromCenter * Math.cos(angleRef.current)

            graphRef.current.cameraPosition(camPosRef.current);
            angleRef.current -= rotationSpeed;
         }

      }, 10);
      return () => {
         clearInterval(rotationInterval); // Clear the interval when the component is unmounted
      };
   };

   const handleNodeClick = useCallback(
      (node: NodeObject) => {
         moveCamToCoords(node as Coords);
      },
      [graphRef]
   );

   const handle = (event: any) => {
      isRotatingRef.current = false
      setTimeout(() => {
         isRotatingRef.current = true
      }, 1000);
   }

   function moveCamToCoords(coords: Coords) {
      isRotatingRef.current = false
      const distanceAfterAnimation = 50;
      const animationSpeed = .01; //units per milisecond
      const distRatio = 1 + distanceAfterAnimation / Math.hypot(coords.x, coords.y, coords.z);

      let oldCamPos = getCamPos();
      camPosRef.current = {
         x: coords.x * distRatio,
         y: coords.y * distRatio,
         z: coords.z * distRatio
      };

      const distanceBeforeAnimation = calculateDistance(oldCamPos, coords);
      const duration = Math.sqrt(distanceBeforeAnimation / animationSpeed); //in miliseconds
      if (graphRef.current != null) {
         console.log("cameraPos", oldCamPos, "newCamPos", camPosRef.current, "dist", distanceBeforeAnimation, "duration", duration);
         graphRef.current.cameraPosition(camPosRef.current, { x: 0, y: 0, z: 0 }, duration);
      }
      setTimeout(() => {
         isRotatingRef.current = true
      }, 1000);
   }

   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      console.log("handleMouseDown", e.pageX, e.pageY)
      isRotatingRef.current = false;
   };
   const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      console.log("handleMouseUp", e.pageX, e.pageY)
      isRotatingRef.current = true;
   };
   const handleMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      console.log("handleWheel", e.pageX, e.pageY)
      isRotatingRef.current = false;
      setTimeout(() => {
         isRotatingRef.current = true;
      }, 100);
   };

   const getCamPos = () => {
      if (graphRef.current == null) { return { x: 0, y: 0, z: 0 }; }

      var camera = graphRef.current.camera();

      camera.updateMatrixWorld();
      let camPos = new Vector3();
      camera.getWorldPosition(camPos);
      return camPos;
   }

   function calculateDistance(pos1: Coords, pos2: Coords) {
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const dz = pos2.z - pos1.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
   }

   function updateCamPos(): void {
      let camPos = getCamPos()
      if (!areCoordsEqual(camPosRef.current, camPos)) {
         console.log("updateCamPos camPosRef.current", camPosRef.current, "camPos", camPos)
         camPosRef.current = camPos
      }

   }
   function areCoordsEqual(coord1: Coords, coord2: Coords): boolean {
      const epsilon = .1
      return (
         Math.abs(coord1.x - coord2.x) < epsilon &&
         Math.abs(coord1.y - coord2.y) < epsilon &&
         Math.abs(coord1.z - coord2.z) < epsilon
      );
   }

   return (
      <DivForceGraph3D >
         <div
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseUp={(e) => handleMouseUp(e)}
            onWheel={(e) => handleMouseWheel(e)}
         >
            <ForceGraph3D
               ref={graphRef}
               graphData={data}
               enableNodeDrag={false}
               // onEngineStop={() => { toggleRotationAnimation(rotationAanimationInterval, true) }}
               onEngineTick={() => updateCamPos()}
               nodeLabel="id"
               linkWidth={3}
               nodeRelSize={3}
               nodeAutoColorBy="group"
               onNodeClick={(node, event) => handleNodeClick(node)}
               onNodeRightClick={(node, event) => handle(event)}
               onNodeDrag={(node, event) => handle(event)}
               onNodeDragEnd={(node, event) => handle(event)}
               onNodeHover={(node, event) => handle(event)}

               onLinkClick={(link, event) => handle(event)}
               onLinkRightClick={(link, event) => handle(event)}
               onLinkHover={(link, event) => handle(event)}
            />
         </div>
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