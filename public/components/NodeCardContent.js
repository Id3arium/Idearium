import styled from "styled-components";

export default
    function NodeCardContent({ isFlipped, isHovered, currentNode, currentTimelineIndex, nodeIDsTimelineLength }) {
    return (
        <StyledNodeCardContent id="card-content">
            <StyledCardSide id="front-side" $isVisible={!isFlipped} $isHovered={isHovered}>
                {currentNode?.title && <h1>{currentNode?.title} </h1>}
                <p style={{ whiteSpace: "pre-line" }}>
                    {currentNode?.content}
                </p>
            </StyledCardSide>
            <StyledCardSide id="back-side" $isVisible={isFlipped} $isHovered={isHovered}>
                <h1> Node [{currentTimelineIndex + 1} / {nodeIDsTimelineLength}] </h1>
                <p> - {currentNode?.inspiration}  </p><br></br>
                <p className="frequency">
                    {(currentNode?.frequency * 100).toFixed(2)}% Likely to appear
                </p>
            </StyledCardSide>
        </StyledNodeCardContent>
    );
}

const StyledNodeCardContent = styled.div`
    display: grid;
    align-items:center;
    pointer-events: none;
    height: auto;
    
    h1 {
        text-align: center;
        font-size: 1.25em;
        margin: 0px 15px 20px;
    }

    p {
        margin: auto;
        font-size: 1.2em;
    }  

    .frequency {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        font-size: 1em;
    }
`
const StyledCardSide = styled.div`
    opacity: ${props => props.$isVisible ? "1" : ".15"};
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    transform: ${props => props.$isVisible ? "scale(1, 1)" : "scale(-1, 1)"};
    padding: 10px 0px;
    grid-area: 1/1;
    pointer-events: none;
`