import React from "react";

function MainFunctionCalls(props) {
 
  const returnMainFunctionCalls = () => {
    var functionCalls = []

    var functionName = ""
    if(props.stackFrameRunningFunctions.length === 1){
      var tempFuncName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-1].functionName
      for(var i=0; i<props.stackFrameDataArr.length; i++){
        if(tempFuncName === props.stackFrameDataArr[i].functionName){
          if(
            
            (props.stackFrameDataArr.length == 2 &&
            props.stackFrameDataArr[1].additionalFunctionCalls.length > 0 && 
            props.stackFrameDataArr[1].unsafeFunctions.length > 0 && 
            props.stepProgramClickNumber === 5 &&
            props.stackFrameDataArr[0].unsafeFunctions.length === 0)

            ||

            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName &&
              props.stepProgramClickNumber === 7)
            
            ||

            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName &&
              props.stepProgramClickNumber === 7)
            
            ||

            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName &&
              props.stepProgramClickNumber === 7)

            ||

            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName &&
              props.stepProgramClickNumber === 7)

            ||

            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 && 
              props.stepProgramClickNumber === 5)

            ){
            functionName = ""
          }
          else{
            functionName = props.stackFrameRunningFunctions[props.stackFrameRunningFunctions.length-1].functionName
          }
        }
      }
    }

    for(var i=0; i<props.stackFrameDataArr.length; i++){
      var functionCall = null
      if(props.stackFrameDataArr[i].functionName === functionName){

        var userInputAsParam = false
        for(var j=0; j<props.stackFrameDataArr[i].parameterDetails.length; j++){
          if(props.stackFrameDataArr[i].parameterDetails[j].name === "userInput"){
            userInputAsParam = true
            break
          }
        }
        //console.log(userInputAsParam)
        if(userInputAsParam === false){

          if(props.stepProgramClickNumber === 1){

            /***** Always highlighting first function name and parameters *****/

            functionCall = (
              <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
            )
            functionCalls.push(functionCall)
              
          }
          if(props.stepProgramClickNumber === 3){

            /***** Hightling only function name *****/

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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
            
            /***** Hightling function name and parameters *****/
            else{
              functionCall = (
                <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }
           
          }
          if(props.stepProgramClickNumber === 5){

            /***** Highlighting function name and parameter *****/

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
              functionCall = (
                <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }

            /***** Hightling only function name *****/
            else if(

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

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

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

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

          /***** No highlighting *****/
            else if(
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
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === props.stackFrameDataArr[1].functionName)
              ){
              functionCall = (
                <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }
          }
          if(props.stepProgramClickNumber === 7){

            /***** Highlighting function name and parameters */
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
                functionCall = (
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                )
                functionCalls.push(functionCall)
              }

            /***** Highlighting function name */

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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** No highlighting *****/

            if(props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){

                functionCall = (
                  <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                )
                functionCalls.push(functionCall)
              }
          
          
              (props.stackFrameDataArr.length === 2 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
          }
          if(props.stepProgramClickNumber === 9){
            /***** Highlighting function name and parameters */

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
                functionCall = (
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                )
                functionCalls.push(functionCall)
              }

            /***** Highlighting function name */
            else if(
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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          if(props.stepProgramClickNumber === 11){

            /***** Highlighting name *****/

            if(
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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
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
              functionCall = (
                <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }
          }
          if(props.stepProgramClickNumber === 15){

            /***** Highlighting name *****/
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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          if(props.stepProgramClickNumber === 17){

            /***** Highlighting name *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
        }
        else{
          var tempUnmodifiedParams = ""
          props.stackFrameDataArr[i].parameterDetails.map(parameter =>{
            if(parameter.name !== "userInput"){
              if(parameter.type === "char" || parameter.type === "char[]"){
                tempUnmodifiedParams += ( '"' + parameter.value + '", ') 
              }
              else{
                tempUnmodifiedParams += (parameter.value + ', ') 
              }            
            }
            
          })
          if(props.stepProgramClickNumber === 1){
            var unmodifiedParams = tempUnmodifiedParams
            functionCall = (
              <div style={{display: 'flex'}}>
                <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                <h1 className="program-code-hightlight-text-style">);</h1>
              </div>
            )
            functionCalls.push(functionCall)
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
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                  <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>

                </div>
              )
              functionCalls.push(functionCall)
            }
          
            /***** Highlighting name *****/
            else{
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 5){

            /***** No highlighting */
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
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)
              ){
              functionCall = (
                <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }

            else if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||

              (props.stackFrameDataArr.length === 2 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||
              
              (props.stackFrameDataArr.length === 2 && 
                props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length === 0)

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
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                  <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>

                </div>
              )
              functionCalls.push(functionCall)
            }
            else{
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 7){

            /***** Highlighting name and argv */

            if(
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
                var unmodifiedParams = tempUnmodifiedParams
                functionCall = (
                  <div style={{display: 'flex'}}>
                    <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                    <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                    <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                    <h1 className="program-code-hightlight-text-style">);</h1>
                  </div>
                )
                functionCalls.push(functionCall)
              }

            else if(props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0){

              functionCall = (
                <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
              
            }

            else{  
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 9){

            /***** Highlighting function name and argv *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){
              
              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                  <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** Highlighting function name *****/
            else if(
              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0)
              
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

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 11){

            /***** Highlighting name *****/
            if(
              (props.stackFrameDataArr.length === 3 &&
                props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName)

              ||

              (props.stackFrameDataArr.length === 2 && 
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||
              
              (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName)

              ){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** Highlight name and argv *****/
            else if(
              
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
              
              ){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}(</h1>
                  <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>

                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 12){

            /***** No highlighting *****/
            if(props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[0].functionName){
              functionCall = (
                <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(props.stepProgramClickNumber === 15){

            /***** Highlighting function name *****/
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

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall) 
            }
          }
          else if(props.stepProgramClickNumber === 17){
            if
            (props.stackFrameDataArr.length === 3 &&
              props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == props.stackFrameDataArr[1].functionName){

            
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall) 
            }
          }
        }
      }
      else{
        functionCall = (
          <h1 className="program-code-text-style">{props.stackFrameDataArr[i].functionName}({props.stackFrameDataArr[i].unmodifiedParams});</h1>
        )
        functionCalls.push(functionCall)
      }
    }

    return functionCalls
  }

  return(
    returnMainFunctionCalls()
  )
}
export default MainFunctionCalls;