import React from "react";
import { AwesomeButton } from "react-awesome-button";
import style from '../css/button.css'
import "../css/functions.css";
import { FaUserPlus } from "react-icons/fa";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { GoInfo } from "react-icons/go"



function UnsafeCFunctionsButton(props) {

    const passArgvOne = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This will pass argv[1] as a parameter to the function with type: char[] (Array) and name of "userInput"
        </Tooltip>
    );

  return (
    <AwesomeButton className="code-addon-button" onPress={props.addUserInput} ripple={true} type="primary">
        <div style={{display: 'flex'}}>
        <div style={{marginTop: '0.5%'}}>
            <FaUserPlus color={"white"} size={22}/>
        </div>
        <h1 className="code-addon-button-text-style">Pass argv[1]</h1>
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={passArgvOne}>
            <GoInfo color={"#1a75ff"} size={17}/>
        </OverlayTrigger>
        </div>
    </AwesomeButton>
  );
}
export default UnsafeCFunctionsButton;