
(function(){
  'use strict';

  var body=document.body;
  var lang=document.getElementById('lang');
  var nav=document.getElementById('nav');

  function hideLang(){
    if(!lang) return;
    lang.classList.add('off');
    lang.classList.add('force-hide');
    setTimeout(function(){ if(lang) lang.style.display='none'; }, 900);
    runHeroIntro();
  }

  // Cursor
  var cd=document.getElementById('cur-d'), cr=document.getElementById('cur-r');
  var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
  document.addEventListener('mousemove', function(e){
    mx=e.clientX; my=e.clientY;
    if(cd){ cd.style.left=mx+'px'; cd.style.top=my+'px'; }
  });
  (function loop(){
    rx += (mx-rx)*0.1; ry += (my-ry)*0.1;
    if(cr){ cr.style.left=rx+'px'; cr.style.top=ry+'px'; }
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('mouseenter', function(){ body.classList.add('hc'); });
    el.addEventListener('mouseleave', function(){ body.classList.remove('hc'); });
  });

  // Routing
  function showPage(name){
    document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('on'); });
    var target=document.getElementById('page-'+name) || document.getElementById('page-home');
    target.classList.add('on');
    document.querySelectorAll('.nav-links a').forEach(function(a){ a.classList.remove('act'); });
    var current=document.querySelector('.nav-links a[data-page="'+name+'"]');
    if(current) current.classList.add('act');
    window.scrollTo({top:0,behavior:'auto'});
    initReveal();
  }
  document.addEventListener('click', function(e){
    var pageLink=e.target.closest('[data-page]');
    if(pageLink){
      e.preventDefault();
      showPage(pageLink.getAttribute('data-page'));
    }
    var langBtn=e.target.closest('.lbtn');
    if(langBtn){
      e.preventDefault();
      hideLang();
      showPage('home');
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.key==='Enter' || e.key===' ' || e.key==='Escape'){
      hideLang();
      showPage('home');
    }
  });
  setTimeout(function(){
    if(lang && getComputedStyle(lang).display !== 'none'){ hideLang(); showPage('home'); }
  }, 2600);

  // Nav scroll
  window.addEventListener('scroll', function(){
    if(nav) nav.classList.toggle('stuck', window.scrollY>50);
  });

  // Reveal
  var ro = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        ro.unobserve(entry.target);
      }
    });
  }, {threshold:0.08}) : null;
  function initReveal(){
    document.querySelectorAll('.rv:not(.in)').forEach(function(el){
      if(ro) ro.observe(el); else el.classList.add('in');
    });
  }
  initReveal();

  // Tilt
  var he=document.getElementById('hero'), ti=document.getElementById('hero-tilt');
  if(he && ti){
    he.addEventListener('mousemove', function(e){
      var r=he.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      ti.style.transform='perspective(1200px) rotateX('+(y*-7)+'deg) rotateY('+(x*9)+'deg)';
    });
    he.addEventListener('mouseleave', function(){
      ti.style.transition='transform .9s cubic-bezier(.16,1,.3,1)';
      ti.style.transform='perspective(1200px) rotateX(0) rotateY(0)';
      setTimeout(function(){ ti.style.transition=''; }, 900);
    });
  }

  // Services accordion
  document.querySelectorAll('.svc-item .svc-row').forEach(function(row){
    row.addEventListener('click', function(){
      var item=this.parentElement, was=item.classList.contains('open');
      document.querySelectorAll('.svc-item').forEach(function(i){ i.classList.remove('open'); });
      if(!was) item.classList.add('open');
    });
  });

  // View toggle
  var vgrid=document.getElementById('vgrid'), vlist=document.getElementById('vlist');
  var etGrid=document.getElementById('et-grid'), etList=document.getElementById('et-list');
  if(vgrid&&vlist&&etGrid&&etList){
    vgrid.addEventListener('click', function(){ vgrid.classList.add('on'); vlist.classList.remove('on'); etGrid.style.display='grid'; etList.style.display='none'; });
    vlist.addEventListener('click', function(){ vlist.classList.add('on'); vgrid.classList.remove('on'); etGrid.style.display='none'; etList.style.display='flex'; });
  }

  // Posts
  var POSTS=[{cat:'Identité',title:'Pourquoi les marques qui durent ont toujours un ennemi clairement défini',date:'Mars 2026',read:'7 min',body:"<p class='dc'>Il existe une distinction que la plupart des consultants en branding ne font jamais — parce qu'elle est inconfortable. La différence entre une marque qui se positionne et une marque qui prend position. Les deux semblent similaires. Elles ne le sont absolument pas.</p><p>Se positionner, c'est choisir un endroit sur une carte. Prendre position, c'est décider ce que l'on refuse. La première est une décision marketing. La seconde est une décision de caractère. Et le caractère, contrairement au positionnement, ne se copie pas.</p><h2>Ce que Chanel a compris</h2><p>Gabrielle Chanel n'a pas construit une marque contre la concurrence. Elle a construit une marque contre une époque. L'ennemi n'était pas Poiret ou Worth — c'était la corseterie, la contrainte physique imposée au corps féminin. Cet ennemi était tellement précis, tellement ancré dans une vérité culturelle, que quatre-vingts ans après sa mort, la marque tient encore.</p><p>La question à poser n'est pas <strong>« qui est notre concurrent ? »</strong> mais <strong>« qu'est-ce que nous refusons ? »</strong> Ce refus, s'il est sincère, génère automatiquement une attraction pour ceux qui le partagent.</p><blockquote>La rareté d'une marque ne vient pas de son prix. Elle vient de la précision absolue de ce qu'elle refuse d'être.</blockquote><h2>La mécanique de l'ennemi</h2><p>Un ennemi de marque ne doit jamais être une personne. C'est une idée. Apple n'a pas attaqué IBM — elle a attaqué la conformité. Nike n'a pas attaqué Adidas — elle a attaqué l'inertie. <strong>Une marque sans ennemi est une marque sans point de vue. Et une marque sans point de vue est invisible.</strong></p>"},
{cat:'Luxe & désir',title:'Ce que les maisons de luxe ont compris sur le silence',date:'Mars 2026',read:'5 min',body:"<p class='dc'>Il y a une chose que toutes les grandes maisons de luxe font systématiquement et que la quasi-totalité des marques premium ne font que rarement — elles ne répondent pas. Pas toujours. Pas immédiatement. Parfois, pas du tout. Ce silence n'est pas une négligence. C'est une architecture délibérée.</p><h2>La grammaire du désir</h2><p>Le désir se construit dans l'espace entre la présence et l'absence. Quand une marque est partout — tous les réseaux, tous les jours — elle cesse d'être désirable pour devenir disponible. Et ce qui est disponible n'est jamais précieux.</p><p>Hermès ne fait pas de soldes. Ce n'est pas uniquement une stratégie de marge — c'est une déclaration sur la nature de l'objet. Ce refus, répété pendant des décennies, a construit une croyance collective dans la valeur de l'objet.</p><blockquote>Ce qui peut s'expliquer n'a plus besoin d'être désiré. Le luxe opère précisément dans l'espace où l'explication n'est pas bienvenue.</blockquote><h2>L'économie de l'attention rare</h2><p>Dans un monde d'hyperstimulation, la rareté de l'attention est devenue une forme de luxe en soi. <strong>La fréquence n'est pas un signe de vitalité — c'est souvent un signe d'anxiété.</strong></p>"},
{cat:'Le fondateur',title:"L'archétype du fondateur — comment l'identité personnelle contamine la marque",date:'Fév. 2026',read:'8 min',body:"<p class='dc'>Carl Jung avait identifié quelque chose que les théoriciens du branding n'ont jamais vraiment intégré — le fondateur est toujours dans la marque. Pas métaphoriquement. Structuralement. Ses croyances, ses blessures, ses zones d'ombre — tout cela finit par s'exprimer dans les décisions de marque, qu'il en soit conscient ou non.</p><h2>La contamination inconsciente</h2><p>Une marque construite par quelqu'un qui a peur de la visibilité sera systématiquement sous-communicante. Une marque construite par quelqu'un avec une relation difficile à l'argent hésitera toujours à assumer des prix premium. Ces phénomènes ne se voient pas dans les briefs. Ils se voient dans les décisions récurrentes.</p><blockquote>La marque est le fondateur — avec moins de contrôle conscient et plus de révélation.</blockquote><h2>L'ombre et l'architecture</h2><p>Jung appelait « l'ombre » les aspects de soi non intégrés. En branding, l'ombre du fondateur apparaît dans les incohérences. <strong>Tant que l'ombre n'est pas vue, elle gouverne.</strong></p>"},
{cat:'Psychologie',title:"La mécanique du désir — pourquoi les gens paient pour ce qu'ils ne comprennent pas encore",date:'Fév. 2026',read:'6 min',body:"<p class='dc'>Il y a une erreur systématique dans la façon dont les marques tentent de convaincre — elles s'adressent à la compréhension. Elles expliquent, justifient, démontrent la valeur. Ce faisant, elles désactivent précisément le mécanisme qui produit les décisions d'achat les plus durables. La compréhension vient après la décision. Toujours.</p><h2>La tension comme moteur</h2><p>Le désir ne commence pas par une émotion positive. Il commence par une tension. Une incomplétion. Sans cette tension construite en amont, aucune offre ne trouve preneur.</p><blockquote>On ne désire pas ce que l'on comprend. On désire ce que l'on pressent — sans pouvoir encore l'articuler.</blockquote><h2>Ce que le prix signale</h2><p>Un prix élevé dans un contexte de désir bien construit ne crée pas de résistance — il crée de la crédibilité. <strong>La résistance au prix n'est jamais un problème de prix — c'est un problème de désir insuffisamment construit.</strong></p>"},
{cat:'Identité',title:'Le problème avec le branding — pourquoi la plupart des marques restent des sosies',date:'Jan. 2026',read:'5 min',body:"<p class='dc'>Le branding tel qu'il est pratiqué par la quasi-totalité des studios repose sur une prémisse fondamentalement défectueuse — que l'identité se construit en regardant l'extérieur. On analyse le marché, on identifie les concurrents, on cherche le territoire vacant. Le résultat : toutes les marques d'un même secteur finissent invariablement par se ressembler.</p><blockquote>Une identité construite depuis l'extérieur est toujours provisoire. Une identité construite depuis l'intérieur est stable — parce qu'elle est vraie.</blockquote><h2>La différenciation comme miroir</h2><p>Quand votre identité est construite par rapport à vos concurrents, vous les avez laissés définir votre espace. <strong>Vous jouez dans leur grammaire. Vous utilisez leurs catégories pour affirmer que vous êtes différent — ce qui vous confirme comme appartenant exactement à la même conversation qu'eux.</strong></p>"},
{cat:'Luxe & désir',title:"L'objet comme être vivant — la présence physique de la marque",date:'Jan. 2026',read:'4 min',body:"<p class='dc'>Il existe un moment dans l'expérience d'une marque physique — un packaging, un produit, un objet — où quelque chose se passe avant même que l'on ait utilisé quoi que ce soit. Ce moment, la plupart des marques le négligent. Les rares qui l'ont compris ont transformé un contenant en premier acte d'une narration plus grande.</p><h2>L'expérience d'ouverture</h2><p>Apple a compris cela il y a vingt ans. L'ouverture d'une boîte iPhone est une chorégraphie calculée. La résistance légère du couvercle, la lenteur de sa descente — tout cela communique la valeur avant même d'allumer l'appareil.</p><blockquote>Un objet qui a été pensé se sent avant de se voir. C'est la définition de la présence physique d'une marque.</blockquote><p><strong>Cette logique de la révélation progressive est la même qui gouverne les grandes maisons dans toute leur communication. Ils n'invitent pas à admirer. Ils invitent à découvrir.</strong></p>"}];
  var cp=0;
  function openPost(i){
    cp=i;var p=POSTS[i];
    document.getElementById('post-cat').textContent=p.cat;
    document.getElementById('post-title').textContent=p.title;
    document.getElementById('post-meta').innerHTML='<span>'+p.date+'</span><span style="display:inline-block;width:3px;height:3px;border-radius:50%;background:var(--b2);margin:0 12px;vertical-align:middle;"></span><span>'+p.read+' de lecture</span>';
    document.getElementById('post-body').innerHTML=p.body;
    var nx=POSTS[(i+1)%POSTS.length];
    document.getElementById('post-next').textContent='Prochaine — '+nx.title.substring(0,52)+'…';
    showPage('post');
  }
  document.getElementById('post-back').addEventListener('click',function(){showPage('etudes');});
  document.getElementById('post-next-btn').addEventListener('click',function(){openPost((cp+1)%POSTS.length);});
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-post]');
    if(el){openPost(parseInt(el.getAttribute('data-post'),10));}
  });
  var cp=0;
  function openPost(i){
    cp=i; var p=POSTS[i];
    if(!p) return;
    document.getElementById('post-cat').textContent=p.cat;
    document.getElementById('post-title').textContent=p.title;
    document.getElementById('post-meta').innerHTML='<span>'+p.date+'</span><span style="display:inline-block;width:3px;height:3px;border-radius:50%;background:var(--b2);margin:0 12px;vertical-align:middle;"></span><span>'+p.read+' de lecture</span>';
    document.getElementById('post-body').innerHTML=p.body;
    var nx=POSTS[(i+1)%POSTS.length];
    document.getElementById('post-next').textContent='Prochaine — '+nx.title.substring(0,52)+'…';
    showPage('post');
  }
  var pb=document.getElementById('post-back'), pnb=document.getElementById('post-next-btn');
  if(pb) pb.addEventListener('click', function(){ showPage('etudes'); });
  if(pnb) pnb.addEventListener('click', function(){ openPost((cp+1)%POSTS.length); });
  document.addEventListener('click', function(e){
    var el=e.target.closest('[data-post]');
    if(el) openPost(parseInt(el.getAttribute('data-post'), 10));
  });

  // Form - local safe mode
  var fs=document.getElementById('form-send');
  if(fs) fs.addEventListener('click', async function(){
    var payload = {
      name: document.getElementById('name') ? document.getElementById('name').value.trim() : '',
      email: document.getElementById('email') ? document.getElementById('email').value.trim() : '',
      company: document.getElementById('company') ? document.getElementById('company').value.trim() : '',
      message: document.getElementById('message') ? document.getElementById('message').value.trim() : '',
      website: '',
      formStartedAt: window.__formStartedAt || Date.now()-5000
    };
    if(!payload.name || !payload.email || !payload.message){
      alert('Merci de renseigner votre nom, votre email et votre message.');
      return;
    }
    try {
      var res = await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('request_failed');
      alert('Message envoyé. Nous reviendrons vers vous sous 48h ouvrées.');
    } catch(err) {
      alert('Version locale ouverte. Le formulaire nécessite le backend Vercel pour envoyer réellement le message.');
    }
  });
  window.__formStartedAt = Date.now();

  // Hero letter pixel effect
  var introDone=false;
  function splitWord(el){
    if(!el || el.dataset.split==='1') return;
    var text = el.textContent.trim();
    el.textContent='';
    var frag=document.createDocumentFragment();
    text.split('').forEach(function(ch){
      var span=document.createElement('span');
      span.className='hero-letter';
      span.textContent=ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    el.dataset.split='1';
  }
  function runHeroIntro(){
    if(introDone) return;
    var c=document.querySelector('#hero-tilt .hn-c');
    var s=document.querySelector('#hero-tilt .hn-s');
    if(!c || !s) return;
    splitWord(c); splitWord(s);
    var letters = Array.from(document.querySelectorAll('#hero-tilt .hero-letter'));
    letters.forEach(function(letter, i){
      setTimeout(function(){ letter.classList.add('rev'); }, 35*i+120);
    });
    var title=document.getElementById('hero-tilt');
    if(title){
      title.addEventListener('mousemove', function(e){
        var target=e.target.closest('.hero-letter');
        if(target){
          target.classList.add('pix');
          clearTimeout(target.__pixTimer);
          target.__pixTimer=setTimeout(function(){ target.classList.remove('pix'); }, 120);
        }
      });
      title.addEventListener('mouseleave', function(){
        title.querySelectorAll('.hero-letter.pix').forEach(function(l){ l.classList.remove('pix'); });
      });
    }
    introDone=true;
  }

  // Ensure home visible and title split even before language close
  showPage('home');
})();
