"use client";
import { useState, useEffect } from 'react';

import NodeCardsArea from "@/components/NodeCardsArea.js";
import IdeaCompositionArea from "@/components/IdeaCompositionArea.js";
import NodeCardsLibrary from "@/components/nodeCardLibrary/NodeCardsLibrary";
import useNodeCardLogic from "@/lib/hooks/useNodeCardLogic.js";
import ForceGraph3D from "@/components/graph/ForceGraph3DWrapper.js";
import UserDashboard from "@/components/UserDashboard.js";
import { GlobalHotKeys } from "react-hotkeys";

import { useUser } from "@clerk/nextjs";
import { userAtom } from "@/lib/utils/atoms.js";
import { useSetAtom } from "jotai";

export function SignedInPage() {
    const { user } = useUser();
    const setUser = useSetAtom(userAtom);

    useEffect(() => {
        setUser(user);
    }, [user, setUser]);

    const [isFullscreen, setIsFullscreen] = useState(false);

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
            actions.onNextCardClicked();
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
        <main className="relative w-screen h-screen overflow-hidden">
            <GlobalHotKeys
                keyMap={nodeCardKeyMap}
                handlers={nodeCardHandlers}
                focused="true"
            >
                <div id="Home" className="relative w-full h-full">
                    <ForceGraph3D id="ForceGraph3D" />
                    <div 
                        id="left-content" 
                        className={`absolute top-0 left-0 w-[375px] h-full transition-transform ease-in-out ${isFullscreen ? '-translate-x-full' : 'translate-x-0'}`}
                    >
                        <UserDashboard />
                        <IdeaCompositionArea />
                    </div>
                    <div 
                        id="right-content" 
                        className={`absolute top-0 right-0 w-[375px] h-full transition-transform ease-in-out ${isFullscreen ? 'translate-x-full' : 'translate-x-0'}`}
                    >
                        <NodeCardsLibrary
                            isFullscreen={isFullscreen}
                            setIsFullscreen={setIsFullscreen}
                        />
                    </div>
                    <NodeCardsArea />
                    <div className="relative"></div>
                    {/* <NodeTimeline /> */}
                </div>
            </GlobalHotKeys>
        </main>
    );
}

