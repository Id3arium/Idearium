import { ForceGraph3D } from 'react-force-graph';
import CreateArea from './CreateArea.js';
import NodeCard from './NodeCard.js';
import styled from 'styled-components';
import nodes from "./nodes.json"
import React, {useEffect} from 'react';
//import ForceGraph3d from './components/ForceGraph3D';

function App() {

  //makes sure nodes have the same appearance frequncy after adding/removing a node
  function updateNodeProbabilities(nodeNumDelta){
    let oldNumNodes = nodes.length
    let newNumNodes = oldNumNodes + nodeNumDelta
    let oldDefaultProb = 1 / oldNumNodes
    let newDefaultProb = 1 / newNumNodes

    nodes.forEach( node => {
      if(node.hasOwnProperty("probability")){
        let probRatio = node.probability / oldDefaultProb
        node.probability = probRatio * newDefaultProb
      }
    })
    console.log("nodes",nodes)
  }



  function getNextNode(){}
  let gData = () => {
    // Random tree
    const clusterSize = 100;
    return {
      nodes: [...Array(clusterSize).keys()].map((i) => ({ id: i })),
      links: [...Array(clusterSize).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }))
    };
  }
  useEffect(()=>{

  },[])

  console.log(gData())
  return (
    <DivApp id="App">
      <ForceGraph3D 
        className="force-graph-3d"
        graphData={gData()}
        width={1000}
      />
      <NodeCard title='Title' content='content'/>
      <CreateArea/>
    </DivApp>
  );
}

export default App;

let DivApp = styled.div`
  .App {
    text-align: center;
  }

  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
`
