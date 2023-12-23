"use client";
import styles from "./page.module.css";
import styled from "styled-components";
import NodeCardsArea from "@/components/NodeCardsArea.js";
import IdeaCompositionArea from "@/components/IdeaCompositionArea.js";
import NodeCardsLibrary from "@/components/nodeCardLibrary/NodeCardsLibrary";
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";
import Loading from "@/components/Loading.js";
import { GlobalHotKeys } from "react-hotkeys";
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    SignIn,
    SignOutButton,
} from "@clerk/nextjs";
import { PositionedComponent } from "@/public/components/PositionedComponent";

export default function Home() {
    const { actions, state } = useNodeCardLogic();
    const nodeCardKeyMap = {
        flip: "ctrl+f",
        prev: ["left"],
        next: ["right"],
        reset: "ctrl+r",
        delete: "ctrl+d",
    };
    const nodeCardHandlers = {
        // 'flip': async(e) => {e.preventDefault(); await actions.flipNodeCard()},
        prev: (e) => {
            e.preventDefault();
            actions.onPrevCardClicked();
        },
        next: (e) => {
            e.preventDefault();
            actions.onNextCardCliked();
        },
        reset: (e) => {
            e.preventDefault();
            resetNodeFrequencies();
        },
        delete: async (e) => {
            e.preventDefault();
            await removeNode(state.currentNode);
        },
    };

    return (
        <ClerkProvider>
            <SignedIn>
                <main className={styles.main}>
                    <GlobalHotKeys
                        keyMap={nodeCardKeyMap}
                        handlers={nodeCardHandlers}
                        focused="true"
                    >
                        <div id="Home">
                            <IdeaCompositionArea />
                            <NodeCardsLibrary />
                            <NodeCardsArea />
                            <PositionedComponent position={"top-right"}>
                                <SignOutButton />
                            </PositionedComponent>
                            {/* <NodeTimeline /> */}
                        </div>
                    </GlobalHotKeys>
                </main>
            </SignedIn>
            <SignedOut>
            <div class="relative w-screen h-screen flex">
                <div class="w-1/3 flex items-center justify-center">
                    <div class="absolute" style="top: 50%; transform: translateY(-50%);">
                        <SignIn></SignIn>
                    </div>
                </div>
            </div>

                    
            </SignedOut>
        </ClerkProvider>
    );
}

const LeftMiddleSection = styled.div`
    position: absolute;
    top: 20%;
    left: 0;
    width: 33.33%;
    height: 33.33%;
`;
