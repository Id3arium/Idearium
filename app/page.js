import dynamic from 'next/dynamic';
import styles from "./page.module.css";
import React from 'react'
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
import IdeaCompositionArea from '@/public/components/IdeaCompositionArea.js';

import mongoose from 'mongoose';
// import { Node } from '../models/Node.js';

export default async function Home() {

	async function getNodesFromDB(){
		// await mongoose.connect(process.env.IDEARIUM_URI, {
		// 	useNewUrlParser: true,
		// 	useUnifiedTopology: true,
		// });
		// // let nodes = await Node.find({}).exec()
		// let nodesJSON = JSON.parse(JSON.stringify(nodes))
		// await mongoose.connection.close();
		// return nodesJSON
	}
	
	// let nodesFromServer = await getNodesFromDB()

	return (
		<main className={styles.main}>
			<div id="Home">
				<IdeaCompositionArea />
				{/* <NodeCardsArea nodes={nodesFromServer} /> */}
			</div>
		</main>
	);
}
