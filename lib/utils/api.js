export async function fetchNodes() {
    const res = await fetch('/api/route', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    })
    const data = await res.json()
    // console.log('API.fetchNodes: nodes from database', data)
    return data
}

export async function createNodeInDB(node) {
    const res = await fetch(`/api/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(node),
    });
    const responseJson = await res.json();
    if (responseJson) {
        console.log("API.createNodeInDB newNode", responseJson);
        return responseJson
    }
    else return null
}

export async function updateNodeInDB(nodeID) {
    const responseJson = await updateNodesInDB([nodeID])
    if (responseJson) {
        console.log("API.updateNodeInDB updatedNode", responseJson);
        return responseJson
    }
    else return null
}

export async function updateNodesInDB(nodes) {
    const response = await fetch(`/api/route`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(nodes),
    });
    if (!response.ok) {
        throw new Error('API.updateNodesInDB Network response was not ok');
    }
    if (response.error) {
        console.log("API.updateNodesInDB error:", error.message);
        throw new Error(response.error);
    }
    const responseJson = await response.json();
    console.log("API.updateNodesInDB responseJson:", responseJson);
    return responseJson
}

export async function removeNodeInDB(nodeID) {
    const queryParams = new URLSearchParams({
        "node-id": nodeID,
    });
    const url = `/api/route?${queryParams.toString()}`
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
    })
    if (!response.ok) {
        throw new Error('API.removeNodeInDB Network response was not ok');
    }
    if (response.error) {
        console.error("API.removeNodeInDB error:", error.message);
        throw new Error(response.error);
    }
    return await response.json();
}

export async function fetchNextRandomNode(currNode) {
    const queryParams = new URLSearchParams({
        "next-random-node": true,
        "curr-node-id": currNode ? currNode.id : null,
    });
    const url = `/api/route?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
    const responseJson = await res.json();
    console.log('API.fetfetchNextRandomNode: responseJson', responseJson)

    if (responseJson) {
        console.log('API.fetfetchNextRandomNode: responseJson', responseJson)
        return responseJson;
    }
    return null
}

export async function fetchNodeById(nodeID) {
    const queryParams = new URLSearchParams({
        "get-node-by-id": true,
        "node-id": nodeID,
    });
    const url = `/api/route?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
    const responseJson = await res.json();
    if (responseJson) {
        console.log('API.fetchNodeById: responseJson', responseJson)
        setCurrentNode(nodeData.node)
        return responseJson;
    }
    return null
}

export async function changeNodeFrequency(frequencyChange, nodeIdx) {
    const request = {
        "frequency-change": frequencyChange,
        "node-idx": nodeIdx,
    }
    console.log('API.changeNodeFrequency: request', request)
    const res = await fetch(`/api/route`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const responseJson = await res.json();
    console.log('API.changeNodeFrequency: node updated', responseJson)
    return responseJson;
}

export async function resetNodeFrequencies() {
    const request = {
        "reset-frequencies": true,
    }
    console.log('API.changeNodeFrequency: request', request)
    const res = await fetch(`/api/route`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const responseJson = await res.json();
    console.log('APIetNodeFrequencies: node updated', responseJson)
    return responseJson;
}