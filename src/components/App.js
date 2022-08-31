import React, { useEffect } from "react";
import { ForceGraph3D } from "react-force-graph";
import CreateArea from "./CreateArea.js";
import styled from "styled-components";
import nodes from "./nodes.json";
import NodeCardsArea from "./NodeCardsArea.js";
//import ForceGraph3d from './components/ForceGraph3D';

function App() {
  let gData = () => {
    // Random tree
    const clusterSize = 100;
    return {
      nodes: [...Array(clusterSize).keys()].map((i) => ({ id: i })),
      links: [...Array(clusterSize).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1)),
        })),
    };
  };

  useEffect(() => {}, []);

  console.log(gData());
  return (
    <StyledApp id="App">
      <div className="force-graph">
        <ForceGraph3D graphData={gData()} width={850} />
      </div>
      <div>
        <CreateArea />
        <NodeCardsArea nodes={nodes} />
      </div>
    </StyledApp>
  );
}

export default App;

let StyledApp = styled.div`
	display: flex;
	text-align: center;
`;
