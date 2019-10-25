import React, { PureComponent } from 'react';

import ScrollWrapperFrame from './panels/ScrollWrapperGrid';
import ScrollWrapperScroll from './panels/ScrollWrapperScroll';
import ScrollWrapperMain from './panels/ScrollWrapperMain';
import DummyTranscript from './DummyTranscript';
import { setScrollRef, update, setSize } from './scrollStore';

import ScrollContext from './ScrollContext';

export default class ScrollWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.transcriptRef = React.createRef();
  }

  componentDidMount() {
  }

  render() {
    return (
      <ScrollContext.Provider value={({ update, setScrollRef, setSize })}>
        <ScrollWrapperFrame>
          <ScrollWrapperScroll className="ScrollWrapperScroll" />
          <ScrollWrapperMain
            id="scrolling-region"
            ref={setScrollRef}
          >
            <DummyTranscript />
          </ScrollWrapperMain>
        </ScrollWrapperFrame>
      </ScrollContext.Provider>
    );
  }
}
