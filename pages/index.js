import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import App from '../public/components/App.js'
import styled from "styled-components";
import NodeCardsArea from '../public/components/NodeCardsArea.js';
import mongoose from 'mongoose';
import {Node} from '../models/Node.js'

export const getStaticProps = async (context) => {
	await mongoose.connect(process.env.IDEARIUM_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	// const data = await db.collection('asdfg').toArray();
	let nodes = await Node.find({}).exec()

	let nodesString = JSON.stringify(nodes)
	
    await mongoose.connection.close();
    return {
		props: {
			nodesString
        }
    }
}

export default function Home({ nodesString }) {
	let nodes = JSON.parse(nodesString)
	return (
		<StyledHome id="Home">
			<ul>
				{nodes.map(node => (
					<li key={node._id}>[{node._id}]: {node.title} {node.content}</li>
				))}
			</ul>
			<div className="force-graph">

			</div>
			<div>
				{/* <IdeaCompositionArea onAdd={addNode} /> */}
				{/* <NodeCardsArea /> */}
			</div>
		</StyledHome>
	);
}

let StyledHome = styled.div`
	height: 100%;
	display: flex;
	text-align: center;
`;



