import { Opacity } from "@mui/icons-material";
import styled from "styled-components";

export default function NodeCardContent({
    isFlipped,
    isHovered,
    node,
    currentTimelineIndex,
    nodeIDsTimelineLength,
}) {
    function getConditionalStyles(isVisible) {
        const opacityClass = isVisible ? "opacity-100" : "opacity-35";
        const scaleClass = isVisible ? "scale-x-[1]" : "scale-x-[-1]";
        const blurClass = isVisible
            ? ""
            : isHovered
            ? "blur-[4px]"
            : "blur-[15px]";
        return `${opacityClass} ${scaleClass} ${blurClass}`;
    }

    return (
        <div
            id="card-content"
            className={`relative grid text-center pointer-events-none select-none`}
        >
            <div
                id="front-side"
                className={`py-2.5 col-start-1 row-start-1 ${getConditionalStyles(!isFlipped)}`}
            >
                {node?.title && <h1>{node?.title}</h1>}
                <p style={{ whiteSpace: "pre-line" }}>{node?.content}</p>
            </div>
            <div
                id="back-side"
                className={`py-2.5 col-start-1 row-start-1 ${getConditionalStyles(isFlipped)}`}
            >
                <h1 className="mb-4 text-xl text-center">
                    Node [{currentTimelineIndex + 1} / {nodeIDsTimelineLength}]
                </h1>
                <p> - {node?.inspiration} </p>
                <br />
                <p className="absolute left-0 right-0 -bottom-1 text-base">
                    {(node?.frequency * 100).toFixed(2)}% Likely to appear
                </p>
            </div>
        </div>
    );
}

const StyledCardSide = styled.div`
    opacity: ${(props) => (props.$isVisible ? "1" : ".15")};
    filter: ${(props) =>
        props.$isVisible
            ? "none"
            : props.$isHovered
            ? "blur(3px)"
            : "blur(9px)"};
    transform: ${(props) =>
        props.$isVisible ? "scale(1, 1)" : "scale(-1, 1)"};
    padding: 10px 0px;
    grid-area: 1/1;
    pointer-events: none;
`;

const StyledNodeCardContent = styled.div`
    display: grid;
    align-items: center;
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
`;
