// L'arcade : un jeu phare, treize bornes, et une scène qui ouvre chaque jeu en grand.
import { t, langue, surLangue } from './langues.js';

// Les jeux restent posés hors champ, à leur taille, dès le chargement : leurs toiles se mesurent une seule fois, et
// ils n'ont pas besoin de savoir qu'ils ont changé de maison.
export const BORNES = [
  ['vaisseau', 'Sonde AD·2026', 'Vol 3D dans un corridor de données', 'Action'],
  ['terminal', 'Terminal', 'Équipe rouge contre équipe bleue, en vraies commandes', 'Stratégie'],
  ['modele', 'Élevez un modèle', 'Un LLM local à nourrir, refroidir, aligner', 'Gestion'],
  ['rack', 'Monter la baie', 'Poids, énergie, ventilation, câblage', 'Réflexion'],
  ['salle', 'La salle sans lumière', 'Silhouettes, saut, chute', 'Plateforme'],
  ['pare-feu', 'Pare-feu', 'Bloquer le rouge, laisser passer le cyan', 'Réflexes'],
  ['triage', 'Triage SOC', '40 secondes pour classer les alertes', 'Réflexes'],
  ['paquet', 'Collecte de paquets', 'La sonde parcourt le réseau', 'Arcade'],
  ['filtre', 'Renvoyer les attaques', 'La raquette protège le pare-feu', 'Arcade'],
  ['deduction', 'Trouver l\'intrusion', 'Déduction sur une grille de machines', 'Réflexion'],
  ['inventaire', 'Inventaire du parc', 'Retrouver les huit paires', 'Mémoire'],
  ['reflexe', 'Temps de réaction', 'Couper le lien dès l\'alerte', 'Réflexes'],
  ['sequence', 'Séquence de démarrage', 'Reproduire l\'ordre d\'allumage', 'Mémoire'],
];

const scene = document.querySelector('[data-scene]');
const grille = document.querySelector('[data-arcade-grille]');
const fermer = document.querySelector('[data-scene-fermer]');
const cadre = document.querySelector('[data-scene-razor]');
let chargement = null, ouvreur = null;

export function chargerArcade() {
  chargement ??= (async () => {
    grille.innerHTML = await (await fetch('jeux/grille.html')).text();
    if (!window.THREE) window.THREE = await import('three');
    await new Promise((ok, non) => {
      const s = document.createElement('script');
      s.src = 'jeux/jeux.js';
      s.onload = ok; s.onerror = non;
      document.body.append(s);
    });
    traduireJeux();
  })();
  return chargement;
}

// Les jeux viennent du portfolio : leurs textes sont traduits par son moteur, chargé seulement si la page n'est pas en
// français. Le fichier pèse 650 Ko, et la table n'est utile qu'aux jeux.
const MOTEUR = location.hostname.endsWith('github.io') ? '../i18n.js' : 'https://anasdine.github.io/Portfolio/i18n.js';
let moteur = null;
function traduireJeux() {
  if (langue === 'fr' && !moteur) return;
  moteur ??= new Promise((ok, non) => {
    const s = document.createElement('script');
    s.src = MOTEUR;
    s.onload = ok; s.onerror = non;
    document.body.append(s);
  });
  moteur.then(() => window.I18N?.set(langue)).catch(() => {});   // sans le moteur, les jeux restent en français : ils tournent
}

function fermerScene() {
  scene.classList.remove('ouverte');
  document.documentElement.classList.remove('jeu-ouvert');
  grille.querySelector('.actif')?.classList.remove('actif');
  cadre.removeAttribute('src');          // Razor s'arrête vraiment : son, boucle, tout
  cadre.hidden = true;
  ouvreur?.focus();
}

async function ouvrir(id, bouton) {
  ouvreur = bouton;
  scene.classList.add('ouverte');
  document.documentElement.classList.add('jeu-ouvert');
  fermer.focus();
  if (id === 'razor') {
    cadre.hidden = false;
    cadre.src = 'jeux/razor/index.html';
    return;
  }
  await chargerArcade();
  grille.querySelector(`[data-game="${id}"]`)?.classList.add('actif');
  window.I18N?.rescan();
  scene.scrollTop = 0;
}

const liste = document.querySelector('[data-bornes]');
function ecrireBornes() {
  const bornes = BORNES.map(([id, titre, ligne, genre], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'borne';
    b.dataset.lance = id;
    b.innerHTML = `<img src="media/jeux/${id}.jpg" alt="" loading="lazy" width="640" height="360">
    <span class="borne__n">${String(i + 1).padStart(2, '0')} · ${t(genre)}</span><b>${t(titre)}</b><span>${t(ligne)}</span>`;
    return b;
  });
  liste.replaceChildren(...bornes);
}
ecrireBornes();
surLangue(() => { ecrireBornes(); if (chargement) traduireJeux(); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lance]');
  if (b) ouvrir(b.dataset.lance, b);
});
fermer.addEventListener('click', fermerScene);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && scene.classList.contains('ouverte')) fermerScene(); });
