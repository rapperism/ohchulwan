export function calculateReward(base, grade) {
  const multi = grade === 3 ? 1.8 : grade === 2 ? 1.4 : 1;
  return Math.round(base * multi);
}
