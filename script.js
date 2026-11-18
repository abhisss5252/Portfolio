/* =====================================================
   PORTFOLIO v2 – ABHISHEK BHASKARAN
   script.js
   Features:
   1. Custom cursor
   2. Dark / Light theme toggle (saved to localStorage)
   3. Side drawer open / close (mobile menu)
   4. Scroll-spy active nav links + topbar shadow
   5. Text role cycler (hero)
   6. Skill bar animation (IntersectionObserver)
   7. Scroll-reveal animation
   8. Contact form validation
   ===================================================== */

/* ─────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ───────────────────────────────────────────────────── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower via RAF
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover
document.querySelectorAll('a, button, .hex, .proj-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform         = 'translate(-50%,-50%) scale(2.5)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(0.5)';
    cursorFollower.style.opacity   = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform         = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.opacity   = '0.5';
  });
});

/* ─────────────────────────────────────────────────────
   2. DARK / LIGHT THEME TOGGLE
   ───────────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
const themeIco = document.getElementById('themeIco');
const body     = document.body;

// Apply saved theme on load
const saved = localStorage.getItem('abTheme');
if (saved === 'dark') applyDark();

function applyDark() {
  body.classList.add('dark');
  body.classList.remove('light');
  themeIco.classList.replace('fa-moon', 'fa-sun');
}
function applyLight() {
  body.classList.remove('dark');
  body.classList.add('light');
  themeIco.classList.replace('fa-sun', 'fa-moon');
}

themeBtn.addEventListener('click', () => {
  if (body.classList.contains('dark')) {
    applyLight();
    localStorage.setItem('abTheme', 'light');
  } else {
    applyDark();
    localStorage.setItem('abTheme', 'dark');
  }
});

/* ─────────────────────────────────────────────────────
   3. SIDE DRAWER (mobile menu)
   ───────────────────────────────────────────────────── */
const menuBtn       = document.getElementById('menuBtn');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('show');
  body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('show');
  body.style.overflow = '';
}

menuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Close on nav link click
document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

/* ─────────────────────────────────────────────────────
   4. SCROLL SPY + TOPBAR SHADOW
   ───────────────────────────────────────────────────── */
const topbar   = document.getElementById('topbar');
const sections = document.querySelectorAll('section[id]');
const tbLinks  = document.querySelectorAll('.tb-link');

function onScroll() {
  // Shadow
  topbar.classList.toggle('stuck', window.scrollY > 30);

  // Active link
  const scrollMid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    if (scrollMid >= top && scrollMid < bot) {
      const id = sec.getAttribute('id');
      tbLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─────────────────────────────────────────────────────
   5. HERO ROLE TEXT CYCLER
   ───────────────────────────────────────────────────── */
const roleCycle = document.getElementById('roleCycle');
const roles = ['web apps', 'ML models', 'smart tools', 'clean UIs', 'real solutions'];
let roleIdx = 0;

function cycleRole() {
  roleCycle.style.opacity = '0';
  roleCycle.style.transform = 'translateY(-8px)';
  setTimeout(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    roleCycle.textContent = roles[roleIdx];
    roleCycle.style.transition = 'opacity .4s ease, transform .4s ease';
    roleCycle.style.opacity = '1';
    roleCycle.style.transform = 'translateY(0)';
  }, 300);
}

roleCycle.style.transition = 'opacity .4s ease, transform .4s ease';
setInterval(cycleRole, 2200);

/* ─────────────────────────────────────────────────────
   6. SKILL BAR ANIMATION
   ───────────────────────────────────────────────────── */
const sbsFills = document.querySelectorAll('.sbs-fill');

const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

sbsFills.forEach(f => barObs.observe(f));

/* ─────────────────────────────────────────────────────
   7. SCROLL REVEAL
   ───────────────────────────────────────────────────── */
// Add reveal class to elements we want to animate
const revealTargets = [
  '.tl-item',
  '.hex-wrap',
  '.sbs-item',
  '.proj-item',
  '.cl-link',
  '.contact-form',
  '.about-text',
  '.timeline',
];
revealTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger siblings
      const siblings = Array.from(e.target.parentElement.children).filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('revealed');
      }, idx * 90);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────────────────
   8. CONTACT FORM VALIDATION
   ───────────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const cfName  = document.getElementById('cfName');
const cfEmail = document.getElementById('cfEmail');
const cfMsg   = document.getElementById('cfMsg');
const errName  = document.getElementById('errName');
const errEmail = document.getElementById('errEmail');
const errMsg   = document.getElementById('errMsg');
const cfSuccess = document.getElementById('cfSuccess');

function setErr(input, errEl, state) {
  input.classList.toggle('err', state);
  errEl.classList.toggle('show', state);
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Live clear
cfName.addEventListener('input',  () => { if (cfName.value.trim())          setErr(cfName,  errName,  false); });
cfEmail.addEventListener('input', () => { if (validEmail(cfEmail.value.trim())) setErr(cfEmail, errEmail, false); });
cfMsg.addEventListener('input',   () => { if (cfMsg.value.trim())           setErr(cfMsg,   errMsg,   false); });

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  if (!cfName.value.trim())             { setErr(cfName,  errName,  true); ok = false; }
  else                                   { setErr(cfName,  errName,  false); }

  if (!validEmail(cfEmail.value.trim())) { setErr(cfEmail, errEmail, true); ok = false; }
  else                                   { setErr(cfEmail, errEmail, false); }

  if (!cfMsg.value.trim())              { setErr(cfMsg,   errMsg,   true); ok = false; }
  else                                   { setErr(cfMsg,   errMsg,   false); }

  if (!ok) return;

  // Success state
  const submitBtn = contactForm.querySelector('.cf-submit');
  submitBtn.disabled = true;
  cfSuccess.classList.add('show');

  setTimeout(() => {
    contactForm.reset();
    cfSuccess.classList.remove('show');
    submitBtn.disabled = false;
  }, 4000);
});
