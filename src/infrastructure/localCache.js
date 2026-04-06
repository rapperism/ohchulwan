const KEY = 'ohchulwan-mvp-v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveState(state) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      hoursWorked: state.hoursWorked,
      point: state.point,
      trustScore: state.trustScore,
      grade: state.grade,
      commuteMode: state.commuteMode,
      checkInAt: state.checkInAt,
      checkOutAt: state.checkOutAt,
      history: state.history,
    }),
  );
}
