'use client';
import React, { useCallback, useRef } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import styled from 'styled-components'



export default function ForceGraph_3D() {
    let ref = useRef();

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
          if (ref.current) {
            console.log(ref.current);
            ref.current.cameraPosition(
              {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio
              },
              node,
              3000
            );
          }
        },
        [ref]
      );
    
      return (
        <DivForceGraph3D>
          <ForceGraph3D
            ref={ref}
            graphData={data}
            nodeLabel="id"
            nodeAutoColorBy="group"
            onNodeClick={handleClick}
          />
        </DivForceGraph3D>
      );
}

let DivForceGraph3D = styled.div `
    border: 2px solid #888;
    margin: 0px auto;
    width: 1600px;
    height: 300px;
`