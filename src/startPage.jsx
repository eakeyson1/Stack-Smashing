import React, { Component } from "react";
import "./css/startPage.css";

/**
 * The welcome page of the application.
 */
class StartPage extends Component {
  render() {
    return (
      <div className="start-page">
        <header>
          <h1 className="start-page-header-text">Stack Smashing</h1>
          <h3 className="start-page-sub-header-text">UNC Charlotte Edition</h3>
          <button onClick={this.props.onStartClick} className="start-btn"> Start </button>
        </header>
      </div>
    );
  }
}

export default StartPage;
