import React from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

function MainFunctionTitle(props) {
 
  const returnMainFunctionTitle = () => {

    var mainTitle = null

    if(props.stepProgramClickNumber === 2 &&
      props.stackFrameDataArr.length === 1 && 
      props.stackFrameDataArr[0].unsafeFunctions.length === 0){

      mainTitle = (
        <h1 className="program-code-hightlight-pop-text-style">int main(int argc, char* argv[])</h1>
      )
    }

    if(props.running === true){
      if(props.stackFrameRunningFunctions.length === 0){
        if(props.stepProgramClickNumber === 0){
          mainTitle = (
            <div style={{display: 'flex'}}>
              <h1 className="program-code-hightlight-text-style">int main(int argc,</h1>&nbsp;
              <h1 className="program-code-hightlight-argv-text-style">char* argv[]</h1>
              <h1 className="program-code-hightlight-text-style">)</h1>
            </div>
          )
        }
        else{
          mainTitle = (
            <div style={{display: 'flex'}}>
              <h1 className="program-code-hightlight-text-style">int main</h1>
              <h1 className="program-code-text-style">(int argc, char* argv[])</h1>
            </div>
          )
        }
      }
      else{
        mainTitle = (
          <h1 className="program-code-text-style">int main(int argc, char* argv[])</h1>
        )
      }
    }
    else{
      mainTitle = (
        <h1 className="program-code-text-style">int main(int argc, char* argv[])</h1>
      )
    }


   // #00e600
    /*else{
      mainTitle = (
        <div style={{display: 'flex'}}>
          <h1 className="program-code-hightlight-text-style">int main(int argc,</h1>&nbsp;
          <h1 className="program-code-hightlight-argv-text-style">char* argv[]</h1>
          <h1 className="program-code-hightlight-text-style">)</h1>
        </div>
      )
    }*/


    return mainTitle
  }

  return(
    returnMainFunctionTitle()
  )
}
export default MainFunctionTitle;