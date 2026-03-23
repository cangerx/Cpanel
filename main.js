const revealNodes = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealNodes.forEach((node) => observer.observe(node));

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const promise = heroVideo.play();
  if (promise && typeof promise.catch === 'function') {
    promise.catch(() => {
      heroVideo.setAttribute('controls', 'controls');
    });
  }
}
