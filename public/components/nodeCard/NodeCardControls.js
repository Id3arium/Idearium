import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";

export default function NodeCardControls({
    node,
    actions,
    isFlipped,
    isHovered,
    isEditing,
    onEditCardClicked,
    onRemoveCardClicked,
    onCancelEditClicked,
    onConfirmEditClicked,
}) {
    const buttonClass = "relative w-9 h-9 m-2 rounded-full outline-none hover:outline hover:outline-1 hover:outline-white/50";

    return (
        <div
            className={`
                ${isHovered || isFlipped ? "h-[54px]" : "h-[0px]"} transition-all overflow-visible  
            `}
        >
            <div
                id="card-controls"
                className={`
                    ${isHovered || isFlipped ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
                    mx-0 rounded-[4px] transition-all
                `}
            >
                <button
                    className={buttonClass}
                    onClick={() => actions.downDistributeFrequency(node.id)}
                >
                    <ArrowDropDownIcon className="text-white" />
                </button>
                <button
                    className={buttonClass}
                    onClick={() => actions.upDistributeFrequency(node.id)}
                >
                    <ArrowDropUpIcon className="text-white" />
                </button>
                <button
                    className={buttonClass}
                    onClick={() => actions.onPrevCardClicked()}
                >
                    <KeyboardArrowLeftIcon className="text-white" />
                </button>
                <button
                    className={buttonClass}
                    onClick={() => actions.onNextCardCliked()}
                >
                    <KeyboardArrowRightIcon className="text-white" />
                </button>
                    <div
                        id="right-side-controls"
                        className="absolute right-0 top-0 h-full w-[104px] overflow-hidden"
                    >
                        <div className={`absolute right-0 transition-all ${isEditing ? '-top-full' : 'top-0'}`}>
                            <button className={buttonClass} onClick={onRemoveCardClicked}>
                                <DeleteIcon className="text-white" />
                            </button>
                            <button className={buttonClass} onClick={onEditCardClicked}>
                                <EditIcon className="text-white" />
                            </button>
                        </div>
                        <div className={`absolute right-0 transition-all ${isEditing ? 'top-0' : 'top-full'}`}>
                            <button className={buttonClass} onClick={onCancelEditClicked}>
                                <Close className="text-white" />
                            </button>
                            <button className={buttonClass} onClick={onConfirmEditClicked}>
                                <Check className="text-white" />
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
}