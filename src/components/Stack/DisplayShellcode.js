import React from "react";

function DisplayShellcode(props) {
 
  const shellcode = (props) => {
    if(props.startingShell === true){
      return(
        <div className="payload-diagram-text">\xF3\xDD\xA2\xC9\xAA\xD3</div>
      )
    }
    if(props.gettingRootPriviledges === true){
      return(
        <div className="payload-diagram-text">\xCC\xB\xBB\xA1\x7B\xC8\xF4\xC6</div>
      )
    }
    if(props.shutDownOs === true){
      return(
        <div className="payload-diagram-text">\xFF\D3\x99\xA0</div>
      )
    }
    if(props.wipeOs === true){
      return(
        <div className="payload-diagram-text">\FA\xDA\x00\xB0\x77</div>
      )
    }
  }

  return(
    shellcode(props)
  )
}
export default DisplayShellcode;