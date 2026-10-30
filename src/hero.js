// L'en-tête : la même tour en deux versions, pour que le visiteur voie la différence. La vidéo générée par IA reste à
// l'écran tant qu'il ne choisit pas « temps réel » : elle ne réagit à rien. Le défilement ne la coupe qu'à la fin de
// l'accueil, là où une vidéo ne peut plus suivre, et la scène three.js prend alors le relais pour tout le trajet.
import { creerTour, DEBUT_FRACTALE, DEBUT_PANNEAUX, FIN_TRAJET, FIN_PANNEAUX, PERIODES } from './tour.js';
import { PANNEAUX } from './bureau.js';
import { chargerArcade } from './arcade.js';
import { t, surLangue, brancherSelecteur } from './langues.js';

const racine = document.querySelector('[data-hero]');
const video = racine.querySelector('video');
const toile = racine.querySelector('canvas');
const boutons = [...racine.querySelectorAll('[data-vers]')];
const legende = racine.querySelector('[data-legende]');
const journal = racine.querySelector('[data-journal]');
const restaurer = racine.querySelector('[data-restaurer]');
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tactile = matchMedia('(pointer: coarse)').matches;

const COMPROMIS = [0xff, 0x5c, 0x4d];
const RESTAURE = [0x3f, 0xd3, 0xc6];

// Le mode léger : sans 3D possible, ou si la machine ne suit pas, on garde la vidéo, les branches, la production et les
// jeux. Le visiteur ne doit jamais tomber sur un écran noir.
let leger = false;
function passerLeger() {
  if (leger) return;
  leger = true;
  tour?.arreter();
  document.documentElement.classList.add('leger');
  racine.dataset.mode = 'video';
  mode = 'video';
  video.style.visibility = '';
  video.play().catch(() => {});
  scrollTo(0, 0);
  dispatchEvent(new Event('scroll'));
}
const sansGL = () => { try { return !navigator.gpu && !document.createElement('canvas').getContext('webgl2'); } catch { return true; } };

let tour = null, preparation = null, mode = 'video', restaure = false, fps = 0, enBascule = false;

// À repasser à false si la vidéo ne correspond plus à la tour : la page part alors directement du temps réel, et on ne
// présente pas une image périmée.
const VIDEO_A_JOUR = true;

const ecrire = (el, texte) => { if (el.textContent !== texte) el.textContent = texte; };   // écrire dans la page à chaque image pour rien coûte une mise en page

function ecrireLegende() {
  legende.textContent = mode === 'video'
    ? t('↳ vidéo générée par IA : une boucle, elle ne réagit à rien. Passez en temps réel pour comparer.')
    : `${t('↳ temps réel : rien n\'est enregistré, votre navigateur calcule cette tour de 300 m')}${tactile ? '' : t(' et suit votre souris')} · ${tour.backend}${fps ? ` · ${fps} ${t('i/s')}` : ''}`;
}

function surEtat(e) {
  const rgb = COMPROMIS.map((c, i) => Math.round(c + (RESTAURE[i] - c) * e));
  racine.style.setProperty('--teinte', `rgb(${rgb.join(',')})`);
  if (restaure) return;
  ecrire(journal, t('> bastion · intégrité # %', Math.round(34 + 66 * e)));
  if (e > 0.97) {
    restaure = true;
    tour.viser(1);
    journal.textContent = t('[ OK ] bastion restauré · intégrité 100 %');
    restaurer.dataset.t = 'restauré';
    restaurer.textContent = t('restauré');
    restaurer.disabled = true;
  }
}

// La fiche : le contenu du panneau en face, en vrai texte. Visible sur écran vertical, lue partout par les lecteurs d'écran.
const fiche = racine.querySelector('[data-fiche]');
let ficheAffichee = null;
function surFoyer(foyer) {
  const i = Math.round(foyer);
  const proche = foyer >= 0 && Math.abs(foyer - i) < 0.32;
  fiche.classList.toggle('visible', proche);
  if (!proche || i === ficheAffichee) return;
  ficheAffichee = i;
  const { titre, lignes } = PANNEAUX[i];
  const h2 = document.createElement('h2');
  h2.textContent = t(titre);
  const textes = lignes.filter(([texte]) => texte).map(([texte, fort]) => {
    const p = document.createElement('p');
    p.textContent = t(texte);
    p.classList.toggle('fort', Boolean(fort));
    return p;
  });
  fiche.replaceChildren(h2, ...textes);
}

function preparer() {
  preparation ??= creerTour(toile, { surEtat, surFoyer, surFps: (n) => {
      fps = n;
      if (mode === 'live') ecrireLegende();
      // dix secondes pour s'installer après le passage en 3D, puis huit secondes d'affilée sous 14 images : on arrête de forcer
      if (mode === 'live' && document.visibilityState === 'visible' && performance.now() - lancement > 10000) {
        lentes = n >= 14 ? 0 : lentes + (n < 3 ? 0.4 : 1);   // 1 ou 2 images par seconde : souvent une fenêtre recouverte, on laisse vingt secondes
        if (lentes >= 8) passerLeger();
      } else if (mode !== 'live') lancement = performance.now();
    } })
    .then((t) => (tour = t))
    .catch((erreur) => {
      console.warn('BASTION : rendu temps réel indisponible, la vidéo reste.', erreur);
      boutons.find((b) => b.dataset.vers === 'live').disabled = true;
      passerLeger();
      return null;
    });
  return preparation;
}

async function basculer(vers) {
  if (vers === mode || enBascule) return;
  if (vers === 'live') {
    enBascule = true;
    if (!(await preparer())) { enBascule = false; return; }
    lancement = performance.now();
    lentes = 0;
    tour.demarrer();
    // Les premières images de la 3D sont les plus lentes : le balayage attend qu'elles soient passées, sinon on ne le verrait pas.
    await Promise.race([
      (async () => { for (let k = 0; k < 6; k++) await new Promise(requestAnimationFrame); })(),
      new Promise((ok) => setTimeout(ok, 1500)),
    ]);
    racine.dataset.mode = 'live';
    enBascule = false;
    // Aucune image au bout de 15 secondes : le moteur s'est figé, on ne laisse jamais le visiteur devant un écran mort.
    setTimeout(() => { if (mode === 'live' && !fps && document.visibilityState === 'visible') passerLeger(); }, 15000);
    setTimeout(() => mode === 'live' && video.pause(), 1300);
  } else {
    racine.dataset.mode = 'video';
    if (!calme) video.play().catch(() => {});
    setTimeout(() => mode === 'video' && tour?.arreter(), 1300);
  }
  mode = vers;
  racine.classList.add('balaye');
  setTimeout(() => racine.classList.remove('balaye'), 1000);
  for (const b of boutons) b.setAttribute('aria-pressed', String(b.dataset.vers === mode));
  ecrireLegende();
}

for (const b of boutons) b.addEventListener('click', () => basculer(b.dataset.vers));

// Maintenir pour restaurer : la restauration n'existe qu'en temps réel, la vidéo ne peut pas réagir.
const maintenir = async () => {
  if (restaure) return;
  await basculer('live');
  if (!tour) return;
  restaurer.classList.add('maintenu');
  tour.viser(1);
};
const relacher = () => {
  restaurer.classList.remove('maintenu');
  if (tour && !restaure) tour.viser(0);
};
restaurer.addEventListener('pointerdown', maintenir);
for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) restaurer.addEventListener(ev, relacher);
restaurer.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); maintenir(); } });
restaurer.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') relacher(); });

if (calme) video.removeAttribute('autoplay'), video.pause();
if (mode === 'video') legende.textContent = VIDEO_A_JOUR ? legende.textContent : '↳ chargement de la scène…';
if (VIDEO_A_JOUR) ecrireLegende();
ecrire(journal, t('> bastion · intégrité # %', 34));

if (!VIDEO_A_JOUR) {
  video.pause();
  video.style.visibility = 'hidden';
  boutons.find((b) => b.dataset.vers === 'video').disabled = true;
  basculer('live');
}

if ((navigator.deviceMemory || 8) < 2 || sansGL()) passerLeger();

// La scène se prépare en arrière-plan sur ordinateur, pour que le bouton réponde tout de suite. Elle ne s'affiche pas seule.
if (VIDEO_A_JOUR && !leger && !tactile && !calme) preparer();

// Débogage et captures : ?mode=live force le temps réel, ?etat=1 la tour restaurée.
const q = new URLSearchParams(location.search);
if (q.get('mode') === 'live') basculer('live').then(() => q.get('etat') === '1' && tour?.viser(1));

// Le défilement : la page est haute, la scène reste fixe, et la position pilote le trajet dans la tour.
const fondu = (a, b, x) => Math.min(1, Math.max(0, (x - a) / (b - a)));
const titre = racine.querySelector('.titre');
const bas = racine.querySelector('.bas');
const indice = racine.querySelector('[data-indice]');
const contact = racine.querySelector('[data-contact]');
const niveau = racine.querySelector('[data-niveau]');
const branches = document.querySelector('[data-branches]');
const parcours = document.querySelector('[data-parcours]');
const arcade = document.querySelector('.arcade');
let lancement = performance.now(), lentes = 0;
let horsChamp = false, arcadeAtteinte = false, pPrecedent = 0, dernierY = 0;
let enGlisse = false, lest = false, trajet = 0;   // enGlisse : c'est le trajet qui pilote la caméra, pas la position de la page

document.querySelector('[data-remonter]')?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
const PERIODE = (1 - DEBUT_FRACTALE) / PERIODES;
const FIN_ACCUEIL = 0.07;                  // le titre a presque disparu
const IMMERSION = 0.87;
function suivreDefilement() {
  if (leger) {
    branches.classList.add('visible');
    if (scrollY > 40) chargerArcade();
    return;
  }
  const H = Math.max(1, parcours.offsetHeight - innerHeight);
  const p = Math.min(1, scrollY / H);
  if (p > FIN_ACCUEIL && mode === 'video') basculer('live');   // la vidéo ne sait pas avancer : ici, seule la scène peut suivre
  if (!enGlisse) tour?.defiler(p);
  const n = Math.min(PERIODES, Math.max(0, Math.floor((p - DEBUT_FRACTALE) / PERIODE)));
  ecrire(niveau, t('> leonhard · niveau # / #', n, PERIODES));
  niveau.style.opacity = fondu(DEBUT_FRACTALE - 0.02, DEBUT_FRACTALE, p);
  titre.style.opacity = 1 - fondu(0.02, 0.09, p);
  titre.style.transform = `translate3d(0, ${-90 * fondu(0.02, 0.09, p)}px, 0)`;
  bas.style.opacity = 1 - fondu(0.1, 0.16, p);
  indice.style.opacity = 1 - fondu(0, 0.03, p);
  contact.style.opacity = fondu(0.73, 0.76, p) * (1 - fondu(0.765, 0.785, p));
  contact.style.pointerEvents = p > 0.73 && p < 0.77 ? 'auto' : 'none';
  branches.classList.toggle('visible', p > DEBUT_PANNEAUX - 0.02 && p < FIN_PANNEAUX + 0.012);
  // Bam : au bout du tunnel, on ne remonte pas doucement vers l'arcade, on y tombe. Seulement en descendant.
  if (p > 0.996 && pPrecedent <= 0.996 && scrollY >= dernierY && !arcadeAtteinte) {
    arcadeAtteinte = true;
    trajet++; lest = enGlisse = false;       // le bam prend la main sur le trajet en cours
    chargerArcade();
    const arrivee = parcours.offsetHeight + 2, fin = performance.now() + 650;
    const tenir = () => { scrollTo(0, arrivee); if (performance.now() < fin) requestAnimationFrame(tenir); };
    tenir();
    if (!calme) { const e = document.querySelector('[data-eclair]'); e.classList.remove('part'); void e.offsetWidth; e.classList.add('part'); }
    if (!calme) { arcade.classList.remove('bam'); void arcade.offsetWidth; arcade.classList.add('bam'); }
  }
  if (p < 0.97) arcadeAtteinte = false;
  pPrecedent = p; dernierY = scrollY;
  // Une fois l'arcade montée, le 3D se tait : les jeux ont toute la machine pour eux.
  const couvert = scrollY > parcours.offsetHeight;
  // Dans le tunnel, plus d'interface : le voile et les boutons ne doivent pas rester posés sur la lumière.
  document.documentElement.classList.toggle('immersion', p > IMMERSION && !couvert);
  if (couvert !== horsChamp && tour) { horsChamp = couvert; if (couvert) tour.arreter(); else if (mode === 'live') tour.demarrer(); }
  racine.style.visibility = couvert ? 'hidden' : '';
  if (scrollY > parcours.offsetHeight - innerHeight * 2.5) chargerArcade();
}
addEventListener('scroll', suivreDefilement, { passive: true });
(leger ? Promise.resolve() : preparer()).then(() => {
  suivreDefilement();
  if (q.has('debug')) window.bastion = tour;
  // L'arcade se charge au repos, derrière la vidéo : à la dernière seconde, elle couperait l'élan du tunnel.
  if (!leger && !tactile) (window.requestIdleCallback || setTimeout)(chargerArcade);
});   // ?debug : position exacte, pour vérifier le raccord
suivreDefilement();

// Les langues : tout ce qui est écrit par le code se réécrit au changement.
brancherSelecteur(document.querySelector('[data-langue]'));
surLangue(() => {
  ecrireLegende();
  if (!restaure) ecrire(journal, t('> bastion · intégrité # %', Math.round(34 + 66 * (tour?.etat ?? 0))));
  else journal.textContent = t('[ OK ] bastion restauré · intégrité 100 %');
  ficheAffichee = null;
  suivreDefilement();
});

// Le rail : on peut aller droit au but. Le saut est immédiat, le fondu de la caméra fait le reste.
const chapitres = [...document.querySelectorAll('[data-chapitre]')];
function versChapitre(c) {
  const H = parcours.offsetHeight - innerHeight;
  if (c === 'arcade' || c === 'production') {
    chargerArcade();
    document.getElementById(c).scrollIntoView();
  } else if (!leger) glisser(Number(c));
  else scrollTo(0, Number(c) * H);
}
for (const b of chapitres) b.addEventListener('click', () => versChapitre(b.dataset.chapitre));
function marquerChapitre() {
  const H = parcours.offsetHeight - innerHeight, y = scrollY;
  const arcadeHaut = document.getElementById('arcade').offsetTop - innerHeight * 0.5;
  const i = y >= arcadeHaut ? 4 : y >= parcours.offsetHeight - innerHeight * 0.5 ? 3 : y >= 0.82 * H ? 2 : y >= 0.4 * H ? 1 : 0;
  chapitres.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
}
addEventListener('scroll', marquerChapitre, { passive: true });
marquerChapitre();

// L'easter egg : l'adresse du jeu n'est jamais sur le site public, elle part avec le code, de la main à la main.
const faille = document.querySelector('[data-faille]');
document.querySelector('[data-fissure]').addEventListener('click', () => faille.showModal());
document.querySelector('[data-faille-fermer]').addEventListener('click', () => faille.close());

// Les branches : depuis la table, chaque panneau ouvre son univers, avec le contenu complet du portfolio.
// Le détail n'est pas recopié : c'est la vraie page, ses huit langues et son parcours « réglage de calibre ».
const pPanneau = (i) => DEBUT_PANNEAUX + (FIN_PANNEAUX - DEBUT_PANNEAUX) * (i / 4);
const BRANCHES = [
  ['Offre', 0, 'freelance'], ['Projets', 1, 'pieces'], ['Méthode', 2, 'strates'], ['Parcours', 3, 'reglage'], ['Contact', 4, 'contact'],
];
const univers = document.querySelector('[data-univers]');
let cadreUnivers = univers.querySelector('iframe');
const retour = univers.querySelector('[data-retour]');
const titreUnivers = univers.querySelector('[data-univers-titre]');
const SOURCE = location.hostname.endsWith('github.io') ? './vitrine/' : 'https://anasdine.github.io/Portfolio/vitrine/';
let dernierBouton = null;

let entree = 0;                              // un retour pendant l'ouverture annule tout ce qui restait à faire
let ouverture = null;                        // le verre qui s'ouvre : la même animation, jouée à l'envers, le referme
const PLEIN = ['0% 0%', '100% 0%', '100% 100%', '0% 100%'];
const polygone = (coins) => `polygon(${coins.join(', ')})`;
async function entrer(nom, i, ancre, bouton) {
  const ce = ++entree;
  dernierBouton = bouton;
  titreUnivers.textContent = t(nom);
  univers.querySelector('[data-univers-nom]').textContent = t(nom);
  const anime = !leger && !calme && mode === 'live' && tour;
  arrimage = true;
  if (!leger && Math.abs(scrollY / hauteur() - pPanneau(i)) > 0.002) await glisser(pPanneau(i));
  arrimage = false;
  if (ce !== entree) return;
  ouverture?.cancel();
  ouverture = null;
  univers.classList.remove('pret');
  if (anime) {
    // Le panneau devient la page : même teinte, mêmes coins. Le verre s'étire jusqu'aux bords de l'écran, sans coupure.
    document.documentElement.classList.add('plonge');
    tour.plonger(true);
    ouverture = univers.animate({ clipPath: [polygone(tour.cadrePanneau(i)), polygone(PLEIN)] }, { duration: 880, delay: 140, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'both' });
  }
  univers.classList.add('ouvert');
  document.documentElement.classList.add('jeu-ouvert');
  retour.focus();
  if (anime) await ouverture.finished.catch(() => {});
  if (ce !== entree) return;
  tour?.arreter();                                                         // la 3D se tait : la page a toute la machine
  // Un cadre neuf à chaque entrée : changer seulement l'ancre d'une page déjà chargée ne déclencherait aucun chargement.
  const neuf = document.createElement('iframe');
  neuf.title = cadreUnivers.title;
  cadreUnivers.replaceWith(neuf);
  cadreUnivers = neuf;
  // Une branche montre une seule section : le reste de la page est masqué, puis ses animations sont recalculées.
  // Le cadre reste caché jusque-là : le visiteur ne voit jamais l'ancienne page se construire.
  univers.classList.remove('pret');
  // La page est un paquet qui réécrit son document au démarrage : une pose unique peut être effacée. On surveille donc
  // pendant dix secondes, et on repose l'isolation chaque fois qu'elle a disparu.
  const cadre = cadreUnivers;
  let essais = 0, stable = 0;
  const isoler = setInterval(() => {
    if (ce !== entree) return clearInterval(isoler);                       // le visiteur est reparti : la page ne doit plus revenir
    if (cadre !== cadreUnivers || ++essais > 66) { clearInterval(isoler); univers.classList.add('pret'); return; }
    try {
      const w = cadre.contentWindow, d = w.document, s = d.getElementById(ancre);
      if (!s || !s.offsetHeight) return;
      stable = d.getElementById('bastion-seul') && d.readyState === 'complete' ? stable + 1 : 0;
      if (!d.getElementById('bastion-seul')) {
        const st = d.createElement('style');
        st.id = 'bastion-seul';
        st.textContent = `main > section:not(#${ancre}), [data-nav], [data-up], [data-theme-btn], [data-preloader] { display: none !important; }
          main > section#${ancre} { padding-top: clamp(30px, 6vh, 70px) !important; margin-top: 0 !important; }
          #haut, [data-explain-dot], [data-ada-bubble], [data-ada], [data-voice-btn], [data-ada-follow] { display: none !important; }
          /* le contenu ne dépend d'aucune animation au défilement : dans une branche, tout est visible d'office */
          [data-reveal], [data-reveal] *, [data-split-title], [data-split-title] *, [data-split-words], [data-split-words] *,
          [data-plane-wrap], [data-rack-wrap], [data-piece] { opacity: 1 !important; visibility: visible !important; clip-path: none !important; }
          [data-reveal], [data-split-title] *, [data-split-words] * { transform: none !important; }`;
        d.head.append(st);
        w.dispatchEvent(new Event('resize'));
        w.ScrollTrigger?.refresh();
        w.scrollTo(0, 0);
      }
      if (!univers.classList.contains('pret') && stable >= 6) {
        setTimeout(() => { if (ce !== entree) return; if (essais < 30) w.scrollTo(0, 0); univers.classList.add('pret'); }, 200);
      }
    } catch { clearInterval(isoler); univers.classList.add('pret'); }   // autre origine, en local : page entière
  }, 150);
  cadreUnivers.src = SOURCE + '#' + ancre;
}
async function revenir() {
  const ce = ++entree;
  const fini = univers.classList.contains('ouvert') && ouverture;
  cadreUnivers.onload = null;
  univers.classList.remove('pret');                                        // la page s'efface : il ne reste que le verre
  if (mode === 'live') tour?.demarrer();
  dernierBouton?.focus();
  if (fini) {
    await new Promise((ok) => setTimeout(ok, 240));                        // la scène a repris avant que le verre ne la découvre
    if (ce !== entree) return;
    tour?.plonger(false);
    document.documentElement.classList.remove('plonge');
    ouverture.reverse();
    await ouverture.finished.catch(() => {});
    if (ce !== entree) return;
  } else {
    tour?.plonger(false);
    document.documentElement.classList.remove('plonge');
  }
  univers.classList.remove('ouvert');
  document.documentElement.classList.remove('jeu-ouvert');
  setTimeout(() => {
    if (univers.classList.contains('ouvert')) return;
    ouverture?.cancel();
    ouverture = null;
    cadreUnivers.src = 'about:blank';                                      // décharge la page une fois refermée
  }, 500);
}
for (const [nom, i, ancre] of BRANCHES) {
  const c = document.createElement('button');
  c.type = 'button';
  c.dataset.t = nom;
  c.textContent = t(nom);
  c.addEventListener('click', () => entrer(nom, i, ancre, c));
  branches.append(c);
}
retour.addEventListener('click', revenir);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && univers.classList.contains('ouvert')) revenir(); });

// Le défilement lesté, comme igloo.inc : un chemin qu'on suit, sans étape. Le geste déplace une cible, et un ressort amorti
// la rejoint : la vitesse reste continue, les crans d'une molette se fondent en une seule glissade, et on s'arrête où on veut.
// Le clavier et le rail, eux, vont d'étape en étape. Dans l'arcade, le défilement est libre.
const ETAPES_GUIDE = [0, 0.09, 0.345, ...BRANCHES.map(([, i]) => pPanneau(i)), 0.84, 1];
const RESSORT = 2.8;              // plus c'est bas, plus le parcours est lourd
const CRAN = 120 / 0.014;         // un cran de molette vaut 1,4 % du parcours
const CRAN_MAX = 0.03;            // un geste brusque ou une souris rapide ne fait pas sauter de scène
const REPOS = 240;
const DOIGT = 7;                  // écrans de glissé pour tout le parcours
const SURVOL = 1.03;              // le tunnel ne ralentit pas avant le bam : la cible est au-delà de l'arrivée
const ASPIRATION = 0.965;
const courbe = (x) => (1 - Math.cos(x * Math.PI)) / 2;
const plongeon = (x) => x ** 2.4;                // le tunnel ne fait qu'accélérer, jusqu'au bam
let cible = 0, courant = 0, vitesse = 0, dernierGeste = 0, dernierCran = 0, arrimage = false;
let doigt = null, departDoigt = 0, elanDoigt = 0;
const hauteur = () => Math.max(1, parcours.offsetHeight - innerHeight);
const arrivee = () => parcours.offsetHeight + 2;
const dansLeParcours = () => !leger && scrollY < hauteur() - 1;
const occupe = () => document.documentElement.classList.contains('jeu-ouvert') || faille.open;
const placer = (p) => { tour?.poser(p); scrollTo(0, p * hauteur()); };

function glisser(vers) {
  const depart = scrollY / hauteur();
  lest = false;
  const ce = ++trajet;
  if (calme) { enGlisse = false; placer(vers); return Promise.resolve(); }
  const tunnel = vers === 1;
  const duree = tunnel ? 5200 : vers === 0.84 ? 3400 : Math.min(4200, 1400 + Math.abs(vers - depart) * 13000);   // le virage vers LEONHARD est le plus large : on lui laisse le temps
  const t0 = performance.now();
  enGlisse = true;
  return new Promise((fini) => {
    const pas = (t) => {
      if (ce !== trajet) return fini();
      const x = Math.min(1, Math.max(0, (t - t0) / duree));   // l'horodatage de l'image peut précéder t0
      placer(depart + (vers - depart) * (tunnel ? plongeon(x) : courbe(x)));
      if (x < 1 && scrollY < hauteur() - 1) requestAnimationFrame(pas);
      else { enGlisse = false; fini(); }
    };
    requestAnimationFrame(pas);
  });
}
function suivreCible(ce) {
  let avant = performance.now();
  const pas = (t) => {
    if (ce !== trajet) return;
    if (leger) { lest = enGlisse = false; return; }
    const dt = Math.min(0.05, Math.max(0, (t - avant) / 1000));
    avant = t;
    // On ne part qu'une fois la 3D à l'écran : le geste s'accumule pendant ce temps, rien n'est perdu.
    if (mode !== 'video') {
      vitesse += (RESSORT * RESSORT * (cible - courant) - 2 * RESSORT * vitesse) * dt;
      courant = calme ? cible : Math.max(0, courant + vitesse * dt);
      placer(Math.min(1, courant));
    }
    const pose = Math.abs(cible - courant) < 0.0002 && Math.abs(vitesse) < 0.0005;
    if (courant >= 1 || (t - dernierGeste > REPOS && pose)) { lest = enGlisse = false; return; }
    requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}
function lester(dp) {
  if (!lest) {
    lest = enGlisse = true;
    cible = courant = Math.min(1, scrollY / hauteur());
    vitesse = 0;
    suivreCible(++trajet);
  }
  if (dp > 0 && mode === 'video') basculer('live');
  cible = Math.min(SURVOL, Math.max(0, cible + dp));
  if (dp > 0 && cible > ASPIRATION) cible = SURVOL;
  dernierGeste = performance.now();
}
async function avancer(sens) {
  if (mode === 'video' && sens > 0) await basculer('live');
  const p = scrollY / hauteur();
  const suivante = sens > 0 ? ETAPES_GUIDE.find((e) => e > p + 0.004) : ETAPES_GUIDE.findLast((e) => e < p - 0.004);
  if (suivante !== undefined) glisser(suivante);
}
// De l'arcade, on ne rembobine pas le tunnel : un éclair, et on est de retour à la table.
function remonterALaTable() {
  const e = document.querySelector('[data-eclair]');
  e.classList.remove('part'); void e.offsetWidth; e.classList.add('part');
  placer(ETAPES_GUIDE.at(-3));
}
function pousser(sens) {
  if (occupe() || leger) return false;
  if (dansLeParcours()) { avancer(sens); return true; }
  if (sens < 0 && scrollY <= arrivee() + 4) { remonterALaTable(); return true; }
  return false;
}
const pixels = (e) => e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1);
addEventListener('wheel', (e) => {
  const maintenant = performance.now(), isole = maintenant - dernierCran > 120;
  dernierCran = maintenant;
  if (arrimage) { e.preventDefault(); return; }
  if (occupe() || leger || !e.deltaY) return;
  if (dansLeParcours() || enGlisse) { e.preventDefault(); lester(Math.max(-CRAN_MAX, Math.min(CRAN_MAX, pixels(e) / CRAN))); return; }
  if (isole && e.deltaY < 0 && scrollY <= arrivee() + 4) { e.preventDefault(); pousser(-1); }
}, { passive: false });
addEventListener('touchstart', (e) => { doigt = departDoigt = e.touches[0].clientY; elanDoigt = 0; }, { passive: true });
addEventListener('touchmove', (e) => {
  if (arrimage) { e.preventDefault(); return; }
  if (occupe() || leger || e.touches.length > 1 || !(dansLeParcours() || enGlisse)) return;
  e.preventDefault();
  const y = e.touches[0].clientY, dp = (doigt - y) / (innerHeight * DOIGT);
  doigt = y;
  elanDoigt = dp;
  lester(dp);
}, { passive: false });
addEventListener('touchend', (e) => {
  if (doigt === null) return;
  const d = departDoigt - e.changedTouches[0].clientY;
  doigt = null;
  if (lest) { if (!occupe()) lester(Math.max(-0.08, Math.min(0.08, elanDoigt * 14))); return; }   // le doigt lancé garde son élan
  if (!dansLeParcours() && Math.abs(d) > 36) pousser(Math.sign(d));
}, { passive: true });
addEventListener('keydown', (e) => {
  const sens = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (!sens || (e.target.closest?.('button, a, input, textarea') && e.key === ' ')) return;
  if (pousser(sens)) e.preventDefault();
});
addEventListener('scroll', () => document.documentElement.classList.toggle('guide', dansLeParcours()), { passive: true });
document.documentElement.classList.toggle('guide', !leger);

// ?diag : la page dit ce qu'elle fait. Rien ne sort du navigateur : c'est lu à l'écran, ou par les outils de test.
if (q.has('diag')) {
  const d = (window.__diag = { erreurs: [], reseau: [], fps: 0 });
  window.__lourds = () => tour?.lourds();
  addEventListener('error', (e) => d.erreurs.push(e.message || String(e.target?.src || e.target?.href)), true);
  addEventListener('unhandledrejection', (e) => d.erreurs.push(String(e.reason)));
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.responseStatus >= 400) d.reseau.push(e.responseStatus + ' ' + e.name); }).observe({ type: 'resource', buffered: true });
  const bloc = document.createElement('pre');
  bloc.style.cssText = 'position:fixed;z-index:99;left:8px;top:60px;margin:0;padding:8px 10px;font:11px/1.5 ui-monospace,monospace;color:#7ff0e4;background:rgba(0,0,0,.72);pointer-events:none';
  document.body.append(bloc);
  setInterval(() => {
    Object.assign(d, { fps, mode, leger, largeur: innerWidth, hauteur: innerHeight, dpr: devicePixelRatio, ...(tour?.stats() || {}) });
    bloc.textContent = Object.entries(d).map(([k, v]) => k + ' ' + (Array.isArray(v) ? v.length + (v.length ? ' : ' + v.at(-1) : '') : v)).join('\n');
  }, 500);
}
