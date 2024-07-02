// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import Close from "@mui/icons-material/Close";
// import Check from "@mui/icons-material/Check";

// export default function NodeCardControls({
//     node,
//     actions,
//     isFlipped,
//     isHovered,
//     isEditing,
//     onEditCardClicked,
//     onCancelEditClicked,
//     onConfirmEditClicked,
// }) {
//     const buttonClass = "relative w-9 h-9 mx-2 rounded-full outline-none hover:outline hover:outline-1 hover:outline-white/50";

//     return (
//         <div
//             id="card-controls"
//             // className={`
//             //     ${isHovered || isFlipped ? "opacity-100" : "opacity-0"}
//             //     absolute left-0 right-0 bottom-0
//             //     py-2 w-full h-[50px]
//             //     ${isFlipped ? "bg-blue-500/25" : "bg-transparent"}
//             //     rounded-bl-lg rounded-br-lg
//             //     transition-all duration-300
//             //     border border-white/20
//             //     -z-10 overflow-hidden
//             // `}
//             className={`${isHovered || isFlipped ? "opacity-100 " : "opacity-0"} 
//             ${isFlipped ? "bg-blue/15 border-white/15" : "bg-transparent border-transparent"} 
//             relative left-0 right-0 py-2 w-full h-[50px] border 
//             rounded-bl-md rounded-br-md transition-all duration-150`}
//         >
//             <button
//                 className={buttonClass}
//                 onClick={() => {
//                     actions.downDistributeFrequency(node.id);
//                 }}
//             >
//                 <ArrowDropDownIcon className="text-white" />
//             </button>
//             <button
//                 className={buttonClass}
//                 onClick={() => {
//                     actions.upDistributeFrequency(node.id);
//                 }}
//             >
//                 <ArrowDropUpIcon className="text-white" />
//             </button>
//             <button
//                 className={buttonClass}
//                 onClick={() => {
//                     actions.onPrevCardClicked();
//                 }}
//             >
//                 <KeyboardArrowLeftIcon className="text-white" />
//             </button>
//             <button
//                 className={buttonClass}
//                 onClick={() => {
//                     actions.onNextCardCliked();
//                 }}
//             >
//                 <KeyboardArrowRightIcon className="text-white" />
//             </button>
            
//             <div className="absolute right-0 top-2 flex overflow-visible">
//                 <div className={`absolute right-0 transition-all duration-300 ${isEditing ? 'top-0' : 'top-full'}`}>
//                     <button className={buttonClass} onClick={()=>actions.removeNode(node)}>
//                         <DeleteIcon className="text-white" />
//                     </button>
//                     <button className={buttonClass} onClick={onEditCardClicked}>
//                         <EditIcon className="text-white" />
//                     </button>
//                 </div>
//                 <div className={`absolute right-0 transition-all duration-300 ${isEditing ? '-top-full' : 'top-0'}`}>
//                     <button className={buttonClass} onClick={onCancelEditClicked}>
//                         <Close className="text-white" />
//                     </button>
//                     <button className={buttonClass} onClick={onConfirmEditClicked}>
//                         <Check className="text-white" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }
{/* <div className="absolute right-0 top-0 h-full w-[84px] ">
</div> */}

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
            id="card-controls"
            className={`${isHovered || isFlipped ? "opacity-100 " : "opacity-0"}
                ${isFlipped ? "bg-blue/15 border-white/15" : "bg-transparent border-transparent"}
                relative left-0 right-0 w-full h-[54px] border
                rounded-bl-md rounded-br-md transition-all duration-150`}
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
                <div className={`absolute right-0 transition-all duration-150 ${isEditing ? '-top-full' : 'top-0'}`}>
                    <button className={buttonClass} onClick={onRemoveCardClicked}>
                        <DeleteIcon className="text-white" />
                    </button>
                    <button className={buttonClass} onClick={onEditCardClicked}>
                        <EditIcon className="text-white" />
                    </button>
                </div>
                <div className={`absolute right-0 transition-all duration-150 ${isEditing ? 'top-0' : 'top-full'}`}>
                    <button className={buttonClass} onClick={onCancelEditClicked}>
                        <Close className="text-white" />
                    </button>
                    <button className={buttonClass} onClick={onConfirmEditClicked}>
                        <Check className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

