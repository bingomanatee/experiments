import HeadView from "../views/Head";
import PageHeader from '../views/PageHeader';

import ScrollWrapper from "../views/ScrollWrapper";

function Grid() {
  return <div>
    <HeadView/>
    <PageHeader active="scrollWrapper"/>
    <main>
      <article>
        <h1>Scrolling Panel with Wrapping bookmarks</h1>
        <p>
          A lot of navbars are horizontal; that makes sense -- unless they are tied to a transcript,
          which has vertical ordinality. Wny not take advantage of more area and tie the navigation to the outer edges,'
          seperating the stuff above and the stuff below naturally?
        </p>
        <div style={({height: '80vh'})}>
        <ScrollWrapper />
        </div>
      </article>
    </main>
  </div>
}

export default Grid
