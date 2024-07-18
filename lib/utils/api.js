async function parseResponse(response, functionName) {
    try {
        if (!response) {
            console.error(`${functionName}: No response received`);
            return;
        }
        if (!response.ok) {
            console.error(`${functionName}:Response was not ok`, response);
            return;
        }
        const responseJson = await response.json();
        console.log(`${functionName}: response json`, responseJson);
        return responseJson;
    } catch (error) {
        console.error(`${functionName}: Failed to parse JSON`, error);
        return null;
    }
}

export async function getUserNodes(userId) {
    const url = `/api/route?user-id=${userId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
    return parseResponse(res, "API.getUserNodes");
}

export async function createNodeInDB(node) {
    console.log("API.createNodeInDB creating", node);

    const res = await fetch(`/api/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(node),
    });
    return parseResponse(res, "API.createNodeInDB");
}

export async function updateNodeInDB(nodeID) {
    const res = await updateNodesInDB([nodeID]);

    return parseResponse(res, "API.updateNodesInDB");
}

export async function updateNodesInDB(nodes) {
    console.log("API.updateNodesInDB updating nodes:", nodes);
    const res = await fetch(`/api/route`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nodes),
    });
    return parseResponse(res, "API.updateNodesInDB");
}

export async function removeNodeInDB(nodeID) {
    const url = `/api/route?node-id=${nodeID}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {"content-type": "application/json",},
    });
    return parseResponse(res, "API.removeNodeInDB");
}

export async function fetchNextRandomNode(currNode) {
    const queryParams = new URLSearchParams({
        "next-random-node": true,
        "curr-node-id": currNode ? currNode.id : null,
    });
    const url = `/api/route?${queryParams.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
    return parseResponse(res, "API.fetchNextRandomNode");
}

export async function fetchNodeById(nodeID) {
    const queryParams = new URLSearchParams({
        "get-node-by-id": true,
        "node-id": nodeID,
    });
    const url = `/api/route?${queryParams.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    });
    return parseResponse(res, "API.fetchNodeById");
}

export async function changeNodeFrequency(frequencyChange, nodeIdx) {
    const request = {
        "frequency-change": frequencyChange,
        "node-idx": nodeIdx,
    };
    console.log("API.changeNodeFrequency: request", request);
    const res = await fetch(`/api/route`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    return parseResponse(res, "API.changeNodeFrequency");
}

export async function resetNodeFrequencies() {
    const request = {
        "reset-frequencies": true,
    };
    console.log("API.changeNodeFrequency: request", request);
    const res = await fetch(`/api/route`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    return parseResponse(res, "API.resetNodeFrequencies");
}
