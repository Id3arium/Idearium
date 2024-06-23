import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import EditIcon from "@mui/icons-material/Edit";

export default function NodeCardControls({
    node,
    actions,
    isFlipped,
    isHovered,
    onEditCardClicked,
}) {
    return (
        <div
            id="card-controls"
            className={`${
                isHovered || isFlipped ? "opacity-100" : "opacity-0"
            } relative left-0 right-0 py-2 w-full h-[50px]`}
        >
            <button
                className="relative w-9 h-9 mx-2 rounded-full outline-none hover:outline hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.downDistributeFrequency(node.id);
                }}
            >
                <ArrowDropDownIcon className="text-white mx-auto" />
            </button>
            <button
                className="relative w-9 h-9 mx-2 rounded-full outline-none hover:outline hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.upDistributeFrequency(node.id);
                }}
            >
                <ArrowDropUpIcon className="text-white" />
            </button>
            <button
                className="relative w-9 h-9 mx-2 rounded-[50%] z-10 outline-none hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.onPrevCardClicked();
                }}
            >
                <KeyboardArrowLeftIcon className="text-white" />
            </button>
            <button
                className="relative w-9 h-9 mx-2 rounded-[50%] z-10 outline-none hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    actions.onNextCardCliked();
                }}
            >
                <KeyboardArrowRightIcon className="text-white" />
            </button>
            <button
                className="absolute w-9 h-9 right-2 rounded-full z-10 outline-none hover:outline hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    onEditCardClicked();
                }}
            >
                <EditIcon className="text-white" />
            </button>
        </div>
    );
}
