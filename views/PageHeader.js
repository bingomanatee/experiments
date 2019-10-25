import React, {useState} from 'react';
import Logo from './icons/Logo';

function PageHeader(props) {
  const {active} = props;
  const [showHM, setShowHM] = useState(false);
  const activeIf = (n) => n === active ? 'active' : '';

  return <header className="page-head">
    <Logo id="logo" onClick={() => setShowHM(!showHM)}/>
    <nav id="header-menu" style={{display: showHM ? 'block' : 'none'}}>
      <h2>Experiments</h2>
      <a href="/" className={activeIf('home')}>Home</a>
      <a href="/grid" className={activeIf('grid')}>Grid</a>
      <a href="/inspector" className={activeIf('inspector')}>Inspector</a>
      <a href="/scrollWrapper" className={activeIf('scrollWrapper')}>Scroll Wrapper</a>
    </nav>
  </header>
}

export default PageHeader;
