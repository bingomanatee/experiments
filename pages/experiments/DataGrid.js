import React, {Component} from 'react';
import withSize from 'react-sizeme';
import styled from 'styled-components';
import uuid from 'uuid/v4';

const GRID_CELL_UNITS = 40;

class ColumnGridDef extends Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.size.width !== this.props.size.width;
  }

  markup() {
    const {size, gridId, columns} = this.props;
    const cells = [];
    console.log('size: ', size);
    const columnSpacers = [];
    for (let i = 0; i < columns.length; ++i) columnSpacers.push(0);
    const cellCount = Math.round(Math.max(size.width / GRID_CELL_UNITS, 1));
    return {
      __html: `
    .grid-${gridId} {
    width: ${cellCount * GRID_CELL_UNITS}px;
    display: grid;
    grid-template-rows: repeat(auto-fill, auto) ${columnSpacers.join(' ')};
    grid-template-columns: [left] repeat(${cellCount}, ${GRID_CELL_UNITS}px);
    }
    `
    }
  }

  render() {
    return <style dangerouslySetInnerHTML={this.markup()}>
    </style>
  }
}

const Header = styled.div`
border-bottom: 1px solid black;
font-weight: bold;
`;

const Cell = styled.span`
padding: 2px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
`;

const Row = styled.div`

border-bottom: 1px solid rgba(0,0,0,0.2);
`;

const Wrapper = styled.div`
width: 100%;
`;

class DataGrid extends Component {

  constructor(props) {
    super(props);

    this.state = {id: uuid()}
  }

  render() {
    const {id} = this.state;
    const {columns, data, size} = this.props;
    return <>
      <ColumnGridDef columns={columns} size={size} gridId={id}/>
      <section>
        <Header className={`grid-${id}`}>
          {columns.map(({name, label, cells, style}, c) => {
              if (c === 0) {
                return (<Cell key={name} style={({
                    gridColumnEnd: `span ${cells || 1}`,
                    gridColumnStart: 'left',
                    gridRowEnd: `span ${columns.length}`,
                    ...(style || {})
                  })}>{label}</Cell>
                )
              }
              return (
                <Cell key={name} style={({
                  gridColumnEnd: `span ${cells || 1}`,
                  ...(style || {})
                })}>{label}</Cell>
              );
            }
          )}
        </Header>
        {data.map((row, i) => {
          return <Row key={i} className={`grid-${id}`}>
            {columns.map(({name, label, cells, style}, c) => {
                  if (c === 0) {
                    return (<Cell key={name} style={({
                        gridColumnEnd: `span ${cells || 1}`,
                        gridColumnStart: 'left',
                        gridRowEnd: `span ${columns.length}`,
                        ... (style || {})
                      })}>{row[name]}</Cell>
                    )
                  }
                  return (
                    <Cell key={name} style={({
                      gridColumnEnd: `span ${cells || 1}`,
                      ...(style || {})
                    })}>{row[name]}</Cell>
                  );
                }
              )}
          </Row>
        })}
      </section>
    </>
  }
}

export default withSize()((props) => {
  return <Wrapper>
    <DataGrid {...props} />
  </Wrapper>
});
