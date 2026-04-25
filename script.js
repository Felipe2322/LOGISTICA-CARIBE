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
  setWa('topbarWa', cotizarMsg);
  setWa('ctaWa',    cotizarMsg);
  setWa('waFloat',  cotizarMsg);
  setWa('footerWa', cotizarMsg);
  setWa('stickyWa', cotizarMsg);

  // WA links del chat se inyectan en runtime via sendMessage/addMessage

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
  document.getElementById('chatClose')?.addEventListener('click', toggleChat);

  // --- CHAT INPUT ---
  const chatInput = document.getElementById('chatInput');
  const chatSend  = document.getElementById('chatSend');

  chatSend?.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(chatInput.value);
  });

  // --- CHAT SUGGESTIONS ---
  document.getElementById('chatSuggestions')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-msg]');
    if (btn) sendMessage(btn.dataset.msg);
  });

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

  // --- FECHA MÍNIMA: hoy ---
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }
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

  // Actualizar step progress visual
  [1, 2, 3].forEach(i => {
    const sp = document.getElementById('sp' + i);
    if (!sp) return;
    sp.classList.remove('active', 'done');
    if (i < n) sp.classList.add('done');
    else if (i === n) sp.classList.add('active');
  });
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
  // Validar email si fue ingresado (opcional pero debe ser válido)
  if (from === 1) {
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.style.borderColor = '#EF4444';
        showEmailError(emailInput);
        valid = false;
      }
    }
  }
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

function showEmailError(input) {
  let err = input.parentElement.querySelector('.email-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'email-error';
    err.style.cssText = 'color:#EF4444;font-size:0.75rem;margin-top:4px;display:block;';
    input.parentElement.appendChild(err);
  }
  err.textContent = 'Ingresa un correo válido (ej: tu@correo.com)';
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

// ===== CHATBOT =====
const BOT_RESPONSES = [
  {
    keys: ['precio','costo','cuesta','tarifa','cobran','cuanto','cuánto','rate','flete'],
    reply: `💰 Nuestras tarifas orientativas son:\n\n• Furgoneta (hasta 1 ton): desde <strong>RD$2,500</strong>\n• Camión mediano (hasta 5 ton): desde <strong>RD$6,500</strong>\n• Camión grande (hasta 15 ton): desde <strong>RD$12,000</strong>\n• Tráiler (hasta 30 ton): desde <strong>RD$22,000</strong>\n\nEl precio exacto depende de la distancia y tipo de carga. ¿Quieres una <a href="#quoteCard">cotización gratis</a>?`
  },
  {
    keys: ['servicio','ofrecen','hacen','tipos','que mueven','qué mueven','opciones'],
    reply: `📦 Ofrecemos 6 servicios:\n\n1. <strong>Carga General</strong> — mercancías y paquetes\n2. <strong>Carga Industrial</strong> — maquinaria pesada\n3. <strong>Mudanzas</strong> — residencial y comercial\n4. <strong>Refrigerada</strong> — cadena de frío\n5. <strong>Express</strong> — entregas urgentes\n6. <strong>Almacenamiento</strong> — bodegaje seguro\n\n¿Cuál necesitas?`
  },
  {
    keys: ['cotiz','presupuesto','solicitar','pedir','quote'],
    reply: `📋 Cotizar es muy fácil y gratis:\n\n1. Llena el formulario arriba (30 segundos)\n2. Te respondemos en <strong>menos de 2 horas</strong>\n3. Sin compromiso\n\n👉 <a href="#quoteCard">Ir al formulario de cotización</a>`
  },
  {
    keys: ['ubicad','donde','dirección','dirección','santiago','lugar','oficina','están'],
    reply: `📍 Estamos en <strong>Santiago de los Caballeros</strong>, República Dominicana.\n\nOperamos en todo el territorio nacional: Santo Domingo, La Vega, Puerto Plata, San Francisco de Macorís y más.\n\n¿Necesitas que vayamos a tu dirección?`
  },
  {
    keys: ['horario','hora','atienden','abierto','disponible','cuando','cuándo'],
    reply: `🕐 Nuestro horario de atención es:\n\n• <strong>Lunes a Sábado: 7am – 8pm</strong>\n• Servicio de transporte: <strong>24/7</strong>\n\nPuedes escribirnos por WhatsApp en cualquier momento y te respondemos.`
  },
  {
    keys: ['seguro','asegurad','garantia','garantía','daño','daños','pierde','perdida'],
    reply: `🛡️ Sí, <strong>toda la carga está asegurada</strong> durante el transporte.\n\nEn caso de cualquier incidente, respondemos por el valor de tu mercancía. Trabajamos con total transparencia y responsabilidad.`
  },
  {
    keys: ['gps','rastrear','rastreo','seguimiento','tracking','donde esta','dónde está'],
    reply: `📡 Toda nuestra flota tiene <strong>GPS en tiempo real</strong>.\n\nDurante el trayecto te enviamos actualizaciones por WhatsApp para que sepas exactamente dónde está tu carga.`
  },
  {
    keys: ['whatsapp','llamar','contacto','telefono','teléfono','comunicar','hablar'],
    reply: `📞 Puedes contactarnos por:\n\n• <strong>WhatsApp:</strong> 809-000-0000\n• <strong>Teléfono:</strong> 809-000-0000\n• <strong>Email:</strong> info@logisticadelcaribe.com\n\n¿Prefieres que te contactemos nosotros?`
  },
  {
    keys: ['mudanza','mudar','muebles','casa','oficina','residencial'],
    reply: `🏠 Nuestro servicio de <strong>mudanzas</strong> incluye:\n\n• Personal capacitado para embalaje\n• Transporte cuidadoso de muebles y equipos\n• Mudanzas residenciales y comerciales\n• Disponible en todo el país\n\n¿Quieres una <a href="#quoteCard">cotización para tu mudanza</a>?`
  },
  {
    keys: ['refriger','frio','frío','alimento','medicamento','cadena'],
    reply: `❄️ Sí, tenemos servicio de <strong>carga refrigerada</strong>.\n\nTransportamos alimentos, medicamentos y cualquier producto que requiera cadena de frío, manteniendo la temperatura requerida durante todo el trayecto.`
  },
  {
    keys: ['tiempo','demora','cuanto tarda','cuánto tarda','rapido','rápido','entrega'],
    reply: `⏱️ Los tiempos de entrega dependen de la ruta:\n\n• <strong>Santiago → Santo Domingo:</strong> 2-3 horas\n• <strong>Rutas locales:</strong> mismo día\n• <strong>Servicio Express:</strong> tiempo garantizado\n\n¿Necesitas una entrega urgente?`
  },
  {
    keys: ['hola','buenas','buenos','hey','hi','saludos','buen dia','buen día'],
    reply: `👋 ¡Hola! Bienvenido a <strong>Logística del Caribe</strong>.\n\nSoy CaribBot, tu asistente virtual. Puedo ayudarte con precios, servicios, cotizaciones y más.\n\n¿En qué te puedo ayudar hoy?`
  },
  {
    keys: ['gracias','thank','perfecto','excelente','genial','ok','listo'],
    reply: `😊 ¡Con gusto! Estamos para servirte.\n\nSi necesitas algo más, aquí estaré. También puedes <a href="#quoteCard">cotizar ahora</a> o escribirnos por WhatsApp para atención personalizada.`
  },
];

const FALLBACK = [
  `No estoy seguro de entender tu pregunta 🤔\n\nPuedo ayudarte con: <strong>precios, servicios, cotizaciones, ubicación, horarios</strong> o rastreo de carga.\n\n¿O prefieres hablar con una persona? <a class="wa-chat-link">Escríbenos por WhatsApp</a>`,
  `Hmm, esa pregunta es mejor respondida por nuestro equipo 😊\n\nEscríbenos directamente por <a class="wa-chat-link">WhatsApp</a> y te atendemos al instante.`,
  `No tengo esa información exacta, pero nuestro equipo sí la tiene.\n\n👉 <a class="wa-chat-link">Contactar por WhatsApp</a>`,
];

let fallbackIdx = 0;
let chatOpen = false;
let chatInitialized = false;

function getBotReply(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const r of BOT_RESPONSES) {
    if (r.keys.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return r.reply;
    }
  }
  const fb = FALLBACK[fallbackIdx % FALLBACK.length];
  fallbackIdx++;
  return fb;
}


function addMessage(text, type) {
  const msgs = document.getElementById('chatMessages');
  const now = new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + type;
  bubble.innerHTML = text;
  const time = document.createElement('span');
  time.className = 'chat-time' + (type === 'user' ? ' right' : '');
  time.textContent = now;
  wrap.appendChild(bubble); wrap.appendChild(time);
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;

  // Inject WA links in fallback
  wrap.querySelectorAll('.wa-chat-link').forEach(a => {
    a.href = _waMsg('Hola, tengo una pregunta');
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.cssText = 'color:var(--orange);font-weight:600;text-decoration:underline;cursor:pointer;';
  });
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'chat-typing'; typing.id = 'chatTyping';
  typing.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  document.getElementById('chatTyping')?.remove();
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  document.getElementById('chatInput').value = '';
  showTyping();
  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    removeTyping();
    addMessage(getBotReply(text), 'bot');
  }, delay);
}

function initChat() {
  if (chatInitialized) return;
  chatInitialized = true;
  setTimeout(() => {
    addMessage('👋 ¡Hola! Soy <strong>CaribBot</strong>, el asistente de Logística del Caribe.\n\n¿En qué puedo ayudarte hoy?', 'bot');
  }, 400);
}

function toggleChat() {
  const box = document.getElementById('chatBox');
  const badge = document.getElementById('chatBadge');
  chatOpen = !chatOpen;
  box.classList.toggle('open', chatOpen);
  if (chatOpen) {
    badge.style.display = 'none';
    initChat();
    setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
  }
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
  const hide = () => document.getElementById('preloader')?.classList.add('hidden');
  // Mínimo 800ms para que no parpadee, pero no más de lo necesario
  const elapsed = Date.now() - performance.timing.navigationStart;
  const remaining = Math.max(0, 800 - elapsed);
  setTimeout(hide, remaining);
});

// ===== SHAKE KEYFRAME =====
const _style = document.createElement('style');
_style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(_style);
