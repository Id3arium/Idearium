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
   let graphRef = useRef<ForceGraphMethods>();
   let isRotatingRef = useRef<boolean>(true);
   let angleRef = useRef<number>(0);
   const rotationSpeed = 0.001;
   const N = 300;
   const initalCamPos = { x: 0, y: 0, z: 500 }

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
      let distanceFromCenter = 1500
      // graphRef.current.cameraPosition({ z: distanceFromCenter });
      console.log("isRotating", isRotatingRef.current)
      // Camera orbit
      let angle = 0;

      const rotationInterval = setInterval(() => {
         if (isRotatingRef.current) {
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
   const startRotationAnimation = (animationInterval: string | number | NodeJS.Timeout): () => any => {
      console.log("startRotationAnimation", "animationInterval:", animationInterval)
      let distanceFromCenter = 1500
      // graphRef.current.cameraPosition({ z: distanceFromCenter });
      console.log("isRotating", isRotatingRef.current)
      // Camera orbit
      let angle = 0;

      const rotationInterval = setInterval(() => {
         if (isRotatingRef.current) {
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
   };

   const stopRotationAnimation = (animationInterval: string | number | NodeJS.Timeout) => {
      console.log("stopRotationAnimation", "animationInterval:", animationInterval)
      clearInterval(animationInterval);
   };

   const setRotationAnimation = (animationInterval: string | number | NodeJS.Timeout, shouldStart: boolean) => {
      if (shouldStart) {
         startRotationAnimation(animationInterval);
      } else {
         stopRotationAnimation(animationInterval);
      }
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
      }, 1500);
   }

   function moveCamToCoords(coords: Coords) {
      isRotatingRef.current = false
      const distanceAfterAnimation = 50;
      const animationSpeed = .01; //units per milisecond
      const distRatio = 1 + distanceAfterAnimation / Math.hypot(coords.x, coords.y, coords.z);

      let oldCamPos = getCamPos();
      let newCamPos = {
         x: coords.x * distRatio,
         y: coords.y * distRatio,
         z: coords.z * distRatio
      };

      const distanceBeforeAnimation = calculateDistance(oldCamPos, coords);
      const duration = Math.sqrt(distanceBeforeAnimation / animationSpeed); //in miliseconds
      if (graphRef.current) {
         console.log("cameraPos", oldCamPos, "newCamPos", newCamPos, "dist", distanceBeforeAnimation, "duration", duration);
         graphRef.current.cameraPosition(newCamPos, { x: 0, y: 0, z: 0 }, duration);
      }
      setTimeout(() => {
         isRotatingRef.current = true
         // let camPos = getCamPos()
         // camPos.z = initalCamPos.z
         // graphRef.current.cameraPosition(camPos, { x: 0, y: 0, z: 0 }, duration);
      }, 2000);
   }

   function getCamPos(): Coords {
      var camera = graphRef.current.camera();
      camera.updateMatrixWorld();
      var newView = new Vector3();
      newView.copy(camera.position);
      let camPos = camera.localToWorld(newView);
      return { x: camPos.x / 3, y: camPos.y / 3, z: camPos.z / 2 };
   }

   function calculateDistance(pos1: Coords, pos2: Coords) {
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const dz = pos2.z - pos1.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
   }

   

   return (
      <DivForceGraph3D>
         <ForceGraph3D
            ref={graphRef}
            graphData={data}
            enableNodeDrag = {false}
            // onEngineStop={() => { toggleRotationAnimation(rotationAanimationInterval, true) }}
            nodeLabel="id"
            nodeAutoColorBy="group"
            onNodeClick={(node, event) => handleNodeClick(node) }
            onNodeRightClick ={(node, event) => handle(event) }
            onNodeDrag ={(node, event) => handle(event) }
            onNodeDragEnd ={(node, event) => handle(event) }
            // onNodeHover ={(node, event) => handle(event) }

            onLinkClick={(link, event) => handle(event) }
            onLinkRightClick={(link, event) => handle(event) }
            // onLinkHover={(link, event) =>  handle(event) }
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