# Feuille de route — portfolio Anas Dine

Dépôt de référence : `C:\Users\user\Documents\GitHub\Portfolio`
En ligne : <https://anasdine.github.io/Portfolio/> — GitHub Pages, branche `main`, racine.

---

## 1. Ce qu'il faut savoir avant de toucher au code

### La règle qui commande tout

`i18n.js` porte une table indexée par la **chaîne française exacte** :

```js
'chaîne française': ['en', 'de', 'it', 'zh', 'ar', 'ja', 'de-CH'],
```

**Une chaîne absente de cette table reste en français.** Il n'existe aucun repli.

Le repli automatique (`tAuto` → `pumpAuto`) exige `window.claude.complete`, l'API du
runtime Claude Design. Elle n'existe pas sur GitHub Pages : la file est vidée en
silence par `if(!(window.claude && window.claude.complete)) { AQ.length = 0; return; }`.
C'est la cause racine de **tous** les bugs de langue signalés au départ : le site
paraissait traduit en préversion, et ne l'était plus une fois publié.

### Les marqueurs `#`

Les textes dessinés sur les toiles passent par une interception de
`CanvasRenderingContext2D.prototype.fillText`. Les nombres y sont remplacés par `#`,
puis réinjectés. Garde-fou du moteur :

```js
var parts = got.split('#');
if(parts.length !== nums.length + 1) return t;   // compte différent -> français
```

Toute traduction doit donc porter **exactement le même nombre de `#`** que la source,
sinon elle est ignorée en silence.

### Structure des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | l'artefact publié, 1,1 Mo : un manifeste (librairies + polices, gzip/base64) et un gabarit HTML de 195 Ko encodé en chaîne JSON |
| `i18n.js` | moteur de traduction et table, **chargé en voisin** par index.html |
| `calibre-engine.js` | moteur 3D, canvas, jeux, assistante — **chargé en voisin** |
| `leap57-modele.js` | modèle du boîtier, embarqué dans le bundle |
| `Calibre AD-2026.dc.html` | page source au format « dc » |
| `leap57.mp4` / `leap57-poster.jpg` | vidéo mobile du boîtier |
| `apercu.jpg` | image d'aperçu de partage, 1200×630 |

`index.html` **charge `i18n.js` et `calibre-engine.js` en direct** : les corriger suffit,
aucune régénération de bundle n'est nécessaire. Le `<head>` est posé aux **deux**
endroits — l'externe pour les robots de partage qui n'exécutent pas JavaScript,
celui du gabarit pour l'onglet du navigateur.

### Zone interdite

**LEAP57 est une vraie conception technique du propriétaire.** Ne jamais toucher
aux cotes, à la géométrie ni à la structure du boîtier. Seuls ses **libellés** et
sa **manière d'être affiché** (vidéo sur mobile) sont modifiables.

`uploads/` et `screenshots/` sont dans `.gitignore` : dépôt public servi par Pages,
ils n'ont rien à y faire.

---

## 2. Fait

### Publication et identité
- Compte renommé `Jeandujardin88` → `anasdine`, dépôt republié, remote corrigé.
- `index.html` était **absent du dépôt** (supprimé au commit `b5f64c1`) : c'était le
  bug initial « quand je clique ça n'ouvre rien ».
- `<title>` valait « Bundled Page » à l'extérieur et **la chaîne vide** dans le
  gabarit. Titre, description, Open Graph, Twitter Card, `lang`, canonical et
  favicon posés. Aperçu de partage dessiné aux couleurs du site.

### Traductions — table passée de 493 à ~1 530 entrées, toutes à 7 colonnes
- 48 libellés du document (49 → 1 chaîne française restante en EN et DE).
- **95 traductions japonaises manquantes** : 113 rangées n'avaient que 5 colonnes,
  la table `JA` de secours n'en couvrait que 18. Toute la navigation sortait en
  français en japonais.
- **Suisse allemand (`de-CH`) ajouté en 8ᵉ langue**, code BCP-47 complet.
- 900 chaînes des moteurs (toiles, jeux, assistante), en deux passes — la seconde
  sans filtre linguistique, le premier détecteur ayant raté `PARE-FEU`,
  `force brute`, `scan de ports` faute d'accent.
- 197 entrées issues de l'audit + les 3 titres animés de la section 03.
- **Paragraphe-manifeste** (section 01) : restait en français puis se tronquait sur
  « My job is ». Deux défauts enchaînés, corrigés.
- **Cinq entrées avaient leur clé décalée d'un cran** : cliquer un point jaune
  affichait le texte du voisin, dans six langues.
- Trois contresens trouvés dans les fragments existants : `zurücktreten`
  (démissionner), `prendere le distanze` (se désolidariser), et l'arabe disait
  « prendre ses distances ».

### Le fond animé — refait entièrement
1/0 → **cinq architectures réelles** qui défilent (perceptron, LeNet-5, LSTM,
Transformer, U-Net) → **ADN-B mesuré** → **atelier de cinq machines outillées**.

- Les brins de l'ADN étaient à **180°** : tresse symétrique, sans grand ni petit
  sillon. Passés à 140°, rapport pas/diamètre à 1,785, celui de l'ADN-B réel.
- **La moitié du nuage n'atteignait jamais sa forme finale** : le retard par glyphe
  était pris dans `ph`, plafonné à 4, donc `w4` culminait à 0,684.
- Transition en trois temps : l'hélice se referme, se plante, puis s'ouvre.
- Les deux « harnais » supprimés : ils ne décrivaient rien et coûtaient trois
  transcendantes par sommet.

### Mobile
- `CDPR` rendait à **1× sur un écran à 3×**, et le rendu 3D partagé était figé à
  **0,85×** sans jamais lire `devicePixelRatio`. Plus un désaccord entre zone rendue
  et zone recopiée (`setPixelRatio` ≠ 1 avec `setViewport`).
- **Budget de surface** sur les seuls appareils tactiles : iPhone 1,75×,
  iPad 1,17× — l'iPad passe sous sa valeur d'origine, l'iPhone gagne en netteté.
- Le calcul du palier comptait **deux fois** « c'est un téléphone »
  (`TOUCH` + `innerWidth < 560`) : un iPhone tombait en « machine faible ».
- **Le chat était inaccessible au doigt** : `[data-ada-follow]`, seul point d'entrée
  fiable, était masqué dès que `TOUCH`.
- **Les points jaunes étaient inertes au doigt** : leur gestionnaire exigeait
  `A.follow`, le mode suivi.
- Les points jaunes n'étaient **pas créés du tout** sur tactile (`if(TOUCH) return`).
- Le fond se désolidarisait au **zoom au pincement** : effacé tant que `scale > 1.02`.
- **File d'initialisation** : avançait par `requestAnimationFrame`, suspendu en
  arrière-plan. Changer d'application pendant le chargement laissait des modules
  jamais initialisés — cause probable des « animations qui ne s'affichent pas ».
- Vidéo LEAP57 (1,3 Mo, −85 %) à la place de la vue 3D sur tactile.

---

## 3. Outil de vérification — À UTILISER

`scratchpad/vue/voir.js` (Playwright installé, navigateurs déjà en cache).

```
node voir.js [url] [profil]     profil : bureau | iphone | ipad
```

**Pourquoi il existe** : l'onglet piloté par l'extension Chrome est toujours signalé
`visibilityState: "hidden"`, donc `requestAnimationFrame` ne tourne jamais et le fond
reste figé sur son état de départ. Toute capture par cette voie est trompeuse.
Avec Playwright, le moteur tourne à 60 ips (`palier 0`, `scene: active`) et
`CalibreEngine.order` évolue bien avec le défilement.

**Confirmé visuellement** : le réseau de neurones s'affiche correctement en
section 02, nœuds reliés par des arêtes, glyphes courant le long.

**À réparer** : les profils `iphone` et `ipad` échouent (profil WebKit à corriger
dans `voir.js`). C'est la première chose à faire.

---

## 4. Reste à faire

### Priorité haute
1. **Réparer les profils mobiles de `voir.js`**, puis vérifier réellement sur
   iPhone, iPad et Android ce qui a été corrigé à l'aveugle.
2. **Compatibilité tout navigateur, tout téléphone** — demande explicite du
   propriétaire. Playwright a Chromium et WebKit en cache ; **Firefox est absent**,
   à télécharger. Couvrir aussi les petits écrans et les appareils modestes.
3. ~~Les 13 mini-jeux~~ — **fait**, commit `e1d1f80`. Treize agents ont relu un jeu
   chacun, trois contrôleurs adversariaux ont rejeté 81 propositions sur 147, et
   les 66 restantes ont passé la vérification stricte à **66 sur 66**.
   Répartition : 27 bugs, 9 sur la jouabilité au doigt, 9 sur le coût de rendu,
   8 sur la lisibilité de la règle, 7 sur le retour au joueur, 6 sur la difficulté.
   Les plus graves : un trophée conditionné à la présence de l'assistante, donc
   jamais décerné sur un écran sans 3D ; une série et un record qui traversaient
   les parties ; ADA qui répondait à la place du joueur au bout de vingt-quatre
   secondes de manche ; et le verdict après chaque réponse — la ligne la plus lue
   du jeu — qui restait en français, sa clé étant collée au libellé avant d'être
   cherchée.
   **Reste à faire** : y jouer réellement, jeu par jeu, avec `voir.js`. Rien ne
   remplace une partie pour juger d'une difficulté ou d'un retour.

### Priorité moyenne
4. **Animations de chaque section** : tester, corriger, rafraîchir le visuel.
   **Sauf LEAP57.**
5. Les **166 findings d'audit restants** (`scratchpad/audit-restants.json`),
   dont ~30 bloquants non encore traités.
6. Bascule de langue perçue comme saccadée : `apply.__deferred` corrigé, à
   revérifier à l'œil.

### À confirmer par le propriétaire
- La netteté sur iPhone, la fluidité sur iPad, le chat et les boutons jaunes au
  doigt, la vidéo LEAP57 sur téléphone.

---

## 5. Méthode qui a fait ses preuves

- **Ne jamais croire un agent sur parole** : vérifier fichier et ligne. Sur 99
  patchs proposés, 9 ont été rejetés pour fragment introuvable.
- **Vérifier avant d'insérer** : marqueurs `#`, champs vides, entités HTML,
  doublons, ß en suisse allemand. Sur ~1 000 traductions insérées, zéro incident.
- **Test de fumée** (`scratchpad/fumee.js`) : charge les deux moteurs dans un DOM
  minimal. Attrape les erreurs au chargement, ce que `node --check` ne voit pas.
- **Commits atomiques**, un sujet par commit, message expliquant le *pourquoi*.
- `git add -A` a une fois envoyé 50 Mo d'`uploads/` sur le dépôt public.
  **Toujours nommer les fichiers explicitement.**
