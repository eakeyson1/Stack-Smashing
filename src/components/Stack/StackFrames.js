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


    var sfpLength = 0
    for(var i=0; i<runningFunctions.length; i++){

      var parameterLen = runningFunctions[i].parametersLetterArray.length
      var raAndSFPLen = 8
      var variableLen = runningFunctions[i].localVariablesLetterArray.length

      var totalLen = parameterLen + raAndSFPLen + variableLen
      sfpLength += totalLen

      /***** Setting return address value *****/
      if(i === 1){
        var raHexAddress = (stackFramesStartAddress-1).toString(16)
        var raHexAddressArr = raHexAddress.match(/.{1,2}/g)
        for(var j=0; j<raHexAddressArr.length; j++){
          raHexAddressArr[j] = "\\x" + raHexAddressArr[j].toUpperCase() 
        }
        runningFunctions[i].returnAddressArr = raHexAddressArr
      }

      if(i === 2){
        var raHexAddressOne = (stackFramesStartAddress - 1).toString(16)
        var raHexAddressArrOne = raHexAddressOne.match(/.{1,2}/g)
        for(var j=0; j<raHexAddressArrOne.length; j++){
          raHexAddressArrOne[j] = "\\x" + raHexAddressArrOne[j].toUpperCase() 
        }
        runningFunctions[1].returnAddressArr = raHexAddressArrOne

        var frameOneLen = runningFunctions[0].parametersLetterArray.length + 8 + runningFunctions[0].localVariablesLetterArray.length
        var raHexAddressTwo = (stackFramesStartAddress - frameOneLen - 1).toString(16)
        var raHexAddressArrTwo = raHexAddressTwo.match(/.{1,2}/g)
        for(var j=0; j<raHexAddressArrTwo.length; j++){
          raHexAddressArrTwo[j] = "\\x" + raHexAddressArrTwo[j].toUpperCase() 
        }
        runningFunctions[2].returnAddressArr = raHexAddressArrTwo
      }

      /***** Setting SFP value *****/

      var sfpHexAddress = (stackFramesStartAddress - sfpLength).toString(16)
      var sfpHexAddressArr = sfpHexAddress.match(/.{1,2}/g)
      for(var j=0; j<sfpHexAddressArr.length; j++){
        sfpHexAddressArr[j] = "\\x" + sfpHexAddressArr[j].toUpperCase() 
      }

      runningFunctions[i].sfpArr = sfpHexAddressArr
    }
    return(

      runningFunctions.map((stackFrame) =>
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