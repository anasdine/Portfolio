# Anas Dine — Portfolio

Portfolio d'un administrateur systèmes et réseaux en Suisse romande, spécialisé en
automatisation et en IA hébergée en local.

Le site tient dans un fichier HTML autonome : aucune dépendance réseau, aucun
service tiers, aucune donnée envoyée nulle part.

**Site :** https://anasdine.github.io *(à adapter)*

---

## Ce qu'il contient

| Section | Contenu |
| --- | --- |
| 01 · Ma conviction | quatre règles de travail, affirmées avant les projets |
| 02 · Ce que je fais | quatre besoins d'entreprise, chacun avec son avant/après dessiné |
| 03 · Projets | Leonhard (mini-SOC · RMM · suivi de parc), le boîtier Leap57, les SaaS verticaux |
| 04 · Parcours | huit ans, poste par poste, avec l'écart mesuré à chaque fois |
| 05 · Contact | LinkedIn, WhatsApp, courriel |
| 06 · Jeux | treize terrains d'essai qui expliquent le métier en jouant |

## Sept langues

Français, anglais, allemand, italien, chinois, arabe (avec mise en page de droite
à gauche) et japonais. Une table de traduction statique couvre l'essentiel du
texte ; le reste est traduit à la demande et mis en cache localement. Les
libellés dessinés sur les canevas d'animation passent par la même chaîne.

## Les jeux

Treize jeux jouables, écrits pour cette page, sans moteur ni ressource externe :

triage d'alertes SOC · pare-feu à tenir · montage de baie (poids, énergie,
ventilation, câblage) · vol 3D dans un corridor de données avec trois vaisseaux
et quatre secteurs · traversée de salle machine · modèle local à élever ·
collecte de paquets · renvoi d'attaques · recherche d'intrusion · inventaire du
parc · temps de réaction · séquence de démarrage · terminal rouge contre bleu.

L'assistant de bord en propose sept de plus : morpion, échecs, dames, coupe de
cartes, rami express, puissance 4, pacman.

## Sous le capot

- **Rendu 3D** — un seul contexte WebGL partagé par toutes les scènes (Three.js),
  recopié dans les toiles 2D de chaque module. Au-delà de six contextes, le
  navigateur en perd.
- **Ordonnanceur d'images** — le budget de peinture est piloté par une moyenne
  glissante du coût réel : sous 9 ms par image, tous les modules visibles sont
  servis ; au-delà, retour automatique au tour de rôle.
- **Quatre paliers matériels** mesurés au chargement : pleine vitesse, 30 i/s,
  une image sur trois sans post-traitement, puis statique.
- **`prefers-reduced-motion`** et petits écrans : une image fixe au lieu d'animer.
- **Fond procédural** — chaos, réseau de neurones, double hélice d'ADN serrée par
  des harnais, puis machines faites de 0 et de 1. Aucune ressource chargée : tout
  est calculé.
- **Assistant** — recherche BM25 sur une base locale, avec repli sur un modèle
  quand la question sort du documenté. Règle absolue : rien de ce qui se passe
  chez un client ne sort d'ici.
- **Effets sonores** synthétisés à la volée dans les jeux. Pas de musique, aucun
  fichier audio.

## Fichiers

```
Calibre AD-2026.dc.html    la page
calibre-engine.js          animations, 3D, jeux, assistant
i18n.js                    table de traduction et moteur de langue
canvas-labels.json         libellés dessinés sur les canevas
anas-dine-portfolio.html   version compilée, un seul fichier
```

## Publier

Le fichier `anas-dine-portfolio.html` est autonome : déposez-le tel quel sur
GitHub Pages, Netlify ou n'importe quel hébergeur statique. Renommé
`index.html`, il n'a besoin de rien d'autre.

```bash
cp anas-dine-portfolio.html index.html
git add index.html && git commit -m "site" && git push
```

## Contact

Anas Dine — Suisse romande
[LinkedIn](https://ch.linkedin.com/in/anas-dine-732921327/en) ·
[WhatsApp](https://wa.me/41774939480) · anas.dine@etik.com

---

Le code de ce dépôt est publié pour lecture. Les textes, les données de parcours
et les visuels restent la propriété d'Anas Dine.
