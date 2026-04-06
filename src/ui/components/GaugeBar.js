export function renderGaugeBar(remaining) {
  const wrap = document.createElement('div');
  wrap.className = 'gauge-wrap';
  const ratio = Math.max(0, Math.min(1, remaining / 40));

  wrap.innerHTML = `
    <div class="gauge-track"><div class="gauge-fill"></div></div>
    <p class="gauge-label">이번 주 남은 근무: ${remaining.toFixed(2)}h</p>
  `;

  const fill = wrap.querySelector('.gauge-fill');
  if (window.gsap) {
    window.gsap.to(fill, { width: `${ratio * 100}%`, duration: 0.9, ease: 'elastic.out(1, 0.6)' });
  } else {
    fill.style.width = `${ratio * 100}%`;
  }

  return wrap;
}
