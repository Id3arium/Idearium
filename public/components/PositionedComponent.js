import React from "react";
import styled from "styled-components";

export const PositionedComponent = styled.div`
  position: absolute;
  ${({ position }) => {
        if (position === "middle-center" || "centered") {
            return "left: 50%; top: 50%; transform: translate(-50%, -50%);";
        }

        const [vertical = "top", horizontal = "left"] = position
            ? position.split("-")
            : [];

        let styles = "";
        if (vertical === "top") {
            styles += "top: 0;";
        } else if (vertical === "bottom") {
            styles += "bottom: 0;";
        } else if (vertical === "middle") {
            styles += "top: 50%; transform: translateY(-50%);";
        }

        if (horizontal === "left") {
            styles += "left: 0;";
        } else if (horizontal === "right") {
            styles += "right: 0;";
        } else if (horizontal === "center") {
            styles += "left: 50%; transform: translateX(-50%);";
        }
        return styles;
    }}
`;

// const PositionedComponent = styled.div`
//     position: absolute;
//     ${({ position = "top-left" }) => {
//         const [vertical, horizontal] = position.split("-");

//         const styles = [];

//         if (vertical in positionLookup) {
//             styles.push(`${vertical}: ${positionLookup[vertical]};`);
//         }

//         if (horizontal in positionLookup) {
//             styles.push(`${horizontal}: ${positionLookup[horizontal]};`);
//         }

//         if (vertical === "middle" && horizontal === "center") {
//             styles.push("transform: translate(-50%, -50%);");
//         } else if (vertical === "middle") {
//             styles.push("transform: translateY(-50%);");
//         } else if (horizontal === "center") {
//             styles.push("transform: translateX(-50%);");
//         }

//         return styles.join(" ");
//     }}
//   `;
