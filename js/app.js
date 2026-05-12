const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const backToTop = document.querySelector('.back-to-top');
const yearElement = document.querySelector('#current-year');
const typewriterElement = document.querySelector('[data-typewriter]');
const progressBars = document.querySelectorAll('[data-progress]');
const copyButton = document.querySelector('.copy-command');

const THEME_KEY = 'angel-portfolio-theme';
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem(THEME_KEY);

const setTheme = (theme) => {
  document.body.classList.toggle('light-theme', theme === 'light');
  themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, theme);
};

setTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

yearElement.textContent = new Date().getFullYear();

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-theme');
  setTheme(isLight ? 'dark' : 'light');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      if (entry.target.classList.contains('skill-card')) {
        const progress = entry.target.querySelector('[data-progress]');
        progress.style.width = `${progress.dataset.progress}%`;
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

progressBars.forEach((bar) => {
  bar.style.width = '0%';
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const startTypewriter = () => {
  if (!typewriterElement) return;

  const words = typewriterElement.dataset.typewriter.split(',');
  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const type = () => {
    const currentWord = words[wordIndex];
    typewriterElement.textContent = currentWord.slice(0, letterIndex);

    if (!deleting && letterIndex < currentWord.length) {
      letterIndex += 1;
      setTimeout(type, 85);
      return;
    }

    if (!deleting && letterIndex === currentWord.length) {
      deleting = true;
      setTimeout(type, 1400);
      return;
    }

    if (deleting && letterIndex > 0) {
      letterIndex -= 1;
      setTimeout(type, 42);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 280);
  };

  type();
};

startTypewriter();

copyButton?.addEventListener('click', async () => {
  const command = copyButton.dataset.copy;
  const originalText = copyButton.textContent;

  try {
    await navigator.clipboard.writeText(command);
    copyButton.textContent = 'Copiado ✅';
  } catch (error) {
    copyButton.textContent = 'Copia manual 😅';
    console.error('No se pudo copiar el comando:', error);
  }

  setTimeout(() => {
    copyButton.textContent = originalText;
  }, 1800);
});
