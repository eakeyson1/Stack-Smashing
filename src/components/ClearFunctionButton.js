import React from "react";

function ClearFunctionButton(props) {

  return (
    <div style={{marginTop: '10%', marginLeft: '5%'}}>
        <button class="pushable clear-button-width" onClick={props.clearFunction}  >
          <div class="shadow shadow-height-clear-function-button"></div>
          <div class="edge edge-height-clear-button"></div>
          <div class="front front-color-white front-padding-clear-function-button">
            <h1 className="clear-function-button-text">Clear</h1>      
          </div>
        </button> 
    </div>
  );
}
export default ClearFunctionButton;