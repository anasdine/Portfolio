import { time } from './mouvement.js';
// Le bastion, calculé en temps réel : three.js r187, WebGPU avec repli WebGL 2, shaders en TSL.
// Tout est à l'échelle réelle, en mètres : 300 m de tour, une caméra à hauteur d'homme, une silhouette de 1,8 m.
// L'immensité vient de là : la perspective, la répétition (joints, lampes, feux de rampe), l'air entre l'œil et le sommet.
// Aucune texture, aucun modèle chargé : tout est calculé.
import * as THREE from 'three/webgpu';
import {
  Fn, Discard, uniform, int, instanceIndex,  uv, luminance, cos, positionWorld, normalWorld, normalWorldGeometry, cameraPosition, screenUV, reflector, reflect,
  mx_noise_float, mx_fractal_noise_float, mx_worley_noise_vec2, hash, fract, floor, step, smoothstep, mix, vec2, vec3, vec4,
  color, float, sin, abs, atan, max, min, pow, clamp, length, dot, normalize, fwidth, pass,
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js';
import { radialBlur } from 'three/addons/tsl/display/radialBlur.js';
import { creerBureau, SOL } from './bureau.js';
import { SIMPLE, MOBILE, TELEPHONE, WEBGL_SEUL } from './qualite.js';
import { creerFractale } from './fractale.js';
import { creerPeuple } from './peuple.js';

// Le calendrier du défilement, de 0 à 1.
export { FIN_TRAJET, DEBUT_PANNEAUX, FIN_PANNEAUX, DEBUT_FRACTALE, PERIODES } from './contenu.js';
import { FIN_TRAJET, DEBUT_PANNEAUX, FIN_PANNEAUX, DEBUT_FRACTALE, PERIODES } from './contenu.js';

const COMPROMIS = new THREE.Color(0xff5c4d);   // accent rouge du portfolio
const RESTAURE = new THREE.Color(0x3fd3c6);    // trait du logo AD

const H = 300;                 // hauteur de la tour, en mètres
const R = 30;                  // rayon du fût
const CIRC = 2 * Math.PI * R;
const CHAMP = 68;              // champ vertical : grand angle, les verticales convergent vers le sommet

// Bruit déterministe côté JS : le décor est le même à chaque chargement.
const alea = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// La rampe qu'un humain devrait gravir : un ruban en hélice, dalle, tranche extérieure et sous-face.
function geoRampe({ rIn, rOut, y0, y1, tours, epaisseur }) {
  const n = Math.ceil(tours * 180);
  const pos = [], uvs = [], idx = [];
  const longueur = Math.hypot(2 * Math.PI * rOut * tours, y1 - y0);
  const bande = (r1, h1, r2, h2) => {
    const base = pos.length / 3;
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = t * Math.PI * 2 * tours, y = y0 + (y1 - y0) * t;
      pos.push(Math.cos(a) * r1, y + h1, Math.sin(a) * r1, Math.cos(a) * r2, y + h2, Math.sin(a) * r2);
      uvs.push(t * longueur, 0, t * longueur, 1);
      if (i < n) {
        const k = base + i * 2;
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
  };
  bande(rIn, 0, rOut, 0);
  bande(rOut, 0, rOut, -epaisseur);
  bande(rOut, -epaisseur, rIn, -epaisseur);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Le liseré lumineux qui suit le bord de la rampe : c'est lui, le halo en spirale.
function geoLisere({ r, y0, y1, tours, haut }) {
  const n = Math.ceil(tours * 180);
  const pos = [], uvs = [], idx = [];
  const longueur = Math.hypot(2 * Math.PI * r * tours, y1 - y0);
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = t * Math.PI * 2 * tours, y = y0 + (y1 - y0) * t;
    pos.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(a) * r, y + haut, Math.sin(a) * r);
    uvs.push(t * longueur, 0, t * longueur, 1);
    if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  return g;
}

function geoPlateau(graine, largeur, profondeur, epaisseur) {
  const forme = new THREE.Shape();
  for (let i = 0, N = 11; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = 0.72 + alea(graine + i) * 0.5;
    const x = Math.cos(a) * largeur * r, z = Math.sin(a) * profondeur * r;
    if (i) forme.lineTo(x, z); else forme.moveTo(x, z);
  }
  forme.closePath();
  const g = new THREE.ExtrudeGeometry(forme, { depth: epaisseur, steps: 1, curveSegments: 1, bevelEnabled: true, bevelThickness: 3, bevelSize: 5, bevelSegments: 1 });
  g.rotateX(Math.PI / 2);
  return g;
}

export async function creerTour(toile, { surFps = () => {}, surEtat = () => {}, surFoyer = () => {}, calme = false, estVisible = () => !document.hidden } = {}) {
  let actif = false, demandeImage = 0;
  const renderer = new THREE.WebGPURenderer({ canvas: toile, antialias: !TELEPHONE, forceWebGL: WEBGL_SEUL });
  await renderer.init();
  renderer.setPixelRatio(Math.min(devicePixelRatio, TELEPHONE ? 0.75 : 1.25));
  renderer.toneMapping = THREE.NeutralToneMapping;   // garde la saturation des bleus, qu'ACES délave
  renderer.toneMappingExposure = 1;
  const backend = renderer.backend.isWebGPUBackend ? 'WebGPU' : 'WebGL 2';

  const scene = new THREE.Scene();
  const dehors = new THREE.Group();
  scene.add(dehors);
  const camera = new THREE.PerspectiveCamera(CHAMP, 16 / 9, 0.4, 9000);

  // L'état du bastion : 0 compromis, 1 restauré.
  const etat = { valeur: 0, cible: 0 };
  const teinte = uniform(COMPROMIS.clone());
  const parasites = uniform(1);

  const AIR = 0x2a56d8;   // la couleur de l'atmosphère, partagée par le brouillard et le ciel à l'horizon
  scene.fog = new THREE.FogExp2(AIR, 0.00042);

  const nuit = uniform(0);
  const ZENITH = color(0x0a0e52), HORIZON = color(0x2c62e6), GLACE = color(0x3a9cf0);
  scene.backgroundNode = Fn(() => {
    const d = normalize(normalWorldGeometry);
    const y = clamp(d.y, 0, 1);
    const degrade = mix(HORIZON, ZENITH, pow(y, 0.5));
    const lueur = pow(float(1).sub(y), 9).mul(0.5);
    const voiles = mx_fractal_noise_float(d.mul(vec3(2.4, 9, 2.4)), 2, 2, 0.5).mul(0.5).add(0.5);
    const nuages = smoothstep(0.5, 0.85, voiles).mul(smoothstep(0, 0.12, y)).mul(float(1).sub(smoothstep(0.2, 0.62, y)));
    return mix(degrade.add(color(0x5a6cf0).mul(lueur)).add(color(0x4a5ae0).mul(nuages.mul(0.2))), color(0x02040c), nuit);
  })();

  // L'environnement est analytique : un ciel, de la glace, une grande source douce et un contre-jour. C'est lui qui
  // sculpte le métal. Une carte d'environnement coûterait plus cher, et ne se règle pas aussi finement.
  const SOURCE = normalize(vec3(-0.42, 0.42, 0.8));
  const CONTRE = normalize(vec3(0.85, 0.2, -0.3));
  const environnement = Fn(([r]) => {
    const ciel = mix(HORIZON, ZENITH, pow(clamp(r.y, 0, 1), 0.55));
    const sol = mix(GLACE, GLACE.mul(0.35), clamp(r.y.negate().mul(2.4), 0, 1));
    const fond = mix(sol, ciel, smoothstep(-0.03, 0.03, r.y));
    const source = pow(max(dot(r, SOURCE), 0), 4).mul(2.5);
    const contre = pow(max(dot(r, CONTRE), 0), 5).mul(0.55);
    return fond.add(vec3(0.88, 0.94, 1).mul(source)).add(vec3(0.35, 0.45, 1).mul(contre));
  });
  const metal = Fn(([albedo, relief]) => {
    const n = normalize(normalWorld.add(relief));
    const v = normalize(positionWorld.sub(cameraPosition));
    const fresnel = pow(float(1).sub(max(dot(v.negate(), n), 0)), 5);
    return environnement(reflect(v, n)).mul(albedo.add(fresnel.mul(0.6)));
  });

  // ── La peau de la tour : grands panneaux, sous-panneaux, meurtrières éclairées, pistes de circuit ─────────────────
  const peau = Fn(() => {
    const c = uv();
    const s = c.x.mul(CIRC);
    const y = c.y.mul(H);
    const aa = fwidth(s).mul(1.2);

    const rang = floor(y.div(24));
    const sp = s.add(fract(rang.mul(0.5)).mul(18));
    const px = fract(sp.div(18)), py = fract(y.div(24));
    const ton = hash(floor(sp.div(18)).add(rang.mul(61.7))).sub(0.5).mul(0.2).add(1);
    const joint = float(1).sub(smoothstep(0.16, float(0.16).add(aa), min(min(px, px.oneMinus()).mul(18), min(py, py.oneMinus()).mul(24))));
    const qx = fract(sp.div(6)), qy = fract(y.div(8));
    const fin = float(1).sub(smoothstep(0.06, float(0.06).add(aa), min(min(qx, qx.oneMinus()).mul(6), min(qy, qy.oneMinus()).mul(8))));

    // coulures sous les joints horizontaux, et brossage vertical du métal
    const coulure = mx_noise_float(vec3(s.mul(0.35), y.mul(0.01), 0)).mul(0.5).add(0.5).mul(py.oneMinus()).mul(0.3);
    const brosse = mx_noise_float(vec3(s.mul(2.2), y.mul(0.025), 3)).mul(0.07).add(1);

    // meurtrières : des milliers de points de lumière, ce qui fait lire une mégastructure et non un cylindre
    const mx = fract(s.div(4)), my = fract(y.div(5.5));
    const id = hash(floor(s.div(4)).add(floor(y.div(5.5)).mul(97.3)));
    const fente = smoothstep(0.2, 0.26, mx).mul(float(1).sub(smoothstep(0.74, 0.8, mx))).mul(smoothstep(0.42, 0.46, my)).mul(float(1).sub(smoothstep(0.54, 0.58, my)));
    const veille = step(0.87, id).mul(sin(time.mul(0.3).add(id.mul(40))).mul(0.3).add(0.7));

    // pistes : un réseau de cuivre de cent mètres, qui bifurque, et une impulsion qui remonte chaque piste
    const tic = floor(time.mul(9));
    const rangee = floor(y.div(7));
    const saut = step(0.95, hash(rangee.add(tic.mul(13.7)))).mul(parasites);
    const u = c.x.mul(16).add(saut.mul(hash(rangee.add(tic)).sub(0.5)).mul(0.3));
    const col = floor(u), fx = fract(u);
    const h = hash(col.add(0.37));
    const v = y.div(46).add(h.mul(3));
    const seg = floor(v), fv = fract(v);
    const decalage = (t) => hash(col.mul(7.13).add(t.mul(3.31))).sub(0.5).mul(0.56);
    const x = mix(decalage(seg.sub(1)), decalage(seg), smoothstep(0, 0.1, fv)).add(0.5);
    const ligne = float(1).sub(smoothstep(0.034, float(0.034).add(fwidth(fx).mul(1.2)), abs(fx.sub(x))));
    const coupe = step(0.2, hash(col.mul(3.71).add(seg.mul(1.93))));
    const p = fract(y.div(230).sub(time.mul(0.11)).add(h.mul(7)));
    const impulsion = smoothstep(0, 0.03, p).mul(float(1).sub(smoothstep(0.03, 0.32, p)));
    const scintille = mix(float(1), hash(tic.add(col)).mul(0.6).add(0.4), parasites.mul(0.5));
    const pistes = ligne.mul(coupe).mul(step(0.45, h)).mul(float(0.5).add(impulsion.mul(3))).mul(scintille);

    const albedo = vec3(0.86, 0.9, 0.95).mul(ton).mul(brosse).mul(float(1).sub(joint.mul(0.75))).mul(float(1).sub(fin.mul(0.22))).mul(float(1).sub(coulure));
    Discard(abs(positionWorld.x).lessThan(3.5).and(y.greaterThan(21)).and(y.lessThan(36)).and(positionWorld.z.greaterThan(0)));
    const penteX = hash(floor(sp.div(18)).add(rang.mul(13.1)));
    const penteY = hash(floor(sp.div(18)).mul(5.3).add(rang));
    const tangente = normalize(vec3(positionWorld.z, 0, positionWorld.x.negate()));
    const biseau = joint.mul(px.sub(0.5)).mul(0.5);
    const relief = tangente.mul(penteX.sub(0.5).mul(0.11).add(biseau)).add(vec3(0, penteY.sub(0.5).mul(0.07), 0));
    const coque = metal(albedo, relief);

    // l'air : plus on monte, plus il y a d'atmosphère entre l'œil et la paroi
    const air = smoothstep(90, 300, y).mul(0.42);
    const voile = mix(coque, color(0x5364dc), air);
    return voile.add(color(0xcfe6ff).mul(fente.mul(veille).mul(1.5))).add(teinte.mul(pistes).mul(2.2));
  })();

  const matPeau = new THREE.MeshBasicNodeMaterial();
  matPeau.colorNode = peau;
  const matSommet = new THREE.MeshBasicNodeMaterial();
  matSommet.colorNode = metal(vec3(0.5, 0.54, 0.6), vec3(0));
  const fut = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 256, 1), [matPeau, matSommet, matSommet]);
  fut.position.y = H / 2;
  dehors.add(fut);

  // ── L'assise : trois gradins hexagonaux, nets et géométriques, et la porte ─────────────────────────────────────────
  const matAssise = new THREE.MeshBasicNodeMaterial();
  matAssise.colorNode = Fn(() => {
    const p = positionWorld;
    const n = normalize(normalWorld);
    const dessus = smoothstep(0.7, 0.95, n.y);
    const pas = fwidth(p.y.div(0.34)).add(fwidth(p.x.div(8)).mul(0.2));
    const proche = float(1).sub(smoothstep(0.08, 0.7, pas));
    const fy = fract(p.y.div(0.34));
    const marches = smoothstep(0.72, 0.86, fy).mul(proche).mul(float(1).sub(dessus));
    const gx = fract(p.x.div(8)), gz = fract(p.z.div(8));
    const aa = fwidth(p.x.div(8)).mul(1.2);
    const dalles = float(1).sub(smoothstep(0.012, float(0.012).add(aa), min(min(gx, gx.oneMinus()), min(gz, gz.oneMinus())))).mul(dessus);
    const ton = hash(floor(p.x.div(8)).add(floor(p.z.div(8)).mul(47.3))).mul(0.14).add(0.93);
    return metal(vec3(0.17, 0.19, 0.23).mul(ton).mul(float(1).sub(marches.mul(0.6))).mul(float(1).sub(dalles.mul(0.7))), vec3(0));
  })();
  for (const [r, y0, y1] of [[R + 62, 0, 7], [R + 46, 7, 14], [R + 30, 14, 21]]) {
    const gradin = new THREE.Mesh(new THREE.CylinderGeometry(r, r, y1 - y0, 6, 1), matAssise);
    gradin.position.y = (y0 + y1) / 2;
    gradin.rotation.y = Math.PI / 6;
    dehors.add(gradin);
    const arete = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.08, r + 0.08, 0.14, 6, 1, true), new THREE.MeshBasicNodeMaterial({ fog: false }));
    arete.material.colorNode = teinte.mul(1.3);
    arete.position.y = y1 - 0.1;
    arete.rotation.y = Math.PI / 6;
    dehors.add(arete);
  }
  const matCeinture = new THREE.MeshBasicNodeMaterial();
  matCeinture.colorNode = metal(vec3(0.3, 0.33, 0.39), vec3(0));
  for (let y = 66; y < H; y += 44) {
    const ceinture = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.7, R + 0.7, 2.4, 128, 1), matCeinture);
    ceinture.position.y = y;
    dehors.add(ceinture);
  }
  const couronne = new THREE.Mesh(new THREE.CylinderGeometry(R + 2, R + 1.2, 7, 128, 1), matCeinture);
  couronne.position.y = H - 1;
  dehors.add(couronne);

  // L'escalier : des dizaines de marches fines. Rien ne donne mieux l'échelle qu'une marche à hauteur de jambe.
  const matEscalier = new THREE.MeshBasicNodeMaterial();
  matEscalier.colorNode = Fn(() => {
    const f = fract(positionWorld.y.div(0.34));
    const proche = float(1).sub(smoothstep(0.1, 0.8, fwidth(positionWorld.y.div(0.34))));
    return metal(vec3(0.26, 0.29, 0.34), vec3(0)).mul(float(1).sub(smoothstep(0.7, 0.86, f).mul(proche).mul(0.7)));
  })();
  const escalier = new THREE.Mesh(new THREE.BoxGeometry(13, 0.5, 35.4), matEscalier);
  escalier.rotation.x = Math.atan2(21, 28);
  escalier.position.set(0, 10.5, 66);
  dehors.add(escalier);

  const matBattant = new THREE.MeshBasicNodeMaterial();
  matBattant.colorNode = Fn(() => {
    const fente = float(1).sub(smoothstep(0, 0.06, abs(uv().x.sub(0.5))));
    return metal(vec3(0.12, 0.14, 0.18), vec3(0)).add(teinte.mul(fente.mul(1.8)));
  })();
  const battants = [-1, 1].map((cote) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(3.6, 15, 0.5), matBattant);
    b.position.set(cote * 1.8, 28.5, R + 0.1);
    scene.add(b);
    return { b, cote };
  });

  // ── La rampe, ses consoles, et le liseré qui la suit ───────────────────────────────────────────────────────────────
  const RAMPE = { y0: 22, y1: 292, tours: 3.25 };
  const matRampe = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  matRampe.colorNode = metal(vec3(0.34, 0.37, 0.43), vec3(0));
  const rampe = new THREE.Mesh(geoRampe({ rIn: R, rOut: R + 4.5, ...RAMPE, epaisseur: 0.8 }), matRampe);
  dehors.add(rampe);

  const matLisere = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  matLisere.colorNode = Fn(() => {
    const m = uv().x;
    const feux = smoothstep(0.55, 0.62, fract(m.div(9)));
    const flux = fract(m.div(150).sub(time.mul(0.1)));
    const vague = float(0.5).add(smoothstep(0.7, 1, flux).mul(2.4));
    const panne = step(0.965, hash(floor(m.div(14)).add(floor(time.mul(7)).mul(5.1)))).mul(parasites);
    return teinte.mul(feux.mul(0.7).add(0.5)).mul(vague).mul(float(1).sub(panne)).mul(2.6);
  })();
  const lisere = new THREE.Mesh(geoLisere({ r: R + 4.6, ...RAMPE, haut: 0.9 }), matLisere);
  lisere.position.y = -0.2;
  dehors.add(lisere);

  const consoles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 1.8, 4.2), matRampe, Math.ceil(RAMPE.tours * 60));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), yAxe = new THREE.Vector3(0, 1, 0), un = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < consoles.count; i++) {
    const t = (i + 0.5) / consoles.count, a = t * Math.PI * 2 * RAMPE.tours;
    const y = RAMPE.y0 + (RAMPE.y1 - RAMPE.y0) * t - 1.6;
    q.setFromAxisAngle(yAxe, Math.PI / 2 - a);
    m.compose(new THREE.Vector3(Math.cos(a) * (R + 2.2), y, Math.sin(a) * (R + 2.2)), q, un);
    consoles.setMatrixAt(i, m);
  }
  dehors.add(consoles);

  // ── L'aura : des volutes de fumée, face caméra, qui montent lentement autour du sommet ─────────────────────────────
  const matFumee = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false });
  matFumee.colorNode = mix(teinte, color(0xffffff), 0.1);
  matFumee.opacityNode = Fn(() => {
    const c = uv().sub(0.5);
    const rond = float(1).sub(smoothstep(0.12, 0.5, length(c)));
    const n = mx_fractal_noise_float(vec3(c.mul(3.2), time.mul(0.05)), SIMPLE ? 2 : 4, 2.1, 0.55).mul(0.5).add(0.5);
    return rond.mul(smoothstep(0.42, 0.8, n)).mul(0.3);
  })();
  for (let i = 0; i < (SIMPLE ? 12 : 34); i++) {
    const a = alea(i + 3) * Math.PI * 2, r = R * (0.95 + alea(i + 9) * 0.34), y = 205 + alea(i + 17) * 112;
    const fumee = new THREE.Sprite(matFumee);
    const taille = 38 + alea(i + 23) * 58;
    fumee.scale.set(taille, taille, 1);
    fumee.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    dehors.add(fumee);
  }

  // ── L'air : des cendres de données qui montent, et une brume basse autour de l'assise ─────────────────────────────
  const matCendres = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const graine = instanceIndex.toFloat();
  const h1 = hash(graine.add(0.11)), h2 = hash(graine.add(1.37)), h3 = hash(graine.add(2.73)), h4 = hash(graine.add(4.19));
  const angleC = h1.mul(Math.PI * 2).add(time.mul(h2.mul(0.02).add(0.006)));
  const rayonC = h3.mul(h3).mul(110).add(R + 3);
  matCendres.positionNode = vec3(cos(angleC).mul(rayonC), fract(h4.add(time.mul(h2.mul(0.006).add(0.002)))).mul(H + 30), sin(angleC).mul(rayonC));
  matCendres.scaleNode = h2.mul(0.28).add(0.14);
  matCendres.colorNode = mix(teinte, color(0xcfe6ff), h1).mul(1.4);
  matCendres.opacityNode = float(1).sub(smoothstep(0.1, 0.5, length(uv().sub(0.5))));
  const cendres = new THREE.Sprite(matCendres);
  cendres.count = MOBILE ? 400 : SIMPLE ? 1200 : 5000;
  cendres.frustumCulled = false;
  dehors.add(cendres);

  const matBrume = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false });
  matBrume.colorNode = color(0xa8d8ff);
  matBrume.opacityNode = Fn(() => {
    const c = uv().sub(0.5);
    const n = mx_fractal_noise_float(vec3(c.mul(vec2(4, 1.6)), time.mul(0.03)), SIMPLE ? 1 : 3, 2, 0.5).mul(0.5).add(0.5);
    return float(1).sub(smoothstep(0.1, 0.5, length(c.mul(vec2(1, 1.8))))).mul(smoothstep(0.35, 0.8, n)).mul(0.13);
  })();
  for (let i = 0; i < 26; i++) {
    const a = alea(i + 41) * Math.PI * 2, r = 96 + alea(i + 47) * 190;
    const nappe = new THREE.Sprite(matBrume);
    nappe.scale.set(150 + alea(i + 53) * 170, 15 + alea(i + 59) * 16, 1);
    nappe.position.set(Math.cos(a) * r, 7, Math.sin(a) * r);
    dehors.add(nappe);
  }

  // ── La chaussée : une ligne droite vers la porte, jalonnée de lampes. C'est elle qui dit la distance ─────────────
  const matChaussee = new THREE.MeshBasicNodeMaterial();
  matChaussee.colorNode = metal(vec3(0.2, 0.22, 0.27), vec3(0));
  const chaussee = new THREE.Mesh(new THREE.BoxGeometry(9, 0.6, 560), matChaussee);
  chaussee.position.set(0, 0.3, 80 + 280);
  dehors.add(chaussee);

  const NB_LAMPES = 37;
  const fuTs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 3.2, 0.16), matRampe, NB_LAMPES * 2);
  const matFeu = new THREE.MeshBasicNodeMaterial({ fog: false });
  matFeu.colorNode = color(0xd8ecff).mul(3);
  const feux = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.14, 0.3), matFeu, NB_LAMPES * 2);
  for (let i = 0; i < NB_LAMPES * 2; i++) {
    const cote = i % 2 ? 1 : -1, z = 84 + Math.floor(i / 2) * 15;
    // côté droit, la caméra coupe la rangée en s'approchant : aucune lampe ne doit lui passer sous le nez
    const ecarte = cote > 0 && z < 240 ? -40 : 0;
    m.makeTranslation(cote * 4.2, 2.2 + ecarte, z);
    fuTs.setMatrixAt(i, m);
    m.makeTranslation(cote * 4.2, 3.8 + ecarte, z);
    feux.setMatrixAt(i, m);
  }
  dehors.add(fuTs, feux);

  // La mesure de tout le reste : une silhouette de 1,8 m, seule sur la chaussée.
  const matSilhouette = new THREE.MeshBasicNodeMaterial();
  matSilhouette.colorNode = color(0x05060f);
  const corps = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.2, 4, 10), matSilhouette);
  corps.position.set(0.6, 1.5, 104);
  const tete = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), matSilhouette);
  tete.position.set(0.6, 2.34, 104);
  dehors.add(corps, tete);

  // ── La glace : un miroir poli, fracturé, parcouru des pistes qui s'échappent de la tour ────────────────────────────
  const miroir = SIMPLE ? null : reflector({ resolutionScale: 0.35 });
  if (miroir) {
    miroir.target.rotateX(-Math.PI / 2);
    dehors.add(miroir.target);
  }
  const pSol = positionWorld.xz;
  if (miroir) miroir.uvNode = miroir.uvNode.add(vec2(
    mx_noise_float(vec3(pSol.mul(0.018), 1.3)).mul(0.006),
    mx_noise_float(vec3(pSol.mul(0.018), 7.1)).mul(0.004),
  ));
  const matGlace = new THREE.MeshBasicNodeMaterial();
  matGlace.colorNode = Fn(() => {
    const p = positionWorld.xz;
    const v = normalize(positionWorld.sub(cameraPosition));
    const fresnel = pow(float(1).sub(max(v.y.negate(), 0)), 4);

    const nappe = mx_fractal_noise_float(vec3(p.mul(0.006), 0), SIMPLE ? 1 : 3, 2, 0.5).mul(0.5).add(0.5);
    const givre = smoothstep(0.52, 0.8, mx_fractal_noise_float(vec3(p.mul(0.03), 4), SIMPLE ? 1 : 3, 2, 0.5).mul(0.5).add(0.5));
    const fond = mix(color(0x1468d0), color(0x4cb6f8), nappe).add(color(0xbfe8ff).mul(givre.mul(0.3)));

    const w = mx_worley_noise_vec2(p.mul(0.014));
    const fissures = float(1).sub(smoothstep(0, 0.035, w.y.sub(w.x)));
    const w2 = mx_worley_noise_vec2(p.mul(0.06));
    const fines = float(1).sub(smoothstep(0, 0.03, w2.y.sub(w2.x))).mul(0.4);

    // le réseau : de larges pistes qui convergent vers la tour, avec des coudes, et une onde qui s'en éloigne
    const d = length(p);
    const secteurs = float(30);
    const angle = atan(p.y, p.x).div(Math.PI * 2).add(0.5).mul(secteurs);
    const k = floor(d.div(70));
    const coude = (t) => hash(t.mul(3.7).add(floor(angle).mul(11.3))).sub(0.5).mul(0.5);
    const a2 = angle.add(mix(coude(k), coude(k.add(1)), smoothstep(0.8, 1, fract(d.div(70)))));
    const sec = floor(a2), fa = fract(a2);
    const largeur = float(0.8).div(d.mul(Math.PI * 2).div(secteurs).add(0.001));
    const ligne = float(1).sub(smoothstep(largeur, largeur.add(fwidth(fa).mul(1.4)), abs(fa.sub(0.5))));
    const portee = float(1).sub(smoothstep(120, 520, d));
    const onde = sin(d.mul(0.05).sub(time.mul(0.8))).mul(0.5).add(0.5);
    const reseau = ligne.mul(step(0.42, hash(sec.add(0.7)))).mul(portee).mul(onde.mul(0.9).add(0.7));

    // la profondeur : des fractures sous la surface, décalées selon l'angle de vue
    const sous = (prof) => p.add(v.xz.div(max(v.y.negate(), 0.05)).mul(prof));
    const w3 = mx_worley_noise_vec2(sous(5).mul(0.024));
    const w4 = mx_worley_noise_vec2(sous(16).mul(0.012));
    const profondes = float(1).sub(smoothstep(0, 0.05, w3.y.sub(w3.x))).mul(0.2).add(float(1).sub(smoothstep(0, 0.07, w4.y.sub(w4.x))).mul(0.12));
    const assise = float(1).sub(smoothstep(64, 112, d)).mul(0.62);
    const glace = fond.add(color(0xc8ecff).mul(fissures.add(fines).mul(0.3))).add(color(0x7ecbff).mul(profondes)).mul(assise.oneMinus());
    return mix(glace, miroir ? miroir.rgb : color(0x1c4fb8), fresnel.mul(0.66).add(0.14)).add(teinte.mul(reseau).mul(1.25));
  })();
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), matGlace);
  sol.rotation.x = -Math.PI / 2;
  dehors.add(sol);

  // ── Les plateaux flottants, loin au-dessus de l'horizon ───────────────────────────────────────────────────────────
  const matPlateau = new THREE.MeshBasicNodeMaterial();
  matPlateau.colorNode = Fn(() => {
    const n = normalize(normalWorld);
    const dessus = smoothstep(0.3, 0.9, n.y);
    const dessous = smoothstep(0.3, 0.9, n.y.negate());
    const cote = mix(color(0x2466d8), color(0x68c4ff), max(dot(n, normalize(vec3(-0.5, 0.2, 0.8))), 0));
    return mix(mix(cote, color(0xc2ecff), dessus), color(0x0b1a66), dessous);
  })();
  const flottants = [];
  [[-980, 130, -620, 150, 80, 38], [-520, 84, -1250, 210, 100, 46], [820, 96, -720, 170, 90, 40],
    [1380, 190, -1180, 240, 120, 52], [-1640, 210, -1120, 260, 130, 56], [240, 66, -1900, 300, 140, 60]].forEach(([x, y, z, l, p, e], i) => {
    const groupe = new THREE.Group();
    groupe.add(new THREE.Mesh(geoPlateau(i * 13 + 2, l, p, e), matPlateau));
    for (let k = 0, n = 3 + (i % 3); k < n; k++) {
      const graine = i * 7 + k * 3;
      const r = 8 + alea(graine) * 16, haut = 40 + alea(graine + 1) * 80;
      const prisme = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.25, r, haut, 6), matPlateau);
      prisme.position.set((alea(graine + 2) - 0.5) * l * 0.9, haut / 2, (alea(graine + 3) - 0.5) * p * 0.8);
      groupe.add(prisme);
    }
    groupe.position.set(x, y, z);
    groupe.userData.base = y;
    dehors.add(groupe);
    flottants.push(groupe);
  });

  // ── Image finale : bloom réservé aux vraies lumières, vignettage léger, grain ─────────────────────────────────────
  const pipeline = new THREE.RenderPipeline(renderer);
  const image = pass(scene, camera, { samples: SIMPLE ? 0 : 2 }).getTextureNode('output');
  const centreRayons = uniform(new THREE.Vector2(0.5, 0.05));
  const forceRayons = uniform(1);
  const lumiere = image.rgb.mul(smoothstep(0.75, 1.3, luminance(image.rgb)));
  const rayons = SIMPLE ? null : radialBlur(vec4(lumiere, 1), { center: centreRayons, weight: float(0.9), decay: float(0.94), count: int(14), exposure: float(1.1), stride: float(1), radius: float(0.8) });
  const nette = SIMPLE ? image : chromaticAberration(image, 0.1, vec2(0.5, 0.5), 1.1);
  // Le bloom ajoute douze dessins et pénalise surtout les images lentes sur téléphone.
  // Les matériaux émissifs, les liserés et les couleurs de la scène restent identiques.
  const eclat = TELEPHONE ? null : bloom(image, 0.42, 0.55, 0.82);
  if (eclat) eclat.setResolutionScale(SIMPLE ? 0.25 : 0.5);
  const fondu = uniform(0);
  // Le tunnel : on vole à l'intérieur de la grille de LEONHARD. Calculé plein écran en coordonnées polaires : la profondeur
  // est l'inverse du rayon. La finesse des lignes suit la taille du pixel à cet endroit, sans dérivée : le raccord de
  // l'angle reste invisible, et le fond ne fourmille pas. Il s'ouvre depuis le centre et avale la fractale.
  const ouverture = uniform(0), avance = uniform(0), format = uniform(16 / 9), elanTunnel = uniform(0);
  const tunnel = Fn(() => {
    const PIXEL = 0.0017;
    const q = screenUV.sub(0.5).mul(vec2(format, 1));
    const rayon = max(length(q), 0.012);
    const prof = float(0.3).div(rayon).add(avance);
    const pasProf = float(0.3 * PIXEL).div(rayon.mul(rayon));
    const pasAngle = float(PIXEL).div(rayon.mul(Math.PI * 2));
    const tour = atan(q.y, q.x).div(Math.PI * 2).add(0.5);
    const vrille = tour.add(prof.mul(0.035));
    // un trait de largeur constante à l'écran : il reste fin au premier plan, et s'efface au lieu de scintiller au loin
    const trait = (u, pas, largeur) => {
      const demi = pas.mul(largeur);
      return float(1).sub(smoothstep(demi, demi.add(pas), abs(fract(u).sub(0.5)))).mul(float(1).sub(smoothstep(0.14, 0.38, pas)));
    };
    const mer = trait(vrille.mul(48), pasAngle.mul(48), float(1.1));
    const parallele = trait(prof.mul(2.2), pasProf.mul(2.2), float(1.1));
    // les étages : des anneaux entiers, chacun découpé en arcs différents, et leur halo
    const etage = floor(prof.mul(0.55));
    const arcs = step(0.38, hash(floor(vrille.mul(12)).add(etage.mul(17.3))));
    const anneau = trait(prof.mul(0.55), pasProf.mul(0.55), float(3)).mul(arcs);
    const halo = pow(float(1).sub(abs(fract(prof.mul(0.55)).sub(0.5)).mul(2)), 9);
    // les filets : de fines traînées de vitesse, qui s'allongent quand on accélère
    const couloir = floor(tour.mul(180));
    const filet = pow(fract(prof.mul(0.09).add(hash(couloir).mul(7))), mix(float(30), float(8), elanTunnel)).mul(step(0.62, hash(couloir.add(3.3))))
      .mul(trait(tour.mul(180), pasAngle.mul(180), float(1)));
    const hauteur = smoothstep(0.03, 0.62, rayon);
    const paroi = mix(color(0x0a2c86), color(0x040a22), hauteur);
    const grille = color(0x3fd3c6).mul(mer.add(parallele).mul(0.42));
    const or = color(0xffc24a);
    const lueurs = mix(color(0x5c8dff), or, step(0.78, hash(etage))).mul(anneau.mul(1.9).add(halo.mul(0.22)));
    const pointe = mix(color(0xcfe6ff), or, step(0.7, hash(couloir.add(9.1)))).mul(filet.mul(2.6));
    // le fond du tunnel : la rosace à huit pétales, qui grandit jusqu'au bam
    const petales = pow(abs(cos(atan(q.y, q.x).mul(4).add(avance.mul(0.08)))), 6);
    const portee = mix(float(0.05), float(0.26), elanTunnel);
    const coeur = smoothstep(portee.mul(1.25).add(petales.mul(portee).mul(0.5)), float(0), rayon);
    const brume = smoothstep(0.45, 0, rayon).mul(0.34);
    const lumiere = mix(color(0xffc24a), color(0xfff5dc), smoothstep(0.2, 0.9, coeur));
    return paroi.add(grille).add(lueurs).add(pointe).mul(smoothstep(0.015, 0.1, rayon).mul(0.8).add(0.2)).add(or.mul(brume)).add(lumiere.mul(coeur.mul(2.4)));
  })();
  pipeline.outputNode = Fn(() => {
    const avecEclat = eclat ? nette.rgb.add(eclat.rgb) : nette.rgb;
    const c = rayons ? avecEclat.add(rayons.rgb.mul(forceRayons).mul(0.45)) : avecEclat;
    const centre = screenUV.sub(0.5).mul(vec2(1, 0.8));
    const vignette = float(1).sub(smoothstep(0.42, 1, length(centre))).mul(0.32).add(0.68);
    const grain = fract(sin(dot(screenUV.add(fract(time)), vec2(12.9898, 78.233))).mul(43758.5453)).sub(0.5);
    // Le portail : un anneau net et lumineux, qui vient vers l'œil de plus en plus vite et l'avale. Sans bord, on ne verrait
    // qu'un fondu entre deux images, et rien ne dirait qu'on passe de l'autre côté.
    const bord = ouverture.mul(ouverture).mul(1.9);
    const distance = length(screenUV.sub(0.5).mul(vec2(format, 1)));
    const ouvert = step(0.001, ouverture);
    const dansTunnel = float(1).sub(smoothstep(bord.sub(0.012), bord, distance)).mul(ouvert);
    const anneauPortail = pow(float(1).sub(smoothstep(0, float(0.05).add(bord.mul(0.1)), abs(distance.sub(bord)))), 2).mul(ouvert).mul(float(1).sub(smoothstep(0.92, 1, ouverture)));
    const vue = mix(c.mul(vignette), tunnel, dansTunnel).add(mix(color(0x3fd3c6), color(0xffc24a), smoothstep(0, 0.5, bord)).mul(anneauPortail.mul(2.6))).add(grain.mul(0.014));
    // la sortie : la rosace s'ouvre en iris jusqu'à remplir l'écran, le relais est pris par l'éclair de l'arcade
    const irisR = fondu.mul(1.5);
    const iris = float(1).sub(smoothstep(irisR.sub(0.2), irisR, length(screenUV.sub(0.5).mul(vec2(format, 1))))).mul(step(0.001, fondu));
    return vec4(mix(vue, vec3(1, 0.96, 0.86), iris), 1);
  })();

  const peuple = creerPeuple(dehors, metal);
  const bureau = await creerBureau(scene);
  const CENTRE = new THREE.Vector3(0, SOL + 4.3, 0);
  const fractale = await creerFractale(scene, CENTRE, { allege: SIMPLE });

  // ── Le trajet : le défilement pilote tout. Dehors, la chaussée, l'escalier, les portes ; dedans, les panneaux ──────
  const CHEMIN = new THREE.CatmullRomCurve3([
    new THREE.Vector3(9, 1.9, 205), new THREE.Vector3(3, 2, 142), new THREE.Vector3(0, 2.1, 92),
    new THREE.Vector3(0, 13, 70), new THREE.Vector3(0, 23.6, 48), new THREE.Vector3(0, 23.8, 31),
    new THREE.Vector3(0, SOL + 3, 16), new THREE.Vector3(0, SOL + 3.2, 7.5),
  ], false, 'catmullrom', 0.5);
  const adoucir = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const vise = new THREE.Vector3(), cibleVue = new THREE.Vector3(), pos = new THREE.Vector3(), sommet = new THREE.Vector3(), orbite = new THREE.Vector3(), vise2 = new THREE.Vector3();
  const devant = new THREE.Vector3(0, SOL + 4.3, 4);
  let roulis = 0, presence = 1;
  const plongee = { cible: 0, temps: 0, valeur: 0 }, devantPanneau = new THREE.Vector3();
  const souris = { x: 0, y: 0, lx: 0, ly: 0 };
  addEventListener('pointermove', (e) => {
    if (calme || e.pointerType !== 'mouse') return;
    souris.x = e.clientX / innerWidth - 0.5;
    souris.y = e.clientY / innerHeight - 0.5;
  }, { passive: true });
  const defilement = { cible: 0, valeur: 0 };
  let foyer = -1, champ = CHAMP;

  // Dans la salle, l'œil tourne autour de l'hologramme : en ligne droite, il le traverserait.
  function enArc(de, vers, x) {
    const r0 = Math.hypot(de.x, de.z), r1 = Math.hypot(vers.x, vers.z);
    const a0 = Math.atan2(de.z, de.x);
    const a1 = a0 + THREE.MathUtils.euclideanModulo(Math.atan2(vers.z, vers.x) - a0 + Math.PI, Math.PI * 2) - Math.PI;
    const r = THREE.MathUtils.lerp(r0, r1, x), a = THREE.MathUtils.lerp(a0, a1, x);
    de.set(Math.cos(a) * r, THREE.MathUtils.lerp(de.y, vers.y, x), Math.sin(a) * r);
  }

  function placerCamera(q, t, dt) {
    // Le chemin est parcouru à vitesse constante : ses points de passage ne sont pas régulièrement espacés, et sans cette
    // correction l'œil piétine sur l'escalier avant de franchir la porte d'un coup.
    const p = q < FIN_TRAJET ? CHEMIN.getUtoTmapping(q / FIN_TRAJET) * FIN_TRAJET : q;
    if (p < FIN_TRAJET) {
      CHEMIN.getPoint(p / FIN_TRAJET, pos);
      const vers = adoucir(0.08, 0.34, p);
      vise.set(0, THREE.MathUtils.lerp(106, 25, vers), THREE.MathUtils.lerp(0, 8, vers));
      if (p > 0.34) vise.lerp(cibleVue.set(0, SOL + 3.2, 0), adoucir(0.34, FIN_TRAJET, p));
      foyer = -1;
    } else {
      // dans la salle : l'œil se place de biais, le panneau occupe la droite du cadre et l'hologramme la gauche
      const e = Math.min(1, Math.max(0, p - DEBUT_PANNEAUX) / (FIN_PANNEAUX - DEBUT_PANNEAUX)) * (bureau.panneaux.length - 1);
      const i = Math.floor(e), f = e - i;
      const dernier = bureau.panneaux.length - 1;
      const a0 = bureau.panneaux[Math.min(i, dernier)], a1 = bureau.panneaux[Math.min(i + 1, dernier)];
      const vertical = camera.aspect < 1;
      const angle = THREE.MathUtils.lerp(a0.angle, a1.angle, f) + Math.PI + (vertical ? 0 : 0.49);
      const recul = vertical ? Math.min(15, Math.max(7, 11.8 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect) - 24)) : 7;
      orbite.set(Math.cos(angle) * recul, SOL + 3.4, Math.sin(angle) * recul);
      vise2.lerpVectors(a0.position, a1.position, f).multiplyScalar(0.95);
      vise2.y = SOL + 7.2;
      const arrivee = THREE.MathUtils.clamp((p - FIN_TRAJET) / (DEBUT_PANNEAUX - FIN_TRAJET), 0, 1);
      CHEMIN.getPoint(1, pos);
      enArc(pos, orbite, arrivee);
      vise.set(0, SOL + 3.2, 0).lerp(vise2, arrivee);
      foyer = p < FIN_PANNEAUX ? i + f : -1;
      // puis l'œil revient face à la mini-tour, et s'en approche
      const retour = THREE.MathUtils.clamp((p - FIN_PANNEAUX) / (DEBUT_FRACTALE - FIN_PANNEAUX), 0, 1);
      enArc(pos, devant, retour);
      vise.lerp(CENTRE, retour);
    }
    plongee.temps = THREE.MathUtils.clamp(plongee.temps + (plongee.cible ? dt : -dt) / 0.85, 0, 1);
    plongee.valeur = (1 - Math.cos(plongee.temps * Math.PI)) / 2;
    if (plongee.valeur > 0.001 && foyer >= 0) {
      const a = bureau.panneaux[Math.round(foyer)];
      devantPanneau.copy(a.position);
      devantPanneau.x *= 1 - 2.4 / 24;
      devantPanneau.z *= 1 - 2.4 / 24;
      pos.lerp(devantPanneau, plongee.valeur * 0.18);     // une simple poussée : c'est le verre qui vient à l'œil, pas l'inverse
      vise.lerp(a.position, plongee.valeur * 0.35);
    }
    const poidsDehors = 1 - adoucir(0.3, FIN_TRAJET, p);
    // Le grand écart de la souris n'existe qu'au large : la porte fait dix mètres, il faut être dans l'axe bien avant elle.
    const large = 1 - adoucir(0.1, 0.22, p);
    camera.position.set(pos.x + souris.lx * (large * 24 + 1.2) + (calme ? 0 : Math.sin(t * 0.07) * 3 * large), pos.y - souris.ly * 0.8, pos.z);
    camera.lookAt(vise.x + souris.lx * 1.4, vise.y - souris.ly * (large * 10 + 0.7), vise.z);
    // la plongée : le monde s'éteint, la caméra roule lentement, le zoom ne dépend que du défilement
    const dansLeZoom = adoucir(DEBUT_FRACTALE - 0.02, DEBUT_FRACTALE + 0.02, p);
    if (!calme) roulis += dt * 0.05 * dansLeZoom;
    camera.rotateZ(roulis);
    const phi = Math.min(PERIODES - 0.001, Math.max(0, (p - DEBUT_FRACTALE) / (1 - DEBUT_FRACTALE)) * PERIODES);
    // devant un panneau, l'hologramme se retire pour laisser lire
    const viseePresence = foyer >= 0 ? (camera.aspect < 1 ? 0.05 : 0.18) : 1;
    if (calme) presence = viseePresence;
    presence += (viseePresence - presence) * 0.08;
    fractale.regler(phi, t, presence * (1 - plongee.valeur));
    nuit.value = adoucir(DEBUT_FRACTALE, DEBUT_FRACTALE + (1 - DEBUT_FRACTALE) / PERIODES, p);
    bureau.salle.visible = nuit.value < 0.995 && p > 0.22;   // inutile de rendre la salle (et son miroir) depuis l'extérieur
    for (const { b } of battants) b.visible = nuit.value < 0.995;
    const fov = THREE.MathUtils.lerp(CHAMP, camera.aspect < 1 ? CHAMP : 52, adoucir(0.18, FIN_TRAJET, p));
    if (Math.abs(fov - champ) > 0.01) { champ = fov; cadrer(); }

    for (const { b, cote } of battants) b.position.x = cote * (1.8 + 3.7 * adoucir(0.2, 0.26, p));
    dehors.visible = p < FIN_TRAJET + 0.02;
    forceRayons.value = poidsDehors;
    // la dernière ligne droite : le tunnel s'ouvre, accélère de plus en plus, puis tout blanchit
    ouverture.value = adoucir(0.875, 0.955, p);
    fractale.groupe.visible = ouverture.value < 0.98;   // une fois le tunnel plein écran, rien ne sert de la dessiner
    const elan = adoucir(0.885, 1, p);
    avance.value = t * 0.35 + elan * elan * 26;
    elanTunnel.value = elan;
    format.value = camera.aspect;
    fondu.value = adoucir(0.975, 0.998, p);
    camera.updateMatrixWorld();
    sommet.set(0, H, 0).project(camera);
    centreRayons.value.set(sommet.x * 0.5 + 0.5, 0.5 - sommet.y * 0.5);
  }

  const cadrer = () => {
    camera.fov = camera.aspect > 16 / 9
      ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(champ / 2)) * (16 / 9) / camera.aspect))
      : champ;
    camera.updateProjectionMatrix();
  };
  const redimensionner = () => {
    const l = toile.clientWidth, h = toile.clientHeight;
    if (!l || !h) return;
    renderer.setSize(l, h, false);
    camera.aspect = l / h;
    cadrer();
    demanderImage();
  };
  new ResizeObserver(redimensionner).observe(toile);
  redimensionner();

  const horloge = new THREE.Timer();
  let images = 0, depuis = performance.now();
  // Comme igloo.inc : si l'image n'est plus tenue, on baisse la définition, puis on la remonte par petits pas. Après
  // plusieurs allers-retours, on s'arrête : une définition stable se remarque moins qu'une qui oscille.
  const PALIERS = TELEPHONE ? [0.75, 0.65] : [1.25, 1, 0.8, 0.65];
  let palier = TELEPHONE ? 0 : SIMPLE ? 1 : 0, basculements = 0, demarrage = performance.now();
  const reglerDefinition = (fps) => {
    if (basculements >= 4 || performance.now() - demarrage < 9000) return;
    const vise = Math.min(devicePixelRatio, PALIERS[0]);
    if (fps < 42 && palier < PALIERS.length - 1) palier++;
    else if (fps > 57 && palier > 0 && PALIERS[palier - 1] <= vise) palier--;
    else return;
    basculements++;
    renderer.setPixelRatio(Math.min(devicePixelRatio, PALIERS[palier]));
    redimensionner();
  };
  // Comme igloo.inc : tout est calculé avant le premier mouvement. La scène se dessine une fois à chaque endroit du trajet
  // pendant que la vidéo tourne devant elle, et plus aucun shader ne se compile en plein défilement.
  // Il faut la vraie boucle d'images : hors d'elle, three.js ne remet pas à jour les miroirs et les passes d'une image à l'autre.
  function chauffer() {
    let p = 0.01;
    const fin = () => { renderer.setAnimationLoop(null); placerCamera(defilement.valeur, 0, 0); };
    return Promise.race([
      new Promise((ok) => renderer.setAnimationLoop(() => {
        if (!estVisible()) { ok(); return; }
        placerCamera(p, 0, 0);
        bureau.actualiser(foyer, 0, 0);
        if (dehors.visible) peuple.actualiser(0);
        pipeline.render();
        p += 0.02;
        if (p >= 1) ok();
      })),
      new Promise((ok) => setTimeout(ok, 6000)),                   // onglet en arrière-plan : pas d'images, on ne bloque pas
    ]).then(fin);
  }
  if (!TELEPHONE && !calme && !document.hidden) await chauffer();

  function dessiner() {
    if (!estVisible()) { actif = false; renderer.setAnimationLoop(null); return; }
    horloge.update();
    const dt = Math.min(horloge.getDelta(), 0.1), t = calme ? 0 : horloge.getElapsed();
    if (calme) etat.valeur = etat.cible;
    etat.valeur += (etat.cible - etat.valeur) * (1 - Math.exp(-dt * 1.6));
    teinte.value.lerpColors(COMPROMIS, RESTAURE, etat.valeur);
    parasites.value = 1 - etat.valeur;
    surEtat(etat.valeur);

    if (calme) {
      souris.x = souris.y = souris.lx = souris.ly = 0;
      defilement.valeur = defilement.cible;
    } else {
      souris.lx += (souris.x - souris.lx) * (1 - Math.exp(-dt * 1.6));
      souris.ly += (souris.y - souris.ly) * (1 - Math.exp(-dt * 1.6));
      defilement.valeur += (defilement.cible - defilement.valeur) * (1 - Math.exp(-dt * 3.2));
    }
    placerCamera(defilement.valeur, t, dt);
    bureau.actualiser(foyer, t, plongee.valeur);
    if (dehors.visible) peuple.actualiser(t);
    surFoyer(foyer);
    if (dehors.visible) for (const [i, f] of flottants.entries()) f.position.y = f.userData.base + Math.sin(t * 0.18 + i * 1.7) * 3;

    pipeline.render();
    images++;
    const maintenant = performance.now();
    if (maintenant - depuis >= 1000) { const mesure = Math.round((images * 1000) / (maintenant - depuis)); surFps(mesure); if (document.visibilityState === 'visible') reglerDefinition(mesure); images = 0; depuis = maintenant; }
  }

  function demanderImage() {
    if (actif && calme && !document.hidden && !demandeImage) demandeImage = requestAnimationFrame(() => { demandeImage = 0; dessiner(); });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { renderer.setAnimationLoop(null); cancelAnimationFrame(demandeImage); demandeImage = 0; }
  });
  return {
    backend,
    mouvementReduit(v) {
      if (calme === v) return;
      calme = v;
      renderer.setAnimationLoop(actif && !calme && !document.hidden ? dessiner : null);
      demanderImage();
    },
    demarrer() {
      if (actif || document.hidden) return;
      actif = true; images = 0; depuis = demarrage = performance.now();
      if (calme) demanderImage(); else renderer.setAnimationLoop(dessiner);
    },
    arreter() { actif = false; renderer.setAnimationLoop(null); cancelAnimationFrame(demandeImage); demandeImage = 0; },
    viser(v) { etat.cible = v; demanderImage(); },
    defiler(p) { if (defilement.cible !== p) { defilement.cible = p; demanderImage(); } },
    poser(p) { defilement.cible = p; defilement.valeur = p; demanderImage(); },
    decaler(dp) { defilement.cible += dp; defilement.valeur += dp; },
    plonger(oui) { plongee.cible = oui ? 1 : 0; },
    // les quatre coins du verre à l'écran, pour que la page en sorte exactement
    cadrePanneau(i) {
      const a = bureau.panneaux[i], l = a.largeur / 2, h = a.hauteur / 2;
      return [[-l, h], [l, h], [l, -h], [-l, -h]].map(([x, y]) => {
        const c = a.maille.localToWorld(new THREE.Vector3(x, y, 0)).project(camera);
        return `${((c.x + 1) * 50).toFixed(2)}% ${((1 - c.y) * 50).toFixed(2)}%`;
      });
    },
    get etat() { return etat.valeur; },
    // pour le mode diagnostic : ce que le moteur fait vraiment à cet instant
    lourds() {
      const l = [];
      scene.traverse((o) => {
        if (!o.geometry) return;
        const g = o.geometry, n = (g.index ? g.index.count : g.attributes.position?.count || 0) / 3 * (o.count ?? 1);
        l.push([Math.round(n), o.type, g.type, o.count ?? 1, o.material?.transparent ? 't' : 'o', o.visible]);
      });
      return l.sort((a, b) => b[0] - a[0]).slice(0, 18);
    },
    stats() {
      const i = renderer.info.render;
      return { backend, actif, calme, telephone: TELEPHONE, bloom: !!eclat, rayons: !!rayons, aberration: nette !== image, echantillons: SIMPLE ? 0 : 2, ombres: renderer.shadowMap.enabled, palier: PALIERS[palier], toile: toile.width + '×' + toile.height, appels: i.drawCalls, triangles: i.triangles, p: +defilement.valeur.toFixed(3), foyer: +foyer.toFixed(2) };
    },
  };
}
