import { time as tempsReel, uniform } from 'three/tsl';
const media = matchMedia('(prefers-reduced-motion: reduce)');
const facteur = uniform(media.matches ? 0 : 1);
export const time = tempsReel.mul(facteur);
media.addEventListener('change', () => { facteur.value = media.matches ? 0 : 1; });
