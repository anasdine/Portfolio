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

### Ce que le doigt révèle — 25 août

Signalé par le propriétaire : barres du haut qui se chevauchent, assistante qui
n'apparaît pas, bouton son inopérant, boutons jaunes morts. **La session
précédente avait vérifié la _présence_ de ces commandes, jamais leur
_fonctionnement_.** C'est tout l'écart. Outils : `doigt.js`, `sonde.js`,
`entete.js`, `valide.js`, `audit.js`.

**Piège de protocole, à ne pas refaire** : mes premières mesures étaient prises
**en haut de page**, où l'en-tête n'est pas encore collant et où l'entrée de
l'assistante est masquée. Elles étaient toutes fausses. Il faut mesurer **là où
la commande existe**.

**Corrigé et validé (5 tests sur 5, `valide.js`) :**

- **Les haut-parleurs jaunes.** La tape fonctionnait parfaitement — mesuré : la
  bulle passait de « Bienvenue sur le portfolio » à « Quatre besoins concrets… »,
  le bon texte. Mais `[data-ada-bubble]` est `display:none !important` sous 720px,
  parce qu'elle est ancrée au personnage 3D lui-même masqué à cette largeur.
  **La réponse partait dans le vide.** Cause plus profonde : le gestionnaire de
  la ligne ~9540 n'est pas réservé à la souris, s'enregistre en premier sur
  `pointerdown`, réclame le texte via `exClaim`, et les deux gestionnaires
  tactiles posés plus bas reçoivent `false` et sortent. **Au doigt, c'est le
  chemin souris qui gagnait.** Une surface dédiée (`window.__ditAuDoigt`) est
  posée en bas d'écran, branchée sur le gestionnaire qui gagne réellement.

- **L'entrée de l'assistante.** `[data-ada-follow]` était `opacity:0` et
  `pointer-events:none` tant qu'on n'avait pas défilé : introuvable en arrivant.
  Forcée visible et cliquable sur `(hover:none),(pointer:coarse)`. La tape ouvre
  bien le panneau.

- **Les deux barres du haut.** `[data-nav]` est fixe et haut de **56px**, mais son
  contenu passe en `flex-wrap:wrap` sous ~470px et occupe **96px sur deux lignes**.
  Centré dans 56px, il débordait de 20px en haut — logo et « ☰ SOMMAIRE » coupés
  par le bord — et de 20px en bas, si bien que **« FR » et « MOUV. » pendaient
  sous le fond de la barre, à même le texte**. La barre prend désormais la hauteur
  de son contenu sous 470px. Vérifié de 320 à 900px : plus rien ne déborde.

**Le bouton son — non concluant, et je le dis.** Ce n'est pas `[data-sound]` :
celui-là **n'existe dans aucun fichier publié**, `paintSound()` sort toujours sur
`if(!b) return`. Le vrai bouton est `[data-voice-btn]` (« Couper la voix »).
Sur **Chromium/Pixel il bascule correctement** (`aria-pressed` true→false).
Sur **WebKit sans tête il est `display:none`** — non par bug, mais parce que
`speechSynthesis` y est **absent** et que l'appli masque le bouton faute de voix.
Un vrai iPhone a la synthèse vocale : le bouton s'y affiche, et **aucun moteur
sans tête ne peut reproduire ce cas**. Piste à vérifier sur appareil : iOS exige
un geste utilisateur direct pour démarrer la synthèse, et `getVoices()` y est
asynchrone.

**Le bouton de voix — conforme, tranché avec le propriétaire.** Pas de synthèse
sur l'appareil, pas de bouton : c'est le comportement voulu. Reste comblé le cas
API présente / aucune voix installée, par une vérification différée de 6 s.
⚠ **Ne jamais masquer sur `voiceschanged`** : cet événement se déclenche parfois
une première fois avec une liste vide. Ma première version le faisait — trois
voix présentes et bouton masqué. Mesuré, corrigé.

**Jeu 13 — corrigé.** `@media (max-width:640px){[data-game] canvas{min-height:
clamp(240px,42vh,340px)!important}}` imposait une taille minimale à la **toile**
sans l'imposer à son conteneur, resté à `clamp(200px,30vh,320px)`. La toile étant
en `position:absolute;inset:0`, elle sortait par le bas — 77 px sur iPhone, 88 sur
Pixel, 89 à 360 px — pile sur `JOUER` et `CHANGER DE CAMP`. Le conteneur reçoit la
même hauteur minimale. La règle vise `[data-game] [data-cursor]` : **tous les jeux**.

### Limite de l'audit, à connaître avant de lire ses chiffres

`audit.js` teste `elementFromPoint` au centre de chaque commande, à une position
de défilement donnée. Tout ce qui se trouve alors sous l'**en-tête collant** ou
sous la **barre fixe de droite** est compté « recouvert » — alors qu'il suffit
souvent de défiler un peu. Après correction du jeu 13, **les 14 constats restants
sont tous de cette classe** : points jaunes, champ de commande du terminal, boutons
divers, passés sous `[data-nav]`, `[data-motion]` ou `[data-ada-follow]`.

Ce ne sont pas 14 bugs. Le vrai travail derrière : poser un `scroll-margin-top`
égal à la hauteur de l'en-tête sur les cibles d'ancre et les champs de saisie, pour
que rien n'atterrisse jamais dessous. Et le détecteur devrait ignorer les paires
dont l'élément du dessus a un fond opaque — il ne sait pas le voir aujourd'hui.

### Responsive et en-tête — 25 août, seconde passe

**CONTACT rendu sur téléphone.** `[data-nav] a[data-anchor][data-magnetic]{display:none!important}`
sous 470px le retirait — vérifié, c'est exactement le bouton CONTACT, seul
ancrage de la barre à porter `data-magnetic`. Avec `SOMMAIRE`, c'est le bouton
qui compte sur un téléphone.

**L'en-tête tenu.** Le retour à la ligne ne s'appliquait que sous 470px, or à
480px `CONTACT` se posait à x=449 sur 80px de large — **49px hors de l'écran**.
La version sur une ligne ne tient qu'à partir de ~535px : seuil porté à 540px.
Sous 540px on garde `SOMMAIRE` plutôt que la liste des six liens dépliée, qui
faisait un troisième rang et un en-tête de 175px. L'**horloge décorative** est
retirée — 60px, mais surtout une marge automatique de 170px qui poussait les
commandes suivantes au rang d'après. « MOUVEMENT — COMPLET » (165px, plus que le
logo) est resserré sous 430px plutôt que de retirer une commande d'accessibilité.

Mesuré de 320 à 1440px : **barre à 113px au lieu de 163**, `CONTACT` et
`SOMMAIRE` présents et atteignables partout, rien hors de la barre ni de l'écran.
Opacité portée de 78 % à 97 % sous 540px — 22 % du texte transparaissait sous les
boutons, et la barre est deux fois plus haute qu'avant.

**Section 02, deux défauts distincts.**

1. *Le bandeau recouvert à 99 %.* Le conteneur collant est une colonne flex :
   le bloc de la toile y était comprimé de 566 à 392px, mais son contenu garde sa
   taille intrinsèque. Pas un problème de position mais de **compression** —
   `flex-shrink:0` seul n'y changeait rien, c'est la hauteur minimale qui
   manquait. `:has()` requis (Safari 15.4, Chrome 105) ; sans lui la règle est
   ignorée, jamais pire.
2. *Collision de textes dans le dessin.* Les repères verticaux sont calés en
   pixels fixes (`cy+74`, `cy+90`) alors que le pied utilise `12 * SC()`, et
   `SC() = clamp(W/400, 1, 2.3)` est une échelle sur la **largeur**. Verrouillée
   sur son ratio 702/396, la toile ne fait que 198px de haut sur un téléphone,
   quand la composition en réclame ~280. Le module se remesurant depuis son
   rectangle, une hauteur minimale de 288px suffit sans toucher au tracé.

Vérifié sur six profils, en ligne : recouvrement **0 %**, aucun débordement.

**Le chat** s'ouvre correctement sur les sept profils mobiles — boîte dans
l'écran, saisie présente, bouton fermer présent. Sur bureau l'entrée passe par
`[data-ada]` (le personnage 3D), chemin non testé.

**Trouvé, pas corrigé :**

- Les points jaunes font **22×22**, moitié de la cible tactile minimale. Les
  agrandir risque de leur faire voler la tape des commandes voisines : à traiter
  avec la disposition, pas isolément.
- La section **`jeux` a une gouttière gauche de 35px** quand toutes les autres
  sont à 20 — sur tous les appareils, bureau compris (90 contre 75).
- Sur bureau, `manifeste` mesure **75px à gauche et 305 à droite**.
- Le détecteur devrait ignorer les paires dont l'élément du dessus a un fond
  opaque. Sans ça, chaque commande de la barre fixe compte comme un
  chevauchement.

### État au 26 août — passation

Tout est poussé et déployé. Contrôle final dans les **huit langues** à 402 px,
la largeur de l'iPhone 16 Pro du propriétaire : **zéro débordement horizontal,
zéro toile posée sur du texte, zéro erreur de page**.

Les seules commandes signalées injoignables sont les quatre boutons du jeu 1
sous leur voile « Jouer » — vérifié, un appui sur le voile le retire et les
boutons redeviennent atteignables. C'est le fonctionnement voulu, pas un défaut.

**Outils de vérification : `outils/`** — 31 scripts Playwright, sortis du
scratchpad de session pour survivre. Le dossier est dans `.gitignore` : le dépôt
étant servi tel quel par GitHub Pages, ils ne doivent pas être publiés.
`outils/LISEZ-MOI.md` documente chacun, la mise en route, et les angles morts
connus des détecteurs.

Les deux à lancer en premier :

```
node outils/final.js  https://anasdine.github.io/Portfolio/ 402
node outils/points.js https://anasdine.github.io/Portfolio/
```

Le premier donne, pour les huit langues : débordement horizontal, texte sur
texte, toile sur texte, commandes injoignables, erreurs de page. Le second tape
les 37 repères jaunes un par un et déclenche `pointerdown` sur les 23 toiles.

#### Trois pièges de mesure, payés cher

1. **Les images par seconde sous Chromium sans tête sont bimodales** : 60 ou 24,
   jamais entre. Ce n'est pas le chemin de rendu — `WEBGL_debug_renderer_info`
   renvoie le même ANGLE dans les deux cas. Mesurer avec
   `--disable-gpu-vsync --disable-frame-rate-limit`, par `requestAnimationFrame`,
   versions **alternées**.
2. **WebKit sans tête rend en logiciel, sans GPU.** Il a annoncé 151 ms par image
   là où un moteur avec GPU en donnait 2,6. Ne jamais conclure sur une
   performance depuis ce moteur.
3. **Aucun moteur sans tête ne represente un vrai iPhone.** La 3D de LEAP57 a été
   rendue aux téléphones sur une mesure de 1,90 ms prise sur GPU de bureau : sur
   l'appareil, la page est tombée au palier de sauvegarde. Voir ci-dessous.

#### Le palier de sauvegarde — à connaître avant de toucher aux modules 3D

`perfTick` échantillonne 45 images. Au-delà de **85 ms de moyenne**, `PERF.lvl`
passe à 3 et `budgetOk()` ne laisse plus passer qu'**une image sur vingt** hors
défilement. Symptômes vus par le propriétaire : « ça reste figé au bout de trois
secondes, les ventilos s'arrêtent » et « les boutons agissent sur le modèle mais
on ne voit pas le curseur bouger ». Un seul mécanisme, deux symptômes.

Ce palier protège toute la page. **Ne pas le contourner** : alléger la scène.

#### Ce qui reste ouvert

- **Chevauchement légende × puces** signalé en photo près de Leonhard —
  re-signalé le 26 août, voir « Ce que la seconde photo prouve » ci-dessous.
  Toujours pas reproduit en mesure, mais on sait désormais que ce n'est pas la
  mise en page.

### Ce que la seconde photo prouve — 26 août

Nouvelle photo du propriétaire, même section Leonhard, chevauchement massif.
Cette fois la capture se laisse lire au pixel, et elle **disculpe la mise en
page** :

- la toile du diagramme y mesure **386 px de haut**, soit exactement `52vh`
  d'une fenêtre de **743 px** — Safari barres visibles ;
- interlignes des deux paragraphes, cinq lignes du pied, trois puces, panneau
  « 41 alertes reçues » en dessous : **toutes les cotes internes sont justes** ;
- mais le bloc `[data-plane-wrap]` est **peint ~470 px plus bas que sa place**,
  et sa toile **~120 px plus à droite que sa propre boîte de découpe** — alors
  que le paragraphe de pied, son voisin dans la même boîte, n'a pas bougé
  horizontalement.

J'en avais conclu à un décalage de calques composités. **C'était faux**, et le
propriétaire l'a corrigé aussitôt : « j'ai pas besoin de scroller pour voir ça,
par contre j'ai dû décaler le visuel de Leonhard pour me rendre compte qu'il y
avait du texte caché derrière ». Le défaut est **permanent**. Voir ci-dessous.

### Le vrai défaut — tenu le 26 août

C'est un **défaut de calcul de hauteur du moteur**, pas de la feuille de style :

```
enfants posés à   1..172   172..559   559..675     (justes)
hauteur du bloc   204                              (fausse)
```

Un bloc `display:block` à hauteur automatique contenant 675 px d'enfants ne peut
pas mesurer 204 px. Aucune règle ne lui pose de hauteur — vérifié en parcourant
**toutes** les feuilles et en testant `matches()` sur chaque sélecteur qui
déclare `height`, `min-height`, `max-height`, `aspect-ratio`, `display` ou
`position`. Il n'y en a aucune, et le style en ligne n'en porte pas non plus.

Conséquence : le bloc suivant démarre **471 px trop haut**, le dessin et le pied
se posent sur les paragraphes. **La photo est très exactement cet état** —
l'écart qu'on y mesure vaut ~473 px.

Le déclencheur trouvé ici est `overflow` non-`visible` sur le bloc : instantané,
déterministe, réversible. C'est ce qui rend `-webkit-overflow-scrolling:touch`
suspect sur l'appareil — iOS lui fait porter la boîte autrement.

⚠ **Piège dans lequel je suis tombé** : j'avais d'abord posé
`[data-plane-wrap]{overflow:hidden}` comme « garde-fou », en pensant que le
dessin se couperait au lieu de recouvrir. **Cette règle *produit* le défaut**
au lieu de l'éviter — c'est même elle qui l'a révélé. Retirée.

**Le correctif** ne dépend pas du déclencheur. Les positions des enfants restent
justes quand la hauteur du parent est fausse : on les lit et on en fait un
plancher (`min-height`), relâché avant chaque mesure pour ne jamais mesurer
par-dessus lui-même. Quand le calcul est bon — tous les cas mesurés ici — le
plancher n'est pas posé du tout. Vérifié aux quatre combinaisons
calme/complet × 743/874 : forcé dans l'état de la photo, le bloc revient à sa
hauteur pleine au lieu de tomber à 204.

**Reste ouvert** : ce qui déclenche le mauvais calcul sur *son* appareil.
`?diag=1` est là pour ça (voir plus bas).

Mesuré en face, sans déclencheur : l'écart entre le bloc et ce qui le suit vaut
**+22 px, toujours** — à toutes les hauteurs de défilement, aux deux modes
d'animation, aux deux hauteurs de fenêtre, dans les huit langues.

**Deux axes de mesure qui manquaient à toutes les campagnes précédentes**, et
que la photo a livrés :

1. **Le mode.** Sa barre affiche « ANIMATION 3D — CALME » : *Réduire les
   animations* est coché sur son iPhone. Tout ce qui avait été mesuré jusque-là
   tournait en `full`. `final.js` prend désormais le mode en argument.
2. **La hauteur de fenêtre.** 743 px barres visibles, pas 874. Plusieurs boîtes
   de la page sont en `vh` : la géométrie n'est pas la même. `final.js` prend
   aussi la hauteur.

**Correctifs posés** : le plancher de hauteur décrit ci-dessus, plus
`-webkit-overflow-scrolling:touch` retiré de `[data-chain-scroll]` — sans effet
depuis iOS 13, où l'élan est devenu le comportement par défaut, et seule chose
de ce sous-arbre qui puisse faire porter la boîte autrement par iOS.
`overscroll-behavior-x:none` supprime au passage le rebond latéral, celui-là
même qui explique les 120 px.

**`?diag=1`** — `https://anasdine.github.io/Portfolio/?diag=1` affiche, depuis
l'appareil, les cotes réelles du bloc : hauteur annoncée, somme des enfants,
écart avec le bloc suivant, et si le texte passe sous le dessin. Une capture
suffit à trancher. Rien n'est créé, ni écouté, ni exécuté sans le paramètre.

**Contrôle des huit langues à 402×743, en CALME** — ce que le propriétaire
demandait : zéro débordement horizontal, zéro toile sur du texte, zéro erreur.
Le seul texte réellement écrasé est un badge « en pause » de 65×17 px dans le
jeu 1, présent en six langues sur huit. Nouvel outil `outils/ecrase.js` : il
remonte la chaîne des parents jusqu'à trouver un fond et écarte les paires dont
l'élément du dessus est opaque — l'angle mort que les autres détecteurs ont.

### La flèche d'en bas — le détournement est annulé

**J'ai cherché loin avant d'écouter.** Le propriétaire parlait de la flèche
classique de retour en haut : « la flèche en bas, quand tu cliques pour
remonter, ça clique dans le vide ». J'avais échafaudé des hypothèses sur
`stopPropagation` et sur le menu « SOMMAIRE » ; la réponse était dans la phrase.

Une session précédente avait greffé une **liste de sections** sur `[data-up]`,
au motif que « sur téléphone, la liste des six liens est repliée derrière
SOMMAIRE ». Le greffon posait `preventDefault` + `stopPropagation` en phase de
**capture**, donc avant le comportement d'origine : **la page ne remontait
plus**. Un panneau s'ouvrait à la place — pas ce qu'on demande à une flèche vers
le haut.

⚠ **Et mon premier correctif a aggravé la chose** : j'ai ajouté
`stopImmediatePropagation()` pour « fiabiliser » le greffon, verrouillant
définitivement le retour en haut, et j'ai renommé le bouton « Choisir une
section ». Exactement à l'envers de ce qui était demandé.

**Le greffon est retiré.** Une flèche vers le haut remonte. Le choix des
sections garde son bouton, « ☰ SOMMAIRE », vérifié atteignable et fonctionnel
(8 entrées sur 8). Testé par tape réelle aux quatre combinaisons
calme/complet × 743/874 : `scrollY` revient à 0, rien ne recouvre le bouton,
son libellé redit « Revenir en haut de la page ».

**Ne pas la re-greffer.** Si le choix des sections doit un jour exister en bas
d'écran, que ce soit un *second* bouton.
- **Diagramme du parc** : sa toile est portée à 640 px sous 540 px de large et
  défile latéralement, avec un dégradé et l'invite « glissez pour voir la
  suite ». Le ramener à la largeur de l'écran a été essayé et rejeté — la mise
  en page est en fractions de largeur, les colonnes tombent à 60 px pour du
  texte qui en demande 90 et tout se colle. Une vraie mise en page téléphone
  demanderait d'empiler les trois panneaux sous la baie, ce qui casse la lecture
  de gauche à droite du schéma. Chantier à part entière.
- **LEAP57 manipulable au doigt** : possible, mais il faut d'abord alléger la
  scène — ombres douces, définition de rendu — pour rester sous les 85 ms.
- **Points jaunes à 22×22**, moitié de la cible tactile minimale.
- **Un jeu tiers** demandé par le propriétaire : non ajouté. « Sans coder »
  implique un `<iframe>` externe, ce qui contredit frontalement l'argumentaire
  du site — « aucune donnée sortante », « hébergé en local ». À trancher avec
  lui : soit un classique codé aux couleurs du site, soit un vrai jeu tiers
  assumé.

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
