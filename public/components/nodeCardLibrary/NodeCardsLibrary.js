import React, { useState, useEffect } from 'react';
import LibraryNodeCard from '@/components/nodeCardLibrary/LibraryNodeCard';
import { useAtomValue } from 'jotai';
import { nodesAtom } from '@/utils/atoms.js';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';

export default function NodeCardsLibrary({ isFullscreen, setIsFullscreen }) {
    const nodes = useAtomValue(nodesAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNodes, setFilteredCards] = useState();

    useEffect(() => {
        const nodesList = Object.values(nodes);
        if (searchTerm === "") {
            setFilteredCards(nodesList);
            return;
        }
        const filtered = nodesList.filter(node =>
            node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.inspiration.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCards(filtered);
    }, [searchTerm, nodes]);

    return (
        <div
            id="node-cards-library"
            className="top-0 right-0 h-full"
        >
            <div className="flex items-center my-1">
                <button
                    onClick={()=>setIsFullscreen(!isFullscreen)}
                    className={`mr-2 p-1 rounded-full transition-all ease-in-out ${isFullscreen ? '-translate-x-full' : 'translate-x-0'}`}
                    aria-label="Toggle fullscreen mode"
                >
                    
                    {isFullscreen ? (
                        <FullscreenExit className="text-white" />
                    ) : (
                        <Fullscreen className="text-white" />
                    )}
                </button>
                <input
                    id="search-bar"
                    className="flex-grow h-8 rounded border-0 px-2 mr-3"
                    type="text"
                    placeholder="Search Node Cards..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                {filteredNodes?.map(node => (
                    <LibraryNodeCard key={node.id} node={node}/>
                ))}
            </div>
        </div>
    );
}

   
