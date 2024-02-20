import { Opacity } from "@mui/icons-material";
import styled from "styled-components";

export default function NodeCardContent({
    isFlipped,
    isHovered,
    node,
    currentTimelineIndex,
    nodeIDsTimelineLength,
}) {
    const frontSideClasses = [
        "py-2.5 pointer-events-none transition-opacity duration-100",
        !isFlipped ? "opacity-100 filter-none" : "opacity-15",
        !isFlipped ? "" : isHovered ? "blur-sm" : "blur-xl",
    ].join(" ");

    const frontSideStyle = {
        transform: !isFlipped ? "scale(1, 1)" : "scale(-1, 1)",
        // gridArea: "1 / 1",
    };

    return (
        <div
            id="card-content"
            className={`relative h-auto text-center pointer-events-none select-none`}
        >
            <div
                id="front-side"
                className={`absolute transition-opacity ${
                    !isFlipped
                        ? "opacity-100 filter-none"
                        : isHovered
                        ? "opacity-20 blur-[3px]"
                        : "opacity-20 blur-[9px]"
                }`}
                style={frontSideStyle}
            >
                {node?.title && <h1>{node?.title}</h1>}
                <p style={{ whiteSpace: "pre-line" }}>{node?.content}</p>
            </div>

            {/* Assuming back-side uses similar logic for visibility */}
            <div
                id="back-side"
                className={`py-2.5 transition-opacity ${
                    isFlipped
                        ? "opacity-100 filter-none"
                        : isHovered
                        ? "opacity-20 blur-[3px]"
                        : "opacity-20 blur-[9px]"
                } `}
                style={{
                    transform: isFlipped ? "scale(1, 1)" : "scale(-1, 1)",
                    // gridArea: "1 / 1",
                }}
            >
                <h1 className="my-0 text-xl text-center">
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
