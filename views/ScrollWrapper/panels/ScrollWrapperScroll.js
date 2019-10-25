import styled from 'styled-components';
import withSize from 'react-sizeme';
import React, { Component } from 'react';
import _ from 'lodash';
import { BOTTOM_MARGIN, RIGHT_MARGIN, TOP_MARGIN } from '../config.json';
import { store } from '../scrollStore';

const { SVG } = require('@svgdotjs/svg.js');

const SCROLL_COLOR = 'rgb(84,88,111)';
const SCROLL_COLOR_2 = 'rgb(84,88,111)';
const MARKER_COLOR = 'rgb(147,230,30)';
const SCROLL_SHADOW_COLOR = 'rgba(0,51,102, 0.2)';
const SCROLL_MARGIN = 4;
const SCROLL_MARGIN_V = 2;
const ScrollWrapperScroll = styled.div`
grid-column: left / right;
grid-row: top / bottom;
display: flex;
flex-direction: column;
justify-content: stretch;
align-items: stretch;
position: relative;
`;

const r = (a) => a.map((n) => Math.round(n));

const d2r = Math.PI / 180;

function stupidArc([cX, cY],
  [widthR, heightR],
  [startAngle, endAngle, inc]) {
  const points = [];

  const pointFor = (a) => {
    const cos = Math.cos(a * d2r);
    const sin = Math.sin(a * d2r);

    const x = cX + (cos * widthR);
    const y = cY + (sin * heightR);
    return `${Math.round(x)},${Math.round(y)}`;
  };
  let a = startAngle;
  const count = 0;
  while (a === startAngle || a === endAngle
  || _.inRange(a, _.min([startAngle, endAngle]),
    _.max([startAngle, endAngle]))) {
    points.push(pointFor(a));
    a += inc;
    if (count > 300) {
      break;
    }
  }
  points.push(pointFor(endAngle));

  return ` ${points.join(' ')} `;
}


export default withSize({ monitorHeight: true })(class ScrollWrapperOuter extends Component {
  constructor(props) {
    super(props);

    this.svgRef = React.createRef();

    this.state = { scrollAreaHeight: 0, scrollHeight: 0, markers: [] };
    this.markerRects = [];
    this.markerRects2 = [];
    this.adjustScroll = _.throttle(this.adjustScroll.bind(this), 50);
  }

  get width() {
    return _.get(this, 'props.size.width', 0);
  }

  get height() {
    return _.get(this, 'props.size.height', 0);
  }

  draw() {
    if (!this.svgRef.current) {
      return;
    }
    if (!_.isEqual(this.initialized, [this.width, this.height])) {
      this.initialize();
    }

    this.adjustScroll();
  }

  adjustScroll() {
    console.log('adjustScroll');

    const {
      scrollAreaHeight, scrollTop, markers, markers2,
    } = this.state;
    const maxScroll = (scrollAreaHeight - this.transcriptHeight);
    const ratio = scrollTop / maxScroll;
    const aboveRatio = _.clamp(ratio, 0, 1);

    if (this.topRect) {
      this.topRect.attr({
        x: this.width * (1 - aboveRatio),
        width: this.width * aboveRatio,
      });
    }
    if (this.topRect2) {
      this.topRect2.attr({
        x: this.width * (1 - aboveRatio),
        width: this.width * aboveRatio,
      });
    }

    if (this.bottomRect) {
      this.bottomRect.attr({
        width: this.width * (1 - aboveRatio),
        x: this.width * (aboveRatio),
      });
    }

    if (this.bottomRect2) {
      this.bottomRect2.attr({
        width: this.width * (1 - aboveRatio),
        x: this.width * (aboveRatio),
      });
    }

    this.markerRects.forEach((e, i) => {
      if (!this._drawer.has(e)) {
        this.markerRects[i] = null;
      }
    });
    this.markerRects2.forEach((e, i) => {
      if (!this._drawer.has(e)) {
        this.markerRects2[i] = null;
      }
    });

    const V_WIDTH = RIGHT_MARGIN/2;
    const H_HEIGHT = 8;
    markers.forEach((value, index) => {
      if (!this.markerRects[index]) {
        this.markerRects[index] = this._drawer.rect(4, TOP_MARGIN);
      }
      let x = this.transcriptWidth + RIGHT_MARGIN / 2;
      let y = 0;
      let width = 0;
      let height = 0;
      const scrollBottom = scrollTop + this.transcriptHeight;
      if (value < scrollTop) {
        const markerRatio = (maxScroll - scrollTop + value) / maxScroll;
        x = markerRatio * this.transcriptWidth;
        width = V_WIDTH;
        height = TOP_MARGIN / 2;
      } else if (value > scrollBottom) {
        x = this.transcriptWidth * (
          (maxScroll - (value - scrollBottom)) / maxScroll);
        y = this.transcriptBottom + (BOTTOM_MARGIN / 2);
        width = V_WIDTH;
        height = BOTTOM_MARGIN / 2;
      } else {
        y = value - scrollTop;
        width = V_WIDTH;
        height = H_HEIGHT;
      }
      this.markerRects[index]
        .x(x)
        .y(y)
        .width(width)
        .height(height)
        .fill(MARKER_COLOR);
    });
    markers2.forEach((value, index) => {
      if (!this.markerRects2[index]) {
        this.markerRects2[index] = this._drawer.rect(4, TOP_MARGIN);
      }
      let x = this.transcriptWidth;
      let y = TOP_MARGIN/2;
      let width = 0;
      let height = 0;
      const scrollBottom = scrollTop + this.transcriptHeight;
      if (value < scrollTop) {
        const markerRatio = (maxScroll - scrollTop + value) / maxScroll;
        x = markerRatio * this.transcriptWidth;
        width = V_WIDTH;
        height = TOP_MARGIN / 2;
      } else if (value > scrollBottom) {
        x = this.transcriptWidth * (
          (maxScroll - (value - scrollBottom)) / maxScroll);
        y = this.transcriptBottom;
        width = V_WIDTH;
        height = BOTTOM_MARGIN / 2;
      } else {
        y = value - scrollTop;
        width = V_WIDTH;
        height = H_HEIGHT;
      }
      this.markerRects2[index]
        .x(x)
        .y(y)
        .width(width)
        .height(height)
        .fill(MARKER_COLOR);
    });
  }

  get transcriptWidth() {
    return this.width - RIGHT_MARGIN;
  }

  get transcriptBottom() {
    return this.height - BOTTOM_MARGIN;
  }

  get transcriptHeight() {
    return this.height - (TOP_MARGIN + BOTTOM_MARGIN);
  }

  upperRightArc(inner) {
    let radius = [RIGHT_MARGIN, TOP_MARGIN];
    if (inner) {
      radius = [(RIGHT_MARGIN - SCROLL_MARGIN) / 2, (TOP_MARGIN - SCROLL_MARGIN_V) / 2];
    }
    return stupidArc(
      [this.transcriptWidth, TOP_MARGIN],
      radius,
      [270, 360, inner ? 20 : 10],
    );
  }

  bottomRightArc(inner = false) {
    let radius = [RIGHT_MARGIN, BOTTOM_MARGIN];
    if (inner) {
      radius = [(RIGHT_MARGIN - SCROLL_MARGIN) / 2, (BOTTOM_MARGIN - SCROLL_MARGIN_V) / 2];
    }
    return stupidArc(
      [this.transcriptWidth, this.transcriptBottom],
      radius,
      [0, 90, inner ? 20 : 10],
    );
  }

  bottomRightInnerArc() {
    return stupidArc(
      [this.transcriptWidth, this.transcriptBottom],
      [this.midRightMargin(false), (SCROLL_MARGIN_V + BOTTOM_MARGIN) / 2],
      [90, 0, -10],
    );
  }

  upperRightInnerArc() {
    return stupidArc(
      [this.transcriptWidth, TOP_MARGIN],
      [this.midRightMargin(), this.midTopMargin()],
      [360, 270, -10],
    );
  }

  midRightMargin(inner = false) {
    return RIGHT_MARGIN / 2 + (SCROLL_MARGIN / (inner ? -2 : 2));
  }

  innerMidWidth(inner = false) {
    return this.transcriptWidth + this.midRightMargin(inner);
  }

  midTopMargin(inner = false) {
    return (TOP_MARGIN) / 2 + SCROLL_MARGIN_V / (inner ? -2 : 2);
  }

  topMargin(inner = false) {
    return TOP_MARGIN / 2 + SCROLL_MARGIN_V / (inner ? 2 : -2);
  }

  bottomMid(inner = false) {
    return this.height - BOTTOM_MARGIN / 2 - SCROLL_MARGIN_V / (inner ? 2 : -2);
  }

  outerArc(mode = 'all') {
    // order is inner to outer, left to right
    const topXs = [0, this.transcriptWidth];
    const topYs = [this.topMargin(false), 0];
    const rightXs = [this.innerMidWidth(), this.width];
    const bottomXs = topXs;
    const bottomYs = [this.bottomMid(false), this.height];
    const transcriptYs = [TOP_MARGIN, this.transcriptBottom];

    switch (mode) {
      case 'top':
        return `${topXs[0]},${topYs[1]}
    ${topXs[1]},${topYs[1]}
    
    ${this.upperRightArc()}
    
    ${rightXs[1]},${transcriptYs[0]}
    ${rightXs[0]},${transcriptYs[0]}
    
    ${this.upperRightInnerArc()}
    
    ${topXs[1]},${topYs[0]}
    ${topXs[0]},${topYs[0]}`;
        break;

      case 'bottom':
        return `
    ${rightXs[1]},${transcriptYs[1]}
    
    ${this.bottomRightArc()}
    
    ${bottomXs[1]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[0]}
    
    ${this.bottomRightInnerArc()}
    
    ${rightXs[0]},${transcriptYs[1]}`;
        break;

      default:
        return `${topXs[0]},${topYs[1]}
    ${topXs[1]},${topYs[1]}
    
    ${this.upperRightArc()}
    
    ${rightXs[1]},${transcriptYs[0]}
    ${rightXs[1]},${transcriptYs[1]}
    
    ${this.bottomRightArc()}
    
    ${bottomXs[1]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[0]}
    
    ${this.bottomRightInnerArc()}
    
    ${rightXs[0]},${transcriptYs[1]}
    ${rightXs[0]},${transcriptYs[0]}
    
    ${this.upperRightInnerArc()}
    
    ${topXs[1]},${topYs[0]}
    ${topXs[0]},${topYs[0]}`;
    }
  }

  innerArc() {
    // order is inner to outer, left to right
    const topXs = r([0, this.transcriptWidth]);
    const topYs = r([TOP_MARGIN, this.topMargin(true)]);
    const rightXs = r([this.transcriptWidth, this.innerMidWidth(true)]);
    const bottomXs = topXs;
    const bottomYs = r([this.transcriptBottom, this.bottomMid(true)]);
    const transcriptXs = [0, this.transcriptWidth];
    const transcriptYs = r([TOP_MARGIN, this.transcriptBottom]);

    const topArc = `${topXs[0]},${topYs[1]}
    ${topXs[1]},${topYs[1]}
    
    ${this.upperRightArc(true)}
    
    ${rightXs[1]},${transcriptYs[0]}
    ${rightXs[1]},${transcriptYs[1]}
    
    ${this.bottomRightArc(true)}
    
    ${bottomXs[1]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[1]}
    ${bottomXs[0]},${bottomYs[0]}
    
    ${rightXs[0]},${transcriptYs[1]}
    ${rightXs[0]},${transcriptYs[0]}
    
    ${topXs[1]},${topYs[0]}
    ${topXs[0]},${topYs[0]}`;
    console.log('bottom arc:', topArc);
    return topArc;
  }

  initialize() {
    const drawer = SVG(this.svgRef.current).size(this.width, this.height).clear();

    this.shadow = drawer.polygon(`${this.outerArc()} ${this.innerArc()}`).fill(SCROLL_SHADOW_COLOR);

    const outerUpperMask = drawer.mask().add(drawer.polygon(this.outerArc('top')).fill('white'));
    const innerUpperMask = drawer.mask().add(drawer.polygon(this.innerArc('top')).fill('white'));

    const outerLowerMask = drawer.mask().add(drawer.polygon(this.outerArc('bottom')).fill('white'));
    const innerLowerMask = drawer.mask().add(drawer.polygon(this.innerArc('bottom')).fill('white'));


    this.topRect = drawer.rect(this.width, TOP_MARGIN).attr({ x: 0, y: 0 })
      .fill(SCROLL_COLOR);
    this.topRect.maskWith(outerUpperMask);

    this.topRect2 = drawer.rect(this.width, TOP_MARGIN).attr({ x: 0, y: 0 })
      .fill(SCROLL_COLOR_2);
    this.topRect2.maskWith(innerUpperMask);

    this.bottomRect = drawer.rect(this.width, BOTTOM_MARGIN).attr({ x: 0, y: this.transcriptBottom })
      .fill(SCROLL_COLOR);
    this.bottomRect.maskWith(outerLowerMask);

    this.bottomRect2 = drawer.rect(this.width, BOTTOM_MARGIN).attr({ x: 0, y: this.transcriptBottom })
      .fill(SCROLL_COLOR_2);
    this.bottomRect2.maskWith(innerLowerMask);

    this.rightRect = drawer.rect((RIGHT_MARGIN - SCROLL_MARGIN) / 2, this.transcriptHeight)
      .attr({ x: this.innerMidWidth(), y: TOP_MARGIN })
      .fill(SCROLL_COLOR);

    this.rightRect2 = drawer.rect((RIGHT_MARGIN - SCROLL_MARGIN) / 2, this.transcriptHeight)
      .attr({ x: this.transcriptWidth, y: TOP_MARGIN })
      .fill(SCROLL_COLOR_2);
    this.initialized = [this.width, this.height];

    this._drawer = drawer;
  }

  componentDidMount() {
    this.sub = store.subscribe(({
      scrollTop, scrollAreaHeight, markers, markers2,
    }) => {
      this.setState({
        scrollAreaHeight, scrollTop, markers, markers2,
      });
    });
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  componentDidUpdate() {
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  render() {
    return (
      <ScrollWrapperScroll>
        <svg
          ref={this.svgRef}
          style={({
            position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          })}
        />
      </ScrollWrapperScroll>
    );
  }
});
