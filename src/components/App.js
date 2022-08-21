import './App.css';
import { ForceGraph3D } from 'react-force-graph';
import CreateArea from './CreateArea.js';
import NodeCard from './NodeCard.js';
import style
//import ForceGraph3d from './components/ForceGraph3D';

function App() {
  let gData = () => {
    // Random tree
    const N = 10;
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }))
    };
  }
  console.log(gData())
  return (
    <div className="App">
      <ForceGraph3D 
        className="force-graph-3d"
        graphData={gData()}
        width={1000}
      />
      <NodeCard title='Title' content='content'/>
      <CreateArea/>
    </div>
  );
}

export default App;
