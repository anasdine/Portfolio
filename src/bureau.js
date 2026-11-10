import { time } from './mouvement.js';
// La salle de commandes, à l'intérieur de la tour : une rotonde sombre, une table holographique, et quatre panneaux
// flottants qui portent le contenu du portfolio. Elle occupe vraiment le pied du fût : on y entre sans coupure.
import * as THREE from 'three/webgpu';
import {
  Fn, Discard, uniform, uv,  positionWorld, normalWorld, cameraPosition, reflector, reflect, instanceIndex, texture, positionLocal, smoothstep, mix,
  vec2, vec3, color, float, fract, floor, abs, sin, cos, length, atan, step, hash, pow, fwidth, dot, normalize, max,
} from 'three/tsl';
import { creerCockpit } from './cockpit.js';
import { SIMPLE, MOBILE } from './qualite.js';
import { t, langue, surLangue } from './langues.js';

export const SOL = 21.05;          // le dessus de l'assise, là où la porte débouche
export const RAYON = 29.4;
import { PANNEAUX } from './contenu.js';
export { PANNEAUX } from './contenu.js';

// Le texte est dessiné dans une toile, puis posé sur le panneau : il partage la lumière de la salle.
// Les textes se réécrivent sur la même toile quand la langue change ; les noms propres ne se traduisent pas.
function toilePanneau(contenu, numero) {
  const c = document.createElement('canvas');
  c.width = MOBILE ? 1024 : 2048; c.height = MOBILE ? 576 : 1152;
  const g = c.getContext('2d');
  const t2 = new THREE.CanvasTexture(c);
  t2.colorSpace = THREE.SRGBColorSpace;
  t2.anisotropy = 8;
  const peindre = () => { g.save(); g.scale(c.width / 2048, c.height / 1152); peindrePanneau(g, contenu, numero); g.restore(); t2.needsUpdate = true; };
  peindre();
  surLangue(peindre);
  return t2;
}

function peindrePanneau(g, { titre, lignes, cockpit }, numero) {
  const l = 2048, h = 1152;
  // L'arabe part de la droite : celle du panneau, ou celle de la colonne de texte quand l'archipel occupe la moitié droite.
  const rtl = langue === 'ar', largeur = cockpit ? 920 : l - 240;
  const x0 = rtl ? 120 + largeur : 120;
  g.direction = rtl ? 'rtl' : 'ltr';
  g.textAlign = rtl ? 'right' : 'left';
  g.fillStyle = '#000';
  g.fillRect(0, 0, l, h);
  g.strokeStyle = '#3fd3c6';
  g.lineWidth = 5;
  for (const [x, y, dx, dy] of [[50, 50, 1, 1], [l - 50, 50, -1, 1], [l - 50, h - 50, -1, -1], [50, h - 50, 1, -1]]) {
    g.beginPath();
    g.moveTo(x, y + dy * 80); g.lineTo(x, y); g.lineTo(x + dx * 80, y);
    g.stroke();
  }
  g.fillStyle = '#3fd3c6';
  g.font = '500 44px "IBM Plex Mono"';
  g.fillText(`> bastion/${String(numero + 1).padStart(2, '0')}`, x0, 170);
  g.fillStyle = '#e4e8ea';
  g.font = '600 190px "IBM Plex Sans Condensed", sans-serif';
  g.fillText(t(titre), x0 + (rtl ? 8 : -8), 360, largeur);
  g.fillStyle = '#3fd3c6';
  g.fillRect(rtl ? x0 - 240 : x0, 405, 240, 6);
  let y = 510;
  const corps = cockpit ? 0.8 : 1;
  for (const [texte, fort] of lignes) {
    g.fillStyle = fort ? '#e4e8ea' : '#9aa4ac';
    g.font = fort ? `500 ${Math.round(62 * (cockpit ? 0.8 : 1))}px "IBM Plex Mono", sans-serif` : `400 ${Math.round(50 * (cockpit ? 0.86 : 1))}px "IBM Plex Mono", sans-serif`;
    if (texte) g.fillText(t(texte), x0, y, largeur);    // une traduction plus longue se resserre au lieu de sortir du panneau
    y += (texte ? 86 : 46) * corps;
  }
  if (cockpit) {
    // L'archipel du cockpit : les briques autour de la rosace, qui est posée devant, en 3D.
    const cx = 1500, cy = 590, r = 390;
    g.strokeStyle = 'rgba(255, 194, 74, .55)';
    g.lineWidth = 3;
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(134, 169, 240, .3)';
    g.beginPath(); g.arc(cx, cy, r * 0.76, 0, Math.PI * 2); g.stroke();
    [['Plan B', '#ff5f8f'], ['JARVIS', '#5c8dff'], ['Palier', '#36e0b0'], ['LEONHARD', '#5fd4ff'], ['Usine', '#b6ee4c']].forEach(([nom, teinte], i) => {
      const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      g.strokeStyle = 'rgba(255, 227, 163, .3)';
      g.beginPath(); g.moveTo(cx + Math.cos(a) * 250, cy + Math.sin(a) * 250); g.lineTo(x, y); g.stroke();
      g.fillStyle = teinte;
      g.beginPath(); g.arc(x, y, 20, 0, Math.PI * 2); g.fill();
      g.font = '500 46px "IBM Plex Mono"';
      g.textAlign = 'center';
      g.fillStyle = '#f3f1ec';
      g.fillText(nom, x, y + (Math.sin(a) > 0.1 ? 78 : -40));
      g.textAlign = 'left';
    });
  }
}

export async function creerBureau(scene) {
  await Promise.all([
    document.fonts.load('500 44px "IBM Plex Mono"'),
    document.fonts.load('400 50px "IBM Plex Mono"'),
    document.fonts.load('600 190px "IBM Plex Sans Condensed"'),
  ]);

  const salle = new THREE.Group();
  scene.add(salle);
  const TEAL = color(0x3fd3c6), BLEU = color(0x3f8cff), HAUT = 17;

  // La coque : des panneaux sombres, des lames de lumière verticales. Percée à l'endroit de la porte.
  const matCoque = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  matCoque.colorNode = Fn(() => {
    const p = positionWorld;
    Discard(abs(p.x).lessThan(3.5).and(p.y.lessThan(36)).and(p.z.greaterThan(0)));
    const a = atan(p.z, p.x).div(Math.PI * 2).mul(36);
    const f = fract(a);
    const lame = float(1).sub(smoothstep(0.012, float(0.012).add(fwidth(f).mul(1.2)), abs(f.sub(0.5))));
    const hauteur = p.y.sub(SOL).div(HAUT);
    const module = step(0.3, hash(floor(a).add(0.3)));
    const pouls = sin(time.mul(0.6).add(hash(floor(a)).mul(40))).mul(0.25).add(0.75);
    const bandes = float(1).sub(smoothstep(0.015, 0.03, abs(fract(hauteur.mul(4)).sub(0.5))));
    const fond = mix(color(0x04070f), color(0x0a1220), hauteur);
    return fond.add(TEAL.mul(lame.mul(module).mul(pouls).mul(1.2))).add(BLEU.mul(bandes.mul(0.05)));
  })();
  const coque = new THREE.Mesh(new THREE.CylinderGeometry(RAYON, RAYON, HAUT, 128, 1, true), matCoque);
  coque.position.y = SOL + HAUT / 2;
  salle.add(coque);

  // Un acier sombre, éclairé par un environnement calculé : l'anneau du plafond au-dessus, le teal des lames autour.
  const acier = (albedo) => Fn(() => {
    const n = normalize(normalWorld);
    const v = normalize(positionWorld.sub(cameraPosition));
    const r = reflect(v, n);
    const ciel = smoothstep(0.1, 0.9, r.y).mul(0.75);
    const lames = pow(float(1).sub(abs(r.y)), 3).mul(0.2);
    const fresnel = pow(float(1).sub(max(dot(v.negate(), n), 0)), 4).mul(0.32);
    return albedo.mul(vec3(0.7, 0.86, 1).mul(ciel).add(color(0x3fd3c6).mul(lames)).add(0.05)).add(color(0x8fc8e8).mul(fresnel));
  })();

  // Le sol : des dalles d'acier poli, qui reflètent toute la salle, et des canaux de lumière vers la table.
  const miroir = SIMPLE ? null : reflector({ resolutionScale: 0.35 });
  if (miroir) {
    miroir.target.rotateX(-Math.PI / 2);
    miroir.target.position.y = SOL + 0.03;
    salle.add(miroir.target);
  }
  const matSol = new THREE.MeshBasicNodeMaterial();
  matSol.colorNode = Fn(() => {
    const p = positionWorld.xz;
    const d = length(p);
    const a = atan(p.y, p.x).div(Math.PI * 2).add(0.5);
    const gx = fract(a.mul(48)), gy = fract(d.div(3));
    const aa = fwidth(gy).mul(1.2);
    const joint = float(1).sub(smoothstep(0.01, float(0.01).add(aa), abs(gy.sub(0.5))));
    const jointR = float(1).sub(smoothstep(0.012, float(0.012).add(fwidth(gx).mul(1.2)), abs(gx.sub(0.5))));
    const ton = hash(floor(a.mul(48)).add(floor(d.div(3)).mul(31.7))).mul(0.5).add(0.6);
    const v = normalize(positionWorld.sub(cameraPosition));
    const fresnel = pow(float(1).sub(max(v.y.negate(), 0)), 3);
    const canalA = fract(a.mul(8));
    const canal = float(1).sub(smoothstep(0.004, float(0.004).add(fwidth(canalA).mul(1.2)), abs(canalA.sub(0.5))));
    const flux = pow(fract(d.div(26).add(time.mul(0.14)).add(hash(floor(a.mul(8))))), 10);
    const onde = pow(fract(d.div(30).sub(time.mul(0.12))), 8);
    const lueur = float(1).sub(smoothstep(2, 15, d));
    const base = color(0x070c16).mul(ton).mul(float(1).sub(joint.max(jointR).mul(0.65)));
    return mix(base, miroir ? miroir.rgb : color(0x0b1f3a), fresnel.mul(0.5).add(0.14))
      .add(TEAL.mul(joint.mul(onde).mul(1.3)))
      .add(TEAL.mul(canal.mul(flux.mul(2.4).add(0.1))).mul(smoothstep(5, 7, d)))
      .add(BLEU.mul(lueur.mul(0.2)));
  })();
  const sol = new THREE.Mesh(new THREE.CircleGeometry(RAYON, 128), matSol);
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = SOL + 0.02;
  salle.add(sol);

  // Le plafond : un grand anneau de lumière douce.
  const matPlafond = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  matPlafond.colorNode = Fn(() => {
    const d = length(positionWorld.xz);
    const anneau = smoothstep(15.3, 15.5, d).mul(float(1).sub(smoothstep(15.7, 15.9, d)));
    return color(0x070d18).add(vec3(0.25, 0.83, 0.78).mul(anneau.mul(0.8)));
  })();
  const plafond = new THREE.Mesh(new THREE.CircleGeometry(RAYON, 96), matPlafond);
  plafond.rotation.x = Math.PI / 2;
  plafond.position.y = SOL + HAUT;
  salle.add(plafond);
  const cockpit = creerCockpit(salle, { SOL, RAYON, HAUT });

  // La charpente : nervures le long de la coque, poutres rayonnantes, coursive haute.
  const matAcier = new THREE.MeshBasicNodeMaterial();
  matAcier.colorNode = acier(color(0x5b6675));
  const place = (mesh, n, f) => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), un = new THREE.Vector3(1, 1, 1), axe = new THREE.Vector3(0, 1, 0);
    let i = 0;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      if (!f(a, p)) continue;
      q.setFromAxisAngle(axe, Math.PI / 2 - a);
      mesh.setMatrixAt(i++, m.compose(p, q, un));
    }
    mesh.count = i;
    salle.add(mesh);
  };
  const porteLibre = (a, marge) => Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2))) > marge;
  place(new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, HAUT, 1.5), matAcier, 24), 24, (a, p) => {
    p.set(Math.cos(a) * 28.7, SOL + HAUT / 2, Math.sin(a) * 28.7);
    return porteLibre(a, 0.24);
  });
  place(new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.9, 13), matAcier, 24), 24, (a, p) => {
    p.set(Math.cos(a) * 22.8, SOL + HAUT - 0.5, Math.sin(a) * 22.8);
    return true;
  });

  const coursive = new THREE.Mesh(new THREE.RingGeometry(26, RAYON, 128), new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide }));
  coursive.material.colorNode = acier(color(0x2a3240));
  coursive.rotation.x = -Math.PI / 2;
  coursive.position.y = SOL + 14.2;
  salle.add(coursive);
  const matFilet = new THREE.MeshBasicNodeMaterial();
  matFilet.colorNode = TEAL.mul(1.5);
  for (const y of [14.25, 15.3]) {
    const filet = new THREE.Mesh(new THREE.TorusGeometry(26, y > 15 ? 0.05 : 0.035, 6, 160), y > 15 ? matAcier : matFilet);
    filet.rotation.x = Math.PI / 2;
    filet.position.y = SOL + y;
    salle.add(filet);
  }
  place(new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 1.05, 0.07), matAcier, 96), 96, (a, p) => {
    p.set(Math.cos(a) * 26, SOL + 14.75, Math.sin(a) * 26);
    return true;
  });

  // Les baies : le vrai métier d'Anas, tout autour de la salle. Chaque unité porte ses voyants.
  const matBaie = new THREE.MeshBasicNodeMaterial();
  matBaie.colorNode = Fn(() => {
    const c = uv();
    const face = step(0.5, abs(normalWorld.y).oneMinus());
    const u = c.x.mul(14), v = c.y.mul(42);
    const cx = floor(u), cy = floor(v), fx = fract(u), fy = fract(v);
    const unite = float(1).sub(smoothstep(0.05, float(0.05).add(fwidth(fy).mul(1.2)), abs(fy.sub(0.5)).oneMinus().sub(0.5)));
    const graine = hash(cx.add(cy.mul(71.3)).add(floor(positionWorld.x).mul(3.1)).add(floor(positionWorld.z).mul(7.7)));
    const rond = float(1).sub(smoothstep(0.16, 0.26, length(vec2(fx.sub(0.5), fy.sub(0.5).mul(0.7)))));
    const rythme = sin(time.mul(graine.mul(5).add(0.5)).add(graine.mul(60))).mul(0.5).add(0.5);
    const allume = step(0.72, graine).mul(step(0.25, rythme));
    const couleur = mix(TEAL, color(0xf5a524), step(0.965, graine));
    return color(0x0a0f18).mul(unite.mul(0.7).add(1)).add(couleur.mul(rond.mul(allume).mul(face).mul(2.2)));
  })();
  place(new THREE.InstancedMesh(new THREE.BoxGeometry(2.3, 8.6, 1.7), matBaie, 36), 36, (a, p) => {
    p.set(Math.cos(a) * 27.4, SOL + 4.3, Math.sin(a) * 27.4);
    return porteLibre(a, 0.26) && Math.round((a / Math.PI) * 18) % 6 !== 0;
  });

  // Des faisceaux qui tombent de l'anneau du plafond, dans l'air légèrement chargé de la salle.
  const matFaisceau = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  matFaisceau.colorNode = color(0x7fc4e0);
  matFaisceau.opacityNode = Fn(() => {
    const y = uv().y;
    const n = sin(uv().x.mul(40).add(time.mul(0.2))).mul(0.12).add(0.88);
    return pow(y, 2).mul(0.085).mul(n);
  })();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.39;
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 5.2, HAUT - 0.2, 32, 1, true), matFaisceau);
    cone.position.set(Math.cos(a) * 15.8, SOL + HAUT / 2, Math.sin(a) * 15.8);
    salle.add(cone);
  }

  // La poussière dans la lumière.
  const matPoussiere = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const g = instanceIndex.toFloat();
  const hA = hash(g.add(0.13)), hB = hash(g.add(1.71)), hC = hash(g.add(3.37));
  const aP = hA.mul(Math.PI * 2).add(time.mul(hB.mul(0.03).add(0.006)));
  const rP = hB.oneMinus().pow(0.5).mul(25.5).add(1);
  matPoussiere.positionNode = vec3(cos(aP).mul(rP), float(SOL + 0.3).add(fract(hC.add(time.mul(hA.mul(0.012).add(0.003)))).mul(HAUT - 1)), sin(aP).mul(rP));
  matPoussiere.scaleNode = hA.mul(0.03).add(0.014);
  matPoussiere.colorNode = color(0xa8e4f0).mul(0.9);
  matPoussiere.opacityNode = float(1).sub(smoothstep(0.1, 0.5, length(uv().sub(0.5))));
  const poussiere = new THREE.Sprite(matPoussiere);
  poussiere.count = MOBILE ? 80 : SIMPLE ? 220 : 700;
  poussiere.frustumCulled = false;
  salle.add(poussiere);

  // La table : un socle. La mini-tour LEONHARD qu'elle porte est dans fractale.js.
  const matSocle = new THREE.MeshBasicNodeMaterial();
  matSocle.colorNode = mix(color(0x0a0f18), TEAL, smoothstep(0.92, 1, uv().y).mul(0.9));
  const socle = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.8, 1.1, 64), matSocle);
  socle.position.y = SOL + 0.55;
  salle.add(socle);
  for (const [r, h, y] of [[5.9, 0.28, 0.14], [2.3, 0.1, 1.15]]) {
    const gradin = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.15, h, 64), matAcier);
    gradin.position.y = SOL + y;
    salle.add(gradin);
  }
  const emetteur = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.03, 6, 96), matFilet);
  emetteur.rotation.x = Math.PI / 2;
  emetteur.position.y = SOL + 1.22;
  salle.add(emetteur);

  // Les quatre panneaux, disposés en arc face au centre.
  // La rosace : la vraie géométrie du cockpit, lue dans son SVG, extrudée, avec son dégradé de l'or vers le lapis.
  const svg = await (await fetch('media/rosace.svg')).text();
  const formes = [...svg.matchAll(/points="([^"]+)"/g)].map((m) => {
    const f = new THREE.Shape();
    m[1].trim().split(/\s+/).forEach((p, i) => { const [x, y] = p.split(',').map(Number); if (i) f.lineTo(x, -y); else f.moveTo(x, -y); });
    f.closePath();
    return f;
  });
  const rosace = new THREE.ExtrudeGeometry(formes, { depth: 0.035, bevelEnabled: false, curveSegments: 1 });
  const matRosace = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  matRosace.colorNode = Fn(() => {
    const r = length(positionLocal.xy);
    const a = mix(color(0xffc24a), color(0xffe3a3), smoothstep(0, 0.26, r));
    const b2 = mix(a, color(0xd6e5fa), smoothstep(0.26, 0.4, r));
    const c = mix(b2, color(0x86a9f0), smoothstep(0.4, 0.6, r));
    const d = mix(c, color(0x4361dd), smoothstep(0.6, 0.8, r));
    return mix(d, color(0x2438bc), smoothstep(0.8, 1, r)).mul(1.5);
  })();
  const fleurs = [];
  const matVoute = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  matVoute.colorNode = matRosace.colorNode.mul(0.3);
  const voute = new THREE.Mesh(rosace, matVoute);
  voute.scale.setScalar(7.5);
  voute.rotation.x = Math.PI / 2;
  voute.position.y = SOL + HAUT - 0.15;
  salle.add(voute);
  fleurs.push(voute);

  const matClavier = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  matClavier.colorNode = Fn(() => {
    const c = uv();
    const u = fract(c.x.mul(26)), v = fract(c.y.mul(5));
    const touche = smoothstep(0.08, 0.16, u).mul(smoothstep(0.92, 0.84, u)).mul(smoothstep(0.1, 0.2, v)).mul(smoothstep(0.9, 0.8, v));
    return TEAL.mul(touche.mul(0.4)).mul(hash(floor(c.x.mul(26)).add(floor(c.y.mul(5)).mul(27.1))).mul(0.7).add(0.4));
  })();
  const matEcran = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  matEcran.colorNode = Fn(() => {
    const c = uv();
    const k = floor(c.x.mul(22));
    const haut = sin(time.mul(hash(k).add(0.3)).add(hash(k.add(4)).mul(30))).mul(0.3).add(0.42);
    const f = fract(c.x.mul(22));
    const barre = step(c.y, haut).mul(step(0.2, f)).mul(step(f, 0.8));
    return mix(BLEU, TEAL, c.y).mul(barre.mul(0.75).add(0.05));
  })();

  const matVerre = new THREE.MeshBasicMaterial({ color: 0x040a18, transparent: true, opacity: 0.9, side: THREE.DoubleSide });

  const affichages = PANNEAUX.map((contenu, i) => {
    const angle = -Math.PI / 2 + (i - (PANNEAUX.length - 1) / 2) * 1.02;   // le cockpit, au centre, fait face à la porte
    const carte = toilePanneau(contenu, i);
    const force = uniform(0.35);
    const mat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    mat.colorNode = Fn(() => {
      const c = uv();
      const lignes = sin(c.y.mul(520).add(time.mul(2))).mul(0.06).add(0.94);
      const bord = smoothstep(0, 0.02, c.x).mul(float(1).sub(smoothstep(0.98, 1, c.x))).mul(smoothstep(0, 0.03, c.y)).mul(float(1).sub(smoothstep(0.97, 1, c.y)));
      const fond = mix(BLEU, TEAL, c.x).mul(0.05).mul(bord);
      return texture(carte).rgb.mul(1.5).add(fond).mul(lignes).mul(force);
    })();
    const panneau = new THREE.Mesh(new THREE.PlaneGeometry(21, 11.8), mat);
    const verre = new THREE.Mesh(new THREE.PlaneGeometry(21, 11.8), matVerre);
    verre.position.z = -0.04;
    panneau.add(verre);
    panneau.position.set(Math.cos(angle) * 24, SOL + 8, Math.sin(angle) * 24);
    panneau.lookAt(0, SOL + 5.5, 0);
    salle.add(panneau);
    if (contenu.cockpit) {
      const fleur = new THREE.Mesh(rosace, matRosace);
      fleur.scale.setScalar(2.45);
      fleur.position.set(((1500 / 2048) - 0.5) * 21, (0.5 - 590 / 1152) * 11.8, 0.5);
      panneau.add(fleur);
      fleurs.push(fleur);
    }

    const cadre = new THREE.Mesh(new THREE.BoxGeometry(12, 0.9, 2), matSocle);
    cadre.position.set(Math.cos(angle) * 21.5, SOL + 0.8, Math.sin(angle) * 21.5);
    cadre.lookAt(0, cadre.position.y, 0);
    salle.add(cadre);
    // la console : un clavier de lumière, et deux écrans secondaires dont les barres vivent
    const clavier = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.1), matClavier);
    clavier.position.set(cadre.position.x, SOL + 1.27, cadre.position.z);
    clavier.lookAt(cadre.position.x, SOL + 9, cadre.position.z);
    clavier.rotateZ(Math.atan2(cadre.position.x, cadre.position.z));
    salle.add(clavier);
    for (const cote of [-1, 1]) {
      const b2 = angle + cote * 0.34;
      const ecran = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2), matEcran);
      ecran.position.set(Math.cos(b2) * 21, SOL + 2.5, Math.sin(b2) * 21);
      ecran.lookAt(0, SOL + 3, 0);
      salle.add(ecran);
    }
    return { force, base: 0.35, angle, position: panneau.position.clone(), maille: panneau, largeur: 21, hauteur: 11.8 };
  });

  return {
    salle,
    panneaux: affichages,
    actualiser(foyer, t, plongee = 0) {
      for (const f of fleurs) f.rotation.z = t * 0.06;
      cockpit.voile.value = 1 - plongee;
      for (const [i, a] of affichages.entries()) {
        const cible = 0.18 + 0.82 * Math.max(0, 1 - Math.abs(foyer - i));
        a.base += (cible - a.base) * 0.08;
        a.force.value = a.base * (1 - plongee);       // en traversant le verre, le texte s'efface : il ne reste que sa teinte
      }
    },
  };
}
