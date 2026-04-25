// ===== NÚMERO OFUSCADO =====
const _p = [49,56,48,57,48,48,48,48,48,48,48];
const _wa  = () => 'https://wa.me/' + _p.map(c => String.fromCharCode(c)).join('');
const _waMsg = (msg) => _wa() + '?text=' + encodeURIComponent(msg);

// ===== EMAIL OFUSCADO =====
const _e = () => {
  const u = [105,110,102,111];
  const d = [108,111,103,105,115,116,105,99,97,100,101,108,99,97,114,105,98,101];
  const t = [99,111,109];
  return u.map(c=>String.fromCharCode(c)).join('') + '@' +
         d.map(c=>String.fromCharCode(c)).join('') + '.' +
         t.map(c=>String.fromCharCode(c)).join('');
};

// ===== TIMESTAMP ANTI-BOT =====
const _formLoadTime = Date.now();

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // --- THEME TOGGLE ---
  const html       = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('themeIcon');
  const saved      = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  });

  // --- INYECTAR LINKS DE WHATSAPP EN RUNTIME ---
  const cotizarMsg  = 'Hola, quiero cotizar un servicio de carga';
  const estadoMsg   = 'Hola, quiero saber el estado de mi carga';
  const preguntaMsg = 'Hola, tengo una pregunta';

  const setWa = (id, msg) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = _waMsg(msg); el.target = '_blank'; el.rel = 'noopener noreferrer';
  };
  setWa('navWa',   cotizarMsg);
  setWa('waFloat', cotizarMsg);
  setWa('footerWa', cotizarMsg);
  setWa('stickyWa', cotizarMsg);

  const chatCotizar  = document.querySelector('.chat-opt-cotizar');
  const chatEstado   = document.querySelector('.chat-opt-estado');
  const chatPregunta = document.querySelector('.chat-opt-pregunta');
  if (chatCotizar)  { chatCotizar.href  = _waMsg(cotizarMsg);  chatCotizar.target  = '_blank'; chatCotizar.rel  = 'noopener noreferrer'; }
  if (chatEstado)   { chatEstado.href   = _waMsg(estadoMsg);   chatEstado.target   = '_blank'; chatEstado.rel   = 'noopener noreferrer'; }
  if (chatPregunta) { chatPregunta.href = _waMsg(preguntaMsg); chatPregunta.target = '_blank'; chatPregunta.rel = 'noopener noreferrer'; }

  // --- INYECTAR EMAIL EN RUNTIME ---
  const email  = _e();
  const mailto = 'mailto:' + email;
  const injectEmail = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const a = document.createElement('a');
    a.href = mailto; a.textContent = email;
    el.appendChild(a);
  };
  injectEmail('footerEmail');
  injectEmail('privEmail');
  const privWa = document.getElementById('privWa');
  if (privWa) { privWa.href = _waMsg('Hola, tengo una consulta sobre la política de privacidad'); privWa.target = '_blank'; privWa.rel = 'noopener noreferrer'; }

  // --- MULTI-STEP FORM: botones via addEventListener ---
  document.getElementById('btnNext1')?.addEventListener('click', () => nextStep(1));
  document.getElementById('btnNext2')?.addEventListener('click', () => nextStep(2));
  document.getElementById('btnBack2')?.addEventListener('click', () => showStep(1));
  document.getElementById('btnBack3')?.addEventListener('click', () => showStep(2));
  document.getElementById('btnReset')?.addEventListener('click', resetForm);

  // --- FAQ ---
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => toggleFaq(btn));
  });

  // --- CHAT TOGGLE ---
  document.getElementById('chatToggle')?.addEventListener('click', toggleChat);
  document.querySelectorAll('.chat-close').forEach(b => b.addEventListener('click', toggleChat));

  // --- EXIT POPUP ---
  document.getElementById('btnCloseExit')?.addEventListener('click', closeExit);
  document.getElementById('btnSkipExit')?.addEventListener('click', closeExit);
  document.getElementById('btnExitCta')?.addEventListener('click', closeExit);
  document.getElementById('exitOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('exitOverlay')) closeExit();
  });

  // --- STICKY SCROLL ---
  document.getElementById('stickyQuote')?.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('quoteCard');
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });

  // --- BACK TO TOP ---
  document.getElementById('backTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Init form
  showStep(1);
});

// ===== COUNTDOWN =====
function startCountdown(duration) {
  let timer = duration;
  const el = document.getElementById('countdown');
  if (!el) return;
  const iv = setInterval(() => {
    const h = Math.floor(timer / 3600);
    const m = Math.floor((timer % 3600) / 60);
    const s = timer % 60;
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (--timer < 0) clearInterval(iv);
  }, 1000);
}
startCountdown(7199);

// ===== MULTI-STEP FORM =====
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n)?.classList.add('active');
  document.getElementById('progressFill').style.width = ((n / 3) * 100) + '%';
}

function nextStep(from) {
  const step = document.getElementById('step' + from);
  let valid = true;
  step.querySelectorAll('input[required]').forEach(input => {
    input.style.borderColor = '';
    if (!input.value.trim()) { input.style.borderColor = '#EF4444'; valid = false; }
    if (input.type === 'tel' && input.value.trim()) {
      const tel = input.value.replace(/[\s\-\(\)]/g, '');
      if (!/^(\+?1)?(809|829|849)\d{7}$/.test(tel)) {
        input.style.borderColor = '#EF4444'; valid = false; showTelError(input);
      }
    }
  });
  if (from === 2) {
    const radio = document.querySelector('input[name="servicio"]:checked');
    const opts  = document.querySelector('.service-options');
    if (!radio) { opts.style.outline = '2px solid #EF4444'; opts.style.borderRadius = '10px'; valid = false; }
    else opts.style.outline = '';
  }
  if (!valid) { shake(step); return; }
  if (from < 3) showStep(from + 1);
}

function showTelError(input) {
  let err = input.parentElement.querySelector('.tel-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'tel-error';
    err.style.cssText = 'color:#EF4444;font-size:0.75rem;margin-top:4px;display:block;';
    input.parentElement.appendChild(err);
  }
  err.textContent = 'Número válido: 809, 829 o 849 + 7 dígitos';
  input.addEventListener('input', () => { err.remove(); input.style.borderColor = ''; }, { once: true });
}

function shake(el) {
  el.style.animation = 'none';
  requestAnimationFrame(() => { el.style.animation = 'shake 0.35s ease'; });
  setTimeout(() => el.style.animation = '', 350);
}

// ===== SANITIZACIÓN =====
function sanitize(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').trim().slice(0, 500);
}
function sanitizePhone(str) {
  return str.replace(/[^\d\+\-\s\(\)]/g, '').trim().slice(0, 20);
}

// ===== RATE LIMITING =====
const RATE_LIMIT  = 3;
const RATE_WINDOW = 60 * 60 * 1000;

function getRateData() {
  try { const r = localStorage.getItem('rl_form'); return r ? JSON.parse(r) : { count:0, start:Date.now() }; }
  catch { return { count:0, start:Date.now() }; }
}
function checkRateLimit() {
  const data = getRateData(), now = Date.now();
  if (now - data.start > RATE_WINDOW) { localStorage.setItem('rl_form', JSON.stringify({ count:0, start:now })); return true; }
  if (data.count >= RATE_LIMIT) { showRateLimitMsg(Math.ceil((RATE_WINDOW-(now-data.start))/60000)); return false; }
  return true;
}
function incrementRate() { const d = getRateData(); d.count++; localStorage.setItem('rl_form', JSON.stringify(d)); }
function showRateLimitMsg(min) {
  const form = document.getElementById('quoteForm');
  let msg = form.querySelector('.rate-msg');
  if (!msg) { msg = document.createElement('div'); msg.className = 'rate-msg'; form.prepend(msg); }
  msg.innerHTML = `<i class="fas fa-clock"></i> Demasiados intentos. Intenta en <strong>${min} min</strong> o escríbenos por <a id="rateMsgWa">WhatsApp</a>.`;
  const wa = msg.querySelector('#rateMsgWa');
  if (wa) { wa.href = _waMsg('Hola, quiero cotizar'); wa.target = '_blank'; wa.rel = 'noopener noreferrer'; }
}

// ===== FORM SUBMIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('quoteForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const hp = document.getElementById('hp_name');
    if (hp?.value.trim()) return;
    if (Date.now() - _formLoadTime < 3000) return;
    if (!checkRateLimit()) return;

    const btn = this.querySelector('.btn-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    const nombre      = sanitize(document.getElementById('nombre').value);
    const telefono    = sanitizePhone(document.getElementById('telefono').value);
    const email       = sanitize(document.getElementById('email').value);
    const origen      = sanitize(document.getElementById('origen').value);
    const destino     = sanitize(document.getElementById('destino').value);
    const servicio    = sanitize(document.querySelector('input[name="servicio"]:checked')?.value || 'No especificado');
    const peso        = sanitize(document.getElementById('peso').value || 'No especificado');
    const fecha       = sanitize(document.getElementById('fecha').value || 'No especificada');
    const descripcion = sanitize(document.getElementById('descripcion').value || 'Ninguna');

    const msg = `🚛 *Nueva Cotización - Logística del Caribe*\n\n👤 *Nombre:* ${nombre}\n📞 *Teléfono:* ${telefono}\n📧 *Email:* ${email||'No indicado'}\n\n📍 *Origen:* ${origen}\n🏁 *Destino:* ${destino}\n📦 *Servicio:* ${servicio}\n⚖️ *Peso:* ${peso}\n📅 *Fecha:* ${fecha}\n💬 *Descripción:* ${descripcion}`;

    const waUrl = _waMsg(msg);
    const waLink = document.getElementById('waLink');
    if (waLink) { waLink.href = waUrl; waLink.target = '_blank'; waLink.rel = 'noopener noreferrer'; }

    incrementRate();
    document.getElementById('quoteCard').style.display = 'none';
    document.getElementById('successCard').classList.add('show');
    setTimeout(() => window.open(waUrl, '_blank', 'noopener,noreferrer'), 800);

    btn.disabled = false;
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar por WhatsApp';
  });
});

function resetForm() {
  document.getElementById('quoteForm').reset();
  document.getElementById('quoteCard').style.display = '';
  document.getElementById('successCard').classList.remove('show');
  showStep(1);
}

// ===== FAQ =====
function toggleFaq(btn) {
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); q.nextElementSibling.classList.remove('open'); });
  if (!isOpen) { btn.classList.add('open'); btn.nextElementSibling.classList.add('open'); }
}

// ===== CHAT =====
function toggleChat() {
  const box = document.getElementById('chatBox');
  box.classList.toggle('open');
  if (box.classList.contains('open')) document.querySelector('.chat-badge').style.display = 'none';
}

// ===== EXIT POPUP =====
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0 && !exitShown) { exitShown = true; document.getElementById('exitOverlay').classList.add('show'); }
});
setTimeout(() => {
  if (!exitShown && window.innerWidth < 768) { exitShown = true; document.getElementById('exitOverlay').classList.add('show'); }
}, 40000);
function closeExit() { document.getElementById('exitOverlay').classList.remove('show'); }

// ===== SOCIAL NOTIFICATIONS =====
const notifications = [
  { name:'Juan P.',   msg:'acaba de cotizar una mudanza',      time:'Hace 2 min',  avatar:'https://i.pravatar.cc/40?img=12' },
  { name:'María R.',  msg:'solicitó transporte de carga',       time:'Hace 5 min',  avatar:'https://i.pravatar.cc/40?img=47' },
  { name:'Carlos M.', msg:'cotizó carga industrial',            time:'Hace 8 min',  avatar:'https://i.pravatar.cc/40?img=51' },
  { name:'Ana G.',    msg:'pidió servicio express',             time:'Hace 12 min', avatar:'https://i.pravatar.cc/40?img=25' },
  { name:'Pedro S.',  msg:'contrató transporte refrigerado',    time:'Hace 15 min', avatar:'https://i.pravatar.cc/40?img=60' },
  { name:'Luis F.',   msg:'solicitó cotización de tráiler',     time:'Hace 18 min', avatar:'https://i.pravatar.cc/40?img=33' },
];
let notifIndex = 0;
function showNotif() {
  const n = notifications[notifIndex % notifications.length];
  document.getElementById('notifName').textContent  = n.name;
  document.getElementById('notifMsg').textContent   = n.msg;
  document.getElementById('notifTime').textContent  = n.time;
  document.getElementById('notifAvatar').src        = n.avatar;
  const el = document.getElementById('socialNotif');
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
  notifIndex++;
}
setTimeout(() => { showNotif(); setInterval(showNotif, 12000); }, 6000);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = parseInt(el.dataset.target);
    let current = 0;
    const iv = setInterval(() => {
      current += target / 60;
      if (current >= target) { current = target; clearInterval(iv); }
      el.textContent = Math.floor(current) + '+';
    }, 25);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== BACK TO TOP =====
window.addEventListener('scroll', () => {
  document.getElementById('backTop')?.classList.toggle('show', window.scrollY > 400);
});

// ===== SCROLL SPY =====
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(s => spyObserver.observe(s));

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader')?.classList.add('hidden'), 1500);
});

// ===== SHAKE KEYFRAME =====
const _style = document.createElement('style');
_style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(_style);
