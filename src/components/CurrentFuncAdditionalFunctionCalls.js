import React from "react";
import "../css/functions.css";

function CurrentFuncAdditionalFunctionCalls(props) {

    return(
        props.additionalFunctionCalls.map((func) =>
            <h1 className="code-input-text-style"> {func}</h1>
        )
    );
}
export default CurrentFuncAdditionalFunctionCalls;