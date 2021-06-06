import React from "react";
import MainFunctionTitle from "./MainFunctionTitle"
import Functions from "./Functions"
import MainFunctionCalls from "./MainFunctionCalls"
function Program(props) {
 

  return(
    <div>
      <div className="program-code-container-stack">
        <h1 className="seg-fault">{props.malExeMessage}</h1>

        <div className="program-name-container">
          <h1 className="program-name-text-style">intro.c</h1>
        </div>
        <div className="code-lines-spacer">
          <h1 className="program-code-text-style">{"#include <stdio.h>"}</h1>
          <h1 className="program-code-text-style">{"#include <string.h>"}</h1>
          <MainFunctionTitle
            stepProgramClickNumber={props.stepProgramClickNumber}
            stackFrameDataArr={props.stackFrameDataArr}
            running={props.running}
            stackFrameRunningFunctions={props.stackFrameRunningFunctions}
          />
          <div style={{marginLeft: '1%'}}>
            <MainFunctionCalls
              stackFrameRunningFunctions={props.stackFrameRunningFunctions}
              stepProgramClickNumber={props.stepProgramClickNumber}
              stackFrameDataArr={props.stackFrameDataArr}
            />
          </div>
          <h1 className="program-code-text-style">{"}"}</h1>
        </div>
        <Functions
          stackFrameRunningFunctions={props.stackFrameRunningFunctions}
          stackFrameDataArr={props.stackFrameDataArr}
          stepProgramClickNumber={props.stepProgramClickNumber}
        />
      </div>
      <div style={{height: "1%"}}>&nbsp;</div>
    </div>
  )
}
export default Program;