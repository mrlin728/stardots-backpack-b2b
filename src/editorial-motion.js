import { useEffect } from 'react';

export function useEditorialMotion(path) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let teardown = () => {};
    let generation = 0;
    let mounted = true;
    async function start() {
      const current = ++generation;
      teardown();
      if (preference.matches) return;
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
      if (!mounted || current !== generation || preference.matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: .9, smoothWheel: true, syncTouch: false, anchors: true, prevent: node => Boolean(node.closest?.('.main-nav.is-open,.model-lightbox')) });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = time => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const context = gsap.context(() => {
        gsap.from('.hero-industrial h1', { y: 24, duration: 0.9, ease: 'power3.out', clearProps: 'transform' });
        gsap.from('.configurator-card', { y: 28, duration: 1.0, ease: 'power3.out', clearProps: 'transform' });
        document.querySelectorAll('.lab-card,.branding-pill-card,.stat-pill-box,.model-card,.section-heading').forEach(element => {
          gsap.from(element, { y: 20, duration: .65, ease: 'power2.out', clearProps: 'transform', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
      });
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh, { once: true });
      teardown = () => { active = false; window.removeEventListener('load', refresh); context.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
    }
    const activate = () => { start().catch(() => {}); };
    activate(); preference.addEventListener('change', activate);
    return () => { mounted = false; generation++; preference.removeEventListener('change', activate); teardown(); };
  }, [path]);
}
