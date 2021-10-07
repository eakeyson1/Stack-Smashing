import React from "react";
import styled from "styled-components";

function MaliciousExecutionStatus(props) {
 
  const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }`

  const status = () => {
    if(props.maliciousExecution === "Starting"){
      return(
      <div className="stack-smashing-status-container">
        <div style={{display: 'flex', marginTop: '1%', justifyContent: 'center'}}>
          <div className="stack-smashing-status-title-container">
            <h1 className="malicious-execution-title-text">Attack Status:</h1>
            <div style={{marginLeft: '2%'}}>
              <h1 className="malicious-execution-starting-text">Starting</h1>
            </div> 
          </div>
        </div>
      </div>
      )
    }
    else if(props.maliciousExecution === "Running"){
      return(
        <div className="stack-smashing-status-container">
          <div style={{display: 'flex', marginTop: '1%', justifyContent: 'center'}}>
            <div className="stack-smashing-status-title-container">
              <h1 className="malicious-execution-title-text">Attack Status:</h1>
              <div style={{display: 'flex', marginLeft: '2%'}}>
                <h1 className="malicious-execution-text-running">Running</h1>
                <Dots/>         
              </div> 
            </div>
          </div>
        </div>
      )
    }
    else if(props.maliciousExecution === "Successful"){
      var successString = "Successful in: "
      props.malFuncNameArr.map((name) => 
        successString+= name
      )
      return(
      <div className="stack-smashing-status-container">
        <div style={{display: 'flex', marginTop: '1%', justifyContent: 'center'}}>
          <div className="stack-smashing-status-title-container">
            <h1 className="malicious-execution-title-text">Attack Status:</h1>
            <div className="success-string-container">
              <h1 className="malicious-execution-starting-text">{successString}</h1>
            </div> 
          </div>
        </div>
      </div>
      )
    }

    else if(props.maliciousExecution === "Unsuccessful"){
      return(
      <div className="stack-smashing-status-container">
        <div style={{display: 'flex', marginTop: '1%', justifyContent: 'center'}}>
          <div className="stack-smashing-status-title-container">
            <h1 className="malicious-execution-title-text">Attack Status:</h1>
            <h1 className="malicious-execution-unsuccessful-text">Unsuccessful</h1>
          </div>
        </div>
      </div>
      )
    }
    else if(props.maliciousExecution === "Segmentation Fault"){
      console.log(props.maliciousExecution)
      return(
      <div className="stack-smashing-status-container">
        <div style={{display: 'flex', marginTop: '1%', justifyContent: 'center'}}>
          <div className="stack-smashing-status-title-container">
            <h1 className="malicious-execution-title-text">Attack Status:</h1>
            <h1 className="malicious-execution-seg-fault-text">Segmentation Fault: Bad return address</h1>
          </div>
        </div>
      </div>
      )
    }
  };

  return(
    status()
  );
}
export default MaliciousExecutionStatus;