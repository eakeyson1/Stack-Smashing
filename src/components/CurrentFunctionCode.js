import React from "react";
import "../css/functions.css";
import CurrentFuncParameters from "./CurrentFuncParameters"
import CurrentFuncLocalVariables from "./CurrentFuncLocalVariables"
import CurrentFuncUnsafeFunctions from "./CurrentFuncUnsafeFunctions"
import CurrentFuncAdditionalFunctionCalls from "./CurrentFuncAdditionalFunctionCalls"

function CurrentFunctionCode(props) {

    return(
        <div className="code-input">
            <div className="code-input-shift">
                <div className="functions-flex">
                <h1 className="code-input-style">void {props.functionName}</h1>
                <div className="functions-flex">
                    <CurrentFuncParameters parameters={props.parameters}/>
                </div>
                </div>
                <div style={{marginLeft: '1%'}}>
                <CurrentFuncLocalVariables localVariables={props.localVariables}/>
                <CurrentFuncUnsafeFunctions unsafeFunctions={props.unsafeFunctions}/>
                <CurrentFuncAdditionalFunctionCalls additionalFunctionCalls={props.additionalFunctionCalls}/>
                </div>
                <h1 className="code-input-style">{"}"}</h1>
            </div>
        </div>
    );
}
export default CurrentFunctionCode;