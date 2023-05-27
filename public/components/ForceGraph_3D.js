'use client';
import React, { useCallback, useRef, useEffect } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import styled from 'styled-components'

export default function ForceGraph_3D() {
    let graphRef = useRef();
  
    const N = 300;
    const data = {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1)),
        })),
    };
    const handleClick = useCallback(
      (node) => {
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        if (graphRef.current) {
          graphRef.current.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio,
            },
            node,
            3000
          );
        }
      },
      [graphRef]
    );
  
    useEffect(() => {
        let distanceFromCenter = 1500
        graphRef.current.cameraPosition({ z: distanceFromCenter });
    
        // Camera orbit
        let angle = 0;
        const rotationSpeed = 0.001; 
        const rotationInterval = setInterval(() => {
            graphRef.current.cameraPosition({
            x: distanceFromCenter * Math.sin(angle),
            z: distanceFromCenter * Math.cos(angle),
          });
          angle -= rotationSpeed;
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
          onNodeClick={handleClick}
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