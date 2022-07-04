import './App.css';
import './ForceGraph3D.css'
import { ForceGraph3D } from 'react-force-graph';
//import ForceGraph3d from './components/ForceGraph3D';

function App() {
  let gData = () => {
    // Random tree
    const N = 300;
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
  let forceGraph3D = <ForceGraph3D 
    className="force-graph-3d"
    graphData={gData()}
    width="500px"
  />
  return (
    <div className="App">
      {forceGraph3D}
    </div>
  );
}

export default App;
