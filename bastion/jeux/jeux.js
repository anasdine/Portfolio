/* Généré par outils/extraire-jeux.mjs depuis le dépôt Portfolio. Ne pas modifier ici. */
(function(){
'use strict';

var doc = document, root = doc.documentElement;
var qs = function(s, c){ return (c||doc).querySelector(s); };
var qsa = function(s, c){ return [].slice.call((c||doc).querySelectorAll(s)); };
var clamp = function(v,a,b){ return Math.min(b, Math.max(a, v)); };
var mix = function(a,b,t){ return a + (b-a)*t; };
var sm = function(a,b,y){ var t = clamp((y-a)/(b-a),0,1); return t*t*(3-2*t); };
var damp = function(a,b,l,dt){ return mix(a,b,1-Math.exp(-l*dt)); };
var RM = false, CALM = false;
var TOUCH = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
var MOB = TOUCH || innerWidth < 820;
var BOOT_TIER = TOUCH ? 1 : 0;
var PERF = { avg: .016, lvl: 0, n: 0, acc: 0, frame: 0, floor: 0 };
function CDPR(){ return Math.min(devicePixelRatio || 1, 2); }
function TR(x){ return x; }
function TRn(x){ return x; }
function setTR(el, txt, attr){ if(!el || txt == null) return; if(attr) el.setAttribute(attr, txt); else el.textContent = txt; }
function askResize(fn){ requestAnimationFrame(fn); }
function keepGL(r){ return r; }
var ADA = { ready: false, say: function(){}, focus: function(){}, release: function(){} };
var PIPES = [];
var EASE = 'expo.out';
/* Les jeux n'emploient que trois gestes de GSAP : une petite animation native suffit, sans charger la bibliothèque. */
function etapes(o){ var r = {}, t = []; if('opacity' in o) r.opacity = o.opacity; if('y' in o) t.push('translateY(' + o.y + 'px)'); if('scale' in o) t.push('scale(' + o.scale + ')'); if(t.length) r.transform = t.join(' '); return r; }
var g = {
  fromTo: function(el, de, a){ if(el) el.animate([etapes(de), etapes(a)], { duration: (a.duration || .3) * 1000, easing: 'cubic-bezier(.2,.8,.2,1)' }); },
  to: function(el, a){ if(!el) return; var an = el.animate([etapes(a)], { duration: (a.duration || .3) * 1000, fill: 'forwards' }); an.onfinish = function(){ if(a.onComplete) a.onComplete(); try{ an.commitStyles(); }catch(e){} an.cancel(); }; },
  killTweensOf: function(el){ if(el) el.getAnimations().forEach(function(x){ x.cancel(); }); }
};
function marque(el){ return el; }

var SFX = (function(){
  var ctx = null, out = null, on = true, mort = false;
  try{ if(localStorage.getItem('ad2026.sfx') === '0') on = false; }catch(e){}
  function ready(){
    if(mort || !on) return null;
    if(!ctx){
      var C = window.AudioContext || window.webkitAudioContext;
      if(!C){ mort = true; return null; }
      try{ ctx = new C(); }catch(e){ mort = true; return null; }
      out = ctx.createGain(); out.gain.value = .17; out.connect(ctx.destination);
    }
    if(ctx.state === 'suspended'){ try{ ctx.resume(); }catch(e){} }
    return ctx;
  }
  /* une note : attaque nette, extinction douce, jamais plus d'un quart de seconde */
  function ton(f1, f2, dur, type, vol, del){
    var c = ready(); if(!c) return;
    var t = c.currentTime + (del || 0);
    var o = c.createOscillator(), g2 = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f1, t);
    if(f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(vol == null ? .5 : vol, t + .008);
    g2.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(g2); g2.connect(out);
    o.start(t); o.stop(t + dur + .02);
  }
  /* un choc : du souffle filtré, c'est tout ce qu'il faut */
  function souffle(dur, freq, q, vol, del){
    var c = ready(); if(!c) return;
    var t = c.currentTime + (del || 0);
    var n = Math.floor(c.sampleRate * dur);
    var b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for(var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(); s.buffer = b;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1;
    var g2 = c.createGain();
    g2.gain.setValueAtTime(vol == null ? .5 : vol, t);
    g2.gain.exponentialRampToValueAtTime(.0008, t + dur);
    s.connect(f); f.connect(g2); g2.connect(out);
    s.start(t);
  }
  var GAMME = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
  return {
    actif: function(){ return on; },
    coupe: function(v){
      on = !!v;
      try{ localStorage.setItem('ad2026.sfx', on ? '1' : '0'); }catch(e){}
      if(!on && ctx){ try{ ctx.suspend(); }catch(e){} }
    },
    clic:  function(){ ton(520, 470, .05, 'square', .34); },
    ok:    function(){ ton(660, 990, .1, 'triangle', .4); },
    bad:   function(){ ton(240, 130, .17, 'sawtooth', .3); },
    piece: function(){ ton(940, 1400, .07, 'square', .3); ton(1400, 1870, .07, 'square', .22, .05); },
    tir:   function(){ ton(1150, 320, .08, 'square', .22); },
    boum:  function(){ souffle(.24, 380, 1.1, .5); ton(150, 60, .2, 'sine', .3); },
    choc:  function(){ souffle(.14, 200, .9, .55); ton(120, 70, .16, 'sine', .35); },
    saut:  function(){ ton(340, 780, .11, 'sine', .3); },
    pas:   function(){ souffle(.05, 900, 3, .18); },
    croque:function(){ ton(430, 190, .055, 'square', .26); },
    bip:   function(){ ton(1000, 1000, .07, 'sine', .3); },
    note:  function(i){ ton(GAMME[i % GAMME.length], GAMME[i % GAMME.length], .13, 'triangle', .34); },
    gagne: function(){ ton(659, 659, .1, 'triangle', .34); ton(880, 880, .1, 'triangle', .34, .1); ton(1174, 1174, .18, 'triangle', .3, .2); },
    perd:  function(){ ton(392, 392, .13, 'sawtooth', .26); ton(262, 196, .28, 'sawtooth', .24, .12); }
  };
})();

function vif(el, rendu){
  if(!el) return;
  marque(el);
  el.__vifR = rendu;
  el.textContent = rendu();
}

function boucleFigee(frame, enJeu){
  if(!RM) return null;
  var on = false, tp = 0;
  function pas(ts){
    var fin = !enJeu();
    var dt = tp ? Math.min(.05, (ts - tp) / 1000) : .016;
    tp = ts;
    try{ frame(dt, ts / 1000); }catch(e){}
    if(fin){ on = false; tp = 0; return; }
    requestAnimationFrame(pas);
  }
  return function(){ if(on) return; on = true; tp = 0; requestAnimationFrame(pas); };
}

try{
(function(){ /* JEU 01 — TRIAGE */
  var alertEl = qs('[data-g1-alert]'), verdict = qs('[data-g1-verdict]');
  var scoreEl = qs('[data-g1-score]'), timeEl = qs('[data-g1-time]'), startBtn = qs('[data-g1-start]');
  var keys = qsa('[data-g1-key]');
  if(!alertEl || !startBtn) return;
  var DATA = [
    ['Chiffrement massif de fichiers sur le partage comptabilité', 0, 'SAN-01', 'Un rançongiciel en cours : chaque minute coûte des fichiers. On isole, puis on restaure.'],
    ['Contrôleur de domaine injoignable depuis 4 minutes', 0, 'ESX-02', 'Plus personne ne peut ouvrir sa session : la production est arrêtée.'],
    ['Sauvegarde échouée trois nuits de suite', 0, 'BKP-01', 'Trois nuits sans sauvegarde : la prochaine panne devient irréversible.'],
    ['Grappe RAID dégradée sur le SAN de production', 0, 'SAN-01', 'Un disque de perdu, plus de filet. Le suivant emporte les données.'],
    ['Authentifications échouées : 240 en deux minutes, un seul compte', 0, 'DC-01', "Quelqu'un essaie des mots de passe. On bloque avant qu'il trouve."],
    ['Onduleur passé sur batterie, autonomie 14 minutes', 1, 'UPS-A', 'Ça tient encore quatorze minutes : urgent, mais on a le temps de décider.'],
    ['Espace disque à 92 % sur ESX-01', 1, 'ESX-01', 'À 100 % les machines s\'arrêtent. On a quelques heures, pas quelques jours.'],
    ['Certificat du portail expire dans cinq jours', 1, 'FW-01', "Cinq jours d'avance : on planifie. Le jour J, tout le monde voit l'alerte navigateur."],
    ['Latence du SAN multipliée par quatre depuis une heure', 1, 'SAN-01', 'Rien n\'est tombé, mais tout rame. La cause se cherche maintenant.'],
    ['Allée chaude à 31 °C, consigne 24 °C', 1, 'THERM', 'Sept degrés de trop : le matériel vieillit vite et finira par se couper.'],
    ['Imprimante du deuxième étage hors ligne', 2, 'PRN-02', 'Une personne gênée, un contournement existe. Ça attend demain.'],
    ['Mise à jour de firmware disponible sur deux commutateurs', 2, 'SW-ACC', 'À planifier en fenêtre de maintenance, jamais en pleine journée.'],
    ['Compte verrouillé après trois essais, appel utilisateur', 2, 'DC-01', 'Un utilisateur bloqué : gênant pour lui, sans effet sur le reste.'],
    ['Poste lent signalé par un utilisateur du service achats', 2, 'PC-114', 'Un poste, une personne. On regarde, sans tout arrêter.'],
    ['Un paquet perdu sur dix mille vers la passerelle', 3, 'SW-CORE', 'Un pour dix mille, c\'est la vie normale d\'un réseau. Aucune action.'],
    ['Service redémarré automatiquement, retour à la normale', 3, 'ESX-01', "Le système s'est soigné seul : c'est exactement ce qu'on attend de lui."],
    ['Analyse antivirus planifiée terminée, aucune détection', 3, 'AV', 'Une bonne nouvelle n\'est pas un incident.'],
    ['Journal de test émis par la sonde de supervision', 3, 'PROBE', 'La sonde se teste elle-même. C\'est le bruit qu\'on filtre en premier.'],
    ['Sauvegarde nocturne terminée, 41 machines, zéro échec', 3, 'BKP-01', 'Zéro échec : à lire le matin, pas à traiter la nuit.']
  ];
  var LBL = ['P1', 'P2', 'P3', 'BRUIT'];
  /* « BRUIT » restait en français dans le verdict des sept autres langues,
     alors que la touche du dessous, elle, disait « NOISE » ou « RAUSCHEN » */
  function lib(k){ return k === 3 ? TR(LBL[3]) : LBL[k]; }
  var cur = null, score = 0, left = 40, run = false, iv = null, pool = [];
  var serie = 0, meilleure = 0;
  var idle = 0, helped = 0, coach = null;
  var G1TIP = [
    'Un service qui redémarre seul, ce n\'est pas un incident : c\'est du bruit.',
    'La sauvegarde qui échoue trois nuits, c\'est P1. On ne le voit qu\'après.',
    'Une imprimante hors ligne gêne une personne : P3 suffit.',
    'Deux cent quarante échecs sur un seul compte : quelqu\'un essaie des mots de passe.'
  ];
  function pick(){
    if(!pool.length){ pool = DATA.slice(); for(var i = pool.length - 1; i > 0; i--){ var j = (Math.random() * (i + 1)) | 0, t = pool[i]; pool[i] = pool[j]; pool[j] = t; } }
    cur = pool.pop();
    /* l'alerte se lit comme une ligne de console : l'heure, la machine,
       le message. C'est ce qui arrive vraiment dans une console. */
    var d = new Date();
    var hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' +
             String(d.getSeconds()).padStart(2, '0');
    var ligneAl = cur;
    vif(alertEl, function(){ return hh + '  ' + (ligneAl[2] || '—') + '  ' + TRn(ligneAl[0]); });
    if(!RM) g.fromTo(alertEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, ease: EASE });
  }
  function stop(){
    run = false; clearInterval(iv); iv = null;
    clearInterval(coach); coach = null;
    /* le trophée était accroché à l'assistante : sans elle — écran sans 3D,
       balise absente, exception plus haut — la manche gagnée ne comptait pas,
       alors que la page promet une formation contre trois épreuves. Les douze
       autres jeux l'accordent sans condition. */
    if(score >= 14) try{ TROPHY.win('g1'); }catch(err){}
    if(ADA.ready){
      ADA.release(alertEl);
      ADA.say(score >= 14 ? 'Tri juste. C\'est exactement ce que Leonhard automatise.'
                          : 'Le tri prend du temps, et il se fait à chaud. D\'où l\'outil.', 5000);
    }
    /* la phrase de fin était assemblée avant d'être écrite : aucune clé ne
       pouvait lui correspondre. On traduit des gabarits à trou, le nombre
       reprend sa place ensuite. */
    vif(alertEl, function(){ return TR(Math.abs(score) > 1 ? 'Terminé — # points sur 40 secondes.'
                                                 : 'Terminé — # point sur 40 secondes.').replace('#', score); });
    vif(verdict, function(){ return (meilleure >= 3 ? TR('Meilleure série : # d\'affilée.').replace('#', meilleure) + ' ' : '') +
      TR(score >= 14 ? 'Vous savez trier. Le reste, Leonhard le fait pour vous.'
                     : 'Le tri, c\'est ce qui coûte le plus de temps en vrai.'); });
    verdict.style.color = '#7C8791';
    setTR(marque(startBtn), 'REJOUER');
  }
  function answer(k){
    if(!run || !cur) return;
    /* les deux horloges d'assistance ne repartaient jamais de zéro : au clavier
       rien ne les touchait, et celle du relais montait pendant toute la manche.
       ADA soufflait la réponse, puis jouait à la place d'un joueur qui n'avait
       pas bloqué une seconde. Répondre les remet à zéro, quel que soit le
       moyen — doigt, souris ou touche. */
    idle = 0; helped = 0;
    var ok = k === cur[1];
    /* la série : trois bonnes réponses d'affilée et les points doublent —
       c'est le rythme du tri qui compte, pas le coup de chance */
    if(ok){ serie++; if(serie > meilleure) meilleure = serie; }
    else serie = 0;
    var mult = serie >= 6 ? 3 : serie >= 3 ? 2 : 1;
    score += ok ? mult : -1;
    SFX[ok ? 'ok' : 'bad']();
    scoreEl.textContent = score + (mult > 1 ? ' ×' + mult : '');
    /* la raison, toujours : c'est elle qui apprend quelque chose */
    /* l'alerte suivante remplace « cur » juste après : le verdict garde la
       sienne, et se retraduit entier si la langue change */
    var raison = cur[3], attendu = cur[1];
    /* « ✗ c'était » est dans la table, mais collé au libellé avant d'être écrit
       il n'était jamais cherché : la ligne la plus lue du jeu restait en
       français dans les sept autres langues */
    vif(verdict, function(){
      return (ok ? '✓ ' + lib(attendu) : TR('✗ c\'était') + ' ' + lib(attendu)) + (raison ? ' · ' + TRn(raison) : '');
    });
    verdict.style.color = ok ? '#048B9A' : '#FF5C4D';
    var btn = keys[k];
    if(btn && !RM) g.fromTo(btn, { scale: .94 }, { scale: 1, duration: .3, ease: 'back.out(3)' });
    /* la ligne de verdict est en corps dix et l'alerte suivante a déjà pris la
       place : au téléphone, personne ne lit quelle touche il fallait presser.
       Elle se signale donc elle-même quand on s'est trompé. */
    var vrai = keys[cur[1]];
    if(!ok && vrai && !RM) g.fromTo(vrai, { scale: 1.14 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
    pick();
  }
  /* sur iOS deux tapes rapprochées valent un agrandissement : dans une manche
     de quarante secondes on tape vite, et la carte partait en zoom au lieu de
     trier. La propriété se pose sur les quatre touches, le gabarit de la page
     n'est pas touché. */
  keys.forEach(function(b){
    b.style.touchAction = 'manipulation';
    b.addEventListener('click', function(){ idle = 0; answer(parseInt(b.getAttribute('data-g1-key'), 10)); });
  });
  /* elle regarde par-dessus votre épaule : un indice si vous bloquez,
     et elle prend un tour toutes les huit secondes pour vous soulager */
  /* la carte sortie de l'écran, la manche se met en attente : le sablier
     brûlait les quarante secondes pendant qu'on lisait plus haut, et l'on
     revenait sur un « Terminé » qu'on n'avait pas joué */
  var vu = true;
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ vu = en[0].isIntersecting; })
      .observe(alertEl.closest('[data-game]') || alertEl);
  }
  function tick1(){
    if(!run || !ADA.ready || !vu) return;
    idle += .5;
    if(idle > 6.5 && cur){
      idle = 0;
      var hintTxt = cur[1] === 0 ? 'Celle-là arrête la production. P1.'
        : cur[1] === 1 ? 'Personne n\'est bloqué, mais ça va empirer. P2.'
        : cur[1] === 2 ? 'Une personne gênée, rien d\'urgent. P3.'
        : 'Aucune action attendue : c\'est du bruit.';
      /* les quatre indices sont rangés tels quels dans la table ; le préfixe
         collé devant les rendait introuvables, et l'indice sortait en français
         partout ailleurs qu'en France. Seule, la phrase est retrouvée et son
         numéro de priorité remis en place. */
      ADA.say(hintTxt, 3600);
      return;
    }
    /* elle ne prend un tour que si vous restez vraiment bloqué : c'est vous
       qui jouez, la file ne doit pas défiler toute seule */
    if(helped > 24 && Math.random() < .06 && cur){
      helped = 0;
      var k = cur[1];
      /* même assemblage que l'indice, même conséquence : les deux moitiés sont
         dans la table, la phrase entière non — le libellé de priorité tombe au
         milieu. On traduit chaque moitié avant de coller. */
      ADA.say(TR('J\'en prends une :') + ' ' + lib(k) + '. ' + TR('À vous.'), 3200);
      answer(k);
      return;
    }
    helped += .5;
  }
  addEventListener('keydown', function(e){
    if(!run || !vu) return;
    /* les chiffres tapés dans le terminal du jeu 13 ou dans la bulle de
       l'assistante étaient avalés par la manche en cours */
    var tg = e.target, tn = tg && tg.tagName;
    if(tn === 'INPUT' || tn === 'TEXTAREA' || tn === 'SELECT' || (tg && tg.isContentEditable)) return;
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    var m = { '1': 0, '2': 1, '3': 2, '0': 3 };
    if(m[e.key] !== undefined){ e.preventDefault(); answer(m[e.key]); }
  });
  startBtn.addEventListener('click', function(){
    /* la série et son record traversaient la partie : on repartait avec le
       multiplicateur gagné à la manche d'avant, et le bilan annonçait un
       record qui n'appartenait pas à celle qu'on venait de jouer */
    score = 0; left = 40; run = true; pool = []; serie = 0; meilleure = 0;
    scoreEl.textContent = '0'; timeEl.textContent = '40 s';
    setTR(marque(startBtn), 'EN COURS');
    /* la table range cette consigne avec un « # » à la place du chiffre : le
       « 1 » écrit en clair ne trouvait aucune clé, et la seule phrase qui
       explique la règle partait en traduction automatique */
    vif(verdict, function(){ return TR('Priorité # = production arrêtée · Bruit = aucune action attendue.').replace('#', '1'); });
    verdict.style.color = '#56606A';
    pick();
    idle = 0; helped = 0;
    if(ADA.ready){
      ADA.focus(alertEl);
      /* la phrase et l'indice sont traduits chacun de son côté : collés
         avant l'appel, ils ne correspondaient à aucune clé */
      ADA.say(TR('Je trie avec vous.') + ' ' + TR(G1TIP[(Math.random() * G1TIP.length) | 0]), 5200);
    }
    clearInterval(iv);
    clearInterval(coach);
    coach = setInterval(tick1, 500);
    iv = setInterval(function(){
      /* l'onglet passé à l'arrière-plan brûlait la manche : on revenait sur un
         « Terminé » qu'on n'avait pas joué. Le sablier attend le retour. */
      if(doc.hidden || !vu) return;
      left--; timeEl.textContent = left + ' s';
      if(left <= 0) stop();
    }, 1000);
  });
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 02 — PARE-FEU */
  var cv = qs('[data-g2]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  /* seule toile de jeu sans touch-action : sur iPhone, taper vite sur la grille
     déclenchait le zoom du double-tap au lieu de bloquer un paquet.
     « manipulation » suffit ici — la page continue de défiler sous le doigt. */
  cv.style.touchAction = 'manipulation';
  var scoreEl = qs('[data-g2-score]'), timeEl = qs('[data-g2-time]'), startBtn = qs('[data-g2-start]'), hint = qs('[data-g2-hint]');
  var PORTS = ['22','80','443','445','3389','53','25','8080','1433','161','389','5900'];
  var DPR2 = CDPR(), W = 0, H = 0, COLS = 4, ROWS = 3, cells = [];
  var run = false, score = 0, leaks = 0, left = 40, spawnT = 0, iv = null, vis = false;
  /* ADA surveille la moitié droite : elle bloque, mais lentement */
  var aT = 0, aCell = -1, aLock = 0, said = 0;
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = W * DPR2; cv.height = H * DPR2;
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    var pad = 12, gx = 7;
    var cw = (W - pad * 2 - gx * (COLS - 1)) / COLS, ch = (H - pad * 2 - gx * (ROWS - 1)) / ROWS;
    /* la barre d'adresse d'un téléphone se replie au défilement : la toile est
       remesurée en pleine partie. Reconstruire les cases effaçait les paquets
       en vol — on ne fait que les replacer. */
    var n = 0;
    for(var r2 = 0; r2 < ROWS; r2++) for(var c = 0; c < COLS; c++){
      var b0 = cells[n];
      if(!b0){ b0 = { port: PORTS[n % PORTS.length], state: 0, life: 0, flash: 0 }; cells.push(b0); }
      b0.x = pad + c * (cw + gx); b0.y = pad + r2 * (ch + gx); b0.w = cw; b0.h = ch;
      n++;
    }
  }
  function draw(t){
    c2.fillStyle = '#0B0E11'; c2.fillRect(0, 0, W, H);
    for(var i = 0; i < cells.length; i++){
      var b = cells[i];
      var hostile = b.state === 2, legit = b.state === 1;
      var col = hostile ? '255,92,77' : legit ? '4,139,154' : '228,232,234';
      if(b.byAda && b.flash > 0) col = '65,105,225';
      if(b.flash <= 0) b.byAda = 0;
      var a = b.state ? (.1 + .22 * Math.max(0, b.life)) : .022;
      c2.fillStyle = 'rgba(' + col + ',' + a.toFixed(3) + ')';
      c2.fillRect(b.x, b.y, b.w, b.h);
      c2.strokeStyle = 'rgba(' + col + ',' + (b.state ? .85 : .13) + ')';
      c2.lineWidth = b.state ? 1.4 : 1;
      c2.strokeRect(b.x, b.y, b.w, b.h);
      c2.font = '9.5px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = b.state ? 'rgba(' + col + ',1)' : 'rgba(57,66,74,1)';
      c2.fillText(':' + b.port, b.x + 7, b.y + 11);
      if(b.state){
        var bw = (b.w - 14) * Math.max(0, b.life);
        c2.fillStyle = 'rgba(' + col + ',.75)';
        c2.fillRect(b.x + 7, b.y + b.h - 9, bw, 2);
        c2.font = '600 10px "IBM Plex Mono", ui-monospace, monospace';
        c2.fillText(hostile ? 'BLOQUER' : 'LAISSER', b.x + 7, b.y + b.h * .55);
      }
      if(b.flash > 0){
        c2.strokeStyle = b.ok ? 'rgba(4,139,154,' + b.flash.toFixed(2) + ')' : 'rgba(255,92,77,' + b.flash.toFixed(2) + ')';
        c2.lineWidth = 2;
        c2.strokeRect(b.x - 2, b.y - 2, b.w + 4, b.h + 4);
      }
    }
    if(!run){
      c2.fillStyle = 'rgba(10,12,14,.72)'; c2.fillRect(0, 0, W, H);
      c2.font = '600 11px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = '#048B9A';
      var msg = leaks || score ? (score + ' bloqués · ' + leaks + ' fuites') : 'Filtrez le flux entrant';
      c2.fillText(msg, W * .5 - c2.measureText(msg).width * .5, H * .5);
    }
  }
  function step(dt){
    for(var i = 0; i < cells.length; i++){
      var b = cells[i];
      if(b.flash > 0) b.flash = Math.max(0, b.flash - dt * 2.4);
      if(!b.state) continue;
      b.life -= dt / (b.state === 2 ? 1.25 : 1.6);
      if(b.life <= 0){
        /* phrase assemblée à la main : aucune clé ne pouvait lui correspondre et
           elle restait française partout ailleurs. Et une fuite silencieuse
           passe inaperçue quand on surveille l'autre moitié du mur. */
        if(b.state === 2){ leaks++; b.flash = 1; b.ok = false; SFX.bad();
          if(hint) vif(hint, function(){ return TR(leaks > 1 ? '# fuites — un paquet hostile est passé' : '# fuite — un paquet hostile est passé').replace('#', leaks); }); }
        b.state = 0;
      }
    }
    /* l'assistante bloque ce qui traîne sur sa moitié, avec un temps de réaction */
    if(run && ADA.ready){
      aT += dt;
      if(aCell >= 0){
        aLock -= dt;
        var b3 = cells[aCell];
        if(!b3 || b3.state !== 2){ aCell = -1; }
        else if(aLock <= 0){
          b3.state = 0; b3.flash = 1; b3.ok = true; b3.byAda = 1;
          score++; scoreEl.textContent = score;
          if(hint) vif(hint, function(){ return TR('ADA a bloqué :') + b3.port + ' ' + TR('— gardez la gauche, je tiens la droite'); });
          aCell = -1;
        }
      }else if(aT > .55){
        aT = 0;
        for(var k2 = 0; k2 < cells.length; k2++){
          var c3 = cells[k2];
          if(c3.state === 2 && c3.x > W * .5 && c3.life < .72){ aCell = k2; aLock = .38; break; }
        }
      }
      if(leaks >= 2 && !said){ said = 1; ADA.say('Deux fuites. Prenez la gauche, je garde la droite.', 4200); }
    }
    if(!run) return;
    spawnT -= dt;
    if(spawnT <= 0){
      var free = cells.filter(function(c){ return !c.state; });
      if(free.length){
        var b2 = free[(Math.random() * free.length) | 0];
        b2.state = Math.random() < .55 ? 2 : 1;
        b2.life = 1;
      }
      spawnT = Math.max(.28, .95 - score * .02) * (.6 + Math.random() * .7);
    }
  }
  cv.addEventListener('pointerdown', function(e){
    if(!run) return;
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for(var i = 0; i < cells.length; i++){
      var b = cells[i];
      if(x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h){
        if(b.state === 2){ score++; b.flash = 1; b.ok = true; SFX.ok(); if(hint) vif(hint, function(){ return TR('bloqué sur :') + b.port; }); if(ADA.ready && score === 5) ADA.say('Bon rythme. Je continue sur la droite.', 3000); }
        else if(b.state === 1){ score = Math.max(0, score - 1); b.flash = 1; b.ok = false; SFX.bad(); if(hint) vif(hint, function(){ return TR('faux positif — vous avez coupé du trafic légitime'); }); }
        /* au doigt, le paquet s'éteint souvent pendant que la main descend :
           sanctionner la case vide faisait passer le jeu pour cassé */
        else { b.flash = .6; b.ok = false; SFX.clic(); if(hint) vif(hint, function(){ return TR('port fermé pour rien'); }); }
        b.state = 0;
        scoreEl.textContent = score;
        return;
      }
    }
  });
  startBtn.addEventListener('click', function(){
    /* le bouton reste sous le doigt pendant toute la partie : une deuxième
       tape remettait le score à zéro sans prévenir */
    if(run) return;
    run = true; score = 0; leaks = 0; left = 40; spawnT = .2;
    cells.forEach(function(b){ b.state = 0; b.flash = 0; b.life = 0; b.ok = false; b.byAda = 0; });
    scoreEl.textContent = '0'; timeEl.textContent = '40 s';
    setTR(marque(startBtn), 'EN COURS');
    if(hint){ hint.style.color = '#39424A'; vif(hint, function(){ return TR('rouge = à bloquer · cyan = à laisser passer'); }); }
    aCell = -1; aLock = 0; said = 0; aT = 0;
    if(ADA.ready){ ADA.focus(cv); ADA.say('On se partage le mur : vous à gauche, moi à droite.', 4600); }
    if(relance) relance();
    clearInterval(iv);
    iv = setInterval(function(){
      /* hors de l'écran ou onglet caché, le mur attend : les paquets
         continuaient d'arriver et de fuir sans personne pour les bloquer,
         et la partie se jouait — et se perdait — pendant qu'on lisait ailleurs */
      if(doc.hidden || (api && !api.vis)) return;
      left--; timeEl.textContent = left + ' s';
      if(left <= 0){
        if(ADA.ready){ ADA.release(cv); ADA.say(leaks ? 'Trois secondes de retard et ça passe. C\'est pour ça qu\'on automatise.' : 'Mur tenu. À deux, c\'est plus simple.', 4600); }
        clearInterval(iv); iv = null; run = false;
        setTR(marque(startBtn), 'REJOUER');
        /* les paquets encore en vol continuaient de vieillir après la fin : une
           fuite s'ajoutait au récapitulatif une seconde après son écriture */
        for(var ci = 0; ci < cells.length; ci++){ cells[ci].state = 0; cells[ci].life = 0; }
        aCell = -1;
        var tenu = score >= 12 && leaks <= 5;
        /* gabarit à trou : les deux nombres reprennent leur place après la
           traduction, la phrase entière devient une clé possible */
        if(hint){
          /* la couleur dit ce que les deux nombres ne disaient pas : tenu, ou non */
          hint.style.color = tenu ? '#048B9A' : '#F5A524';
          vif(hint, function(){ return TR('# bloqués, # fuites — c\'est exactement ce que le filtre automatise')
            .replace('#', score).replace('#', leaks); });
        }
        if(tenu) TROPHY.win('g2');
      }
    }, 1000);
  });
  layout();
  if(window.ResizeObserver) new ResizeObserver(function(){ askResize(layout); }).observe(cv);
  var relance = boucleFigee(function(dt, t){ step(dt); draw(t); }, function(){ return run; });
  if(RM){ draw(0); return; }
  var api = { vis: false };
  /* hors écran, la partie attend avec le sablier : rien ne vieillit, rien
     ne fuit, et douze cases ne sont pas repeintes pour personne */
  api.frame = function(dt, t){ if(!api.vis) return; step(dt); draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { rootMargin: '80px' }).observe(cv);
  }else{ api.vis = true; }
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 03 — MONTER LA BAIE : poids, énergie, ventilation, câblage */
  var cv = qs('[data-g3]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var newBtn = qs('[data-g3-new]'), mvEl = qs('[data-g3-moves]'), stEl = qs('[data-g3-state]'), lvEl = qs('[data-g3-level]');
  /* la toile était la seule du moteur rendue à 1× : sur un écran à deux points
     par pixel, les montants d'un pixel et les étiquettes de 7 px sortaient
     floues. CDPR borne déjà la surface sur tablette, on lui laisse la mesure. */
  var DPR2 = CDPR(), W = 0, H = 0;
  var CY = '#048B9A', RD = '#FF5C4D', AM = '#F5A524', IV = '#E4E8EA', DM = '#39424A', GRN = '#50C878', BL = '#4169E1';
  var U = 14, level = 1, placed = 0, done = false, drag = null, flash = 0, msg = '', score = 0;
  /* la baie complete dissipe 102 : avec une capacite de 100, le montage juste
     declenchait « la ventilation sature », coutait 30 points et privait du
     bonus, alors qu aucun autre placement n est accepte. La capacite couvre le
     nominal, la jauge se lit a 85 %. */
  var pwrCap = 3200, coolCap = 120, hint = -1, hintT = 0, shake = 0;
  /* ADA au montage : elle conseille l'ordre, et pose une unité si ça traîne */
  var aIdle = 0, aCoach = null, aDone = 0;

  /* u = emplacement attendu, h hauteur, w poids, p watts, c chaleur, net = a besoin du réseau */
  var LIB = [
    { n: 'PATCH-A',   h: 1, u: 0,  w: 3,  p: 0,    c: 0,  net: 0, why: 'le brassage se pose en haut : les câbles descendent' },
    { n: 'SW-CORE',   h: 1, u: 1,  w: 8,  p: 220,  c: 12, net: 1, why: 'le cœur de réseau juste sous le brassage, cordons courts' },
    { n: 'FW-01',     h: 1, u: 2,  w: 9,  p: 180,  c: 10, net: 1, why: 'le pare-feu après le switch, avant les serveurs' },
    { n: 'ESX-01',    h: 2, u: 4,  w: 24, p: 780,  c: 26, net: 1, why: 'serveur au milieu : lourd, mais accessible en façade' },
    { n: 'ESX-02',    h: 2, u: 6,  w: 24, p: 780,  c: 26, net: 1, why: 'second serveur juste sous le premier, câblage jumeau' },
    { n: 'SAN-01',    h: 2, u: 9,  w: 38, p: 620,  c: 20, net: 1, why: 'le stockage plus bas : c\'est la pièce la plus lourde après l\'onduleur' },
    { n: 'UPS-A',     h: 2, u: 12, w: 62, p: 0,    c: 8,  net: 0, why: 'l\'onduleur au pied : la baie ne basculera pas' }
  ];
  var items = [], G = {};

  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = W * DPR2; cv.height = H * DPR2;
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    var padT = 46, padB = 40;
    G.rw = Math.min(W * .42, 196);
    G.rx = W - G.rw - 12;
    G.ry = padT; G.rh = H - padT - padB;
    G.u = G.rh / U;
    G.lx = 10; G.lw = Math.max(74, G.rx - 24);
    items.forEach(function(it){ if(!it.ok) park(it); else seat(it); });
  }
  function park(it){
    var rows = LIB.length;
    it.x = G.lx; it.w = G.lw;
    it.h = Math.max(15, (G.rh - 8) / rows - 5);
    it.y = G.ry + it.idx * ((G.rh - 8) / rows);
  }
  /* ADA au montage : poser une unité comme le ferait le visiteur */
  function autoPlace(it){
    if(!it || it.ok) return false;
    /* jamais la derniere : le bilan, le bonus et le niveau suivant sont câblés
       sur le dépôt du visiteur. Une baie terminée par ADA restait figée sur un
       écran de victoire sans bonus, sans suite et sans rendre la main. */
    if(placed >= LIB.length - 1) return false;
    it.ok = true; seat(it);
    placed++; flash = 1; if(!it.paid){ it.paid = 1; score += 100; } msg = TR('ADA :') + ' ' + TR(it.def.why);
    if(mvEl) mvEl.textContent = placed + ' / ' + LIB.length;
    return true;
  }
  function seat(it){
    it.x = G.rx + 1; it.w = G.rw - 2;
    it.y = G.ry + it.def.u * G.u + 1; it.h = G.u * it.def.h - 2;
  }
  function reset(){
    var order = LIB.slice();
    for(var i = order.length - 1; i > 0; i--){ var j = (Math.random() * (i + 1)) | 0; var t = order[i]; order[i] = order[j]; order[j] = t; }
    items = order.map(function(d, k){ return { def: d, idx: k, ok: false, x: 0, y: 0, w: 0, h: 0 }; });
    placed = 0; done = false; drag = null; msg = ''; score = 0; hint = -1; shake = 0;
    aIdle = 0; aDone = 0;
    clearInterval(aCoach);
    if(ADA.ready){
      ADA.focus(cv);
      ADA.say('Je monte avec vous. La règle : le lourd en bas, l\'onduleur au sol, et de l\'air entre les serveurs.', 6200);
      aCoach = setInterval(function(){
        /* la baie sortie de l'écran, ADA attend : elle posait des unités
           pendant qu'on lisait ailleurs, et l'on revenait sur un montage
           avancé sans y avoir touché */
        if(done || !items || (api && !api.vis)){ return; }
        aIdle += .6;
        /* un conseil quand on hésite */
        if(aIdle > 5 && aIdle < 5.7){
          var todo = null;
          for(var i = 0; i < items.length; i++) if(!items[i].ok){ todo = items[i]; break; }
          if(todo) ADA.say('Conseil — ' + todo.def.n + ' : ' + todo.def.why, 5400);
        }
        /* et un coup de main de temps en temps : elle en pose une */
        if(aIdle > 11 && aDone < 2){
          aIdle = 0; aDone++;
          var free = [];
          for(var k = 0; k < items.length; k++) if(!items[k].ok) free.push(items[k]);
          if(free.length){
            var pick2 = free[0];
            if(typeof autoPlace === 'function' && autoPlace(pick2)){
              ADA.say('J\'en pose une : ' + pick2.def.n + '. À vous pour la suite.', 5000);
            }
          }
        }
      }, 600);
    }
    if(mvEl) mvEl.textContent = '0 / ' + LIB.length;
    /* « baie # » n'est pas dans la table, « baie 1 » si : on en garde la
       traduction et l'on remplace le seul chiffre qu'elle porte */
    if(lvEl) vif(lvEl, function(){ return TR('baie 1').replace('1', String(level)); });
    if(stEl){ vif(stEl, function(){ return TR('glissez chaque appareil à sa place'); }); stEl.style.color = DM; }
    layout();
  }
  /* --- bilans en direct --- */
  function tally(){
    var w = 0, p = 0, c = 0, mom = 0, n = 0;
    items.forEach(function(it){
      if(!it.ok) return;
      n++; w += it.def.w; p += it.def.p; c += it.def.c;
      /* moment du poids : U01 est en haut de la baie, plus l appareil est bas
         dans les montants, plus il fait descendre le centre de gravite */
      mom += it.def.w * (it.def.u + it.def.h * .5);
    });
    /* l ancienne mesure comptait le poids « en haut » et plafonnait a 59 % :
       la baie montee exactement comme demandé s affichait en ROUGE et perdait
       81 points de bonus. On rapporte le centre de gravité au milieu de la
       baie, un montage juste atteint le plafond. */
    return { w: w, p: p, c: c, mom: mom, n: n, stab: w ? clamp(mom / w / (U * .55), 0, 1) : 1 };
  }
  function slotAt(y){ return clamp(Math.floor((y - G.ry) / G.u), 0, U - 1); }
  function freeAt(u, h, self){
    if(u + h > U) return false;
    for(var i = 0; i < items.length; i++){
      var it = items[i];
      if(it === self || !it.ok) continue;
      if(u < it.def.u + it.def.h && it.def.u < u + h) return false;
    }
    return true;
  }

  function draw(t){
    /* les fondus étaient décomptés par image : à quinze images par seconde sur
       tablette une secousse durait quatre fois plus longtemps qu'au bureau, et
       moitié moins sur un écran à 120 Hz. On décompte sur le baromètre. */
    var d = clamp(PERF.avg, .008, .05);
    if(!G.u) layout();
    c2.fillStyle = '#0B0E11'; c2.fillRect(0, 0, W, H);
    var T2 = tally();
    /* --- bandeau de contraintes --- */
    c2.font = '8.5px "IBM Plex Mono", ui-monospace, monospace';
    var bars = [
      { k: 'POIDS', v: T2.w, max: 200, u: ' kg', col: T2.w > 170 ? AM : CY },
      { k: 'ALIM', v: T2.p, max: pwrCap, u: ' W', col: T2.p > pwrCap * .85 ? RD : CY },
      { k: 'FROID', v: T2.c, max: coolCap, u: ' %', col: T2.c > coolCap * .85 ? AM : CY },
      { k: 'STABILITÉ', v: Math.round(T2.stab * 100), max: 100, u: ' %', col: T2.stab < .6 ? RD : GRN }
    ];
    var bw = (W - 20) / 4;
    for(var i = 0; i < 4; i++){
      var b = bars[i], bx = 10 + i * bw;
      var val = b.v + b.u, vw = c2.measureText(val).width;
      /* sur un téléphone chaque jauge n'a que 90 px : « STABILITÉ » touchait
         « 100 % » (et le recouvrait en arabe ou en allemand). Le libellé,
         traduit, se resserre jusqu'à tenir, puis s'abrège. */
      var lab = TR(b.k), place2 = bw - 12 - vw - 5, fs = 8.5;
      while(fs > 6.5 && c2.measureText(lab).width > place2){ fs -= .5; c2.font = fs + 'px "IBM Plex Mono", ui-monospace, monospace'; }
      while(lab.length > 2 && c2.measureText(lab).width > place2) lab = lab.slice(0, -2) + '…';
      c2.fillStyle = DM; c2.fillText(lab, bx, 12);
      c2.font = '8.5px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = b.col;
      c2.fillText(val, bx + bw - 12 - vw, 12);
      c2.fillStyle = 'rgba(228,232,234,.09)'; c2.fillRect(bx, 20, bw - 14, 2.5);
      c2.fillStyle = b.col; c2.fillRect(bx, 20, (bw - 14) * clamp(b.v / b.max, 0, 1), 2.5);
    }
    /* --- réserve --- */
    c2.fillStyle = DM; c2.fillText('À POSER', G.lx, G.ry - 10);
    c2.fillText(TR('BAIE') + ' ' + U + ' U', G.rx, G.ry - 10);
    /* --- montants --- */
    var sx = shake > 0 ? (Math.random() - .5) * shake * 5 : 0;
    shake = Math.max(0, shake - .04);
    c2.save(); c2.translate(sx, 0);
    c2.strokeStyle = 'rgba(228,232,234,.22)'; c2.lineWidth = 1;
    c2.strokeRect(G.rx, G.ry, G.rw, G.rh);
    for(var u = 0; u < U; u++){
      var y = G.ry + u * G.u;
      c2.strokeStyle = 'rgba(228,232,234,.05)';
      c2.beginPath(); c2.moveTo(G.rx, y); c2.lineTo(G.rx + G.rw, y); c2.stroke();
      c2.fillStyle = 'rgba(124,135,145,.42)';
      c2.font = '7px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillText('U' + String(U - u).padStart(2, '0'), G.rx + 3, y + G.u * .5);
      c2.fillStyle = 'rgba(228,232,234,.14)';
      c2.fillRect(G.rx + G.rw - 4.5, y + 2, 2, 2);
    }
    /* --- indice : l'emplacement attendu clignote --- */
    if(hint >= 0 && hintT > 0){
      var hd = LIB[hint];
      c2.fillStyle = 'rgba(65,105,225,' + (.1 + .1 * Math.sin(t * 7)).toFixed(2) + ')';
      c2.fillRect(G.rx + 1, G.ry + hd.u * G.u, G.rw - 2, G.u * hd.h);
      hintT -= .016;
    }
    /* --- cible de dépôt --- */
    if(drag){
      var su = slotAt(drag.y + drag.h * .5);
      var fits = freeAt(su, drag.def.h, drag);
      var right = su === drag.def.u;
      c2.fillStyle = right ? 'rgba(92,225,166,.14)' : (fits ? 'rgba(245,165,36,.1)' : 'rgba(255,92,77,.12)');
      c2.fillRect(G.rx + 1, G.ry + su * G.u, G.rw - 2, G.u * drag.def.h);
      c2.strokeStyle = right ? GRN : (fits ? AM : RD);
      c2.setLineDash([3, 3]);
      c2.strokeRect(G.rx + 1, G.ry + su * G.u, G.rw - 2, G.u * drag.def.h);
      c2.setLineDash([]);
    }
    /* --- appareils --- */
    items.forEach(function(it){ if(it !== drag) unit(it, t); });
    if(drag) unit(drag, t);
    /* --- câblage : du brassage vers chaque appareil réseau --- */
    var patch = null;
    items.forEach(function(it){ if(it.ok && it.def.n === 'PATCH-A') patch = it; });
    if(patch){
      items.forEach(function(it){
        if(!it.ok || !it.def.net) return;
        var ax = G.rx + G.rw - 8, ay = patch.y + patch.h * .5;
        var by = it.y + it.h * .5;
        c2.strokeStyle = 'rgba(4,139,154,.35)'; c2.lineWidth = 1;
        c2.beginPath();
        c2.moveTo(ax, ay);
        c2.bezierCurveTo(ax + 14, ay, ax + 14, by, ax, by);
        c2.stroke();
        var ph = (t * .5 + it.def.u * .2) % 1;
        c2.fillStyle = '#5FD3E3';
        c2.beginPath(); c2.arc(ax + 10 * Math.sin(ph * 3.1416), mix(ay, by, ph), 1.6, 0, 6.2832); c2.fill();
      });
    }
    c2.restore();
    /* --- message --- */
    if(msg){
      c2.font = '8.5px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = flash > 0 ? GRN : 'rgba(124,135,145,.9)';
      /* la raison du refus était coupée en plein mot au bord droit — sur un
         téléphone, toute la seconde moitié de la règle disparaissait. Le
         message est déjà traduit : il passe sur deux lignes, sous la baie. */
      var ls = deuxLignes(msg, W - 20);
      for(var li = 0; li < ls.length; li++) c2.fillText(ls[li], 10, H - 12 - (ls.length - 1 - li) * 11);
    }
    flash = Math.max(0, flash - d * 1.2);
    if(done){
      c2.fillStyle = 'rgba(92,225,166,.1)'; c2.fillRect(0, 0, W, H);
      c2.font = '600 11px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = GRN;
      var m1 = TR('INSPECTION PASSÉE —') + ' ' + score + ' PTS';
      c2.fillText(m1, W * .5 - c2.measureText(m1).width * .5, H * .5);
      c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = 'rgba(198,206,212,.9)';
      var m2 = T2.p + ' W · ' + T2.w + ' kg · stabilité ' + Math.round(T2.stab * 100) + ' %';
      c2.fillText(m2, W * .5 - c2.measureText(m2).width * .5, H * .5 + 16);
    }
  }
  /* coupe un texte en deux lignes au plus, aux espaces quand il y en a
     (le chinois et le japonais n'en ont pas : on coupe alors au caractère) */
  function deuxLignes(tx, max){
    if(c2.measureText(tx).width <= max) return [tx];
    var out = [], cur = '', mots = tx.indexOf(' ') >= 0 ? tx.split(' ') : tx.split('');
    var sep = tx.indexOf(' ') >= 0 ? ' ' : '';
    for(var i = 0; i < mots.length; i++){
      var essai = cur ? cur + sep + mots[i] : mots[i];
      if(c2.measureText(essai).width <= max || !cur){ cur = essai; continue; }
      out.push(cur); cur = mots[i];
      if(out.length === 1 && i < mots.length){
        var reste = mots.slice(i).join(sep);
        if(c2.measureText(reste).width > max){
          while(reste.length > 2 && c2.measureText(reste + '…').width > max) reste = reste.slice(0, -1);
          reste += '…';
        }
        out.push(reste); return out;
      }
    }
    out.push(cur);
    return out;
  }
  function unit(it, t){
    var col = it.ok ? GRN : (it === drag ? IV : 'rgba(124,135,145,.72)');
    c2.fillStyle = it.ok ? 'rgba(92,225,166,.09)' : 'rgba(228,232,234,.03)';
    c2.fillRect(it.x, it.y, it.w, it.h);
    c2.strokeStyle = col; c2.lineWidth = it === drag ? 1.6 : 1.1;
    c2.strokeRect(it.x, it.y, it.w, it.h);
    c2.fillStyle = col; c2.fillRect(it.x, it.y, 2.5, it.h);
    var n = it.def.n, mid = it.y + it.h * .5;
    if(n === 'PATCH-A'){
      for(var k = 0; k < 12; k++){
        c2.fillStyle = 'rgba(124,135,145,.5)';
        c2.fillRect(it.x + 46 + k * 6.4, mid - 2.5, 3.4, 5);
      }
    }else if(n === 'UPS-A'){
      c2.fillStyle = it.ok ? 'rgba(92,225,166,.5)' : 'rgba(124,135,145,.4)';
      c2.fillRect(it.x + it.w - 32, it.y + 5, 24, it.h - 10);
      c2.fillStyle = it.ok ? GRN : DM;
      for(var z = 0; z < 3; z++) c2.fillRect(it.x + it.w - 28 + z * 6, mid - 1.5, 3, 3);
    }else if(n === 'SAN-01'){
      for(var d2 = 0; d2 < 8; d2++){
        c2.fillStyle = 'rgba(124,135,145,' + (.25 + (d2 % 2) * .15) + ')';
        c2.fillRect(it.x + 46 + d2 * 9, it.y + 4, 6, it.h - 8);
      }
    }else{
      for(var d = 0; d < 4; d++){
        var on = it.ok ? 1 : (Math.floor(t * 3 + d) % 2);
        c2.fillStyle = it.ok ? 'rgba(92,225,166,' + (.4 + on * .5) + ')' : 'rgba(124,135,145,' + (.22 + on * .28) + ')';
        c2.fillRect(it.x + it.w - 12 - d * 7, mid - 2, 4, 4);
      }
    }
    c2.font = '600 8.5px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = it.ok ? GRN : IV;
    c2.fillText(n, it.x + 7, mid);
    c2.font = '7px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = 'rgba(124,135,145,.75)';
    var tag = it.def.h + 'U · ' + it.def.w + 'kg' + (it.def.p ? ' · ' + it.def.p + 'W' : '');
    c2.fillText(tag, it.x + 7, mid + 10);
  }
  function hitTest(x, y){
    for(var i = items.length - 1; i >= 0; i--){
      var it = items[i];
      if(x >= it.x && x <= it.x + it.w && y >= it.y && y <= it.y + it.h) return it;
    }
    return null;
  }
  cv.addEventListener('pointerdown', function(e){
    if(done) return;
    var r = cv.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    var it = hitTest(x, y);
    if(!it) return;
    /* clic droit ou double clic sur un appareil posé : on le retire */
    if(it.ok){
      it.ok = false; placed--; park(it);
      if(mvEl) mvEl.textContent = placed + ' / ' + LIB.length;
      msg = TR('retiré :') + ' ' + it.def.n;
      return;
    }
    drag = it;
    it.w = G.rw - 2; it.h = G.u * it.def.h - 2;
    /* la réserve est bien plus large que la baie : la prise doit être ramenée
       dans la nouvelle taille, sinon l'appareil saisi par sa droite s'affiche
       entièrement à côté du doigt et n'atteint plus jamais les montants */
    it.ox = clamp(x - it.x, 6, Math.max(6, it.w - 6));
    it.oy = clamp(y - it.y, 3, Math.max(3, it.h - 3));
    hint = LIB.indexOf(it.def); hintT = 1.1;
    if(cv.setPointerCapture) try{ cv.setPointerCapture(e.pointerId); }catch(err){}
  });
  cv.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    if(!drag){
      /* le curseur dit ce qui est saisissable */
      var h = hitTest(e.clientX - r.left, e.clientY - r.top);
      cv.style.cursor = h ? (h.ok ? 'pointer' : 'grab') : 'default';
      return;
    }
    cv.style.cursor = 'grabbing';
    drag.x = e.clientX - r.left - drag.ox;
    drag.y = e.clientY - r.top - drag.oy;
  });
  cv.addEventListener('pointerleave', function(){ if(!drag) cv.style.cursor = 'default'; });
  /* un geste système, un appel, un défilement : le pointeur est annulé sans
     « up ». L'appareil restait collé et suivait le contact suivant. */
  cv.addEventListener('pointercancel', function(){
    if(!drag) return;
    var it = drag; drag = null; park(it); cv.style.cursor = 'default';
  });
  cv.addEventListener('pointerup', function(){
    cv.style.cursor = 'default';
    if(!drag) return;
    var it = drag; drag = null;
    var su = slotAt(it.y + it.h * .5);
    var inRack = it.x + it.w * .5 > G.rx - 50;
    if(!inRack){ park(it); return; }
    if(!freeAt(su, it.def.h, it)){
      msg = TR('emplacement déjà occupé'); shake = 1; park(it); return;
    }
    if(su !== it.def.u){
      msg = TR('pas là :') + ' ' + TR(it.def.why); shake = .6; park(it); return;
    }
    it.ok = true; seat(it);
    aIdle = 0;
    /* les points ne sont dus qu a la premiere pose : reprendre une unite posée
       puis la reposer permettait de gonfler le score autant qu on voulait */
    placed++; flash = 1; if(!it.paid){ it.paid = 1; score += 100; } msg = TR(it.def.why);
    if(mvEl) mvEl.textContent = placed + ' / ' + LIB.length;
    var T2 = tally();
    if(T2.p > pwrCap){ msg = TR('attention : # W pour # W disponibles').replace('#', T2.p).replace('#', pwrCap); score -= 30; }
    else if(T2.c > coolCap){ msg = TR('attention : la ventilation sature'); score -= 30; }
    if(placed === LIB.length){
      done = true;
      clearInterval(aCoach); aCoach = null;
      if(ADA.ready){
        ADA.release(cv);
        ADA.say('Baie montée. C\'est exactement ce que Leonhard documente ensuite, tiroir par tiroir.', 5600);
      }
      var bonus = Math.round(T2.stab * 200) + (T2.p <= pwrCap ? 100 : 0) + (T2.c <= coolCap ? 100 : 0);
      score += bonus;
      if(stEl){ vif(stEl, function(){ return TR('inspection passée · # pts').replace('#', score); }); stEl.style.color = GRN; }
      setTimeout(function(){
        level++;
        U = Math.min(20, 14 + level);
        pwrCap = 3200 + level * 200;
        reset();
      }, 2600);
    }
  });
  if(newBtn) newBtn.addEventListener('click', function(){ reset(); draw(0); });
  reset(); draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  if(RM){
    /* mouvement réduit : aucune boucle ne tourne, la toile ne se repeignait
       donc jamais pendant le glissé et le jeu paraissait mort. On repeint sur
       le geste — cela ne rajoute aucune animation. */
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'].forEach(function(ev){
      cv.addEventListener(ev, function(){ draw(0); });
    });
    return;
  }
  var api = { vis: true };
  api.frame = function(dt, t){ if(!api.vis) return; draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { rootMargin: '60px' }).observe(cv);
  }
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 04 — SONDE AD·2026 : vol 3D dans le corridor de données */
  var cv = qs('[data-g4]'); if(!cv) return;
  var scoreEl = qs('[data-g4-score]'), hullEl = qs('[data-g4-hull]'), waveEl = qs('[data-g4-wave]');
  var startBtn = qs('[data-g4-start]'), hint = qs('[data-g4-hint]'), spdEl = qs('[data-g4-speed]');
  var T = window.THREE;
  if(!T){ cv.style.display = 'none'; if(startBtn) startBtn.style.display = 'none'; return; }

  var LOW = BOOT_TIER >= 2;
  var CY = 0x048B9A, RD = 0xFF5C4D, AM = 0xF5A524, IV = 0xE4E8EA, VI = 0x4169E1;
  var R = 3.5;                       /* rayon du corridor */
  var built = false, run = false, over = false, paused = false, api = null;
  var rnd, scene, cam, ship, hull3, tunnel = [], stars, dust;
  var foes = [], loot = [], shots = [], deb = [], rings = [];
  var keys = {}, aim = null, aimY = null, firing = false, touch = null;
  var score = 0, hull = 100, wave = 1, waveT = 0, speed = 26, combo = 0, comboT = 0, best = 0;
  var P = { x: 0, y: 0, vx: 0, vy: 0, roll: 0, pitch: 0, cool: 0, hit: 0, boost: 0 };
  var shake = 0, camZ = 0, tPrev = 0;
  var mapEl = qs('[data-g4-map]');
  /* --- LES SECTEURS : chaque vague change de décor et de rythme.
         Même moteur, mêmes réserves d'objets : seules les couleurs, la
         rotation des anneaux et la densité changent. --- */
  var MAPS = [
    { nom: 'corridor de données', col: 0x048B9A, bg: 0x05070a, ring: 0x1b4453, etoile: 0x7fa8bd, spin: .12, foe: 1,    loot: 1.1, anneau: 1,    forme: 'libre' },
    { nom: 'baie froide',         col: 0x4169E1, bg: 0x04060d, ring: 0x1e2c58, etoile: 0x8fa2d8, spin: .3,  foe: 1.15, loot: .95, anneau: .82, forme: 'slalom' },
    { nom: 'zone de bruit',       col: 0xF5A524, bg: 0x0a0806, ring: 0x4a3a16, etoile: 0xc9a86a, spin: .52, foe: 1.9,  loot: .8,  anneau: 1.14, forme: 'nuee' },
    { nom: 'cœur du modèle',      col: 0x50C878, bg: 0x040a07, ring: 0x1c4a32, etoile: 0x86c9a4, spin: .2,  foe: .9,   loot: 1.3, anneau: .95, forme: 'ligne' },
    /* Deux secteurs de plus, demandés le 26 août : « ajoute des cartes au jeu
       corridor de données, comme ça au moins on a un jeu qui est bien ». Le
       principe des quatre premiers tient toujours — ce qui change un secteur,
       c'est la FAÇON DONT LES ADVERSAIRES ARRIVENT, pas la couleur du décor.
       Ces deux-là amènent donc chacun leur propre tracé, et les vagues 5 et 6
       cessent de répéter les vagues 1 et 2. */
    { nom: 'grappe de sauvegarde', col: 0x9B6DFF, bg: 0x07050e, ring: 0x35245e, etoile: 0xb69ce0, spin: .38, foe: 1.1,  loot: 1,   anneau: .9,   forme: 'spirale' },
    { nom: 'tunnel de chiffrement', col: 0xE0559B, bg: 0x0c040a, ring: 0x5a1f3d, etoile: 0xd79bbd, spin: .62, foe: .7,   loot: .9,  anneau: 1.05, forme: 'tenaille' }
    /* ⚠ « tenaille » pose DEUX adversaires par appel : sa densité compte donc
       double. Mesuré à foe 1.5, elle vidait la coque en six secondes là où le
       premier secteur en laisse 20 % au bout de douze. À .7 elle revient au
       niveau de « zone de bruit », qui en pose un seul à 1.9. Même règle pour
       « ligne », qui en pose quatre et tourne à .9. */
  ];
  var mapI = 0, slalom = 1, spir = 0;
  /* les mots courts du bandeau : écrits par le script, donc tenus à la main */
  var LEX = {
    vague: { fr:'vague', en:'wave', de:'Welle', it:'ondata', zh:'波次', ar:'موجة', ja:'ウェーブ', 'de-CH':'Welle' },
    coque: { fr:'coque', en:'hull', de:'Hülle', it:'scafo', zh:'船体', ar:'الهيكل', ja:'船体', 'de-CH':'Hülle' }
  };
  function mot(k){
    var l = 'fr';
    try{ if(window.I18N && window.I18N.get) l = window.I18N.get() || 'fr'; }catch(e){}
    return LEX[k][l] || LEX[k].fr;
  }
  function MAP(){ return MAPS[mapI]; }
  function setMap(i){
    mapI = ((i % MAPS.length) + MAPS.length) % MAPS.length;
    var m = MAPS[mapI];
    vif(mapEl, function(){ return TR(m.nom); });
    if(!built) return;
    scene.background.setHex(m.bg);
    scene.fog.color.setHex(m.bg);
    M.ring.color.setHex(m.ring);
    M.ringHi.color.setHex(m.col);
    M.rail.color.setHex(m.ring);
    M.gate.color.setHex(m.col);
    if(dust) dust.material.color.setHex(m.col);
    if(stars) stars.material.color.setHex(m.etoile);
  }
  /* --- TROIS SONDES : le pilotage change pour de bon --- */
  var SHIPS = [
    { id: 'sonde',   nom: 'Sonde',   acc: 1,    max: 1,    cool: .14,  hull: 100, tirs: 1, coul: 0x048B9A,
      large: 1,   longs: 1,    aile: 1,   pods: 1, note: 'équilibrée · un tir, coque standard' },
    { id: 'lame',    nom: 'Lame',    acc: 1.36, max: 1.3,  cool: .092, hull: 74,  tirs: 1, coul: 0x5FD3E3,
      large: .82, longs: 1.24, aile: .72, pods: 1, note: 'vive et fragile · tir rapide' },
    { id: 'bastion', nom: 'Bastion', acc: .76,  max: .82,  cool: .21,  hull: 152, tirs: 2, coul: 0x4169E1,
      large: 1.2, longs: .9,   aile: 1.3, pods: 2, note: 'lourde · double tir, coque épaisse' }
  ];
  var shipI = 0;
  try{ var sv0 = parseInt(localStorage.getItem('ad2026.sonde.vaisseau'), 10);
       if(sv0 >= 0 && sv0 < SHIPS.length) shipI = sv0; }catch(e){}
  function SHIP(){ return SHIPS[shipI]; }
  try{ best = parseInt(localStorage.getItem('ad2026.sonde.best'), 10) || 0; }catch(e){}

  /* ---------- matériaux et géométries, créés une seule fois ---------- */
  var M = {}, G = {};
  function makeAssets(){
    M.body   = new T.MeshStandardMaterial({ color: 0x1b232b, metalness: .85, roughness: .32 });
    M.panel  = new T.MeshStandardMaterial({ color: 0x2c3742, metalness: .8, roughness: .42 });
    M.trim   = new T.MeshStandardMaterial({ color: CY, emissive: CY, emissiveIntensity: 1.5, roughness: .3, metalness: .4 });
    M.glass  = new T.MeshStandardMaterial({ color: 0x0c2836, metalness: .2, roughness: .06,
                 transparent: true, opacity: .8, emissive: 0x0a3648, emissiveIntensity: .6 });
    M.flame  = new T.MeshBasicMaterial({ color: 0x5FD3E3, transparent: true, opacity: .9, blending: T.AdditiveBlending, depthWrite: false });
    M.ring   = new T.MeshBasicMaterial({ color: 0x1b4453, transparent: true, opacity: .55 });
    M.ringHi = new T.MeshBasicMaterial({ color: CY, transparent: true, opacity: .5 });
    M.rail   = new T.MeshBasicMaterial({ color: 0x123a49 });
    M.foe    = new T.MeshStandardMaterial({ color: 0x3a1418, metalness: .7, roughness: .35,
                 emissive: RD, emissiveIntensity: .55 });
    M.foeHi  = new T.MeshBasicMaterial({ color: RD, wireframe: true, transparent: true, opacity: .75 });
    M.loot   = new T.MeshStandardMaterial({ color: 0x0d3644, metalness: .3, roughness: .2,
                 emissive: CY, emissiveIntensity: 1.1 });
    M.lootHi = new T.MeshBasicMaterial({ color: 0x5FD3E3, wireframe: true, transparent: true, opacity: .8 });
    M.shot   = new T.MeshBasicMaterial({ color: 0xD6F7FF, transparent: true, blending: T.AdditiveBlending, depthWrite: false });
    M.debC   = new T.MeshBasicMaterial({ color: CY, transparent: true, blending: T.AdditiveBlending, depthWrite: false });
    M.debR   = new T.MeshBasicMaterial({ color: RD, transparent: true, blending: T.AdditiveBlending, depthWrite: false });
    M.gate   = new T.MeshBasicMaterial({ color: VI, transparent: true, opacity: .5, side: T.DoubleSide });

    G.hullMain = new T.CylinderGeometry(.10, .34, 1.55, 12);
    G.nose     = new T.ConeGeometry(.10, .55, 12);
    G.wing     = new T.BoxGeometry(1.55, .055, .40);
    G.wingTip  = new T.BoxGeometry(.14, .16, .30);
    G.fin      = new T.BoxGeometry(.05, .34, .30);
    G.canopy   = new T.SphereGeometry(.17, 12, 8, 0, 6.2832, 0, 1.25);
    G.pod      = new T.CylinderGeometry(.115, .135, .52, 10);
    G.flame    = new T.ConeGeometry(.10, .62, 8, 1, true);
    G.strip    = new T.BoxGeometry(.62, .022, .05);
    G.ring     = new T.TorusGeometry(R, .055, 4, 10);
    G.rail     = new T.BoxGeometry(.07, .07, 240);
    G.foe      = new T.OctahedronGeometry(.46, 0);
    G.loot     = new T.BoxGeometry(.42, .42, .42);
    G.shot     = new T.BoxGeometry(.055, .055, 1.5);
    G.deb      = new T.BoxGeometry(.075, .075, .075);
    G.gate     = new T.TorusGeometry(R * .92, .14, 4, 12);
  }

  function makeShip(k){
    var g = new T.Group();
    var lg = k.large, ln = k.longs, al = k.aile;
    /* la teinte de la sonde : une matière par vaisseau, libérée au changement */
    var tm = new T.MeshStandardMaterial({ color: k.coul, emissive: k.coul,
      emissiveIntensity: 1.5, roughness: .3, metalness: .4 });
    g.userData.tm = tm;
    g.userData.flames = [];
    var b = new T.Mesh(G.hullMain, M.body); b.rotation.x = Math.PI / 2; b.scale.set(lg, ln, lg); g.add(b);
    var n = new T.Mesh(G.nose, M.panel); n.rotation.x = -Math.PI / 2;
    n.scale.set(lg, ln, lg); n.position.z = -1.03 * ln; g.add(n);
    var w = new T.Mesh(G.wing, M.panel); w.scale.set(al, 1, al); w.position.set(0, -.02, .12); g.add(w);
    var w2 = new T.Mesh(G.wing, M.panel); w2.scale.set(.62 * al, 1, .7 * al); w2.position.set(0, .07, -.42 * ln); g.add(w2);
    [-1, 1].forEach(function(sx){
      var tp = new T.Mesh(G.wingTip, tm); tp.position.set(sx * .79 * al, 0, .12); g.add(tp);
      var fn = new T.Mesh(G.fin, M.panel); fn.position.set(sx * .34 * lg, .14, .55 * ln);
      fn.rotation.z = sx * (k.pods > 1 ? .18 : .32); fn.scale.set(1, ln, 1); g.add(fn);
      for(var q = 0; q < k.pods; q++){
        var px = sx * (.40 * lg + q * .27 * al);
        var pd = new T.Mesh(G.pod, M.body); pd.rotation.x = Math.PI / 2; pd.position.set(px, -.05, .58 * ln); g.add(pd);
        var fl = new T.Mesh(G.flame, M.flame); fl.rotation.x = -Math.PI / 2; fl.position.set(px, -.05, 1.05 * ln);
        g.add(fl); g.userData.flames.push(fl);
      }
      var st = new T.Mesh(G.strip, tm); st.scale.set(.5 * al, 1, 1); st.position.set(sx * .45 * al, .03, .05); g.add(st);
    });
    var cp = new T.Mesh(G.canopy, M.glass); cp.scale.set(lg, lg, ln);
    cp.position.set(0, .13, -.30 * ln); cp.rotation.x = -.3; g.add(cp);
    var kl = new T.Mesh(G.strip, tm); kl.position.set(0, -.14, .1); g.add(kl);
    return g;
  }
  function setShip(i){
    if(i < 0 || i >= SHIPS.length) return;
    shipI = i;
    try{ localStorage.setItem('ad2026.sonde.vaisseau', String(shipI)); }catch(e){}
    if(built && ship){
      scene.remove(ship);
      if(ship.userData.tm) ship.userData.tm.dispose();
      ship = makeShip(SHIP());
      scene.add(ship);
    }
    paintShips();
    if(hint && !run) setTR(hint, SHIP().nom + ' — ' + SHIP().note);
  }
  var shipBtns = qsa('[data-g4-ship]');
  function paintShips(){
    for(var i = 0; i < shipBtns.length; i++){
      var on = i === shipI;
      shipBtns[i].style.borderColor = on ? '#048B9A' : 'rgba(228,232,234,.16)';
      shipBtns[i].style.color = on ? '#5FD3E3' : '#7C8791';
      shipBtns[i].style.background = on ? 'rgba(4,139,154,.14)' : 'none';
      shipBtns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }
  shipBtns.forEach(function(b, i){
    b.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); setShip(i); });
  });
  paintShips();

  function build(){
    if(built) return true;
    /* la scène se monte après le démarrage : le palier est enfin connu */
    LOW = (typeof BOOT_TIER === 'number' ? BOOT_TIER : 0) >= 2;
    try{
      rnd = keepGL(new T.WebGLRenderer({ canvas: cv, antialias: !LOW, alpha: false, powerPreference: LOW ? 'low-power' : 'high-performance' }));
    }catch(e){ return false; }
    if(!rnd.getContext()) return false;
    /* la densité commune borne la surface sur tablette, ce que le calcul local
       ne faisait pas : d'où l'effondrement de la cadence sur iPad */
    rnd.setPixelRatio(CDPR());
    rnd.toneMapping = T.ACESFilmicToneMapping;
    rnd.toneMappingExposure = 1.15;
    if('outputEncoding' in rnd && T.sRGBEncoding !== undefined) rnd.outputEncoding = T.sRGBEncoding;
    makeAssets();
    scene = new T.Scene();
    scene.background = new T.Color(0x05070a);
    scene.fog = new T.Fog(0x05070a, 26, 96);
    cam = new T.PerspectiveCamera(66, 16 / 9, .1, 200);

    scene.add(new T.AmbientLight(0x2a3742, 1.1));
    var key = new T.DirectionalLight(0xdfe9ff, 1.5); key.position.set(3, 5, -4); scene.add(key);
    var rim = new T.PointLight(CY, 22, 26); rim.position.set(0, 0, 6); scene.add(rim);
    var fwd = new T.PointLight(0x4169E1, 16, 40); fwd.position.set(0, 0, -22); scene.add(fwd);

    ship = makeShip(SHIP()); scene.add(ship);

    /* corridor : anneaux recyclés + quatre rails filants */
    var NR = LOW ? 12 : 20;
    for(var i = 0; i < NR; i++){
      var rg = new T.Mesh(G.ring, i % 4 === 0 ? M.ringHi : M.ring);
      rg.position.z = -i * 9;
      rg.rotation.z = i * .14;
      scene.add(rg); rings.push(rg);
    }
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function(c){
      var rl = new T.Mesh(G.rail, M.rail);
      rl.position.set(c[0] * R * .72, c[1] * R * .72, -95);
      scene.add(rl);
    });
    /* étoiles et poussière de vitesse */
    if(!LOW){
      var sg = new T.BufferGeometry(), n = 700, pos = new Float32Array(n * 3);
      for(var k = 0; k < n; k++){
        var a = Math.random() * 6.2832, rr = R * 1.25 + Math.random() * 26;
        pos[k*3] = Math.cos(a) * rr; pos[k*3+1] = Math.sin(a) * rr; pos[k*3+2] = -Math.random() * 190;
      }
      sg.setAttribute('position', new T.BufferAttribute(pos, 3));
      stars = new T.Points(sg, new T.PointsMaterial({ color: 0x7fa8bd, size: .12, sizeAttenuation: true,
        transparent: true, opacity: .75, depthWrite: false }));
      scene.add(stars);
      var dg = new T.BufferGeometry(), dn = 260, dp = new Float32Array(dn * 3);
      for(var d = 0; d < dn; d++){
        var da = Math.random() * 6.2832, dr = Math.random() * R * .95;
        dp[d*3] = Math.cos(da) * dr; dp[d*3+1] = Math.sin(da) * dr; dp[d*3+2] = -Math.random() * 120;
      }
      dg.setAttribute('position', new T.BufferAttribute(dp, 3));
      dust = new T.Points(dg, new T.PointsMaterial({ color: 0x5FD3E3, size: .07, sizeAttenuation: true,
        transparent: true, opacity: .5, blending: T.AdditiveBlending, depthWrite: false }));
      scene.add(dust);
    }
    /* réserves : ennemis, données, tirs, débris */
    for(var f = 0; f < (LOW ? 10 : 18); f++){
      var fo = new T.Mesh(G.foe, M.foe); fo.visible = false;
      var hi = new T.Mesh(G.foe, M.foeHi); hi.scale.setScalar(1.14); fo.add(hi);
      scene.add(fo); foes.push({ m: fo, live: 0, z: 0, x: 0, y: 0, sp: 0, ph: 0, hp: 1 });
    }
    for(var l = 0; l < (LOW ? 8 : 14); l++){
      var lo = new T.Mesh(G.loot, M.loot); lo.visible = false;
      var lh = new T.Mesh(G.loot, M.lootHi); lh.scale.setScalar(1.2); lo.add(lh);
      scene.add(lo); loot.push({ m: lo, live: 0, ph: 0 });
    }
    for(var b = 0; b < 26; b++){
      var sh = new T.Mesh(G.shot, M.shot); sh.visible = false;
      scene.add(sh); shots.push({ m: sh, live: 0 });
    }
    for(var d2 = 0; d2 < (LOW ? 28 : 70); d2++){
      var de = new T.Mesh(G.deb, M.debC); de.visible = false;
      scene.add(de); deb.push({ m: de, live: 0, vx: 0, vy: 0, vz: 0, life: 0 });
    }
    /* portique de vague */
    var gate = new T.Mesh(G.gate, M.gate); gate.visible = false; scene.add(gate);
    api = api || {};
    api.gate = { m: gate, z: -260 };
    built = true;
    setMap(mapI);
    resize();
    return true;
  }

  function resize(){
    if(!built) return;
    var r = cv.getBoundingClientRect();
    if(r.width < 2 || r.height < 2) return;
    rnd.setPixelRatio(CDPR());
    rnd.setSize(r.width, r.height, false);
    cam.aspect = r.width / r.height; cam.updateProjectionMatrix();
  }

  function reset(){
    run = true; over = false; paused = false;
    score = 0; hull = 100; wave = 1; waveT = 0; speed = 26; combo = 0; comboT = 0;
    setMap(0);
    P.x = 0; P.y = 0; P.vx = 0; P.vy = 0; P.cool = 0; P.hit = 0; P.boost = 0;
    /* le roulis, la visée et les touches survivaient à la partie précédente :
       la sonde repartait inclinée et filait vers le dernier point pointé */
    P.roll = 0; P.pitch = 0;
    aim = null; aimY = null; firing = false; touch = null;
    keys.left = keys.right = keys.up = keys.down = keys.fire = 0;
    shake = 0; camZ = 0;
    foes.forEach(function(f){ f.live = 0; f.m.visible = false; });
    loot.forEach(function(l){ l.live = 0; l.m.visible = false; });
    shots.forEach(function(s2){ s2.live = 0; s2.m.visible = false; });
    deb.forEach(function(d){ d.live = 0; d.m.visible = false; });
    api.gate.z = -240; api.gate.m.visible = false;
    hud();
    setTR(marque(startBtn), 'EN VOL');
    /* au doigt, ni flèches, ni souris, ni barre d'espace : la consigne dit le
       geste qui marche sur l'appareil qu'on tient */
    if(hint) vif(hint, function(){ return TR(TOUCH ? 'gardez le doigt posé : la sonde suit et tire · évitez les rouges'
                                         : 'flèches ou souris · espace pour tirer · évitez les rouges'); });
  }
  function hud(){
    /* le gain est plafonné à six : afficher davantage promettait des points
       que le score ne donnait pas */
    if(scoreEl) scoreEl.textContent = score + (combo > 1 ? ' ×' + Math.min(6, combo) : '');
    if(hullEl){
      vif(hullEl, function(){ return mot('coque') + ' ' + Math.max(0, Math.round(hull)) + ' %'; });
      hullEl.style.color = hull > 55 ? '#048B9A' : hull > 28 ? '#F5A524' : '#FF5C4D';
    }
    if(waveEl) vif(waveEl, function(){ return mot('vague') + ' ' + wave; });
    if(spdEl) spdEl.textContent = Math.round(speed * 12) + ' u/s';
  }
  /* la langue change : le bandeau et le nom de secteur se réécrivent */
  try{ window.CalibreEngine.onLangAdd(function(){ setTimeout(function(){ hud(); setMap(mapI); }, 80); }); }catch(e){}
  function burst(x, y, z, red, n){
    if(n > 5) SFX.boum();
    var made = 0;
    for(var i = 0; i < deb.length && made < n; i++){
      var d = deb[i];
      if(d.live) continue;
      d.live = 1; d.life = .55 + Math.random() * .35;
      d.m.material = red ? M.debR : M.debC;
      d.m.position.set(x, y, z);
      d.m.visible = true;
      d.m.scale.setScalar(.6 + Math.random() * 1.5);
      d.vx = (Math.random() - .5) * 12; d.vy = (Math.random() - .5) * 12; d.vz = (Math.random() - .5) * 10;
      made++;
    }
  }
  function fire(){
    if(P.cool > 0) return;
    var K = SHIP();
    P.cool = K.cool;
    SFX.tir();
    var placed = 0;
    for(var i = 0; i < shots.length && placed < K.tirs; i++){
      var s2 = shots[i];
      if(s2.live) continue;
      s2.live = 1;
      s2.m.visible = true;
      s2.m.position.set(P.x + (K.tirs > 1 ? (placed ? .28 : -.28) : 0), P.y - .04, -1.4);
      placed++;
    }
  }
  function spawnFoe(){
    /* chaque secteur a sa façon d'arriver : c'est ça qui change le jeu, pas
       la couleur du décor. Slalom, nuée, ou ligne en formation. */
    var m = MAP(), forme = m.forme || 'libre';
    if(forme === 'ligne'){
      /* quatre de front : il faut trouver le trou */
      var trou = (Math.random() * 4) | 0, zc = -110 - Math.random() * 20, pose = 0;
      for(var q = 0; q < foes.length && pose < 4; q++){
        var g = foes[q];
        if(g.live) continue;
        if(pose === trou){ pose++; continue; }
        g.live = 1; g.z = zc;
        g.x = (pose - 1.5) * (R * .48); g.y = (Math.random() - .5) * R * .5;
        g.sp = 5 + wave * 1.2;
        g.ph = Math.random() * 6.28; g.hp = 1;
        g.m.scale.setScalar(1); g.m.visible = true;
        pose++;
      }
      return;
    }
    if(forme === 'tenaille'){
      /* deux à la fois, face à face sur le même anneau : il faut passer entre
         les deux ou plonger au centre. Le tir n'en règle qu'un — l'autre
         arrive pendant le refroidissement. */
      var ang = Math.random() * 6.2832, zt = -108 - Math.random() * 22, mis = 0;
      for(var w = 0; w < foes.length && mis < 2; w++){
        var h = foes[w];
        if(h.live) continue;
        var aa = ang + mis * Math.PI, rt = R * .66;
        h.live = 1; h.z = zt;
        h.x = Math.cos(aa) * rt; h.y = Math.sin(aa) * rt;
        h.sp = 6 + wave * 1.5;
        h.ph = Math.random() * 6.28; h.hp = 1;
        h.m.scale.setScalar(1.1); h.m.visible = true;
        mis++;
      }
      return;
    }
    for(var i = 0; i < foes.length; i++){
      var f = foes[i];
      if(f.live) continue;
      var a, rr;
      if(forme === 'spirale'){
        /* ils s'enroulent le long de la paroi : chaque arrivée avance d'un cran
           sur l'hélice, et le rayon respire. On suit la vis, ou on la coupe. */
        spir += 1.05;
        a = spir; rr = R * (.58 + .24 * Math.sin(spir * .37));
      }else if(forme === 'slalom'){
        /* un couloir étroit : ils longent les parois, en alternance */
        slalom = -slalom || 1;
        a = slalom > 0 ? 0 : Math.PI;
        rr = R * (.62 + Math.random() * .22);
      }else if(forme === 'nuee'){
        a = Math.random() * 6.2832; rr = Math.random() * R * .92;
      }else{
        a = Math.random() * 6.2832; rr = Math.random() * R * .82;
      }
      f.live = 1; f.z = -105 - Math.random() * 30;
      f.x = Math.cos(a) * rr; f.y = Math.sin(a) * rr;
      f.sp = (forme === 'nuee' ? 3 : 6) + wave * 1.6 + Math.random() * 6;
      f.ph = Math.random() * 6.28;
      f.hp = wave > 3 && forme !== 'nuee' && Math.random() < .3 ? 2 : 1;
      f.m.scale.setScalar(forme === 'nuee' ? .72 : (f.hp > 1 ? 1.3 : 1));
      f.m.visible = true;
      return;
    }
  }
  function spawnLoot(){
    for(var i = 0; i < loot.length; i++){
      var l = loot[i];
      if(l.live) continue;
      var a = Math.random() * 6.2832, rr = Math.random() * R * .78;
      l.live = 1; l.ph = Math.random() * 6.28;
      l.m.position.set(Math.cos(a) * rr, Math.sin(a) * rr, -100 - Math.random() * 40);
      l.m.visible = true;
      return;
    }
  }
  function damage(v){
    SFX.choc();
    hull -= v * (100 / SHIP().hull); P.hit = 1; shake = Math.min(1, shake + v / 26);
    combo = 0; comboT = 0;
    hud();
    if(hull <= 0) end();
  }
  function end(){
    run = false; over = true;
    if(score > best){ best = score; try{ localStorage.setItem('ad2026.sonde.best', String(best)); }catch(e){} }
    setTR(marque(startBtn), 'REJOUER');
    if(hint) vif(hint, function(){ return TR('sonde perdue à la vague # — # points · record #')
      .replace('#', wave).replace('#', score).replace('#', best); });
    if(wave >= 4) TROPHY.win('g4');
  }

  function step(dt){
    var f = Math.min(3, dt * 60);
    var K = SHIP();
    /* pilotage : clavier ou pointeur, toujours amorti */
    var ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    var ay = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
    if(aim !== null && !ax && !ay){
      P.vx = damp(P.vx, (aim * R * .92 - P.x) * 8 * K.max, 10, dt);
      P.vy = damp(P.vy, (aimY * R * .82 - P.y) * 8 * K.max, 10, dt);
    }else{
      P.vx = damp(P.vx, ax * 15 * K.acc, 9, dt);
      P.vy = damp(P.vy, ay * 12 * K.acc, 9, dt);
    }
    P.x = clamp(P.x + P.vx * dt, -R * .92, R * .92);
    P.y = clamp(P.y + P.vy * dt, -R * .84, R * .84);
    P.roll = damp(P.roll, clamp(-P.vx * .055, -.7, .7), 8, dt);
    P.pitch = damp(P.pitch, clamp(-P.vy * .04, -.35, .35), 8, dt);
    P.cool = Math.max(0, P.cool - dt);
    P.hit = Math.max(0, P.hit - dt * 2.4);
    P.boost = damp(P.boost, (keys.fire || firing) ? 1 : .3, 6, dt);
    if(keys.fire || firing) fire();

    /* vagues : plus on avance, plus ça vient vite */
    waveT += dt;
    if(waveT > 16){
      waveT = 0; wave++;
      speed = Math.min(74, speed + 5);
      api.gate.z = -230;
      api.gate.m.visible = true;
      setMap(wave - 1);
      if(hint) vif(hint, function(){ return TR('vague ') + wave + ' — ' + TR(MAP().nom); });
      hud();
    }
    var adv = speed * dt;
    camZ += adv;

    /* corridor */
    for(var i = 0; i < rings.length; i++){
      var rg = rings[i];
      rg.position.z += adv;
      if(rg.position.z > 12) rg.position.z -= rings.length * 9;
      rg.rotation.z += dt * MAP().spin;
      /* le corridor se resserre ou s'ouvre selon le secteur */
      var an2 = MAP().anneau || 1;
      if(Math.abs(rg.scale.x - an2) > .004) rg.scale.setScalar(rg.scale.x + (an2 - rg.scale.x) * Math.min(1, dt * 3));
    }
    if(api.gate.m.visible){
      api.gate.z += adv;
      api.gate.m.position.z = api.gate.z;
      api.gate.m.rotation.z += dt * .8;
      var sc = 1 + Math.sin(t0g * 4) * .02;
      api.gate.m.scale.setScalar(sc);
      if(api.gate.z > 8){ api.gate.m.visible = false; }
    }
    if(stars){
      var sp = stars.geometry.attributes.position.array;
      for(var s3 = 2; s3 < sp.length; s3 += 3){
        sp[s3] += adv * .55;
        if(sp[s3] > 10) sp[s3] -= 190;
      }
      stars.geometry.attributes.position.needsUpdate = true;
    }
    if(dust){
      var dp = dust.geometry.attributes.position.array;
      for(var s4 = 2; s4 < dp.length; s4 += 3){
        dp[s4] += adv * 1.5;
        if(dp[s4] > 8) dp[s4] -= 120;
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }

    /* apparitions */
    if(Math.random() < dt * (1.5 + wave * .35) * MAP().foe) spawnFoe();
    if(Math.random() < dt * 1.1 * MAP().loot) spawnLoot();

    /* tirs */
    for(var b = 0; b < shots.length; b++){
      var s2 = shots[b];
      if(!s2.live) continue;
      /* le tir avance de plus de six unités par image quand la cadence tombe et
         la fenêtre de contact n'en faisait que trois : le canon cessait de
         toucher sur les machines lentes. On teste le segment parcouru. */
      var sz0 = s2.m.position.z;
      s2.m.position.z -= (96 + speed) * dt;
      if(s2.m.position.z < -140){ s2.live = 0; s2.m.visible = false; continue; }
      for(var q = 0; q < foes.length; q++){
        var fo = foes[q];
        if(!fo.live) continue;
        if(fo.z > sz0 + .8 || fo.z < s2.m.position.z - .8) continue;
        if(Math.hypot(fo.x - s2.m.position.x, fo.y - s2.m.position.y) > .85) continue;
        s2.live = 0; s2.m.visible = false;
        fo.hp--;
        if(fo.hp <= 0){
          burst(fo.x, fo.y, fo.z, true, LOW ? 5 : 11);
          fo.live = 0; fo.m.visible = false;
          combo++; comboT = 2.4;
          score += 12 * Math.min(6, combo);
        }else{
          burst(fo.x, fo.y, fo.z, true, 3);
        }
        hud();
        break;
      }
    }
    /* ennemis */
    for(var e = 0; e < foes.length; e++){
      var fo2 = foes[e];
      if(!fo2.live) continue;
      fo2.ph += dt * 2.2;
      /* la fenêtre de choc était plus étroite que le pas d'une image à pleine
         vitesse : passé la vague six, les intrus traversaient sans dégât */
      var fz0 = fo2.z;
      fo2.z += (speed + fo2.sp) * dt;
      /* ils dérivent vers le joueur */
      fo2.x += (P.x - fo2.x) * dt * .55 + Math.sin(fo2.ph) * dt * 1.6;
      fo2.y += (P.y - fo2.y) * dt * .4 + Math.cos(fo2.ph * .8) * dt * 1.2;
      fo2.m.position.set(fo2.x, fo2.y, fo2.z);
      fo2.m.rotation.x += dt * 1.8; fo2.m.rotation.y += dt * 2.4;
      if(fo2.z > -1.1 && fz0 < 1.6 && Math.hypot(fo2.x - P.x, fo2.y - P.y) < .95){
        burst(fo2.x, fo2.y, fo2.z, true, LOW ? 6 : 14);
        fo2.live = 0; fo2.m.visible = false;
        damage(17);
        if(!run) return;
        continue;
      }
      if(fo2.z > 10){ fo2.live = 0; fo2.m.visible = false; }
    }
    /* données à récupérer */
    for(var l2 = 0; l2 < loot.length; l2++){
      var lo = loot[l2];
      if(!lo.live) continue;
      lo.ph += dt * 3;
      lo.m.position.z += speed * dt;
      lo.m.rotation.x += dt * 1.3; lo.m.rotation.y += dt * 1.7;
      lo.m.scale.setScalar(1 + Math.sin(lo.ph) * .1);
      var d3 = Math.hypot(lo.m.position.x - P.x, lo.m.position.y - P.y);
      /* léger aimant : le vol reste agréable */
      if(d3 < 2.2 && lo.m.position.z > -12){
        lo.m.position.x += (P.x - lo.m.position.x) * dt * 3.4;
        lo.m.position.y += (P.y - lo.m.position.y) * dt * 3.4;
      }
      if(lo.m.position.z > -1 && lo.m.position.z < 2 && d3 < 1.1){
        burst(lo.m.position.x, lo.m.position.y, lo.m.position.z, false, LOW ? 4 : 9);
        lo.live = 0; lo.m.visible = false;
        combo++; comboT = 2.4;
        score += 25 * Math.min(6, combo);
        SFX.piece();
        hull = Math.min(100, hull + 2);
        hud();
        continue;
      }
      if(lo.m.position.z > 10){ lo.live = 0; lo.m.visible = false; }
    }
    /* débris */
    for(var d4 = 0; d4 < deb.length; d4++){
      var de = deb[d4];
      if(!de.live) continue;
      de.life -= dt;
      if(de.life <= 0){ de.live = 0; de.m.visible = false; continue; }
      de.m.position.x += de.vx * dt;
      de.m.position.y += de.vy * dt;
      de.m.position.z += (de.vz + speed) * dt;
      de.m.rotation.x += dt * 6; de.m.rotation.y += dt * 5;
      de.m.scale.setScalar(Math.max(.05, de.life * 1.6));
    }
    comboT -= dt;
    if(comboT <= 0 && combo){ combo = 0; hud(); }
    shake = Math.max(0, shake - dt * 1.6);
  }

  var t0g = 0;
  function draw(dt){
    t0g += dt;
    /* vaisseau */
    ship.position.set(P.x, P.y, 0);
    ship.rotation.z = P.roll;
    ship.rotation.x = P.pitch;
    var fl = .8 + P.boost * .9 + Math.random() * .25;
    var flames = ship.userData.flames || [];
    for(var fq = 0; fq < flames.length; fq++){
      flames[fq].scale.set(1, fl, 1);
      flames[fq].material.opacity = .55 + P.boost * .4;
    }
    var tmS = ship.userData.tm;
    if(tmS){
      tmS.emissiveIntensity = P.hit > .1 ? .4 + Math.random() * 1.6 : 1.4 + Math.sin(t0g * 3) * .3;
      tmS.color.setHex(P.hit > .1 ? RD : SHIP().coul);
      tmS.emissive.setHex(P.hit > .1 ? RD : SHIP().coul);
    }
    /* caméra : suit avec retard, tremble aux impacts */
    var tx = P.x * .55, ty = P.y * .5 + .95;
    cam.position.x = damp(cam.position.x, tx + (Math.random() - .5) * shake * .5, 7, dt);
    cam.position.y = damp(cam.position.y, ty + (Math.random() - .5) * shake * .5, 7, dt);
    cam.position.z = damp(cam.position.z, 5.4 - P.boost * .5, 5, dt);
    cam.lookAt(P.x * .8, P.y * .8 - .1, -14);
    cam.rotation.z = -P.roll * .28 + (Math.random() - .5) * shake * .05;
    scene.fog.near = 24 - speed * .12;
    rnd.render(scene, cam);
  }

  /* ---------- entrées ---------- */
  function keyMap(k){
    if(k === 'ArrowLeft' || k === 'a' || k === 'q' || k === 'A' || k === 'Q') return 'left';
    if(k === 'ArrowRight' || k === 'd' || k === 'D') return 'right';
    if(k === 'ArrowUp' || k === 'w' || k === 'z' || k === 'W' || k === 'Z') return 'up';
    if(k === 'ArrowDown' || k === 's' || k === 'S') return 'down';
    if(k === ' ' || k === 'Enter') return 'fire';
    return null;
  }
  addEventListener('keydown', function(e){
    if(!run) return;
    var m = keyMap(e.key);
    if(!m) return;
    var r = cv.getBoundingClientRect();
    if(r.bottom < 0 || r.top > innerHeight) return;
    keys[m] = 1; aim = null;
    e.preventDefault();
  });
  addEventListener('keyup', function(e){
    var m = keyMap(e.key);
    if(m) keys[m] = 0;
  });
  cv.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    aim = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    aimY = clamp(-((e.clientY - r.top) / r.height * 2 - 1), -1, 1);
    keys.left = keys.right = keys.up = keys.down = 0;
  }, {passive:true});
  cv.addEventListener('pointerleave', function(){ if(!touch) aim = null; });
  cv.addEventListener('pointerdown', function(e){
    e.preventDefault();
    /* le doigt qui lance la partie reste posé : sans reprendre la visée ici, la
       sonde ne répondait qu'au second appui */
    if(!run){ startBtn.click(); if(!run) return; }
    var r = cv.getBoundingClientRect();
    aim = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    aimY = clamp(-((e.clientY - r.top) / r.height * 2 - 1), -1, 1);
    firing = true; touch = 1;
  });
  addEventListener('pointerup', function(){ firing = false; touch = null; }, {passive:true});
  cv.addEventListener('wheel', function(e){ if(run) e.preventDefault(); }, {passive:false});

  startBtn.addEventListener('click', function(){
    if(!build()){
      cv.style.display = 'none'; startBtn.style.display = 'none';
      if(hint) vif(hint, function(){ return TR('la 3D n\'est pas disponible sur cet appareil'); });
      return;
    }
    /* « EN VOL » reste sous le doigt pendant la partie : une seconde tape
       repartait de zéro sans prévenir */
    if(run) return;
    resize();
    /* sortir le jeu de l'écran le met en pause et le bouton annonce
       REPRENDRE : il rendait pourtant une partie neuve, score et vague à zéro */
    if(paused && !over){
      paused = false; run = true;
      setTR(marque(startBtn), 'EN VOL');
      if(hint) vif(hint, function(){ return TR('vague ') + wave + ' — ' + TR(MAP().nom); });
    }else reset();
    if(relance) relance();
    cv.focus && cv.focus();
  });
  cv.setAttribute('tabindex', '0');
  if(window.ResizeObserver) new ResizeObserver(function(){ askResize(resize); }).observe(cv);

  api = api || {};
  api.vis = false;
  api.frame = function(dt, t){
    /* on construit dès que la scène entre en vue : sinon le cadre reste noir
       derrière la couverture, et on ne devine pas qu'il y a un jeu */
    if(!built && api.vis){
      if(!build()){ api.frame = function(){}; return; }
      resize();
      draw(.016);
      return;
    }
    if(!built) return;
    if(!api.vis){
      if(run){
        run = false; paused = true;
        /* les touches et le doigt restaient « enfoncés » pendant la pause */
        keys.left = keys.right = keys.up = keys.down = keys.fire = 0; firing = false; touch = null; aim = null;
        setTR(marque(startBtn), 'REPRENDRE');
      }
      return;
    }
    if(run) step(Math.min(.04, dt));
    draw(Math.min(.04, dt));
  };
  PIPES.push(api);
  var relance = boucleFigee(function(dt, t){ api.frame(dt, t); }, function(){ return run; });
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .2 }).observe(cv);
  }else api.vis = true;
  if(hint) vif(hint, function(){ return TR(TOUCH ? 'gardez le doigt posé : la sonde suit et tire · récupérez les données'
                                       : 'flèches ou souris · espace pour tirer · récupérez les données'); });
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 05 — LA SALLE SANS LUMIÈRE : silhouettes, saut, chute */
  var cv = qs('[data-g5]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var distEl = qs('[data-g5-dist]'), bestEl = qs('[data-g5-best]'), startBtn = qs('[data-g5-start]'), hint = qs('[data-g5-hint]');
  var DPR2 = CDPR(), W = 0, H = 0, GY = 0;
  var api = { vis: true };
  var run = false, dead = 0, dist = 0, best = 0, spd = 190, obs = [], gaps = [], motes = [], far = [], mid = [];
  var mult = 1, MULTS = [1, 1.5, 2, 3];
  var multBtn = qs('[data-g5-mult]');
  var P = { y: 0, vy: 0, jumps: 0, run: 0 };
  try{ best = parseFloat(localStorage.getItem('ad2026.salle.best')) || 0; }catch(e){}
  if(bestEl) vif(bestEl, function(){ return TR('record ') + Math.round(best) + ' m'; });

  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = W * DPR2; cv.height = H * DPR2;
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    GY = H * .78;
    if(!far.length){
      for(var i = 0; i < 22; i++) far.push({ x: Math.random() * 1.4, w: .04 + Math.random() * .07, h: .18 + Math.random() * .3 });
      for(var j = 0; j < 16; j++) mid.push({ x: Math.random() * 1.4, w: .05 + Math.random() * .09, h: .26 + Math.random() * .34 });
      for(var k = 0; k < 40; k++) motes.push({ x: Math.random(), y: Math.random(), z: .2 + Math.random() * .8 });
    }
  }
  function reset(){
    run = true; dead = 0; dist = 0; spd = 132; obs = []; gaps = [];
    P.y = 0; P.vy = 0; P.jumps = 0; P.coyote = 0;
    setTR(marque(startBtn), 'EN COURS');
    if(hint) vif(hint, function(){ return TR('espace, clic ou doigt pour sauter · deux fois pour un saut long'); });
    /* la salle restait vide une dizaine de secondes après le départ : on pose
       la première caisse à portée de vue, elle dit à elle seule quoi faire */
    obs.push({ x: Math.min(W * .95, 460) * mult, w: 16, h: 22, k: 0 });
  }
  /* sortir la section de l'écran met la partie en pause : le bouton annonce
     REPRENDRE, il doit donc rendre la partie où elle s'est arrêtée et non la
     recommencer à zéro */
  function go(){
    layout();
    if(relance) relance();
    if(!run && !dead && dist > 0){ run = true; setTR(marque(startBtn), 'EN COURS'); return; }
    reset();
  }
  function jump(){
    if(!run){ go(); return; }
    if(P.jumps >= 2 && P.coyote <= 0) return;
    SFX.saut();
    if(P.jumps === 0 || P.coyote > 0){ P.vy = -395; P.jumps = 1; P.coyote = 0; }
    else { P.vy = -330; P.jumps = 2; }
  }
  function die(){
    SFX.perd();
    run = false; dead = 1;
    if(dist > best){ best = dist; try{ localStorage.setItem('ad2026.salle.best', String(Math.round(best))); }catch(e){} }
    if(bestEl) vif(bestEl, function(){ return TR('record ') + Math.round(best) + ' m'; });
    setTR(marque(startBtn), 'REPARTIR');
    if(hint) vif(hint, function(){ return TR('# m — la salle est plus longue qu\'elle n\'en a l\'air').replace('#', Math.round(dist)); });
    if(dist >= 400) TROPHY.win('g5');
  }
  function step(dt){
    for(var m = 0; m < motes.length; m++){
      var mo = motes[m];
      mo.x -= dt * .02 * mo.z; mo.y += Math.sin((mo.x + mo.z) * 9) * dt * .01;
      if(mo.x < -.05) mo.x = 1.05;
    }
    if(!run) return;
    spd = (132 + Math.min(118, dist * .22)) * mult;
    dist += spd * dt * .06;
    if(distEl) distEl.textContent = Math.round(dist) + ' m';
    var dx = spd * dt;
    for(var i = far.length - 1; i >= 0; i--){ far[i].x -= dx / W * .18; if(far[i].x < -.2) far[i].x = 1.2; }
    for(var j = mid.length - 1; j >= 0; j--){ mid[j].x -= dx / W * .45; if(mid[j].x < -.2) mid[j].x = 1.2; }
    P.vy += 880 * dt;
    P.y += P.vy * dt;
    if(P.y >= 0){
      var overGap = false;
      for(var q = 0; q < gaps.length; q++) if(60 > gaps[q].x && 60 < gaps[q].x + gaps[q].w) overGap = true;
      if(overGap){ if(P.y > H * .42) { die(); return; } }
      else { P.y = 0; P.vy = 0; P.jumps = 0; P.coyote = .12; }
    }
    P.coyote = Math.max(0, P.coyote - dt);
    /* tombé dans une trappe sans avoir sauté : passé le délai de grâce, le
       saut du sol est perdu, sinon on remontait du trou plusieurs secondes
       après y être entré */
    if(P.jumps === 0 && P.coyote <= 0 && P.y !== 0) P.jumps = 1;
    P.run += dt * spd * .06;
    for(var o = obs.length - 1; o >= 0; o--){
      var ob = obs[o];
      ob.x -= dx;
      if(ob.x + ob.w < -20){ obs.splice(o, 1); continue; }
      var py = GY + P.y;
      if(60 + 5 > ob.x && 60 - 5 < ob.x + ob.w && py > GY - ob.h + 4){ die(); return; }
    }
    for(var gg = gaps.length - 1; gg >= 0; gg--){
      gaps[gg].x -= dx;
      if(gaps[gg].x + gaps[gg].w < -20) gaps.splice(gg, 1);
    }
    var lastX = Math.max(
      obs.length ? obs[obs.length - 1].x : 0,
      gaps.length ? gaps[gaps.length - 1].x + gaps[gaps.length - 1].w : 0
    );
    if(lastX < W + 40){
      /* l'écart doit suivre la vitesse : à ×3 les caisses se présentaient
         toutes les quatre dixièmes de seconde, moins que la durée d'un saut */
      var space = (260 + Math.random() * 200 - Math.min(60, dist * .07)) * mult;
      if(Math.random() < .34) gaps.push({ x: W + space, w: 40 + Math.random() * 26 });
      else obs.push({ x: W + space, w: 12 + Math.random() * 18, h: 14 + Math.random() * 26, k: (Math.random() * 3) | 0 });
    }
  }
  function draw(t){
    /* ciel laiteux : la lumière vient du fond, tout le reste est silhouette */
    var gd = c2.createLinearGradient(0, 0, 0, H);
    gd.addColorStop(0, '#16222b'); gd.addColorStop(.42, '#1d2c35'); gd.addColorStop(.72, '#111a21'); gd.addColorStop(1, '#070a0d');
    c2.fillStyle = gd; c2.fillRect(0, 0, W, H);
    /* halo de contre-jour, très large */
    var sunX = W * .70, sunY = GY - H * .30;
    var hl = c2.createRadialGradient(sunX, sunY, 4, sunX, sunY, Math.max(W, H) * .75);
    hl.addColorStop(0, 'rgba(226,240,246,.30)');
    hl.addColorStop(.22, 'rgba(150,190,205,.11)');
    hl.addColorStop(1, 'rgba(150,190,205,0)');
    c2.fillStyle = hl; c2.fillRect(0, 0, W, H);
    /* plafonniers de la salle machine : trois nappes de lumière */
    for(var L = 0; L < 4; L++){
      var bx = ((L * .31 + 1 - (t * .012) % 1) % 1.2 - .1) * W;
      c2.fillStyle = 'rgba(5,8,11,.92)';
      c2.fillRect(bx, 0, W * .055, H * (.15 + (L % 2) * .1));
      c2.fillRect(bx - W * .018, H * (.15 + (L % 2) * .1) - 5, W * .09, 5);
    }
    for(var i = 0; i < far.length; i++){
      var f = far[i];
      c2.fillStyle = 'rgba(13,20,26,.85)';
      c2.fillRect(f.x * W, GY - f.h * H, f.w * W, f.h * H);
    }
    /* brume intermédiaire : sépare les plans */
    var mg = c2.createLinearGradient(0, GY - H * .5, 0, GY);
    mg.addColorStop(0, 'rgba(150,190,205,0)'); mg.addColorStop(1, 'rgba(150,190,205,.09)');
    c2.fillStyle = mg; c2.fillRect(0, GY - H * .5, W, H * .5);
    for(var j = 0; j < mid.length; j++){
      var m = mid[j];
      c2.fillStyle = '#05080b';
      c2.fillRect(m.x * W, GY - m.h * H, m.w * W, m.h * H);
      /* liseré de contre-jour sur l'arête tournée vers la lumière */
      c2.fillStyle = 'rgba(198,224,232,.16)';
      c2.fillRect(m.x * W + m.w * W - 1.4, GY - m.h * H, 1.4, m.h * H);
      c2.fillRect(m.x * W, GY - m.h * H, m.w * W, 1.2);
      if(j % 3 === 0){
        var bl3 = Math.floor(t * 1.4 + j) % 2;
        c2.fillStyle = 'rgba(255,92,77,' + (.2 + bl3 * .5) + ')';
        c2.fillRect(m.x * W + m.w * W * .5, GY - m.h * H * .55, 2.4, 2.4);
      }
    }
    for(var mo = 0; mo < motes.length; mo++){
      var p2 = motes[mo];
      c2.fillStyle = 'rgba(228,232,234,' + (.05 + p2.z * .1).toFixed(3) + ')';
      c2.fillRect(p2.x * W, p2.y * GY, 1.4, 1.4);
    }
    /* sol, avec les trous */
    c2.fillStyle = '#020304';
    var segs = [[0, W]];
    gaps.forEach(function(g2){
      var out = [];
      segs.forEach(function(sg){
        var a = sg[0], b = sg[1];
        if(g2.x > b || g2.x + g2.w < a){ out.push(sg); return; }
        if(g2.x > a) out.push([a, g2.x]);
        if(g2.x + g2.w < b) out.push([g2.x + g2.w, b]);
      });
      segs = out;
    });
    segs.forEach(function(sg){
      c2.fillRect(sg[0], GY, sg[1] - sg[0], H - GY);
      var rg = c2.createLinearGradient(0, GY, 0, H);
      rg.addColorStop(0, 'rgba(120,190,215,.09)'); rg.addColorStop(1, 'rgba(120,190,215,0)');
      c2.fillStyle = rg; c2.fillRect(sg[0], GY, sg[1] - sg[0], (H - GY) * .8);
      c2.fillStyle = '#020304';
    });
    c2.strokeStyle = 'rgba(4,139,154,.35)'; c2.lineWidth = 1;
    segs.forEach(function(sg){ c2.beginPath(); c2.moveTo(sg[0], GY + .5); c2.lineTo(sg[1], GY + .5); c2.stroke(); });
    /* dans une salle noire, un trou ne se distingue pas du sol : on marque ses
       deux lèvres, sans quoi le saut ne peut pas être anticipé */
    c2.fillStyle = 'rgba(245,165,36,.6)';
    for(var gk = 0; gk < gaps.length; gk++){
      c2.fillRect(gaps[gk].x - 3, GY - 5, 3, 6);
      c2.fillRect(gaps[gk].x + gaps[gk].w, GY - 5, 3, 6);
    }
    /* obstacles */
    obs.forEach(function(ob){
      c2.fillStyle = '#020304';
      c2.fillRect(ob.x, GY - ob.h, ob.w, ob.h);
      c2.strokeStyle = 'rgba(4,139,154,.4)';
      c2.beginPath(); c2.moveTo(ob.x, GY - ob.h); c2.lineTo(ob.x + ob.w, GY - ob.h); c2.stroke();
      if(ob.k === 1){
        c2.strokeStyle = 'rgba(4,139,154,.22)';
        c2.beginPath(); c2.arc(ob.x + ob.w * .5, GY - ob.h * .5, Math.min(ob.w, ob.h) * .3, 0, 6.2832); c2.stroke();
      }
    });
    /* vignettage AVANT le personnage, et centré sur son couloir */
    var vg = c2.createRadialGradient(90, GY - H * .18, H * .42, 90, GY - H * .18, Math.max(W, H) * .95);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.42)');
    c2.fillStyle = vg; c2.fillRect(0, 0, W, H);
    /* le robot */
    var py = GY + P.y, sw = Math.sin(P.run * .55), air = P.y < -2;
    var CYR = '#048B9A', SHL = '#C9D6DC', SHD = '#7E8F98';
    c2.save(); c2.translate(60, py);
    /* halo et ombre au sol */
    var glow = c2.createRadialGradient(0, -20, 2, 0, -20, 40);
    glow.addColorStop(0, 'rgba(4,139,154,.34)'); glow.addColorStop(1, 'rgba(4,139,154,0)');
    c2.fillStyle = glow; c2.beginPath(); c2.arc(0, -20, 40, 0, 6.2832); c2.fill();
    if(!air){
      c2.fillStyle = 'rgba(0,0,0,.4)';
      c2.beginPath(); c2.ellipse(0, 2, 13, 3, 0, 0, 6.2832); c2.fill();
    }
    /* jambes : segments articulés */
    c2.strokeStyle = SHD; c2.lineWidth = 3.6; c2.lineCap = 'round';
    var lg1 = air ? -.5 : sw * .7, lg2 = air ? .4 : -sw * .7;
    [lg1, lg2].forEach(function(sgn, k){
      var kx = sgn * 7, kyy = -11 + Math.abs(sgn) * 2;
      c2.beginPath();
      c2.moveTo(k ? 3 : -3, -18);
      c2.lineTo(kx, kyy);
      c2.lineTo(kx + sgn * 3, air ? -4 : -1);
      c2.stroke();
      c2.fillStyle = CYR;
      c2.beginPath(); c2.arc(kx, kyy, 2, 0, 6.2832); c2.fill();
    });
    /* torse */
    c2.fillStyle = SHL;
    c2.beginPath();
    c2.moveTo(-7, -34); c2.lineTo(7, -34); c2.lineTo(8, -20); c2.lineTo(-8, -20);
    c2.closePath(); c2.fill();
    c2.fillStyle = 'rgba(20,30,36,.55)'; c2.fillRect(-5, -32, 10, 5);
    /* réacteur thoracique */
    var pulse = .55 + .45 * Math.sin(P.run * .5 + 1);
    c2.fillStyle = 'rgba(4,139,154,' + pulse.toFixed(2) + ')';
    c2.beginPath(); c2.arc(0, -25, 2.8, 0, 6.2832); c2.fill();
    /* bras */
    c2.strokeStyle = SHL; c2.lineWidth = 3;
    var ar = air ? -.9 : sw * .8;
    c2.beginPath();
    c2.moveTo(-7, -31); c2.lineTo(-11 - ar * 4, -25); c2.lineTo(-10 - ar * 7, air ? -30 : -18);
    c2.moveTo(7, -31); c2.lineTo(11 + ar * 4, -25); c2.lineTo(10 + ar * 7, air ? -31 : -18);
    c2.stroke();
    /* tête : casque et visière */
    c2.fillStyle = SHL;
    c2.beginPath();
    c2.moveTo(-6.5, -44); c2.lineTo(6.5, -44); c2.lineTo(7.5, -35); c2.lineTo(-7.5, -35);
    c2.closePath(); c2.fill();
    var vis = c2.createLinearGradient(-6, -42, 6, -38);
    vis.addColorStop(0, '#0A0C0E'); vis.addColorStop(1, '#16323a');
    c2.fillStyle = vis; c2.fillRect(-5.4, -42, 10.8, 5);
    /* œil qui balaye */
    var ex = Math.sin(P.run * .22) * 2.6;
    c2.fillStyle = '#5FD3E3';
    c2.fillRect(-1.4 + ex, -40.6, 3.2, 2.4);
    c2.fillStyle = 'rgba(95,211,227,.28)';
    c2.fillRect(-5.4, -40.4, 10.8, 2);
    /* antenne */
    c2.strokeStyle = CYR; c2.lineWidth = 1.2;
    c2.beginPath(); c2.moveTo(4, -44); c2.lineTo(6, -50); c2.stroke();
    c2.fillStyle = (Math.floor(P.run * .3) % 2) ? CYR : 'rgba(4,139,154,.3)';
    c2.beginPath(); c2.arc(6, -51, 1.7, 0, 6.2832); c2.fill();
    c2.restore();
    if(!run){
      c2.fillStyle = 'rgba(5,7,9,.7)'; c2.fillRect(0, 0, W, H);
      c2.font = '600 12px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = '#048B9A';
      var m1 = dead ? Math.round(dist) + ' M — LA SALLE VOUS A REPRIS' : 'LA SALLE SANS LUMIÈRE';
      c2.fillText(m1, W * .5 - c2.measureText(m1).width * .5, H * .47);
      c2.font = '10px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = '#7C8791';
      var m2 = 'sautez les caisses et les trappes ouvertes';
      c2.fillText(m2, W * .5 - c2.measureText(m2).width * .5, H * .47 + 19);
    }
  }
  cv.addEventListener('pointerdown', function(e){ e.preventDefault(); jump(); });
  addEventListener('keydown', function(e){
    if(e.key !== ' ' && e.key !== 'ArrowUp') return;
    var r = cv.getBoundingClientRect();
    if(r.top > innerHeight || r.bottom < 0) return;
    e.preventDefault(); jump();
  });
  try{ var sv = parseFloat(localStorage.getItem('ad2026.salle.mult')); if(sv > 0) mult = sv; }catch(e){}
  function paintMult(){
    if(!multBtn) return;
    vif(multBtn, function(){ return TR('VITESSE ×#').replace('#', String(mult).replace('.', ',')); });
    var hot = mult >= 2;
    multBtn.style.color = hot ? '#F5A524' : '#048B9A';
    multBtn.style.borderColor = hot ? '#F5A524' : '#048B9A';
  }
  if(multBtn){
    paintMult();
    multBtn.addEventListener('click', function(){
      var i = MULTS.indexOf(mult);
      mult = MULTS[(i + 1) % MULTS.length];
      try{ localStorage.setItem('ad2026.salle.mult', String(mult)); }catch(e){}
      paintMult();
      if(hint) vif(hint, function(){ return mult > 1 ? TR('vitesse ×# — les distances comptent double').replace('#', String(mult).replace('.', ',')) : TR('vitesse normale'); });
    });
  }
  startBtn.addEventListener('click', function(){ api.vis = true; go(); });
  layout(); draw(0);
  /* rotation du téléphone, barre d'adresse qui se replie : sans nouvelle mise
     en page la toile reste peinte à l'ancienne taille, donc floue et décalée.
     On ne repasse que si la taille a vraiment changé. */
  addEventListener('resize', function(){
    var rr = cv.getBoundingClientRect();
    if(Math.abs(rr.width - W) < 1 && Math.abs(rr.height - H) < 1) return;
    layout();
    /* figé, ou partie arrêtée : rien ne repeint la toile qu'on vient de vider */
    if(RM && !run) draw(0);
  }, { passive: true });
  var relance = null;
  api.always = true;
  api.frame = function(dt, t){
    if(!api.vis){ if(run){ run = false; setTR(marque(startBtn), 'REPRENDRE'); } return; }
    /* sur une machine lente à ×2 ou ×3, le décor avance de plus de vingt
       pixels par image : une caisse mince traversait le robot sans le toucher */
    var d = Math.min(.033, dt), n = (run && spd * d > 12) ? 3 : 1, s;
    for(s = 0; s < n; s++){ step(d / n); if(!run) break; }
    draw(t);
  };
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .3 }).observe(cv);
  }else{ api.vis = true; }
  if(RM){
    /* la boucle s'arrête avec la partie : la dernière image (pause, chute)
       est encore peinte, puis plus rien ne bouge */
    relance = boucleFigee(api.frame, function(){ return run; });
    return;
  }
  PIPES.push(api);
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 06 — ÉLEVEZ VOTRE MODÈLE : un LLM local en tamagotchi */
  var cv = qs('[data-g6]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var sayEl = qs('[data-g6-say]'), stateEl = qs('[data-g6-state]'), ageEl = qs('[data-g6-age]'), sizeEl = qs('[data-g6-size]');
  var resetBtn = qs('[data-g6-reset]');
  var DPR2 = CDPR(), W = 0, H = 0, blink = 0, poke = 0;
  var TIERS = [[0, '0,5 B'], [70, '1,5 B'], [180, '3 B'], [360, '7 B'], [620, '13 B'], [980, '32 B'], [1500, 'MoE 8x7 B']];
  var KEY = 'ad2026.modele';
  var M = { data: 60, temp: 38, trust: 70, xp: 0, born: Date.now(), seen: Date.now() };
  try{
    var raw = localStorage.getItem(KEY);
    if(raw){
      var o = JSON.parse(raw);
      /* une seule clé était vérifiée, et l'objet du disque adopté entier :
         un enregistrement partiel faisait entrer un NaN dans la première
         soustraction, et il gagnait ensuite les quatre jauges, l'âge et la
         bouche du modèle. Plus rien ne bougeait jusqu'à REPARTIR DE ZÉRO. */
      var nb = function(v, d){ v = +v; return isFinite(v) ? v : d; };
      if(o && typeof o.xp === 'number') M = {
        data: clamp(nb(o.data, 60), 0, 100), temp: clamp(nb(o.temp, 38), 30, 100),
        trust: clamp(nb(o.trust, 70), 0, 100), xp: clamp(nb(o.xp, 0), 0, 9999),
        born: nb(o.born, Date.now()), seen: nb(o.seen, Date.now())
      };
      /* il vit hors de la page : on rejoue le temps écoulé */
      var away = Math.min(72 * 3600, (Date.now() - (M.seen || Date.now())) / 1000);
      M.data = clamp(M.data - away * .0022, 0, 100);
      M.trust = clamp(M.trust - away * .0016, 0, 100);
      M.temp = clamp(34 + (M.temp - 34) * Math.exp(-away / 900), 30, 100);
    }
  }catch(e){}
  function save(){ M.seen = Date.now(); try{ localStorage.setItem(KEY, JSON.stringify(M)); }catch(e){} }
  function tier(){
    var t = TIERS[0];
    for(var i = 0; i < TIERS.length; i++) if(M.xp >= TIERS[i][0]) t = TIERS[i];
    return t;
  }
  function nextAt(){
    for(var i = 0; i < TIERS.length; i++) if(M.xp < TIERS[i][0]) return TIERS[i][0];
    return TIERS[TIERS.length - 1][0];
  }
  function mood(){
    if(M.temp > 86) return 'chaud';
    if(M.data < 16) return 'affame';
    if(M.trust < 28) return 'derive';
    if(M.data > 70 && M.trust > 70 && M.temp < 62) return 'heureux';
    return 'nominal';
  }
  var SAY = {
    chaud: ["La température monte : 86 °C et plus, je throttle. Refroidissez-moi avant d'entraîner.", 'Les ventilateurs sont à fond. Une pause.'],
    affame: ["Je n'ai plus de données propres à me mettre sous la dent.", 'Affamé. Donnez-moi du corpus.'],
    derive: ["Je commence à répondre n'importe quoi. Réalignez-moi.", 'Sans garde-fous je dérive — et je le sais.'],
    heureux: ['Froid, nourri, aligné : entraînez-moi, je vais grandir.', 'Tout est vert. On peut pousser un cycle.'],
    nominal: ['Prêt. Un cycle d\'entraînement quand vous voulez.', 'Je tourne en local, rien ne sort d\'ici.']
  };
  var LBL = { chaud: 'état : throttling', affame: 'état : affamé', derive: 'état : désaligné', heureux: 'état : optimal', nominal: 'état : nominal' };
  var lastMood = '', sayT = 0;
  function paint(){
    var t = tier(), na = nextAt(), prev = t[0];
    var prog = na > prev ? clamp((M.xp - prev) / (na - prev), 0, 1) : 1;
    var vals = { data: Math.round(M.data), temp: Math.round(M.temp), trust: Math.round(M.trust), xp: Math.round(M.xp) };
    qsa('[data-g6-v]').forEach(function(el){ el.textContent = vals[el.getAttribute('data-g6-v')]; });
    qsa('[data-g6-b]').forEach(function(el){
      var k = el.getAttribute('data-g6-b');
      el.style.width = (k === 'xp' ? prog * 100 : vals[k]) + '%';
      if(k === 'temp') el.style.background = M.temp > 86 ? '#FF5C4D' : M.temp > 68 ? '#F5A524' : '#048B9A';
      if(k === 'trust') el.style.background = M.trust < 28 ? '#FF5C4D' : '#4169E1';
      if(k === 'data') el.style.background = M.data < 16 ? '#FF5C4D' : '#048B9A';
    });
    /* la puce ne disait que la taille du moment : la barre d'entraînement
       montait vers rien, on ignorait qu'un palier existait et lequel */
    if(sizeEl){
      var suiv = '';
      for(var it = 0; it < TIERS.length; it++) if(M.xp < TIERS[it][0]){ suiv = TIERS[it][1]; break; }
      sizeEl.textContent = suiv ? t[1] + ' → ' + suiv : t[1];
    }
    if(ageEl) vif(ageEl, function(){ return TR('âge # j').replace('#', Math.max(0, Math.floor((Date.now() - M.born) / 86400000))); });
    var mo = mood();
    if(stateEl){ vif(stateEl, function(){ return TR(LBL[mo]); }); stateEl.style.color = mo === 'heureux' ? '#048B9A' : (mo === 'nominal' ? '#7C8791' : '#FF5C4D'); }
    if(sayEl && mo !== lastMood){
      lastMood = mo;
      var l = SAY[mo][(Math.random() * SAY[mo].length) | 0];
      /* la réplique passait dans le document sans jamais toucher la fiche :
         neuf des dix phrases y sont pourtant déjà */
      var lt = TR(l);
      if(RM) vif(sayEl, function(){ return TR(l); });
      else{
        g.killTweensOf(sayEl);
        g.to(sayEl, { opacity: 0, duration: .15, onComplete: function(){ vif(sayEl, function(){ return TR(l); }); g.to(sayEl, { opacity: 1, duration: .4 }); } });
      }
    }
  }
  function act(k){
    if(k === 'feed'){ M.data = clamp(M.data + 20, 0, 100); M.temp = clamp(M.temp + 2, 30, 100); }
    if(k === 'cool'){ M.temp = clamp(M.temp - 24, 30, 100); }
    if(k === 'align'){ M.trust = clamp(M.trust + 18, 0, 100); M.temp = clamp(M.temp + 3, 30, 100); }
    if(k === 'train'){
      if(M.data < 12){ M.data = clamp(M.data, 0, 100); lastMood = ''; poke = 1; paint(); return; }
      M.data = clamp(M.data - 12, 0, 100);
      M.temp = clamp(M.temp + 15, 30, 100);
      var eff = (M.trust / 100) * (M.temp > 86 ? .15 : 1);
      M.xp += 11 * eff;
      M.trust = clamp(M.trust - 3, 0, 100);
    }
    poke = 1; lastMood = ''; save(); paint();
    /* mouvement figé : le visage ne changeait plus, aucune boucle ne le repeint */
    if(RM) draw(0);
  }
  qsa('[data-g6-act]').forEach(function(b){ b.addEventListener('click', function(){ act(b.getAttribute('data-g6-act')); }); });
  if(resetBtn) resetBtn.addEventListener('click', function(){
    M = { data: 60, temp: 38, trust: 70, xp: 0, born: Date.now(), seen: Date.now() };
    lastMood = ''; save(); paint();
  });
  /* La caresse ne doit pas remplacer ALIGNER : sans cadence, tapoter la
     toile alignait gratuitement et le bouton ne servait plus à rien. Et
     l'écriture locale part maintenant avec le tour périodique — sur un
     téléphone, un défilement qui commence sur la toile déclenche ce même
     événement, et l'écriture bloquait le fil pendant le geste. */
  var caresse = 0;
  cv.addEventListener('pointerdown', function(){
    poke = 1;
    var now = Date.now();
    if(now - caresse < 1500) return;
    caresse = now; M.trust = clamp(M.trust + 1.5, 0, 100); paint();
  });

  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = W * DPR2; cv.height = H * DPR2;
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
  }
  function draw(t){
    var mo = mood(), lv = TIERS.indexOf(tier());
    c2.fillStyle = '#0B0E11'; c2.fillRect(0, 0, W, H);
    c2.strokeStyle = 'rgba(228,232,234,.035)';
    for(var gx = 1; gx < 8; gx++){ c2.beginPath(); c2.moveTo(gx * W / 8, 0); c2.lineTo(gx * W / 8, H); c2.stroke(); }
    for(var gy = 1; gy < 6; gy++){ c2.beginPath(); c2.moveTo(0, gy * H / 6); c2.lineTo(W, gy * H / 6); c2.stroke(); }
    var cx = W * .5, cy = H * .52, sc = Math.min(W / 300, H / 260) * (.72 + lv * .07);
    var hot = M.temp > 86, cold = M.temp < 50;
    var col = mo === 'derive' ? '#FF5C4D' : hot ? '#F5A524' : '#048B9A';
    poke = Math.max(0, poke - .02);
    var bob = Math.sin(t * 1.6) * 4 + poke * -6;
    c2.save(); c2.translate(cx, cy + bob); c2.scale(sc, sc);
    /* halo */
    var hg = c2.createRadialGradient(0, 0, 4, 0, 0, 130);
    hg.addColorStop(0, (hot ? 'rgba(245,165,36,' : 'rgba(4,139,154,') + (.16 + poke * .2) + ')');
    hg.addColorStop(1, 'rgba(0,0,0,0)');
    c2.fillStyle = hg; c2.beginPath(); c2.arc(0, 0, 130, 0, 6.2832); c2.fill();
    /* antenne */
    c2.strokeStyle = col; c2.lineWidth = 2;
    c2.beginPath(); c2.moveTo(0, -54); c2.lineTo(0, -70); c2.stroke();
    c2.fillStyle = Math.floor(t * 1.8) % 2 ? col : 'rgba(4,139,154,.3)';
    c2.beginPath(); c2.arc(0, -74, 4.5, 0, 6.2832); c2.fill();
    /* tête */
    c2.fillStyle = 'rgba(11,14,17,.95)'; c2.strokeStyle = col; c2.lineWidth = 2.2;
    c2.fillRect(-42, -54, 84, 56); c2.strokeRect(-42, -54, 84, 56);
    c2.fillStyle = 'rgba(4,139,154,.06)'; c2.fillRect(-35, -47, 70, 34);
    /* yeux selon l'humeur */
    blink -= .016;
    if(blink < 0){ blink = 2.6 + Math.random() * 3; }
    var shut = blink < .12;
    c2.fillStyle = col;
    if(shut){
      c2.fillRect(-26, -30, 18, 2.4); c2.fillRect(8, -30, 18, 2.4);
    }else if(mo === 'affame'){
      c2.fillRect(-26, -34, 18, 5); c2.fillRect(8, -34, 18, 5);
    }else if(mo === 'derive'){
      c2.save(); c2.translate(-17, -30); c2.rotate(.5); c2.fillRect(-9, -2.5, 18, 5); c2.restore();
      c2.save(); c2.translate(17, -30); c2.rotate(-.5); c2.fillRect(-9, -2.5, 18, 5); c2.restore();
    }else if(mo === 'heureux'){
      c2.beginPath(); c2.arc(-17, -30, 8, 3.4, 6.02); c2.lineWidth = 3.4; c2.strokeStyle = col; c2.stroke();
      c2.beginPath(); c2.arc(17, -30, 8, 3.4, 6.02); c2.stroke();
    }else{
      c2.fillRect(-27, -36, 20, 13); c2.fillRect(7, -36, 20, 13);
      c2.fillStyle = '#0B0E11';
      var lx = Math.sin(t * .7) * 4;
      c2.fillRect(-21 + lx, -32, 8, 6); c2.fillRect(13 + lx, -32, 8, 6);
      c2.fillStyle = col;
    }
    /* bouche = barre de charge */
    c2.fillStyle = 'rgba(228,232,234,.2)'; c2.fillRect(-20, -8, 40, 3);
    c2.fillStyle = col; c2.fillRect(-20, -8, 40 * clamp(M.data / 100, 0, 1), 3);
    /* corps */
    c2.fillStyle = 'rgba(11,14,17,.95)'; c2.strokeStyle = col; c2.lineWidth = 1.8;
    var bw = 26 + lv * 5;
    c2.fillRect(-bw, 8, bw * 2, 40); c2.strokeRect(-bw, 8, bw * 2, 40);
    /* modules = niveau */
    for(var i = 0; i < Math.min(6, lv + 1); i++){
      c2.fillStyle = i <= lv ? col : 'rgba(228,232,234,.14)';
      c2.fillRect(-bw + 7 + i * 9, 16, 5, 5);
    }
    /* cœur qui bat */
    var pulse = .55 + .45 * Math.sin(t * (hot ? 7 : 3));
    c2.fillStyle = mo === 'derive' ? '#FF5C4D' : col;
    c2.globalAlpha = pulse; c2.fillRect(-6, 30, 12, 12); c2.globalAlpha = 1;
    /* bras & pattes */
    c2.strokeStyle = col; c2.lineWidth = 2;
    c2.beginPath();
    c2.moveTo(-bw, 18); c2.lineTo(-bw - 12, 26 + Math.sin(t * 2) * 3);
    c2.moveTo(bw, 18); c2.lineTo(bw + 12, 26 - Math.sin(t * 2) * 3);
    c2.moveTo(-12, 48); c2.lineTo(-12, 60);
    c2.moveTo(12, 48); c2.lineTo(12, 60);
    c2.stroke();
    c2.restore();
    /* vapeur si trop chaud */
    if(hot){
      for(var s2 = 0; s2 < 5; s2++){
        var ph = (t * .7 + s2 * .2) % 1;
        c2.fillStyle = 'rgba(245,165,36,' + (.3 * (1 - ph)).toFixed(2) + ')';
        c2.beginPath();
        c2.arc(cx + (s2 - 2) * 14 + Math.sin(ph * 6 + s2) * 6, cy - 80 * sc - ph * 40, 3 + ph * 6, 0, 6.2832);
        c2.fill();
      }
    }
    /* zzz si négligé longtemps */
    if(M.data < 8 && M.trust < 20){
      c2.font = '600 12px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = 'rgba(124,135,145,.7)';
      c2.fillText('z z z', cx + 48 * sc, cy - 60 * sc);
    }
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    /* la phrase entière ne correspondait à aucune clé — la taille du modèle
       change à chaque palier : seul le préfixe se traduit, il est dans la table */
    var lab = TR('modèle local ·') + ' ' + tier()[1] + ' · ' + Math.round(M.temp) + ' °C';
    c2.fillText(lab, 12, H - 12);
  }
  layout(); paint(); draw(0);
  var drift = 0, saveT = 0;
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){
    drift += dt;
    if(drift > .5){
      M.data = clamp(M.data - drift * .55, 0, 100);
      M.trust = clamp(M.trust - drift * .4, 0, 100);
      M.temp = clamp(34 + (M.temp - 34) * Math.exp(-drift / 26), 30, 100);
      drift = 0; paint();
      saveT++; if(saveT > 12){ saveT = 0; save(); }
    }
    if(!api.vis) return;
    draw(t);
  };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){
      var v = en[0].isIntersecting;
      /* on quitte la vue : on fige l'état une dernière fois, l'écriture
         périodique s'arrêtant tant que la fiche n'est pas à l'écran */
      if(api.vis && !v) save();
      api.vis = v;
    }, { threshold: .2 }).observe(cv);
  }else{ api.vis = true; }
  /* iOS ne déclenche pas toujours beforeunload : sans pagehide, l'horodatage
     du dernier passage restait vieux et le modèle revenait sur-dégradé */
  addEventListener('beforeunload', save);
  addEventListener('pagehide', save);
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 07 — COLLECTE DE PAQUETS : la sonde parcourt le réseau */
  var cv = qs('[data-g7]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var scoreEl = qs('[data-g7-score]'), bestEl = qs('[data-g7-best]');
  var startBtn = qs('[data-g7-start]'), hint = qs('[data-g7-hint]');
  var DPR2 = CDPR(), W = 0, H = 0, CW = 18, CH = 12, cell = 16, ox = 0, oy = 0;
  var snake = [], dir = [1, 0], nxt = [1, 0], food = null, run = false, over = false;
  var score = 0, best = 0, acc = 0, step = .13;
  try{ best = parseInt(localStorage.getItem('ad2026.g7.best'), 10) || 0; }catch(e){}
  if(bestEl) vif(bestEl, function(){ return TR('record ') + best; });
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    cell = Math.max(9, Math.min((W - 24) / CW, (H - 34) / CH));
    ox = (W - cell * CW) * .5; oy = (H - cell * CH) * .5 + 4;
  }
  function place(){
    var free = [];
    for(var y = 0; y < CH; y++) for(var x = 0; x < CW; x++){
      var busy = false;
      for(var i = 0; i < snake.length; i++) if(snake[i][0] === x && snake[i][1] === y) busy = true;
      if(!busy) free.push([x, y]);
    }
    food = free.length ? free[(Math.random() * free.length) | 0] : null;
  }
  function reset(){
    snake = [[3, 6], [2, 6], [1, 6]];
    dir = [1, 0]; nxt = [1, 0]; score = 0; step = .13; run = true; over = false;
    if(scoreEl) scoreEl.textContent = '0';
    if(hint) vif(hint, function(){ return TR('flèches ou glissé du doigt'); });
    setTR(marque(startBtn), 'EN COURS');
    place();
    if(relance) relance();
  }
  function die(cause){
    SFX.perd();
    run = false; over = true;
    if(score > best){ best = score; try{ localStorage.setItem('ad2026.g7.best', String(best)); }catch(e){} }
    if(bestEl) vif(bestEl, function(){ return TR('record ') + best; });
    setTR(marque(startBtn), 'REJOUER');
    /* le bilan comptait les POINTS comme des paquets (dix par paquet : « 10
       paquets » pour un seul), et annonçait « recoupée » même quand la sonde
       avait heurté le bord. Le nombre est celui des paquets, la cause la vraie. */
    var n = Math.round(score / 10), un = n === 1;
    if(hint) vif(hint, function(){ return n + ' ' + TR(cause === 'bord'
      ? (un ? 'paquet collecté — la sonde a heurté le bord' : 'paquets collectés — la sonde a heurté le bord')
      : (un ? 'paquet collecté — la sonde s\'est recoupée' : 'paquets collectés — la sonde s\'est recoupée')); });
    if(score >= 150) TROPHY.win('g7');
  }
  function step1(){
    dir = nxt;
    var hx = snake[0][0] + dir[0], hy = snake[0][1] + dir[1];
    if(hx < 0 || hy < 0 || hx >= CW || hy >= CH){ die('bord'); return; }
    for(var i = 0; i < snake.length - 1; i++) if(snake[i][0] === hx && snake[i][1] === hy){ die('soi'); return; }
    snake.unshift([hx, hy]);
    if(food && hx === food[0] && hy === food[1]){
      score += 10;
      if(scoreEl) scoreEl.textContent = score;
      step = Math.max(.06, step - .004);
      place();
    }else snake.pop();
  }
  function draw(t){
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    /* la trame du réseau */
    /* trente-deux traits de même style : un seul chemin, un seul stroke. Le
       rendu est identique, les trente et un appels en trop ne le sont pas */
    c2.strokeStyle = 'rgba(228,232,234,.045)'; c2.lineWidth = 1;
    c2.beginPath();
    for(var x = 0; x <= CW; x++){ c2.moveTo(ox + x * cell, oy); c2.lineTo(ox + x * cell, oy + CH * cell); }
    for(var y = 0; y <= CH; y++){ c2.moveTo(ox, oy + y * cell); c2.lineTo(ox + CW * cell, oy + y * cell); }
    c2.stroke();
    c2.strokeStyle = 'rgba(4,139,154,.35)';
    c2.strokeRect(ox, oy, CW * cell, CH * cell);
    /* le paquet à récupérer */
    if(food){
      var pu = .6 + .4 * Math.sin(t * 5);
      c2.fillStyle = 'rgba(95,211,227,' + pu.toFixed(2) + ')';
      c2.fillRect(ox + food[0] * cell + cell * .22, oy + food[1] * cell + cell * .22, cell * .56, cell * .56);
      c2.strokeStyle = 'rgba(95,211,227,.45)';
      c2.strokeRect(ox + food[0] * cell + cell * .1, oy + food[1] * cell + cell * .1, cell * .8, cell * .8);
    }
    /* la sonde */
    for(var i = snake.length - 1; i >= 0; i--){
      var seg = snake[i], head = i === 0;
      var a = 1 - i / (snake.length + 4);
      c2.fillStyle = head ? '#5FD3E3' : 'rgba(4,139,154,' + (.35 + a * .5).toFixed(2) + ')';
      c2.fillRect(ox + seg[0] * cell + 1.5, oy + seg[1] * cell + 1.5, cell - 3, cell - 3);
      if(head){
        c2.fillStyle = '#07090B';
        c2.fillRect(ox + seg[0] * cell + cell * .34, oy + seg[1] * cell + cell * .34, cell * .32, cell * .32);
      }
    }
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    c2.fillText('longueur ' + snake.length, ox, oy - 8);
  }
  function turn(dx, dy){
    if(dx === -dir[0] && dy === -dir[1]) return;
    nxt = [dx, dy];
  }
  addEventListener('keydown', function(e){
    if(!run) return;
    var r = cv.getBoundingClientRect();
    if(r.bottom < 0 || r.top > innerHeight) return;
    var m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if(!m) return;
    e.preventDefault(); turn(m[0], m[1]);
  });
  var sw = null;
  cv.addEventListener('pointerdown', function(e){ sw = [e.clientX, e.clientY]; });
  /* le virage se prend pendant le geste : attendu au relâchement, il arrivait
     une à deux cases trop tard et la sonde était déjà dans le mur. Le repère
     est replacé à chaque virage, un seul glissé peut donc en enchaîner deux. */
  cv.addEventListener('pointermove', function(e){
    if(!sw || !run) return;
    /* souris relâchée hors de la toile : le repère survivait au bouton */
    if(window.PointerEvent && e.pointerType === 'mouse' && e.buttons === 0){ sw = null; return; }
    var dx = e.clientX - sw[0], dy = e.clientY - sw[1];
    if(Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
    if(Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
    sw = [e.clientX, e.clientY];
  });
  cv.addEventListener('pointercancel', function(){ sw = null; });
  cv.addEventListener('pointerup', function(e){
    var court = sw && Math.abs(e.clientX - sw[0]) < 14 && Math.abs(e.clientY - sw[1]) < 14;
    sw = null;
    /* partie finie : toute la grille relance — sur un téléphone, le bouton est
       sous le cadre, hors du chemin du pouce */
    if(court && over){ layout(); reset(); }
  });
  startBtn.addEventListener('click', function(){ layout(); reset(); });
  layout(); snake = [[3, 6], [2, 6], [1, 6]]; place(); draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  var relance = boucleFigee(function(dt, t){
    if(run){ acc += dt; if(acc >= step){ acc = 0; step1(); } }
    draw(t);
  }, function(){ return run; });
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){
    if(!api.vis) return;
    if(run){ acc += dt; if(acc >= step){ acc = 0; step1(); } }
    draw(t);
  };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 08 — RENVOYER LES ATTAQUES : la raquette protège le pare-feu */
  var cv = qs('[data-g8]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var scoreEl = qs('[data-g8-score]'), livesEl = qs('[data-g8-lives]');
  var startBtn = qs('[data-g8-start]'), hint = qs('[data-g8-hint]');
  var DPR2 = CDPR(), W = 0, H = 0;
  var run = false, score = 0, lives = 3, bricks = [], keys = {};
  var hold = 0, hurt = 0, dirty = 1;
  var pad = { x: 0, w: 74 }, ball = { x: 0, y: 0, vx: 0, vy: 0, r: 4.6 };
  var LBL = ['scan de ports', 'force brute', 'hameçonnage', 'injection', 'rançongiciel'];
  /* libellés traduits une fois par langue, pas une fois par image */
  var lblMem = {}, lblLg = '';
  function lbl(k){
    var lg = 'fr';
    try{ lg = window.I18N.get() || 'fr'; }catch(e){}
    if(lg !== lblLg){ lblMem = {}; lblLg = lg; }
    return lblMem[k] || (lblMem[k] = TR(LBL[k]));
  }
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    pad.w = Math.max(56, W * .16);
    if(!pad.x) pad.x = W * .5;
    /* la barre d'adresse d'un téléphone se replie au défilement et la toile
       est remesurée en pleine partie : reconstruire le mur faisait revenir
       toutes les tentatives déjà bloquées. En partie, on ne fait que replacer. */
    if(run && bricks.length) place();
    else build();
  }
  function build(){
    bricks = [];
    var cols = Math.max(5, Math.min(9, Math.floor(W / 68))), rows = 4;
    for(var r2 = 0; r2 < rows; r2++) for(var c = 0; c < cols; c++){
      bricks.push({ c: c, r: r2, n: cols, live: 1, k: (r2 + c) % LBL.length, hp: r2 === 0 ? 2 : 1 });
    }
    place();
  }
  function place(){
    for(var i = 0; i < bricks.length; i++){
      var b = bricks[i], bw = (W - 24) / b.n, bh = 17;
      b.x = 12 + b.c * bw; b.y = 30 + b.r * (bh + 5); b.w = bw - 5; b.h = bh;
    }
    pad.x = clamp(pad.x, pad.w * .5, W - pad.w * .5);
    ball.x = clamp(ball.x, ball.r, Math.max(ball.r, W - ball.r));
    if(ball.y > H - 30) ball.y = H - 42;
  }
  function reset(){
    run = true; score = 0; lives = 3;
    /* une flèche restée enfoncée à la fin de la partie précédente faisait
       dériver la raquette dès le coup d'envoi suivant */
    keys.left = 0; keys.right = 0;
    hurt = 0; hold = .7;
    build();
    pad.x = W * .5;
    ball.x = W * .5; ball.y = H - 42; ball.vx = 150; ball.vy = -190;
    if(scoreEl) scoreEl.textContent = '0';
    if(livesEl){ vif(livesEl, function(){ return TR('3 vies'); }); livesEl.style.color = '#048B9A'; }
    setTR(marque(startBtn), 'EN COURS');
    if(hint) vif(hint, function(){ return TR('renvoyez le paquet sur les tentatives'); });
    if(relance) relance();
  }
  function lose(){
    lives--;
    if(livesEl){
      vif(livesEl, function(){ return TR(lives === 1 ? '# vie' : '# vies').replace('#', Math.max(0, lives)); });
      livesEl.style.color = lives > 1 ? '#048B9A' : '#FF5C4D';
    }
    if(lives <= 0){
      run = false;
      setTR(marque(startBtn), 'REJOUER');
      if(hint) vif(hint, function(){ return TR('pare-feu percé — # points').replace('#', score); });
      /* le paquet finissait sa course hors du cadre et la toile restait vide :
         on le repose sur la raquette, prêt pour la partie suivante */
      ball.x = pad.x; ball.y = H - 42;
      return;
    }
    ball.x = pad.x; ball.y = H - 42; ball.vx = 150 * (Math.random() < .5 ? -1 : 1); ball.vy = -190;
  }
  function step(dt){
    if(!run) return;
    if(keys.left) pad.x -= 420 * dt;
    if(keys.right) pad.x += 420 * dt;
    pad.x = clamp(pad.x, pad.w * .5, W - pad.w * .5);
    if(hurt > 0) hurt = Math.max(0, hurt - dt * 1.6);
    /* temps mort au coup d'envoi et après une vie perdue : le paquet reste
       posé sur la raquette, on choisit d'où il part au lieu de le subir */
    if(hold > 0){ hold -= dt; ball.x = pad.x; ball.y = H - 42; return; }
    var y0 = ball.y;
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if(ball.x < ball.r){ ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
    if(ball.x > W - ball.r){ ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
    if(ball.y < 22 + ball.r){ ball.y = 22 + ball.r; ball.vy = Math.abs(ball.vy); }
    /* la raquette */
    if(ball.y > H - 30 - ball.r && ball.y < H - 20 && Math.abs(ball.x - pad.x) < pad.w * .5 + ball.r){
      ball.y = H - 30 - ball.r;
      ball.vy = -Math.abs(ball.vy);
      ball.vx += (ball.x - pad.x) * 3.4;
      ball.vx = clamp(ball.vx, -300, 300);
    }
    if(ball.y > H) lose();
    /* les tentatives */
    for(var i = 0; i < bricks.length; i++){
      var b = bricks[i];
      if(!b.live) continue;
      if(ball.x > b.x - ball.r && ball.x < b.x + b.w + ball.r &&
         ball.y > b.y - ball.r && ball.y < b.y + b.h + ball.r){
        b.hp--;
        if(b.hp <= 0){ b.live = 0; b.fade = 1; }
        score += 15;
        if(scoreEl) scoreEl.textContent = score;
        /* on renversait la seule vitesse verticale sans jamais ressortir le
           paquet du bloc : une tentative à deux points de vie était retouchée à
           l'image suivante, les deux renversements s'annulaient et le paquet la
           traversait sans rebondir. On ressort donc le paquet par la face qu'il
           vient de franchir — celle qu'il a mis le moins de temps à passer. */
        var px = Math.min(ball.x + ball.r - b.x, b.x + b.w + ball.r - ball.x);
        var py = Math.min(ball.y + ball.r - b.y, b.y + b.h + ball.r - ball.y);
        if(py / (Math.abs(ball.vy) || .001) <= px / (Math.abs(ball.vx) || .001)){
          ball.vy = ball.y < b.y + b.h * .5 ? -Math.abs(ball.vy) : Math.abs(ball.vy);
          ball.y += ball.vy > 0 ? py : -py;
        }else{
          ball.vx = ball.x < b.x + b.w * .5 ? -Math.abs(ball.vx) : Math.abs(ball.vx);
          ball.x += ball.vx > 0 ? px : -px;
        }
        ball.vx *= 1.02; ball.vy *= 1.02;
        break;
      }
    }
    var left = 0;
    for(var j = 0; j < bricks.length; j++) if(bricks[j].live) left++;
    if(!left){
      run = false;
      setTR(marque(startBtn), 'REJOUER');
      if(hint) vif(hint, function(){ return TR('toutes les tentatives bloquées — # points').replace('#', score); });
      TROPHY.win('g8');
    }
  }
  function draw(t){
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    c2.font = '8.5px "IBM Plex Mono", ui-monospace, monospace';
    /* le pare-feu, en bas */
    c2.strokeStyle = 'rgba(4,139,154,.4)'; c2.lineWidth = 1;
    c2.beginPath(); c2.moveTo(0, H - 12); c2.lineTo(W, H - 12); c2.stroke();
    c2.fillStyle = '#2A3238';
    c2.fillText('pare-feu', 8, H - 6);
    bricks.forEach(function(b){
      if(!b.live) return;
      var strong = b.hp > 1;
      c2.fillStyle = strong ? 'rgba(255,92,77,.2)' : 'rgba(255,92,77,.11)';
      c2.fillRect(b.x, b.y, b.w, b.h);
      c2.strokeStyle = strong ? 'rgba(255,92,77,.7)' : 'rgba(255,92,77,.4)';
      c2.lineWidth = 1;
      c2.strokeRect(b.x, b.y, b.w, b.h);
      if(b.w > 72){
        c2.fillStyle = 'rgba(255,138,126,.85)';
        /* on raccourcit le libellé TRADUIT : rogné en français puis remis au
           traducteur, le mot amputé ne correspondait plus à aucune clé et
           restait en français dans les sept autres langues */
        var full = lbl(b.k), tx = full, max = b.w - 12;
        while(tx.length > 3 && c2.measureText(tx).width > max) tx = tx.slice(0, -1);
        if(tx !== full) tx += '…';
        c2.fillText(tx, b.x + 6, b.y + b.h * .5);
      }
    });
    /* la raquette */
    c2.fillStyle = '#048B9A';
    c2.fillRect(pad.x - pad.w * .5, H - 30, pad.w, 6);
    c2.fillStyle = 'rgba(95,211,227,.5)';
    c2.fillRect(pad.x - pad.w * .5, H - 31, pad.w, 1.5);
    /* le paquet */
    c2.fillStyle = '#D6F7FF';
    c2.beginPath(); c2.arc(ball.x, ball.y, ball.r, 0, 6.2832); c2.fill();
    c2.strokeStyle = 'rgba(95,211,227,.5)';
    c2.beginPath(); c2.arc(ball.x, ball.y, ball.r + 3, 0, 6.2832); c2.stroke();
  }
  /* Au doigt, « pointermove » ne parle qu'après un appui et se tait dès que le
     doigt sort de la toile : la raquette restait alors plantée en pleine
     course. On la place au premier contact et on capture le pointeur pour
     suivre le glissé jusqu'au bord de l'écran. */
  function vise(e){
    var r = cv.getBoundingClientRect();
    if(!r.width) return;
    pad.x = clamp((e.clientX - r.left) * (W / r.width), pad.w * .5, W - pad.w * .5);
    if(!run){ ball.x = pad.x; dirty = 1; }
  }
  cv.addEventListener('pointerdown', function(e){
    vise(e);
    if(cv.setPointerCapture && e.pointerId != null) try{ cv.setPointerCapture(e.pointerId); }catch(err){}
  }, {passive:true});
  cv.addEventListener('pointermove', vise, {passive:true});
  addEventListener('keydown', function(e){
    if(!run) return;
    var r = cv.getBoundingClientRect();
    if(r.bottom < 0 || r.top > innerHeight) return;
    if(e.key === 'ArrowLeft'){ keys.left = 1; e.preventDefault(); }
    if(e.key === 'ArrowRight'){ keys.right = 1; e.preventDefault(); }
  });
  addEventListener('keyup', function(e){
    if(e.key === 'ArrowLeft') keys.left = 0;
    if(e.key === 'ArrowRight') keys.right = 0;
  });
  startBtn.addEventListener('click', function(){ layout(); reset(); });
  layout(); draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  var relance = boucleFigee(function(dt, t){ step(Math.min(.032, dt)); draw(t); }, function(){ return run; });
  /* figé : la raquette suit le doigt avant le coup d'envoi, on la repeint */
  if(RM) cv.addEventListener('pointermove', function(){ if(!run) draw(0); }, {passive:true});
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){ if(!api.vis) return; step(Math.min(.032, dt)); draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 09 — TROUVER L'INTRUSION : déduction sur une grille de machines */
  var cv = qs('[data-g9]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var flagsEl = qs('[data-g9-flags]'), stEl = qs('[data-g9-state]');
  var startBtn = qs('[data-g9-start]'), hint = qs('[data-g9-hint]');
  var DPR2 = CDPR(), W = 0, H = 0, cell = 26, ox = 0, oy = 0;
  var CW = 9, CH = 7, MINES = 8;
  var G2 = [], run = false, won = false, lost = false, flags = 0, hover = -1;
  function idx(x, y){ return y * CW + x; }
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    cell = Math.max(16, Math.min((W - 20) / CW, (H - 30) / CH));
    ox = (W - cell * CW) * .5; oy = (H - cell * CH) * .5 + 4;
  }
  /* la première machine ouverte ne peut pas être compromise : une partie
     sur huit se perdait au premier appui, sans le moindre indice à lire.
     Les huit intrusions sont donc posées au premier appui, hors de la case
     touchée et de ses voisines — ce premier appui dégage une zone. */
  var arme = false;
  function gen(boot){
    G2 = [];
    for(var i = 0; i < CW * CH; i++) G2.push({ m: 0, open: 0, flag: 0, n: 0 });
    arme = false;
    run = true; won = false; lost = false; flags = 0;
    if(flagsEl) flagsEl.textContent = '0 / ' + MINES;
    if(stEl){ vif(stEl, function(){ return TR('analyse en cours'); }); stEl.style.color = '#56606A'; }
    if(hint) vif(hint, function(){ return TR(TOUCH ? 'toucher : ouvrir · maintien : marquer' : 'clic : ouvrir · maintien : marquer'); });
    /* au chargement, la grille n'est qu'un décor : le bouton garde son
       intitulé, « RECOMMENCER » avant toute partie ne voulait rien dire */
    if(!boot) setTR(marque(startBtn), 'RECOMMENCER');
  }
  function plant(sx, sy){
    var placed = 0;
    while(placed < MINES){
      var k = (Math.random() * G2.length) | 0;
      if(G2[k].m) continue;
      if(Math.abs(k % CW - sx) <= 1 && Math.abs(((k / CW) | 0) - sy) <= 1) continue;
      G2[k].m = 1; placed++;
    }
    for(var y = 0; y < CH; y++) for(var x = 0; x < CW; x++){
      var n = 0;
      for(var dy = -1; dy <= 1; dy++) for(var dx = -1; dx <= 1; dx++){
        if(!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if(nx < 0 || ny < 0 || nx >= CW || ny >= CH) continue;
        if(G2[idx(nx, ny)].m) n++;
      }
      G2[idx(x, y)].n = n;
    }
    arme = true;
  }
  function open(x, y){
    if(x < 0 || y < 0 || x >= CW || y >= CH) return;
    var c = G2[idx(x, y)];
    if(c.open || c.flag) return;
    if(!arme) plant(x, y);
    c.open = 1;
    if(c.m){
      lost = true; run = false;
      for(var i = 0; i < G2.length; i++) if(G2[i].m) G2[i].open = 1;
      if(stEl){ vif(stEl, function(){ return TR('machine compromise ouverte'); }); stEl.style.color = '#FF5C4D'; }
      if(hint) vif(hint, function(){ return TR('la machine était infectée — relancez l\'analyse'); });
      setTR(marque(startBtn), 'NOUVELLE ANALYSE');
      return;
    }
    if(!c.n){
      for(var dy = -1; dy <= 1; dy++) for(var dx = -1; dx <= 1; dx++){
        if(dx || dy) open(x + dx, y + dy);
      }
    }
    check();
  }
  function check(){
    var closed = 0;
    for(var i = 0; i < G2.length; i++) if(!G2[i].open) closed++;
    if(closed === MINES){
      won = true; run = false;
      if(stEl){ vif(stEl, function(){ return TR('parc assaini'); }); stEl.style.color = '#50C878'; }
      if(hint) vif(hint, function(){ return TR('les huit machines compromises sont isolées'); });
      TROPHY.win('g9');
      setTR(marque(startBtn), 'NOUVELLE ANALYSE');
    }
  }
  var NCOL = ['#39424A', '#5FD3E3', '#048B9A', '#4169E1', '#F5A524', '#FF8A6E', '#FF5C4D', '#FF5C4D', '#FF5C4D'];
  function draw(t){
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    c2.font = Math.max(9, cell * .42).toFixed(0) + 'px "IBM Plex Mono", ui-monospace, monospace';
    for(var y = 0; y < CH; y++) for(var x = 0; x < CW; x++){
      var c = G2[idx(x, y)], px = ox + x * cell, py = oy + y * cell;
      var hv = hover === idx(x, y) && !c.open && run;
      if(c.open){
        c2.fillStyle = c.m ? 'rgba(255,92,77,.22)' : 'rgba(228,232,234,.035)';
        c2.fillRect(px + 1, py + 1, cell - 2, cell - 2);
        c2.strokeStyle = c.m ? 'rgba(255,92,77,.6)' : 'rgba(228,232,234,.08)';
        c2.lineWidth = 1;
        c2.strokeRect(px + 1, py + 1, cell - 2, cell - 2);
        if(c.m){
          /* la machine infectée : un carré rouge qui pulse */
          var pu = .55 + .45 * Math.sin(t * 5);
          c2.fillStyle = 'rgba(255,92,77,' + pu.toFixed(2) + ')';
          c2.fillRect(px + cell * .3, py + cell * .3, cell * .4, cell * .4);
        }else if(c.n){
          c2.fillStyle = NCOL[c.n];
          var tx = String(c.n);
          c2.fillText(tx, px + cell * .5 - c2.measureText(tx).width * .5, py + cell * .55);
        }
      }else{
        /* la machine encore à analyser : une façade de serveur */
        c2.fillStyle = hv ? 'rgba(4,139,154,.2)' : 'rgba(4,139,154,.09)';
        c2.fillRect(px + 1, py + 1, cell - 2, cell - 2);
        c2.strokeStyle = hv ? '#5FD3E3' : 'rgba(4,139,154,.35)';
        c2.lineWidth = 1;
        c2.strokeRect(px + 1, py + 1, cell - 2, cell - 2);
        c2.fillStyle = 'rgba(4,139,154,.45)';
        for(var d = 0; d < 3; d++) c2.fillRect(px + cell * .22 + d * cell * .18, py + cell * .42, cell * .1, cell * .14);
        if(c.flag){
          c2.strokeStyle = '#F5A524'; c2.lineWidth = 1.6;
          c2.beginPath();
          c2.moveTo(px + cell * .35, py + cell * .74); c2.lineTo(px + cell * .35, py + cell * .24);
          c2.lineTo(px + cell * .68, py + cell * .36); c2.lineTo(px + cell * .35, py + cell * .47);
          c2.stroke();
        }
      }
    }
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    c2.fillText(CW + ' × ' + CH + ' machines · ' + MINES + ' compromises', ox, oy - 8);
    if(!run && (won || lost)){
      c2.fillStyle = 'rgba(7,9,11,.5)'; c2.fillRect(0, 0, W, H);
      c2.font = '600 12px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = won ? '#50C878' : '#FF5C4D';
      var m1 = won ? 'PARC ASSAINI' : 'MACHINE COMPROMISE OUVERTE';
      c2.fillText(m1, W * .5 - c2.measureText(m1).width * .5, H * .5);
    }
  }
  function at(e){
    var r = cv.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left - ox) / cell), y = Math.floor((e.clientY - r.top - oy) / cell);
    if(x < 0 || y < 0 || x >= CW || y >= CH) return null;
    return [x, y];
  }
  cv.addEventListener('pointermove', function(e){
    var p = at(e);
    hover = p ? idx(p[0], p[1]) : -1;
    cv.style.cursor = p && run ? 'pointer' : 'crosshair';
  }, {passive:true});
  cv.addEventListener('pointerleave', function(){ hover = -1; });
  /* l'appui long ne doit ouvrir ni la loupe ni le menu de l'image sur iPhone */
  cv.style.webkitTouchCallout = 'none'; cv.style.webkitUserSelect = 'none'; cv.style.userSelect = 'none';
  /* mouvement figé : aucune boucle ne repeint la grille, le jeu paraissait
     mort au premier appui. On repeint sur le geste, sans rien animer. */
  function peint(){ if(RM) draw(0); }
  var hold = null, held = false, doigt = false;
  function drapeau(p){
    var c = G2[idx(p[0], p[1])];
    if(c.open) return;
    c.flag = c.flag ? 0 : 1;
    flags += c.flag ? 1 : -1;
    if(flagsEl) flagsEl.textContent = flags + ' / ' + MINES;
    peint();
  }
  cv.addEventListener('pointerdown', function(e){
    doigt = e.pointerType !== 'mouse';
    /* le clic droit passait aussi par ici, et sous Windows le menu contextuel
       n'arrive qu'après le relâchement : la case visée était OUVERTE avant
       d'être marquée. Seul le bouton principal ouvre. */
    if(!run || (e.pointerType === 'mouse' && e.button !== 0)) return;
    held = false;
    var p = at(e);
    if(!p) return;
    hold = setTimeout(function(){ hold = null; held = true; drapeau(p); }, 320);
  });
  cv.addEventListener('pointerup', function(e){
    if(hold){ clearTimeout(hold); hold = null; }
    if(!run || held || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var p = at(e);
    if(p){ open(p[0], p[1]); peint(); }
  });
  cv.addEventListener('pointercancel', function(){ if(hold){ clearTimeout(hold); hold = null; } });
  cv.addEventListener('contextmenu', function(e){
    e.preventDefault();
    /* au doigt, l'appui long a déjà marqué la case : Android envoie ensuite
       ce même menu, qui la démarquait aussitôt */
    if(!run || doigt) return;
    var p = at(e);
    if(p) drapeau(p);
  });
  startBtn.addEventListener('click', function(){ layout(); gen(); peint(); });
  layout(); gen(true); run = false; draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){ if(!api.vis) return; draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 10 — INVENTAIRE DU PARC : retrouver les paires */
  var cv = qs('[data-g10]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var pairsEl = qs('[data-g10-pairs]'), movesEl = qs('[data-g10-moves]');
  var startBtn = qs('[data-g10-start]'), hint = qs('[data-g10-hint]');
  var DPR2 = CDPR(), W = 0, H = 0, cw = 60, ch = 46, ox = 0, oy = 0;
  var COLS = 4, ROWS = 4;
  var NAMES = ['SW-CORE', 'SW-ACC', 'FW-01', 'ESX-01', 'SAN-01', 'BKP-01', 'UPS-A', 'AP-WIFI'];
  var cards = [], open = [], pairs = 0, moves = 0, run = false, lock = 0, hover = -1;
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
    cw = (W - 20 - (COLS - 1) * 6) / COLS;
    ch = (H - 26 - (ROWS - 1) * 6) / ROWS;
    ox = (W - (cw * COLS + (COLS - 1) * 6)) * .5;
    oy = (H - (ch * ROWS + (ROWS - 1) * 6)) * .5 + 4;
  }
  function box(i){
    var c = i % COLS, r = Math.floor(i / COLS);
    return { x: ox + c * (cw + 6), y: oy + r * (ch + 6), w: cw, h: ch };
  }
  function gen(boot){
    var deck = [];
    for(var i = 0; i < 8; i++){ deck.push(i); deck.push(i); }
    for(var j = deck.length - 1; j > 0; j--){
      var k = (Math.random() * (j + 1)) | 0;
      var tmp = deck[j]; deck[j] = deck[k]; deck[k] = tmp;
    }
    cards = deck.map(function(v){ return { v: v, up: 0, done: 0, a: 0 }; });
    open = []; pairs = 0; moves = 0; run = true; lock = 0;
    if(pairsEl) pairsEl.textContent = '0 / 8';
    if(movesEl) vif(movesEl, function(){ return TR('# coup').replace('#', '0'); });
    /* au chargement le jeu n'est qu'un décor : le bouton garde son « JOUER »
       et la consigne entière du gabarit reste affichée */
    if(boot) return;
    if(hint) vif(hint, function(){ return TR('retournez deux cartes'); });
    setTR(marque(startBtn), 'RECOMMENCER');
  }
  function flip(i){
    if(!run || lock > 0) return;
    SFX.clic();
    var c = cards[i];
    if(!c || c.up || c.done) return;
    c.up = 1;
    open.push(i);
    if(open.length === 2){
      moves++;
      if(movesEl) vif(movesEl, function(){ return TR(moves > 1 ? '# coups' : '# coup').replace('#', moves); });
      var a = cards[open[0]], b = cards[open[1]];
      if(a.v === b.v){
        a.done = b.done = 1;
        /* la paire trouvée et la paire ratée n'avaient que le clic pour toute
           réponse : deux timbres distincts disent le résultat sans rien lire */
        SFX.ok();
        pairs++;
        if(pairsEl) pairsEl.textContent = pairs + ' / 8';
        open = [];
        if(pairs === 8){
          run = false;
          SFX.gagne();
          setTR(marque(startBtn), 'REJOUER');
          if(hint) vif(hint, function(){ return TR('inventaire complet en # coups').replace('#', moves); });
          TROPHY.win('g10');
        }
      }else{
        SFX.bad(); lock = .85;
        /* mouvement figé : pas de boucle pour décompter le temps de lecture,
           c'est un minuteur qui retourne la paire ratée */
        if(RM) setTimeout(function(){
          if(open.length === 2){ cards[open[0]].up = 0; cards[open[1]].up = 0; }
          open = []; lock = 0; peint();
        }, 850);
      }
    }
    peint();
  }
  /* mouvement figé : aucune boucle ne repeint, la carte retournée ne se
     montrait jamais. On repeint sur le geste, la face d'un coup. */
  function peint(){ if(RM) draw(0, 1); }
  function draw(t, dt){
    if(lock > 0 && !RM){
      lock -= dt || .016;
      if(lock <= 0){
        cards[open[0]].up = 0; cards[open[1]].up = 0;
        open = []; lock = 0;
      }
    }
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    for(var i = 0; i < cards.length; i++){
      var c = cards[i], b = box(i), face = c.up || c.done;
      c.a = damp(c.a, face ? 1 : 0, 12, dt || .016);
      var hv = hover === i && run && !face;
      /* la carte : dos strié, face avec le nom de l'équipement */
      c2.fillStyle = face ? (c.done ? 'rgba(80,200,120,.12)' : 'rgba(4,139,154,.16)') : (hv ? 'rgba(4,139,154,.14)' : 'rgba(228,232,234,.035)');
      c2.fillRect(b.x, b.y, b.w, b.h);
      c2.strokeStyle = c.done ? 'rgba(80,200,120,.7)' : (face ? '#048B9A' : (hv ? '#5FD3E3' : 'rgba(228,232,234,.12)'));
      c2.lineWidth = 1;
      c2.strokeRect(b.x, b.y, b.w, b.h);
      if(c.a < .5){
        /* dos : une façade de baie */
        c2.strokeStyle = 'rgba(4,139,154,.22)';
        for(var l = 1; l < 4; l++){
          c2.beginPath();
          c2.moveTo(b.x + 6, b.y + l * b.h / 4); c2.lineTo(b.x + b.w - 6, b.y + l * b.h / 4);
          c2.stroke();
        }
      }else{
        c2.font = Math.max(8, Math.min(10, b.w * .16)).toFixed(0) + 'px "IBM Plex Mono", ui-monospace, monospace';
        c2.fillStyle = c.done ? '#50C878' : '#E4E8EA';
        var tx = NAMES[c.v];
        c2.fillText(tx, b.x + b.w * .5 - c2.measureText(tx).width * .5, b.y + b.h * .5);
        if(c.done){
          c2.strokeStyle = '#50C878'; c2.lineWidth = 1.5;
          c2.beginPath();
          c2.moveTo(b.x + b.w - 18, b.y + 10); c2.lineTo(b.x + b.w - 14, b.y + 14); c2.lineTo(b.x + b.w - 8, b.y + 6);
          c2.stroke();
        }
      }
    }
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    c2.fillText('16 cartes · 8 équipements', ox, oy - 8);
  }
  function at(e){
    var r = cv.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    for(var i = 0; i < cards.length; i++){
      var b = box(i);
      if(x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return i;
    }
    return -1;
  }
  cv.addEventListener('pointermove', function(e){
    hover = at(e);
    cv.style.cursor = hover >= 0 && run ? 'pointer' : 'crosshair';
  }, {passive:true});
  cv.addEventListener('pointerleave', function(){ hover = -1; });
  cv.addEventListener('pointerdown', function(e){
    var i = at(e);
    if(i >= 0) flip(i);
  });
  startBtn.addEventListener('click', function(){ layout(); gen(); peint(); });
  layout(); gen(true); run = false; draw(0, .016);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0, .016); }).observe(cv);
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){ if(!api.vis) return; draw(t, dt); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 11 — RÉFLEXE : couper le lien dès l'alerte */
  var cv = qs('[data-g11]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var msEl = qs('[data-g11-ms]'), bestEl = qs('[data-g11-best]');
  var startBtn = qs('[data-g11-start]'), hint = qs('[data-g11-hint]');
  var DPR2 = CDPR(), W = 0, H = 0;
  var state = 'idle', wait = 0, t0 = 0, last = 0, best = 0, tries = 0, sum = 0, ph = 0;
  try{ best = parseInt(localStorage.getItem('ad2026.g11.best'), 10) || 0; }catch(e){}
  if(bestEl && best) vif(bestEl, function(){ return TR('record ') + best + ' ms'; });
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
  }
  /* L'alerte partait du décompte tenu par la boucle de rendu. Cette boucle
     n'existe pas quand le visiteur a demandé « aucun mouvement » : la manche
     restait bloquée sur « attendez », le voyant ne passait jamais au rouge et
     rien ne pouvait se terminer. Le passage au rouge a donc son propre point
     d'entrée, appelé soit par la boucle, soit par un minuteur. */
  var lent = false, armAt = 0, armT = null;
  function stopT(){ if(armT){ clearTimeout(armT); armT = null; } }
  function alerte(){
    stopT();
    state = 'go'; t0 = performance.now();
    if(hint) vif(hint, function(){ return TR('coupez !'); });
    draw();
  }
  function arm(){
    stopT();
    state = 'wait'; lent = false; wait = .9 + Math.random() * 2.6;
    armAt = performance.now();
    if(hint) vif(hint, function(){ return TR('attendez le rouge…'); });
    if(msEl) msEl.textContent = '— ms';
    if(startBtn) setTR(marque(startBtn), 'EN COURS');
    /* la remise en page vient d'effacer la toile et seule la boucle la
       repeignait : entre les deux le cadre restait vide */
    draw();
    if(RM) armT = setTimeout(alerte, wait * 1000);
  }
  function fire(){
    if(state === 'wait'){
      state = 'early';
      if(hint) vif(hint, function(){ return TR('trop tôt — c\'est un faux positif'); });
      setTR(marque(startBtn), 'REESSAYER');
      return;
    }
    if(state === 'go'){
      last = Math.round((performance.now() - t0));
      tries++; sum += last;
      if(msEl) msEl.textContent = last + ' ms';
      if(!best || last < best){
        best = last;
        try{ localStorage.setItem('ad2026.g11.best', String(best)); }catch(e){}
        if(bestEl) vif(bestEl, function(){ return TR('record ') + best + ' ms'; });
      }
      state = 'done';
      if(hint) vif(hint, function(){ return TR('# ms · moyenne # ms sur #')
        .replace('#', last).replace('#', Math.round(sum / tries)).replace('#', tries); });
      setTR(marque(startBtn), 'RELANCER');
      if(tries >= 3 && sum / tries < 420) TROPHY.win('g11');
      return;
    }
    arm();
  }
  function step(dt){
    ph += dt;
    if(state === 'wait'){
      wait -= dt;
      if(wait <= 0){ state = 'go'; t0 = performance.now(); if(hint) vif(hint, function(){ return TR('coupez !'); }); }
    }
  }
  function draw(){
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    var cx = W * .5, cy = H * .48;
    var red = state === 'go', bad = state === 'early';
    /* le lien : deux nœuds et un câble */
    var col = red ? '#FF5C4D' : bad ? '#F5A524' : (state === 'done' ? '#50C878' : 'rgba(124,135,145,.5)');
    c2.strokeStyle = col; c2.lineWidth = red ? 3 : 2;
    c2.beginPath(); c2.moveTo(cx - 86, cy); c2.lineTo(cx + 86, cy); c2.stroke();
    /* un tableau et une fermeture alloués à chaque image, pour deux nœuds */
    for(var nd = 0; nd < 2; nd++){
      var dx = nd ? 86 : -86;
      c2.fillStyle = 'rgba(11,14,17,.95)';
      c2.strokeStyle = col; c2.lineWidth = 1.6;
      c2.beginPath(); c2.arc(cx + dx, cy, 15, 0, 6.2832); c2.fill(); c2.stroke();
      c2.fillStyle = col;
      c2.fillRect(cx + dx - 6, cy - 3, 12, 6);
    }
    /* le voyant, au centre */
    var rr = red ? 30 + Math.sin(ph * 22) * 3 : 24;
    c2.fillStyle = red ? 'rgba(255,92,77,.22)' : bad ? 'rgba(245,165,36,.16)' : 'rgba(4,139,154,.1)';
    c2.beginPath(); c2.arc(cx, cy, rr + 12, 0, 6.2832); c2.fill();
    c2.fillStyle = red ? '#FF5C4D' : bad ? '#F5A524' : (state === 'done' ? '#50C878' : '#1b242b');
    c2.beginPath(); c2.arc(cx, cy, rr, 0, 6.2832); c2.fill();
    c2.strokeStyle = 'rgba(228,232,234,.2)'; c2.lineWidth = 1.4;
    c2.beginPath(); c2.arc(cx, cy, rr, 0, 6.2832); c2.stroke();
    c2.font = '600 11px "IBM Plex Mono", ui-monospace, monospace';
    var m1 = red ? 'COUPEZ' : bad ? 'TROP TÔT' : state === 'done' ? last + ' MS' : state === 'wait' ? 'ATTENDEZ' : 'PRÊT';
    c2.fillStyle = red || bad ? '#07090B' : (state === 'done' ? '#07090B' : '#7C8791');
    c2.fillText(m1, cx - c2.measureText(m1).width * .5, cy);
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    c2.fillText('temps de réaction sur alerte', 10, 13);
    if(tries){
      var mm = 'essais ' + tries + ' · moyenne ' + Math.round(sum / tries) + ' ms';
      c2.fillText(mm, W - 10 - c2.measureText(mm).width, H - 11);
    }
  }
  cv.addEventListener('pointerdown', function(e){ e.preventDefault(); fire(); });
  startBtn.addEventListener('click', function(){ layout(); arm(); });
  layout(); draw();
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(); }).observe(cv);
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt){ if(!api.vis) return; step(dt); draw(); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 12 — SÉQUENCE DE DÉMARRAGE : reproduire l'ordre d'allumage */
  var cv = qs('[data-g12]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var lvlEl = qs('[data-g12-lvl]'), bestEl = qs('[data-g12-best]');
  var startBtn = qs('[data-g12-start]'), hint = qs('[data-g12-hint]');
  var DPR2 = CDPR(), W = 0, H = 0;
  var NAMES = ['ONDULEUR', 'CŒUR RÉSEAU', 'STOCKAGE', 'HYPERVISEUR', 'SAUVEGARDE', 'PARE-FEU'];
  var COLS = ['#50C878', '#048B9A', '#4169E1', '#4169E1', '#F5A524', '#FF5C4D'];
  var seq = [], input = [], lvl = 0, best = 0, showing = -1, showT = 0, state = 'idle', flash = -1, flashT = 0;
  /* la case fautive et celle qu'il fallait : après l'échec, l'écran ne disait
     pas où l'ordre avait rompu. sonne retient le pas déjà entendu, waitT tient
     le minuteur d'enchaînement, qui courait sans qu'on puisse l'arrêter. */
  var faute = -1, attendu = -1, sonne = -1, waitT = null;
  /* Le pas de défilement se resserre avec le palier : à douze équipements la
     séquence demandait plus de sept secondes de contemplation. Le temps
     allumé ne vaut que les deux tiers du pas — c'est le tiers éteint qui rend
     lisible le même équipement tiré deux fois de suite, sinon les deux
     impulsions n'en formaient qu'une et la partie se perdait sans rien
     montrer, ce que le tirage produit une fois sur six. */
  function pas(){ return Math.max(.34, .66 - lvl * .022); }
  try{ best = parseInt(localStorage.getItem('ad2026.g12.best'), 10) || 0; }catch(e){}
  if(bestEl) vif(bestEl, function(){ return TR('record ') + best; });
  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
  }
  function box(i){
    var cols = 3, rows = 2;
    var bw = (W - 22 - (cols - 1) * 7) / cols, bh = (H - 44 - (rows - 1) * 7) / rows;
    return { x: 11 + (i % cols) * (bw + 7), y: 26 + Math.floor(i / cols) * (bh + 7), w: bw, h: bh };
  }
  function next(){
    lvl++;
    seq.push((Math.random() * 6) | 0);
    input = [];
    if(lvlEl) vif(lvlEl, function(){ return TR('palier #').replace('#', lvl); });
    state = 'show'; showing = 0; showT = 0;
    if(hint) vif(hint, function(){ return TR('regardez la séquence…'); });
    if(relance) relance();
  }
  function reset(){
    seq = []; input = []; lvl = 0;
    setTR(marque(startBtn), 'EN COURS');
    next();
  }
  function fail(){
    state = 'idle';
    if(lvl - 1 > best){ best = lvl - 1; try{ localStorage.setItem('ad2026.g12.best', String(best)); }catch(e){} }
    if(bestEl) vif(bestEl, function(){ return TR('record ') + best; });
    if(hint) vif(hint, function(){ return TR('ordre rompu au palier # — l\'onduleur passe toujours en premier')
      .replace('#', lvl); });
    setTR(marque(startBtn), 'REJOUER');
  }
  function tap(i){
    if(state !== 'play') return;
    SFX.note(i);
    flash = i; flashT = .32;
    if(relance) relance();
    input.push(i);
    if(seq[input.length - 1] !== i){ fail(); return; }
    if(input.length === seq.length){
      if(lvl >= 5) TROPHY.win('g12');
      if(hint) vif(hint, function(){ return TR('palier # réussi').replace('#', lvl); });
      state = 'wait';
      setTimeout(function(){ if(state === 'wait') next(); }, 700);
    }
  }
  function step(dt){
    if(flashT > 0) flashT -= dt;
    if(state !== 'show') return;
    /* la démonstration était muette : la couleur portait seule la séquence, et
       elle ne suffit pas sur un écran de téléphone. Une note par pas, la même
       qu'à l'appui — c'est aussi ce qui rend deux fois le même équipement
       audible comme deux impulsions. */
    if(sonne !== showing){ sonne = showing; SFX.note(seq[showing]); }
    showT += dt;
    if(showT > pas()){
      showT = 0; showing++;
      if(showing >= seq.length){
        showing = -1; state = 'play';
        if(hint) vif(hint, function(){ return TR('à vous — reproduisez l\'ordre'); });
      }
    }
  }
  function draw(t){
    c2.fillStyle = '#0A0D10'; c2.fillRect(0, 0, W, H);
    c2.font = '9px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    c2.fillText('ordre de remise en service', 11, 13);
    var st = state === 'show' ? 'séquence' : state === 'play' ? 'à vous' : '';
    if(st) c2.fillText(st, W - 11 - c2.measureText(st).width, 13);
    for(var i = 0; i < 6; i++){
      var b = box(i);
      var lit = (state === 'show' && seq[showing] === i) || (flash === i && flashT > 0);
      c2.fillStyle = lit ? COLS[i] : 'rgba(228,232,234,.035)';
      c2.globalAlpha = lit ? .28 : 1;
      c2.fillRect(b.x, b.y, b.w, b.h);
      c2.globalAlpha = 1;
      c2.strokeStyle = lit ? COLS[i] : 'rgba(228,232,234,.14)';
      c2.lineWidth = lit ? 2 : 1;
      c2.strokeRect(b.x, b.y, b.w, b.h);
      c2.fillStyle = lit ? COLS[i] : 'rgba(124,135,145,.75)';
      c2.fillRect(b.x, b.y, 3, b.h);
      c2.font = (b.w > 96 ? 9.5 : 8) + 'px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = lit ? '#E4E8EA' : 'rgba(198,206,212,.7)';
      var tx = NAMES[i];
      c2.fillText(tx, b.x + 9, b.y + b.h * .5);
    }
    /* la file d'attente : ce qu'on a déjà entré */
    for(var k = 0; k < seq.length; k++){
      var done = k < input.length;
      c2.fillStyle = done ? COLS[input[k]] : 'rgba(228,232,234,.12)';
      c2.fillRect(11 + k * 9, H - 13, 6, 4);
    }
  }
  cv.addEventListener('pointerdown', function(e){
    var r = cv.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    for(var i = 0; i < 6; i++){
      var b = box(i);
      if(x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h){ tap(i); return; }
    }
  });
  startBtn.addEventListener('click', function(){ layout(); reset(); });
  layout(); draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  /* figé : la séquence ne s'affichait jamais, il n'y avait rien à reproduire.
     La boucle vit tant que la manche est en cours, ou qu'une touche brille. */
  var relance = boucleFigee(function(dt, t){ step(dt); draw(t); },
    function(){ return state !== 'idle' || flashT > 0; });
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){ if(!api.vis) return; step(dt); draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .25 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
try{
(function(){ /* JEU 13 — TERMINAL : équipe rouge contre équipe bleue
     Le balisage existait sans code : la carte restait blanche et le terminal
     muet. Douze tours, de vraies commandes, une machine à défendre. */
  var cv = qs('[data-g13]'); if(!cv) return;
  var c2 = cv.getContext('2d'); if(!c2) return;
  var logEl = qs('[data-g13-log]'), form = qs('[data-g13-form]'), inp = qs('[data-g13-in]');
  var turnEl = qs('[data-g13-turn]'), sideEl = qs('[data-g13-side]'), scoreEl = qs('[data-g13-score]');
  var startBtn = qs('[data-g13-start]'), swapBtn = qs('[data-g13-swap]'), hintEl = qs('[data-g13-hint]');
  var DPR2 = CDPR(), W = 0, H = 0;

  /* le réseau : la base de données est l'objectif des deux camps */
  var NET = [
    { id: 'fw-edge',  x: .16, y: .22, nom: 'PARE-FEU' },
    { id: 'sw-core',  x: .5,  y: .3,  nom: 'CŒUR RÉSEAU' },
    { id: 'web-01',   x: .84, y: .18, nom: 'SERVEUR WEB' },
    { id: 'poste-12', x: .16, y: .74, nom: 'POSTE 12' },
    { id: 'nas-01',   x: .5,  y: .82, nom: 'STOCKAGE' },
    { id: 'db-01',    x: .84, y: .66, nom: 'BASE DE DONNÉES' }
  ];
  var LIENS = [[0,1],[1,2],[1,4],[3,1],[4,5],[2,5]];
  var CIBLE = 'db-01';
  var G = { tour: 1, max: 12, camp: 'rouge', score: 0, fini: false, sel: -1, pulse: 0 };
  var ST = {};
  function reset(camp){
    G.tour = 1; G.score = 0; G.fini = false; G.sel = -1;
    if(camp) G.camp = camp;
    ST = {};
    /* « fige » : une machine que l'exploitation a réclamée ne se recoupe plus.
       Sans cela, la défense gagnait en débranchant le même poste douze fois. */
    NET.forEach(function(n){ ST[n.id] = { vu: false, faille: null, pris: false, isole: false, patche: false, bruit: 0, fige: false }; });
    if(inp) inp.value = '';   /* la commande de la partie précédente restait dans le champ */
    /* une faille par machine, connue de personne au départ */
    var F = ['mot de passe par défaut', 'greffon non corrigé', 'partage ouvert', 'session laissée ouverte', 'micrologiciel ancien', 'port d\'administration exposé'];
    NET.forEach(function(n, i){ ST[n.id].faille = F[i % F.length]; });
    if(logEl) logEl.innerHTML = '';
    ligne(G.camp === 'rouge'
      ? 'Vous jouez l\'attaque. Objectif : prendre la base de données en douze tours.'
      : 'Vous jouez la défense. Objectif : garder la base de données douze tours.', '#5FD3E3');
    ligne('Tapez help pour la liste des commandes.', '#56606A');
    paintHud();
    verbes();
  }
  /* LES VERBES À PORTÉE DE DOIGT. Au téléphone, il fallait taper
     « exploit poste-12 » au clavier virtuel pour chacun des douze tours, et la
     bande prévue sous la carte restait vide. On touche une machine sur la
     carte, puis un verbe — le champ reste là pour qui préfère taper. Seuls les
     verbes du camp joué sont proposés. */
  var helpEl = qs('[data-g13-help]');
  var VERBES = { rouge: ['scan', 'exploit', 'logs', 'status'], bleu: ['scan', 'patch', 'isolate', 'logs', 'status'] };
  var VCOL = { scan: '#5FD3E3', logs: '#5FD3E3', status: '#5FD3E3', exploit: '#FF5C4D', patch: '#4169E1', isolate: '#4169E1' };
  var VBRD = { '#5FD3E3': 'rgba(95,211,227,.4)', '#FF5C4D': 'rgba(255,92,77,.45)', '#4169E1': 'rgba(65,105,225,.55)' };
  function verbes(){
    if(!helpEl) return;
    helpEl.innerHTML = '';
    helpEl.style.display = 'flex'; helpEl.style.flexWrap = 'wrap'; helpEl.style.gap = '6px';
    (VERBES[G.camp] || VERBES.rouge).forEach(function(v){
      var b = doc.createElement('button');
      b.type = 'button';
      b.textContent = v;
      b.setAttribute('data-i18n-skip', '1');   /* une commande ne se traduit pas */
      b.style.cssText = 'background:none;border:1px solid ' + VBRD[VCOL[v]] + ';color:' + VCOL[v] + ';' +
        "font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.06em;" +
        'padding:0 13px;min-height:44px;cursor:pointer;touch-action:manipulation';
      b.addEventListener('click', function(){ verbe(v); });
      helpEl.appendChild(b);
    });
  }
  function verbe(v){
    if(G.fini || v === 'status' || v === 'help'){ jouer(v); peint(); return; }
    if(G.sel < 0){ ligne('Touchez d\'abord une machine sur la carte.', '#F5A524'); return; }
    jouer(v + ' ' + NET[G.sel].id);
    /* le champ gardait « scan web-01 » après un « patch » joué au doigt :
       ENTRÉE aurait rejoué autre chose que ce qu'on venait de faire */
    if(inp) inp.value = '';
    peint();
  }
  function paintHud(){
    if(turnEl) vif(turnEl, function(){ return TR('tour # / #').replace('#', G.tour).replace('#', G.max); });
    if(sideEl){
      vif(sideEl, function(){ return TR(G.camp === 'rouge' ? 'rôle : attaque' : 'rôle : défense'); });
      sideEl.style.color = G.camp === 'rouge' ? '#FF5C4D' : '#4169E1';
    }
    if(scoreEl) scoreEl.textContent = String(G.score);
  }
  /* Une ligne du journal. Les phrases qui portent un nom de machine étaient
     assemblées en français AVANT la traduction : « scan poste-12 → faille :
     session laissée ouverte » ne correspondait à aucune clé, et la partie se
     jouait en français dans les sept autres langues — alors que chaque
     morceau (« → faille : », « session laissée ouverte »…) est dans la table.
     Une ligne est donc une suite de morceaux : une chaîne se traduit, r(x)
     passe tel quel (nom de machine, nombre, commande tapée). */
  function r(x){ return { r: String(x) }; }
  function rend(parts){
    if(typeof parts === 'string') return TRn(parts);
    var o = '';
    for(var i = 0; i < parts.length; i++){
      var q = parts[i];
      o += typeof q === 'string' ? TR(q) : (typeof q === 'function' ? q() : q.r);
    }
    return o;
  }
  function ligne(txt, col){
    if(!logEl) return;
    var d = doc.createElement('div');
    d.style.cssText = 'margin-bottom:5px;color:' + (col || '#7C8791') + ';word-break:break-word';
    vif(d, function(){ return rend(txt); });
    logEl.appendChild(d);
    while(logEl.childNodes.length > 90) logEl.removeChild(logEl.firstChild);
    logEl.scrollTop = logEl.scrollHeight;
  }
  /* la version d'une phrase gravée pour db-01 vaut pour toutes les machines :
     on la traduit, puis on remet le bon nom */
  function pourDb(fr, id){ return function(){ return TR(fr).split('db-01').join(id); }; }
  function trouve(nom){
    if(!nom) return null;
    nom = nom.toLowerCase().trim();
    for(var i = 0; i < NET.length; i++) if(NET[i].id === nom) return NET[i];
    for(var j = 0; j < NET.length; j++) if(NET[j].id.indexOf(nom) === 0) return NET[j];
    return null;
  }
  function voisins(id){
    var out = [], k = NET.map(function(n){ return n.id; }).indexOf(id);
    LIENS.forEach(function(l){
      if(l[0] === k) out.push(NET[l[1]].id);
      if(l[1] === k) out.push(NET[l[0]].id);
    });
    return out;
  }
  /* l'attaque ne peut sauter que depuis une machine déjà prise, ou depuis
     le poste de travail — c'est le point d'entrée habituel */
  function atteignable(id){
    if(id === 'poste-12') return true;
    var v = voisins(id);
    for(var i = 0; i < v.length; i++) if(ST[v[i]].pris) return true;
    return false;
  }

  var CMD = {
    help: function(){
      ligne('scan <machine>    — relève les failles et les voisins', '#5FD3E3');
      ligne('exploit <machine> — tente la prise (attaque)', '#FF5C4D');
      ligne('patch <machine>   — corrige la faille (défense)', '#4169E1');
      ligne('isolate <machine> — coupe la machine du réseau (défense)', '#4169E1');
      ligne('logs <machine>    — lit les traces laissées', '#5FD3E3');
      ligne('status            — état du parc', '#5FD3E3');
      ligne(['Machines :', r(' ' + NET.map(function(n){ return n.id; }).join(', '))], '#56606A');
      return false;   /* la lecture d'aide ne consomme pas de tour */
    },
    status: function(){
      NET.forEach(function(n){
        var s = ST[n.id], et = [];
        if(s.pris) et.push('COMPROMISE');
        if(s.isole) et.push('isolée');
        if(s.patche) et.push('corrigée');
        if(!et.length) et.push('saine');
        ligne([r(n.id + ' — '), function(){ return et.map(TR).join(', '); }].concat(s.vu ? [r(' '), '· faille :', r(' '), s.faille] : []),
          s.pris ? '#FF5C4D' : (s.patche ? '#50C878' : '#7C8791'));
      });
      return false;
    },
    scan: function(n){
      if(!n) return ligne('scan : indiquez une machine.', '#F5A524'), false;
      var s = ST[n.id];
      /* relire deux fois la même machine n'apprend rien et rapportait pourtant
         des points à chaque fois : le score gonflait tout seul */
      if(!s.vu) G.score += 2;
      s.vu = true; s.bruit += G.camp === 'rouge' ? 2 : 0;
      ligne([r('scan ' + n.id + ' '), '→ faille :', r(' '), s.faille], '#5FD3E3');
      ligne([r('  '), 'voisins :', r(' ' + voisins(n.id).join(', '))], '#56606A');
      return true;
    },
    logs: function(n){
      if(!n) return ligne('logs : indiquez une machine.', '#F5A524'), false;
      var s = ST[n.id];
      ligne([r('logs ' + n.id + ' → ')].concat(s.bruit > 3 ? [r(s.bruit + ' '), 'tentatives relevées']
        : s.bruit > 0 ? ['trace faible (', r(s.bruit + ')')] : ['rien à signaler']),
        s.bruit > 3 ? '#F5A524' : '#7C8791');
      return true;
    },
    exploit: function(n){
      if(G.camp !== 'rouge') return ligne('exploit : réservé à l\'attaque.', '#F5A524'), false;
      if(!n) return ligne('exploit : indiquez une machine.', '#F5A524'), false;
      var s = ST[n.id];
      if(s.pris) return ligne([r(n.id + ' '), 'est déjà à vous.'], '#7C8791'), false;
      if(s.isole) return ligne([r(n.id + ' '), 'est coupée du réseau : injoignable.'], '#F5A524'), true;
      if(!s.vu) return ligne(['Vous ne connaissez pas encore sa faille. scan', r(' ' + n.id + ' '), 'd\'abord.'], '#F5A524'), false;
      if(!atteignable(n.id)) return ligne([r(n.id + ' '), 'n\'est voisine d\'aucune machine que vous tenez.'], '#F5A524'), true;
      if(s.patche){
        /* Un correctif fermait la partie sans le dire : deux scans sur la même
           machine suffisaient à la faire corriger par la défense, et la cible
           devenait inatteignable pour les dix tours restants. La tentative use
           le tour, elle n'est plus perdue d'avance. */
        if(Math.random() < .4){ s.patche = false; s.bruit += 2; return ligne([pourDb('db-01 : le correctif est contourné, la faille se rouvre.', n.id)], '#F5A524'), true; }
        return ligne([r(n.id + ' '), 'a été corrigée : la faille ne répond plus.'], '#4169E1'), true;
      }
      s.pris = true; s.bruit += 4;
      G.score += n.id === CIBLE ? 40 : 12;
      ligne([r('exploit ' + n.id + ' '), '→ accès obtenu.'], '#FF5C4D');
      if(n.id === CIBLE) fin(true);
      return true;
    },
    patch: function(n){
      if(G.camp !== 'bleu') return ligne('patch : réservé à la défense.', '#F5A524'), false;
      if(!n) return ligne('patch : indiquez une machine.', '#F5A524'), false;
      var s = ST[n.id];
      if(s.patche) return ligne([r(n.id + ' '), 'est déjà corrigée.'], '#7C8791'), false;
      s.patche = true;
      if(s.pris && Math.random() < .6){ s.pris = false; ligne(['L\'accès en place sur', r(' ' + n.id + ' '), 'est tombé avec le correctif.'], '#50C878'); }
      G.score += 10;
      ligne([r('patch ' + n.id + ' '), '→ faille refermée.'], '#50C878');
      return true;
    },
    isolate: function(n){
      if(G.camp !== 'bleu') return ligne('isolate : réservé à la défense.', '#F5A524'), false;
      if(!n) return ligne('isolate : indiquez une machine.', '#F5A524'), false;
      var s = ST[n.id];
      s.isole = !s.isole;
      G.score += s.isole ? 6 : 0;
      ligne([r('isolate ' + n.id + ' → '), s.isole ? 'coupée du réseau' : 'remise en service'], '#4169E1');
      return true;
    }
  };

  /* le camp adverse joue : simple, mais il vise juste */
  function adverse(){
    if(G.camp === 'rouge'){
      /* la défense corrige ce qui est bruyant, isole ce qui est pris */
      var pris = NET.filter(function(n){ return ST[n.id].pris && !ST[n.id].isole; });
      if(pris.length && Math.random() < .55){
        var v = pris[(Math.random() * pris.length) | 0];
        ST[v.id].isole = true;
        ligne(['· la défense isole', r(' ' + v.id)], '#4169E1');
        return;
      }
      var chaud = NET.filter(function(n){ return ST[n.id].bruit > 2 && !ST[n.id].patche; });
      if(chaud.length){
        var w = chaud[(Math.random() * chaud.length) | 0];
        ST[w.id].patche = true;
        ligne(['· la défense corrige', r(' ' + w.id)], '#4169E1');
      }else ligne('· la défense relit ses journaux', '#39424A');
    }else{
      /* l'attaque progresse de voisin en voisin vers la base */
      var cand = NET.filter(function(n){
        var s = ST[n.id];
        return !s.pris && !s.isole && !s.patche && atteignable(n.id);
      });
      if(!cand.length){
        /* Corriger ou couper la base au premier tour suffisait à gagner sans
           plus rien faire des onze tours suivants. Une machine débranchée est
           une machine en panne : l'exploitation la réclame, et l'attaque finit
           par contourner un correctif. La défense doit tenir tout le parc. */
        var coupe = NET.filter(function(n){ return ST[n.id].isole && !ST[n.id].pris; });
        if(coupe.length){
          var q = coupe[(Math.random() * coupe.length) | 0];
          ST[q.id].isole = false; ST[q.id].fige = true;
          ligne([pourDb('· db-01 est réclamée par l\'exploitation : remise en service.', q.id)], '#F5A524');
          return;
        }
        var mur = NET.filter(function(n){ return ST[n.id].patche && !ST[n.id].pris && atteignable(n.id); });
        if(mur.length && Math.random() < .4){
          var m = mur[(Math.random() * mur.length) | 0];
          ST[m.id].patche = false; ST[m.id].bruit += 2;
          ligne([pourDb('· db-01 : le correctif est contourné.', m.id)], '#FF5C4D');
          return;
        }
        ligne('· l\'attaque cherche une entrée', '#39424A');
        return;
      }
      cand.sort(function(a, b){ return (a.id === CIBLE ? -1 : 0) - (b.id === CIBLE ? -1 : 0); });
      var t = cand[0];
      ST[t.id].pris = true; ST[t.id].bruit += 3;
      ligne(['· l\'attaque prend', r(' ' + t.id)], '#FF5C4D');
      if(t.id === CIBLE) fin(false);
    }
  }
  function fin(gagne){
    G.fini = true;
    ligne(gagne ? '— objectif atteint. Partie gagnée. —' : '— la base de données est tombée. Partie perdue. —',
      gagne ? '#50C878' : '#FF5C4D');
    if(gagne){
      G.score += 30;
      try{ TROPHY.win('g13'); }catch(err){}
    }
    paintHud();
  }
  function jouer(txt){
    if(G.fini){ ligne('Partie terminée. « Jouer » pour recommencer.', '#56606A'); return; }
    var p = String(txt).trim().split(/\s+/);
    var verbe = (p[0] || '').toLowerCase();
    if(!verbe) return;
    ligne([r('$ ' + txt)], '#E4E8EA');
    var f = CMD[verbe];
    if(!f){ ligne(['Commande inconnue :', r(' ' + verbe + '. '), 'Tapez help pour la liste des commandes.'], '#F5A524'); return; }
    var n = p[1] ? trouve(p[1]) : null;
    if(p[1] && !n){ ligne(['Machine inconnue :', r(' ' + p[1])], '#F5A524'); return; }
    var coute = f(n);
    paintHud();
    if(!coute || G.fini) return;
    adverse();
    if(G.fini) return;
    G.tour++;
    if(G.tour > G.max){
      G.fini = true;
      var gagne = G.camp === 'bleu' ? !ST[CIBLE].pris : ST[CIBLE].pris;
      ligne(gagne ? '— douze tours tenus. Partie gagnée. —' : '— douze tours écoulés. Partie perdue. —',
        gagne ? '#50C878' : '#FF5C4D');
      if(gagne) try{ TROPHY.win('g13'); }catch(err){}
    }
    paintHud();
  }

  function layout(){
    var r = cv.getBoundingClientRect();
    W = Math.max(2, r.width); H = Math.max(2, r.height);
    cv.width = Math.round(W * DPR2); cv.height = Math.round(H * DPR2);
    c2.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    c2.textBaseline = 'middle';
  }
  function pos(n){ return { x: 22 + n.x * (W - 44), y: 24 + n.y * (H - 48) }; }
  function draw(t){
    c2.clearRect(0, 0, W, H);
    c2.fillStyle = 'rgba(7,9,11,.92)'; c2.fillRect(0, 0, W, H);
    /* les liens d'abord */
    LIENS.forEach(function(l){
      var a = pos(NET[l[0]]), b = pos(NET[l[1]]);
      var pa = ST[NET[l[0]].id], pb = ST[NET[l[1]].id];
      var chaud = pa && pb && (pa.pris || pb.pris);
      var coupe = (pa && pa.isole) || (pb && pb.isole);
      c2.strokeStyle = coupe ? 'rgba(228,232,234,.07)' : chaud ? 'rgba(255,92,77,.34)' : 'rgba(4,139,154,.3)';
      c2.lineWidth = chaud ? 1.5 : 1;
      if(coupe){ c2.setLineDash([3, 4]); } else c2.setLineDash([]);
      c2.beginPath(); c2.moveTo(a.x, a.y); c2.lineTo(b.x, b.y); c2.stroke();
      c2.setLineDash([]);
      /* un point qui court sur les liens chauds : le réseau vit */
      if(chaud && !coupe){
        var u = (t * .34 + l[0] * .21) % 1;
        c2.fillStyle = 'rgba(255,92,77,.8)';
        c2.beginPath(); c2.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 2, 0, 6.283); c2.fill();
      }
    });
    NET.forEach(function(n, i){
      var p = pos(n), s = ST[n.id] || {};
      var col = s.pris ? '#FF5C4D' : s.patche ? '#50C878' : s.isole ? '#56606A' : n.id === CIBLE ? '#F5A524' : '#048B9A';
      var r = n.id === CIBLE ? 11 : 9;
      if(s.pris){
        var g2 = .5 + .5 * Math.sin(t * 3 + i);
        c2.fillStyle = 'rgba(255,92,77,' + (.1 + g2 * .12).toFixed(3) + ')';
        c2.beginPath(); c2.arc(p.x, p.y, r + 8 + g2 * 3, 0, 6.283); c2.fill();
      }
      c2.fillStyle = 'rgba(11,14,17,.95)';
      c2.beginPath(); c2.arc(p.x, p.y, r, 0, 6.283); c2.fill();
      c2.strokeStyle = col; c2.lineWidth = G.sel === i ? 2 : 1.2;
      c2.beginPath(); c2.arc(p.x, p.y, r, 0, 6.283); c2.stroke();
      /* la machine choisie ne se signalait que par huit dixièmes de trait de
         plus : c'est elle que le verbe va toucher, elle doit se voir */
      if(G.sel === i){
        c2.strokeStyle = '#E4E8EA'; c2.lineWidth = 1;
        c2.beginPath(); c2.arc(p.x, p.y, r + 5, 0, 6.283); c2.stroke();
      }
      if(s.vu){ c2.fillStyle = col; c2.beginPath(); c2.arc(p.x, p.y, 2.5, 0, 6.283); c2.fill(); }
      c2.font = '8.5px "IBM Plex Mono", ui-monospace, monospace';
      c2.fillStyle = s.pris ? '#FF5C4D' : '#7C8791';
      c2.textAlign = 'center';
      c2.fillText(n.id, p.x, p.y + r + 9);
      c2.textAlign = 'left';
    });
    c2.font = '8px "IBM Plex Mono", ui-monospace, monospace';
    c2.fillStyle = '#39424A';
    /* Deux traductions se superposaient : TR() sur le préfixe, puis conv() sur
       la phrase recollée. Le préfixe seul est une clé ; la cible est un nom de
       machine et n'a rien à faire dedans. */
    c2.fillText(TR('objectif :') + ' ' + CIBLE, 10, 11);
  }

  cv.addEventListener('pointerdown', function(ev){
    var r = cv.getBoundingClientRect();
    var x = ev.clientX - r.left, y = ev.clientY - r.top;
    for(var i = 0; i < NET.length; i++){
      var p = pos(NET[i]);
      if((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y) < 260){
        G.sel = i;
        /* au doigt, pas de focus : il ouvrait le clavier par-dessus la carte
           alors que les verbes sont juste dessous */
        if(inp){ inp.value = (inp.value.trim().split(/\s+/)[0] || 'scan') + ' ' + NET[i].id; if(!TOUCH) inp.focus(); }
        peint();
        return;
      }
    }
    G.sel = -1;
    peint();
  });
  if(form) form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var v = inp ? inp.value : '';
    if(inp) inp.value = '';
    if(v.trim()) jouer(v);
    peint();
  });
  /* mouvement figé : la carte ne se repeignait plus après une commande,
     les machines prises ou corrigées n'y changeaient jamais de couleur */
  function peint(){ if(RM) draw(0); }
  if(startBtn) startBtn.addEventListener('click', function(){ layout(); reset(); peint(); if(inp && !TOUCH) inp.focus(); });
  if(swapBtn) swapBtn.addEventListener('click', function(){ reset(G.camp === 'rouge' ? 'bleu' : 'rouge'); peint(); });
  if(hintEl) vif(hintEl, function(){ return TR(TOUCH ? 'touchez une machine, puis un verbe — ou tapez la commande'
                                           : 'tapez help pour la liste des commandes'); });
  layout(); reset(); draw(0);
  if(window.ResizeObserver) new ResizeObserver(function(){ layout(); draw(0); }).observe(cv);
  if(RM) return;
  var api = { vis: false };
  api.frame = function(dt, t){ if(!api.vis) return; draw(t); };
  PIPES.push(api);
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ api.vis = en[0].isIntersecting; }, { threshold: .2 }).observe(cv);
  }else api.vis = true;
})();

}catch(e){ console.error('[jeu] ' + e.message); }
})();
