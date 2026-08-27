# Portfolio — Anas Dine

Portfolio d'un administrateur systèmes et réseaux en Suisse romande, spécialisé
en automatisation et en IA hébergée en local.

**Site :** https://anasdine.github.io/Portfolio/

---

## Le dépôt

Il ne contient que ce que la page a besoin de servir :

```
index.html          la page — bibliothèques et polices comprises
calibre-engine.js   animations, 3D, jeux, assistant de bord
i18n.js             table de traduction et moteur de langue
logo-ad.svg         icône d'onglet
apercu.jpg          image de partage
leap57.mp4          repli vidéo du boîtier LEAP 57, pour les appareils sans 3D
leap57-poster.jpg   première image de ce repli
```

Déposé tel quel sur GitHub Pages, Netlify ou n'importe quel hébergeur statique,
le dossier fonctionne. Il n'y a rien à construire, rien à installer.

## Vie privée

- **Aucun cookie, aucun traceur, aucune mesure d'audience.** Ni Google
  Analytics, ni pixel, ni bannière de consentement — il n'y a rien à consentir.
- **Aucune requête vers un tiers.** Polices, bibliothèques et visuels sont
  dans la page : rien n'est chargé depuis un réseau de diffusion, et l'adresse
  IP du visiteur n'est transmise à personne.
- **Aucun formulaire, aucun compte, aucun envoi.** Rien de ce que fait le
  visiteur ne quitte son navigateur.
- **Une seule sortie possible, et sur demande explicite :** l'assistant de bord
  peut consulter Wikipédia si le visiteur allume lui-même le bouton `WEB`.
  Il est éteint par défaut.
- **Préférences locales.** Le navigateur retient la langue, le réglage des
  animations, le son et les meilleurs scores des jeux, sous le préfixe
  `ad2026.`. Ces valeurs ne quittent jamais l'appareil et disparaissent en
  vidant les données du site.
- L'hébergeur journalise les accès comme tout serveur web ; cette page n'y
  ajoute rien.

## Sept langues

Français, anglais, allemand, italien, chinois, arabe (avec mise en page de
droite à gauche) et japonais. Une table de traduction statique couvre le texte
de la page, y compris les libellés dessinés sur les toiles d'animation.

## Sous le capot

- **Rendu 3D** — un seul contexte WebGL partagé par toutes les scènes
  (Three.js), recopié dans les toiles 2D de chaque module.
- **Ordonnanceur d'images** — le budget de peinture suit le coût réel mesuré :
  au-delà du budget, les modules passent au tour de rôle plutôt que de saturer
  l'image.
- **Quatre paliers matériels** mesurés au chargement, du plein régime à
  l'image fixe, avec remontée automatique dès que la machine suit.
- **`prefers-reduced-motion`** respecté : rien ne bouge si le système le
  demande.
- **Fond procédural** — chaos, réseau de neurones, hélice d'ADN, machines
  faites de 0 et de 1. Aucune ressource chargée : tout est calculé, et rendu
  sous la définition de l'écran puisqu'il vit sous le texte.
- **Assistant** — recherche sur une base locale. Règle absolue : rien de ce qui
  se passe chez un client ne sort d'ici.
- **Effets sonores** synthétisés à la volée. Aucun fichier audio.

## Licence

Le code est publié pour lecture. Les textes, les données de parcours et les
visuels restent la propriété d'Anas Dine.

## Contact

[LinkedIn — Anas Dine](https://ch.linkedin.com/in/anas-dine-732921327/en)
