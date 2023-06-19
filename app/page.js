
import dynamic from 'next/dynamic';
import styles from "./page.module.css";
import React from 'react'
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
import NodeTimeline from '@/public/components/NodeTimeline.js';
import IdeaCompositionArea from '@/public/components/IdeaCompositionArea.js';
import { getNodes, createNode } from '@lib/prisma/nodes.js'

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
	
	// let nodesFromServer = await getNodesFromDB()

	return (
		<main className={styles.main}>
			<div id="Home">
				<IdeaCompositionArea />
				<NodeCardsArea 
					// nodes={nodesFromServer}
				/>
				{/* <NodeTimeline /> */}
			</div>
		</main>
	);
}
