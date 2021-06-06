import React from "react";

function FunctionHighlightNameParameters(props) {

  return(
    <div className="program-functions">
      <div className="functions-flex">
        <h1 className="program-code-hightlight-text-style">void {props.stackFrameDataArr[props.i].functionName} </h1>
        <div className="functions-flex">
          <h1 className="program-code-hightlight-text-style">({props.stackFrameDataArr[props.i].localFuncParams}){"{"}</h1>
        </div>
      </div>
      <div style={{marginLeft: '1%'}}>
        {props.returnProgramFunctionsLocalVariables(props.stackFrameDataArr[props.i])}
        {props.returnUnsafeFunctions(props.stackFrameDataArr[props.i])}
        {props.returnProgramFunctionsAdditionalFuncCalls(props.stackFrameDataArr[props.i])}
      </div>
      <h1 className="program-code-text-style">{"}"}</h1>
    </div>
  )
}
export default FunctionHighlightNameParameters;