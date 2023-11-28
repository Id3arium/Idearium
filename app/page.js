
'use client';
import styles from "./page.module.css";
import styled from "styled-components";
import NodeCardsArea from '@/components/NodeCardsArea.js';
import IdeaCompositionArea from '@/components/IdeaCompositionArea.js';
import NodeCardsLibrary from '@/components/nodeCardLibrary/NodeCardsLibrary'
import { PositionedComponent } from "@/components/PositionedComponent.js";
import useNodeCardLogic from '@/lib/hooks/useNodeCardLogic.js'
import { GlobalHotKeys } from "react-hotkeys";

export default function Home() {
	const { actions, state } = useNodeCardLogic(); 
    const nodeCardKeyMap = {
        flip: 'ctrl+f',
        prev: ['left'],
        next: ['right'],
        reset: 'ctrl+r',
        delete: 'ctrl+d',
    }
    const nodeCardHandlers = {
        // 'flip': async(e) => {e.preventDefault(); await actions.flipNodeCard()},
        'prev': (e) => {e.preventDefault(); actions.onPrevCardClicked()},
        'next': (e) => {e.preventDefault(); actions.onNextCardCliked()} ,
        'reset': (e) => {e.preventDefault(); resetNodeFrequencies()},
        'delete': async (e) => {e.preventDefault(); await removeNode(state.currentNode)},
    }

	return (
		<main className={styles.main}>
			<GlobalHotKeys keyMap={nodeCardKeyMap} handlers={nodeCardHandlers} focused="true">
                <div id="Home">
                    <IdeaCompositionArea />
                    <NodeCardsLibrary /> 
                    <NodeCardsArea />
                    {/* <NodeTimeline /> */}
                </div>
            </GlobalHotKeys>
		</main>
	);
}


