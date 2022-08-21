import { ForceGraph3D } from 'react-force-graph';
import CreateArea from './CreateArea.js';
import NodeCard from './NodeCard.js';
import styled from 'styled-components';
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
          target: Math.round(Math.random() * (id - 1))
        }))
    };
  }
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
