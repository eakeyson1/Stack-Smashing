import React, { Component } from "react";
import "./css/mainFunctionStack.css"
import 'react-dropdown/style.css';


/**
 * Return main function on stack
 */
 
class mainFunctionStack extends Component {

  render() {
    return (
      <div>
        <div className="main-stack-container">
          <h1 className="stackframe-main-text">Stack Frame: main() 0xAC1A4B35</h1>
            <div className="container">
              <div>
                <h1 className="main-stack-text">Parameters</h1>
                <h1 className="main-stack-text">User Input</h1>
              </div>
              <div className="param-ui-container">
                <h1 className="param-ui-text">0xAC1A4B35</h1>
              </div>
            </div>
            <div>
              <div className="sfp-container">
                <div className="sfp-text-container">
                  <h1 className="main-stack-text">Saved Frame Pointer</h1>
                  <h1 className="main-stack-text">0xAC1A4B30</h1>
                </div>
                <div className="sfp-address-container">
                  <h1 className="main-stack-text">0xAC1A4B30</h1>
                  <h1 className="main-stack-text">0xAC1A4B2C</h1>
                </div>
              </div>
            </div>
        </div>
        <div className="bottom-spacer"></div>
      </div>
    );
  }
}

export default mainFunctionStack;
