import styled from 'styled-components';
import withSize from 'react-sizeme';
import React from 'react';

const ScrollWrapperMain = styled.section`
grid-column: left / right-margin;
grid-row: top-margin / bottom-margin;
background-color: white;
z-index: 100;
overflow: scroll;
`;

export default React.forwardRef((props, ref) => (
  <ScrollWrapperMain ref={ref}>{props.children}</ScrollWrapperMain>
));
