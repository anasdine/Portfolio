// Ce qui vit autour de la tour : une flotte de navires volants, des robots et des chiens-robots qui patrouillent.
// Tout est construit en géométrie simple et articulé ici : aucun modèle chargé.
import * as THREE from 'three/webgpu';
import { Fn, uv, smoothstep, mix, color, float, vec3 } from 'three/tsl';

const alea = (n) => { const s = Math.sin(n * 91.7 + 17.3) * 43758.5453; return s - Math.floor(s); };

const effile = (x) => 1 - Math.abs(x) ** 2.1 * 0.97;
function effiler(g, lateral) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p[lateral === 'y' ? 'setY' : 'setZ'](i, p[lateral === 'y' ? 'getY' : 'getZ'](i) * effile(p.getX(i)));
  p.needsUpdate = true;
  g.computeVertexNormals();
}

function creerNavire(mats, L) {
  const navire = new THREE.Group();
  const coque = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mats.coque);
  coque.scale.set(L / 2, L * 0.17, L * 0.15);
  effiler(coque.geometry, 'z');
  navire.add(coque);
  const pont = new THREE.Mesh(new THREE.CircleGeometry(1, 28), mats.pont);
  effiler(pont.geometry, 'y');
  pont.rotation.x = -Math.PI / 2;
  pont.scale.set(L / 2, L * 0.15, 1);
  navire.add(pont);
  const chateau = new THREE.Mesh(new THREE.BoxGeometry(L * 0.16, L * 0.075, L * 0.13), mats.coque);
  chateau.position.set(-L * 0.28, L * 0.037, 0);
  navire.add(chateau);
  const quille = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 48), mats.feu);
  effiler(quille.geometry, 'y');
  quille.rotation.x = Math.PI / 2;
  quille.scale.set(L / 2, L * 0.15, 1);
  quille.position.y = -L * 0.012;
  navire.add(quille);
  for (const [x, h, l] of [[L * 0.2, 0.46, 0.2], [-L * 0.06, 0.58, 0.26]]) {
    const mat = new THREE.Mesh(new THREE.CylinderGeometry(L * 0.006, L * 0.01, L * h, 8), mats.coque);
    mat.position.set(x, L * h / 2, 0);
    navire.add(mat);
    // une voile gonflée : un plan courbé par le vent
    const g = new THREE.PlaneGeometry(L * l, L * h * 0.72, 12, 8);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) / (L * l / 2), v = p.getY(i) / (L * h * 0.36);
      p.setZ(i, (1 - u * u) * (1 - v * v * 0.6) * L * 0.05);
    }
    g.computeVertexNormals();
    const voile = new THREE.Mesh(g, mats.voile);
    voile.rotation.y = Math.PI / 2 - 0.42;
    voile.position.set(x, L * h * 0.6, 0);
    navire.add(voile);
  }
  return navire;
}

function membre(parent, mat, l, h, p, x, y, z) {
  const pivot = new THREE.Group();
  pivot.position.set(x, y, z);
  const os = new THREE.Mesh(new THREE.BoxGeometry(l, h, p), mat);
  os.position.y = -h / 2;
  pivot.add(os);
  parent.add(pivot);
  return pivot;
}

function creerRobot(mats) {
  const r = new THREE.Group();
  const corps = new THREE.Group();
  corps.position.y = 2.1;
  r.add(corps);
  const torse = new THREE.Mesh(new THREE.BoxGeometry(1, 1.15, 0.62), mats.robot);
  torse.position.y = 0.72;
  corps.add(torse);
  const bassin = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.5), mats.sombre);
  corps.add(bassin);
  const noyau = new THREE.Mesh(new THREE.CircleGeometry(0.13, 16), mats.feu);
  noyau.position.set(0, 0.8, 0.32);
  corps.add(noyau);
  const tete = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.44), mats.robot);
  tete.position.y = 1.54;
  corps.add(tete);
  const visiere = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.09, 0.02), mats.feu);
  visiere.position.set(0, 1.56, 0.23);
  corps.add(visiere);
  const jambes = [-1, 1].map((c) => {
    const haut = membre(corps, mats.robot, 0.3, 1, 0.34, c * 0.26, -0.1, 0);
    const bas = membre(haut, mats.sombre, 0.24, 1, 0.28, 0, -1, 0);
    const pied = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.56), mats.robot);
    pied.position.set(0, -1.02, 0.1);
    bas.add(pied);
    return { haut, bas };
  });
  const bras = [-1, 1].map((c) => {
    const b = membre(corps, mats.sombre, 0.22, 0.8, 0.24, c * 0.64, 1.2, 0);
    const av = membre(b, mats.robot, 0.2, 0.74, 0.22, 0, -0.8, 0);
    av.rotation.x = -0.35;
    return b;
  });
  return { groupe: r, corps, jambes, bras };
}

function creerChien(mats) {
  const c = new THREE.Group();
  const corps = new THREE.Group();
  corps.position.y = 0.92;
  c.add(corps);
  const dos = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 1.25), mats.robot);
  corps.add(dos);
  const capot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.8), mats.sombre);
  capot.position.y = 0.19;
  corps.add(capot);
  const tete = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.4), mats.robot);
  tete.position.set(0, 0.2, 0.76);
  tete.rotation.x = 0.12;
  corps.add(tete);
  const oeil = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.02), mats.feu);
  oeil.position.set(0, 0.21, 0.97);
  corps.add(oeil);
  const antenne = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.34, 0.02), mats.sombre);
  antenne.position.set(0.12, 0.38, -0.5);
  antenne.rotation.x = -0.4;
  corps.add(antenne);
  const pattes = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([x, z]) => {
    const haut = membre(corps, mats.robot, 0.13, 0.48, 0.15, x * 0.28, -0.04, z * 0.5);
    const bas = membre(haut, mats.sombre, 0.09, 0.5, 0.1, 0, -0.48, 0);
    return { haut, bas };
  });
  return { groupe: c, corps, pattes };
}

export function creerPeuple(dehors, metal) {
  const feu = new THREE.MeshBasicNodeMaterial({ fog: false });
  feu.colorNode = color(0x7ff0e4).mul(2.2);
  const m = (a) => { const x = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide }); x.colorNode = metal(a, vec3(0)); return x; };
  const voile = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
  voile.colorNode = Fn(() => mix(color(0xdce9f6), color(0x8fbce8), smoothstep(0.1, 0.9, float(1).sub(uv().y))))();
  const mats = {
    feu, voile, coque: m(vec3(0.22, 0.25, 0.32)), pont: m(vec3(0.42, 0.34, 0.26)),
    robot: m(vec3(0.72, 0.76, 0.82)), sombre: m(vec3(0.13, 0.15, 0.19)),
  };

  // La flotte : de vrais colosses, assez loin pour que l'air les bleuisse.
  const flotte = [[-250, 150, -120, 150, 1.05], [270, 205, -300, 190, -1.15], [-70, 245, -620, 240, 0.8],
    [520, 120, -760, 220, 1.2], [-640, 130, -880, 260, -1.0], [160, 300, -1100, 280, 0.75], [-360, 62, -300, 90, 1.3]].map(([x, y, z, L, cap], i) => {
    const n = creerNavire(mats, L);
    n.position.set(x, y, z);
    n.rotation.y = cap;
    dehors.add(n);
    return { n, y, cap, vitesse: 3 + alea(i) * 3, base: x };
  });

  const patrouille = (objet, rayon, vitesse, depart) => { dehors.add(objet); return { rayon, vitesse, depart }; };
  let robots0 = 0, chiens0 = 0;
  const robots = [[118, 0.025, 0.42, 5.2], [132, 0.022, 0.2, 4.2], [118, 0.025, 0.62, 5.2], [146, 0.02, 0.5, 6.2], [104, 0.03, 0.3, 3.6]].map(([rayon, v, d, ech]) => {
    const r = creerRobot(mats);
    r.groupe.scale.setScalar(ech);
    return { ...r, ech, couloir: [62, -96, 118, -148, 84][robots0++], ...patrouille(r.groupe, rayon, v, d * Math.PI * 2) };
  });
  const chiens = [[124, 0.03, 0.47, 3.4], [112, 0.034, 0.25, 3], [138, 0.027, 0.58, 3.8], [96, 0.04, 0.36, 2.6], [150, 0.024, 0.14, 4.2]].map(([rayon, v, d, ech]) => {
    const c = creerChien(mats);
    c.groupe.scale.setScalar(ech);
    return { ...c, ech, couloir: [46, -74, 136, -124, 102][chiens0++], ...patrouille(c.groupe, rayon, v, d * Math.PI * 2) };
  });

  const placer = (o, t) => {
    const c = o.couloir, w = (o.vitesse * o.rayon) / 62;
    const z = 128 + Math.sin(t * w + o.depart) * 62;
    const avance = Math.cos(t * w + o.depart) >= 0;
    o.groupe.position.set(c, 0, z);
    const vise = avance ? 0 : Math.PI;
    o.groupe.rotation.y += (vise - o.groupe.rotation.y) * 0.05;
  };

  return {
    actualiser(t) {
      for (const f of flotte) {
        f.n.position.x = f.base + Math.sin(t * 0.03 + f.cap * 4) * 26;
        f.n.position.y = f.y + Math.sin(t * 0.3 + f.cap * 3) * 2.4;
        f.n.rotation.z = Math.sin(t * 0.22 + f.cap) * 0.025;
        f.n.rotation.x = Math.sin(t * 0.17 + f.cap * 2) * 0.016;
      }
      for (const r of robots) {
        placer(r, t);
        const phase = t * (r.rayon * r.vitesse / r.ech) * 2.1 + r.depart * 9;
        r.jambes.forEach(({ haut, bas }, i) => {
          const s = Math.sin(phase + i * Math.PI);
          haut.rotation.x = s * 0.5;
          bas.rotation.x = Math.max(0, -Math.cos(phase + i * Math.PI)) * 0.9;
        });
        r.bras.forEach((b, i) => { b.rotation.x = -Math.sin(phase + i * Math.PI) * 0.4; });
        r.corps.position.y = 2.1 - Math.abs(Math.sin(phase)) * 0.09 + 0.05;
        r.corps.rotation.z = Math.sin(phase) * 0.03;
      }
      for (const c of chiens) {
        placer(c, t);
        const phase = t * (c.rayon * c.vitesse / c.ech) * 3 + c.depart * 7;
        // le trot : les pattes diagonales vont ensemble
        c.pattes.forEach(({ haut, bas }, i) => {
          const d = (i === 0 || i === 3) ? 0 : Math.PI;
          haut.rotation.x = 0.28 + Math.sin(phase + d) * 0.5;
          bas.rotation.x = -0.62 - Math.max(0, Math.cos(phase + d)) * 0.5;
        });
        c.corps.position.y = 0.86 + Math.sin(phase * 2) * 0.018;
        c.corps.rotation.x = Math.sin(phase) * 0.018;
      }
    },
  };
}
