/* site wide interactions:
 - mobile nav toggle
 - set current year
 - marquee infinite scroll (home)
 - typed hero subtitle
 - contact form mailto fallback + validation
*/

document.addEventListener('DOMContentLoaded', () => {
  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // NAV TOGGLE
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');

  function handleResize() {
    if (!navMenu) return;
    if (window.innerWidth > 720) {
      navMenu.style.display = 'flex';
      navMenu.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    } else {
      navMenu.style.display = '';
    }
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('show');
      if (navMenu.classList.contains('show')) navMenu.style.display = 'flex';
      else navMenu.style.display = '';
    });
  }

  // highlight active link by filename
  (function markActive() {
    const links = document.querySelectorAll('.nav-link');
    if (!links.length) return;
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (href === current || (href === 'index.html' && current === '')) {
        a.classList.add('active');
      }
    });
  })();

  // TYPED HERO SUBTITLE (simple custom, no library)
  (function heroTyped() {
    const el = document.getElementById('typed-target');
    if (!el) return;
    const phrases = [
      'Actor · Model · Director',
      'Producer · Model Trainer',
      'Winner — Pehchan Manch HunarBaaz'
    ];
    let pI = 0, cI = 0, deleting = false;
    const typeSpeed = 80, deleteSpeed = 40, wait = 1400;

    function tick() {
      const current = phrases[pI];
      if (!deleting) {
        el.textContent = current.slice(0, ++cI);
        if (cI === current.length) {
          deleting = true;
          setTimeout(tick, wait);
          return;
        }
      } else {
        el.textContent = current.slice(0, --cI);
        if (cI === 0) {
          deleting = false;
          pI = (pI + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
    }
    tick();
  })();

  // MARQUEE INFINITE SCROLL
  (function marqueeInit() {
    const marquee = document.getElementById('marquee');
    if (!marquee) return;
    const children = Array.from(marquee.children);
    children.forEach(ch => marquee.appendChild(ch.cloneNode(true)));
    let pos = 0;
    const speed = 0.45;
    let paused = false;

    function step() {
      if (!paused) {
        pos -= speed;
        if (Math.abs(pos) >= marquee.scrollWidth / 2) pos = 0;
        marquee.style.transform = `translateX(${pos}px)`;
      }
      requestAnimationFrame(step);
    }
    marquee.addEventListener('mouseenter', () => paused = true);
    marquee.addEventListener('mouseleave', () => paused = false);
    marquee.addEventListener('touchstart', () => paused = true);
    marquee.addEventListener('touchend', () => paused = false);
    step();
  })();

  // CONTACT FORM HANDLER (mailto fallback)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (this.querySelector('#name') || {}).value || '';
      const email = (this.querySelector('#email') || {}).value || '';
      const message = (this.querySelector('#message') || {}).value || '';
      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('Please fill name, email and message.');
        return;
      }
      const subject = encodeURIComponent(`Booking / Enquiry — ${name}`);
      const body = encodeURIComponent(`${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:addicted.productions.ap@gmail.com?subject=${subject}&body=${body}`;
      this.reset();
    });
  }

}); // DOMContentLoaded