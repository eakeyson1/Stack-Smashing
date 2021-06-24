import React from "react";
import FunctionHighlightNameArgv from "./FunctionHighlightNameArgv"
import FunctionUserInputHighlightName from "./FunctionUserInputHighlightName"
import FunctionUserInputNoHighlight from "./FunctionUserInputNoHighlight"
import FunctionHighlightNameParameters from "./FunctionHighlightNameParameters"
import FunctionNoHighlight from "./FunctionNoHighlight"

function Functions(props) {

  const returnProgramFunctionsLocalVariables = (stackFrame) => {

    var localVariables = []
    stackFrame.mainLocalVariables.map((variable) =>{
      if(variable.type === "char[]"){
        localVariables.push(
          <h1 className="program-code-text-style">char {variable.name}[] = "{variable.value}"; </h1>
        )
      }
      else if(variable.type === "int"){
        localVariables.push(
          <h1 className="program-code-text-style">{variable.type} {variable.name} = {variable.value}; </h1>
        )
      }
      else{
        localVariables.push(
          <h1 className="program-code-text-style">{variable.type} {variable.name} = "{variable.value}"; </h1>
        )
      }
    })

    return localVariables
  }

  const returnUnsafeFunctions = (stackFrame) => {

    var functionCalls = []
    var functionName = ""
    if(props.stackFrameRunningFunctions.length !== 0){
      if(props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-1].functionName === "strcpy"){
        functionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-2].functionName
      }
    }

    var functionCall = null
    if(stackFrame.functionName === functionName){
      if(stackFrame.unsafeFunctions[0].param2Name === "userInput"){
        functionCall = (
          <div style={{display: 'flex'}}>
            <h1 className="program-code-hightlight-text-style">strcpy({stackFrame.unsafeFunctions[0].param1Name}{", "}</h1>
            <h1 className="program-code-hightlight-argv-text-style">{stackFrame.unsafeFunctions[0].param2Name}</h1>
            <h1 className="program-code-hightlight-text-style">);</h1>

          </div>
        )
        functionCalls.push(functionCall)
      }
      else{
        functionCall = (
          <h1 className="program-code-hightlight-text-style">strcpy({stackFrame.unsafeFunctions[0].param1Name}, {stackFrame.unsafeFunctions[0].param2Name});</h1>
        )
        functionCalls.push(functionCall)
      }
    }
    else{
      if(stackFrame.unsafeFunctions.length !==0){
        functionCall = (
          <h1 className="program-code-text-style">strcpy({stackFrame.unsafeFunctions[0].param1Name}, {stackFrame.unsafeFunctions[0].param2Name});</h1>
          )
        functionCalls.push(functionCall)
      }
    }

    return functionCalls
  }

  const returnProgramFunctionsAdditionalFuncCalls = (stackFrame) => {


    var functionName = ""
    var parentFunctionName = ""
    if(props.stackFrameRunningFunctions.length > 1){
      functionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-1].functionName
      parentFunctionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-2].functionName
    }


    var containsUnsafeFunctions = false
    for(var i=0; i<props.stackFrameDataArr.length; i++){
      if(props.stackFrameDataArr[i].unsafeFunctions.length !== 0){
        containsUnsafeFunctions = true
      }
    }
    
    if(props.stackFrameRunningFunctions.length === 3 & !containsUnsafeFunctions){
      parentFunctionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-2].functionName
      functionName = props.stackFrameDataArr[0].functionName
    }

    var additionalFunctionCalls = []
    
    for(var i=0; i<stackFrame.additionalFunctionCalls.length; i++){
      var addFunctionName = stackFrame.additionalFunctionCalls[i].split('(')[0]
      var additionalFunctionCall = null
      if(functionName === addFunctionName && stackFrame.functionName === parentFunctionName){
        if(stackFrame.additionalFunctionCalls[i].includes("userInput")){

          var parameters = ""
          stackFrame.parameterDetails.map((param) => {  
            if(!param.name === "userInput"){
              if(param.type === "char"){
                parameters += '"' + param.value + '", '
              }
              else{
                parameters += param.value + ", "
              }
            }
            
          })

          var functionName = stackFrame.additionalFunctionCalls[i].substr(0, stackFrame.additionalFunctionCalls[i].indexOf('(')); 
          var functionCall = functionName + "(" + parameters

          if(props.stepProgramClickNumber === 6){

            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
                
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
            else{
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 8){

            /***** Highlighting name and argv *****/

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ){
                additionalFunctionCall = (
                  <div style={{display: 'flex'}}>
                    <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                    <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                    <h1 className="program-code-hightlight-text-style">);</h1>
                  </div>
                )
                additionalFunctionCalls.push(additionalFunctionCall)
              }

            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 2 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              ){

              var cleanFunctionName = stackFrame.additionalFunctionCalls[i].substr(0, stackFrame.additionalFunctionCalls[i].indexOf('(')); 
              var cleanFunctionCall = "(" + parameters
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {cleanFunctionName}</h1>
                  <h1 className="program-code-text-style">{cleanFunctionCall}userInput</h1>
                  <h1 className="program-code-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 10){
            /***** Highlighting name and argv *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 12){

            /***** No Highlighting *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <h1 className="program-code-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }

            /***** Highlighting name and argv *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 13){

            /***** Highlighting name and argv *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 14){

            /***** Highlighting name and argv *****/
            if(
             
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {functionCall}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">userInput</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
            /***** Highlighting name *****/
            else if (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              var cleanFunctionName = stackFrame.additionalFunctionCalls[i].substr(0, stackFrame.additionalFunctionCalls[i].indexOf('(')); 
              var cleanFunctionCall = "(" + parameters
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {cleanFunctionName}</h1>
                  <h1 className="program-code-text-style">{cleanFunctionCall}userInput</h1>
                  <h1 className="program-code-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          if(props.stepProgramClickNumber === 15){

            /***** Highlighting name *****/
            if (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){

              var cleanFunctionName = stackFrame.additionalFunctionCalls[i].substr(0, stackFrame.additionalFunctionCalls[i].indexOf('(')); 
              var cleanFunctionCall = "(" + parameters
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {cleanFunctionName}</h1>
                  <h1 className="program-code-text-style">{cleanFunctionCall}userInput</h1>
                  <h1 className="program-code-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
              }
          }
          if(props.stepProgramClickNumber === 16){

            /***** Highlighting name *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              var cleanFunctionName = stackFrame.additionalFunctionCalls[i].substr(0, stackFrame.additionalFunctionCalls[i].indexOf('(')); 
              var cleanFunctionCall = "(" + parameters
              additionalFunctionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {cleanFunctionName}</h1>
                  <h1 className="program-code-text-style">{cleanFunctionCall}userInput</h1>
                  <h1 className="program-code-text-style">);</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
        }
        else{

          if(props.stepProgramClickNumber === 8){

              /***** Highlighting function name *****/
              if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }

            /***** Highlighting function name and parameters *****/
            else if(
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              additionalFunctionCall = (
                <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else if(props.stepProgramClickNumber === 10){

             /***** Highlighting function name *****/
             if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
            /***** Highlighting function name and parameters *****/
            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              additionalFunctionCall = (
                <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else if(props.stepProgramClickNumber === 12){

            /***** No highlighting *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <h1 className="program-code-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }

            /***** Highlight name and parameters */
            else if (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              
              additionalFunctionCall = (
                <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
            /***** Highlight name *****/
            else if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else if(props.stepProgramClickNumber === 14){

            /***** Highlighting function name */
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else if(props.stepProgramClickNumber === 15){
            /***** Highlighting function name *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else if(props.stepProgramClickNumber === 16){
            /***** Highlighting function name *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              additionalFunctionCall = (
                <div style = {{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i].split('(')[0]}</h1>
                  <h1 className="program-code-text-style"> ({stackFrame.additionalFunctionCalls[i].split('(')[1].slice(0, -2)});</h1>
                </div>
              )
              additionalFunctionCalls.push(additionalFunctionCall)
            }
          }
          else{
            additionalFunctionCall = (
              <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
            )
            additionalFunctionCalls.push(additionalFunctionCall)
          }
        }
      }
      else{
        additionalFunctionCall = (
          <h1 className="program-code-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
        )
        additionalFunctionCalls.push(additionalFunctionCall)
      }
    }

    return additionalFunctionCalls
  }
 
  const returnFunctions = () => {

    var functions = []
    var lastFunctionName = ""
    if(props.stackFrameRunningFunctions.length !==0){
      lastFunctionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-1].functionName
    }
    for(var i=0; i<props.stackFrameDataArr.length; i++){

      if(props.stackFrameDataArr[i].functionName === lastFunctionName){

        var functionItem = null

        var userInputAsParam = false
        for(var j=0; j<props.stackFrameDataArr[i].parameterDetails.length; j++){
          if(props.stackFrameDataArr[i].parameterDetails[j].name === "userInput"){
            userInputAsParam = true
            break
          }
        }
        var tempLocalFuncParams = ""
        for(var j=0; j<props.stackFrameDataArr[i].parameterDetails.length; j++){
          if(props.stackFrameDataArr[i].parameterDetails[j].name !== "userInput"){
            if(props.stackFrameDataArr[i].parameterDetails[j].type === "char[]"){
              tempLocalFuncParams += "char " + props.stackFrameDataArr[i].parameterDetails[j].name + "[], "
            }
            else{
              tempLocalFuncParams += props.stackFrameDataArr[i].parameterDetails[j].type + " " + props.stackFrameDataArr[i].parameterDetails[j].name + ", "
            }            
          }
        }

        if(userInputAsParam === true){
          if(props.stepProgramClickNumber === 1){

            /***** Highlighting both function name and argv *****/
            functionItem = (
              <FunctionHighlightNameArgv
                stackFrameDataArr = {props.stackFrameDataArr}
                i = {i}
                tempLocalFuncParams={tempLocalFuncParams}
                returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
              />
            )
            functions.push(functionItem)
          }
          else if(props.stepProgramClickNumber === 3){

            /***** Highlighting name and argv *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 2 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ){

              functionItem = (
                <FunctionHighlightNameArgv
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)

            }
            else{

              /*****No highlighting *****/
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 5){

            /***** Highlighting function name */

            if(
              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||
              
              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
                
              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ){

              functionItem = (
                <FunctionUserInputHighlightName
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }

            /***** No hightlighting  *****/
            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              ){

              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }

            /***** Hightlighting name and argv *****/
            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ){
              functionItem = (
                <FunctionHighlightNameArgv
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }  
          else if(props.stepProgramClickNumber === 6){
            /***** No highlighting *****/

            if(

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 7){
            /***** Highlighting name and argv *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
                functionItem = (
                  <FunctionHighlightNameArgv
                    stackFrameDataArr = {props.stackFrameDataArr}
                    i = {i}
                    tempLocalFuncParams={tempLocalFuncParams}
                    returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                    returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                    returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  />
                )
                functions.push(functionItem)
              }

            /***** No highlighting *****/

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              ){ 
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 8){
            /***** No highlighting *****/

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||


              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 9){

            /***** Highlighting name and argv *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              functionItem = (
                <FunctionHighlightNameArgv
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
            /***** No highlighting *****/
            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 10){
            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 11){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
            /***** Highlighting name and argv *****/

            else if( 
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

                (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionHighlightNameArgv
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 12){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 13){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 14){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 15){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 16){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
          else if(props.stepProgramClickNumber === 17){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionUserInputNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  tempLocalFuncParams={tempLocalFuncParams}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                />
              )
              functions.push(functionItem)
            }
          }
        }
        else{
          if(props.stepProgramClickNumber === 1){

            /***** Highlighting function name and parameters *****/
            functionItem = (
              <FunctionHighlightNameParameters
                stackFrameDataArr = {props.stackFrameDataArr}
                i = {i}
                returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                tempLocalFuncParams={tempLocalFuncParams}
              />
            )
            functions.push(functionItem)
            
          }
          if(props.stepProgramClickNumber === 3){

            /***** No highlghting *****/

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 1 && props.stackFrameDataArr[0].unsafeFunctions.length !== 0)
              
              ||
              
              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }

            /***** Highlighting function name and parameters *****/
            else{
              functionItem = (
                <FunctionHighlightNameParameters
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 4){
            
            /***** No highlighting */

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){

              console.log("right spot")

              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 5){

            /***** No highlghting *****/

            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 2 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }


            /***** Highlighing function name and parameters */

            else if(

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionHighlightNameParameters
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 6){
            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              
                ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 7){

               
            /***** Highlighting name and parameters *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionHighlightNameParameters
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 8){

            /***** No highlighting *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 9){

            /***** Highlighting name and parameters*/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionHighlightNameParameters
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }

            /***** No highlighting */
            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 10){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 11){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }

            /***** Highlighting name and parameters *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              ){
              functionItem = (
                <FunctionHighlightNameParameters
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 12){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 13){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}

                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 14){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 15){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 16){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
          if(props.stepProgramClickNumber === 17){

            /***** No highlighting */
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <FunctionNoHighlight
                  stackFrameDataArr = {props.stackFrameDataArr}
                  i = {i}
                  returnProgramFunctionsLocalVariables={(val) => returnProgramFunctionsLocalVariables(val)}
                  returnUnsafeFunctions={(val) => returnUnsafeFunctions(val)}
                  returnProgramFunctionsAdditionalFuncCalls={(val) => returnProgramFunctionsAdditionalFuncCalls(val)}
                  tempLocalFuncParams={tempLocalFuncParams}
                />
              )
              functions.push(functionItem)
            }
          }
        }
      }
      else{
        functionItem = (
          <div className="program-functions">
            <div className="functions-flex">
              <h1 className="program-code-text-style">void {props.stackFrameDataArr[i].functionName} </h1>
              <div className="functions-flex">
                <h1 className="program-code-text-style">({props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
              </div>
            </div>
            <div style={{marginLeft: '1%'}}>
              {returnProgramFunctionsLocalVariables(props.stackFrameDataArr[i])}
              {returnUnsafeFunctions(props.stackFrameDataArr[i])}
              {returnProgramFunctionsAdditionalFuncCalls(props.stackFrameDataArr[i])}
            </div>
            <h1 className="program-code-text-style">{"}"}</h1>
          </div>
        )
        functions.push(functionItem)
      }


    }


    return functions
  }

  return(
    returnFunctions()
  )
}
export default Functions;