import { BehaviorSubject } from 'rxjs';

const INITIAL_STATE = {
  scrollRef: false,
  scrollTop: 0,
  scrollContainerSize: { width: 100, height: 100 },
  scrollAreaHeight: 200,
  markers: [],
  markers2: [],
};

let state = { ...INITIAL_STATE };
const store = new BehaviorSubject(state);

function getDomPos(dom, tag) {
  const ys = [];
  const bolds = dom.getElementsByTagName(tag);
  for (let i = 0; i < bolds.length; ++i) {
    const y = bolds[i].offsetTop;
    ys.push(y);
  }
  return ys;
}

export const update = () => {
  console.log('update');
  if (state.scrollRef) {
    state = {
      ...state,
      scrollAreaHeight: state.scrollRef.scrollHeight,
      scrollTop: state.scrollRef.scrollTop,
    };

    state.markers = getDomPos(state.scrollRef, 'B');
    state.markers2 = getDomPos(state.scrollRef, 'I');
  }
  store.next(state);
};

export const setSize = (scrollContainerSize) => {
  state = { ...state, scrollContainerSize };
  update();
};

export const setScrollRef = (scrollRef) => {
  if (scrollRef) {
    scrollRef.addEventListener('scroll', update);
  }

  state = { ...state, scrollRef };
  update();
};


export { store };
