import React, { Component } from "react";
import "./css/startPage.css";
import "./css/functions.css";
import logo from "./DISSAV Logo.PNG"

/**
 * The welcome page of the application.
 */
class StartPage extends Component {
  render() {
    return (
      <div className="start-page">
        <header>
          <img className="logo" src={logo} />;
          <h1 className="start-page-header-text">DISSAV</h1>
          <h3 className="start-page-sub-header-text">Dynamic Interactive Stack Smashing Attack Visualization</h3>
          <div style={{marginTop: '10%'}}> 
            <button class="pushable begin-button-width" onClick={this.props.onStartClick}>
              <div class="shadow shadow-height-begin-button"></div>
              <div class="edge edge-color-lighter-blue edge-height-begin-button"></div>
              <div class="front front-color-white  front-padding-begin-button front-padding-execution-button-text-size">
                <h1 className="begin-button-text">Begin</h1>    
              </div>
            </button>
          </div>
        </header>
      </div>
    );
  }
}

export default StartPage;
