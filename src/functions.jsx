import React, { Component } from "react";
import "./css/startPage.css";
import "./css/functions.css";
import styled, { keyframes } from "styled-components";
import 'react-dropdown/style.css';
import style from './css/button.css'

import GoToStackButton from "./components/GoToStackButton"
import ClearProgramButton from "./components/ClearProgramButton"
import PointerMiddle from "./components/PointerMiddle";
import CreateAFunctionTitle from "./components/CreateAFunctionTitle"
import ReturnProgram from "./components/ReturnProgram"
import CurrentFunction from "./components/CurrentFunction"
import ParametersVariablesInput from "./components/ParametersVariablesInput"


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
    this.updateParameterType = this.updateParameterType.bind(this)
    this.changeStrcpyParam1 = this.changeStrcpyParam1.bind(this)
    this.changeStrcpyParam2 = this.changeStrcpyParam2.bind(this)
    this.changeLocalVariableType = this.changeLocalVariableType.bind(this)
    this.addFunctionCall = this.addFunctionCall.bind(this)
    this.isInt = this.isInt.bind(this)
    this.clearFunction = this.clearFunction.bind(this)


    this.state = {
      displayAdditionalFunctionCalls: false,
      parameters: [],
      localVariables: [],
      stackFrameDataArray: [],
      parameterName: "",
      parameterType: "char",
      parameterValue: "",
      localVariableName: "",
      localVariableType: "char",
      localVariableValue: "",
      functionName: "",
      parameterNameError: false,
      parameterValueError: false,
      localVariableNameError: false,
      localVariableValueError: false,
      localVariableError: "",
      numOfFunctions: 0,
      userInputBool: false,
      addUnsafeFunctionBool: false,
      strcpyParam1: "",
      strcpyParam2: "",
      unsafeFunctions: [],
      additionalFunctionCallName: "",
      additionalFunctionCalls: [],
      strcpyParamError: "",
      functionNameError: "",
      functionError: "",
      addFunctionError: "",
      hoverAddToProgram: false,
      strcpyParams1: [],
      strcpyParams2: [], 
    }
  }

  addParameter(){

    var parameterName = this.state.parameterName

    // Check if maximum number of parameters is exceeded
    if(this.state.parameters.length > 2){
      this.setState({functionError: "Maximum of 3 parameters allowed"})
      setTimeout(() => { this.setState({functionError: ""}) }, 10000);
      return
    }

    //Check if input is a single character
    if(this.state.parameterType === "char" && this.state.parameterValue.length > 1){
      this.setState({parameterValueError: "char is 1 character"})
      setTimeout(() => { this.setState({parameterValueError: ""}) }, 10000);
      return
    }

    // Check if input is an integer
    if(this.state.parameterType === "int" && isNaN(this.state.parameterValue)){
      this.setState({parameterValueError: "That is not an integer"})
      setTimeout(() => { this.setState({parameterValueError: ""}) }, 10000);
      return
    }

    // Check if input is a float
    if(this.state.parameterType === "float" && isNaN(this.state.parameterValue)){
      this.setState({parameterValueError: "That is not a float"})
      setTimeout(() => { this.setState({parameterValueError: ""}) }, 10000);
      return
    }


    // Check if input is empty
    if(this.state.parameterName === ""){
      this.setState({parameterNameError: "Please enter a name"})
      setTimeout(() => { this.setState({parameterNameError: ""}) }, 10000);
      return
    }
    if(this.state.parameterValue === ""){
      this.setState({parameterValueError: "Please enter a value"})
      setTimeout(() => { this.setState({parameterValueError: ""}) }, 10000);
      return
    }

    // Check if name is already used
    for(var i=0; i<this.state.parameters.length; i++){
      if(this.state.parameters[i].name === this.state.parameterName){
        this.setState({parameterNameError: "Already in use"})
        setTimeout(() => { this.setState({parameterNameError: ""}) }, 10000);
        return
      }
    }

    for(var i=0; i<this.state.localVariables.length; i++){
      if(this.state.localVariables[i].name === this.state.parameterName){
        this.setState({parameterNameError: "Already in use"})
        setTimeout(() => { this.setState({parameterNameError: ""}) }, 10000);
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
      this.setState({functionError: "Maximum of 3 parameters allowed"})
      setTimeout(() => { this.setState({functionError: ""}) }, 10000);
      return
    }

    //Check if input is a single character
    if(this.state.localVariableType === "char" && this.state.localVariableValue.length > 1){
      this.setState({localVariableValueError: "char is 1 character"})
      setTimeout(() => { this.setState({localVariableVlueError: ""}) }, 10000);
      return
    }

    // Check if input is an integer
    if(this.state.localVariableType === "int" && isNaN(this.state.localVariableValue)){
      this.setState({localVariableValueError: "That is not an integer"})
      setTimeout(() => { this.setState({localVariableValueError: ""}) }, 10000);
      return
    }

    //Workaround
    if(this.state.localVariableType === "int"){
      localVariableValue = parseInt(this.state.localVariableValue)
    }

    // Check if input is a float
    if(this.state.localVariableType === "float" && isNaN(this.state.localVariableValue)){
      this.setState({localVariableValueError: "That is not a float"})
      setTimeout(() => { this.setState({localVariableValueError: ""}) }, 10000);
      return
    }
    
    //Workaround
    if(this.state.localVariableType === "float"){
      localVariableValue = Number(this.state.localVariableValue).toFixed(2)
    }

    // Check if input is empty
    if(this.state.localVariableName === ""){
      this.setState({localVariableNameError: "Please enter a name"})
      setTimeout(() => { this.setState({localVariableNameError: ""}) }, 10000);
      return
    }

    if(this.state.localVariableValue === ""){
      this.setState({localVariableValueError: "Please enter a value"})
      setTimeout(() => { this.setState({localVariableValueError: ""}) }, 10000);
      return
    }

    // Check if name is already used
    for(var i=0; i<this.state.parameters.length; i++){
      if(this.state.parameters[i].name === this.state.localVariableName){
        this.setState({localVariableNameError: "Already in use"})
        setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
        return
      }
    }

    for(var i=0; i<this.state.localVariables.length; i++){
      if(this.state.localVariables[i].name === this.state.localVariableName){
        this.setState({localVariableNameError: "Already in use"})
        setTimeout(() => { this.setState({localVariableError: ""}) }, 10000);
        return
      }
    }

    // Check if name equals "userinput"
    if(this.state.localVariableName === "userInput"){
      this.setState({localVariableNameError: "Cannot have 'userInput' as a local variable name"})
      setTimeout(() => { this.setState({localVariableNameError: ""}) }, 10000);
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
      this.setState({functionError: "Maximum of 3 functions allowed"})
      setTimeout(() => { this.setState({functionError: ""}) }, 5000);
      return
    }

    for(var i=0; i<this.state.stackFrameDataArray.length; i++){
      if(this.state.stackFrameDataArray[i].functionName === this.state.functionName){
        this.setState({functionError: "Cannot have multiple functions with the same name"})
        setTimeout(() => { this.setState({functionError: ""}) }, 10000);
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
      nextStep: false,
    }

    var joined = this.state.stackFrameDataArray.concat(stackFrame)
    this.setState({ 
      stackFrameDataArray: joined, 
      functionName: "",
      parameters: [],
      parameterType: "char",
      parameterName: "",
      parameterValue: "",
      localVariables: [],
      localVariableValue: "",
      localVariableName: "",
      localVariableType: "char",
      displayAddFrame: false,
      addFunctionError: "",
      functionNameError: "",
      functionError: "",
      parameterError: "",
      localVariableError: false,
      unsafeFunctions: [],
      userInputBool: false,
      additionalFunctionCalls: [],
      additionalFunctionCallName: ""
    })
    
  }

  clearFunction(){
    this.setState({
      parameters: [], 
      localVariables: [], 
      unsafeFunctions: [], 
      additionalFunctionCalls: [],
      userInputBool: false
    })
  }

  /***** Updating user inputs *****/

  updateParameterName(event){this.setState({parameterName: event.target.value, parameterNameError: ""})}
  updateParameterValue(event){this.setState({parameterValue: event.target.value, parameterValueError: ""})}
  updateLocalVariableName(event){this.setState({localVariableName: event.target.value, localVariableNameError: ""})}
  updateLocalVariableValue(event){this.setState({localVariableValue: event.target.value,localVariableValueError: ""})}
  updateFunctionName(event){this.setState({functionName: event.target.value, functionNameError: ""})}
  updateParameterType(event){this.setState({parameterType: event.target.value})}
  updateLocalVariableType(event){this.setState({localVariableType: event.target.value})}

  /***** Updating dropdown menus *****/

  changeParameterType(type){this.setState({parameterType: type.value}) }
  changeFunctionType(type){this.setState({functionType: type.value})}
  changeLocalVariableType(type){this.setState({localVariableType: type.value})}
  changeStrcpyParam1(type){this.setState({strcpyParam1: type.value})}
  changeStrcpyParam2(type){this.setState({strcpyParam2: type.value})}
  changeAdditionalFunctionCallName(type){this.setState({additionalFunctionCallName: type.value})}
  
  displayAdditionalFunctionCallOptions(){

    if(this.state.additionalFunctionCalls.length > 0){
      this.setState({functionError: "Only 1 additional function call allowed"})
      setTimeout(() => { this.setState({functionError: ""}) }, 8000);
      return
    }

    this.setState({displayAdditionalFunctionCalls: !this.state.displayAdditionalFunctionCalls, addUnsafeFunctionBool: false})
  }

  displayAddUnsafeFunction(){

    for(var i=0; i<this.state.stackFrameDataArray.length; i++){
      if(this.state.stackFrameDataArray[i].unsafeFunctions.length !== 0){
        this.setState({functionError: "Only 1 unsafe function allowed for intro.c"})
        setTimeout(() => { this.setState({functionError: ""}) }, 8000);
        return
      }
    }

    if(this.state.unsafeFunctions.length > 0){
      this.setState({functionError: "Only 1 unsafe function allowed"})
      setTimeout(() => { this.setState({functionError: ""}) }, 8000);
      return
    }

    this.setState({
      addUnsafeFunctionBool: !this.state.addUnsafeFunctionBool, 
      displayAdditionalFunctionCalls: false,
      strcpyParamError: "",
    })
  }

  render() {
    return (
      <div className ="functions-container">
        <div className="main-container">
          <div  className="create-function-container">
            <CreateAFunctionTitle/>
            <ParametersVariablesInput
              parameters={this.state.parameters}
              localVariables={this.state.localVariables}
              functionName={this.state.functionName} 
              updateFunctionName={(name) => this.updateFunctionName(name)}
              addFunctionToProgram={this.addFunctionToProgram}
              hoverFalse= {(bool) => this.setState({hoverAddToProgram: bool})}
              hoverTrue={(bool) => this.setState({hoverAddToProgram: bool})}
              addToIntro={this.addToIntro}
              parameterName={this.state.parameterName}
              updateParameterName={(name) => this.updateParameterName(name)}
              parameterNameError={this.state.parameterNameError}
              parameterValueError={this.state.parameterValueError}
              changeParameterType={(type) => this.changeParameterType(type)}
              parameterType={this.state.parameterType}
              parameterValue={this.state.parameterValue}
              updateParameterValue={(value) => this.updateParameterValue(value)}
              addParameter={this.addParameter}
              localVariableName={this.state.localVariableName}
              updateLocalVariableName={(name) => this.updateLocalVariableName(name)}
              localVariableNameError={this.state.localVariableNameError}
              localVariableValueError={this.state.localVariableValueError}
              changeLocalVariableType={(type) => this.changeLocalVariableType(type)}
              localVariableType={this.state.localVariableType}
              localVariableValue={this.state.localVariableValue}
              updateLocalVariableValue={(value) => this.updateLocalVariableValue(value)}
              addLocalVariable={this.addLocalVariable}
              functionError={this.state.functionError}
              functionNameError={this.state.functionNameError}
              localVariableError={this.state.localVariableError}

            />

            <div className="return-function-form-container">
              <CurrentFunction 
                functionName={this.state.functionName} 
                parameters={this.state.parameters}
                localVariables={this.state.localVariables}
                unsafeFunctions={this.state.unsafeFunctions}
                additionalFunctionCalls={this.state.additionalFunctionCalls}
                displayAddUnsafeFunction={this.displayAddUnsafeFunction}
                addUserInput={this.addUserInput}
                removeUserInput={this.removeUserInput}
                displayAdditionalFunctionCallOptions={this.displayAdditionalFunctionCallOptions}
                addFunctionError={this.state.addFunctionError}
                userInputBool={this.state.userInputBool}
                changeAdditionalFunctionCallName={(name) => this.changeAdditionalFunctionCallName(name)}
                addFunctionCall={this.addFunctionCall}
                stackFrameDataArray={this.state.stackFrameDataArray}
                displayAdditionalFunctionCalls={this.state.displayAdditionalFunctionCalls}
                addUnsafeFunctionBool={this.state.addUnsafeFunctionBool} 
                changeFunctionType={(type) => this.changeFunctionType(type)}
                changeStrcpyParam1={(param1) => this.changeStrcpyParam1(param1)}
                changeStrcpyParam2={(param2) => this.changeStrcpyParam2(param2)}
                parameters={this.state.parameters}
                localVariables={this.state.localVariables}
                addUnsafeFunctionToProgram={this.addUnsafeFunctionToProgram}
                strcpyParamError={this.state.strcpyParamError}
                clearFunction={this.clearFunction}
              />
            </div>
          </div>
          <PointerMiddle hoverAddToProgram={this.state.hoverAddToProgram}/>
          <div className="main-spacer">
            <ReturnProgram stackFrameDataArray={this.state.stackFrameDataArray} hoverAddToProgram={this.state.hoverAddToProgram}/>
            <ClearProgramButton clearProgram={() => this.setState({stackFrameDataArray: []})}/>
          </div>
          <div style={{marginLeft: '1.5%'}}> 
            <GoToStackButton goToStack={() => this.props.onStartClick(this.state.stackFrameDataArray)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Functions;
