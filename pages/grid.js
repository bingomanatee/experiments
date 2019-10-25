import HeadView from "../views/Head";
import PageHeader from '../views/PageHeader';

import DataGrid from './experiments/DataGrid'

import data from './experiments/states.json';


const columns = [
  {label: "State/region", name: 'name', cells: 5, style: {fontWeight: 'bold'}},
  {label: "Rank", name: 'pop-2018-rank', cells: 2, style: {textAlign: 'right'}},
  {label: "2018", name: 'pop-2018', cells: 4, style: {textAlign: 'right', backgroundColor: '#c5f2ff'}},
  {label: "Rank", name: 'pop-2010-rank', cells: 2, style: {textAlign: 'right', backgroundColor: '#75adda'}},
  {label: "2010", name: 'pop-2010', cells: 4, style: {textAlign: 'right', backgroundColor: '#c7ffdc'}},
  {label: "Rank", name: 'pop-2000-rank', cells: 2, style: {textAlign: 'right', backgroundColor: '#67da9f'}},
  {label: "2000", name: 'pop-2000', cells: 4, style: {textAlign: 'right', backgroundColor: '#cbffb9'}},
  {label: 'Change', name: 'change', cells: 2, style: {textAlign: 'right', backgroundColor: '#86da6a'}},
  {label: 'Geo Sort', name: 'geosort', cells: 4, style: {textAlign: 'right'}}
];
function des(n) {
  if (typeof n === 'string') return n.replace(/"/g, '');
  return n;
}
data.forEach((row, i) => {
  const o =  {};

  columns.forEach((cd,j) => {
    o[cd.name] = des(row[j]);
  });
  data[i] = o;
});

function Grid() {
  return <div>
    <HeadView/>
    <PageHeader active="home"/>
    <main>
      <article>
        <h1>CSS Grid DataTable with collapsing columns</h1>
        <p>
          CSS Grids can auto-flow cells. You can use this to place content and headers on a consistent grid
          whose cells wrap to fill the available space, even if they are not the same size. with <code>grid-template-rows: repeat(auto-fill, auto) 0;
        </code> as the row definition, the layout will automatically make space for the content. The first cell is given
          span 2, which (given the last row definition of height 0) will fill up at least two rows to set it apart,
          but on a 1-row layout won't look any different (because of the last row width 0).
        </p>
        <p>
          the trick here is that each cell has a <code>span</code> from 2-5 in this example, and the react code
          defines a number of columns equal to the greatest number of columns that can fill the available space
          <code>(round(width/cellPX))</code>. Each cell in the header and rows have a <code>grid-column-end: span [columnSpan]</code>
          but no fixed column or row start.
        </p>
        <p>
          Because the cells aren't anchored in the grid they will fill up the greatest number of columns they can or
          wrap to the next rows.
        </p>
        <p><b>Shrink the page width</b> to see how the columns responsively wrap. </p>
        <DataGrid columns={columns} data={data}/>
      </article>
    </main>
  </div>
}

export default Grid
