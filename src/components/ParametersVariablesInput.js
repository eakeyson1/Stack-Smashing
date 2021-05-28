import React from "react";
import "../css/functions.css";
import InstructCircle from "./InstructCircle"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Dropdown from 'react-dropdown';


function ParametersVariablesInput(props) {

    const returnParametersVariablesInput = () => {

        const parameterOptions = ["char", "int", "float", "char[]"]
        const localVariableOptions = ["char", "int", "float", "char[]"]
    
        return(
          <div className="add-to-program-spacer">
            <div style={{display: 'flex', marginLeft: "40%"}}>
              <div>
                <div className="code-input-title-container">
                  <h1 style={{marginLeft: '7%'}} className="code-input-title-text">Function Name</h1>
                </div>
                <div>
                  <input
                    value={props.functionName}
                    type="text"
                    id="inputID"
                    placeholder={"e.g. foo"}
                    onChange={props.updateFunctionName}
                    className="function-name-input-style"
                  />
                </div>
              </div>
              <div className="add-to-intro-button-container">
                  <button class="pushable add-to-intro-width" onClick={props.addFunctionToProgram} onMouseLeave={() => props.hoverFalse} onMouseEnter={() => props.hoverTrue}>
                    <div class="shadow shadow-height-add-to-intro-button"></div>
                    <div class="edge edge-color-green edge-height-add-to-intro-button"></div>
                    <div class="front front-color-darker-green front-padding-add-to-intro-button front-padding-add-to-intro-button-text-size">
                    <div style={{display: 'flex'}}>
                      <div>
                        <InstructCircle number={"2"}/>
                      </div>
                      <h1 className="add-to-intro-button-text">Add to intro.c</h1>
                    </div>
                    </div>
                  </button> 
              </div>
            </div>
    
            <div style={{marginTop: '3%'}} className="param-lv-input-container">
              <div className="code-input-title-container">
                <h1 style={{marginTop: '6%'}} className="code-input-title-text">Parameter</h1>
              </div>
              <div>
                <input
                  value={props.parameterName}
                  type="text"
                  id="inputID"
                  placeholder={"Name"}
                  onChange={props.updateParameterName}
                  className="param-lv-input-style"
                />
                <div className="height-10">
                  {props.parameterNameError && (
                    <h1 className="error-input-text-style">Enter a parameter name</h1>
                  )}
                </div>
              </div>
    
              <div className="dropdown-params-lv">
                <Dropdown className='dropdown' options={parameterOptions} onChange={(type) => props.changeParameterType(type)} value={props.parameterType} />
              </div>
    
              <div>
                <input
                  value={props.parameterValue}
                  type="text"
                  id="inputID"
                  placeholder={"Value"}
                  onChange={props.updateParameterValue}
                  className="param-lv-input-style"
                />
              </div>
              <div style={{marginLeft: '5%'}}> 
                <button class="pushable" onClick={props.addParameter}>
                  <div class="shadow shadow-height-add-param-lv-button"></div>
                  <div class="edge edge-color-lighter-blue edge-add-param-lv-button"></div>
                  <div class="front front-color-white  front-padding-add-param-lv-button front-padding-execution-button-text-size">
                    <h1 className="add-param-lv-button-text"> Add</h1>    
                  </div>
                </button>
              </div>
            </div>
    
            <div style={{marginTop: '2.5%'}} className="param-lv-input-container">
              <div className="code-input-title-container">
                <h1 style={{marginTop: '6%'}} className="code-input-title-text">Local Variable</h1>
              </div>
              <div>
                <input
                  value={props.localVariableName}
                  type="text"
                  id="inputID"
                  placeholder={"Name"}
                  onChange={props.updateLocalVariableName}
                  className="param-lv-input-style"
                />
                <div className="height-10">
                  {props.localVariableNameError && (
                    <h1 className="error-input-text-style">Enter a variable name</h1>
                  )}
                </div>
              </div>
    
              <div className="dropdown-params-lv">
                <Dropdown options={localVariableOptions} onChange={(type) => props.changeLocalVariableType(type)} value={props.localVariableType} />
              </div>
    
              <div>
                <input
                  value={props.localVariableValue}
                  type="text"
                  id="inputID"
                  placeholder={"Value"}
                  onChange={props.updateLocalVariableValue}
                  className="param-lv-input-style"
                />
              </div>
              <div style={{marginLeft: '5%'}}> 
                <button class="pushable" onClick={props.addLocalVariable}>
                  <div class="shadow shadow-height-add-param-lv-button"></div>
                  <div class="edge edge-color-lighter-blue edge-add-param-lv-button"></div>
                  <div class="front front-color-white  front-padding-add-param-lv-button front-padding-execution-button-text-size">
                    <h1 className="add-param-lv-button-text"> Add</h1>    
                  </div>
                </button>
              </div>
    
            </div>
            <h1 className="error-input-text-style">{props.functionNameError}</h1>
            <h1 className="error-input-text-style">{props.localVariableError}</h1>
            <div className="border-bottom-param-lv"></div>
          </div>
        )
      }

  return (
    returnParametersVariablesInput()
  );
}
export default ParametersVariablesInput;