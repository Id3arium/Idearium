export async function fetchNodes() {
    const res = await fetch('/api/route', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    })
    const data = await res.json()
    // console.log('API.fetchNodes: nodes from database', data)
    return data
}

export async function createNodeInDB(node){

    console.log("requesting to make node in DB", node)
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

export async function removeNodeInDB(nodeID) {
    const queryParams = new URLSearchParams({
        "node-id": nodeID,
    });
    const url = `/api/route?${queryParams.toString()}`
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
    })
    const responseJson = await res.json();
    console.log('API.removeNodeInDB: nodes from database', responseJson)
    return responseJson;
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
        method: 'POST',
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });
    const responseJson = await res.json();
    console.log('APIetNodeFrequencies: node updated', responseJson)
    return responseJson;
}