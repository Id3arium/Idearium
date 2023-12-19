import React from "react";
import loading from "../assets/loading.svg";
import Image from "next/image";
import { PositionedComponent } from "./PositionedComponent";

const Loading = () => (
    <PositionedComponent position="centered">
        <div className="spinner">
            <Image src={loading} alt="Loading" />
        </div>
    </PositionedComponent>
);

export default Loading;
