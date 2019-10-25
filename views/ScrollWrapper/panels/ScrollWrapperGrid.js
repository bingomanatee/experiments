import styled from 'styled-components';
import withSize from 'react-sizeme';
import React, { PureComponent } from 'react';

import { TOP_MARGIN, RIGHT_MARGIN, BOTTOM_MARGIN } from '../config.json';

import ScrollContext from '../ScrollContext';

const ScrollWrapperFrameView = styled.main`
display: grid;
width: 100%;
height: 100%;
margin: 0;
padding: 0;
grid-template-columns: [left] auto [right-margin] ${RIGHT_MARGIN}px [right];
grid-template-rows: [top] ${TOP_MARGIN}px [top-margin] auto [bottom-margin] ${BOTTOM_MARGIN}px [bottom];
`;


export default withSize({ monitorHeight: true })(class ScrollWrapperFrame extends PureComponent {
  static contextType = ScrollContext;

  componentDidMount() {
    console.log('context: ', this.context);
    this.context.setSize(this.props.size);
  }

  render() {
    return (
      <ScrollWrapperFrameView>{this.props.children}</ScrollWrapperFrameView>
    );
  }
});
