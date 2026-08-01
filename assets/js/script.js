document.documentElement.classList.add('js');

const path = window.location.pathname;
const page = path === '/' ? '/' : (path.split('/').pop() || '/');

document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === page || (href === '/' && page === 'index.html')) link.setAttribute('aria-current', 'page');
});

const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-mobile-menu]');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
    document.body.classList.toggle('menu-open', !open);
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach((item) => revealObserver.observe(item));

document.querySelectorAll('[data-year]').forEach((item) => { item.textContent = new Date().getFullYear(); });

document.querySelectorAll('[data-contact-form]').forEach((form) => {
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton ? submitButton.innerHTML : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = 'Sending your enquiry...';
      status.dataset.state = 'pending';
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending <span>&#8594;</span>';
    }

    try {
      const response = await fetch(form.dataset.submitEndpoint || form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');

      form.reset();
      if (status) {
        status.textContent = 'Thank you. Your enquiry has been sent.';
        status.dataset.state = 'success';
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Unable to send right now. Please email shurvatech@gmail.com directly.';
        status.dataset.state = 'error';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = defaultButtonText;
      }
    }
  });
});

const header = document.querySelector('.site-header');
if (header) {
  const setScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
}

if (!reduceMotion) {
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.counterSuffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => counterObserver.observe(el));

  document.querySelectorAll('.service').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
} else {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    el.textContent = el.dataset.counter + (el.dataset.counterSuffix || '');
  });
}
