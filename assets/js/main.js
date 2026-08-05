
(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      status.textContent = '';
      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = 'Please complete the required fields.';
        return;
      }
      if (form.elements['company-website'].value) return;
      const data = new FormData(form);
      const subject = `CyberBee Solutions enquiry: ${data.get('service')}`;
      const body = [
        `Name: ${data.get('name')}`,
        `Organisation: ${data.get('organisation') || 'Not provided'}`,
        `Business email: ${data.get('email')}`,
        `Area of interest: ${data.get('service')}`,
        '',
        'High-level requirement:',
        String(data.get('message'))
      ].join('\n');
      window.location.href = `mailto:cyberbeesolutionsltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email application should now open with a prepared enquiry.';
    });
  }
})();
