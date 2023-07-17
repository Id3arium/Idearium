export async function fetchNodes() {
    const res = await fetch('api/index', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    })
    const data = await res.json()
    console.log('NodeCard.fetchNodes nodes from database', data)
    return data
}

export async function fetchNextRandomNode(currNode) {
    const queryParams = new URLSearchParams({
        "next-random-node": true,
        "curr-node-id": currNode ? currNode.id : null,
    });
    const url = `/api/index?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
    const randNodeData = await res.json()
    if (randNodeData.node) {
        console.log('NodeCard.fetfetchNextRandomNode() randNodeData.node', randNodeData.node)
        return randNodeData.node
    }
    return null
}

export async function fetchNodeById(nodeID) {
    const queryParams = new URLSearchParams({
        "get-node-by-id": true,
        "node-id": nodeID,
    });
    const url = `/api/index?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
    const nodeData = await res.json()
    if (nodeData.node) {
        console.log('NodeCard.fetchNode() node', nodeData.node)
        // setCurrentNode(nodeData.node)
        return nodeData.node
    }
    return null
}

export async function removeNodeInDB(nodeID) {
    const queryParams = new URLSearchParams({
        "node-id": nodeID,
    });
    const url = `/api/index?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
    })
    const data = await res.json();
    console.log('NodeCard.removeNodeInDB nodes from database', data)
    return data.node;
}

export async function changeNodeFrequency(frequencyChange, nodeIdx) {
    const request = {
        "frequency-change": frequencyChange,
        "node-idx": nodeIdx,
    }
    console.log('NodeCard.changeNodeFrequency request', request)
    const res = await fetch(`/api/index`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const data = await res.json();
    console.log('NodeCard.changeNodeFrequency node updated', data)
    return data.node;
}