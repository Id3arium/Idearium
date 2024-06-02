'use client';
import React from 'react';
import { nodeTimelineAtom } from "@/lib/utils/atoms.js";
import { useAtom } from "jotai";

export default function NodeTimeline() {
    // const nodeTimeline = useAtom(nodeTimelineAtom)

    const TimelineNode = () => (
        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
    );

    const TimelineEdge = ({ spacing }) => (
        <div className="h-0.5 bg-gray-500" style={{ width: `calc(100% - ${spacing}px)` }}></div>
    );

    return (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center">
            {timelineData.map((node, index) => (
                <div key={index} className="flex items-center">
                    <TimelineNode key={node.id} />
                    {index < timelineData.length - 1 && <TimelineEdge spacing={10} />}
                </div>
            ))}
        </div>
    );
};
