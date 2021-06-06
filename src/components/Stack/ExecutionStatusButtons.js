import React from "react";
import MaliciousExecutionStatus from "./MaliciousExecutionStatus"
import InstructCircle from "../InstructCircle"


function ExecutionStatusButtons(props) {
 

  return(
    <div>
      {!props.running && (
        <div>
          <div style={{marginLeft: '30%', display: 'flex'}}>
            <InstructCircle marginLeft={"32%"} number={"5"}/>
            <button style={{marginLeft: '5%'}} class="pushable" onClick={props.startProgram}>
              <div class="shadow shadow-height-execution-button"></div>
              <div class="edge edge-color-green edge-height-execution-button"></div>
              <div class="front front-color-green front-padding-execution-button front-padding-execution-button-text-size">
                Start
              </div>
            </button>
          </div>
          <MaliciousExecutionStatus maliciousExecution={props.maliciousExecution} malFuncNameArr={props.malFuncNameArr}/>                  
        </div>
      )}
      {props.running && !props.displayFinishButton && (
        <div>
          <div style={{marginLeft: '30%', display: 'flex'}}>

            <InstructCircle marginLeft={"32%"} number={"6"}/>
            <button style={{marginLeft: '5%'}} class="pushable" onClick={props.programNext}>
              <div class="shadow shadow-height-execution-button"></div>
              <div class="edge edge-color-blue edge-height-execution-button"></div>
              <div class="front front-color-blue front-padding-execution-button front-padding-execution-button-text-size">
                Next
              </div>
            </button>
          </div>
          <MaliciousExecutionStatus maliciousExecution={props.maliciousExecution} malFuncNameArr={props.malFuncNameArr}/>                  
        </div>
      )}
      {props.displayFinishButton && (
        <div>
          <div style={{display: 'flex', marginLeft: '30%'}}>
            <InstructCircle marginLeft={"32%"} number={"7"}/>
            <button style={{marginLeft: '5%'}} class="pushable" onClick={props.programFinish}>
              <div class="shadow shadow-height-execution-button"></div>
              <div class="edge edge-color-orange edge-height-execution-button"></div>
              <div class="front front-color-orange front-padding-execution-button front-padding-execution-button-text-size">
                Finish
              </div>
            </button>
          </div>
          <MaliciousExecutionStatus maliciousExecution={props.maliciousExecution} malFuncNameArr={props.malFuncNameArr}/>                  
        </div>
      )}
    </div>
  )
}
export default ExecutionStatusButtons;