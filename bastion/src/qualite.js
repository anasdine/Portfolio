// Le profil de la machine, décidé une fois pour toutes avant de construire la scène. Le profil simple n'est pas un secours :
// c'est la même salle, sans miroirs ni effets d'image, pensée pour tourner d'emblée sur un vieux téléphone ou un ancien PC.
// WebGPU n'est fiable que sur les navigateurs Chromium : ailleurs, WebGL 2 tourne partout.
export const WEBGL_SEUL = !navigator.userAgent.includes('Chrome/');
const coeurs = navigator.hardwareConcurrency || 4, memoire = navigator.deviceMemory || 8;
export const SIMPLE = new URLSearchParams(location.search).has('simple')
  || matchMedia('(pointer: coarse)').matches || innerWidth < 820 || coeurs <= 4 || memoire <= 4 || !navigator.gpu || WEBGL_SEUL;
