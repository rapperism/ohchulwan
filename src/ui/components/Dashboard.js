import { commuteLogic } from '../../features/useCommuteLogic.js';
import { remainingHours, WEEKLY_TARGET_HOURS } from '../../features/useTimeCalculator.js';
import { renderGaugeBar } from './GaugeBar.js';

let previousProgress = 0;

export function renderDashboard(state) {
  const root = document.createElement('main');
  root.className = 'container';

  const remain = remainingHours(state.hoursWorked);
  const progress = Math.min(1, Math.max(0, state.hoursWorked / WEEKLY_TARGET_HOURS));
  const isWorking = state.commuteMode === 'working';
  const workedToday = state.checkInAt ? (Date.now() - state.checkInAt) / 3_600_000 : 0;
  const isNearOffWork = isWorking && workedToday >= 7;
  const shouldDance = progress > previousProgress;
  previousProgress = progress;

  root.innerHTML = `
    <section class="hero">
      <h1>오출완 ✨</h1>
      <p>밝고 신나는 출퇴근 챌린지, 오늘도 파이팅!</p>
    </section>

    <section class="togli-zone">
      <div class="togli ${isWorking ? 'working' : 'off'} ${isNearOffWork ? 'near-off' : ''} ${shouldDance ? 'dance' : ''}">
        <div class="ear left"></div>
        <div class="ear right"></div>
        <div class="ham-body">
          <div class="clock-ring"></div>
          <div class="face">${isWorking ? '•̀ᴗ•́' : 'ᕕ( ᐛ )ᕗ'}</div>
          <div class="hand hour"></div>
          <div class="hand minute"></div>
          ${isWorking ? '<div class="tie"></div>' : ''}
          ${isNearOffWork || state.commuteMode === 'done' ? '<div class="bag">👜</div>' : ''}
          <div class="butt"></div>
        </div>
      </div>
      <p class="togli-name">토글이: ${isNearOffWork ? '퇴근 임박! 가방 챙기고 엉덩이 실룩~' : isWorking ? '출근 완료! 넥타이 장착!' : '퇴근 후 댄스 타임!'}</p>
    </section>

    <section class="card stats">
      <div><strong>남은 시간</strong><span>${remain.toFixed(2)}h</span></div>
      <div><strong>포인트</strong><span>${state.point}P</span></div>
      <div><strong>등급</strong><span>LV.${state.grade}</span></div>
    </section>

    <section class="card" id="gauge-slot"></section>

    <section class="card actions">
      <button class="btn primary" data-act="checkin">출근 완료</button>
      <button class="btn exit" data-act="checkout">${state.loading ? '처리 중...' : '퇴근하기'}</button>
      <div class="manual-row">
        <input type="datetime-local" id="manual-time" />
        <button class="btn soft" data-act="manual">직접 입력</button>
      </div>
      <div class="leave-row">
        <button class="btn soft" data-act="leave4">반차(4h)</button>
        <button class="btn soft" data-act="leave8">연차(8h)</button>
      </div>
      <button class="btn ghost" data-act="undo">5분 내 되돌리기</button>
    </section>

    <section class="card wallet">
      <button class="btn toss" data-act="convert">토스 포인트로 바꾸기</button>
    </section>

    <section class="card logs">
      <h2>이번 주 근무 기록 요약</h2>
      ${Array.from({ length: 10 }, (_, i) => `<p>• Day ${i + 1}: 출근 의지 ${10 - i}/10</p>`).join('')}
    </section>

    ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}
  `;

  root.querySelector('#gauge-slot').appendChild(renderGaugeBar(remain));

  root.querySelector('[data-act="checkin"]').onclick = () => commuteLogic.checkIn();
  root.querySelector('[data-act="checkout"]').onclick = () => void commuteLogic.checkOut();
  root.querySelector('[data-act="manual"]').onclick = () => {
    const val = root.querySelector('#manual-time').value;
    commuteLogic.manualCheckIn(val);
  };
  root.querySelector('[data-act="leave4"]').onclick = () => commuteLogic.addLeave(4);
  root.querySelector('[data-act="leave8"]').onclick = () => commuteLogic.addLeave(8);
  root.querySelector('[data-act="undo"]').onclick = () => commuteLogic.undoRecent();
  root.querySelector('[data-act="convert"]').onclick = () => void commuteLogic.convertPoint();

  return root;
}
