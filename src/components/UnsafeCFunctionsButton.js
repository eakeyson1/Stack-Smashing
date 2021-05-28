import React from "react";
import { AwesomeButton } from "react-awesome-button";
import style from '../css/button.css'
import "../css/functions.css";
import { GiHazardSign } from "react-icons/gi";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { GoInfo } from "react-icons/go"



function UnsafeCFunctionsButton(props) {

    const unsafeFunctions = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Add an unsafe C function, such as strcpy, to function
    </Tooltip>
    );

  return (
    <AwesomeButton type="primary" className="code-addon-button" onPress={props.displayAddUnsafeFunction} ripple={true}>
        <div style={{display: 'flex'}}>
            <div style={{marginTop: '1%', color: 'blue'}}>
                <GiHazardSign size={21}/>
            </div>
            <h1 className="code-addon-button-text-style">Unsafe C Functions</h1>
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={unsafeFunctions}>
                <GoInfo color={"#1a75ff"} size={17}/>
            </OverlayTrigger>
        </div>
    </AwesomeButton>
  );
}
export default UnsafeCFunctionsButton;