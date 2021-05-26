import React, { Component, useState } from "react";
import "./css/startPage.css";
import "./css/functions.css";
import styled, { keyframes } from "styled-components";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import { GiHazardSign } from "react-icons/gi";
import { BiUserPlus } from "react-icons/bi";



/**
 * The functions page of the application.
 */

 
class Functions extends Component {

  constructor(props) {
    super(props)
    this.addParameter = this.addParameter.bind(this)
    this.addFunctionToProgram = this.addFunctionToProgram.bind(this)
    this.addUnsafeFunctionToProgram = this.addUnsafeFunctionToProgram.bind(this)
    this.displayAddUnsafeFunction = this.displayAddUnsafeFunction.bind(this)
    this.displayAdditionalFunctionCallOptions = this.displayAdditionalFunctionCallOptions.bind(this)
    this.addLocalVariable = this.addLocalVariable.bind(this)
    this.addUserInput = this.addUserInput.bind(this)
    this.removeUserInput = this.removeUserInput.bind(this)
    this.updateFunctionName = this.updateFunctionName.bind(this)
    this.updateParameterName = this.updateParameterName.bind(this)
    this.updateParameterValue = this.updateParameterValue.bind(this)
    this.updateLocalVariableName = this.updateLocalVariableName.bind(this)
    this.updateLocalVariableType = this.updateLocalVariableType.bind(this)
    this.updateLocalVariableValue = this.updateLocalVariableValue.bind(this)
    this.updateUserInput = this.updateUserInput.bind(this)
    this.updateParameterType = this.updateParameterType.bind(this)
    this.returnFunctionForm = this.returnFunctionForm.bind(this)
    this.returnMainFunctionCalls = this.returnMainFunctionCalls.bind(this)
    this.returnFunctions = this.returnFunctions.bind(this)
    this.returnParameters = this.returnParameters.bind(this)
    this.returnLocalVariables = this.returnLocalVariables.bind(this)
    this.returnUnsafeFunctions = this.returnUnsafeFunctions.bind(this)
    this.returAdditionalFunctionCalls = this.returAdditionalFunctionCalls.bind(this)
    this.returnUnsafeFunctionsMain = this.returnUnsafeFunctionsMain.bind(this)
    this.returnProgram = this.returnProgram.bind(this)
    this.returnProgramFunctionsLocalVariables = this.returnProgramFunctionsLocalVariables.bind(this)
    this.returnProgramFunctionsAdditionalFuncCalls = this.returnProgramFunctionsAdditionalFuncCalls.bind(this)
    this.changeStrcpyParam1 = this.changeStrcpyParam1.bind(this)
    this.changeStrcpyParam2 = this.changeStrcpyParam2.bind(this)
    this.changeLocalVariableType = this.changeLocalVariableType.bind(this)
    this.addFunctionCall = this.addFunctionCall.bind(this)
    this.isInt = this.isInt.bind(this)
    this.onClick = this.onClick.bind(this)
    this.clearProgram = this.clearProgram.bind(this)


    this.state = {
      displaySegFault: false,
      displayAddFrame: false,
      displayAdditionalFunctionCalls: false,
      running: false,
      runningDots:false,
      programPaused: false,
      parameters: [],
      localVariables: [],
      localVariablesStack: [],
      SFPstack: [],
      returnAddressStack: [],
      parametersStack: [],
      stackFrameDataArray: [],
      stackFrameRunningFunctions: [],
      parameterName: "",
      parameterType: "char",
      parameterValue: "",
      localVariableName: "",
      localVariableType: "char",
      localVariableValue: "",
      currentStackFrame: "",
      currentStackFrameId: "",
      functionName: "",
      userInput: "",
      userInputBool: false,
      stepOneBool: false,
      stepTwoBool: false,
      maliciousPayload: false,
      maliciousExecution: false,
      segFault: false,
      parameterError: "",
      parameterNameError: false,
      localVariableNameError: false,
      localVariableError: "",
      numOfFunctions: 0,
      userInputBool: false,
      functionType: "strcpy",
      addUnsafeFunctionBool: false,
      strcpyParam1: "",
      strcpyParam2: "",
      unsafeFunctions: [],
      additionalFunctionCallName: "",
      additionalFunctionCalls: [],
      strcpyParamError: "",
      functionNameError: "",
      addFunctionError: "",
      width: window.innerWidth
    }
  }

  addParameter(){

    var parameterName = this.state.parameterName

    // Check if maximum number of parameters is exceeded
    if(this.state.parameters.length > 2){
      this.setState({parameterError: "Maximum of 3 parameters allowed"})
      return
    }

    //Check if input is a single character
    if(this.state.parameterType === "char" && this.state.parameterValue.length > 1){
      this.setState({parameterError: "char contains only 1 character"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }

    // Check if input is an integer
    if(this.state.parameterType === "int" && isNaN(this.state.parameterValue)){
      this.setState({parameterError: "That is not an integer"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }

    // Check if input is a float
    if(this.state.parameterType === "float" && isNaN(this.state.parameterValue)){
      this.setState({parameterError: "That is not a float"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }


    // Check if input is empty
    if(this.state.parameterName === ""){
      this.setState({parameterError: "Please enter a parameter name"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }
    if(this.state.parameterValue === ""){
      this.setState({parameterError: "Please enter a value"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }

    // Check if name is already used
    for(var i=0; i<this.state.parameters.length; i++){
      if(this.state.parameters[i].name === this.state.parameterName){
        this.setState({parameterError: "That name is aleady being used"})
        setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
        return
      }
    }

    for(var i=0; i<this.state.localVariables.length; i++){
      if(this.state.localVariables[i].name === this.state.parameterName){
        this.setState({parameterError: "That name is aleady being used"})
        setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
        return
      }
    }

    // Check if name equals "userinput"
    if(this.state.parameterName === "userInput"){
      this.setState({parameterError: "Cannot have 'userInput' as a parameter name"})
      setTimeout(() => { this.setState({parameterError: ""}) }, 10000);
      return
    }

    var parameter = {
      name: parameterName,
      type: this.state.parameterType,
      value: this.state.parameterValue
    }
    var joined = this.state.parameters
    joined.push(parameter)

    this.setState({
      parameters: joined, 
      parameterName: "", 
      parameterNameError: false, 
      parameterError: "",
      parameterValue: "",
      parameterType: "char"
    })

  }

  isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
  }

  addLocalVariable(){

    var localVariableValue = this.state.localVariableValue

    // Check if maximum number of local variables is exceeded
    if(this.state.localVariables.length > 2){
      this.setState({localVariableError: "Maximum of 3 parameters allowed"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    //Check if input is a single character
    if(this.state.localVariableType === "char" && this.state.localVariableValue.length > 1){
      this.setState({localVariableError: "char contains only 1 character"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    // Check if input is an integer
    if(this.state.localVariableType === "int" && isNaN(this.state.localVariableValue)){
      this.setState({localVariableError: "That is not an integer"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    //Workaround
    if(this.state.localVariableType === "int"){
      localVariableValue = parseInt(this.state.localVariableValue)
    }

    // Check if input is a float
    if(this.state.localVariableType === "float" && isNaN(this.state.localVariableValue)){
      this.setState({localVariableError: "That is not a float"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }
    
    //Workaround
    if(this.state.localVariableType === "float"){
      localVariableValue = Number(this.state.localVariableValue).toFixed(2)
    }

    // Check if input is empty
    if(this.state.localVariableName === ""){
      this.setState({localVariableError: "Please enter a name"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    if(this.state.localVariableValue === ""){
      this.setState({localVariableError: "Please enter a value"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    // Check if name is already used
    for(var i=0; i<this.state.parameters.length; i++){
      if(this.state.parameters[i].name === this.state.localVariableName){
        this.setState({localVariableError: "That name is aleady being used"})
        setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
        return
      }
    }

    for(var i=0; i<this.state.localVariables.length; i++){
      if(this.state.localVariables[i].name === this.state.localVariableName){
        this.setState({localVariableError: "That name is aleady being used"})
        setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
        return
      }
    }

    // Check if name equals "userinput"
    if(this.state.localVariableName === "userInput"){
      this.setState({localVariableError: "Cannot have 'userInput' as a local variable name"})
      setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
      return
    }

    var localVariable = {
      name: this.state.localVariableName,
      type: this.state.localVariableType,
      value: localVariableValue
    }
    var joined = this.state.localVariables.concat(localVariable)
    this.setState({
      localVariables: joined, 
      localVariableName: "", 
      localVariableNameError: false,
      localVariableError: "",
      localVariableValue: "",
      localVariableType: "char"
     })

  }

  addFunctionCall(){

    var functionCall = ""

    for(var i=0; i<this.state.stackFrameDataArray.length; i++){
      if(this.state.stackFrameDataArray[i].functionName === this.state.additionalFunctionCallName){
        var parameters = ""
        this.state.stackFrameDataArray[i].parameterDetails.map((param) => {

          // if user input was included as an original parameter, 
          // we need to add it to the params of the current function

          if(param.name === "userInput"){
            parameters += "userInput, "
            var parameter = {
              name: "userInput",
              type: "char[]",
              value: "",
            }
            var tempParams = this.state.parameters.concat(parameter)
            this.setState({parameters: tempParams})
          }
          else if(param.type === "char"){
            parameters += '"' + param.value + '", '
          }
          else{
            parameters += param.value + ", "
          }
        })
        var newParams = parameters.slice(0, -2)
        functionCall = this.state.stackFrameDataArray[i].functionName + "(" + newParams + ");"
        break
      }
    }

    var newFunctionCall = this.state.additionalFunctionCalls.concat(functionCall)
    this.setState({additionalFunctionCalls: newFunctionCall, displayAdditionalFunctionCalls: false})

  }

  addUserInput(){
    var userInputParam = {
      name: "userInput",
      type: "char[]",
      value: "",
    }
    var newParams = this.state.parameters.concat(userInputParam)
    this.setState({
      parameters: newParams, 
      userInputBool: true, 
      displayAdditionalFunctionCalls:false, 
      addUnsafeFunctionBool: false
    })

  }

  removeUserInput(){

    var newParameters = []

    for(var i=0; i<this.state.parameters.length; i++){
      if(this.state.parameters[i].name === "userInput"){
        var firstHalf = this.state.parameters.splice(0,i)
        var secondHalf = this.state.parameters.splice(i+1,this.state.parameters.length)
        newParameters = firstHalf.concat(secondHalf)
        this.setState({parameters: newParameters, userInputBool: false})
        break;
      }
    }
  }

  addFunctionToProgram(){

    /***** Error checking *****/

    if(this.state.functionName === ""){
      this.setState({functionNameError: "Please enter a name"})
      setTimeout(() => { this.setState({functionNameError: ""}) }, 5000);
      return
    }

    if(this.state.stackFrameDataArray.length > 2){
      this.setState({functionNameError: "Maximum of 3 functions allowed"})
      setTimeout(() => { this.setState({functionNameError: ""}) }, 5000);
      return
    }

    for(var i=0; i<this.state.stackFrameDataArray.length; i++){
      if(this.state.stackFrameDataArray[i].functionName === this.state.functionName){
        this.setState({functionNameError: "Cannot have multiple functions with the same name"})
        setTimeout(() => { this.setState({functionNameError: ""}) }, 10000);
        return
      }
    }

    var functionNameArr = this.state.functionName.split(" ")
    if(functionNameArr.length > 1){
      this.setState({functionNameError: "Function names cannot contain spaces"})
      setTimeout(() => { this.setState({functionNameError: ""}) }, 10000);
      return
    }

    var numOfFunctions = this.state.numOfFunctions + 1
    this.setState({numOfFunctions: numOfFunctions})

    var parameters = ""
    var localVariables = ""
    var tempUnmodifiedParams = ""
    var tempLocalFuncParams = ""
    var parameterDetailsArr = []

    var paramArr = []


    this.state.parameters.map(parameter =>{
      parameters += parameter.value

      var param = {
        name: parameter.name,
        type: parameter.type,
        value: parameter.value
      }

      /***** Formatting parameters *****/
      var paramValArr = parameter.value.split("")
      paramValArr.push("\\0")
      paramArr = paramArr.concat(paramValArr)


      parameterDetailsArr.push(param)

      // local func params are used in local functions

      if(parameter.name === "userInput"){
        tempLocalFuncParams += "char userInput[], " 
      }
      else if(parameter.type === "char[]"){
        tempLocalFuncParams += "char " + parameter.name + "[], "
      }
      else{
        tempLocalFuncParams += parameter.type + " " + parameter.name + ", "
      }

      // unmodified params are used in main

    
      if(parameter.name === "userInput"){
        tempUnmodifiedParams += "argv[1], " 
      }
      else if(parameter.type === "char" || parameter.type === "char[]"){
        tempUnmodifiedParams += ( '"' + parameter.value + '", ') 
      }
      else{
        tempUnmodifiedParams += (parameter.value + ', ') 
      }
    })

    var parameterArr = parameters.match(/.{1,4}/g)
    var unmodifiedParams = tempUnmodifiedParams.slice(0, -2)
    var localFuncParams = tempLocalFuncParams.slice(0, -2)
    var mainLocalVariables = []

    var variableArr = []

    this.state.localVariables.map((variable) =>{
      localVariables += variable.value
      var variable = {
        name: variable.name,
        type: variable.type,
        value: variable.value
      }

      /***** Formatting local variables *****/
      var variableValArr = variable.value.split("")
      variableValArr.push("\\0")
      variableArr = variableArr.concat(variableValArr)

      mainLocalVariables.push(variable)
    })


    paramArr.reverse()
    variableArr.reverse()


    var LVarr = localVariables.match(/.{1,4}/g)

    var stackFrameSize = this.state.stackFrameDataArray.length
    var decimalAddress = 2882404340 - (stackFrameSize * 25)
    var hexAddress = decimalAddress.toString(16)

    var savedFramePointer = []
    var sfpHexAddress = (decimalAddress - 5).toString(16)
    var result = sfpHexAddress.match(new RegExp('.{1,' + Math.floor(sfpHexAddress.length / 4) + '}', 'g'))

    while(result.length > 4) {
      result[result.length - 2] += result[result.length - 1]
      result.splice(result.length - 1, 1)
    }

    for(var i=0; i<result.length; i++){
      var temp = "\\x" + result[i].toUpperCase()
      result[i] = temp
    }

    var returnAddressArr = ["\\xAB", "\\xCE", "\\x00", "\\x00"]
    var sfpArr = ["\\x00", "\\x00", "\\x00", "\\x00"]

    savedFramePointer = result

    var stackFrame = {
      functionName: this.state.functionName,
      parameters: parameterArr,
      additionalFunctionCalls: this.state.additionalFunctionCalls,
      unmodifiedParams: unmodifiedParams,
      localFuncParams: localFuncParams,
      address: hexAddress,
      mainLocalVariables: mainLocalVariables,
      localVariables: LVarr,
      localVariablesLetterArray: variableArr,
      parametersLetterArray: paramArr,
      savedFramePointer: savedFramePointer,
      disableButton: false,
      unsafeFunctions: this.state.unsafeFunctions,
      parameterDetails: parameterDetailsArr,
      displayStackFrame: false,
      returnAddressArr: returnAddressArr,
      sfpArr: sfpArr,
      strcpy: false,
    }

    var joined = this.state.stackFrameDataArray.concat(stackFrame)
    this.setState({ 
      stackFrameDataArray: joined, 
      functionName: "",
      parameters: [],
      parameterType: "char",
      parameterName: "",
      localVariables: [],
      localVariableName: "",
      localVariableType: "char",
      displayAddFrame: false,
      addFunctionError: "",
      functionNameError: "",
      parameterError: "",
      localVariableError: false,
      unsafeFunctions: [],
      userInputBool: false,
      additionalFunctionCalls: [],
      additionalFunctionCallName: ""
    })
    
  }

  clearProgram(){
    this.setState({stackFrameDataArray: []})
  }


  updateParameterName(event){
    this.setState({parameterName: event.target.value})
  }

  updateParameterValue(event){
    this.setState({parameterValue: event.target.value})
  }

  updateLocalVariableName(event){
    this.setState({localVariableName: event.target.value})
  }

  updateLocalVariableValue(event){
    this.setState({localVariableValue: event.target.value})
  }

  updateFunctionName(event){
    this.setState({functionName: event.target.value})
  }

  updateParameterType(event){
    this.setState({parameterType: event.target.value})
  }

  updateLocalVariableType(event){
    this.setState({localVariableType: event.target.value})
  }

  updateUserInput(event, address){
    var tempArr = this.state.stackFrameRunningFunctions 
    for(var i=0; i<tempArr.length; i++){
      if(tempArr[i].address === address){
        tempArr[i].userInput = event
        break
      }
    }
    this.setState({stackFrameRunningFunctions: tempArr})
  }

  changeParameterType(type){
    this.setState({parameterType: type.value})
  }

  changeFunctionType(type){
    this.setState({functionType: type.value})
  }

  changeLocalVariableType(type){
    this.setState({localVariableType: type.value})
  }

  changeStrcpyParam1(type){
    this.setState({strcpyParam1: type.value})
  }

  changeStrcpyParam2(type){
    this.setState({strcpyParam2: type.value})
  }

  changeAdditionalFunctionCallName(type){
    this.setState({additionalFunctionCallName: type.value})
  }
  
  displayAdditionalFunctionCallOptions(){

    if(this.state.additionalFunctionCalls.length > 0){
      this.setState({functionNameError: "Only 1 additional function call allowed"})
      setTimeout(() => { this.setState({functionNameError: ""}) }, 8000);
      return
    }

    this.setState({displayAdditionalFunctionCalls: !this.state.displayAdditionalFunctionCalls, addUnsafeFunctionBool: false})
  }

  displayAddUnsafeFunction(){

    if(this.state.unsafeFunctions.length > 0){
      this.setState({functionNameError: "Only 1 unsafe function allowed"})
      setTimeout(() => { this.setState({functionNameError: ""}) }, 8000);
      return
    }

    this.setState({
      addUnsafeFunctionBool: !this.state.addUnsafeFunctionBool, 
      displayAdditionalFunctionCalls: false,
      strcpyParamError: "",
    })
  }

  addUnsafeFunctionToProgram(){

    if(this.state.strcpyParam1 === this.state.strcpyParam2){
      this.setState({strcpyParamError: "parameters must be different"})
      return
    }

    var funcParams = {
      param1Name: this.state.strcpyParam1,
      param2Name: this.state.strcpyParam2,
    }

    var unsafeFunctions = this.state.unsafeFunctions.concat(funcParams)
    this.setState({unsafeFunctions:unsafeFunctions, addUnsafeFunctionBool: false})
  }

  returnParameters(){

    var parameters = ""
    this.state.parameters.map((parameter) =>{
      if(parameter.type === "char[]"){
        parameters += " char" + " " +  parameter.name + "[],"
      }
      else{
        parameters += " " + parameter.type + " " +  parameter.name + ","
      }
    }
    )
    var removeComma = parameters.slice(0, -1)
    var tempParameters = "(" + removeComma + "){"

    return(
      <h1 className="code-input-text-style">{tempParameters} </h1>
    )
  }

  returnLocalVariables(){

    var displayLV = []

    this.state.localVariables.map((variable) =>{
      if(variable.type === "char[]" && variable.value === "userInput"){
        displayLV.push(
          <h1 className="code-input-text-style">{variable.type} {variable.name} = {variable.value}; </h1>
        )
      }
      else if(variable.type === "char[]"){
        displayLV.push(
          <h1 className="code-input-text-style">char {variable.name}[] = "{variable.value}"; </h1>
        )
      }
      else if(variable.type === "int" || variable.type === "float"){
        displayLV.push(
          <h1 className="code-input-text-style">{variable.type} {variable.name} = {variable.value}; </h1>
        )
      }
      else{
        displayLV.push(
          <h1 className="code-input-text-style">{variable.type} {variable.name} = "{variable.value}"; </h1>
        )
      }
    }
    )

    return displayLV
  }

  returnUnsafeFunctions(){
    return(
      this.state.unsafeFunctions.map((func) =>
        <h1 className="code-input-text-style"> strcpy({func.param1Name}, {func.param2Name});</h1>
      )
    )
  }

  returAdditionalFunctionCalls(){
    return(
      this.state.additionalFunctionCalls.map((func) =>
        <h1 className="code-input-text-style"> {func}</h1>
      )
    )
  }

  returnAdditionalFunctionCallParams(){

    var params = []
    this.state.stackFrameDataArray.map((frame) => {
      if(frame.functionName === this.state.additionalFunctionCallName){
          frame.parameterDetails.map((parameter) =>{
            var param = (
              <div style = {{display: 'flex', backgroundColor: 'blueviolet', marginTop: 7.5, borderRadius:5}}>
                <h1 style={{fontSize:14, color: 'white', fontWeight: 600, marginLeft: 5, marginTop: 6}}>{parameter.type} {parameter.name}:</h1>
                <input
                  value={parameter.value}
                  type="text"
                  placeholder="Value"
                  onChange={this.updateFunctionName}
                  style={{height:32, width:80, borderRadius:5, marginLeft: 15}}
                />
              </div>
            )
            params.push(param)
          })
      }
    })

    return params
  }

  returnParamVariableInput(){

    const parameterOptions = ["char", "int", "float", "char[]"]
    const localVariableOptions = ["char", "int", "float", "char[]"]
    const defaultOption = parameterOptions[0]
    const functionOptions = ["strcpy"]
    const functionDefault = functionOptions[0]

    var strcpyParams1 = []
    var strcpyParams2 = []
    this.state.parameters.map((parameter) => {
      if(parameter.type === "char[]"){
        strcpyParams2.push(parameter.name)
      } 
    })
    this.state.localVariables.map((variable) => {
      if(variable.type === "char[]"){
        strcpyParams2.push(variable.name)
        strcpyParams1.push(variable.name)
      }
    })
    var strcpyDefault = "Select..."

    var functionNames = []
    this.state.stackFrameDataArray.map((frame) =>
      functionNames.push(frame.functionName)
    )
    var funcNameDefault = "Select..."

    return(
      <div className="add-to-program-spacer">
        <div className="function-name-container">
          <div>
          <input
            value={this.state.functionName}
            type="text"
            id="inputID"
            onChange={this.updateFunctionName}
            className="function-name-input-style"
          />
          <h1 className="param-lv-title-style">Function Name</h1>
          </div>
        </div>

        <div className="param-lv-input-container">
          <div className="code-input-title-container">
            <h1 className="code-input-parameter-title-style">Parameter</h1>
          </div>
          <div>
            <input
              value={this.state.parameterName}
              type="text"
              id="inputID"
              onChange={this.updateParameterName}
              className="function-name-input-style"
            />
            <h1 style={{marginLeft:20}} className="param-lv-title-style">Name</h1>
            <div className="height-10">
              {this.state.parameterNameError && (
                <h1 className="error-input-text-style">Enter a parameter name</h1>
              )}
            </div>
          </div>

          <div className="dropdown-params-lv">
            <Dropdown className='dropdown' options={parameterOptions} onChange={(type) => this.changeParameterType(type)} value={this.state.parameterType} />
          </div>

          <div>
            <input
              value={this.state.parameterValue}
              type="text"
              id="inputID"
              onChange={this.updateParameterValue}
              className="function-value-input-style"
            />
            <h1 style={{marginLeft:"8%"}} className="param-lv-title-style">Value</h1>
          </div>
          <div>
            <button className="add-value-button-style" onClick={this.addParameter}>Add Parameter</button>
          </div> 
        </div>

        <h1 className="error-input-text-style">{this.state.parameterError}</h1>
      
        <div className="functions-flex">
          <div className="code-input-title-container">
            <h1 className="code-input-variable-title-style">Local Variable</h1>
          </div>
          <div>
            <input
              value={this.state.localVariableName}
              type="text"
              id="inputID"
              onChange={this.updateLocalVariableName}
              className="function-name-input-style"
            />
            <h1 style={{marginLeft:20}} className="param-lv-title-style">Name</h1>
            <div className="height-10">
              {this.state.localVariableNameError && (
                <h1 className="error-input-text-style">Enter a variable name</h1>
              )}
            </div>
          </div>

          <div className="dropdown-params-lv">
            <Dropdown options={localVariableOptions} onChange={(type) => this.changeLocalVariableType(type)} value={this.state.localVariableType} />
          </div>

          <div>
            <input
              value={this.state.localVariableValue}
              type="text"
              id="inputID"
              onChange={this.updateLocalVariableValue}
              className="function-value-input-style"
            />
            <h1 style={{marginLeft:"8%"}} className="param-lv-title-style">Value</h1>
          </div>

          <div>
            <button className="add-value-button-style" onClick={this.addLocalVariable}>Add Variable</button>
          </div>

        </div>
        <h1 className="error-input-text-style">{this.state.functionNameError}</h1>
        <h1 className="error-input-text-style">{this.state.localVariableError}</h1>
      </div>
    )
  }

  returnFunctionForm(){
    const parameterOptions = ["char", "int", "float", "char[]"]
    const localVariableOptions = ["char", "int", "float", "char[]"]
    const defaultOption = parameterOptions[0]
    const functionOptions = ["strcpy"]
    const functionDefault = functionOptions[0]

    var strcpyParams1 = []
    var strcpyParams2 = []
    this.state.parameters.map((parameter) => {
      if(parameter.type === "char[]"){
        strcpyParams2.push(parameter.name)
      } 
    })
    this.state.localVariables.map((variable) => {
      if(variable.type === "char[]"){
        strcpyParams2.push(variable.name)
        strcpyParams1.push(variable.name)
      }
    })
    var strcpyDefault = "Select..."

    var functionNames = []
    this.state.stackFrameDataArray.map((frame) =>
      functionNames.push(frame.functionName)
    )
    var funcNameDefault = "Select..."

    return(
      <div>
        {this.state.addUnsafeFunctionBool && (
          <div className="unsafe-functions-container">
            <div className="strcpy-param-dropdown-name-container">
              <Dropdown options={functionOptions} onChange={(type) => this.changeFunctionType(type)} value={functionDefault} />
              <h1 className="strcpy-param-title-style">Name</h1>
            </div>
            <div>
              <div className="strcpy-param-dropdown-container">
                <Dropdown options={strcpyParams1} onChange={(type) => this.changeStrcpyParam1(type)} value={strcpyDefault} />
              </div> 
              <h1 className="strcpy-param-title-style">Destination</h1>
            </div>
            <div style={{marginLeft: 30}}> 
              <div className="strcpy-param-dropdown-container">
                <Dropdown options={strcpyParams2} onChange={(type) => this.changeStrcpyParam2(type)} value={strcpyDefault} />
              </div> 
              <h1 className="strcpy-param-title-style">Source</h1>
            </div>
            <div className="add-unsafe-func-button-container"> 
              <button className="add-unsafe-func-button" onClick={this.addUnsafeFunctionToProgram}>
                <h1 className="add-unsafe-func-button-text">Add function</h1>
              </button> 
            </div>  
            <h1 className="error-input-text-style">{this.state.strcpyParamError}</h1>
          </div>  
        )}
        {this.state.displayAdditionalFunctionCalls && (
          <div className="additional-func-call-container">
            <div className="additional-functions-dropdown">
              <Dropdown options={functionNames} onChange={(type) => this.changeAdditionalFunctionCallName(type)} value={strcpyDefault} />
              <h1 className="strcpy-param-title-style">Function Name</h1>
            </div> 
            <div className="additional-func-param-container">
              {/*this.returnAdditionalFunctionCallParams()*/}
            </div>
            <button className="add-additional-func-call-button" onClick={() => this.addFunctionCall()}>
              <h1 className="add-additional-func-call-button-text">Add Function Call</h1>
            </button>
          </div>
        )}
        <div className="functions-flex">
          <div className="code-input">
            <div className="code-input-shift">
              <div className="functions-flex">
                <h1 className="code-input-style">void {this.state.functionName}</h1>
                <div className="functions-flex">
                  {this.returnParameters()}
                </div>
              </div>
              <div style={{marginLeft: '1%'}}>
                {this.returnLocalVariables()}
                {this.returnUnsafeFunctions()}
                {this.returAdditionalFunctionCalls()}
              </div>
              <h1 className="code-input-style">{"}"}</h1>
            </div>
          </div>
          <div style={{marginLeft: "3%"}}>
            <div style={{marginLeft: "10%"}}>

              <div className="functions-input-container">
                  <button className="code-unsafe-addon-button-style"  onClick={this.displayAddUnsafeFunction}>
                    <div style = {{display:'flex'}}>
                      <GiHazardSign color={"#1a75ff"} size={20} style={{marginTop:"2%", marginRight: "5%", marginLeft:"0.5%"}}/>
                      <h1 className="code-addon-button-text-style">Unsafe Functions</h1>
                    </div>           
                  </button> 
              </div>
              {!this.state.userInputBool && (
                <button button className="code-addon-button-style" onClick={this.addUserInput}>
                  <div style = {{display:'flex'}}>
                    <BiUserPlus color={"#1a75ff"} size={20} style={{marginTop:"2%", marginRight: "5%", marginLeft:"2%"}}/>
                    <h1 style={{marginLeft:5}} className="code-addon-button-text-style">Pass argv[1]</h1>
                  </div>           
                </button>
              )}
              {this.state.userInputBool && (
                
                <button className="code-addon-button-style" onClick={this.removeUserInput}>
                  <div style = {{display:'flex'}}>
                    <AiOutlineMinus color={"#1a75ff"} size={20} style={{marginTop:"2%", marginRight: "5%", marginLeft:"2%"}}/>
                    <h1 className="code-addon-button-text-style">Remove argv[1]</h1>
                  </div>           
                </button>
              )}
              <div>
                <button className="code-addon-button-style" onClick={() => this.displayAdditionalFunctionCallOptions()}>
                  <div style = {{display:'flex'}}>
                    <AiOutlinePlus color={"#1a75ff"} size={20} style={{marginTop:"6%"}}/>
                    <h1 className="code-addon-button-text-style">Call Another Function</h1>
                  </div>
                </button>
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{paddingTop: "2%"}}>
                <div className="instruction-step-functions">2</div>
              </div>
              <button className="add-to-program-button-style" onClick={this.addFunctionToProgram}>
                <div style = {{display:'flex'}}>
                  <AiFillFileAdd color={"white"} size={20} style={{marginTop:"4%", marginRight:"2%", marginLeft: "0.5%"}}/>
                  <h1 style={{marginLeft: "5%", marginTop: "5%"}} className="add-to-program-button-text-style">Add to intro.c</h1>
                </div>
              </button>
            </div>
            <h1 className="error-input-text-style">{this.state.addFunctionError}</h1>
          </div>
        </div>
      </div>
    )
  }

  returnProgramFunctionsLocalVariables(stackFrame){

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

  returnUnsafeFunctionsMain(stackFrame){
    return(
      stackFrame.unsafeFunctions.map((func) =>
        <div>
          <h1 className="program-code-text-style-functions"> strcpy({func.param1Name}, {func.param2Name});</h1>
        </div>
      )
    )
  }

  returnProgramFunctionsAdditionalFuncCalls(stackFrame){
    return(
      stackFrame.additionalFunctionCalls.map((func) =>
        <div>
          <h1 className="program-code-text-style-functions"> {func}</h1>
        </div>
      )
    )
  }

  returnMainFunctionCalls(){
    return(
      this.state.stackFrameDataArray.map((stackFrame) => 
        <div>
          <h1 className="program-code-text-style-functions">{stackFrame.functionName}({stackFrame.unmodifiedParams});</h1>
        </div>
      )
    )
  }

  returnFunctions(){
    return(
      this.state.stackFrameDataArray.map((stackFrame) =>
      <div className="program-functions">
        <div className="functions-flex">
          <h1 className="program-code-text-style-functions">void {stackFrame.functionName} </h1>
          <div className="functions-flex">
            <h1 className="program-code-text-style-functions">({stackFrame.localFuncParams}){"{"}</h1>
          </div>
        </div>
        <div style={{marginLeft: '1%'}}>
          {this.returnProgramFunctionsLocalVariables(stackFrame)}
          {this.returnUnsafeFunctionsMain(stackFrame)}
          {this.returnProgramFunctionsAdditionalFuncCalls(stackFrame)}
        </div>
        <h1 className="program-code-text-style-functions">{"}"}</h1>
      </div>
      )
    )
  }

  /*onClick = (e) => {
    this.props.onStartClick(e.target.value)
  }*/

  onClick = () => {
    this.props.onStartClick(this.state.stackFrameDataArray)
  }

  returnProgram(){

    var arr = this.state.stackFrameDataArray
    //console.log(this.state.stackFrameDataArray)

    return(
      <div>
          
        <div className="program-code-container">
          <div className="program-name-intro-container">
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <div style={{display: 'flex'}}>
                <h1 className="program-name-text-intro-style">intro.c</h1>
                <div style={{display: 'flex'}}>
                  <div className="instruction-step-functions">3</div>
                </div>
              </div>
            </div>
          </div>
          <div className="code-lines-spacer">
            <h1 className="program-code-text-style-functions">{"#include <stdio.h>"}</h1>
            <h1 className="program-code-text-style-functions">{"#include <string.h>"}</h1>
            <h1 className="program-code-text-style-functions">int main( int argc, char* argv[])</h1>
            <div className="margin-left-7">
              {this.returnMainFunctionCalls()}
            </div>
            <h1 className="program-code-text-style-functions">{"}"}</h1>
          </div>
          {this.returnFunctions()}
        </div>
        <button className="clear-button" type="button" onClick={this.clearProgram}>Clear</button>
        <div className="height-5">&nbsp;</div>
      </div>
    )
  }


  render() {
    return (
      <div className ="functions-container">
        <div className="main-container">
          <div  className="create-function-container">
            <div className="create-function-title-container">
              <div style={{display: 'flex'}}>
                <div>
                  <div className="instruction-step-functions">1</div>
                </div>
                <h1 className="create-function-title-style">Create a function</h1>
              </div>
            </div>
            {this.returnParamVariableInput()}
            <div className="return-function-form-container">
              {this.returnFunctionForm()}
            </div>
          </div>
          <div className="main-spacer">
            {this.returnProgram()}
          </div>
          <button className="view-stack-button" onClick={() => this.onClick()}>
            <div style={{display: 'flex'}}>
              <h1 className="activity-button-text">Stack</h1>
              <div style={{marginLeft: '10%'}}>
                <AiOutlineArrowRight color={"#1a75ff"} size={16}/>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }
}

export default Functions;
