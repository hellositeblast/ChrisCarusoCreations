(function(){
  // NAV scroll
  var nav=document.getElementById('nav');
  if(nav){
    var transparent=nav.classList.contains('over-hero');
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      if(transparent){nav.classList.toggle('scrolled',y>40);} 
      var fq=document.getElementById('fquote'); if(fq) fq.classList.toggle('show',y>320);
    },{passive:true});
  }
  // MOBILE menu
  var mm=document.getElementById('mm'),mo=document.getElementById('menu-open'),mc=document.getElementById('menu-close');
  if(mo&&mm){
    mo.addEventListener('click',function(){mm.classList.add('open');mo.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
    function closeMM(){mm.classList.remove('open');mo.setAttribute('aria-expanded','false');document.body.style.overflow='';}
    if(mc)mc.addEventListener('click',closeMM);
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMM);});
  }
  // REVEAL
  var canMotion=window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var reveals=document.querySelectorAll('.reveal');
  if(reveals.length){
    if(canMotion){
      var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}});},{threshold:0.12});
      reveals.forEach(function(el){ro.observe(el);});
    } else { reveals.forEach(function(el){el.classList.add('in');}); }
  }
  // COUNTERS
  function animateCount(el){var t=parseInt(el.getAttribute('data-count'),10),s=el.getAttribute('data-suffix')||'',d=1400,t0=null;function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/d,1);el.textContent=Math.floor((1-Math.pow(1-p,3))*t)+s;if(p<1)requestAnimationFrame(step);else el.textContent=t+s;}requestAnimationFrame(step);}
  var cs=document.querySelectorAll('[data-count]');
  if(cs.length){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){canMotion?animateCount(e.target):e.target.textContent=e.target.getAttribute('data-count')+(e.target.getAttribute('data-suffix')||'');co.unobserve(e.target);}});},{threshold:0.6});cs.forEach(function(c){co.observe(c);});}
  // FAQ tabs + accordion
  document.querySelectorAll('.faq-tab').forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.faq-tab').forEach(function(x){x.classList.remove('active');});
      document.querySelectorAll('.faq-panel').forEach(function(p){p.classList.remove('active');});
      t.classList.add('active');
      var panel=document.querySelector('.faq-panel[data-panel="'+t.getAttribute('data-tab')+'"]');
      if(panel)panel.classList.add('active');
      document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null;i.querySelector('.faq-q').setAttribute('aria-expanded','false');});
    });
  });
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.parentElement,ans=item.querySelector('.faq-a'),open=item.classList.contains('open');
      item.closest('.faq-panel, .faq-wrap').querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null;i.querySelector('.faq-q').setAttribute('aria-expanded','false');});
      if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');ans.style.maxHeight=ans.scrollHeight+'px';}
    });
  });
  // REVIEWS smooth scroll-snap carousel
  var track=document.getElementById('rev-track');
  if(track){
    var prev=document.getElementById('rev-prev'),next=document.getElementById('rev-next'),dotsWrap=document.getElementById('rev-dots');
    function step(){var c=track.querySelector('.rev-card');return c?c.getBoundingClientRect().width+20:300;}
    function update(){
      var max=track.scrollWidth-track.clientWidth-2;
      if(prev)prev.disabled=track.scrollLeft<=2;
      if(next)next.disabled=track.scrollLeft>=max;
      if(dotsWrap){
        var pages=Math.max(1,Math.round(track.scrollWidth/track.clientWidth));
        var active=Math.round(track.scrollLeft/track.clientWidth);
        if(dotsWrap.children.length!==pages){
          dotsWrap.innerHTML='';
          for(var i=0;i<pages;i++){(function(i){var d=document.createElement('div');d.className='rev-dot';d.addEventListener('click',function(){track.scrollTo({left:i*track.clientWidth,behavior:'smooth'});});dotsWrap.appendChild(d);})(i);}
        }
        Array.prototype.forEach.call(dotsWrap.children,function(d,i){d.classList.toggle('active',i===active);});
      }
    }
    if(prev)prev.addEventListener('click',function(){track.scrollBy({left:-step(),behavior:'smooth'});});
    if(next)next.addEventListener('click',function(){track.scrollBy({left:step(),behavior:'smooth'});});
    var raf;track.addEventListener('scroll',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(update);},{passive:true});
    window.addEventListener('resize',update);
    update();
  }
  // LIGHTBOX with prev/next
  var lb=document.getElementById('lb');
  if(lb){
    var lbc=document.getElementById('lb-content'),galItems=[],galIdx=0;
    document.querySelectorAll('.gal-item').forEach(function(g,i){galItems.push(g.getAttribute('data-img'));});
    function showGal(idx){galIdx=idx;lbc.innerHTML='<img src="'+galItems[idx]+'" alt="Chris Caruso Creations project" />';lb.classList.add('open');document.body.style.overflow='hidden';updateNav();}
    function updateNav(){var p=document.getElementById('lb-prev'),n=document.getElementById('lb-next');if(p)p.style.display=galItems.length>1?'flex':'none';if(n)n.style.display=galItems.length>1?'flex':'none';}
    function closeLB(){lb.classList.remove('open');lbc.innerHTML='';document.body.style.overflow='';}
    var lbClose=document.getElementById('lb-close');if(lbClose)lbClose.addEventListener('click',closeLB);
    var lbPrev=document.getElementById('lb-prev');if(lbPrev)lbPrev.addEventListener('click',function(e){e.stopPropagation();galIdx=(galIdx-1+galItems.length)%galItems.length;lbc.innerHTML='<img src="'+galItems[galIdx]+'" alt="Chris Caruso Creations project" />';});
    var lbNext=document.getElementById('lb-next');if(lbNext)lbNext.addEventListener('click',function(e){e.stopPropagation();galIdx=(galIdx+1)%galItems.length;lbc.innerHTML='<img src="'+galItems[galIdx]+'" alt="Chris Caruso Creations project" />';});
    lb.addEventListener('click',function(e){if(e.target===lb)closeLB();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft'&&lbPrev&&lb.classList.contains('open'))lbPrev.click();if(e.key==='ArrowRight'&&lbNext&&lb.classList.contains('open'))lbNext.click();});
    document.querySelectorAll('.gal-item').forEach(function(g,i){g.addEventListener('click',function(){showGal(i);});});
    document.querySelectorAll('.vid-card').forEach(function(v){function play(){lbc.innerHTML='<video src="'+v.getAttribute('data-video')+'" poster="'+v.querySelector('img').getAttribute('src')+'" controls autoplay playsinline></video>';lb.classList.add('open');document.body.style.overflow='hidden';var p=document.getElementById('lb-prev'),n=document.getElementById('lb-next');if(p)p.style.display='none';if(n)n.style.display='none';}v.addEventListener('click',play);v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play();}});});
  }
  // FORMS (web3forms - supports file attachments)
  document.querySelectorAll('.enquiry-form').forEach(function(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();var btn=form.querySelector('.form-submit'),ok=form.parentElement.querySelector('.form-success');
      var label=btn.textContent;btn.textContent='Sending...';btn.disabled=true;
      try{
        var fd=new FormData(form);
        var res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
        var data=await res.json();
        if(data.success){if(ok)ok.style.display='block';form.reset();btn.style.display='none';}
        else{btn.textContent=label;btn.disabled=false;alert('Something went wrong. Please call 0459 984 461 directly.');}
      }catch(err){btn.textContent=label;btn.disabled=false;alert('Something went wrong. Please call 0459 984 461 directly.');}
    });
  });
})();
