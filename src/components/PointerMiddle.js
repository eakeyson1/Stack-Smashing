import React from "react";
import "../css/functions.css";

function PointerMiddle(props) {

  return (
    <div>
        {props.hoverAddToProgram && (
            <div style={{display: 'flex'}}>
                <div className="pointer-to-program-base-green"></div>
                <div className="pointer-to-program-green"></div>
                <div className="pointer-to-program-top-green"></div>
            </div>
        )}
        {!props.hoverAddToProgram && (
            <div style={{display: 'flex'}}>
                <div className="pointer-to-program-base"></div>
                <div className="pointer-to-program"></div>
                <div className="pointer-to-program-top"></div>
            </div>
        )}
    </div>
  );
}
export default PointerMiddle;