
import styles from "./page.module.css";
import React from 'react'
import NodeCardsArea from '@/public/components/NodeCardsArea.js';
// import NodeTimeline from '@/public/components/NodeTimeline.js';
import IdeaCompositionArea from '@/public/components/IdeaCompositionArea.js';

export default function Home() {
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
