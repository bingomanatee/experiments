import React from 'react';
import { setScrollRef, update, setSize } from './scrollStore';

export default React.createContext({
  setScrollRef,
  update,
  setSize,
});
