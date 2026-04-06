import { loadState, saveState } from '../infrastructure/localCache.js';

const initialState = {
  hoursWorked: 0,
  point: 0,
  trustScore: 0,
  grade: 1,
  commuteMode: 'none',
  checkInAt: null,
  checkOutAt: null,
  loading: false,
  toast: null,
  history: [],
};

let state = { ...initialState, ...loadState() };
const listeners = new Set();

function emit() {
  saveState(state);
  listeners.forEach((fn) => fn(state));
}

export const appStore = {
  getState() {
    return state;
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  update(patch) {
    state = { ...state, ...patch };
    emit();
  },
  saveSnapshot() {
    const snap = {
      at: Date.now(),
      data: {
        hoursWorked: state.hoursWorked,
        point: state.point,
        commuteMode: state.commuteMode,
        checkInAt: state.checkInAt,
        checkOutAt: state.checkOutAt,
      },
    };
    state = { ...state, history: [snap, ...state.history].slice(0, 10) };
    emit();
  },
  undoRecent() {
    const latest = state.history[0];
    if (!latest || Date.now() - latest.at > 5 * 60_000) return false;
    state = {
      ...state,
      ...latest.data,
      history: state.history.slice(1),
      toast: '최근 작업을 되돌렸어요.',
    };
    emit();
    return true;
  },
};
