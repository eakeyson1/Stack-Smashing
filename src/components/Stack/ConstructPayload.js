import React from "react";
import ConstructPayloadCarousel from "./ConstructPayloadCarousel"
import InstructCircle from "../InstructCircle"
import DisplayShellcode from "./DisplayShellcode"
import Checkbox from '@material-ui/core/Checkbox'

function ConstructPayload(props) {
 

  return(
    <div className="construct-payload-container">
    <div className="center-div">
      <div style={{width: '100%'}}>
        <div style={{display: 'flex', marginLeft: '15%', marginBottom: '10%'}}>
          <InstructCircle marginLeft={"32%"} number={"4"}/>
          <div className="construct-payload-title-container">
            <h1 className="construct-payload-text">Construct Payload</h1>
            <p style={{paddingTop: '2.5%', marginLeft: '5%'}} className="attempt-attack-text">Attempt Attack?</p>
            <Checkbox
              checked={props.attemptAttack}
              onChange={(event) => props.attemptAttackChecked(event.target.checked)}
              color="primary"
            />
          </div>
        </div>
        {!props.attemptAttack && (
          <div className="user-input-container">
            <input
              value={props.userInput}
              type="text"
              id="inputID"
              placeholder={"User Input"}
              onChange={props.updateUserInput}
              className="user-input-text"
              maxLength={12}
            />
          </div>
        )}
        {props.attemptAttack && (
        <div style={{marginLeft: '8%'}} class="scrollmenu">
          <div className="payload-diagram-container">
            <div>
              <div className="payload-diagram-title-text">argv[0]</div>
              <div className="payload-diagram-intro-container center-div">
                <div className="payload-diagram-text">./intro</div>
              </div>
            </div>
            {props.payloadStateNop && (
              <div>
                <div className="payload-diagram-title-text">NOP Sled</div>
                <div className="payload-diagram-nop-container center-div payload-diagram-nop-border">
                  <div className="payload-diagram-text">{props.nopSled}</div>
                </div>
              </div>
            )}
            {!props.payloadStateNop && (
              <div>
                <div className="payload-diagram-title-text">NOP Sled</div>
                <div className="payload-diagram-nop-container center-div">
                  <div className="payload-diagram-text">{props.nopSled}</div>
                </div>
              </div>
            )}
            {props.payloadStateShellcode && (
              <div>
                <div className="payload-diagram-title-text">Shellcode</div>
                <div className="payload-diagram-shellcode-container center-div payload-diagram-shellcode-border">
                  <DisplayShellcode
                    startingShell={props.startingShell}
                    gettingRootPriviledges={props.gettingRootPriviledges}
                    shutDownOs={props.shutDownOs}
                    wipeOs={props.wipeOs}
                  />
                </div>
              </div>
            )}
            {!props.payloadStateShellcode && (
              <div>
                <div className="payload-diagram-title-text">Shellcode</div>
                <div className="payload-diagram-shellcode-container center-div">
                  <DisplayShellcode
                    startingShell={props.startingShell}
                    gettingRootPriviledges={props.gettingRootPriviledges}
                    shutDownOs={props.shutDownOs}
                    wipeOs={props.wipeOs}
                  />
                </div>
              </div>
            )}
            {props.payloadStateReturnAddress && (
              <div>
                <div className="payload-diagram-title-text">Return Address</div>
                <div className="payload-diagram-return-address-container center-div payload-diagram-return-address-border">
                  <div className="payload-diagram-text">{props.returnAddress}</div>
                </div>
              </div>
            )}
            {!props.payloadStateReturnAddress && (
              <div>
                <div className="payload-diagram-title-text">Return Address</div>
                <div className="payload-diagram-return-address-container center-div">
                  <div className="payload-diagram-text">{props.returnAddress}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
    {props.attemptAttack && (
    <div style={{marginLeft: '8%', marginTop: '10%'}}>
      <ConstructPayloadCarousel
        handleShellCodeClick={() => props.handleShellCodeClick()}
        handleNopClick={() => props.handleNopClick()}
        handleReturnAddressClick={() => props.handleReturnAddressClick()}
        index={props.index}
        handleSelect={() => props.handleSelect()}
        controls={props.controls}
        running={props.running}
        nopSled={props.nopSled}
        updateNopSled={(val) => props.updateNopSled(val)}
        startingShell={props.startingShell}
        startingShellChecked={(val)=> props.startingShellChecked(val)}
        gettingRootPriviledges={props.gettingRootPriviledges}
        gettingRootPriviledgesChecked={(val) => props.gettingRootPriviledgesChecked(val)}
        shutDownOs={props.shutDownOs}
        shutDownOsChecked={(val) => props.shutDownOsChecked(val)}
        wipeOs={props.wipeOs}
        wipeOsChecked={(val) => props.wipeOsChecked(val)}
        returnAddress={props.returnAddress}
        updateReturnAddress={(val) => props.updateReturnAddress(val)}
      />
    </div>
    )}
    
  </div>
  )
}
export default ConstructPayload;