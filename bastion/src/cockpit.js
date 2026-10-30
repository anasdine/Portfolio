// L'écosystème d'ULTRON, dans la salle : l'archipel du vrai cockpit en table au sol, sa carte au plafond, et sa chaîne de
// commandement en bandeau. Aucune donnée réelle. Des textures fixes, animées dans le shader : rien à renvoyer à la carte
// graphique à chaque image, donc aucun coût par image quel que soit le navigateur.
import * as THREE from 'three/webgpu';
import { Fn, uv, time, texture, positionWorld, length, fract, pow, vec2, float, smoothstep } from 'three/tsl';
import { SIMPLE } from './qualite.js';

// Les îles suivent les canaux de lumière du sol : huit directions, en commençant derrière la table.
const ILES = [
  ['PALIER', 'les agents agissent', '#36e0b0'],
  ['PLAN B', 'le parc, les liaisons', '#ff5f8f'],
  ['JARVIS', '', '#5c8dff'],
  ['LEONHARD', '', '#5fd4ff'],
  ['USINE', 'elle produit', '#b6ee4c'],
  ['HERMES', 'transmet, planifie, prévient', '#d9824b'],
  ['SAS', 'rien de client ne sort', '#ff7a6b'],
  ['LEVIER', 'local ⇄ cloud', '#ffc24a'],
];
const CHAINE = 'TOI · tu donnes le cap   →   ULTRON · décide, se souvient   →   HERMES · transmet, planifie, prévient   →   LES BRIQUES · font   ///   SAS : rien de client ne sort   ///   ';

const angleIle = (i) => Math.PI * 2 * ((i + 0.5) / 8 - 0.5);
const graine = (i) => { const s = Math.sin(i * 91.7 + 3.1) * 43758.5; return s - Math.floor(s); };

function carte(rayon, cote, { rIle }) {
  const c = document.createElement('canvas');
  c.width = c.height = cote;
  const g = c.getContext('2d');
  const m = cote / (rayon * 2);          // pixels par mètre
  g.fillStyle = '#000';
  g.fillRect(0, 0, cote, cote);
  g.translate(cote / 2, cote / 2);
  g.scale(m, m);

  // les orbites, et leurs graduations
  for (const [r, teinte, tirets] of [[rIle - 3.4, 'rgba(255,194,74,.5)', []], [rIle, 'rgba(134,169,240,.32)', [0.5, 0.35]], [rIle + 3.4, 'rgba(255,194,74,.28)', [2.2, 0.8]]]) {
    g.strokeStyle = teinte;
    g.lineWidth = 0.05;
    g.setLineDash(tirets);
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
  }
  g.setLineDash([]);
  g.strokeStyle = 'rgba(255,227,163,.4)';
  for (let k = 0; k < 120; k++) {
    const a = k / 120 * Math.PI * 2, l = k % 10 ? 0.22 : 0.6, r = rIle - 3.4;
    g.beginPath(); g.moveTo(Math.cos(a) * r, Math.sin(a) * r); g.lineTo(Math.cos(a) * (r + l), Math.sin(a) * (r + l)); g.stroke();
  }

  ILES.forEach(([nom, role, teinte], i) => {
    const a = angleIle(i);
    const x = Math.cos(a) * rIle, y = Math.sin(a) * rIle;
    // la liaison vers ULTRON
    g.strokeStyle = teinte + '88';
    g.lineWidth = 0.07;
    g.beginPath(); g.moveTo(Math.cos(a) * (rIle - 3.4), Math.sin(a) * (rIle - 3.4)); g.lineTo(x, y); g.stroke();
    // l'île : un contour irrégulier, jamais deux fois le même
    const halo = g.createRadialGradient(x, y, 0, x, y, 2.6);
    halo.addColorStop(0, teinte + '66');
    halo.addColorStop(1, teinte + '00');
    g.fillStyle = halo;
    g.beginPath(); g.arc(x, y, 2.6, 0, Math.PI * 2); g.fill();
    g.beginPath();
    for (let k = 0; k < 9; k++) {
      const b = k / 9 * Math.PI * 2, r = 1.15 + graine(i * 9 + k) * 0.6;
      g[k ? 'lineTo' : 'moveTo'](x + Math.cos(b) * r, y + Math.sin(b) * r);
    }
    g.closePath();
    g.fillStyle = teinte + '30';
    g.fill();
    g.strokeStyle = teinte;
    g.lineWidth = 0.08;
    g.stroke();
    g.fillStyle = '#fff5dc';
    g.beginPath(); g.arc(x, y, 0.2, 0, Math.PI * 2); g.fill();
  });

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}

function bandeau() {
  const c = document.createElement('canvas');
  c.width = 4096; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, c.width, c.height);
  g.font = '500 54px "IBM Plex Mono"';
  g.textBaseline = 'middle';
  // le texte est répété jusqu'au bord, puis resserré juste assez pour boucler sans raccord
  const unite = g.measureText(CHAINE).width;
  const n = Math.max(1, Math.round(c.width / unite));
  g.setTransform(c.width / (unite * n), 0, 0, 1, 0, 0);
  g.fillStyle = '#ffe3a3';
  for (let i = 0; i < n; i++) g.fillText(CHAINE, i * unite, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function etiquette([nom, role, teinte]) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 160;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.fillStyle = teinte;
  g.fillRect(232, 8, 48, 3);
  g.fillStyle = '#f3f1ec';
  g.font = '600 76px "IBM Plex Sans Condensed"';
  g.fillText(nom, 256, 84);
  if (role) {
    g.fillStyle = teinte;
    g.font = '500 30px "IBM Plex Mono"';
    g.fillText(role, 256, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const additif = () => new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });

export function creerCockpit(salle, { SOL, RAYON, HAUT }) {
  const cote = SIMPLE ? 1024 : 2048;

  // La table : l'archipel, posé au sol. Une onde part de la rosace et traverse les îles.
  const R = 21.5;
  const archipel = carte(R, cote, { rIle: 13.6 });
  const matTable = additif();
  matTable.colorNode = Fn(() => {
    const d = length(positionWorld.xz);
    const onde = pow(fract(d.div(16).sub(time.mul(0.11))), 7);
    return texture(archipel).rgb.mul(onde.mul(1.6).add(0.95));
  })();
  const table = new THREE.Mesh(new THREE.RingGeometry(6, R, 128), matTable);
  table.rotation.x = -Math.PI / 2;
  table.position.y = SOL + 0.06;
  salle.add(table);

  // Les noms flottent au-dessus de leur île : posés au sol, on ne les lirait pas sous cet angle.
  ILES.forEach((ile, i) => {
    const mat = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const t = etiquette(ile);
    mat.colorNode = texture(t).rgb;
    mat.opacityNode = texture(t).a;
    const s = new THREE.Sprite(mat);
    s.scale.set(4.4, 1.375, 1);
    const a = angleIle(i);
    s.position.set(Math.cos(a) * 13.6, SOL + 1.5, Math.sin(a) * 13.6);
    salle.add(s);
  });

  // Le plafond : la même carte, sans les noms, autour de la rosace.
  const voute = carte(15.2, cote, { rIle: 11.2 });
  const matCiel = additif();
  matCiel.colorNode = texture(voute).rgb.mul(0.8);
  const ciel = new THREE.Mesh(new THREE.RingGeometry(7.5, 15.2, 96), matCiel);
  ciel.rotation.x = Math.PI / 2;
  ciel.position.y = SOL + HAUT - 0.2;
  salle.add(ciel);

  // Le bandeau : la chaîne de commandement, qui défile au-dessus des panneaux.
  const chaine = bandeau();
  const matChaine = additif();
  matChaine.colorNode = Fn(() => {
    const u = float(1).sub(uv().x).mul(5).add(time.mul(0.012));
    const bords = smoothstep(0, 0.12, uv().y).mul(smoothstep(1, 0.88, uv().y));
    return texture(chaine, vec2(u, uv().y)).rgb.mul(bords).mul(1.1);
  })();
  const anneau = new THREE.Mesh(new THREE.CylinderGeometry(RAYON - 0.5, RAYON - 0.5, 1.55, 128, 1, true), matChaine);
  anneau.position.y = SOL + 15.1;
  salle.add(anneau);
}
