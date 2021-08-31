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

  var startAddress = 2882404352
  var sfpPosition = startAddress - props.mainStackParams.length - 8

  var sfpHexAddress = (sfpPosition).toString(16)
  var sfpHexAddressArr = sfpHexAddress.match(/.{1,2}/g)
  for(var j=0; j<sfpHexAddressArr.length; j++){
    sfpHexAddressArr[j] = "\\x" + sfpHexAddressArr[j].toUpperCase() 
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
                  <h1 className="main-stack-param-text">{"\\x00"}</h1>
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
                  <h1 className="main-stack-param-text">{sfpHexAddressArr[0]}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 4).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{sfpHexAddressArr[1]}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 5).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{sfpHexAddressArr[2]}</h1>
                </div>
                <div className="center">
                  <h1 className="main-stack-param-text">0x{((props.endParametersAddress - 6).toString(16)).toUpperCase()}</h1>
                </div>
              </div>
              <div className="main-stack-second-container">
                <div className="main-stack-value-container">
                  <h1 className="main-stack-param-text">{sfpHexAddressArr[3]}</h1>
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