import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import StartPage from "./startPage";
import Functions from "./functions";
import Stack from "./stack"
import "./App.css";


function App() {
  //"ENUM" to represent the index of the views
  const views = {
    START_VIEW: 0,
    FUNCTIONS_VIEW: 1,
    STACK_VIEW: 2,
  };

  /* ##########################################################################################
   * Constants to control the views
   */
  const [index, setIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [stackFrameDataArr, setStackFrameDataArr] = useState([]);
  const [cleanStackFrameDataArr, setCleanStackFrameDataArr] = useState([]);


  /* ##########################################################################################
   * View handler as specified in React Carousel documentations.
   */
  const handleSelect = (selectedIndex, showControls, e) => {
    setIndex(selectedIndex);
    if (selectedIndex === views.CHOSEN_VIEW && showControls) {
      setShowControls(true);
    } else if (selectedIndex === views.CHOSEN_VIEW && !showControls) {
      setShowControls(false);
    }
    else {
      setShowControls(false);
    }
  };

  /* ##########################################################################################
   * Below are the button click handlers
   */
  const handleStartClick = () => {
    handleSelect(views.FUNCTIONS_VIEW);
  };
  const handleStackClick = (stackFrameDataArr) => {
    handleSelect(views.STACK_VIEW)
    setStackFrameDataArr(stackFrameDataArr)
  };
  const goBack = () => {
    handleSelect(views.FUNCTIONS_VIEW);
  };

  const sendCleanStackFrameArray = (cleanStackFrameDataArr) => {
    setCleanStackFrameDataArr(cleanStackFrameDataArr)
  }



  /*##########################################################################################*/
  //The different pages are different carousel items.
  return (
    <div className="app">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        controls={showControls}
        wrap={false}
        interval={null}
        indicators={false}
      >
        <Carousel.Item id="start-view">
          <StartPage onStartClick={handleStartClick} />
        </Carousel.Item>
        <Carousel.Item id="function-view">
          <Functions onStartClick={handleStackClick} sendCleanStackFrameArray={sendCleanStackFrameArray}/>
        </Carousel.Item>
        <Carousel.Item id="stack-view">
          <Stack stackFrameDataArr={stackFrameDataArr} cleanStackFrameDataArr={cleanStackFrameDataArr} goBack={goBack}/>
        </Carousel.Item>
      </Carousel>

    </div>
  );
}
export default App;
