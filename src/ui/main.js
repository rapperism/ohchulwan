import { renderDashboard } from './components/Dashboard.js';
import { appStore } from '../store/useAppStore.js';

const app = document.getElementById('app');

function startLenis() {
  if (!window.Lenis) return;
  const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

function render() {
  app.innerHTML = '';
  app.appendChild(renderDashboard(appStore.getState()));
}

appStore.subscribe(render);
render();
startLenis();
