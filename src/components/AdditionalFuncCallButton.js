import React from "react";
import { AwesomeButton } from "react-awesome-button";
import style from '../css/button.css'
import "../css/functions.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { GoInfo } from "react-icons/go"
import { TiArrowForward } from "react-icons/ti"



function AdditionalFuncCallButton(props) {

    const additionalFunctionCalls = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Call another function that has been previously added to intro.c
        </Tooltip>
      );

  return (
    <AwesomeButton className="code-addon-button" onPress={props.displayAdditionalFunctionCallOptions} ripple={true} type="primary">
        <div style={{display: 'flex'}}>
        <div style={{marginTop: '1%'}}>
            <TiArrowForward color={"white"} size={22}/>
        </div>
        <h1 className="code-addon-button-text-style">Call Another Function</h1>
        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={additionalFunctionCalls}>
            <GoInfo color={"#1a75ff"} size={17}/>
        </OverlayTrigger>
        </div>
    </AwesomeButton>
  );
}
export default AdditionalFuncCallButton;