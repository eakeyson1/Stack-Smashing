import React from "react";
import "../css/functions.css";
import UnsafeCFunctionsButton from "./UnsafeCFunctionsButton"
import PassArgvOneButton from "./PassArgvOneButton"
import RemoveArgvOneButton from "./RemoveArgvOneButton"
import AdditionalFuncCallButton from "./AdditionalFuncCallButton"
import ClearFunctionButton from "./ClearFunctionButton"

function CurrentFunctionButtons(props) {

    return(
        <div>
            <div style={{marginLeft: '3%'}}>
            <UnsafeCFunctionsButton displayAddUnsafeFunction={props.displayAddUnsafeFunction}/>
            {!props.userInputBool && (
                <div className="functions-input-container">
                <PassArgvOneButton addUserInput={props.addUserInput}/>
                </div>
            )}
            {props.userInputBool && (
                <div className="functions-input-container">
                <RemoveArgvOneButton removeUserInput={props.removeUserInput}/>
                </div>
            )}
            <div className="functions-input-container">
                <AdditionalFuncCallButton displayAdditionalFunctionCallOptions={props.displayAdditionalFunctionCallOptions}/>
            </div>
                <ClearFunctionButton clearFunction={props.clearFunction}/>
            </div>
            <h1 className="error-input-text-style">{props.addFunctionError}</h1>
        </div>
    );
}
export default CurrentFunctionButtons;