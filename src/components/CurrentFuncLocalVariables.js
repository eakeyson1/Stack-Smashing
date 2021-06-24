import React from "react";
import "../css/functions.css";

function CurrentFuncLocalVariables(props) {

    const returnLocalVariables = () => {

        var displayLV = []

        props.localVariables.map((variable) =>{
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
            else if(variable.type === "int"){
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

  return (
    returnLocalVariables()
  );
}
export default CurrentFuncLocalVariables;