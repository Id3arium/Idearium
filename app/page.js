
export default async function Home() {
	// const [nodes, setNodes] = useNodesStore(state => [state.nodes, state.setNodes])
	// console.log("starting nodes:", nodes)
	// let testNodes = await getNodesFromDB()
	// console.log("stestNodes:", testNodes)

	
	// useEffect(() => {
	// 	let nodesJSON = JSON.parse(nodesString)
	// 	console.log("setting the nodes:", nodesJSON)
	// 	setNodes(nodesJSON)
	// }, [nodesString])

	// setWordCounts()

	// function getNodeCharCount(node) {
	// 	//let titleCount = node.title.split(" ").filter(word => word !== "").length
	// 	let titleCount = node.title.length
	// 	let contentCount = node.content.length
	// 	return titleCount + contentCount
	// }

	// function addNode(newNodeData){
	// 	let updatedNodes = updateNodeFrequencies(nodes)
	// 	let newNode = {
	// 		id: nodes.length,
	// 		title: newNodeData.title,
	// 		content: newNodeData.content,
	// 		inspiration: newNodeData.inspiration,
	// 		frequency: 1 / (nodes.length+1),
	// 		charCount: getNodeCharCount(newNodeData)
	// 	}
	// 	let newNodes = [...updatedNodes, newNode]
	// 	setNodes(newNodes)
	// }

	// function updateNodeFrequencies(nodes) {
	// 	let newFreqScalar = nodes.length / (nodes.length + 1)
    //     nodes.forEach((node) => {
	// 		node.frequency = node.frequency * newFreqScalar
    //     });
	// 	return nodes
    // }

	// function setWordCounts(){
	// 	nodes.forEach(node => {
	// 		node.charCount = getNodeCharCount(node)
	// 	});
	// }
	return (
        <div id="Home">
            <div>Hello World</div>
		</div>
	);
}
