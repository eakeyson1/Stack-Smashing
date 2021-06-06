import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

function BackButton(props) {
 

  return(
    <button style={{marginTop: '3%'}} class="pushable" onClick={props.goBack}>
      <div class="shadow shadow-height-back-button"></div>
      <div class="edge edge-color-lighter-blue edge-height-back-button"></div>
      <div class="front front-color-white front-padding-back-button">
        <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
      </div>
    </button>
  )
}
export default BackButton;