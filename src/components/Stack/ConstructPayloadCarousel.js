import React from "react";
import Tooltip from 'react-bootstrap/Tooltip'
import Carousel from "react-bootstrap/Carousel";
import { BsInfoCircle } from "react-icons/bs"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Checkbox from '@material-ui/core/Checkbox'

import "../../css/stack.css"


function ConstructPayloadCarousel(props) {
 
  const nopSledDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      An assembly language instruction, considered a no operation, used as padding to compensate for variations in the location the code will be found in. It is represented by \x90. 
    </Tooltip>
  );

  const shellcodeDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The code the attacker would like to execute. Often launches a remote shell.
    </Tooltip>
  );

  const returnAddressDef = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The address the function will return to once execution has ended
    </Tooltip>
  );

  return(
    <Carousel
    activeIndex={props.index}
    onSelect={props.handleSelect}
    controls={props.controls}
    wrap={false}
    interval={null}
    indicators={false}
  >
    <Carousel.Item>
      <div className="construct-payload-part-container">
        <div style={{display: 'flex'}}>
          <div className="payload-nop-header-container">
            <div style={{marginLeft: '25%'}} className="instruction-sub-circle margin-right-5-percent">
              <div className="instruction-sub-text">4.1</div>
            </div>
            <div className="payload-nop-header-title-container">
              <h1 className="construct-payload-sub-text">Begin with NOP Sled</h1>
            </div>
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={nopSledDef}
            >
              <BsInfoCircle color={"#1a75ff"} size={20}/>
            </OverlayTrigger>
          </div>
          <div className="payload-next-button-container">
            <button class="pushable" onClick={() => props.handleShellCodeClick()}>
              <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
              <div class="front front-color-white front-padding-back-button">
                <AiOutlineArrowRight color={"#1a75ff"} size={25}/>
              </div>
            </button>
          </div>
        </div>
        <div className="hints-main-container">
          <div className="hints-container">
            <h1 className="hints-title">Hints</h1>
            <h1 className="hints">* Should only contain \x90</h1>
            <h1 className="hints">* Consider the space occupied by the local variables</h1>
            <h1 className="hints">* Return Address and Saved Frame Pointer occupy 4 bytes</h1>
          </div>
        </div>
        {props.running && (
          <h1 style={{marginTop: '5%'}} className="exe-code-text">{props.nopSled}</h1>
        )}
        {!props.running && (
          <input
            value={props.nopSled}
            type="text"
            placeholder={"Start typing...."}
            onChange={event => props.updateNopSled(event.target.value)}
            className="user-input"
          />                    
        )}
      </div>
    </Carousel.Item>
    <Carousel.Item>
      <div className="construct-payload-part-container">             
        <div style={{display: 'flex'}}>
          <div className="payload-back-button-container">
            <button class="pushable" onClick={() => props.handleNopClick()}>
              <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
              <div class="front front-color-white front-padding-back-button">
                <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
              </div>
            </button>
          </div>
          <div className="payload-shellcode-header-container">
            <div style={{marginLeft: '22.5%'}} className="instruction-sub-circle margin-right-5-percent">
              <div className="instruction-sub-text">4.2</div>
            </div> 
            <div style={{marginLeft: "2%", marginTop: "1%", marginRight: '2%'}}>
              <h1 className="construct-payload-sub-text">Add Shellcode</h1>
            </div>                  
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={shellcodeDef}
              >
              <BsInfoCircle color={"#1a75ff"} size={20}/>
            </OverlayTrigger>
          </div>
          <div className="payload-shellcode-next-button-shellcode-container">
            <button class="pushable" onClick={() => props.handleReturnAddressClick()}>
              <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
              <div class="front front-color-white front-padding-back-button">
                <AiOutlineArrowRight color={"#1a75ff"} size={25}/>
              </div>
            </button>
          </div>
        </div>
        <div className="hints-main-container">
          <div className="hints-container">
            <h1 className="hints-title">Note</h1>
            <h1 className="hints">* Be mindful of the length of the machine code</h1>
          </div>
        </div>
        {!props.running && (
          <div style={{display: 'flex', marginTop: '5%'}}>
            <div>
              <div style={{display: 'flex'}}>
                <Checkbox
                  checked={props.startingShell}
                  onChange={(event) => props.startingShellChecked(event.target.checked)}
                  color="primary"
                  />
                <div style={{marginTop: '3.5%'}}>
                  <div className="shellcode-title-text">Start a remote shell</div>
                </div>
              </div>
              <div className="shellcode-text">\xF3\xDD\xA2\xC9\xAA\xD3</div>

              <div style={{display: 'flex', marginTop: '5%'}}>
                <Checkbox
                  checked={props.gettingRootPriviledges}
                  onChange={(event) => props.gettingRootPriviledgesChecked(event.target.checked)}
                  color="primary"
                  />
                <div style={{marginTop: '3.5%'}}>
                  <div className="shellcode-title-text">Get root priviledge</div>
                </div>
              </div>
              <div className="shellcode-text">\xCC\xB2\xBB\xA1\x7B\xC8\xF4\xC6</div>
            </div>
            <div style={{marginLeft: '5%'}}>
              <div style={{display: 'flex'}}>
                <Checkbox
                  checked={props.shutDownOs}
                  onChange={(event) => props.shutDownOsChecked(event.target.checked)}
                  color="primary"
                  />
                <div  style={{marginTop: '6%'}}>
                  <div className="shellcode-title-text">Shut down OS</div>
                </div>
              </div>
              <div className="shellcode-text">\xFF\D3\x99\xA0</div>
              <div style={{display: 'flex', marginTop: '8%'}}>
                <Checkbox
                  checked={props.wipeOs}
                  onChange={(event) => props.wipeOsChecked(event.target.checked)}
                  color="primary"
                  />
                <div style={{marginTop: '6%'}}>
                  <div className="shellcode-title-text">Wipe OS</div>
                </div>
              </div>
              <div className="shellcode-text">\FA\xDA\x00\xB0\x77</div>
            </div>
          </div>
        )}
        {props.running && (
          <div style={{display: 'flex', marginTop: '5%'}}>
            <div>
              <div style={{display: 'flex'}}>
                <div style={{marginTop: '3.5%'}}>
                  <div className="shellcode-title-text">Start a remote shell</div>
                </div>
              </div>
              <div className="shellcode-text">\xF3\xDD\xA2\xC9\xAA\xD3</div>
              <div style={{display: 'flex', marginTop: '5%'}}>
                <div style={{marginTop: '3.5%'}}>
                  <div className="shellcode-title-text">Get root priviledge</div>
                </div>
              </div>
              <div className="shellcode-text">\xCC\xB2\xBB\xA1\x7B\xC8\xF4\xC6</div>
            </div>
            <div style={{marginLeft: '5%'}}>
              <div style={{display: 'flex'}}>
                <div  style={{marginTop: '6%'}}>
                  <div className="shellcode-title-text">Shut down OS</div>
                </div>
              </div>
              <div className="shellcode-text">\xFF\D3\x99\xA0</div>
              <div style={{display: 'flex', marginTop: '8%'}}>
                <div style={{marginTop: '6%'}}>
                  <div className="shellcode-title-text">Wipe OS</div>
                </div>
              </div>
              <div className="shellcode-text">\FA\xDA\x00\xB0\x77</div>
            </div>
          </div>
        )}
    </div>
    </Carousel.Item>
    <Carousel.Item>
      <div className="construct-payload-part-container">
        <div style={{display: 'flex'}}>
          <div>
            <button class="pushable" onClick={() => props.handleShellCodeClick()}>
              <div class="edge edge-color-lighter-blue edge-height-stack-next-button"></div>
              <div class="front front-color-white front-padding-back-button">
                <AiOutlineArrowLeft color={"#1a75ff"} size={25}/>
              </div>
            </button>
          </div>
          <div className="payload-return-address-header-container">
            <div style={{marginLeft: '2%'}} className="instruction-sub-circle margin-right-5-percent">
              <div className="instruction-sub-text">4.3</div>
            </div>
            <div style={{marginLeft: "2%", marginTop: "1%", marginRight: '2%'}}>
              <h1 className="construct-payload-sub-text">End with Return Address</h1>
            </div>
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={returnAddressDef}
              >
              <BsInfoCircle color={"#1a75ff"} size={20}/>
            </OverlayTrigger>
          </div>
        </div>
        <div className="hints-main-container">
          <div style={{marginBottom: '8%'}} className="hints-container">
            <h1 className="hints-title">Hints</h1>
            <h1 className="hints">* Any address that contains a NOP from our payload</h1>
            <h1 className="hints">* Little endian based CPU</h1>
          </div>
        </div>
        {props.running && (
          <h1 style={{marginTop: '5%'}} className="exe-code-text">{props.returnAddress}</h1>
        )}
        {!props.running && (
          <input
            value={props.returnAddress}
            type="text"
            placeholder={"Start typing...."}
            onChange={event => props.updateReturnAddress(event.target.value)}
            className="user-input"
          />                  
        )}
      </div>
    </Carousel.Item>
  </Carousel>
  );
}
export default ConstructPayloadCarousel;