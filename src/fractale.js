// LEONHARD : la mini-tour posée sur la table, et le zoom qui ne s'arrête jamais.
// Chaque tour contient en son cœur une tour K fois plus petite, entourée de quatre satellites. La scène est identique
// à elle-même après un zoom de K, tournée de TORSION : on boucle donc sans couture. Tout ce qui varie (couleur, fondu)
// ne dépend que de la taille à l'écran, jamais de la profondeur : c'est ce qui rend le raccord invisible.
import * as THREE from 'three/webgpu';
import {
  Fn, uniform, uv, positionWorld, cameraPosition, instancedBufferAttribute, texture, smoothstep, mix, vec3, color, float,
  fract, abs, cos, length, log, fwidth,
} from 'three/tsl';

export const K = 7;                 // rapport entre une tour et celle qu'elle contient
export const TORSION = 0.4;                // la spirale du zoom, en radians par niveau
const RAPPORT = 0.34;               // taille d'un satellite
const ECART = 2;                    // distance d'un satellite à l'axe
const HAUT = 6.2, RAYON = 0.75;     // la tour racine, en mètres, sur la table
export const TAU = 1 / 26;                 // en dessous de cette taille à l'écran, une tour s'efface

class Spirale extends THREE.Curve {
  getPoint(t, cible = new THREE.Vector3()) {
    const a = t * Math.PI * 2 * 3.25;
    return cible.set(Math.cos(a) * 1.02, -HAUT / 2 + 0.2 + t * (HAUT - 0.4), Math.sin(a) * 1.02);
  }
}

export function noeuds(seuil) {
  const liste = [];
  const pousser = (x, y, z, e, angle) => {
    liste.push({ x, y, z, e, angle });
    if (e * RAPPORT < seuil) return;
    pousser(x, y, z, e / K, angle + TORSION);
    for (let i = 0; i < 4; i++) {
      const a = angle + Math.PI / 4 + i * (Math.PI / 2);
      pousser(x + Math.cos(a) * ECART * e, y - 1.4 * e, z + Math.sin(a) * ECART * e, e * RAPPORT, a);
    }
  };
  pousser(0, 0, 0, 1, 0);
  return liste;
}

function toileNom() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 180;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, 1024, 180);
  g.fillStyle = '#e4e8ea';
  g.font = '600 118px "IBM Plex Sans Condensed"';
  g.textAlign = 'center';
  g.letterSpacing = '26px';
  g.fillText('LEONHARD', 512, 132);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export async function creerFractale(scene, centre, { allege = false } = {}) {
  await document.fonts.load('600 118px "IBM Plex Sans Condensed"');
  // Le seuil garantit que tout ce qui est visible après un zoom de K existe déjà dans l'arbre.
  const liste = noeuds((allege ? TAU * 2.4 : TAU) / K);
  const groupe = new THREE.Group();
  groupe.position.copy(centre);
  scene.add(groupe);

  const zoom = uniform(1);
  const presence = uniform(1);
  const echelles = new Float32Array(liste.length);
  liste.forEach((n, i) => { echelles[i] = n.e; });
  const aEchelle = instancedBufferAttribute(new THREE.InstancedBufferAttribute(echelles, 1));

  const TEAL = color(0x3fd3c6), BLEU = color(0x3f7dff), PALE = color(0xcfe6ff);
  const taille = aEchelle.mul(zoom);
  // la couleur tourne avec le logarithme de la taille : même teinte, un niveau plus loin
  const phase = fract(log(taille).div(Math.log(K))).mul(Math.PI * 2);
  const onde = (d) => cos(phase.sub(d)).mul(0.5).add(0.5);
  const couleur = TEAL.mul(onde(0)).add(BLEU.mul(onde(2.09))).add(PALE.mul(onde(4.19).mul(0.55)));
  const visible = Fn(() => {
    const parTaille = smoothstep(TAU, TAU * 2.2, taille);
    const parCentre = float(1).sub(smoothstep(4.4, 5.2, length(positionWorld.sub(vec3(centre.x, centre.y, centre.z)))));
    const parOeil = smoothstep(0.15, 1.1, length(positionWorld.sub(cameraPosition)));
    const parGrandeur = float(1).sub(smoothstep(0.9, 3.4, taille).mul(0.9));   // la tour qu'on traverse s'efface devant celles qu'elle contient
    return parTaille.mul(parCentre).mul(parOeil).mul(parGrandeur).mul(presence);
  })();

  const matiere = (colorNode, intensite) => {
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    m.colorNode = colorNode;
    m.opacityNode = visible.mul(intensite);
    return m;
  };

  const matFut = matiere(Fn(() => {
    const c = uv();
    const u = fract(c.x.mul(24)), v = fract(c.y.mul(18));
    const lu = float(1).sub(smoothstep(0.03, float(0.03).add(fwidth(u).mul(1.2)), abs(u.sub(0.5))));
    const lv = float(1).sub(smoothstep(0.03, float(0.03).add(fwidth(v).mul(1.2)), abs(v.sub(0.5))));
    return couleur.mul(lu.max(lv).mul(0.9).add(0.1));
  })(), 0.85);
  const matTrait = matiere(couleur.mul(1.6), 0.9);
  const nom = toileNom();
  const matNom = matiere(texture(nom).rgb.mul(1.5), 0.95);

  const instancier = (geometrie, materiau, placer) => {
    const mesh = new THREE.InstancedMesh(geometrie, materiau, liste.length);
    mesh.frustumCulled = false;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), axe = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3(), s = new THREE.Vector3();
    liste.forEach((n, i) => {
      q.setFromAxisAngle(axe, -n.angle);   // même sens que les positions (x = cos, z = sin)
      p.set(n.x, n.y, n.z);
      s.setScalar(n.e);
      placer?.(p, n);
      mesh.setMatrixAt(i, m.compose(p, q, s));
    });
    groupe.add(mesh);
    return mesh;
  };

  const detail = allege ? 1 : 2;   // chaque triangle est multiplié par le nombre d'exemplaires : on n'en garde aucun d'inutile
  instancier(new THREE.CylinderGeometry(RAYON, RAYON, HAUT, 8 * detail, 1, true), matFut);
  instancier(new THREE.TubeGeometry(new Spirale(), 20 * detail, 0.007, 3, false), matTrait);
  const socle = new THREE.TorusGeometry(1.25, 0.012, 4, 6);
  socle.rotateX(Math.PI / 2);
  socle.translate(0, -HAUT / 2, 0);
  instancier(socle, matTrait);
  const plaque = new THREE.PlaneGeometry(1.5, 0.27);
  plaque.translate(0, -HAUT / 2 - 0.42, 1.28);
  instancier(plaque, matNom);

  return {
    groupe,
    regler(phi, t, p = 1) {
      presence.value = p;
      const f = phi - Math.floor(phi);
      const s = K ** f;
      zoom.value = s;
      groupe.scale.setScalar(s);
      groupe.rotation.y = t * 0.14 + TORSION * f;   // annule exactement la torsion d'un niveau : c'est le raccord
    },
  };
}
