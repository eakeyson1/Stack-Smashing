import React, { Component, useState } from "react";
import "./css/startPage.css";
import "./css/functions.css";
import "./css/stack.css";
import "./css/stackButton.css"
import styled, { keyframes } from "styled-components";
import MainFunctionStack from "./mainFunctionStack"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Carousel from "react-bootstrap/Carousel";
import InstructCircle from "./components/InstructCircle"
import Checkbox from '@material-ui/core/Checkbox'

import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }`

/**
 * The stack smashing page of the application.
 */
 
class Stack extends Component {

  constructor(props) {
    super(props)
    this.startProgram = this.startProgram.bind(this)
    this.returnStackFrames = this.returnStackFrames.bind(this);
    this.programNext = this.programNext.bind(this)
    this.programFinish = this.programFinish.bind(this)
    this.returnProgramFunctionsLocalVariables = this.returnProgramFunctionsLocalVariables.bind(this)
    this.returnUnsafeFunctions = this.returnUnsafeFunctions.bind(this)
    this.returnProgramFunctionsAdditionalFuncCalls= this.returnProgramFunctionsAdditionalFuncCalls.bind(this)
    this.returnMainFunctionCalls = this.returnMainFunctionCalls.bind(this)
    this.returnFunctions = this.returnFunctions.bind(this)
    this.returnProgram = this.returnProgram.bind(this)
    this.returnMainStackParams = this.returnMainStackParams.bind(this)
    this.returnArgvOne = this.returnArgvOne.bind(this)
    this.returnMaliciousExecutionStatus = this.returnMaliciousExecutionStatus.bind(this)
    this.openStackFrame = this.openStackFrame.bind(this)
    this.closeStackFrame = this.closeStackFrame.bind(this)
    this.goBack = this.goBack.bind(this)
    this.nopSledDef = this.nopSledDef.bind(this)
    this.shellcodeDef = this.shellcodeDef.bind(this)
    this.returnAddressDef = this.returnAddressDef.bind(this)
    this.updateNopSled = this.updateNopSled.bind(this)
    this.updateShellCode = this.updateShellCode.bind(this)
    this.updateReturnAddress = this.updateReturnAddress.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleShellCodeClick = this.handleShellCodeClick.bind(this)
    this.handleReturnAddressClick = this.handleReturnAddressClick.bind(this)
    this.handleNopClick = this.handleNopClick.bind(this)
    this.returnMainFunctionTitle = this.returnMainFunctionTitle.bind(this)

    this.state = {
      displaySegFault: false,
      displayAddFrame: false,
      displayFinishButton: false,
      displayNextButton: false,
      maliciousExecutionBool: false,
      maliciousExecution: "Starting",
      running: false,
      stackFrameDataArray:[],
      stackFrameRunningFunctions: [],
      userInput: "",
      maliciousPayload: false,
      segFault: false,
      mainStackParams: [],
      argvOne: "",
      endParametersAddress: 0,
      stepProgramClickNumber: 0,
      mainStackOpen: false,
      segFaultFuncNameArr: [],
      malFuncNameArr: [],
      malExeMessage: "",
      nopSled: "",
      shellcode: "",
      returnAddress: "",
      index: 0,
      showControls: false,
      views : {
        NOP_VIEW: 0,
        SHELL_CODE_VIEW: 1,
        RETURN_ADDRESS_VIEW: 2,
      },
      payloadStateNop: true,
      payloadStateShellcode: false,
      payloadStateReturnAddress: false,
      startingShell: true,
      gettingRootPriviledges: false,
      shutDownOs: false,
      wipeOs: false,
      highlightArgv: false,
    }
  }


  startProgram(){

    /***** Must create a deep copy of the stackFrameDataArr prop *****/
    var stackDataArr = []
    for(var i=0; i<this.props.stackFrameDataArr.length; i++){
      stackDataArr.push(JSON.parse(JSON.stringify(this.props.stackFrameDataArr[i])))
    }
    /***** parameters for main() *****/

    var shellcode = ""
    if(this.state.startingShell === true){
      shellcode = "\\xF3\\xDD\\xA2\\xC9\\xAA\\xD3"
    }
    if(this.state.gettingRootPriviledges === true){
      shellcode = "\\xCC\\xB2\\xBB\\xA1\\x7B\\xC8\\xF4\\xC6"
    }
    if(this.state.shutDownOs === true){
      shellcode = "\\xFF\\D3\\x99\\xA0"
    }
    if(this.state.wipeOs === true){
      shellcode = "\\FA\\xDA\\x00\\xB0\\x77"
    }

    var startUserInput = "./intro " + this.state.nopSled + shellcode + this.state.returnAddress
    var payload = this.state.nopSled + shellcode + this.state.returnAddress
    var userInputArray = startUserInput.split(" ")
    var argc = userInputArray.length

    if(payload === ""){
      argc = 1
    }
    var argcArr = []
    argcArr.push(argc)

    var tempUserInputArray = []
    for(var i=0; i<userInputArray.length; i++){
      var tempUserInput = userInputArray[i].split("")
      for(var j=0; j<tempUserInput.length; j++){
        if(tempUserInput[j] === "\\" && tempUserInput[j+1] === "x"){
          var val = tempUserInput[j] + tempUserInput[j+1] + tempUserInput[j+2] + tempUserInput[j+3]
          tempUserInputArray.push(val)
          j +=3
        }
        else{
          tempUserInputArray.push(tempUserInput[j])
        }
      }
      tempUserInputArray.push("\\0")
    }

    var reversedUserInputArray = tempUserInputArray.reverse().concat(argcArr)
    var argvOne = []

    if(payload === ""){
      reversedUserInputArray.splice(reversedUserInputArray, 1)
    }
    else{
      argvOne = userInputArray[1].split("")
      this.setState({highlightArgv: true})
    }

    

    var startAddress = 2882404352
    var endParametersAddress = startAddress - (reversedUserInputArray.length + 1)

    /***** Displaying pop main is main is the only function in program *****/
    if(stackDataArr.length === 0){
      this.setState({displayFinishButton: true})
    }
    else{
      this.setState({displayNextButton: true})
    }


    /***** Updating values if function contains strcpy without user input *****/
    for(var k=0; k<stackDataArr.length; k++){

      var bool = false
      stackDataArr[k].parameterDetails.map((param) => {
        if(param.name === "userInput"){
          bool = true
        }
      })

      if(bool === false){

        // Checking if function contains strcpy and updating stack accordingly
        if(stackDataArr[k].unsafeFunctions.length !== 0){

          // checking in params and local varables for param2 of strcpy and getting value
          var param1Name = stackDataArr[k].unsafeFunctions[0].param1Name
          var param2Name = stackDataArr[k].unsafeFunctions[0].param2Name
          var newValue = ""
          var oldValue = ""

          for(var i=0; i<stackDataArr[k].mainLocalVariables.length; i++){
            if(stackDataArr[k].mainLocalVariables[i].name === param2Name){
              newValue = stackDataArr[k].mainLocalVariables[i].value
              break
            }
          }
          for(var i=0; i<stackDataArr[k].parameterDetails.length; i++){
            if(stackDataArr[k].parameterDetails[i].name === param2Name){
              newValue = stackDataArr[k].parameterDetails[i].value
              break
            }
          }

          for(var i=0; i<stackDataArr[k].mainLocalVariables.length; i++){
            if(stackDataArr[k].mainLocalVariables[i].name === param1Name){
              oldValue = stackDataArr[k].mainLocalVariables[i].value
              break
            }
          }
          for(var i=0; i<stackDataArr[k].parameterDetails.length; i++){
            if(stackDataArr[k].parameterDetails[i].name === param1Name){
              oldValue = stackDataArr[k].parameterDetails[i].value
              break
            }
          }

          /* 
            *  If the new value length is less than the old value length:
            *    Retrieve all local variable besides the old value
            *    Add new value onto local variable arr
            */

          if(newValue.length < oldValue.length){

            var variableArr = []
            stackDataArr[k].mainLocalVariables.map(variable =>{
        
              if(variable.value !== oldValue){
                var variableValArr = variable.value.split("")
                variableValArr.push("\\0")
                variableArr = variableArr.concat(variableValArr)  
              }      
            })

            var newValArr = newValue.split("")
            newValArr.push("\\0") 
            variableArr = variableArr.concat(newValArr)
            variableArr.reverse()

            stackDataArr[k].localVariablesLetterArray = variableArr
          }

          // Buffer overflow occurs
          else{

            var variableArr = []
            stackDataArr[k].mainLocalVariables.map(variable =>{
        
              if(variable.value !== oldValue){
                var variableValArr = variable.value.split("")
                variableValArr.push("\\0")
                variableArr = variableArr.concat(variableValArr)  
              }      
            })

            var newValArr = newValue.split("")
            newValArr.push("\\0") 
            variableArr = variableArr.concat(newValArr)
            variableArr.reverse()

            stackDataArr[k].localVariablesLetterArray = variableArr

            /***** Adding function to seg fault function list *****/
            var segFaultFuncNameArr = this.state.segFaultFuncNameArr.concat(stackDataArr[k].functionName)
            this.setState({segFaultFuncNameArr: segFaultFuncNameArr})

          }
        }
      }
    }
    
    // Checking for userinput and strcpy
    for(var k=0; k<stackDataArr.length; k++){
      if(stackDataArr[k].parameterDetails.length !== 0 && stackDataArr[k].unsafeFunctions.length !== 0){

        /***** Checking if parameters contains userinput *****/
        var bool = false
        stackDataArr[k].parameterDetails.map((param) => {
          if(param.name === "userInput"){
            bool = true
          }
        })

        if(bool === true){

          /***** Checking is userinput is copied into local variable *****/
          var param2Name = stackDataArr[k].unsafeFunctions[0].param2Name
          if(param2Name === "userInput"){

            /***** Getting length of buffer that is being copied into *****/
            for(var i=0; i<stackDataArr[k].mainLocalVariables.length; i++){
              if(stackDataArr[k].mainLocalVariables[i].name === stackDataArr[k].unsafeFunctions[0].param1Name){
                length = stackDataArr[k].mainLocalVariables[i].value.length
                break
              }
            }

            var userInputArr = payload.split(" ")

            /***** Getting value of param2 or source array *****/
            var param1Name = stackDataArr[k].unsafeFunctions[0].param1Name
            var oldValue = ""

            for(var i=0; i<stackDataArr[k].mainLocalVariables.length; i++){
              if(stackDataArr[k].mainLocalVariables[i].name === param1Name){
                oldValue = stackDataArr[k].mainLocalVariables[i].value
                break
              }
            }
            for(var i=0; i<stackDataArr[k].parameterDetails.length; i++){
              if(stackDataArr[k].parameterDetails[i].name === param1Name){
                oldValue = stackDataArr[k].parameterDetails[i].value
                break
              }
            }

            /****** Pushing full machine code command is inputted *****/
            var userInputArr = payload.split(" ")
            var tempUserInput = userInputArr[0].split("")
            var tempUserInputArr = []
            for(var j=0; j<tempUserInput.length; j++){
              if(tempUserInput[j] === "\\" && tempUserInput[j+1] === "x"){
                var val = tempUserInput[j] + tempUserInput[j+1] + tempUserInput[j+2] + tempUserInput[j+3]
                tempUserInputArr.push(val)
                j +=3
              }
              else{
                tempUserInputArr.push(tempUserInput[j])
              }
            }
            tempUserInputArr.push("\\0")

            /***** Reconstrucing parameters *****/

            var paramArr = []
            stackDataArr[k].parameterDetails.map(param =>{
              if(param.value !== oldValue){
                var paramValArr = param.value.split("")
                paramValArr.push("\\0")
                paramArr = paramArr.concat(paramValArr)  
              }      
            })

            paramArr.splice(-1,1)
            paramArr = paramArr.concat(tempUserInputArr)
            paramArr.reverse()


            stackDataArr[k].parametersLetterArray = paramArr

            /***** Reconstructing local variables *****/

            var variableArr = []
            stackDataArr[k].mainLocalVariables.map(variable =>{
        
              if(variable.value !== oldValue){
                var variableValArr = variable.value.split("")
                variableValArr.push("\\0")
                variableArr = variableArr.concat(variableValArr)  
              }      
            })

            variableArr = variableArr.concat(tempUserInputArr)
            variableArr.reverse()

            var sfpOverFlowLength = variableArr.length - 16
            var concatLV = variableArr
    

            /* If new length with variable replaced in greater than 16:
            *   updated SFP and return address
            */
            if(sfpOverFlowLength > 0){


              var partLVArray = []
              for(i=sfpOverFlowLength; i<sfpOverFlowLength+16; i++){
                partLVArray.push(variableArr[i])
              }

              stackDataArr[k].localVariablesLetterArray = partLVArray

              // Updating SFP values
              if(sfpOverFlowLength === 1){
                stackDataArr[k].sfpArr[3] = concatLV[0]
              }
              if(sfpOverFlowLength === 2){
                stackDataArr[k].sfpArr[3] = concatLV[1]
                stackDataArr[k].sfpArr[2] = concatLV[0]
              }
              if(sfpOverFlowLength === 3){
                stackDataArr[k].sfpArr[3] = concatLV[2]
                stackDataArr[k].sfpArr[2] = concatLV[1]
                stackDataArr[k].sfpArr[1] = concatLV[0]
              }
              if(sfpOverFlowLength === 4){
                stackDataArr[k].sfpArr[3] = concatLV[3]
                stackDataArr[k].sfpArr[2] = concatLV[2]
                stackDataArr[k].sfpArr[1] = concatLV[1]
                stackDataArr[k].sfpArr[0] = concatLV[0]
              }

              // Updating SFP values and return address

              if(sfpOverFlowLength === 5){
                stackDataArr[k].sfpArr[3] = concatLV[4]
                stackDataArr[k].sfpArr[2] = concatLV[3]
                stackDataArr[k].sfpArr[1] = concatLV[2]
                stackDataArr[k].sfpArr[0] = concatLV[1]
                stackDataArr[k].returnAddressArr[3] = concatLV[0]
              }
              if(sfpOverFlowLength === 6){
                stackDataArr[k].sfpArr[3] = concatLV[5]
                stackDataArr[k].sfpArr[2] = concatLV[4]
                stackDataArr[k].sfpArr[1] = concatLV[3]
                stackDataArr[k].sfpArr[0] = concatLV[2]
                stackDataArr[k].returnAddressArr[3] = concatLV[1]
                stackDataArr[k].returnAddressArr[2] = concatLV[0]

              }
              if(sfpOverFlowLength === 7){
                stackDataArr[k].sfpArr[3] = concatLV[6]
                stackDataArr[k].sfpArr[2] = concatLV[5]
                stackDataArr[k].sfpArr[1] = concatLV[4]
                stackDataArr[k].sfpArr[0] = concatLV[3]
                stackDataArr[k].returnAddressArr[3] = concatLV[2]
                stackDataArr[k].returnAddressArr[2] = concatLV[1]
                stackDataArr[k].returnAddressArr[1] = concatLV[0]
              }
              if(sfpOverFlowLength === 8){
                stackDataArr[k].sfpArr[3] = concatLV[7]
                stackDataArr[k].sfpArr[2] = concatLV[6]
                stackDataArr[k].sfpArr[1] = concatLV[5]
                stackDataArr[k].sfpArr[0] = concatLV[4]
                stackDataArr[k].returnAddressArr[3] = concatLV[3]
                stackDataArr[k].returnAddressArr[2] = concatLV[2]
                stackDataArr[k].returnAddressArr[1] = concatLV[1]
                stackDataArr[k].returnAddressArr[0] = concatLV[0]
              }

              /***** Correctly overwrritten return address *****/
              if(sfpOverFlowLength === 9){
                stackDataArr[k].sfpArr[3] = concatLV[8]
                stackDataArr[k].sfpArr[2] = concatLV[7]
                stackDataArr[k].sfpArr[1] = concatLV[6]
                stackDataArr[k].sfpArr[0] = concatLV[5]
                stackDataArr[k].returnAddressArr[3] = concatLV[4]
                stackDataArr[k].returnAddressArr[2] = concatLV[3]
                stackDataArr[k].returnAddressArr[1] = concatLV[2]
                stackDataArr[k].returnAddressArr[0] = concatLV[1]

                var tempReturnAddress = concatLV[4] + concatLV[3] + concatLV[2] + concatLV[1]
                var returnAddressHex = tempReturnAddress.replaceAll("\\x", "")
                var newReturnAddressInt = parseInt(returnAddressHex, 16)

                var startAddress = 2882404344 - reversedUserInputArray.length
                var currentStackFrameAddressLength = stackDataArr[k].parametersLetterArray.length + 8

                var totalLen = 0
                for(var j=0; j < this.state.stackFrameRunningFunctions.length-1; j++){
                  totalLen += this.state.stackFrameRunningFunctions[j].parametersLetterArray.length + this.state.stackFrameRunningFunctions[j].localVariablesLetterArray.length + 8
                }
                
                var finalLen = currentStackFrameAddressLength + totalLen
                var lowBoundAddress = startAddress - finalLen
                var highBoundHigh = lowBoundAddress - 16
                if(newReturnAddressInt < lowBoundAddress && newReturnAddressInt > highBoundHigh){
                  var malFuncNameArr = this.state.malFuncNameArr
                  malFuncNameArr.push(stackDataArr[k].functionName)
                  this.setState({malFuncNameArr: malFuncNameArr})
                }
              }

              // seg fault
              if(sfpOverFlowLength > 9){
                stackDataArr[k].sfpArr[3] = concatLV[8]
                stackDataArr[k].sfpArr[2] = concatLV[7]
                stackDataArr[k].sfpArr[1] = concatLV[6]
                stackDataArr[k].sfpArr[0] = concatLV[5]
                stackDataArr[k].returnAddressArr[3] = []
                stackDataArr[k].returnAddressArr[2] = []
                stackDataArr[k].returnAddressArr[1] = []
                stackDataArr[k].returnAddressArr[0] = []
              }

            }
            else{
              stackDataArr[k].localVariablesLetterArray = variableArr
            }
          }
        }
      }
    }

    this.setState({
      running: true, 
      segFault: false, 
      displaySegFault: false,
      mainStackParams: reversedUserInputArray, 
      argvOne: argvOne,
      endParametersAddress: endParametersAddress,
      stackFrameDataArray: stackDataArr,
      maliciousExecution: "Running",
    })
  }

  programNext(){

    var currentStackFrame = []

    var returnAddressArr = ["\\xAB", "\\xCE", "\\x00", "\\x00"]
    var sfpArr = ["\\x00", "\\x00", "\\x00", "\\x00"]

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
      displayStackFrame: false,
      returnAddressArr: returnAddressArr,
      sfpArr: sfpArr,
      strcpy: true,
    }

    this.setState({highlightArgv: false})

    console.log("step number " + this.state.stepProgramClickNumber)

    if(this.state.stepProgramClickNumber === 0){

      // Always pushing func1
      var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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
        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
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
    }

    else if(this.state.stepProgramClickNumber === 3){

      // POPPING FUNCTION

      if(

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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

      // Pushing func3

      else if((this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
        
        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.props.stackFrameDataArr[2])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1,
        })
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
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
        
        //Func1, func2, func3
        (this.props.stackFrameDataArr.length === 3 &&
        this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
        this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
        this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

        ||

        //Fun1, func2, func3(AF1)
        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0)

        ||

        (this.props.stackFrameDataArr.length === 3 &&
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[2])
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
        })
        return
      }

      // pushing strcpy

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
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[2])
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
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

        ||

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
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

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
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
        this.setState({
          stackFrameRunningFunctions: runningFunctions,
          stepProgramClickNumber: this.state.stepProgramClickNumber + 1
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
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


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[2])
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
          this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
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
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 && 
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
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
          this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
          this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 && 
          this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
          this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
          this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)


        ){

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[2])
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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[1])
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

          var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
          this.setState({
            stackFrameRunningFunctions: runningFunctions,
            stepProgramClickNumber: this.state.stepProgramClickNumber + 1
          })        
          return
        }

        // POPPING FUNCTION

        else if(

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

        var runningFunctions = this.state.stackFrameRunningFunctions.concat(this.state.stackFrameDataArray[0])
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

    if(this.state.malFuncNameArr.length !== 0){
      this.setState({maliciousExecution: "Successful", maliciousExecutionBool: true})
    }
    else{
      this.setState({maliciousExecution: "Unsuccessful"})
    }
    setTimeout(() => { this.setState({maliciousExecution: "Starting"}) }, 12000);
    setTimeout(() => { this.setState({malFuncNameArr: []}) }, 12000);


    this.setState({
      stackFrameRunningFunctions: [], 
      running:false, 
      displayFinishButton: false,
      stepProgramClickNumber: 0,
      stackFrameDataArray: [],
      malExeMessage: "",
      mainStackOpen: false,
      highlightArgv: false
    })
  }

  openStackFrame(functionName){

    var tempRunningFuncs = this.state.stackFrameRunningFunctions

    for(var i=0; i<tempRunningFuncs.length; i++){
      if(tempRunningFuncs[i].functionName === functionName){
        tempRunningFuncs[i].displayStackFrame = true
        this.setState({stackFrameRunningFunctions: tempRunningFuncs})
        break
      }
    }
  }

  closeStackFrame(functionName){

    var tempRunningFuncs = this.state.stackFrameRunningFunctions

    for(var i=0; i<tempRunningFuncs.length; i++){
      if(tempRunningFuncs[i].functionName === functionName){
        tempRunningFuncs[i].displayStackFrame = false
        this.setState({stackFrameRunningFunctions: tempRunningFuncs})
        break
      }
    }
  }

  updateNopSled(event){
    this.setState({nopSled: event})
  }

  updateShellCode(event){
    this.setState({shellcode: event})
  }

  updateReturnAddress(event){
    this.setState({returnAddress: event})
  }

  handleSelect(selectedIndex, showControls, e) {
    this.setState({index: selectedIndex})
    if (selectedIndex === this.state.views.CHOSEN_VIEW && showControls) {
      this.setState({showControls: true})
    } else if (selectedIndex === this.state.views.CHOSEN_VIEW && !showControls) {
      this.setState({showControls: false})
    }
    else {
      this.setState({showControls: false})
    }
  }

  handleShellCodeClick(){
    this.handleSelect(this.state.views.SHELL_CODE_VIEW);
    this.setState({
      payloadStateShellcode: true,
      payloadStateNop: false,
      payloadStateReturnAddress: false
    })
  }

  handleReturnAddressClick(){
    this.handleSelect(this.state.views.RETURN_ADDRESS_VIEW);
    this.setState({
      payloadStateShellcode: false,
      payloadStateNop: false,
      payloadStateReturnAddress: true
    })
  }

  handleNopClick(){
    this.handleSelect(this.state.views.NOP_VIEW);
    this.setState({
      payloadStateShellcode: false,
      payloadStateNop: true,
      payloadStateReturnAddress: false
    })
  }

  returnStackFrames(){

    var stackFramesStartAddress = this.state.endParametersAddress - 7

    return(

      this.state.stackFrameRunningFunctions.map((stackFrame) =>
        <div>
          {!stackFrame.strcpy && (
            <div>
              {stackFrame.displayStackFrame && (
                <div>
                  <button className="stack-frame-open-button" onClick={() => this.closeStackFrame(stackFrame.functionName)}>
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
              <button className="stack-frame-open-button" onClick={() => this.openStackFrame(stackFrame.functionName)}>
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
            <button className="stack-frame-open-button-strcpy" onClick={() => this.closeStackFrame(stackFrame.functionName)}>
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

  returnUnsafeFunctions(stackFrame){

    var functionCalls = []
    var functionName = ""
    if(this.state.stackFrameRunningFunctions.length !== 0){
      if(this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-1].functionName === "strcpy"){
        functionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-2].functionName
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

  returnProgramFunctionsAdditionalFuncCalls(stackFrame){


    var functionName = ""
    var parentFunctionName = ""
    if(this.state.stackFrameRunningFunctions.length > 1){
      functionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-1].functionName
      parentFunctionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-2].functionName
    }


    var containsUnsafeFunctions = false
    for(var i=0; i<this.props.stackFrameDataArr.length; i++){
      if(this.props.stackFrameDataArr[i].unsafeFunctions.length !== 0){
        containsUnsafeFunctions = true
      }
    }
    
    if(this.state.stackFrameRunningFunctions.length === 3 & !containsUnsafeFunctions){
      parentFunctionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-2].functionName
      functionName = this.props.stackFrameDataArr[0].functionName
    }

    var additionalFunctionCalls = []
    
    for(var i=0; i<stackFrame.additionalFunctionCalls.length; i++){
      var addFunctionName = stackFrame.additionalFunctionCalls[i].split('(')[0]
      var additionalFunctionCall = null
      if(functionName === addFunctionName && stackFrame.functionName === parentFunctionName){
        console.log("add calls " + stackFrame.additionalFunctionCalls[i])
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

          if(this.state.stepProgramClickNumber === 6){

            if(this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName){
                
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
          if(this.state.stepProgramClickNumber === 8){

            if(
              (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              
              ||

              (this.props.stackFrameDataArr.length === 2 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
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
        }
        else{
          /*if(this.state.stepProgramClickNumber === 8){


            if(this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){
                additionalFunctionCall = (
                  <div style={{display: 'flex'}}>
                    <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
                    <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
                  </div>
                )
                additionalFunctionCalls.push(additionalFunctionCall)
              }
          }
          else{*/
            additionalFunctionCall = (
              <h1 className="program-code-hightlight-text-style"> {stackFrame.additionalFunctionCalls[i]}</h1>
            )
            additionalFunctionCalls.push(additionalFunctionCall)
          }
        //}
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

  returnMainFunctionCalls(){
    var functionCalls = []

    var functionName = ""
    if(this.state.stackFrameRunningFunctions.length === 1){
      var tempFuncName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-1].functionName
      for(var i=0; i<this.props.stackFrameDataArr.length; i++){
        if(tempFuncName === this.props.stackFrameDataArr[i].functionName){
          if(
            
            (this.props.stackFrameDataArr.length == 2 &&
            this.props.stackFrameDataArr[1].additionalFunctionCalls.length > 0 && 
            this.props.stackFrameDataArr[1].unsafeFunctions.length > 0 && 
            this.state.stepProgramClickNumber === 5 &&
            this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

            ||

            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName &&
              this.state.stepProgramClickNumber === 7)
            
            ||

            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName &&
              this.state.stepProgramClickNumber === 7)
            
            ||

            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName &&
              this.state.stepProgramClickNumber === 7)

            ||

            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName &&
              this.state.stepProgramClickNumber === 7)

            ||

            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0 && 
              this.state.stepProgramClickNumber === 5)

            ){
            functionName = ""
          }
          else{
            functionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-1].functionName
          }
        }
      }
    }

    for(var i=0; i<this.props.stackFrameDataArr.length; i++){
      var functionCall = null
      if(this.props.stackFrameDataArr[i].functionName === functionName){

        var userInputAsParam = false
        for(var j=0; j<this.props.stackFrameDataArr[i].parameterDetails.length; j++){
          if(this.props.stackFrameDataArr[i].parameterDetails[j].name === "userInput"){
            userInputAsParam = true
            break
          }
        }
        console.log(userInputAsParam)
        if(userInputAsParam === false){

          if(this.state.stepProgramClickNumber === 1){

            /***** Always highlighting first function name and parameters *****/

            functionCall = (
              <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
            )
            functionCalls.push(functionCall)
              
          }
          if(this.state.stepProgramClickNumber === 3){

            /***** Hightling only function name *****/

            if(
              (this.props.stackFrameDataArr.length === 1 && this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)
              
              ||
              
              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
                
              ){  
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
           
          }
          if(this.state.stepProgramClickNumber === 5){

            /***** Highlighting function name and parameter *****/

            if(     
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              
              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionCall = (
                <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }

            /***** Hightling only function name *****/

            else if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** No highlighting *****/

            else if(this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          if(this.state.stepProgramClickNumber === 7){

            /***** Highlighting function name and parameters */
            if(
              (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              
              ){
                functionCall = (
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                )
                functionCalls.push(functionCall)
              }

            /***** Highlighting function name */

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||
              
              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** No highlighting *****/

            if(this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){

                functionCall = (
                  <h1 className="program-code-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                )
                functionCalls.push(functionCall)
              }
          
          
              (this.props.stackFrameDataArr.length === 2 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
          }
          if(this.state.stepProgramClickNumber === 9){

            /***** Highlighting function name */
            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          if(this.state.stepProgramClickNumber === 11){

            /***** Highlighting name *****/

            if(this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName){
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }

            /***** Highlighting name and parameters *****/
            if(this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0){
              functionCall = (
                <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
            }
          }
        }
        else{
          var tempUnmodifiedParams = ""
          this.props.stackFrameDataArr[i].parameterDetails.map(parameter =>{
            if(parameter.name !== "userInput"){
              if(parameter.type === "char" || parameter.type === "char[]"){
                tempUnmodifiedParams += ( '"' + parameter.value + '", ') 
              }
              else{
                tempUnmodifiedParams += (parameter.value + ', ') 
              }            
            }
            
          })
          // func(strcpy)
          if(this.state.stepProgramClickNumber === 1){
            var unmodifiedParams = tempUnmodifiedParams
            functionCall = (
              <div style={{display: 'flex'}}>
                <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}(</h1>
                <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                <h1 className="program-code-hightlight-text-style">);</h1>
              </div>
            )
            functionCalls.push(functionCall)
          }
          // func, func2(strcpy)
          else if(this.state.stepProgramClickNumber === 3){

            if(this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}(</h1>
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
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }

          else if(this.state.stepProgramClickNumber === 5){

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||
              
              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0)

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
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

              ){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}(</h1>
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
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(this.state.stepProgramClickNumber === 7){

            if(this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0){

              functionCall = (
                <h1 className="program-code-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
              )
              functionCalls.push(functionCall)
              
            }

            else{  
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(this.state.stepProgramClickNumber === 9){

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0)
              
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
              
              ){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
          }

          else if(this.state.stepProgramClickNumber === 11){

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
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
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

              ){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall)
            }
            else if(
              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){

              var unmodifiedParams = tempUnmodifiedParams
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}(</h1>
                  <h1 className="program-code-hightlight-text-style">{unmodifiedParams}</h1>
                  <h1 className="program-code-hightlight-argv-text-style">argv[1]</h1>
                  <h1 className="program-code-hightlight-text-style">);</h1>

                </div>
              )
              functionCalls.push(functionCall)
            }
          }
          else if(this.state.stepProgramClickNumber === 15){

            if(this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName){

              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall) 
            }
          }
          else if(this.state.stepProgramClickNumber === 17){
            if
            (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
              this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName){

            
              functionCall = (
                <div style={{display: 'flex'}}>
                  <h1 className="program-code-hightlight-text-style">{this.props.stackFrameDataArr[i].functionName}</h1>
                  <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
                </div>
              )
              functionCalls.push(functionCall) 
            }
          }
        }
      }
      else{
        functionCall = (
          <h1 className="program-code-text-style">{this.props.stackFrameDataArr[i].functionName}({this.props.stackFrameDataArr[i].unmodifiedParams});</h1>
        )
        functionCalls.push(functionCall)
      }
    }

    return functionCalls
  }

  returnFunctions(){

    var functions = []
    var lastFunctionName = ""
    if(this.state.stackFrameRunningFunctions.length !==0){
      lastFunctionName = this.state.stackFrameRunningFunctions[this.state.stackFrameRunningFunctions.length-1].functionName
    }
    for(var i=0; i<this.props.stackFrameDataArr.length; i++){

      if(this.props.stackFrameDataArr[i].functionName === lastFunctionName){

        var functionItem = null

        var userInputAsParam = false
        for(var j=0; j<this.props.stackFrameDataArr[i].parameterDetails.length; j++){
          if(this.props.stackFrameDataArr[i].parameterDetails[j].name === "userInput"){
            userInputAsParam = true
            break
          }
        }

        if(userInputAsParam === true){
          var tempLocalFuncParams = ""
          for(var j=0; j<this.props.stackFrameDataArr[i].parameterDetails.length; j++){
            if(this.props.stackFrameDataArr[i].parameterDetails[j].name !== "userInput"){
              if(this.props.stackFrameDataArr[i].parameterDetails[j].type === "char[]"){
                tempLocalFuncParams += "char " + this.props.stackFrameDataArr[i].parameterDetails[j].name + "[], "
              }
              else{
                tempLocalFuncParams += this.props.stackFrameDataArr[i].parameterDetails[j].type + " " + this.props.stackFrameDataArr[i].parameterDetails[j].name + ", "
              }            
            }
          }

          if(this.state.stepProgramClickNumber === 1){

            /***** Highlighting both function name and argv *****/

            if(
              (this.props.stackFrameDataArr.length === 1 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length > 0)

              ||

              (this.props.stackFrameDataArr.length === 1 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-hightlight-argv-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          else if(this.state.stepProgramClickNumber === 3){
            if(

              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ){

              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-hightlight-argv-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)

            }
            else{

                functionItem = (
                  <div className="program-functions">
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                      <div className="functions-flex">
                        <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                      </div>
                    </div>
                    <div style={{marginLeft: '1%'}}>
                      {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                      {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                      {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                    </div>
                    <h1 className="program-code-text-style">{"}"}</h1>
                  </div>
                )
                functions.push(functionItem)
              }
          }
          else if(this.state.stepProgramClickNumber === 5){

            /***** Highlighting function name */

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0)
              
              ||
              
              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

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
              
              ){

              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-hightlight-argv-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }

            /***** No hightlighting  *****/


            else if(
              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              ){
                functionItem = (
                  <div className="program-functions">
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                      <div className="functions-flex">
                        <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                        <h1 className="program-code-text-style">{"char userInput[]"}</h1>
                        <h1 className="program-code-text-style">)</h1>
                      </div>
                    </div>
                    <div style={{marginLeft: '1%'}}>
                      {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                      {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                      {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                    </div>
                    <h1 className="program-code-text-style">{"}"}</h1>
                  </div>
                )
                functions.push(functionItem)
              }
          }  
          else if(this.state.stepProgramClickNumber === 6){
            /***** No highlighting *****/

            if(this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          else if(this.state.stepProgramClickNumber === 7){

            /***** No highlighting *****/

            if((
              this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              ){ 
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          else if(this.state.stepProgramClickNumber === 8){
            /***** No highlighting *****/

            if
            (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          else if(this.state.stepProgramClickNumber === 9){
            /***** No highlighting *****/
            if(this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName}(</h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">{tempLocalFuncParams}</h1>
                      <h1 className="program-code-text-style">{"char userInput[]"}</h1>
                      <h1 className="program-code-text-style">)</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
        }
        else{

          if(this.state.stepProgramClickNumber === 1){

            /***** Highlighting only function name */

            if((this.props.stackFrameDataArr.length === 1 && this.props.stackFrameDataArr[0].unsafeFunctions.length === 0) ||
               (this.props.stackFrameDataArr.length === 1 && this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)){
              
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }

            /***** Highlighting function name and parameters *****/

            else{
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-hightlight-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 3){

            /***** No highlghting *****/

            if(
              (this.props.stackFrameDataArr.length === 1 && this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0)
              
              ||
              
              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }

            /***** Highlighting function name and parameters *****/
            else{
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-hightlight-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 4){
            
            /***** No highlighting */

            if(
              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){

              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 5){

            /***** No highlghting *****/

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }

            /***** Highlighing function name only *****/
            else if(
              (this.props.stackFrameDataArr.length === 2 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
                
              ){

              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
                
            }


            /***** Highlighing function name and parameters */

            else if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-hightlight-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 6){

            /***** No highlighting */

            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 7){

               
            /***** Highlighting name and parameters *****/
            if(
              (this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[0].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-hightlight-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
            /***** No highlighting *****/
            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 2 && 
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length === 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 8){

            /***** No highlighting *****/
            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 9){

            /***** No highlighting */
            if(
              (this.props.stackFrameDataArr.length === 2 && 
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0)
              
              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
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
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)

              ||

              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 10){

            /***** No highlighting */
            if(
              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }
          }
          if(this.state.stepProgramClickNumber === 11){

            /***** No highlighting */
            if(
              (this.props.stackFrameDataArr.length === 3 &&
                this.props.stackFrameDataArr[0].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
                this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
                this.props.stackFrameDataArr[2].additionalFunctionCalls.length !== 0 && 
                this.props.stackFrameDataArr[2].additionalFunctionCalls[0].split("(")[0] == this.props.stackFrameDataArr[1].functionName)
              ){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
              )
              functions.push(functionItem)
            }

            /***** Highlighting name and parameters *****/
            if(this.props.stackFrameDataArr.length === 3 &&
              this.props.stackFrameDataArr[0].unsafeFunctions.length !== 0 &&
              this.props.stackFrameDataArr[1].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[2].unsafeFunctions.length === 0 &&
              this.props.stackFrameDataArr[1].additionalFunctionCalls.length !== 0 &&
              this.props.stackFrameDataArr[2].additionalFunctionCalls.length === 0){
              functionItem = (
                <div className="program-functions">
                  <div className="functions-flex">
                    <h1 className="program-code-hightlight-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
                    <div className="functions-flex">
                      <h1 className="program-code-hightlight-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
                    </div>
                  </div>
                  <div style={{marginLeft: '1%'}}>
                    {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
                    {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
                    {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
                  </div>
                  <h1 className="program-code-text-style">{"}"}</h1>
                </div>
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
              <h1 className="program-code-text-style">void {this.props.stackFrameDataArr[i].functionName} </h1>
              <div className="functions-flex">
                <h1 className="program-code-text-style">({this.props.stackFrameDataArr[i].localFuncParams}){"{"}</h1>
              </div>
            </div>
            <div style={{marginLeft: '1%'}}>
              {this.returnProgramFunctionsLocalVariables(this.props.stackFrameDataArr[i])}
              {this.returnUnsafeFunctions(this.props.stackFrameDataArr[i])}
              {this.returnProgramFunctionsAdditionalFuncCalls(this.props.stackFrameDataArr[i])}
            </div>
            <h1 className="program-code-text-style">{"}"}</h1>
          </div>
        )
        functions.push(functionItem)
      }


    }


    return functions
  }

  returnMainFunctionTitle(){

    var mainTitle = null

    if(this.state.stepProgramClickNumber === 2 &&
      this.props.stackFrameDataArr.length === 1 && 
      this.props.stackFrameDataArr[0].unsafeFunctions.length === 0){

      mainTitle = (
        <h1 className="program-code-hightlight-pop-text-style">int main(int argc, char* argv[])</h1>
      )
    }

    if(this.state.running === true){
      if(this.state.stackFrameRunningFunctions.length === 0){
        if(this.state.stepProgramClickNumber === 0){
          mainTitle = (
            <div style={{display: 'flex'}}>
              <h1 className="program-code-hightlight-text-style">int main(int argc,</h1>&nbsp;
              <h1 className="program-code-hightlight-argv-text-style">char* argv[]</h1>
              <h1 className="program-code-hightlight-text-style">)</h1>
            </div>
          )
        }
        else{
          mainTitle = (
            <div style={{display: 'flex'}}>
              <h1 className="program-code-hightlight-text-style">int main</h1>
              <h1 className="program-code-text-style">(int argc, char* argv[])</h1>
            </div>
          )
        }
      }
      else{
        mainTitle = (
          <h1 className="program-code-text-style">int main(int argc, char* argv[])</h1>
        )
      }
    }
    else{
      mainTitle = (
        <h1 className="program-code-text-style">int main(int argc, char* argv[])</h1>
      )
    }


   // #00e600
    /*else{
      mainTitle = (
        <div style={{display: 'flex'}}>
          <h1 className="program-code-hightlight-text-style">int main(int argc,</h1>&nbsp;
          <h1 className="program-code-hightlight-argv-text-style">char* argv[]</h1>
          <h1 className="program-code-hightlight-text-style">)</h1>
        </div>
      )
    }*/


    return mainTitle
  }

  returnProgram(){
    return(
      <div>
        <div className="program-code-container-stack">
          {this.state.displaySegFault && (
            <h1 className="seg-fault">Segmentation Fault</h1>
          )}

          <h1 className="seg-fault">{this.state.malExeMessage}</h1>

          <div className="program-name-container">
            <h1 className="program-name-text-style">intro.c</h1>
          </div>
          <div className="code-lines-spacer">
            <h1 className="program-code-text-style">{"#include <stdio.h>"}</h1>
            <h1 className="program-code-text-style">{"#include <string.h>"}</h1>
            {this.returnMainFunctionTitle()}
            <div style={{marginLeft: '1%'}}>
              {this.returnMainFunctionCalls()}
            </div>
            <h1 className="program-code-text-style">{"}"}</h1>
          </div>
          {this.returnFunctions()}
        </div>
        <div style={{height: "1%"}}>&nbsp;</div>
      </div>
    )
  }

  returnMainStackParams(){

    var startAddress = 2882404352
    return(
      <div style={{display: 'flex'}}>
        <div className="stack-frame-param-title-container">
          <div><h1 className="main-stack-element-title-text">Parameters</h1></div>
        </div> 
        <div>
          {this.state.mainStackParams.map((param) => 
            <div className="stack-frame-param-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{param}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((startAddress -= 1).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div> 
          )}
        </div>
      </div>

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

  goBack(){
    this.props.goBack()

    this.setState({
      stackFrameRunningFunctions: [], 
      running:false, 
      displayFinishButton: false,
      stepProgramClickNumber: 0,
      stackFrameDataArray: [],
      malExeMessage: "",
      mainStackOpen: false,
      highlightArgv: false,
    })
  }

  startingShellChecked(event){
    this.setState({
      startingShell: event,
      gettingRootPriviledges: false,
      shutDownOs: false,
      wipeOs: false
    })
  }

  gettingRootPriviledgesChecked(event){
    this.setState({
      gettingRootPriviledges: event,
      startingShell: false,
      shutDownOs: false,
      wipeOs: false
    })
  }

  shutDownOsChecked(event){
    this.setState({
      shutDownOs: event,
      gettingRootPriviledges: false,
      startingShell: false,
      wipeOs: false
    })
  }

  wipeOsChecked(event){
    this.setState({
      wipeOs: event,
      gettingRootPriviledges: false,
      shutDownOs: false,
      startingShell: false
    })
  }

  nopSledDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      An assembly language instruction, considered a no operation, used as padding to compensate for variations in the location the code will be found in. It is represented by \x90. 
    </Tooltip>
  );

  shellcodeDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      A small piece of code that allows a user launch a remote shell on a machine. Code is ran with the priviledges of the current process.
    </Tooltip>
  );

  returnAddressDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The address the function will return to once execution has ended
    </Tooltip>
  );

  returnMaliciousExecutionStatus(){
    if(this.state.maliciousExecution === "Starting"){
      return(
        <div style={{display: 'flex'}}> 
        <h1 className="malicious-execution-starting-text">Starting</h1>
        </div>
      )
    }

    if(this.state.maliciousExecution === "Successful"){
      return(
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <h1 className="malicious-execution-text">Successful in:</h1>
          {this.state.malFuncNameArr.map((name) => 
            <h1 className="malicious-execution-text">{name}</h1>
          )}
        </div>
      )
    }

    if(this.state.maliciousExecution === "Unsuccessful"){
      return(
        <h1 className="malicious-execution-unsuccessful-text">Unsuccessful</h1>
      )
    }

    if(this.state.displayFinishButton){
      return(
      <div style={{display: 'flex'}}>
        <h1 className="malicious-execution-text-running">{this.state.maliciousExecution}</h1>
        <Dots/>         
      </div> 
      )
    }

    if(this.state.running && !this.state.displayFinishButton){
      return(
        <div style={{display: 'flex'}}>
          <h1 className="malicious-execution-text-running">{this.state.maliciousExecution}</h1>
          <Dots/>         
        </div> 
      )
    }
  }

  returnShellcode(){

    if(this.state.startingShell === true){
      return(
        <div className="payload-diagram-text">\xF3\xDD\xA2\xC9\xAA\xD3</div>
      )
    }
    if(this.state.gettingRootPriviledges === true){
      return(
        <div className="payload-diagram-text">\xCC\xB\xBB\xA1\x7B\xC8\xF4\xC6</div>
      )
    }
    if(this.state.shutDownOs === true){
      return(
        <div className="payload-diagram-text">\xFF\D3\x99\xA0</div>
      )
    }
    if(this.state.wipeOs === true){
      return(
        <div className="payload-diagram-text">\FA\xDA\x00\xB0\x77</div>
      )
    }

  }
  

  render() {
    return(
      <div className="main-stack-frame-container">
        <div className="flex">
          <div className="stack-container">
            <button style={{marginTop: '3%'}} class="pushable" onClick={this.goBack}>
              <div class="shadow shadow-height-back-button"></div>
              <div class="edge edge-color-lighter-blue edge-height-back-button"></div>
              <div class="front front-color-white front-padding-back-button">
                <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
              </div>
            </button>
            <div style={{marginLeft: '8%', marginTop: '5%'}}>
              <h1 className="stack-start-address-text">High Memory Address (Bottom of Stack)</h1>
              <div className="stack-container-border">
                <div className="center-div"> 
                  <h1 className="stack-title-text-start">Stack</h1>
                </div>
                {this.state.running && (
                  // Returning main stackframe
                  <div>
                    {!this.state.mainStackOpen && (
                      <button className="stack-frame-open-button" onClick={() => this.setState({mainStackOpen: !this.state.mainStackOpen})}>
                        <div style={{display: 'flex'}}>
                          <div style={{marginLeft: '35%'}}>
                            <h1 className="stack-frame-button-text">main() 0xABCE0000()</h1>
                          </div>
                          <div style={{marginLeft: "18%"}}>
                            <RiArrowDropRightLine size={45} color={"white"}/>
                          </div>
                        </div>
                      </button>
                    )}
                    {this.state.mainStackOpen && (
                      <div>
                        <button className="stack-frame-open-button" onClick={() => this.setState({mainStackOpen: !this.state.mainStackOpen})}>
                          <div style={{display: 'flex'}}>
                            <div style={{marginLeft: '35%'}}>
                              <h1 className="stack-frame-button-text">main() 0xABCE0000()</h1>
                            </div>
                            <div style={{marginLeft: "18%"}}>
                              <RiArrowDropDownLine size={45} color={"white"}/>
                            </div>
                          </div>
                        </button>
                        {this.returnMainStackParams()}
                        <div style={{display: 'flex'}}>
                          <div className="return-address-title-container">
                            <h1 className="main-stack-element-title-text">Return Address</h1>
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
                        </div> 
                        <div style={{display: 'flex'}}>
                          <div className="saved-frame-pointer-title-container">
                            <h1 className="main-stack-element-title-text">Saved Frame Pointer</h1>
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
                      </div>
                    )}
                  </div>

                )}
                <div style={{marginBottom: "1%"}}>
                  {this.returnStackFrames()}
                </div>
                <h1 className="stack-end-address-text">Stack Limit</h1>
              </div>
              <div style={{marginLeft: 2}}>
                <div className="heap-container"> 
                  <h1 className="heap-title-text">Heap</h1>
                </div>

                <div className="data-container"> 
                  <h1 className="stack-title-text">Data</h1>
                </div>

                <div className="code-container"> 
                  <h1 className="stack-title-text">Code</h1>
                </div>
              </div>
              <h1 className="stack-end-address-text">Low Memory Address</h1>
            </div>
          </div>
          <div className="construct-payload-container">
            <div className="center-div">
              <div>
                <div style={{display: 'flex', marginLeft: '15%', marginBottom: '10%'}}>
                <InstructCircle marginLeft={"32%"} number={"4"}/>

                  <div className="construct-payload-title-container">
                    <h1 className="construct-payload-text">Construct Payload</h1>
                  </div>
                </div>
                <div class="scrollmenu">
                  <div className="payload-diagram-container">
                    <div>
                      <div className="payload-diagram-title-text">argv[0]</div>
                      <div className="payload-diagram-intro-container center-div">
                        <div className="payload-diagram-text">./intro</div>
                      </div>
                    </div>
                    {this.state.payloadStateNop && (
                      <div>
                        <div className="payload-diagram-title-text">NOP Sled</div>
                        <div className="payload-diagram-nop-container center-div payload-diagram-nop-border">
                          <div className="payload-diagram-text">{this.state.nopSled}</div>
                        </div>
                      </div>
                    )}
                    {!this.state.payloadStateNop && (
                      <div>
                        <div className="payload-diagram-title-text">NOP Sled</div>
                        <div className="payload-diagram-nop-container center-div">
                          <div className="payload-diagram-text">{this.state.nopSled}</div>
                        </div>
                      </div>
                    )}
                    {this.state.payloadStateShellcode && (
                      <div>
                        <div className="payload-diagram-title-text">Shellcode</div>
                        <div className="payload-diagram-shellcode-container center-div payload-diagram-shellcode-border">
                        {this.returnShellcode()}
                        </div>
                      </div>
                    )}
                    {!this.state.payloadStateShellcode && (
                      <div>
                        <div className="payload-diagram-title-text">Shellcode</div>
                        <div className="payload-diagram-shellcode-container center-div">
                          {this.returnShellcode()}
                        </div>
                      </div>
                    )}
                    {this.state.payloadStateReturnAddress && (
                      <div>
                        <div className="payload-diagram-title-text">Return Address</div>
                        <div className="payload-diagram-return-address-container center-div payload-diagram-return-address-border">
                          <div className="payload-diagram-text">{this.state.returnAddress}</div>
                        </div>
                      </div>
                    )}
                    {!this.state.payloadStateReturnAddress && (
                      <div>
                        <div className="payload-diagram-title-text">Return Address</div>
                        <div className="payload-diagram-return-address-container center-div">
                          <div className="payload-diagram-text">{this.state.returnAddress}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div style={{marginLeft: '8%', marginTop: '10%'}}>
              <Carousel
                activeIndex={this.state.index}
                onSelect={this.handleSelect}
                controls={this.state.showControls}
                wrap={false}
                interval={null}
                indicators={false}
              >
                <Carousel.Item>
                  <div className="construct-payload-part-container">
                    <div style={{display: 'flex'}}>
                      <div className="payload-nop-header-container">
                        <div style={{marginLeft: '25%'}} className="instruction-sub-circle margin-right-5-percent">
                          <div className="instruction-sub-text">4.1</div>
                        </div>
                        <div className="payload-nop-header-title-container">
                          <h1 className="construct-payload-sub-text">Begin with NOP Sled</h1>
                        </div>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={this.nopSledDef}
                        >
                          <BsInfoCircle color={"#1a75ff"} size={20}/>
                        </OverlayTrigger>
                      </div>
                      <div className="payload-next-button-container">
                        <button class="pushable" onClick={this.handleShellCodeClick}>
                          <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
                          <div class="front front-color-white front-padding-back-button">
                            <AiOutlineArrowRight color={"#1a75ff"} size={25}/>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="hints-main-container">
                      <div className="hints-container">
                        <h1 className="hints-title">Hints</h1>
                        <h1 className="hints">* Should only contain \x90</h1>
                        <h1 className="hints">* Consider the space occupied by the local variables</h1>
                        <h1 className="hints">* Return Address and Saved Frame Pointer occupy 4 bytes</h1>
                      </div>
                    </div>
                    {this.state.running && (
                      <h1 style={{marginTop: '5%'}} className="exe-code-text">{this.state.nopSled}</h1>
                    )}
                    {!this.state.running && (
                      <input
                        value={this.state.nopSled}
                        type="text"
                        placeholder={"Start typing...."}
                        onChange={event => this.updateNopSled(event.target.value)}
                        className="user-input"
                      />                    
                    )}
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="construct-payload-part-container">             
                    <div style={{display: 'flex'}}>
                      <div className="payload-back-button-container">
                        <button class="pushable" onClick={this.handleNopClick}>
                          <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
                          <div class="front front-color-white front-padding-back-button">
                            <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
                          </div>
                        </button>
                      </div>
                      <div className="payload-shellcode-header-container">
                        <div style={{marginLeft: '22.5%'}} className="instruction-sub-circle margin-right-5-percent">
                          <div className="instruction-sub-text">4.2</div>
                        </div> 
                        <div style={{marginLeft: "2%", marginTop: "1%", marginRight: '2%'}}>
                          <h1 className="construct-payload-sub-text">Add Shellcode</h1>
                        </div>                  
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={this.shellcodeDef}
                          >
                          <BsInfoCircle color={"#1a75ff"} size={20}/>
                        </OverlayTrigger>
                      </div>
                      <div className="payload-shellcode-next-button-shellcode-container">
                        <button class="pushable" onClick={this.handleReturnAddressClick}>
                          <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
                          <div class="front front-color-white front-padding-back-button">
                            <AiOutlineArrowRight color={"#1a75ff"} size={25}/>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="hints-main-container">
                      <div className="hints-container">
                        <h1 className="hints-title">Note</h1>
                        <h1 className="hints">* Be mindful of the length of the machine code</h1>
                      </div>
                    </div>
                    <div style={{display: 'flex', marginTop: '5%'}}>
                      <div>
                        <div style={{display: 'flex'}}>
                          <Checkbox
                            checked={this.state.startingShell}
                            onChange={(event) => this.startingShellChecked(event.target.checked)}
                            color="primary"
                            />
                          <div style={{marginTop: '3.5%'}}>
                            <div className="shellcode-title-text">Start a remote shell</div>
                          </div>
                        </div>
                        <div className="shellcode-text">\xF3\xDD\xA2\xC9\xAA\xD3</div>

                        <div style={{display: 'flex', marginTop: '5%'}}>
                          <Checkbox
                            checked={this.state.gettingRootPriviledges}
                            onChange={(event) => this.gettingRootPriviledgesChecked(event.target.checked)}
                            color="primary"
                            />
                          <div style={{marginTop: '3.5%'}}>
                            <div className="shellcode-title-text">Get root priviledge</div>
                          </div>
                        </div>
                        <div className="shellcode-text">\xCC\xB2\xBB\xA1\x7B\xC8\xF4\xC6</div>
                      </div>
                      <div style={{marginLeft: '5%'}}>
                        <div style={{display: 'flex'}}>
                          <Checkbox
                            checked={this.state.shutDownOs}
                            onChange={(event) => this.shutDownOsChecked(event.target.checked)}
                            color="primary"
                            />
                          <div  style={{marginTop: '6%'}}>
                            <div className="shellcode-title-text">Shut down OS</div>
                          </div>
                        </div>
                        <div className="shellcode-text">\xFF\D3\x99\xA0</div>
                        <div style={{display: 'flex', marginTop: '8%'}}>
                          <Checkbox
                            checked={this.state.wipeOs}
                            onChange={(event) => this.wipeOsChecked(event.target.checked)}
                            color="primary"
                            />
                          <div style={{marginTop: '6%'}}>
                            <div className="shellcode-title-text">Wipe OS</div>
                          </div>
                        </div>
                        <div className="shellcode-text">\FA\xDA\x00\xB0\x77</div>
                      </div>
                    </div>
                </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="construct-payload-part-container">
                    <div style={{display: 'flex'}}>
                      <div>
                        <button class="pushable" onClick={this.handleShellCodeClick}>
                          <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
                          <div class="front front-color-white front-padding-back-button">
                            <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
                          </div>
                        </button>
                      </div>
                      <div className="payload-return-address-header-container">
                        <div style={{marginLeft: '2%'}} className="instruction-sub-circle margin-right-5-percent">
                          <div className="instruction-sub-text">4.3</div>
                        </div>
                        <div style={{marginLeft: "2%", marginTop: "1%", marginRight: '2%'}}>
                          <h1 className="construct-payload-sub-text">End with repeating Return Address</h1>
                        </div>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={this.returnAddressDef}
                          >
                          <BsInfoCircle color={"#1a75ff"} size={20}/>
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="hints-main-container">
                      <div style={{marginBottom: '8%'}} className="hints-container">
                        <h1 className="hints-title">Hints</h1>
                        <h1 className="hints">* Any address that contains a NOP from our payload</h1>
                        <h1 className="hints">* Little endian based CPU</h1>
                        <h1 className="hints">* Repeating occurances of address increases attack success probability </h1>
                      </div>
                    </div>
                    {this.state.running && (
                      <h1 style={{marginTop: '5%'}} className="exe-code-text">{this.state.returnAddress}</h1>
                    )}
                    {!this.state.running && (
                      <input
                        value={this.state.returnAddress}
                        type="text"
                        placeholder={"Start typing...."}
                        onChange={event => this.updateReturnAddress(event.target.value)}
                        className="user-input"
                      />                  
                    )}
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
          <div className="second-main-container">
            {!this.state.running && (
              <div>
                <div style={{marginLeft: '30%', display: 'flex'}}>
                  <InstructCircle marginLeft={"32%"} number={"5"}/>
                  <button style={{marginLeft: '5%'}} class="pushable" onClick={this.startProgram}>
                    <div class="shadow shadow-height-execution-button"></div>
                    <div class="edge edge-color-green edge-height-execution-button"></div>
                    <div class="front front-color-green front-padding-execution-button front-padding-execution-button-text-size">
                      Start
                    </div>
                  </button>
                </div>
                <div>
                  <div className="stack-smashing-status-container">
                    <div style={{display: 'flex', marginTop: '1%'}}>
                      <div className="stack-smashing-status-title-container">
                        <h1 className="malicious-execution-title-text">Attack Status:</h1>
                      </div>
                      {this.returnMaliciousExecutionStatus()}                   
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.running && !this.state.displayFinishButton && (
              <div>
                <div style={{marginLeft: '30%', display: 'flex'}}>

                  <InstructCircle marginLeft={"32%"} number={"6"}/>
                  <button style={{marginLeft: '5%'}} class="pushable" onClick={this.programNext}>
                    <div class="shadow shadow-height-execution-button"></div>
                    <div class="edge edge-color-blue edge-height-execution-button"></div>
                    <div class="front front-color-blue front-padding-execution-button front-padding-execution-button-text-size">
                      Next
                    </div>
                  </button>
                </div>
                <div>
                  <div className="stack-smashing-status-container">
                    <div style={{display: 'flex', marginTop: '1%'}}>
                      <div className="stack-smashing-status-title-container">
                        <h1 className="malicious-execution-title-text">Attack Status:</h1>
                      </div>
                      {this.returnMaliciousExecutionStatus()}                   
                                
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.state.displayFinishButton && (
              <div>
                <div style={{display: 'flex', marginLeft: '30%'}}>
                  <InstructCircle marginLeft={"32%"} number={"7"}/>
                  <button style={{marginLeft: '5%'}} class="pushable" onClick={this.programFinish}>
                    <div class="shadow shadow-height-execution-button"></div>
                    <div class="edge edge-color-orange edge-height-execution-button"></div>
                    <div class="front front-color-orange front-padding-execution-button front-padding-execution-button-text-size">
                      Finish
                    </div>
                  </button>
                </div>
                <div>
                  <div className="stack-smashing-status-container">
                    <div style={{display: 'flex', marginTop: '1%'}}>
                      <div className="stack-smashing-status-title-container">
                        <h1 className="malicious-execution-title-text">Attack Status:</h1>
                      </div>
                      {this.returnMaliciousExecutionStatus()}                   
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.returnProgram()}
          </div> 
        </div>
      </div>
    );
  }
}

export default Stack;