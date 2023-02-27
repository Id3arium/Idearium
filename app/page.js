import dynamic from 'next/dynamic';
import styles from "./page.module.css";
import React from 'react'
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
import IdeaCompositionArea from '../public/components/IdeaCompositionArea.js';

import mongoose from 'mongoose';
import { Node } from '../models/Node.js';
import { Suspense } from 'react';

export default async function Home() {

	async function getNodesFromDB(){
		await mongoose.connect(process.env.IDEARIUM_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		// const data = await db.collection('asdfg').toArray();
		let nodes = await Node.find({}).exec()
		let nodesJSON = JSON.parse(JSON.stringify(nodes))
		await mongoose.connection.close();
		return nodesJSON
	}
	
	let nodesFromServer = await getNodesFromDB()

	return (
		<main className={styles.main}>
			<div id="Home">
				<IdeaCompositionArea />
				{/* <React.Suspense fallback={<div>Loading Card</div>}> */}
					<NodeCardsArea nodes={nodesFromServer} />
				{/* </React.Suspense> */}
			</div>
		</main>
	);
}
