import React from "react";

function InstructCircle(props) {
 
  const circle = () => {
    return(
      <div className="instruction-circle">
        <div className="instruction-text">{props.number}</div>
    </div>
    )
  };

  return (
    circle()
  );
}
export default InstructCircle;