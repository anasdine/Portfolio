// L'en-tête : la même tour en deux versions. D'abord la vidéo générée par IA ; dès que le visiteur bouge la souris,
// la scène three.js prend le relais au même cadrage. Sur tactile, ou si le système demande moins d'animations, la
// vidéo reste, et le bouton « temps réel » permet de basculer à la main (comme le boîtier LEAP57 du portfolio).
import { creerTour, DEBUT_FRACTALE, PERIODES } from './tour.js';
import { PANNEAUX } from './bureau.js';

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

let tour = null, preparation = null, mode = 'video', restaure = false, fps = 0;

// À repasser à false si la vidéo ne correspond plus à la tour : la page part alors directement du temps réel, et on ne
// présente pas une image périmée.
const VIDEO_A_JOUR = true;

function ecrireLegende() {
  legende.textContent = mode === 'video'
    ? '↳ séquence générée par IA : une image, puis une vidéo, sans caméra ni logiciel 3D'
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
  preparation ??= creerTour(toile, { surEtat, surFoyer, surFps: (n) => { fps = n; if (mode === 'live') ecrireLegende(); } })
    .then((t) => (tour = t))
    .catch((erreur) => {
      console.warn('BASTION : rendu temps réel indisponible, la vidéo reste.', erreur);
      boutons.find((b) => b.dataset.vers === 'live').disabled = true;
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

// Le relais automatique : la vidéo a le temps d'être vue (4 s), puis le premier mouvement de souris la réveille.
if (VIDEO_A_JOUR && !tactile && !calme) {
  (window.requestIdleCallback || setTimeout)(() => preparer());
  const debut = performance.now();
  const reveil = () => {
    if (performance.now() - debut < 4000) return;
    removeEventListener('pointermove', reveil);
    basculer('live');
  };
  addEventListener('pointermove', reveil, { passive: true });
}

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
const parcours = document.querySelector('[data-parcours]');
const arcade = document.querySelector('.arcade');
let horsChamp = false, arcadeChargee = false, arcadeAtteinte = false, pPrecedent = 0, dernierY = 0;

// L'arcade n'arrive que si on s'en approche : les 13 jeux ne pèsent rien sur le début du parcours.
async function chargerArcade() {
  if (arcadeChargee) return;
  arcadeChargee = true;
  const boite = document.querySelector('[data-arcade-grille]');
  boite.innerHTML = await (await fetch('jeux/grille.html')).text();
  if (!window.THREE) window.THREE = await import('three');
  const s = document.createElement('script');
  s.src = 'jeux/jeux.js';
  document.body.append(s);
  const apparition = new IntersectionObserver((vus) => {
    for (const v of vus) if (v.isIntersecting) { v.target.classList.add('vu'); apparition.unobserve(v.target); }
  }, { threshold: 0.12 });
  for (const j of boite.querySelectorAll('[data-game]')) apparition.observe(j);
}
document.querySelector('[data-remonter]')?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
const PERIODE = (1 - DEBUT_FRACTALE) / PERIODES;
function suivreDefilement() {
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
  contact.style.opacity = fondu(0.72, 0.75, p) * (1 - fondu(0.97, 0.995, p));
  contact.style.pointerEvents = p > 0.72 && p < 0.98 ? 'auto' : 'none';
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
preparer().then(() => { suivreDefilement(); if (q.has('debug')) window.bastion = tour; });   // ?debug : position exacte, pour vérifier le raccord
suivreDefilement();

// Le rail : on peut aller droit au but. Le saut est immédiat, le fondu de la caméra fait le reste.
const chapitres = [...document.querySelectorAll('[data-chapitre]')];
function versChapitre(c) {
  const H = parcours.offsetHeight - innerHeight;
  if (c === 'arcade') { chargerArcade(); scrollTo(0, parcours.offsetHeight + 2); } else { scrollTo(0, Number(c) * H); }
}
for (const b of chapitres) b.addEventListener('click', () => versChapitre(b.dataset.chapitre));
function marquerChapitre() {
  const H = parcours.offsetHeight - innerHeight, y = scrollY;
  const i = y >= parcours.offsetHeight - innerHeight * 0.5 ? 3 : y >= 0.82 * H ? 2 : y >= 0.4 * H ? 1 : 0;
  chapitres.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
}
addEventListener('scroll', marquerChapitre, { passive: true });
marquerChapitre();

// L'easter egg : l'adresse du jeu n'est jamais sur le site public, elle part avec le code, de la main à la main.
const faille = document.querySelector('[data-faille]');
document.querySelector('[data-fissure]').addEventListener('click', () => faille.showModal());
document.querySelector('[data-faille-fermer]').addEventListener('click', () => faille.close());
