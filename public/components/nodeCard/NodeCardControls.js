import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { IconButton } from "@mui/material";
import styled from "@emotion/styled";

export default function NodeCardControls({
    onPrevCardClicked,
    onNextCardCliked,
    isFlipped,
    isHovered,
    downDistributeFrequency,
    node,
    upDistributeFrequency,
}) {
    return (
        <div
            id="card-controls"
            className={`${isHovered ? "block" : "hidden"} relative`}
        >
            <button
                className="absolute w-9 h-9 top-3 left-3 rounded-[50%] z-10 outline-none  hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    onPrevCardClicked();
                }}
            >
                <KeyboardArrowLeftIcon className="text-white -m-right-1" />
            </button>
            <button
                className="absolute w-9 h-9 top-4 right-4 rounded-[50%] z-10 outline-none  hover:outline-1 hover:outline-white/50"
                onClick={() => {
                    onNextCardCliked();
                }}
            >
                <KeyboardArrowRightIcon className="text-white" />
            </button>
            {isFlipped && (
                <div className="absolute inset-x-0 bottom-2 z-10 flex justify-between">
                    <button
                        className="nav-btn outline-none hover:outline hover:outline-1 hover:outline-white/50"
                        onClick={() => {
                            downDistributeFrequency(node.id);
                        }}
                    >
                        <ArrowDropDownIcon className="text-white mx-auto" />
                    </button>
                    <button
                        className="nav-btn outline-none hover:outline hover:outline-1 hover:outline-white/50"
                        onClick={() => {
                            upDistributeFrequency(node.id);
                        }}
                    >
                        <ArrowDropUpIcon className="text-white" />
                    </button>
                </div>
            )}
        </div>
    );
}
