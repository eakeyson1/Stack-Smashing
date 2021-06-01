import React from "react";
import "../css/functions.css";
import CurrentFunctionCode from "./CurrentFunctionCode"
import CurrentFunctionButtons from "./CurrentFunctionButtons"
import AdditionalFunctionCallsDisplay from "./AdditionalFunctionCallsDisplay"
import UnsafeFunctionsDisplay  from "./UnsafeFunctionsDisplay"


function CurrentFunction(props) {

    return(
        <div>
          <div className="functions-flex">
            <CurrentFunctionCode 
              functionName={props.functionName} 
              parameters={props.parameters}
              localVariables={props.localVariables}
              unsafeFunctions={props.unsafeFunctions}
              additionalFunctionCalls={props.additionalFunctionCalls}
            />
            <CurrentFunctionButtons 
              displayAddUnsafeFunction={props.displayAddUnsafeFunction}
              addUserInput={props.addUserInput}
              removeUserInput={props.removeUserInput}
              displayAdditionalFunctionCallOptions={props.displayAdditionalFunctionCallOptions}
              addFunctionError={props.addFunctionError}
              userInputBool={props.userInputBool}
              clearFunction={props.clearFunction}
            />
          </div>
          
          <AdditionalFunctionCallsDisplay
            changeAdditionalFunctionCallName={(name) => props.changeAdditionalFunctionCallName(name)}
            addFunctionCall={props.addFunctionCall}
            stackFrameDataArray={props.stackFrameDataArray}
            displayAdditionalFunctionCalls={props.displayAdditionalFunctionCalls}
          />
  
          <UnsafeFunctionsDisplay 
            addUnsafeFunctionBool={props.addUnsafeFunctionBool} 
            changeFunctionType={(type) => props.changeFunctionType(type)}
            changeStrcpyParam1={(param1) => props.changeStrcpyParam1(param1)}
            changeStrcpyParam2={(param2) => props.changeStrcpyParam2(param2)}
            parameters={props.parameters}
            localVariables={props.localVariables}
            addUnsafeFunctionToProgram={props.addUnsafeFunctionToProgram}
            strcpyParamError={props.strcpyParamError}
          />
        </div>
      )
}
export default CurrentFunction;