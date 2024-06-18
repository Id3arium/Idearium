import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function NodeCardControls({
    node,
    actions,
    isFlipped,
    isHovered,
    onMouseEnter,
    onMouseLeave,
}) {
    return (
        <div
            id="card-controls"
            className={`${ 
                isHovered || isFlipped ? "opacity-100" : "opacity-0"
            } relative left-0 right-0 px-4 w-[525px] h-[50px]`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <button
                className="absolute w-9 h-9 left-0 rounded-[50%] z-10 outline-none  hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.onPrevCardClicked();
                }}
            >
                <KeyboardArrowLeftIcon className="text-white -m-right-1" />
            </button>
            <button
                className="absolute w-9 h-9 right-0 rounded-[50%] z-10 outline-none  hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.onNextCardCliked();
                }}
            >
                <KeyboardArrowRightIcon className="text-white" />
            </button>
            {isFlipped && (
                <div className="absolute inset-x-0 bottom-2 z-10 flex justify-between">
                    <button
                        className="nav-btn outline-none hover:outline hover:outline-1 hover:outline-white/50"
                        onClick={() => {
                            actions.downDistributeFrequency(node.id);
                        }}
                    >
                        <ArrowDropDownIcon className="text-white mx-auto" />
                    </button>
                    <button
                        className="nav-btn outline-none hover:outline hover:outline-1 hover:outline-white/50"
                        onClick={() => {
                            actions.upDistributeFrequency(node.id);
                        }}
                    >
                        <ArrowDropUpIcon className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
}
