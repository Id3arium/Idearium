import React, { useState, useEffect } from 'react';
import LibraryNodeCard from '@/components/nodeCardLibrary/LibraryNodeCard'; 
import { useAtomValue } from 'jotai';
import { nodesAtom } from '@/utils/atoms.js';

export default function NodeCardsLibrary() {
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
            className="top-0 right- h-full overflow-y-auto"
        >
            <input
                id="search-bar"
                className="m-1 h-8 rounded border-0"
                type="text"
                placeholder="Search Node Cards..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-col">
                {filteredNodes?.map(node => (
                    <LibraryNodeCard key={node.id} node={node}/>
                ))}
            </div>
        </div>
    );
}
