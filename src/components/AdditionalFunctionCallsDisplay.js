import React from "react";
import "../css/functions.css";
import Dropdown from 'react-dropdown';

function AdditionalFunctionCallsDisplay(props) {



    const additionalFunctionsDisplay = () => {
        const strcpyDefault = "Select..."
        var functionNames = []
        props.stackFrameDataArray.map((frame) =>
            functionNames.push(frame.functionName)
        )

        return(
            props.displayAdditionalFunctionCalls && (
                <div className="additional-func-call-container">
                  <div className="additional-functions-dropdown">
                    <Dropdown options={functionNames} onChange={(type) => props.changeAdditionalFunctionCallName(type)} value={strcpyDefault} />
                    <h1 className="strcpy-param-title-style">Function Name</h1>
                  </div> 
                  <div className="additional-func-param-container">
                    {/*this.returnAdditionalFunctionCallParams()*/}
                  </div>
                  <button className="add-additional-func-call-button" onClick={() => props.addFunctionCall()}>
                    <h1 className="add-additional-func-call-button-text">Add Function Call</h1>
                  </button>
                </div>
              )
        )

    }

    return(
        additionalFunctionsDisplay()
    );
}
export default AdditionalFunctionCallsDisplay;