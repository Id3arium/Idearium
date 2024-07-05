"use client";
import NodeCard from "./nodeCard/NodeCard.js";
import _ from "lodash";
import { useEffect, useRef } from "react";
import * as API from "@/lib/utils/api.js";
import * as Atoms from "@/lib/utils/atoms.js";

import { useAtom, useSetAtom, useAtomValue } from "jotai";
import useRandomNode from "@/lib/hooks/useRandomNode.js";

export default function NodeCardsArea() {
    const hasAddedFirstTimelineNode = useRef(false);

    const [clientNodes, setClientNodes] = useAtom(Atoms.clientNodesAtom);
    const onNextNode = useSetAtom(Atoms.onNextNodeAtom);
    const removeNode = useSetAtom(Atoms.removeNodeAtom);
    const resetNodeFrequencies = useSetAtom(Atoms.resetNodeFrequenciesAtom);
    // const nodesCount = useAtomValue(nodesCountAtom)
    const getRandomNode = useRandomNode();
    const user = useAtomValue(Atoms.userAtom);

    useEffect(() => {
        async function getUserNodes(userId) {
            const userNodes = await API.getUserNodes(userId);
            const nodesDictionary = Object.fromEntries(
                userNodes.map((node) => [node.id, node])
            );
            setClientNodes(nodesDictionary);
        }
        console.log("NodeCardsArea trying to get user nodes");

        if (user) {
            console.log("NodeCardsArea getting nodes for user:", user.id);
            getUserNodes(user.id);
        }
    }, [user, setClientNodes]);

    useEffect(() => {
        // console.log("NodeCardsArea nodes changed and has", nodesCount)

        if (!hasAddedFirstTimelineNode.current) {
            const randNode = getRandomNode();
            if (randNode != null) {
                console.log("NodeCardsArea first node added", randNode);
                onNextNode(randNode);
                hasAddedFirstTimelineNode.current = true;
            }
        }
    }, [clientNodes, getRandomNode, onNextNode]);

    return (
        <div
            id="node-cards-area"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none"
        >
            <div className="relative transform -translate-y-full">
                <NodeCard />
            </div>
        </div>
    );
}
