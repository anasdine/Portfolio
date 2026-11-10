// Données partagées par le HTML et la scène, sans dépendance graphique.
export const FIN_TRAJET = 0.46;           // on entre dans la salle
export const DEBUT_PANNEAUX = 0.52;       // l'œil a fini d'arriver : le premier panneau est cadré
export const FIN_PANNEAUX = 0.76;         // le dernier panneau a été lu
export const DEBUT_FRACTALE = 0.82;  // on est devant LEONHARD, le zoom commence
export const PERIODES = 3;         // la plongée compte trois niveaux, puis elle débouche sur l'arcade

export const PANNEAUX = [
  {
    titre: 'OFFRE', lignes: [
      ['Indépendant à 20 %, en plus de DM Surfaces', 1],
      ['IA · sites web · applications', 1],
      ['', 0],
      ['Automatisation', 0],
      ['IA hébergée en local', 0],
      ['Rien de ce qui se passe chez un client ne sort d\'ici.', 0],
    ],
  },
  {
    titre: 'PROJETS', lignes: [
      ['ULTRON COCKPIT', 1],
      ['Mon assistance de chaque jour', 0],
      ['LEAP 57', 1],
      ['Boîtier : une vraie conception technique', 0],
      ['Razor, l\'Archonte et treize jeux', 1],
      ['one-cars.fr · vtc-liberty.fr · clean-dream.fr', 0],
      ['lartdorient.fr · dreamforyou.fr', 0],
    ],
  },
  {
    titre: 'ULTRON', cockpit: true, lignes: [
      ['Mon exosquelette d\'IA', 1],
      ['20 min à l\'oral le matin, 20 le soir.', 0],
      ['', 0],
      ['Un routage intelligent entre usines.', 0],
      ['Des centaines d\'agents produisent.', 0],
      ['', 0],
      ['Je décide, j\'envoie les demandes clients.', 0],
      ['Je garde l\'essentiel.', 1],
    ],
  },
  {
    titre: 'PARCOURS', lignes: [
      ['DM Surfaces · 80 %', 1],
      ['Indépendant · 20 %', 1],
      ['', 0],
      ['Administrateur systèmes et réseaux', 0],
      ['Suisse romande', 0],
      ['Autodidacte depuis l\'enfance', 0],
    ],
  },
  {
    titre: 'CONTACT', lignes: [
      ['Anas Dine', 1],
      ['', 0],
      ['Disponible pour vos projets', 0],
      ['IA · sites · applications', 0],
      ['', 0],
      ['Toute la suite est dans cette branche', 0],
    ],
  },
];

