const revealNodes = document.querySelectorAll('.cp-reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('cp-is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealNodes.forEach((node) => observer.observe(node));

const heroVideo = document.querySelector('.cp-hero-video');
if (heroVideo) {
  const promise = heroVideo.play();
  if (promise && typeof promise.catch === 'function') {
    promise.catch(() => {
      heroVideo.setAttribute('controls', 'controls');
    });
  }
}

const installModal = document.querySelector('[data-install-modal]');
const openInstallButtons = document.querySelectorAll('[data-open-install-modal]');
const closeInstallButtons = document.querySelectorAll('[data-close-install-modal]');
const copyCommandButtons = document.querySelectorAll('[data-copy-command]');

if (installModal && openInstallButtons.length) {
  const closeAnimationMs = 220;
  let closeTimer = null;

  const toggleInstallModal = (shouldOpen) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    if (shouldOpen) {
      installModal.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        installModal.classList.add('cp-modal-visible');
        installModal.classList.remove('cp-modal-closing');
      });
      return;
    }

    installModal.classList.remove('cp-modal-visible');
    installModal.classList.add('cp-modal-closing');
    closeTimer = setTimeout(() => {
      installModal.hidden = true;
      installModal.classList.remove('cp-modal-closing');
      document.body.style.overflow = '';
      closeTimer = null;
    }, closeAnimationMs);
  };

  openInstallButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      toggleInstallModal(true);
    });
  });

  closeInstallButtons.forEach((button) => {
    button.addEventListener('click', () => {
      toggleInstallModal(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !installModal.hidden) {
      toggleInstallModal(false);
    }
  });
}

if (copyCommandButtons.length) {
  const resetTimers = new WeakMap();

  const writeToClipboard = async (text) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', 'readonly');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  };

  copyCommandButtons.forEach((button) => {
    const defaultLabel = button.textContent.trim();

    button.addEventListener('click', async () => {
      const copyText = button.getAttribute('data-copy-command') || '';
      if (!copyText) {
        return;
      }

      try {
        await writeToClipboard(copyText);
        button.textContent = '已复制';
        button.classList.add('cp-copy-success');
      } catch (_error) {
        button.textContent = '复制失败';
      }

      if (resetTimers.has(button)) {
        clearTimeout(resetTimers.get(button));
      }

      const timer = setTimeout(() => {
        button.textContent = defaultLabel;
        button.classList.remove('cp-copy-success');
        resetTimers.delete(button);
      }, 1400);

      resetTimers.set(button, timer);
    });
  });
}
