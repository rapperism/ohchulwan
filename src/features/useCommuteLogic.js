import { watchRewardAd } from '../infrastructure/AdSDK.js';
import { convertToTossPoint } from '../infrastructure/TossBridge.js';
import { appStore } from '../store/useAppStore.js';
import { calculateReward } from './useRewardSystem.js';
import { applyLeave, calculateWorkHours, gradeByTrustScore } from './useTimeCalculator.js';

function setToast(msg) {
  appStore.update({ toast: msg });
}

export const commuteLogic = {
  checkIn(now = Date.now()) {
    const s = appStore.getState();
    if (s.commuteMode === 'working') return setToast('이미 출근 상태예요!');
    appStore.saveSnapshot();

    const d = new Date(now);
    const bonus = d.getHours() < 9 || (d.getHours() === 9 && d.getMinutes() <= 30) ? 5 : 0;
    const trustScore = s.trustScore + bonus;
    appStore.update({
      trustScore,
      grade: gradeByTrustScore(trustScore),
      commuteMode: 'working',
      checkInAt: now,
      checkOutAt: null,
      toast: bonus ? '정시 출근 성공! 신뢰도 +5' : '출근 기록 완료!'
    });
  },

  manualCheckIn(iso) {
    const time = new Date(iso).getTime();
    if (Number.isNaN(time)) return setToast('시간 형식을 확인해 주세요.');
    appStore.saveSnapshot();
    appStore.update({ commuteMode: 'working', checkInAt: time, checkOutAt: null, toast: '수동 출근 완료(보너스 없음)' });
  },

  async checkOut(now = Date.now()) {
    const s = appStore.getState();
    if (s.commuteMode !== 'working' || !s.checkInAt) return setToast('먼저 출근을 기록해 주세요.');
    if ((now - s.checkInAt) / 3_600_000 < 4) return setToast('4시간 이내 퇴근은 불가해요 😅');

    appStore.saveSnapshot();
    appStore.update({ loading: true, toast: '광고 재생 중...' });

    await watchRewardAd();
    const worked = calculateWorkHours(s.checkInAt, now);
    const reward = calculateReward(100, s.grade);
    appStore.update({
      loading: false,
      hoursWorked: Number((s.hoursWorked + worked).toFixed(2)),
      point: s.point + reward,
      commuteMode: 'done',
      checkOutAt: now,
      toast: `퇴근 완료! ${worked}h 누적 + ${reward}P 획득`,
    });
  },

  addLeave(hours) {
    const s = appStore.getState();
    appStore.saveSnapshot();
    appStore.update({ hoursWorked: applyLeave(s.hoursWorked, hours), toast: `${hours}시간 휴가 처리 완료!` });
  },

  async convertPoint() {
    const s = appStore.getState();
    if (s.point < 100) return setToast('최소 100P부터 전환 가능해요.');
    const amount = Math.floor(s.point / 100) * 100;
    appStore.update({ loading: true });
    const res = await convertToTossPoint(amount);
    if (!res.success) return appStore.update({ loading: false, toast: '전환 실패. 잠시 후 다시 시도해 주세요.' });
    appStore.update({ loading: false, point: s.point - amount, toast: `토스 포인트 ${amount}P 전환 성공!` });
  },

  undoRecent() {
    if (!appStore.undoRecent()) setToast('되돌릴 기록이 없거나 5분이 지났어요.');
  }
};
