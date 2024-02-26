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
            className={`grid text-center m-[40px] pointer-events-none select-none`}
        >
            <div
                id="front-side"
                className={`col-start-1 row-start-1 ${getConditionalStyles(!isFlipped)}`}
            >
                {node?.title && <h1>{node?.title}</h1>}
                <p>{node?.content}</p>
            </div>
            <div
                id="back-side"
                className={`col-start-1 row-start-1 ${getConditionalStyles(isFlipped)}`}
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
