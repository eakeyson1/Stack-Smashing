import React from "react";
import { RiStackFill } from "react-icons/ri"
import InstructCircle from "./InstructCircle"


function GoToStackButton(props) {

  return (
    <button class="pushable" onClick={() => props.goToStack()}>
        <div class="shadow shadow-height-stack-button"></div>
        <div class="edge edge-color-lighter-blue edge-height-stack-button"></div>
        <div class="front front-color-white  front-padding-stack-button front-padding-execution-button-text-size">
        <div style={{display: 'flex'}}>
            <div>
            <InstructCircle number={"3"}/>
            </div>
            <RiStackFill style={{marginLeft: "2%"}} color={"#1a75ff"} size={33}/>
        </div>     
        </div>
    </button>
  );
}
export default GoToStackButton;