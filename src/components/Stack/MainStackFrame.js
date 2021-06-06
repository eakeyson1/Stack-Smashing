import React from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";

function MainStackFrame(props) {
 
  const returnMainStackParams = (props) => {

    var startAddress = 2882404352
    return(
      <div style={{display: 'flex'}}>
        <div className="stack-frame-param-title-container">
          <div><h1 className="main-stack-element-title-text">Parameters</h1></div>
        </div> 
        <div>
          {props.mainStackParams.map((param) => 
            <div className="stack-frame-param-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{param}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((startAddress -= 1).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div> 
          )}
        </div>
      </div>

    )
  }

  const returnArgvOne = () => {
    return(
      this.state.argvOne.map((param) => 
      <div className="main-stack-param-container">
         <div className="main-stack-second-container">
          <div className="main-stack-value-container">
            <h1 className="main-stack-param-text">{param}</h1>
          </div>
          <div className="center">
            <h1 className="main-stack-param-text">0xAC1A4B30</h1>
          </div>
        </div>
      </div>
      )
    )
  }



  return(
    <div>
      {!props.mainStackOpen && (
        <button className="stack-frame-open-button" onClick={props.setMainStackOpen}>
          <div style={{display: 'flex'}}>
            <div style={{marginLeft: '35%'}}>
              <h1 className="stack-frame-button-text">main() 0xABCE0000()</h1>
            </div>
            <div style={{marginLeft: "18%"}}>
              <RiArrowDropRightLine size={45} color={"white"}/>
            </div>
          </div>
        </button>
      )}
      {props.mainStackOpen && (
        <div>
          <button className="stack-frame-open-button" onClick={props.setMainStackOpen}>
            <div style={{display: 'flex'}}>
              <div style={{marginLeft: '35%'}}>
                <h1 className="stack-frame-button-text">main() 0xABCE0000()</h1>
              </div>
              <div style={{marginLeft: "18%"}}>
                <RiArrowDropDownLine size={45} color={"white"}/>
              </div>
            </div>
          </button>
          {returnMainStackParams}
          {returnArgvOne}
          <div style={{display: 'flex'}}>
            <div className="return-address-title-container">
              <h1 className="main-stack-element-title-text">Return Address</h1>
            </div> 
            <div className="return-address-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xAB"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{(props.endParametersAddress.toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xCE"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 1).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\x00"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 2).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xAC"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 3).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div>
          </div> 
          <div style={{display: 'flex'}}>
            <div className="saved-frame-pointer-title-container">
              <h1 className="main-stack-element-title-text">Saved Frame Pointer</h1>
            </div> 
            <div className="saved-frame-pointer-container">
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xAB"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 4).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xCD"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 5).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xFF"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 6).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{"\\xF2"}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 7).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
            </div>
          </div> 
        </div>
      )}
    </div>
  );
}
export default MainStackFrame;