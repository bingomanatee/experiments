import HeadView from "../views/Head";
import PageHeader from '../views/PageHeader';

function Home() {
  return <div>
    <HeadView/>
    <PageHeader active="home"/>
    <main>
      <article>
        <h1>HTML Experiments</h1>
        <p>
          This is a workspace for HTML experiments and trials of stuff too swidgy to jsFiddle.
        </p>
      </article>
    </main>
  </div>
}

export default Home
