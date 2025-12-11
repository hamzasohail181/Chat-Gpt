/* Global site JS: menu toggle, login, forms, dashboard auth, application save */

// MENU TOGGLE (works by id on each page)
function initMenuToggle(btnId, navId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const nav = document.getElementById(navId) || document.querySelector('.navlinks');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('show');
  });
}
// initialize commonly used ids
initMenuToggle('menuBtn', 'mainNav');
initMenuToggle('menuBtnPrograms', 'navPrograms');
initMenuToggle('menuBtnAdmissions', 'navAdmissions');
initMenuToggle('menuBtnCampus', 'navCampus');
initMenuToggle('menuBtnContact', 'navContact');
initMenuToggle('menuBtnApp', 'navApp');

// ------------------ LOGIN HANDLING ------------------
// Demo client-side auth. Replace with server auth in production.
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = (document.getElementById('username') || {}).value?.trim();
    const pass = (document.getElementById('password') || {}).value?.trim();
    if (user === 'admin' && pass === '12345') {
      // store session marker
      sessionStorage.setItem('mhs_user', JSON.stringify({username: 'admin', sid: 'S-123456'}));
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid credentials — demo username: admin / 12345');
    }
  });
}

// ------------------ DASHBOARD AUTH & UI ------------------
function initDashboard() {
  const user = JSON.parse(sessionStorage.getItem('mhs_user') || 'null');
  if (!user) {
    // not logged in -> redirect to login
    window.location.href = 'login.html';
    return;
  }
  const welcome = document.getElementById('welcome');
  const sid = document.getElementById('sid');
  if (welcome) welcome.textContent = `Welcome, ${user.username}`;
  if (sid) sid.textContent = user.sid || '—';

  // load app stats from localStorage (demo)
  const apps = JSON.parse(localStorage.getItem('mhs_applications') || '[]');
  document.getElementById('appsCount') && (document.getElementById('appsCount').textContent = apps.length);
  document.getElementById('coursesCount') && (document.getElementById('coursesCount').textContent = 5); // demo

  // sign out
  const signOutBtn = document.getElementById('signOut');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('mhs_user');
      window.location.href = 'login.html';
    });
  }
}
if (document.body && document.body.classList.contains('main-content') || window.location.pathname.endsWith('dashboard.html')) {
  // attempt to init if on dashboard
  try { initDashboard(); } catch(e) {}
}
// safer run: call initDashboard on dashboard page load
if (window.location.pathname.endsWith('dashboard.html')) initDashboard();

// ------------------ CONTACT FORM ------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // basic validation
    const name = document.getElementById('cname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const message = document.getElementById('cmessage').value.trim();
    if (!name || !email || !message) {
      alert('Please fill all fields.');
      return;
    }
    // demo: show message and clear form
    alert('Thank you — your message has been recorded (demo).');
    contactForm.reset();
  });
}

// ------------------ APPLICATION FORM ------------------
const applicationForm = document.getElementById('applicationForm');
if (applicationForm) {
  const saveBtn = document.getElementById('saveDraft');
  // load draft
  const draft = JSON.parse(localStorage.getItem('mhs_app_draft') || 'null');
  if (draft) {
    ['fullname','dob','email','phone','program','address'].forEach(id => {
      const el = document.getElementById(id);
      if (el && draft[id]) el.value = draft[id];
    });
  }

  applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      fullname: document.getElementById('fullname').value.trim(),
      dob: document.getElementById('dob').value,
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      program: document.getElementById('program').value,
      address: document.getElementById('address').value.trim(),
      submittedAt: new Date().toISOString()
    };
    // basic validation
    if (!data.fullname || !data.email || !data.program) {
      alert('Please fill required fields.');
      return;
    }
    // save to localStorage applications (demo)
    const apps = JSON.parse(localStorage.getItem('mhs_applications') || '[]');
    apps.push(data);
    localStorage.setItem('mhs_applications', JSON.stringify(apps));
    // clear draft
    localStorage.removeItem('mhs_app_draft');
    alert('Application submitted (demo). We saved your application locally for demo purposes.');
    applicationForm.reset();
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const draftData = {
        fullname: document.getElementById('fullname').value.trim(),
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        program: document.getElementById('program').value,
        address: document.getElementById('address').value.trim()
      };
      localStorage.setItem('mhs_app_draft', JSON.stringify(draftData));
      alert('Draft saved locally.');
    });
  }
}

// ------------------ UTILS: smooth anchor scroll ------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});
