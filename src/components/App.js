import React, {useEffect} from 'react';
import { ForceGraph3D } from 'react-force-graph';
import CreateArea from './CreateArea.js';
import NodeCard from './NodeCard.js';
import styled from 'styled-components';
import nodes from "./nodes.json"
//import ForceGraph3d from './components/ForceGraph3D';

function App() {

  //makes sure all node frequencies add up to 1 while keeping the same appearance rate
  function updateNodeFrequencies(nodeNumDelta){
    let oldNumNodes = nodes.length
    let newNumNodes = oldNumNodes + nodeNumDelta
    let oldDefaultFreq = 1 / oldNumNodes
    let newDefaultFreq = 1 / newNumNodes

    nodes.forEach( node => {
      if(node.hasOwnProperty("probability")){
        let probRatio = node.frequency / oldDefaultFreq
        node.frequency = probRatio * newDefaultFreq
      }
    })
    console.log("nodes",nodes)
  }

  function getWeightedRandomNodeId(){
    let interval = 1/nodes.length
    let randNum = Math.random() // range of [0,1)
    let counter = 0
    nodes.forEach( node => {
      //check if rand number is between counter and counter + nodes frequency
      if ( randNum >= counter && randNum < counter + node.frequency) {
        return node.id
      } else {
        counter += node.frequency
      }
    })
  }

  function changeNodeFrquency(nodeId, isIncreased) {
    let numNodes = nodes.length
    let numerator = isIncreased ? 1 : -1
    let freqModifier = numerator / (numNodes * numNodes)
    
    let newFrequency = nodes[nodeId].frequency + numNodes * freqModifier
    
    if (Math.abs(1 - newFrequency) >= 1e-12 ) {
      nodes[nodeId].frequency = newFrequency

      //redistribute frequencies of other nodes so they still add up to ~1
      nodes.forEach(node => {
        node.frequency -= freqModifier
      })
    }
  }

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
    <StyledApp id="App">
      <div className='force-graph'>
        <ForceGraph3D 
          graphData={gData()}
          width={1000}
        />
      </div>
      
      <CreateArea/>
      
    </StyledApp>
  );
}

export default App;

let StyledApp = styled.div`
  display: flex;
  text-align: center;
//
//.App-header {
//  min-height: 100vh;
//  display: flex;
//  flex-direction: column;
//  align-items: center;
//  justify-content: center;
//  font-size: calc(10px + 2vmin);
//  color: white;
//}
`
