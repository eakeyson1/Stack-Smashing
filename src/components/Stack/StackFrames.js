import React from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";


function StackFrames(props) {
  
  const openStackFrame = (functionName) => {

    var tempRunningFuncs = props.stackFrameRunningFunctions
    for(var i=0; i<tempRunningFuncs.length; i++){
      if(tempRunningFuncs[i].functionName === functionName){
        tempRunningFuncs[i].displayStackFrame = true
        props.updateStackFrameRunningFunctions(tempRunningFuncs)
        break
      }
    }
  }

  const closeStackFrame = (functionName) => {

    var tempRunningFuncs = props.stackFrameRunningFunctions
    for(var i=0; i<tempRunningFuncs.length; i++){
      if(tempRunningFuncs[i].functionName === functionName){
        tempRunningFuncs[i].displayStackFrame = false
        props.updateStackFrameRunningFunctions(tempRunningFuncs)
        break
      }
    }
  }

  const displayStackFrames = () => {
    var stackFramesStartAddress = props.endParametersAddress - 7
    var runningFunctions = []
    for(var i=0; i<props.stackFrameRunningFunctions.length; i++){
      runningFunctions.push(JSON.parse(JSON.stringify(props.stackFrameRunningFunctions[i])))
    }

    return(

      runningFunctions.map((stackFrame) =>
      //var startAddress = stackFrame.startAddress
        <div>
          {!stackFrame.strcpy && (
            <div>
              {stackFrame.displayStackFrame && (
                <div>
                  <button className="stack-frame-open-button" onClick={() => closeStackFrame(stackFrame.functionName)}>
                    <div style={{display: 'flex'}}>
                      <div style={{marginLeft: "35%", width: '30%'}}>
                        <h1 className="stack-frame-button-text">{stackFrame.functionName}()</h1>
                      </div>
                      <div style={{marginLeft: "24%"}}>
                        <RiArrowDropDownLine size={45} color={"white"}/>
                      </div>
                    </div>
                  </button>
  
                <div>
  
                  <div style={{display: 'flex'}}>
                    <div className="stack-frame-param-title-container">
                      <div><h1 className="main-stack-element-title-text">Parameters</h1></div>
                    </div> 
                    <div>
                    {stackFrame.parametersLetterArray.length !== 0 && (
                      stackFrame.parametersLetterArray.map((param) =>
                        <div className="stack-frame-param-container">
                          <div className="main-stack-second-container">
                            <div className="main-stack-value-container">
                              <h1 className="main-stack-param-text">{param}</h1>
                            </div>
                            <div className="center">
                              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                            </div>
                          </div>
                        </div>                
                      )
                    )}
                    </div> 
  
                    {stackFrame.parametersLetterArray.length === 0 && (
                      <div className="stack-frame-param-container center-div">
                        <h1 className="main-stack-param-text">Empty</h1>
                      </div>                
                    )}
                  </div> 
  
                  <div style={{display: 'flex'}}>
                    <div className="return-address-title-container">
                      <h1 className="main-stack-element-title-text">Return Address</h1>
                    </div> 
                    <div> 
                      {stackFrame.returnAddressArr.map((ra) =>
                        <div className="return-address-container">
                          <div className="main-stack-second-container">
                            <div className="main-stack-value-container">
                              <h1 className="main-stack-param-text">{ra}</h1>
                            </div>
                            <div className="center">
                            <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                            </div>
                          </div>
                        </div>                
                      )}
                    </div> 
                  </div> 
  
                  <div style={{display: 'flex'}}>
                    <div className="saved-frame-pointer-title-container">
                      <h1 className="main-stack-element-title-text">Saved Frame Pointer</h1>
                    </div> 
                    <div>
                      {stackFrame.sfpArr.map((sfp) =>
                        <div className="saved-frame-pointer-container">
                          <div className="main-stack-second-container">
                            <div className="main-stack-value-container">
                              <h1 className="main-stack-param-text">{sfp}</h1>
                            </div>
                            <div className="center">
                            <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                            </div>
                          </div>
                        </div>                
                      )}
                    </div>
                  </div>                 
  
                  <div style={{display: 'flex'}}>
                    <div className="stack-frame-variable-title-container">
                      <h1 className="main-stack-element-title-text">Local Variables</h1>
                    </div> 
                    <div>
                      {stackFrame.localVariablesLetterArray.length !== 0 && (
                        stackFrame.localVariablesLetterArray.map((variable) =>
                        <div className="stack-frame-variable-container">
                          <div className="main-stack-second-container">
                            <div className="main-stack-value-container">
                              <h1 className="main-stack-param-text">{variable}</h1>
                            </div>
                            <div className="center">
                              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                            </div>
                          </div>
                        </div>                
                        )
                      )}
                    </div> 
                      {stackFrame.localVariablesLetterArray.length === 0 && (
                        <div className="stack-frame-variable-container center-div">
                          <h1 className="main-stack-param-text">Empty</h1>
                        </div>                
                      )}
                  </div>
                </div>
              </div>
            )}
            {!stackFrame.displayStackFrame && ( 
              <button className="stack-frame-open-button" onClick={() => openStackFrame(stackFrame.functionName)}>
                <div style={{display: 'none'}}>{((stackFramesStartAddress -= (stackFrame.parametersLetterArray.length + 8 + stackFrame.localVariablesLetterArray.length)).toString(16)).toUpperCase()}</div>
                <div style={{display: 'flex'}}>
                  <div style={{marginLeft: "35%", width: '30%'}}>
                    <h1 className="stack-frame-button-text">{stackFrame.functionName}()</h1>
                  </div>
                  <div style={{marginLeft: "24%"}}>
                    <RiArrowDropRightLine size={45} color={"white"}/>
                  </div>
                </div>
            </button>
            )}
          </div>
        )}
        {stackFrame.strcpy && (
          <div>
            <button className="stack-frame-open-button-strcpy" onClick={() => closeStackFrame(stackFrame.functionName)}>
                <div className="center-div">
                  <h1 className="stack-frame-button-text-strcpy">{stackFrame.functionName}()</h1>
                </div>
            </button>
          </div>
        )}
      </div>
      )
    )
        
  }

  return(
    displayStackFrames()
  )
}
export default StackFrames;