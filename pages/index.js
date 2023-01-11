import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import App from '../public/components/App.js'
import styled from "styled-components";
import NodeCardsArea from '../public/components/NodeCardsArea.js';
import mongoose from 'mongoose';
import {Node} from '../models/Node.js'

export const getStaticProps = async (context) => {
	mongoose.connect(process.env.IDEARIUM_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
    const data = await Node.find().exec();
	const dataJSON = data.map(d => { // convert each instance of model to plain object
		d = d.toObject();
		d._id = d._id.toHexString();
		return d;
	});
    await mongoose.connection.close();
    return {
		props: {
			dataJSON
        }
    }
}

export default function Home({ dataJSON }) {
	console.log("dataJSON",dataJSON)
	return (
		<StyledHome id="Home">
			<ul>
				{dataJSON.map(item => (
					<li key={item.id}>{item.title} {item.content}</li>
				))}
			</ul>
			<div className="force-graph">

			</div>
			<div>
				{/* <IdeaCompositionArea onAdd={addNode} /> */}
				<NodeCardsArea />
			</div>
		</StyledHome>
	);
}

let StyledHome = styled.div`
	height: 100%;
	display: flex;
	text-align: center;
`;



