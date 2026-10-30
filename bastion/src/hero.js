// L'en-tête : la même tour en deux versions. D'abord la vidéo générée par IA ; dès que le visiteur bouge la souris,
// la scène three.js prend le relais au même cadrage. Sur tactile, ou si le système demande moins d'animations, la
// vidéo reste, et le bouton « temps réel » permet de basculer à la main (comme le boîtier LEAP57 du portfolio).
import { creerTour, DEBUT_FRACTALE, FIN_TRAJET, FIN_PANNEAUX, PERIODES } from './tour.js';
import { PANNEAUX } from './bureau.js';
import { chargerArcade } from './arcade.js';

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

let tour = null, preparation = null, mode = 'video', restaure = false, fps = 0;

// À repasser à false si la vidéo ne correspond plus à la tour : la page part alors directement du temps réel, et on ne
// présente pas une image périmée.
const VIDEO_A_JOUR = true;

function ecrireLegende() {
  legende.textContent = mode === 'video'
    ? '↳ séquence générée par IA, sans caméra ni logiciel 3D'
    : `↳ une tour de 300 m, calculée en direct par votre navigateur · ${tour.backend}${fps ? ` · ${fps} i/s` : ''}`;
}

function surEtat(e) {
  const rgb = COMPROMIS.map((c, i) => Math.round(c + (RESTAURE[i] - c) * e));
  racine.style.setProperty('--teinte', `rgb(${rgb.join(',')})`);
  if (restaure) return;
  journal.textContent = `> bastion · intégrité ${Math.round(34 + 66 * e)} %`;
  if (e > 0.97) {
    restaure = true;
    tour.viser(1);
    journal.textContent = '[ OK ] bastion restauré · intégrité 100 %';
    restaurer.textContent = 'restauré';
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
  h2.textContent = titre;
  const textes = lignes.filter(([t]) => t).map(([t, fort]) => {
    const p = document.createElement('p');
    p.textContent = t;
    p.classList.toggle('fort', Boolean(fort));
    return p;
  });
  fiche.replaceChildren(h2, ...textes);
}

function preparer() {
  preparation ??= creerTour(toile, { surEtat, surFoyer, surFps: (n) => {
      fps = n;
      if (mode === 'live') ecrireLegende();
      // dix secondes pour s'installer, puis six secondes d'affilée sous 20 images : on arrête de forcer
      if (mode === 'live' && document.visibilityState === 'visible' && performance.now() - lancement > 10000) {
        lentes = n < 20 ? lentes + 1 : 0;
        if (lentes >= 6) passerLeger();
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
  if (vers === mode) return;
  if (vers === 'live') {
    if (!(await preparer())) return;
    tour.demarrer();
    racine.dataset.mode = 'live';
    setTimeout(() => mode === 'live' && video.pause(), 1300);
  } else {
    racine.dataset.mode = 'video';
    if (!calme) video.play().catch(() => {});
    setTimeout(() => mode === 'video' && tour?.arreter(), 1300);
  }
  mode = vers;
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

if (!VIDEO_A_JOUR) {
  video.pause();
  video.style.visibility = 'hidden';
  boutons.find((b) => b.dataset.vers === 'video').disabled = true;
  basculer('live');
}

if ((navigator.deviceMemory || 8) < 4 || sansGL()) passerLeger();

// L'accueil : sur ordinateur, la scène vivante prend le relais dès qu'elle est prête ; la vidéo sert d'affiche pendant le
// chargement. Sur tactile, ou si le système demande moins d'animations, la vidéo reste jusqu'au premier défilement.
if (VIDEO_A_JOUR && !leger && !tactile && !calme) preparer().then((t) => t && basculer('live'));

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

document.querySelector('[data-remonter]')?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
const PERIODE = (1 - DEBUT_FRACTALE) / PERIODES;
function suivreDefilement() {
  if (leger) {
    branches.classList.add('visible');
    if (scrollY > 40) chargerArcade();
    return;
  }
  const H = Math.max(1, parcours.offsetHeight - innerHeight);
  const p = Math.min(1, scrollY / H);
  if (p > 0.004 && mode === 'video') basculer('live');   // la vidéo ne sait pas avancer : le défilement réveille la scène
  tour?.defiler(p);
  const n = Math.min(PERIODES, Math.max(0, Math.floor((p - DEBUT_FRACTALE) / PERIODE)));
  niveau.textContent = `> leonhard · niveau ${n} / ${PERIODES}`;
  niveau.style.opacity = fondu(DEBUT_FRACTALE - 0.02, DEBUT_FRACTALE, p);
  titre.style.opacity = 1 - fondu(0.02, 0.09, p);
  bas.style.opacity = 1 - fondu(0.12, 0.2, p);
  indice.style.opacity = 1 - fondu(0, 0.03, p);
  contact.style.opacity = fondu(0.77, 0.8, p) * (1 - fondu(0.97, 0.995, p));
  contact.style.pointerEvents = p > 0.77 && p < 0.98 ? 'auto' : 'none';
  branches.classList.toggle('visible', p > FIN_TRAJET - 0.01 && p < FIN_PANNEAUX + 0.02);
  // Bam : au bout du tunnel, on ne remonte pas doucement vers l'arcade, on y tombe. Seulement en descendant.
  if (p > 0.996 && pPrecedent <= 0.996 && scrollY >= dernierY && !arcadeAtteinte) {
    arcadeAtteinte = true;
    chargerArcade();
    scrollTo(0, parcours.offsetHeight + 2);
    if (!calme) { arcade.classList.remove('bam'); void arcade.offsetWidth; arcade.classList.add('bam'); }
  }
  if (p < 0.97) arcadeAtteinte = false;
  pPrecedent = p; dernierY = scrollY;
  // Une fois l'arcade montée, le 3D se tait : les jeux ont toute la machine pour eux.
  const couvert = scrollY > parcours.offsetHeight;
  if (couvert !== horsChamp && tour) { horsChamp = couvert; if (couvert) tour.arreter(); else if (mode === 'live') tour.demarrer(); }
  racine.style.visibility = couvert ? 'hidden' : '';
  if (scrollY > parcours.offsetHeight - innerHeight * 2.5) chargerArcade();
}
addEventListener('scroll', suivreDefilement, { passive: true });
(leger ? Promise.resolve() : preparer()).then(() => { suivreDefilement(); if (q.has('debug')) window.bastion = tour; });   // ?debug : position exacte, pour vérifier le raccord
suivreDefilement();

// Le rail : on peut aller droit au but. Le saut est immédiat, le fondu de la caméra fait le reste.
const chapitres = [...document.querySelectorAll('[data-chapitre]')];
function versChapitre(c) {
  const H = parcours.offsetHeight - innerHeight;
  if (c === 'arcade' || c === 'production') {
    chargerArcade();
    document.getElementById(c).scrollIntoView();
  } else scrollTo(0, Number(c) * H);
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
const BRANCHES = [
  ['Offre', 0, 'freelance'], ['Projets', 1, 'pieces'], ['Méthode', 2, 'strates'], ['Parcours', 3, 'reglage'], ['Contact', 4, 'contact'],
];
const univers = document.querySelector('[data-univers]');
let cadreUnivers = univers.querySelector('iframe');
const retour = univers.querySelector('[data-retour]');
const titreUnivers = univers.querySelector('[data-univers-titre]');
const SOURCE = location.hostname.endsWith('github.io') ? '../' : 'https://anasdine.github.io/Portfolio/';
let dernierBouton = null;

async function entrer(nom, i, ancre, bouton) {
  dernierBouton = bouton;
  const H = parcours.offsetHeight - innerHeight;
  if (!leger) scrollTo(0, (FIN_TRAJET + (FIN_PANNEAUX - FIN_TRAJET) * (i / (BRANCHES.length - 1))) * H);
  await new Promise((ok) => setTimeout(ok, calme || leger ? 0 : 750));   // la caméra rejoint le panneau avant d'entrer
  titreUnivers.textContent = nom;
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
  let essais = 0;
  const isoler = setInterval(() => {
    if (cadre !== cadreUnivers || ++essais > 66) { clearInterval(isoler); univers.classList.add('pret'); return; }
    try {
      const w = cadre.contentWindow, d = w.document, s = d.getElementById(ancre);
      if (!s || !s.offsetHeight) return;
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
      if (!univers.classList.contains('pret') && essais > 6) {
        setTimeout(() => { if (essais < 30) w.scrollTo(0, 0); univers.classList.add('pret'); }, 200);
      }
    } catch { clearInterval(isoler); univers.classList.add('pret'); }   // autre origine, en local : page entière
  }, 150);
  cadreUnivers.src = SOURCE + '#' + ancre;
  univers.classList.add('ouvert');
  document.documentElement.classList.add('jeu-ouvert');
  retour.focus();
  setTimeout(() => tour?.arreter(), 700);                       // la 3D se tait : la page a toute la machine
}
function revenir() {
  univers.classList.remove('ouvert');
  document.documentElement.classList.remove('jeu-ouvert');
  cadreUnivers.onload = null;
  cadreUnivers.src = 'about:blank';     // décharge la page : sa boucle d'animation ne doit pas tourner derrière
  if (mode === 'live') tour?.demarrer();
  dernierBouton?.focus();
}
for (const [nom, i, ancre] of BRANCHES) {
  const c = document.createElement('button');
  c.type = 'button';
  c.textContent = nom;
  c.addEventListener('click', () => entrer(nom, i, ancre, c));
  branches.append(c);
}
retour.addEventListener('click', revenir);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && univers.classList.contains('ouvert')) revenir(); });
