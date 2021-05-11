import React, { Component, useState } from "react";
import "./css/startPage.css";
import "./css/stack.css";
import styled, { keyframes } from "styled-components";
import MainFunctionStack from "./mainFunctionStack"
import { AiOutlineArrowLeft } from "react-icons/ai";


/**
 * The stack smashing page of the application.
 */

 
class Stack extends Component {

  constructor(props) {
    super(props)
    this.startProgram = this.startProgram.bind(this)
    this.stopProgram = this.stopProgram.bind(this)
    this.updateUserInput = this.updateUserInput.bind(this);
    this.returnStackFrames = this.returnStackFrames.bind(this);
    this.completeMaliciousExecution = this.completeMaliciousExecution.bind(this)
    this.programNext = this.programNext.bind(this)
    this.programFinish = this.programFinish.bind(this)
    this.returnProgramFunctionsLocalVariables = this.returnProgramFunctionsLocalVariables.bind(this)
    this.returnUnsafeFunctionsMain = this.returnUnsafeFunctionsMain.bind(this)
    this.returnProgramFunctionsAdditionalFuncCalls= this.returnProgramFunctionsAdditionalFuncCalls.bind(this)
    this.returnMainFunctionCalls = this.returnMainFunctionCalls.bind(this)
    this.returnFunctions = this.returnFunctions.bind(this)
    this.returnProgram = this.returnProgram.bind(this)
    this.returnMainStackParams = this.returnMainStackParams.bind(this)
    this.returnArgvOne = this.returnArgvOne.bind(this)

    this.state = {
      displaySegFault: false,
      displayAddFrame: false,
      running: false,
      stackFrameDataArray: this.props.stackFrameDataArr,
      stackFrameRunningFunctions: [],
      userInput: "",
      maliciousPayload: false,
      maliciousExecution: false,
      segFault: false,
      mainStackParams: [],
      argvOne: "",
      endParametersAddress: 0,
      stepProgramClickNumber: 0,
      displayFinishButton: false,
      displayNextButton: false
    }
  }


  startProgram(){

    var startUserInput = "./intro " + this.state.userInput
    var userInputArray = startUserInput.split(" ")
    var argc = userInputArray.length

    if(this.state.userInput === ""){
      argc = 1
    }
    var argcArr = []
    argcArr.push(argc)

    var tempUserInputArray = []
    for(var i=0; i<userInputArray.length; i++){
      var tempUserInput = userInputArray[i].split("")
      for(var j=0; j<tempUserInput.length; j++){
        tempUserInputArray.push(tempUserInput[j])
      }
      tempUserInputArray.push("\\0")
    }

    var reversedUserInputArray = tempUserInputArray.reverse().concat(argcArr)
    var argvOne = []

    if(this.state.userInput === ""){
      reversedUserInputArray.splice(reversedUserInputArray,1)
    }
    else{
      argvOne = userInputArray[1].split("")
    }

    var startAddress = 2882404352
    var endParametersAddress = startAddress - (reversedUserInputArray.length + 1)

    if(this.props.stackFrameDataArr.length === 0){
      this.setState({displayFinishButton: true})
    }
    else{
      this.setState({displayNextButton: true})
    }

    this.setState({
      running: true, 
      segFault: false, 
      displaySegFault: false,
      mainStackParams: reversedUserInputArray, 
      argvOne: argvOne,
      endParametersAddress: endParametersAddress
    })
  }

  stopProgram(){

    var stackFrameDataArray = this.state.stackFrameDataArray
    for(var i=0; i<stackFrameDataArray.length; i++){
      stackFrameDataArray[i].disableButton = false
    }

    this.setState({
      stackFrameDataArray: stackFrameDataArray,
      running: false, 
      stackFrameRunningFunctions: [], 
      maliciousPayload: false,
      maliciousExecution: false,
    })
  }

  completeMaliciousExecution(address){

    var tempArr = this.state.stackFrameRunningFunctions
    for(var i=0; i<tempArr.length; i++){
      if(tempArr[i].address === address){
        var newArr = tempArr.slice(0, i).concat(tempArr.slice(i + 1))
        break
      }
    }

    var stackFrameDataArray = this.state.stackFrameDataArray
    for(var i=0; i<stackFrameDataArray.length; i++){
      if(stackFrameDataArray[i].address === address){
        stackFrameDataArray[i].disableButton = false
        break
      }
    }

    this.setState({
      stackFrameDataArray: stackFrameDataArray,
      stackFrameRunningFunctions: newArr, 
      maliciousPayload: false,
      maliciousExecution: false,
    })
  }

  updateUserInput(event){
    this.setState({userInput: event})
  }

  programNext(){

    var currentStackFrame = []
    console.log("num of clicks " + this.state.stepProgramClickNumber)

    var stackFrame = {
      functionName: "strcpy",
      parameters: [],
      additionalFunctionCalls: [],
      unmodifiedParams: "",
      localFuncParams: "",
      address: "",
      mainLocalVariables: [],
      localVariables: [],
      localVariablesLetterArray: [],
      parametersLetterArray: [],
      savedFramePointer: [],
      disableButton: false,
      unsafeFunctions: [],
      parameterDetails: [],
    }

    if(this.state.stepProgramClickNumber === 0){

      // Always pushing func1

      var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
      this.setState({
        stackFrameRunningFunctions: runningFunctions,
        stepProgramClickNumber: this.state.stepProgramClickNumber + 1
      })        
      return    
    }

    else if(this.state.stepProgramClickNumber === 1){

      // PUSHING STRCPY

      if(this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0){
        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      if(this.props.stackFrameDataArr[0].unsafeFunctions.length === 0){

        // func1
        if(this.props.stackFrameDataArr. length === 1){
          this.setState({
            displayFinishButton: true, 
            displayNextButton: false,
            stackFrameRunningFunctions: [],
            stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
          }) 
          return
        }

        else{
          var runningFunctions = this.state.stackFrameRunningFunctions
          runningFunctions.pop()
          this.setState({
            stackFrameRunningFunctions: runningFunctions,
            stepProgramClickNumber: this.state.stepProgramClickNumber + 1
          })
          return 
        }
      }

      // POPPING FINAL STACKFRAME
      else{

        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
      
    }

    else if(this.state.stepProgramClickNumber === 2){

      // POPPING FUNCTION

      if(this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0){
        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC2

      else if(this.props.stackFrameDataArr[0].unsafeFunctions.length === 0){
        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // POPPING FINAL STACKFRAME
      else{

        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }

      /*if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
      ||

      (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
      
      ||

      (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

      ||

      (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

      ||

      (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

      ||

      (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
      
      ||

      (this.props.stackFrameDataArr.length === 1 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)

      
      ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }*/

      // pushing func2
      // Func1, func2(AF), func3(AF2)
      /*if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

        ||

        ((this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0))

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }*/
    }

    else if(this.state.stepProgramClickNumber === 3){

      // POPPING FUNCTION

      if(

        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)


        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
          
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // pushing func1
      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // pushing strcpy
      else if(

        (this.props.stackFrameDataArr.length === 2 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        // Fun1, func2(strcpy), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

      
        ||

        // Func1, func2(strcpy)(AF), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Func1, func2(strcpy)(AF), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
      
        ||

        // Fun1, func2(strcpy), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Func1, func2(strcpy)(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

      // POPPING FINAL FUNCTION
      else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }
    
    else if(this.state.stepProgramClickNumber === 4){

      // PUSHING FUNC2

      if(

        // Func1(strcpy), func2
        (this.props.stackFrameDataArr.length === 2 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
        
        ||

        // Func1(strcpy), func2(strcpy)
        (this.props.stackFrameDataArr.length === 2 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

        ||

        // Func1(strcpy), func2(AF)
        (this.props.stackFrameDataArr.length === 2 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

        ||

        // Func1(strcpy), func2(AF)(strcpy)
        (this.props.stackFrameDataArr.length === 2 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

        ||

        // func1(strcpy), func2, func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        // Func1(strcpy), func2(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        // Func1(strcpy), func2, func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
          ||

        // Func1(strcpy), func2, func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Func1(strcpy), func2(AF), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        
          ||

          // Func1(strcpy), func2(AF), func3(AF2)
          (this.props.stackFrameDataArr.length === 3 &&
            this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
            this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
            this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
            this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
            this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
            this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Func1, func2(strcpy)(AF), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Func1, func2(strcpy)(AF), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        // Fun1, func2(strcpy), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        // Fun1, func2(strcpy), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Func1, func2(strcpy)(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        // Func1, func2(strcpy), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

        ||

        // func1, func2
        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

        ||

        
        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
        
        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // PUSHING FUNC3

      if(
        
        //Func1, func2, func3
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        //Fun1, func2, func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0)
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[2])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 5){

      // pushing func1

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Func1, func2(strcpy)(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr.length === 2)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // popping function

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Fun1, func2(strcpy), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        // Fun1, func2(strcpy), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Func1, func2(strcpy), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // pushing func2

      else if(this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // pushing strcpy

      else if(

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr.length === 2)
        
        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

      // POPPING FINAL FUNCTION
      else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 6){

      // pushing strcpy
      // Func1(strcpy), func2(AF), func3(AF2)
      if(
        
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // pushing func3

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&  
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        // Func1, func2(strcpy), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        // Fun1, func2(strcpy), func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[2])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // popping function

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Func1, func2(strcpy)(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr.length === 2)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 7){

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

         // Func1, func2(strcpy)(AF), func3
         (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 2 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC2

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        // Fun1, func2(strcpy), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC1

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING STRCPY

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

      // POPPING FINAL FUNCTION
      else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 8){

      // PUSHING FUNC1

      if(

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        || 

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

          
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING STRCPY

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC3  

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        // Func1, func2(strcpy)(AF), func3
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[2])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 9){

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC2  

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

      // PUSHING FUNC1

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

      // POPPING FINAL FUNCTION
      else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 10){

      // PUSHING FUNC3

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[2])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING STRCPY

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
        this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 11){

      // PUSHING FUNC2

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC1

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      else if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        //Func1, func2(strcpy)(AF), func3(AF2)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&  
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] === this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0  && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr.length === 2)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

       // POPPING FINAL FUNCTION
       else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 12){

      // PUSHING FUNC1

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)



        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[0])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING STRCPY

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 13){

      // PUSHING STRCPY

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(stackFrame)
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 14){

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

          
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // PUSHING FUNC1

      if(
        this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 15){

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
          
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }

      // POPPING FINAL FUNCTION
      else{
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 16){

      // POPPING FUNCTION

      if(
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
        
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions
        runningFunctions.pop()
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })        
        return
      }
      else{
        // popping remaining functions
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }
    }

    else if(this.state.stepProgramClickNumber === 17){

      // POPPING FUNCTION

      if(this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
        this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName){

        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        }) 
        return
      }
      else{
        // popping remaining function
        this.setState({
          displayFinishButton: true, 
          displayNextButton: false,
          stackFrameRunningFunctions: [],
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
        return
      }

    }

    this.setState({
      stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
      stackFrameRunningFunctions: currentStackFrame
    })
  }

  programFinish(){
    this.setState({
      stackFrameRunningFunctions: [], 
      running:false, 
      displayFinishButton: false,
      stepProgramClickNumber: 0
    })
  }

  returnStackFrames(){

    var stackFramesStartAddress = this.state.endParametersAddress - 7

    return(
      this.state.stackFrameRunningFunctions.map((stackFrame) =>
      <div className="stack-frame-container">
        <div className="main-stack-title-container">
          <h1 className="stack-frame-function-name-text">{stackFrame.functionName}()</h1>
        </div>
        {stackFrame.parametersLetterArray.map((param) =>
          <div className="stack-frame-param-container">
            <div className="main-stack-param-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{param}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div>
          </div>                
        )}
        <div className="return-address-container">
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\xAB"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\xCE"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="saved-frame-pointer-container">
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
          <div className="main-stack-param-container">
            <div className="main-stack-second-container">
              <div className="main-stack-value-container">
                <h1 className="main-stack-param-text">{"\\x00"}</h1>
              </div>
              <div className="center">
              <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
              </div>
            </div>
          </div>
        </div> 
        
        {stackFrame.localVariablesLetterArray.map((variable) => 
          <div className="stack-frame-variable-container">
            <div className="main-stack-param-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{variable}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((stackFramesStartAddress -= 1).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div>
          </div> 
        )}
      </div>
      )
    )
  }

  returnProgramFunctionsLocalVariables(stackFrame){

    var localVariables = []
    stackFrame.mainLocalVariables.map((variable) =>{
      if(variable.type === "char[]"){
        localVariables.push(
          <h1 className="program-code-text-style">char {variable.name}[] = "{variable.value}"; </h1>
        )
      }
      else if(variable.type === "int" || variable.type === "float"){
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

  returnUnsafeFunctionsMain(stackFrame){
    return(
      stackFrame.unsafeFunctions.map((func) =>
        <div>
          <h1 className="program-code-text-style"> strcpy({func.param1Name}, {func.param2Name});</h1>
        </div>
      )
    )
  }

  returnProgramFunctionsAdditionalFuncCalls(stackFrame){
    return(
      stackFrame.additionalFunctionCalls.map((func) =>
        <div>
          <h1 className="program-code-text-style"> {func}</h1>
        </div>
      )
    )
  }

  returnMainFunctionCalls(){
    return(
      this.props.stackFrameDataArr.map((stackFrame) =>
        <div>
          <h1 className="program-code-text-style">{stackFrame.functionName}({stackFrame.unmodifiedParams});</h1>
        </div>
      )
    )
  }

  returnFunctions(){
    return(
      this.props.stackFrameDataArr.map((stackFrame) =>
      <div className="program-functions">
        <div className="functions-flex">
          <h1 className="program-code-text-style">void {stackFrame.functionName} </h1>
          <div className="functions-flex">
            <h1 className="program-code-text-style">({stackFrame.localFuncParams}){"{"}</h1>
          </div>
        </div>
        <div className="margin-left-7">
          {this.returnProgramFunctionsLocalVariables(stackFrame)}
          {this.returnUnsafeFunctionsMain(stackFrame)}
          {this.returnProgramFunctionsAdditionalFuncCalls(stackFrame)}
        </div>
        <h1 className="program-code-text-style">{"}"}</h1>
      </div>
      )
    )
  }

  returnProgram(){

    return(
      <div>
        <div className="program-code-container-stack">
          <div className="program-name-container">
            <h1 className="program-name-text-style">intro.c</h1>
          </div>
          <div className="code-lines-spacer">
            <h1 className="program-code-text-style">{"#include <stdio.h>"}</h1>
            <h1 className="program-code-text-style">{"#include <string.h>"}</h1>
            <h1 className="program-code-text-style">int main( int argc, char* argv[])</h1>
            <div className="margin-left-7">
              {this.returnMainFunctionCalls()}
            </div>
            <h1 className="program-code-text-style">{"}"}</h1>
          </div>
          {this.returnFunctions()}
        </div>
        <div className="height-5">&nbsp;</div>
      </div>
    )
  }

  returnMainStackParams(){

    var startAddress = 2882404352

    return(
      this.state.mainStackParams.map((param) => 
        <div className="main-stack-param-container">
          <div className="main-stack-second-container">
            <div className="main-stack-value-container">
              <h1 className="main-stack-param-text">{param}</h1>
            </div>
            <div className="center">
              <h1 className="main-stack-param-text">0x{((startAddress -= 1).toString(16)).toUpperCase()}</h1>
            </div>
          </div>
        </div>
      )
    )
  }

  returnArgvOne(){
    return(
      this.state.argvOne.map((param) => 
      <div className="main-stack-param-container">
         <div className="main-stack-second-container">
          <div className="main-stack-value-container">
            <h1 className="main-stack-param-text">{param}</h1>
          </div>
          <div className="center">
            <h1 className="main-stack-param-text">0xAC1A4B30</h1>
          </div>
        </div>
      </div>
      )
    )
  }

  render() {
    return(
      <div className="main-stack-frame-container">
        <div className="flex">
        <div className="main-code-spacer">
          <button className="back-button" onClick={this.props.goBack}>
            <div className="flex">
              <AiOutlineArrowLeft className="functions-arrow-stack" color={"#1a75ff"} size={23}/>
              <h1 className="back-button-text">{"Functions"}</h1>
            </div>
          </button>
        </div>
        <div className="stack-container">
          <h1 className="stack-start-address-text">High Memory Address (Bottom of Stack)</h1>
          <div className="start-of-stack"> 
            <h1 className="stack-title-text-start">Stack</h1>
          </div>
          {this.state.running && (
            // Returning main stackframe
            <div>
              <div className="main-stack-title-container">
                <h1 className="stackframe-main-text">main() 0xABCE0000</h1>
              </div>

              <div className="main-stack-params-main-container">
                {this.returnMainStackParams()}
              </div>
              <div className="return-address-container">
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xAB"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{(this.state.endParametersAddress.toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xCE"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 1).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\x00"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 2).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xAC"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 3).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
              </div>
              <div className="saved-frame-pointer-container">
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xAB"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 4).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xCD"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 5).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xFF"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 6).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
                <div className="main-stack-second-container">
                  <div className="main-stack-value-container">
                    <h1 className="main-stack-param-text">{"\\xF2"}</h1>
                  </div>
                  <div className="center">
                    <h1 className="main-stack-param-text">0x{((this.state.endParametersAddress - 7).toString(16)).toUpperCase()}</h1>
                  </div>
                </div>
              </div>
            </div>

          )}
          <div>
            {this.returnStackFrames()}
          </div>
          <div className="heap-container"> 
            <h1 className="heap-title-text">Heap</h1>
          </div>

          <div className="data-container"> 
            <h1 className="stack-title-text">Data</h1>
          </div>

          <div className="code-container"> 
            <h1 className="stack-title-text">Code</h1>
          </div>
          <h1 className="stack-end-address-text">Low Memory Address</h1>
        </div>
        <div className="second-main-container">
          {!this.state.running && (
            <div className="run-program-container">
              <div className="flex">
                <div className="exe-code-container">
                  <h1 className="exe-code-text">./intro</h1>
                </div>
                <input
                  value={this.state.userInput}
                  type="text"
                  onChange={event => this.updateUserInput(event.target.value)}
                  className="user-input"
                />
                <button className="run-program-button" onClick={this.startProgram}>
                  <h1 className="run-program-button-text">Run</h1>
                </button>
              </div>
            </div>
          )}
          {this.state.displayNextButton && (
            <button className="next-button" onClick={this.programNext}>
              <h1 className="next-button-text">Next</h1>
            </button>
          )}
          {this.state.displayFinishButton && (
            <button className="next-button" onClick={this.programFinish}>
              <h1 className="pop-main-button-text">Pop main()</h1>
            </button>
          )}
          {this.returnProgram()}
        </div> 
      </div>
      </div>
    );
  }
}

export default Stack;