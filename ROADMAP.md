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

### Les profils mobiles sont réparés — 25 août

La cause n'était pas le code : **WebKit n'était pas téléchargé**. Playwright 1.62.1
attend `webkit-2336`, le cache ne contenait que `webkit-2287`. Firefox était absent.
`npx playwright install webkit firefox` a suffi.

Six profils désormais : `bureau` `firefox` `iphone` `ipad` `android` `petit`,
plus `tous` pour tout enchaîner. Les arguments de lancement Chromium
(`--use-gl=angle`…) sont maintenant **par profil** : les passer à WebKit ou Firefox
fait échouer le lancement.

Deux mesures de l'outil étaient fausses et ont été corrigées :

- « boucle animée » comparait `order` à deux instants au même endroit. `order` est
  piloté par le **défilement**, pas par le temps : le test annonçait « figé » sur
  bureau, firefox et ipad alors que tout tournait. Il compare désormais les valeurs
  prises aux différentes étapes.
- `palier` lisait `CalibreEngine.tier`, qui n'existe pas. C'est `CalibreEngine.perf.palier`.

Outils voisins ajoutés : `chevauchements.js` (texte sur texte) et `bandeau.js`
/ `panneau.js` (texte sur toile).

---

## 4. Reste à faire

### Priorité haute
1. ~~Réparer les profils mobiles de `voir.js`~~ — **fait**, voir § 3.
   Passage sur les six profils : aucune erreur de page, 8 langues, 13 jeux,
   23 toiles, aucun débordement horizontal, la boucle tourne partout.
   Vérifié du même coup : la **vidéo LEAP57 remplace bien la 3D** sur les quatre
   profils tactiles et sur eux seuls ; les **points jaunes sont créés au doigt**
   (37 contre 36 au bureau).

2. **Le bandeau de la section 02 recouvre la toile sur mobile.** Nouveau défaut,
   trouvé et mesuré le 25 août. Reproduit sur **WebKit *et* Chromium** — c'est la
   largeur d'écran, pas le moteur.

   Sur iPhone 14 Pro (393 px) : la toile d'illustration `canvas[data-s2]` occupe
   `[21, 441, 351×198]`, elle s'arrête donc à **y = 639**. Le bandeau des quatre
   libellés — un `<ol>` en grille, `position: static`, qui passe de 4 colonnes au
   bureau à **2 colonnes sur mobile** — démarre à **y = 553**. Soit **87 px de
   recouvrement, 97 % du bandeau**. « Faire tenir / votre matériel » et
   « Automatiser / les tâches répétitives » se lisent par-dessus le contenu de la
   toile ; les deux couches sont illisibles.

   En flux normal, deux blocs `static` de même largeur ne peuvent pas se
   chevaucher : le bandeau devrait commencer à `y = 640`, le bas de
   `parent-1`. **Il est remonté de 87 px** — marge négative, transformation, ou
   grille aux zones superposées. C'est là qu'il faut chercher.

   Aucun chevauchement au bureau : le bandeau y est à `y = 829`, franchement sous
   le panneau. `chevauchements.js` ne voit rien non plus, et c'est normal — le
   conflit est entre du **texte HTML et une toile**, pas entre deux textes.

3. **Le fond avançait par blocs.** Signalé par le propriétaire le 25 août :
   « on dirait que c'est par BLOC et ça apparaît ». **Corrigé, non poussé.**

   Deux défauts se cumulaient dans `pose()` :

   `w1` est saturé dès y≈1426 et `w2` dès y≈3003, tandis que `w3` ne démarre
   qu'à y≈6067. Entre ces deux bornes, `ph = 1+1+0+0` et **`ord` vaut exactement
   0,5 sur 3 064 px**. Comme la distance, l'azimut, l'élévation et le regard sont
   tous interpolés sur ces mêmes `w`, la caméra ne bougeait pas d'un pixel sur
   toute la traversée du réseau. Décor immobile.

   Au milieu de ce décor immobile, `ecritArchi(Math.floor(u5 * ARCH.length))`
   faisait basculer l'architecture par **index entier**. Le ressort dont parle le
   commentaire d'origine ne rattrape que les glyphes (`p2`) : les **nœuds** et
   **tout le câblage** étaient réécrits d'un coup. La structure visible se
   téléportait à cinq frontières sèches.

   Le correctif garde l'objection d'origine — on ne fond pas un U dans un
   escalier de carrés — mais la contourne :

   - `fondArchi(k, b)` interpole les **positions des nœuds** entre l'architecture
     `k` et la suivante sur le dernier tiers de chaque tranche, et redessine les
     synapses sur ces nœuds interpolés. Tampon `melN` prélloué : la boucle
     d'image n'alloue rien. `NMAX` vaut 43, le coût est négligeable.
   - La **topologie**, elle, ne s'interpole pas : elle bascule d'un coup, mais à
     mi-fondu, quand les nœuds des deux formes sont au plus près. Le câblage se
     refait au moment où il se voit le moins.
   - Un **balayage lent de caméra** en `sin(π·u5)`, nul aux deux bouts pour ne
     décrocher ni de ce qui précède ni de ce qui suit, rend son souffle à la
     traversée.

   Mesuré avec `frontiere.js` : texte masqué en `visibility`, captures Playwright,
   comparaison des images dans la page. L'indicateur qui compte est **le rapport
   d'un pas à ses deux voisins** — une coupure sèche s'y détache, et il est
   insensible à la dérive du niveau général, contrairement au rapport
   max/médiane que j'avais utilisé d'abord et qui variait du simple au double
   d'un tour à l'autre.

   | frontière | avant | après |
   |---|---|---|
   | 1 | 1,92 | **1,07** |
   | 2 | 1,55 | **1,15** |
   | 4 | 1,92 | **1,12** |

   Non-régression : six profils, aucune erreur de page, `palier 0`, 23 toiles,
   13 jeux, 8 langues, aucun débordement.

   **Deuxième passe — le nuage aussi.** Le propriétaire a retesté : « entre chaque
   problème de la section 02 le fond change radicalement ». La première passe ne
   fondait que les **43 nœuds et leurs traits**. Or la masse visible, ce sont les
   **420 glyphes** (170 sur mobile) : eux continuaient à changer de cible d'un coup
   au milieu du fondu, puis à courir vers elle au ressort — un mouvement propre,
   décorrélé du défilement.

   Le calcul des cibles est sorti de `ecritArchi` dans `cibles(nds, edg, oP, oV)`,
   ce qui permet de l'évaluer sur **deux** architectures. `fondArchi` les calcule
   une fois par tranche dans `glA/glB/gvA/gvB`, puis interpole `aP2` et `aEV` à
   chaque image. Le nuage se déforme donc **avec le défilement**, il n'a plus de
   mouvement à lui.

   Fenêtre élargie de `ss(f, .62, .995)` à `ss(f, .40, .99)` : 40 % de la tranche
   en forme tenue, 60 % en transformation. Vérifié à l'œil qu'à mi-fondu le réseau
   reste **cohérent, pas de bouillie** — l'objection d'origine tient toujours pour
   un morphing brutal, pas pour celui-ci. Pic/voisins sur la traversée complète :
   1,33 → 1,15.

   ⚠ **Piège de mesure, à ne pas refaire — deux fois tombé dedans.** Les images
   par seconde sous Chromium sans tête sont **bimodales** : 60 ou 24, jamais entre
   les deux. Ce n'est **pas** le chemin de rendu — `WEBGL_debug_renderer_info`
   renvoie le même ANGLE/NVIDIA dans les deux états, et l'état lent frappe aussi
   le **haut de page**, là où le correctif n'exécute rien. C'est une loterie au
   lancement du navigateur. J'ai cru deux fois à une régression sur cette base.

   **La bonne méthode** : lancer avec `--disable-gpu-vsync --disable-frame-rate-limit`
   et mesurer la cadence par `requestAnimationFrame`, versions **alternées** pour
   annuler la dérive machine (`cadence.js`). Résultat : v1 1,9/1,8/1,9/1,7 ms,
   v2 1,9/1,6/40,6/1,8 ms — médianes égales à 1,9 ms, le 40,6 étant un tour tombé
   dans l'état bloqué. Le travail réel par image est de **1,8 ms** : le fond n'est
   pas près d'être limité par le GPU, le plafond à 60 est la synchro verticale.

4. **Compatibilité tout navigateur, tout téléphone** — demande explicite du
   propriétaire. Chromium, WebKit et Firefox sont maintenant tous les trois
   installés. Reste à couvrir les appareils modestes.

   ⚠ **Les images par seconde mesurées sous WebKit sans tête ne valent rien** :
   20 ips sur `iphone` et `ipad` contre 60 sur `android` (Chromium). WebKit sans
   tête sous Windows rend en logiciel, sans GPU. Ce chiffre ne dit rien du vrai
   iPhone. Pour juger de la fluidité, il faut un appareil réel.
5. ~~Les 13 mini-jeux~~ — **fait**, commit `e1d1f80`. Treize agents ont relu un jeu
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
6. **Animations de chaque section** : tester, corriger, rafraîchir le visuel.
   **Sauf LEAP57.**
7. Les **166 findings d'audit restants** (`scratchpad/audit-restants.json`),
   dont ~30 bloquants non encore traités.
8. Bascule de langue perçue comme saccadée : `apply.__deferred` corrigé, à
   revérifier à l'œil.

### À confirmer par le propriétaire
- ~~La vidéo LEAP57 sur téléphone~~ et ~~les points jaunes au doigt~~ : vérifiés
  par `voir.js`, présents sur les quatre profils tactiles.
- **La netteté sur iPhone et la fluidité sur iPad** : hors de portée de l'outil,
  WebKit sans tête rendant en logiciel. Il faut l'appareil.
- **Le chat au doigt** : `[data-ada-follow]` est présent mais jamais mesuré
  visible, y compris au bureau. Le bouton bulle *apparaît* pourtant sur les
  captures : le point d'entrée réel est donc un autre élément. À identifier avant
  de conclure quoi que ce soit sur son accessibilité.

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
