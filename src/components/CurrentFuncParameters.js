import React from "react";
import "../css/functions.css";

function CurrentFuncParameters(props) {

    
    const parameters = () => {
        var parameters = ""
        props.parameters.map((parameter) =>{
          if(parameter.type === "char[]"){
            parameters += " char" + " " +  parameter.name + "[],"
          }
          else{
            parameters += " " + parameter.type + " " +  parameter.name + ","
          }
        })
        var removeComma = parameters.slice(0, -1)
        var tempParameters = "(" + removeComma + "){"
        return tempParameters
    }

    return(
      <h1 className="code-input-text-style">{parameters()} </h1>
    );
}
export default CurrentFuncParameters;