export const WEEKLY_TARGET_HOURS = 40;

export function calculateWorkHours(checkInAt, checkOutAt) {
  const worked = (checkOutAt - checkInAt) / 3_600_000 - 1;
  return Math.max(0, Math.min(24, Number(worked.toFixed(2))));
}

export function applyLeave(hoursWorked, leaveHours) {
  return Number(Math.min(WEEKLY_TARGET_HOURS, hoursWorked + leaveHours).toFixed(2));
}

export function remainingHours(hoursWorked) {
  return Number(Math.max(0, WEEKLY_TARGET_HOURS - hoursWorked).toFixed(2));
}

export function gradeByTrustScore(score) {
  if (score >= 30) return 3;
  if (score >= 10) return 2;
  return 1;
}
