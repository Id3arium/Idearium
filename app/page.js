"use client";
import "./styles.css";
import NodeCardsArea from "@/components/NodeCardsArea.js";
import IdeaCompositionArea from "@/components/IdeaCompositionArea.js";
import NodeCardsLibrary from "@/components/nodeCardLibrary/NodeCardsLibrary";
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";

import { GlobalHotKeys } from "react-hotkeys";
import {ClerkProvider, SignedIn, SignedOut, SignIn, SignOutButton,} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import ForceGraph3D from "@/components/graph/ForceGraph3DWrapper.js";
import UserDashboard from "@/components/UserDashboard.js";
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
                <main class="">
                    <GlobalHotKeys
                        keyMap={nodeCardKeyMap}
                        handlers={nodeCardHandlers}
                        focused="true"
                    >
                        <div id="Home">
                            <ForceGraph3D id="ForceGraph3D" />
                            <UserDashboard name={userName} id={userId} />
                            <IdeaCompositionArea />
                            <NodeCardsLibrary />
                            <NodeCardsArea />
                            <div className="relative">
                                <div className="absolute m-auto top-0 right-0">
                                    <SignOutButton />
                                </div>
                            </div>
                            {/* <NodeTimeline /> */}
                        </div>
                    </GlobalHotKeys>
                </main>
            </SignedIn>
            <SignedOut>
                <div class="relative w-screen h-screen">
                    <ForceGraph3D id="ForceGraph3D" />
                    <div class="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <SignIn
                            appearance={{
                                baseTheme: dark,
                                variables: { 
                                    colorPrimary: '#4000FF',
                                    colorBackground: "#606060C0",
                                    colorInputBackground: "#404040C0",
                                    // colorText: "#FF0000",
                                    // colorTextSecondary: "#FF0000",
                                    colorWarning: "#FF0000",
                                },
                            }}
                        ></SignIn>
                    </div>
                </div>
            </SignedOut>
        </ClerkProvider>
    );
}
