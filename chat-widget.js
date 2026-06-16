(function(){
  var CSS = `
  #ccc-chat-btn{position:fixed;bottom:30px;right:26px;z-index:800;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#E8CA78,#C9A84E,#A08230);color:#0A0E14;border:none;cursor:pointer;box-shadow:0 8px 28px -6px rgba(201,168,78,.45);display:flex;align-items:center;justify-content:center;transition:.3s cubic-bezier(.22,1,.36,1)}
  #ccc-chat-btn:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 14px 36px -8px rgba(201,168,78,.5)}
  #ccc-chat-btn svg{width:26px;height:26px}
  #ccc-chat-btn .badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;border-radius:50%;background:#E8CA78;border:2px solid #0B0F15;font-size:.6rem;font-weight:800;color:#0A0E14;display:flex;align-items:center;justify-content:center}
  #ccc-chat{display:none;position:fixed;bottom:96px;right:26px;z-index:900;width:380px;max-height:520px;border-radius:16px;background:#0B0F15;border:1px solid rgba(201,168,78,.2);box-shadow:0 24px 64px -16px rgba(0,0,0,.7);flex-direction:column;overflow:hidden;font-family:Inter,system-ui,-apple-system,sans-serif}
  #ccc-chat.open{display:flex}
  .cc-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#111821;border-bottom:1px solid rgba(255,255,255,.07)}
  .cc-head-left{display:flex;align-items:center;gap:10px}
  .cc-head-left .cc-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#E8CA78,#C9A84E);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.7rem;color:#0A0E14}
  .cc-head-left .cc-name{font-weight:700;font-size:.88rem;color:#F0EDE6}
  .cc-head-left .cc-online{font-size:.68rem;color:#C9A84E}
  .cc-close{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.06);border:none;color:rgba(240,237,230,.5);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:.2s}
  .cc-close:hover{background:rgba(255,255,255,.12);color:#F0EDE6}
  .cc-msgs{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:10px;min-height:280px;max-height:360px}
  .cc-msgs::-webkit-scrollbar{width:4px}.cc-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
  .cc-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:.84rem;line-height:1.55;word-wrap:break-word}
  .cc-msg.bot{background:#1A222E;color:rgba(240,237,230,.88);align-self:flex-start;border-bottom-left-radius:4px}
  .cc-msg.user{background:linear-gradient(135deg,#C9A84E,#A08230);color:#0A0E14;align-self:flex-end;border-bottom-right-radius:4px;font-weight:500}
  .cc-msg.bot a{color:#E8CA78;font-weight:600;text-decoration:underline}
  .cc-typing{align-self:flex-start;padding:10px 14px;background:#1A222E;border-radius:12px;border-bottom-left-radius:4px;display:flex;gap:4px;align-items:center}
  .cc-typing span{width:6px;height:6px;border-radius:50%;background:rgba(240,237,230,.3);animation:ccBounce .6s infinite alternate}
  .cc-typing span:nth-child(2){animation-delay:.15s}.cc-typing span:nth-child(3){animation-delay:.3s}
  @keyframes ccBounce{to{background:rgba(240,237,230,.7);transform:translateY(-3px)}}
  .cc-input{display:flex;gap:8px;padding:14px 18px;background:#111821;border-top:1px solid rgba(255,255,255,.07)}
  .cc-input input{flex:1;background:#1A222E;border:1px solid rgba(255,255,255,.08);border-radius:100px;padding:10px 16px;font-size:.84rem;color:#F0EDE6;font-family:inherit;outline:none;transition:.2s}
  .cc-input input::placeholder{color:rgba(240,237,230,.3)}
  .cc-input input:focus{border-color:rgba(201,168,78,.4)}
  .cc-input button{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E8CA78,#C9A84E);border:none;color:#0A0E14;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s;flex-shrink:0}
  .cc-input button:hover{transform:scale(1.08)}
  .cc-input button:disabled{opacity:.4;cursor:default;transform:none}
  .cc-input button svg{width:18px;height:18px}
  .cc-quick{display:flex;gap:6px;flex-wrap:wrap;padding:0 18px 12px}
  .cc-quick button{background:rgba(201,168,78,.1);border:1px solid rgba(201,168,78,.25);color:#E8CA78;padding:6px 12px;border-radius:100px;font-size:.72rem;font-weight:600;cursor:pointer;transition:.2s;font-family:inherit}
  .cc-quick button:hover{background:rgba(201,168,78,.2);border-color:rgba(201,168,78,.5)}
  @media(max-width:500px){
    #ccc-chat{right:0;left:0;bottom:0;width:100%;max-height:100vh;border-radius:16px 16px 0 0}
    #ccc-chat-btn{bottom:80px;right:16px;width:50px;height:50px}
    #ccc-chat-btn svg{width:22px;height:22px}
  }`;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'ccc-chat-btn';
  btn.setAttribute('aria-label','Chat with us');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12c0 4.4-4 8-9 8-1.6 0-3-.3-4.3-.9L3 21l1.5-4C3 15.5 3 13.8 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" stroke-linejoin="round"/><path d="M9 12h.01M12 12h.01M15 12h.01" stroke-linecap="round"/></svg><span class="badge">1</span>';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.id = 'ccc-chat';
  panel.innerHTML = [
    '<div class="cc-head">',
    '  <div class="cc-head-left">',
    '    <span class="cc-av">CCC</span>',
    '    <div><div class="cc-name">Chris Caruso Creations</div><div class="cc-online">Online now</div></div>',
    '  </div>',
    '  <button class="cc-close" id="cc-close">&times;</button>',
    '</div>',
    '<div class="cc-msgs" id="cc-msgs">',
    '  <div class="cc-msg bot">G\'day! I\'m the Chris Caruso Creations assistant. Whether you\'re a homeowner planning a renovation or a builder looking for a cabinetry partner, I can help. What can I do for you?</div>',
    '</div>',
    '<div class="cc-quick" id="cc-quick">',
    '  <button data-q="What services do you offer?">Services</button>',
    '  <button data-q="How do I get a free quote?">Get a Quote</button>',
    '  <button data-q="Do you work with builders and designers?">Trade Partners</button>',
    '  <button data-q="I\'d like Chris to call me back">Request Callback</button>',
    '</div>',
    '<div class="cc-input">',
    '  <input type="text" id="cc-in" placeholder="Type a message..." autocomplete="off" />',
    '  <button id="cc-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
    '</div>'
  ].join('\n');
  document.body.appendChild(panel);

  var msgs = document.getElementById('cc-msgs');
  var input = document.getElementById('cc-in');
  var sendBtn = document.getElementById('cc-send');
  var history = [];
  var isOpen = false;
  var leadSent = false;
  var msgCount = 0;
  var capturedData = { name: null, phone: null, email: null, interest: null };
  var allMessages = [];

  // Lead detection patterns
  var phoneRe = /(?:0[45]\d{2}[\s-]?\d{3}[\s-]?\d{3}|(?:\+?61[\s-]?)?4\d{2}[\s-]?\d{3}[\s-]?\d{3}|\d{4}[\s-]\d{4}|\d{10})/;
  var emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  function detectLead(text, who) {
    if (who !== 'user') return;
    if (!capturedData.phone && phoneRe.test(text)) {
      capturedData.phone = text.match(phoneRe)[0].replace(/[\s-]/g,'');
    }
    if (!capturedData.email && emailRe.test(text)) {
      capturedData.email = text.match(emailRe)[0];
    }
    // Try to detect name (if user says "I'm X" or "my name is X" or "it's X" early on)
    if (!capturedData.name) {
      var nameMatch = text.match(/(?:(?:my name is|i'm|im|this is|name's|it's|its)\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (nameMatch) capturedData.name = nameMatch[1];
    }
    // Detect interest from keywords
    if (!capturedData.interest) {
      var interests = ['kitchen','wardrobe','vanity','bathroom','laundry','office','entertainment','commercial','renovation','builder','designer','developer','cabinet'];
      for (var i = 0; i < interests.length; i++) {
        if (text.toLowerCase().indexOf(interests[i]) > -1) {
          capturedData.interest = interests[i]; break;
        }
      }
    }
  }

  function sendLeadEmail() {
    if (leadSent) return;
    if (!capturedData.phone && !capturedData.email && msgCount < 3) return;
    leadSent = true;

    var transcript = allMessages.map(function(m){ return (m.who === 'user' ? 'Visitor' : 'AI') + ': ' + m.text; }).join('\n');
    var summary = [];
    summary.push('NEW CHAT LEAD - Chris Caruso Creations Website');
    summary.push('---');
    if (capturedData.name) summary.push('Name: ' + capturedData.name);
    if (capturedData.phone) summary.push('Phone: ' + capturedData.phone);
    if (capturedData.email) summary.push('Email: ' + capturedData.email);
    if (capturedData.interest) summary.push('Interest: ' + capturedData.interest);
    summary.push('Page: ' + window.location.pathname);
    summary.push('Time: ' + new Date().toLocaleString('en-AU'));
    summary.push('Messages: ' + msgCount);
    summary.push('---');
    summary.push('CONVERSATION:');
    summary.push(transcript);

    var fd = new FormData();
    fd.append('access_key', '8936e942-51c7-4b42-b555-4eb459c968bd');
    fd.append('to', 'enquiries@triple-c.com.au');
    fd.append('subject', capturedData.phone ? 'CHAT LEAD (has phone) - ' + (capturedData.name || 'Website Visitor') : 'Chat Summary - ' + (capturedData.name || 'Website Visitor'));
    fd.append('from_name', 'CCC AI Assistant');
    fd.append('message', summary.join('\n'));
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd }).catch(function(){});
  }

  // Send lead email on close, page leave, or after phone captured
  function tryLeadCapture() {
    if (msgCount >= 2) sendLeadEmail();
  }

  btn.addEventListener('click', function(){
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    var badge = btn.querySelector('.badge');
    if(badge) badge.remove();
    if(isOpen) input.focus();
  });

  document.getElementById('cc-close').addEventListener('click', function(){
    isOpen = false;
    panel.classList.remove('open');
    tryLeadCapture();
  });

  window.addEventListener('beforeunload', function(){ tryLeadCapture(); });

  document.getElementById('cc-quick').addEventListener('click', function(e){
    var q = e.target.getAttribute('data-q');
    if(q) sendMessage(q);
  });

  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && input.value.trim()) sendMessage(input.value.trim());
  });
  sendBtn.addEventListener('click', function(){
    if(input.value.trim()) sendMessage(input.value.trim());
  });

  function addMsg(text, who){
    var d = document.createElement('div');
    d.className = 'cc-msg ' + who;
    d.innerHTML = text.replace(/(\d{4}\s?\d{3}\s?\d{3})/g,'<a href="tel:$1">$1</a>');
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    allMessages.push({ who: who, text: text });
    detectLead(text, who);
    // Auto-send lead email as soon as phone is captured
    if (capturedData.phone && !leadSent) {
      setTimeout(sendLeadEmail, 2000);
    }
    return d;
  }

  function showTyping(){
    var d = document.createElement('div');
    d.className = 'cc-typing'; d.id = 'cc-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping(){ var t = document.getElementById('cc-typing'); if(t) t.remove(); }

  async function sendMessage(text){
    addMsg(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    msgCount++;
    var qa = document.getElementById('cc-quick');
    if(qa) qa.style.display = 'none';

    history.push({ role: 'user', content: text });
    showTyping();

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      var data = await res.json();
      hideTyping();
      if(data.reply){
        addMsg(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
      } else {
        addMsg("Sorry, I couldn't process that. Please call us on 0459 984 461 and Chris will help you directly.", 'bot');
      }
    } catch(err){
      hideTyping();
      addMsg("Sorry, something went wrong. Please call us on 0459 984 461 - Chris will be happy to help.", 'bot');
    }
    sendBtn.disabled = false;
    input.focus();
  }

  // Auto-send lead summary after 2 min idle if conversation happened
  var idleTimer = null;
  function resetIdle(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function(){ tryLeadCapture(); }, 120000);
  }
  if(input) input.addEventListener('input', resetIdle);
})();
