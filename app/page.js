import dynamic from 'next/dynamic';
import styles from "./page.module.css";
// import styled from "styled-components";
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
// import IdeaCompositionArea from '../public/components/IdeaCompositionArea.js';

import mongoose from 'mongoose';
import { Node } from '../models/Node.js';

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
				<div>Hello World</div>

				<NodeCardsArea nodes={nodesFromServer} />
			</div>
		</main>
	);
}
