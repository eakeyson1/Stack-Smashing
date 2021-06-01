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
                  <div style={{marginLeft: '5%'}}> 
                    <button class="pushable" onClick={() => props.addFunctionCall()}>
                      <div class="shadow shadow-height-stack-button"></div>
                      <div class="edge edge-color-lighter-blue edge-height-stack-button"></div>
                      <div class="front front-color-white  front-padding-add-additional-func-button front-padding-execution-button-text-size">
                        <h1 className="add-unsafe-func-button-text">Add</h1>     
                      </div>
                    </button>
                  </div>
                </div>
              )
        )

    }

    return(
        additionalFunctionsDisplay()
    );
}
export default AdditionalFunctionCallsDisplay;