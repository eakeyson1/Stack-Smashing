import React, { useState } from "react";
import "../css/functions.css";
import Dropdown from 'react-dropdown';


function UnsafeFunctionsDisplay(props) {

    const [functionType, setFunctionType] = useState("");
    const [showControls, setShowControls] = useState(false);
    const [stackFrameDataArr, setStackFrameDataArr] = useState([]);

    const functionOptions = ["strcpy"]
    const functionDefault = functionOptions[0]

    const returnUnsafeFunction = () => {
        var strcpyParams1 = []
        var strcpyParams2 = []
        props.parameters.map((parameter) => {
          if(parameter.type === "char[]"){
            strcpyParams2.push(parameter.name)
          } 
        })
        props.localVariables.map((variable) => {
          if(variable.type === "char[]"){
            strcpyParams2.push(variable.name)
            strcpyParams1.push(variable.name)
          }
        })
        var strcpyDefault = "Select..."

        return(
            props.addUnsafeFunctionBool && (
                <div className="unsafe-functions-container">
                <div className="strcpy-param-dropdown-name-container">
                  <Dropdown options={functionOptions} onChange={(type) => props.changeFunctionType(type)} value={functionDefault} />
                  <h1 className="strcpy-param-title-style">Name</h1>
                </div>
                <div>
                  <div className="strcpy-param-dropdown-container">
                    <Dropdown options={strcpyParams1} onChange={(type) => props.changeStrcpyParam1(type)} value={strcpyDefault} />
                  </div> 
                  <h1 className="strcpy-param-title-style">Destination</h1>
                </div>
                <div style={{marginLeft: 30}}> 
                  <div className="strcpy-param-dropdown-container">
                    <Dropdown options={strcpyParams2} onChange={(type) => props.changeStrcpyParam2(type)} value={strcpyDefault} />
                  </div> 
                  <h1 className="strcpy-param-title-style">Source</h1>
                </div>
                <div style={{marginLeft: '5%'}}> 
                  <button class="pushable" onClick={props.addUnsafeFunctionToProgram}>
                    <div class="shadow shadow-height-stack-button"></div>
                    <div class="edge edge-color-lighter-blue edge-height-stack-button"></div>
                    <div class="front front-color-white  front-padding-add-additional-func-button front-padding-execution-button-text-size">
                      <h1 className="add-unsafe-func-button-text">Add</h1>     
                    </div>
                  </button>
                </div>
                <h1 className="error-input-text-style">{props.strcpyParamError}</h1>
              </div>   
                
            )
        )
    }



    return(
       returnUnsafeFunction()
    );
}
export default UnsafeFunctionsDisplay;