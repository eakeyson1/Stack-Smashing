import React from "react";
import "../css/functions.css";

function CurrentFuncUnsafeFunctions(props) {

  return (
    <div>
        {props.unsafeFunctions.map((func) =>
            <h1 className="code-input-text-style"> strcpy({func.param1Name}, {func.param2Name});</h1>
        )}
    </div>
  );
}
export default CurrentFuncUnsafeFunctions;