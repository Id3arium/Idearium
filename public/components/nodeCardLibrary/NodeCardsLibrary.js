import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LibraryNodeCard from '@/components/nodeCardLibrary/LibraryNodeCard'; 
import { useAtomValue} from 'jotai';
import { nodesAtom,  } from '@/utils/atoms.js';

export default function NodeCardsLibrary() {
    const nodes = useAtomValue(nodesAtom)
    const [searchTerm, setSearchTerm] = useState('');
    const nodesList = Object.values(nodes)
    const [filteredNodes, setFilteredCards] = useState();


    useEffect(() => {
        if (searchTerm == "") {
            setFilteredCards(nodesList);
            return;
        }
        const filtered = nodesList.filter(node => 
            node.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            node.content.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            node.inspiration.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        setFilteredCards(filtered);
    }, [searchTerm, nodesList]);

    return (
        <LibraryContainer>
            <SearchBar
                type="text"
                placeholder="Search Node Cards..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <CardList>
                {filteredNodes?.map(node => (
                    <LibraryNodeCard key={node.id} node={node}/>
                ))}
            </CardList>
        </LibraryContainer>
    );
}

const LibraryContainer = styled.div`
    position: absolute;
    top: 0;
    right: 10px;
    width: 350px;
    height: 100%;
    background-color: blue;
    overflow-y: auto;
`;

const SearchBar = styled.input`
    margin: 3px;
    height: 30px;
    border-radius: 1px;
    border-width: 0px;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column; 
`;
