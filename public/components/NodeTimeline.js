'use client';
import styled from "styled-components";
import PositionedComponent from "@/components/PositionedComponent.js";
import { nodeIDsTimelineAtom } from "@/public/atoms.js";
import { useAtom } from "jotai";

export default function NodeTimeline() {
    const timelineData = useAtom(nodeIDsTimelineAtom)

    const TimelineNode = () => {
        const Node = styled.div`
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: white;
        `;
        return <Node />;
    };

    const TimelineEdge = () => {
        const Edge = styled.div`
            width: ${({ spacing }) => `calc(100% - ${spacing}px)`};
            height: 2px;
            background-color: grey;
        `;
        return <Edge />;
    };

    return (
        <PositionedComponent position="bottom-center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {timelineData.map((node, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <TimelineNode key={node.id} />
                        {index < timelineData.length - 1 && <TimelineEdge />}
                    </div>
                ))}
            </div>
        </PositionedComponent>
    );
};
