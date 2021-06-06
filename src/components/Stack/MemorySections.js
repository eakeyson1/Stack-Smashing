import React from "react";

function MemorySections() {
 

  return(
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
  )
}
export default MemorySections;