import React, { Component, useState } from "react";
import "./css/startPage.css";
import "./css/functions.css";
import "./css/stack.css";
import "./css/stackButton.css"

import InstructCircle from "./components/InstructCircle"
import StackFrames from "./components/Stack/StackFrames"
import ConstructPayload from "./components/Stack/ConstructPayload"
import MainStackFrame from "./components/Stack/MainStackFrame"
import BackButton from "./components/Stack/BackButton"
import ExecutionStatusButtons from "./components/Stack/ExecutionStatusButtons"
import DisplayShellcode from "./components/Stack/DisplayShellcode"
import MemorySections from "./components/Stack/MemorySections"

import Program from "./components/Stack/Program"


import "react-awesome-button/dist/styles.css";

/**
 * The stack smashing page of the application.
 */
 
class Stack extends Component {

  constructor(props) {
    super(props)
    this.startProgram = this.startProgram.bind(this)
    this.programNext = this.programNext.bind(this)
    this.programFinish = this.programFinish.bind(this)
    this.returnArgvOne = this.returnArgvOne.bind(this)
    this.openStackFrame = this.openStackFrame.bind(this)
    this.closeStackFrame = this.closeStackFrame.bind(this)
    this.goBack = this.goBack.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleShellCodeClick = this.handleShellCodeClick.bind(this)
    this.handleReturnAddressClick = this.handleReturnAddressClick.bind(this)
    this.handleNopClick = this.handleNopClick.bind(this)

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
                this.setState({segFault: true})
              }
              if(sfpOverFlowLength === 6){
                stackDataArr[k].sfpArr[3] = concatLV[5]
                stackDataArr[k].sfpArr[2] = concatLV[4]
                stackDataArr[k].sfpArr[1] = concatLV[3]
                stackDataArr[k].sfpArr[0] = concatLV[2]
                stackDataArr[k].returnAddressArr[3] = concatLV[1]
                stackDataArr[k].returnAddressArr[2] = concatLV[0]
                this.setState({segFault: true})
              }
              if(sfpOverFlowLength === 7){
                stackDataArr[k].sfpArr[3] = concatLV[6]
                stackDataArr[k].sfpArr[2] = concatLV[5]
                stackDataArr[k].sfpArr[1] = concatLV[4]
                stackDataArr[k].sfpArr[0] = concatLV[3]
                stackDataArr[k].returnAddressArr[3] = concatLV[2]
                stackDataArr[k].returnAddressArr[2] = concatLV[1]
                stackDataArr[k].returnAddressArr[1] = concatLV[0]
                this.setState({segFault: true})
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
                this.setState({segFault: true})
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

                var validReturnAddressArr = []

                var last16Vars = variableArr.slice(-16)
                console.log(last16Vars)
                for(var j=0; j<last16Vars.length; j++){
                  if(last16Vars[j] === "\\x90"){
                    var address = lowBoundAddress - (j+1)
                    validReturnAddressArr.push(address)
                  }
                }
                console.log(validReturnAddressArr)

                if(validReturnAddressArr.includes(newReturnAddressInt)){
                  var tempMalFuncNameArr = this.state.malFuncNameArr
                  tempMalFuncNameArr.push(stackDataArr[k].functionName)
                  var uniqueNames = [...new Set(tempMalFuncNameArr)];
                  this.setState({malFuncNameArr: uniqueNames})
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

                this.setState({segFault: true})
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

    if(this.state.malFuncNameArr.length !== 0 && this.state.segFault === false){
      this.setState({maliciousExecution: "Successful", maliciousExecutionBool: true})
    }
    else if(this.state.segFault === true){
      this.setState({maliciousExecution: "Segmentation Fault"})
    }
    else{
      this.setState({maliciousExecution: "Unsuccessful"})
    }
    setTimeout(() => { 
      if(this.state.maliciousExecution !== "Running"){
        this.setState({maliciousExecution: "Starting"}) 
      }
    }, 12000);
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

  render() {
    return(
      <div className="main-stack-frame-container">
        <div className="flex">
          <div className="stack-container">
            <BackButton goBack={this.goBack}/>
            <div style={{marginLeft: '8%', marginTop: '5%'}}>
              <h1 className="stack-start-address-text">High Memory Address (Bottom of Stack)</h1>
              <div className="stack-container-border">
                <div className="center-div"> 
                  <h1 className="stack-title-text-start">Stack</h1>
                </div>
                {this.state.running && (
                  // Returning main stackframe
                  <MainStackFrame
                    mainStackOpen={this.state.mainStackOpen}
                    setMainStackOpen={() => this.setState({mainStackOpen: !this.state.mainStackOpen})}
                    mainStackParams={this.state.mainStackParams}
                    endParametersAddress={this.state.endParametersAddress}
                  />

                )}
                <div style={{marginBottom: "1%"}}>
                  <StackFrames 
                    stackFrameRunningFunctions={this.state.stackFrameRunningFunctions} 
                    endParametersAddress={this.state.endParametersAddress}
                    closeStackFrame={(val) => this.closeStackFrame(val)}
                    openStackFrame={(val) => this.openStackFrame(val)}
                  />
                </div>
                <h1 className="stack-end-address-text">Stack Limit</h1>
              </div>
             <MemorySections/>
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
                          <DisplayShellcode
                            startingShell={this.state.startingShell}
                            gettingRootPriviledges={this.state.gettingRootPriviledges}
                            shutDownOs={this.state.shutDownOs}
                            wipeOs={this.state.wipeOs}
                          />
                        </div>
                      </div>
                    )}
                    {!this.state.payloadStateShellcode && (
                      <div>
                        <div className="payload-diagram-title-text">Shellcode</div>
                        <div className="payload-diagram-shellcode-container center-div">
                          <DisplayShellcode
                            startingShell={this.state.startingShell}
                            gettingRootPriviledges={this.state.gettingRootPriviledges}
                            shutDownOs={this.state.shutDownOs}
                            wipeOs={this.state.wipeOs}
                          />
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
              <ConstructPayload 
                handleShellCodeClick={this.handleShellCodeClick}
                handleNopClick={this.handleNopClick}
                handleReturnAddressClick={this.handleReturnAddressClick}
                index={this.state.index}
                handleSelect={this.handleSelect}
                controls={this.state.showControls}
                running={this.state.running}
                nopSled={this.state.nopSled}
                updateNopSled={(val) => this.setState({nopSled: val})}
                startingShell={this.state.startingShell}
                startingShellChecked={(val)=> this.startingShellChecked(val)}
                gettingRootPriviledges={this.state.gettingRootPriviledges}
                gettingRootPriviledgesChecked={(val) => this.gettingRootPriviledgesChecked(val)}
                shutDownOs={this.state.shutDownOs}
                shutDownOsChecked={(val) => this.shutDownOsChecked(val)}
                wipeOs={this.state.wipeOs}
                wipeOsChecked={(val) => this.wipeOsChecked(val)}
                returnAddress={this.state.returnAddress}
                updateReturnAddress={(val) => this.setState({returnAddress: val})}
              />
            </div>
          </div>
          <div className="second-main-container">
            <ExecutionStatusButtons
              running={this.state.running}
              displayFinishButton={this.state.displayFinishButton}
              maliciousExecution={this.state.maliciousExecution}
              malFuncNameArr={this.state.malFuncNameArr}
              startProgram={() => this.startProgram()}
              programNext={() => this.programNext()}
              programFinish={() => this.programFinish()}
            />
            <Program
              malExeMessage={this.state.malExeMessage}
              stepProgramClickNumber={this.state.stepProgramClickNumber}
              stackFrameDataArr={this.props.stackFrameDataArr}
              running={this.state.running}
              stackFrameRunningFunctions={this.state.stackFrameRunningFunctions}
            />
          </div> 
        </div>
      </div>
    );
  }
}

export default Stack;