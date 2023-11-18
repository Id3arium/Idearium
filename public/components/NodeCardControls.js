
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "@emotion/styled";
import { isFlippedSig } from "@/lib/hooks/useNodeCardLogic";

export default function NodeCardControls({ isFlipped, onPrevCardClicked, onNextCardCliked, downDistributeFrequency, currentNode, upDistributeFrequency }) {
    return (
        <StyledNodeCardControls id="card-controls">
            <IconButton className="nav-btn top left outlined"
                onClick={() => { onPrevCardClicked(); }}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton className="nav-btn top right outlined"
                onClick={() => { onNextCardCliked(); }}
            >
                <KeyboardArrowRightIcon disabled={true} />
            </IconButton>
            {isFlipped && <div>
                <IconButton className="nav-btn bottom left outlined"
                    onClick={() => {
                        downDistributeFrequency(currentNode.id);
                    }}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined"
                    onClick={() => {
                        upDistributeFrequency(currentNode.id);
                    }}
                >
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </StyledNodeCardControls>
    )
}

const StyledNodeCardControls = styled.div(`    
    display: none;
    
    .nav-btn {
        color: white;
        position: absolute;
        z-index: 1;
    }

    .outlined:hover {
        outline: 1px solid #ffffff80;
    }
    
    .left { left: 10px; }

    .right { right: 10px; }

    .top { top: 10px; }
    
    .bottom { bottom: 10px; }
`)