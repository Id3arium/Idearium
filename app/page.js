
import dynamic from 'next/dynamic';
import styles from "./page.module.css";
import React from 'react'
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
import IdeaCompositionArea from '@/public/components/IdeaCompositionArea.js';
import { getNodes, createNode } from '@lib/prisma/nodes.js'
import mongoose from 'mongoose';
// import { Node } from '../models/Node.js';
// import ForceGraph3D from 'react-force-graph-3d';

export default async function Home() {
	async function getNodesFromDB(){
		try {
			const { nodes, error } = await getNodes()
			// console.log("Home got nodes:", nodes)
			if (error) throw new Error(error)
			return nodes
		} catch (error) {
			console.log("Home error trying to get nodes:", error)
			return []
		}
	}
	
	let nodesFromServer = await getNodesFromDB()

	return (
		<main className={styles.main}>
			<div id="Home">
				<IdeaCompositionArea />
				<NodeCardsArea 
					nodes={nodesFromServer}
				/>
			</div>
		</main>
	);
}
