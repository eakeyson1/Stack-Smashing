import React from "react";
import "../css/functions.css";

function ReturnProgram(props) {

    const returnMainFunctionCalls = () => {
        return(
          props.stackFrameDataArray.map((stackFrame) => 
            <div>
              <h1 className="program-code-text-style-functions">{stackFrame.functionName}({stackFrame.unmodifiedParams});</h1>
            </div>
          )
        )
      }

    const returnFunctions = () => {
        return(
        props.stackFrameDataArray.map((stackFrame) =>
          <div className="program-functions">
            <div className="functions-flex">
              <h1 className="program-code-text-style-functions">void {stackFrame.functionName} </h1>
              <div className="functions-flex">
                <h1 className="program-code-text-style-functions">({stackFrame.localFuncParams}){"{"}</h1>
              </div>
            </div>
            <div style={{marginLeft: '1%'}}>
              {returnProgramFunctionsLocalVariables(stackFrame)}
              {returnUnsafeFunctionsMain(stackFrame)}
              {returnProgramFunctionsAdditionalFuncCalls(stackFrame)}
            </div>
            <h1 className="program-code-text-style-functions">{"}"}</h1>
          </div>
          )
        )
      }
    const returnProgramFunctionsLocalVariables = (stackFrame) => {

        var localVariables = []
        stackFrame.mainLocalVariables.map((variable) =>{
          if(variable.type === "char[]"){
            localVariables.push(
              <h1 className="program-code-text-style-functions">char {variable.name}[] = "{variable.value}"; </h1>
            )
          }
          else if(variable.type === "int" || variable.type === "float"){
            localVariables.push(
              <h1 className="program-code-text-style-functions">{variable.type} {variable.name} = {variable.value}; </h1>
            )
          }
          else{
            localVariables.push(
              <h1 className="program-code-text-style-functions">{variable.type} {variable.name} = "{variable.value}"; </h1>
            )
          }
        })
    
        return localVariables
    }

    const returnUnsafeFunctionsMain = (stackFrame) => {
        return(
          stackFrame.unsafeFunctions.map((func) =>
            <div>
              <h1 className="program-code-text-style-functions"> strcpy({func.param1Name}, {func.param2Name});</h1>
            </div>
          )
        )
      }
    
    const returnProgramFunctionsAdditionalFuncCalls = (stackFrame) => {
        return(
          stackFrame.additionalFunctionCalls.map((func) =>
            <div>
              <h1 className="program-code-text-style-functions"> {func}</h1>
            </div>
          )
        )
      }

  return (
    <div>
        <div className="program-code-container">
          <div className="program-name-intro-container">
            <div style={{display: 'flex'}}>
              {props.hoverAddToProgram && (
                <div style={{display: 'flex'}}>
                  <div className="end-of-pointer-green"></div>
                  <div style={{marginTop: '4%', marginRight: '6%'}}>
                    <div className="pointer-arrow-top-green"></div>
                    <div className="pointer-arrow-bottom-green"></div>
                  </div>
                </div>
              )}
              {!props.hoverAddToProgram && (
                <div style={{display: 'flex'}}>
                  <div className="end-of-pointer"></div>
                  <div style={{marginTop: '4%', marginRight: '6%'}}>
                    <div className="pointer-arrow-top"></div>
                    <div className="pointer-arrow-bottom"></div>
                  </div>
                </div>
              )}
              <h1 className="program-name-text-intro-style">intro.c</h1>
            </div>
          </div>
          <div className="code-lines-spacer">
            <h1 className="program-code-text-style-functions">{"#include <stdio.h>"}</h1>
            <h1 className="program-code-text-style-functions">{"#include <string.h>"}</h1>
            <h1 className="program-code-text-style-functions">int main( int argc, char* argv[])</h1>
            <div className="margin-left-7">
              {returnMainFunctionCalls()}
            </div>
            <h1 className="program-code-text-style-functions">{"}"}</h1>
          </div>
          {returnFunctions()}
        </div>
      </div>
  );
}
export default ReturnProgram;