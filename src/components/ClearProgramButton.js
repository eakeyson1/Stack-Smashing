import React from "react";

function ClearProgramButton(props) {

  return (
    <div className="add-to-intro-button-container">
        <button class="pushable clear-button-width" onClick={props.clearProgram}  >
        <div class="shadow shadow-height-clear-button"></div>
        <div class="edge edge-height-clear-button"></div>
        <div class="front front-color-white front-padding-clear-button front-padding-add-to-intro-button-text-size">
            <h1 className="clear-button-text">Clear</h1>      
        </div>
        </button> 
    </div>
  );
}
export default ClearProgramButton;