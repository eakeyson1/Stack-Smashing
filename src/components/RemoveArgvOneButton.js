import React from "react";
import { AwesomeButton } from "react-awesome-button";
import style from '../css/button.css'
import "../css/functions.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { GoInfo } from "react-icons/go"
import { FaUserMinus } from "react-icons/fa"



function RemoveArgvOneButton(props) {

    const passArgvOne = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This will pass argv[1] as a parameter to the function with type: char[] (Array) and name of "userInput"
        </Tooltip>
    );

  return (
    <AwesomeButton className="code-addon-button" onPress={props.removeUserInput} ripple={true} type="primary">
        <div style={{display: 'flex'}}>
        <div style={{marginTop: '0.5%'}}>
        <FaUserMinus color={"white"} size={22}/>
        </div>
        <h1 className="code-addon-button-text-style">Remove argv[1]</h1>
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={passArgvOne}>
            <GoInfo color={"#1a75ff"} size={17}/>
        </OverlayTrigger>
        </div>
    </AwesomeButton>
  );
}
export default RemoveArgvOneButton;