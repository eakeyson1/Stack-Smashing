import React from "react";
import InstructCircle from "./InstructCircle"

function CreateAFunctionTitle() {

  return (
    <div className="create-function-title-container">
        <div style={{display: 'flex'}}>
        <InstructCircle number={"1"}/>
        <h1 className="create-function-title-style">Create a function</h1>
        </div>
    </div>
  );
}
export default CreateAFunctionTitle;