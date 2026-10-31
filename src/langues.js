// Les huit langues du portfolio : mêmes codes, même détection, même clé de stockage. Le choix fait ici vaut donc aussi dans
// les branches, qui sont la vraie page du portfolio, et l'inverse. Table indexée par la chaîne française exacte.
// Ordre des colonnes : en, de, it, zh, ar, ja. Le suisse allemand reprend l'allemand, sans ß, comme le portfolio.
export const LANGUES = ['fr', 'en', 'de', 'it', 'zh', 'ar', 'ja', 'de-CH'];
export const NOMS = { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', zh: '中文', ar: 'العربية', ja: '日本語', 'de-CH': 'Schweizerdeutsch' };
const CLE = 'ad2026.lang';
const COLONNE = { en: 0, de: 1, it: 2, zh: 3, ar: 4, ja: 5, 'de-CH': 1 };

const T = {
  'Descendre d’un écran': ['Scroll down one screen', 'Eine Bildschirmhöhe nach unten scrollen', 'Scorri in basso di una schermata', '向下滚动一屏', 'مرّر شاشة واحدة لأسفل', '1画面下へスクロール'],
  'Revenir en haut de la page': ['Back to top of page', 'Zurück zum Seitenanfang', 'Torna in cima alla pagina', '返回页面顶部', 'العودة إلى أعلى الصفحة', 'ページの先頭に戻る'],
  // l'interface
  'Affichage de la tour': ['Tower display', 'Turmansicht', 'Visualizzazione della torre', '塔的显示方式', 'عرض البرج', 'タワーの表示'],
  'Vidéo générée': ['Generated video', 'Generiertes Video', 'Video generato', '生成视频', 'فيديو مولّد', '生成動画'],
  'Temps réel': ['Real time', 'Echtzeit', 'Tempo reale', '实时', 'الوقت الحقيقي', 'リアルタイム'],
  'Maintenir pour restaurer': ['Hold to restore', 'Halten zum Wiederherstellen', 'Tieni premuto per ripristinare', '按住以恢复', 'اضغط مطولًا للاستعادة', '長押しで復旧'],
  'restauré': ['restored', 'wiederhergestellt', 'ripristinato', '已恢复', 'تمت الاستعادة', '復旧済み'],
  'Défilez pour entrer ↓': ['Scroll to enter ↓', 'Scrollen zum Eintreten ↓', 'Scorri per entrare ↓', '向下滚动进入 ↓', 'مرّر للدخول ↓', 'スクロールして入る ↓'],
  'Administrateur systèmes & réseaux · automatisation · IA hébergée en local': ['Systems & network administrator · automation · locally hosted AI', 'Systemadministrator & Netzwerke · Automatisierung · lokal gehostete KI', 'Amministratore di sistemi e reti · automazione · IA ospitata in locale', '系统与网络管理员 · 自动化 · 本地部署 AI', 'مسؤول أنظمة وشبكات · أتمتة · ذكاء اصطناعي مستضاف محليًا', 'システム・ネットワーク管理者 · 自動化 · ローカルホストの AI'],
  '> bastion · intégrité # %': ['> bastion · integrity # %', '> bastion · Integrität # %', '> bastion · integrità # %', '> bastion · 完整性 # %', '> bastion · السلامة # %', '> bastion · 完全性 # %'],
  '[ OK ] bastion restauré · intégrité 100 %': ['[ OK ] bastion restored · integrity 100 %', '[ OK ] bastion wiederhergestellt · Integrität 100 %', '[ OK ] bastion ripristinato · integrità 100 %', '[ OK ] bastion 已恢复 · 完整性 100 %', '[ OK ] تمت استعادة bastion · السلامة 100 %', '[ OK ] bastion 復旧 · 完全性 100 %'],
  '> leonhard · niveau # / #': ['> leonhard · level # / #', '> leonhard · Ebene # / #', '> leonhard · livello # / #', '> leonhard · 第 # / # 层', '> leonhard · المستوى # / #', '> leonhard · レベル # / #'],
  '↳ vidéo générée par IA : une boucle, elle ne réagit à rien. Passez en temps réel pour comparer.': ['↳ AI-generated video: a loop that reacts to nothing. Switch to real time to compare.', '↳ KI-generiertes Video: eine Schleife, die auf nichts reagiert. Wechseln Sie zu Echtzeit, um zu vergleichen.', '↳ video generato dall\'IA: un loop che non reagisce a nulla. Passa al tempo reale per confrontare.', '↳ AI 生成的视频：一段循环，不会响应任何操作。切换到实时即可对比。', '↳ فيديو مولّد بالذكاء الاصطناعي: حلقة لا تتفاعل مع شيء. انتقل إلى الوقت الحقيقي للمقارنة.', '↳ AI 生成の動画：何にも反応しないループです。リアルタイムに切り替えて比較してください。'],
  '↳ temps réel : rien n\'est enregistré, votre navigateur calcule cette tour de 300 m': ['↳ real time: nothing is recorded, your browser computes this 300 m tower', '↳ Echtzeit: Nichts ist aufgezeichnet, Ihr Browser berechnet diesen 300-m-Turm', '↳ tempo reale: nulla è registrato, il tuo browser calcola questa torre di 300 m', '↳ 实时：没有任何录制内容，这座 300 米的塔由你的浏览器计算', '↳ الوقت الحقيقي: لا شيء مسجَّل، متصفحك يحسب هذا البرج البالغ 300 م', '↳ リアルタイム：録画は一切なく、この 300 m のタワーはブラウザが計算しています'],
  ' et suit votre souris': [' and follows your mouse', ' und folgt Ihrer Maus', ' e segue il tuo mouse', '并跟随你的鼠标', ' ويتبع الفأرة', '、マウスに追従します'],
  'i/s': ['fps', 'B/s', 'fps', '帧/秒', 'إطار/ث', 'fps'],
  'Entrer dans une partie du portfolio': ['Enter a part of the portfolio', 'Einen Teil des Portfolios betreten', 'Entra in una parte del portfolio', '进入作品集的某一部分', 'ادخل إلى جزء من ملف الأعمال', 'ポートフォリオの各部へ入る'],
  'Entrer :': ['Enter:', 'Eintreten:', 'Entra:', '进入：', 'ادخل:', '入る：'],
  'Chapitres': ['Chapters', 'Kapitel', 'Capitoli', '章节', 'الفصول', 'チャプター'],
  'La tour': ['The tower', 'Der Turm', 'La torre', '高塔', 'البرج', 'タワー'],
  'La salle': ['The hall', 'Der Saal', 'La sala', '大厅', 'القاعة', 'ホール'],
  'Production': ['Output', 'Produktion', 'Produzione', '产出', 'الإنتاج', '制作物'],
  'L\'arcade': ['The arcade', 'Die Arcade', 'L\'arcade', '街机厅', 'الأركيد', 'アーケード'],
  'Langue': ['Language', 'Sprache', 'Lingua', '语言', 'اللغة', '言語'],
  'Détail du portfolio': ['Portfolio details', 'Portfolio-Details', 'Dettaglio del portfolio', '作品集详情', 'تفاصيل ملف الأعمال', 'ポートフォリオの詳細'],
  '← Retour à la table Ultron': ['← Back to the Ultron table', '← Zurück zum Ultron-Tisch', '← Torna al tavolo Ultron', '← 返回 Ultron 控制台', '→ العودة إلى طاولة Ultron', '← Ultron テーブルへ戻る'],
  '> ouverture…': ['> opening…', '> wird geöffnet…', '> apertura…', '> 正在打开…', '> جارٍ الفتح…', '> 開いています…'],
  'Fermer · Échap': ['Close · Esc', 'Schließen · Esc', 'Chiudi · Esc', '关闭 · Esc', 'إغلاق · Esc', '閉じる · Esc'],
  'Jeu': ['Game', 'Spiel', 'Gioco', '游戏', 'لعبة', 'ゲーム'],
  // les branches et les panneaux
  'Offre': ['Offer', 'Angebot', 'Offerta', '服务', 'العرض', 'サービス'],
  'Projets': ['Projects', 'Projekte', 'Progetti', '项目', 'المشاريع', 'プロジェクト'],
  'Méthode': ['Method', 'Methode', 'Metodo', '方法', 'المنهج', '手法'],
  'Parcours': ['Track record', 'Werdegang', 'Percorso', '经历', 'المسار', '経歴'],
  'Contact': ['Contact', 'Kontakt', 'Contatto', '联系', 'اتصال', 'お問い合わせ'],
  'OFFRE': ['OFFER', 'ANGEBOT', 'OFFERTA', '服务', 'العرض', 'サービス'],
  'PROJETS': ['PROJECTS', 'PROJEKTE', 'PROGETTI', '项目', 'المشاريع', 'プロジェクト'],
  'PARCOURS': ['TRACK RECORD', 'WERDEGANG', 'PERCORSO', '经历', 'المسار', '経歴'],
  'CONTACT': ['CONTACT', 'KONTAKT', 'CONTATTO', '联系', 'اتصال', 'お問い合わせ'],
  'Indépendant à 20 %, en plus de DM Surfaces': ['20 % freelance, alongside DM Surfaces', '20 % selbstständig, neben DM Surfaces', 'Indipendente al 20 %, oltre a DM Surfaces', '20 % 自由职业，同时任职 DM Surfaces', 'مستقل بنسبة 20 %، إلى جانب DM Surfaces', 'DM Surfaces と並行し 20 % 独立'],
  'IA · sites web · applications': ['AI · websites · applications', 'KI · Websites · Anwendungen', 'IA · siti web · applicazioni', 'AI · 网站 · 应用', 'ذكاء اصطناعي · مواقع · تطبيقات', 'AI · ウェブサイト · アプリ'],
  'IA · sites · applications': ['AI · websites · applications', 'KI · Websites · Anwendungen', 'IA · siti · applicazioni', 'AI · 网站 · 应用', 'ذكاء اصطناعي · مواقع · تطبيقات', 'AI · サイト · アプリ'],
  'Automatisation': ['Automation', 'Automatisierung', 'Automazione', '自动化', 'الأتمتة', '自動化'],
  'IA hébergée en local': ['Locally hosted AI', 'Lokal gehostete KI', 'IA ospitata in locale', '本地部署 AI', 'ذكاء اصطناعي مستضاف محليًا', 'ローカルホストの AI'],
  'Rien de ce qui se passe chez un client ne sort d\'ici.': ['Nothing that happens at a client\'s leaves this place.', 'Nichts, was bei einem Kunden geschieht, verlässt diesen Ort.', 'Nulla di ciò che accade da un cliente esce da qui.', '客户的任何数据都不会离开这里。', 'لا شيء مما يحدث لدى العميل يخرج من هنا.', '顧客のことは何ひとつ外に出ません。'],
  'Mon assistance de chaque jour': ['My everyday assistant', 'Meine tägliche Assistenz', 'La mia assistenza quotidiana', '我的日常助手', 'مساعدي اليومي', '毎日のアシスタント'],
  'Boîtier : une vraie conception technique': ['Enclosure: real engineering design', 'Gehäuse: echte technische Konstruktion', 'Scocca: una vera progettazione tecnica', '外壳：真正的工程设计', 'الهيكل: تصميم هندسي حقيقي', '筐体：本格的な技術設計'],
  'Razor, l\'Archonte et treize jeux': ['Razor, the Archon, and thirteen games', 'Razor, der Archont, und dreizehn Spiele', 'Razor, l\'Arconte e tredici giochi', 'Razor 执政官与十三款游戏', 'Razor الأرخون وثلاث عشرة لعبة', 'Razor アルコンと 13 のゲーム'],
  'Mon exosquelette d\'IA': ['My AI exoskeleton', 'Mein KI-Exoskelett', 'Il mio esoscheletro di IA', '我的 AI 外骨骼', 'هيكلي الخارجي بالذكاء الاصطناعي', '私の AI 外骨格'],
  '20 min à l\'oral le matin, 20 le soir.': ['20 min of voice in the morning, 20 at night.', '20 Min. Sprache am Morgen, 20 am Abend.', '20 min a voce al mattino, 20 la sera.', '早上口述 20 分钟，晚上 20 分钟。', '20 دقيقة صوتيًا صباحًا و20 مساءً.', '朝に音声で 20 分、夜に 20 分。'],
  'Un routage intelligent entre usines.': ['Smart routing between factories.', 'Intelligentes Routing zwischen Fabriken.', 'Instradamento intelligente tra fabbriche.', '工厂之间的智能路由。', 'توجيه ذكي بين المصانع.', '工場間のスマートルーティング。'],
  'Des centaines d\'agents produisent.': ['Hundreds of agents produce.', 'Hunderte Agenten produzieren.', 'Centinaia di agenti producono.', '数百个智能体负责产出。', 'مئات الوكلاء ينتجون.', '数百のエージェントが生産します。'],
  'Je décide, j\'envoie les demandes clients.': ['I decide and send the client requests.', 'Ich entscheide und sende die Kundenanfragen.', 'Decido e invio le richieste dei clienti.', '我做决定，并派发客户需求。', 'أنا أقرر وأرسل طلبات العملاء.', '私が決め、顧客の依頼を送ります。'],
  'Je garde l\'essentiel.': ['I keep what matters.', 'Das Wesentliche behalte ich.', 'Tengo l\'essenziale.', '我掌握关键。', 'أحتفظ بالجوهر.', '肝心なことは私が担います。'],
  'Indépendant · 20 %': ['Freelance · 20 %', 'Selbstständig · 20 %', 'Indipendente · 20 %', '自由职业 · 20 %', 'مستقل · 20 %', '独立 · 20 %'],
  'Administrateur systèmes et réseaux': ['Systems and network administrator', 'Administrator für Systeme und Netzwerke', 'Amministratore di sistemi e reti', '系统与网络管理员', 'مسؤول أنظمة وشبكات', 'システム・ネットワーク管理者'],
  'Suisse romande': ['French-speaking Switzerland', 'Westschweiz', 'Svizzera romanda', '瑞士法语区', 'سويسرا الناطقة بالفرنسية', 'スイス・ロマンド'],
  'Autodidacte depuis l\'enfance': ['Self-taught since childhood', 'Autodidakt seit der Kindheit', 'Autodidatta fin dall\'infanzia', '自幼自学', 'عصامي منذ الطفولة', '幼少期から独学'],
  'Disponible pour vos projets': ['Available for your projects', 'Verfügbar für Ihre Projekte', 'Disponibile per i tuoi progetti', '可承接你的项目', 'متاح لمشاريعكم', 'ご依頼を承ります'],
  'Toute la suite est dans cette branche': ['Everything else is in this branch', 'Alles Weitere ist in diesem Zweig', 'Tutto il resto è in questo ramo', '其余内容都在这个分支里', 'كل ما تبقى في هذا الفرع', '続きはすべてこのブランチに'],
  // le cockpit
  'les agents agissent': ['the agents act', 'die Agenten handeln', 'gli agenti agiscono', '智能体行动', 'الوكلاء يتصرفون', 'エージェントが動く'],
  'le parc, les liaisons': ['the fleet, the links', 'der Park, die Verbindungen', 'il parco, i collegamenti', '设备群与链路', 'الأجهزة والروابط', '機器群と回線'],
  'elle produit': ['it produces', 'sie produziert', 'lei produce', '它来生产', 'إنه ينتج', '生産する'],
  'transmet, planifie, prévient': ['relays, schedules, alerts', 'übermittelt, plant, warnt', 'trasmette, pianifica, avvisa', '传递、规划、提醒', 'ينقل، يخطط، ينبّه', '伝え、計画し、知らせる'],
  'rien de client ne sort': ['no client data gets out', 'nichts vom Kunden geht hinaus', 'nulla del cliente esce', '客户数据绝不外流', 'لا يخرج شيء من بيانات العميل', '顧客データは外に出ない'],
  'TOI · tu donnes le cap   →   ULTRON · décide, se souvient   →   HERMES · transmet, planifie, prévient   →   LES BRIQUES · font   ///   SAS : rien de client ne sort   ///   ': [
    'YOU · you set the course   →   ULTRON · decides, remembers   →   HERMES · relays, schedules, alerts   →   THE BLOCKS · do   ///   SAS: no client data gets out   ///   ',
    'DU · du gibst den Kurs vor   →   ULTRON · entscheidet, erinnert sich   →   HERMES · übermittelt, plant, warnt   →   DIE BAUSTEINE · handeln   ///   SAS: nichts vom Kunden geht hinaus   ///   ',
    'TU · dai la rotta   →   ULTRON · decide, ricorda   →   HERMES · trasmette, pianifica, avvisa   →   I MATTONI · fanno   ///   SAS: nulla del cliente esce   ///   ',
    '你 · 把握方向   →   ULTRON · 决策、记忆   →   HERMES · 传递、规划、提醒   →   模块 · 执行   ///   SAS：客户数据绝不外流   ///   ',
    'أنت · تحدد الاتجاه   ←   ULTRON · يقرر ويتذكر   ←   HERMES · ينقل، يخطط، ينبّه   ←   الوحدات · تنفّذ   ///   SAS: لا يخرج شيء من بيانات العميل   ///   ',
    'あなた · 針路を示す   →   ULTRON · 決め、記憶する   →   HERMES · 伝え、計画し、知らせる   →   ブロック · 実行する   ///   SAS：顧客データは外に出ない   ///   ',
  ],
  // l'arcade
  '> bastion · fin de la plongée · [ OK ]': ['> bastion · end of the dive · [ OK ]', '> bastion · Ende des Tauchgangs · [ OK ]', '> bastion · fine dell\'immersione · [ OK ]', '> bastion · 下潜结束 · [ OK ]', '> bastion · نهاية الغوص · [ OK ]', '> bastion · ダイブ終了 · [ OK ]'],
  'La production': ['The output', 'Die Produktion', 'La produzione', '产出', 'الإنتاج', '制作物'],
  'Depuis juin, ça ne s\'arrête pas : chaque mois, des outils et des réalisations de plus. Tout ce qui suit existe et s\'ouvre.': ['Since June it hasn\'t stopped: every month, more tools and more work. Everything below is real and opens.', 'Seit Juni hört es nicht auf: Jeden Monat kommen neue Werkzeuge und Arbeiten dazu. Alles Folgende existiert und lässt sich öffnen.', 'Da giugno non si ferma: ogni mese, nuovi strumenti e nuovi lavori. Tutto ciò che segue esiste e si apre.', '从六月起从未停歇：每个月都有新工具和新成果。下面的一切都真实存在，都能打开。', 'منذ يونيو لم يتوقف العمل: كل شهر أدوات وإنجازات جديدة. كل ما يلي موجود ويمكن فتحه.', '6 月から止まりません。毎月、ツールと制作物が増えています。以下はすべて実在し、開けます。'],
  'Juin': ['June', 'Juni', 'Giugno', '六月', 'يونيو', '6 月'],
  'Août': ['August', 'August', 'Agosto', '八月', 'أغسطس', '8 月'],
  'Septembre': ['September', 'September', 'Settembre', '九月', 'سبتمبر', '9 月'],
  'Octobre': ['October', 'Oktober', 'Ottobre', '十月', 'أكتوبر', '10 月'],
  'Aujourd\'hui': ['Today', 'Heute', 'Oggi', '今天', 'اليوم', '現在'],
  'JARVIS et LEONHARD': ['JARVIS and LEONHARD', 'JARVIS und LEONHARD', 'JARVIS e LEONHARD', 'JARVIS 与 LEONHARD', 'JARVIS و LEONHARD', 'JARVIS と LEONHARD'],
  'LEAP 57 et ce portfolio': ['LEAP 57 and this portfolio', 'LEAP 57 und dieses Portfolio', 'LEAP 57 e questo portfolio', 'LEAP 57 与这份作品集', 'LEAP 57 وهذا الملف', 'LEAP 57 とこのポートフォリオ'],
  'Plan B, Razor, l\'indépendance': ['Plan B, Razor, going independent', 'Plan B, Razor, die Selbstständigkeit', 'Plan B, Razor, l\'indipendenza', 'Plan B、Razor、独立执业', 'Plan B و Razor والاستقلال', 'Plan B、Razor、独立'],
  'ULTRON COCKPIT, sites et apps clients': ['ULTRON COCKPIT, client sites and apps', 'ULTRON COCKPIT, Kunden-Websites und -Apps', 'ULTRON COCKPIT, siti e app per clienti', 'ULTRON COCKPIT、客户网站与应用', 'ULTRON COCKPIT ومواقع وتطبيقات للعملاء', 'ULTRON COCKPIT、顧客サイトとアプリ'],
  'Site · octobre': ['Website · October', 'Website · Oktober', 'Sito · ottobre', '网站 · 十月', 'موقع · أكتوبر', 'サイト · 10 月'],
  'Commande en ligne · octobre': ['Online ordering · October', 'Online-Bestellung · Oktober', 'Ordini online · ottobre', '在线点餐 · 十月', 'طلب عبر الإنترنت · أكتوبر', 'オンライン注文 · 10 月'],
  'Application · octobre': ['App · October', 'App · Oktober', 'Applicazione · ottobre', '应用 · 十月', 'تطبيق · أكتوبر', 'アプリ · 10 月'],
  'Mes usines': ['My factories', 'Meine Fabriken', 'Le mie fabbriche', '我的工厂', 'مصانعي', '私の工場'],
  'Ma chaîne de production de vidéos publicitaires, pilotée depuis le téléphone.': ['My ad-video production line, run from my phone.', 'Meine Produktionskette für Werbevideos, gesteuert vom Telefon.', 'La mia catena di produzione di video pubblicitari, gestita dal telefono.', '我的广告视频生产线，用手机就能操控。', 'خط إنتاج فيديوهاتي الإعلانية، يُدار من الهاتف.', 'スマホで操作する広告動画の制作ライン。'],
  'Le générateur de sites, sur mes propres cartes graphiques.': ['The website generator, on my own graphics cards.', 'Der Website-Generator, auf meinen eigenen Grafikkarten.', 'Il generatore di siti, sulle mie schede grafiche.', '网站生成器，运行在我自己的显卡上。', 'مولّد المواقع، على بطاقات الرسوميات الخاصة بي.', '自前の GPU で動くサイト生成器。'],
  'La supervision de tout un parc, tenue par une seule personne.': ['Monitoring for an entire fleet, run by one person.', 'Die Überwachung eines ganzen Parks, von einer einzigen Person betrieben.', 'La supervisione di un intero parco, tenuta da una sola persona.', '一人掌管整个设备群的监控。', 'مراقبة أسطول كامل يديرها شخص واحد.', '機器群全体の監視を一人で担います。'],
  '20 minutes le matin, 20 le soir : je décide, les agents produisent.': ['20 minutes in the morning, 20 at night: I decide, the agents produce.', '20 Minuten am Morgen, 20 am Abend: Ich entscheide, die Agenten produzieren.', '20 minuti al mattino, 20 la sera: io decido, gli agenti producono.', '早上 20 分钟，晚上 20 分钟：我决策，智能体生产。', '20 دقيقة صباحًا و20 مساءً: أنا أقرر والوكلاء ينتجون.', '朝 20 分、夜 20 分。私が決め、エージェントが生産します。'],
  'Un jeu phare et treize bornes, écrits pour ce portfolio. Tout tourne dans votre navigateur.': ['One flagship game and thirteen cabinets, written for this portfolio. Everything runs in your browser.', 'Ein Hauptspiel und dreizehn Automaten, für dieses Portfolio geschrieben. Alles läuft in Ihrem Browser.', 'Un gioco di punta e tredici cabinati, scritti per questo portfolio. Tutto gira nel tuo browser.', '一款主打游戏和十三台街机，专为这份作品集编写。全部在你的浏览器中运行。', 'لعبة رئيسية وثلاث عشرة آلة، كُتبت لهذا الملف. كل شيء يعمل في متصفحك.', '看板ゲーム 1 本と 13 台の筐体。このポートフォリオのために書きました。すべてブラウザで動きます。'],
  'Le jeu phare · clavier, manette, tactile': ['Flagship game · keyboard, gamepad, touch', 'Hauptspiel · Tastatur, Gamepad, Touch', 'Il gioco di punta · tastiera, gamepad, touch', '主打游戏 · 键盘、手柄、触屏', 'اللعبة الرئيسية · لوحة مفاتيح، يد تحكم، لمس', '看板ゲーム · キーボード、ゲームパッド、タッチ'],
  'Razor, l\'Archonte': ['Razor, the Archon', 'Razor, der Archont', 'Razor, l\'Arconte', 'Razor 执政官', 'Razor الأرخون', 'Razor アルコン'],
  'Un twin-stick néon. Cinq héros, des vagues, des gardiens, et une faille vers un autre monde toutes les trois vagues.': ['A neon twin-stick. Five heroes, waves, guardians, and a rift to another world every three waves.', 'Ein Neon-Twin-Stick. Fünf Helden, Wellen, Wächter und alle drei Wellen ein Riss in eine andere Welt.', 'Un twin-stick al neon. Cinque eroi, ondate, guardiani e una faglia verso un altro mondo ogni tre ondate.', '霓虹双摇杆射击。五位英雄、一波波敌人、守卫，每三波开启一道通往异世界的裂隙。', 'لعبة نيون بعصاين. خمسة أبطال وموجات وحراس وصدع نحو عالم آخر كل ثلاث موجات.', 'ネオンのツインスティック。5 人の英雄、ウェーブ、守護者、3 ウェーブごとに異世界への裂け目。'],
  'Lancer': ['Launch', 'Starten', 'Avvia', '启动', 'تشغيل', '起動'],
  'Anas Dine · Suisse romande': ['Anas Dine · French-speaking Switzerland', 'Anas Dine · Westschweiz', 'Anas Dine · Svizzera romanda', 'Anas Dine · 瑞士法语区', 'Anas Dine · سويسرا الناطقة بالفرنسية', 'Anas Dine · スイス・ロマンド'],
  'Revenir à la tour ↑': ['Back to the tower ↑', 'Zurück zum Turm ↑', 'Torna alla torre ↑', '返回高塔 ↑', 'العودة إلى البرج ↑', 'タワーへ戻る ↑'],
  'Une fissure dans le mur': ['A crack in the wall', 'Ein Riss in der Wand', 'Una crepa nel muro', '墙上的裂缝', 'شق في الجدار', '壁のひび割れ'],
  'Vous avez trouvé la faille. Derrière, un jeu qui tourne sur une machine privée : l\'entrée se fait sur invitation, avec un code.': ['You found the rift. Behind it, a game running on a private machine: entry is by invitation, with a code.', 'Sie haben den Riss gefunden. Dahinter läuft ein Spiel auf einem privaten Rechner: Zutritt nur auf Einladung, mit Code.', 'Hai trovato la faglia. Dietro, un gioco che gira su una macchina privata: si entra su invito, con un codice.', '你找到了裂隙。后面是一款运行在私人机器上的游戏：凭邀请和代码进入。', 'لقد وجدت الصدع. خلفه لعبة تعمل على جهاز خاص: الدخول بدعوة وبرمز.', '裂け目を見つけました。その奥では私有マシンでゲームが動いています。招待コードで入れます。'],
  'Demander un code': ['Request a code', 'Code anfragen', 'Chiedi un codice', '申请代码', 'اطلب رمزًا', 'コードを申請'],
  'Refermer': ['Close', 'Schließen', 'Richiudi', '关闭', 'إغلاق', '閉じる'],
  // les bornes
  'Vol 3D dans un corridor de données': ['3D flight through a data corridor', '3D-Flug durch einen Datenkorridor', 'Volo 3D in un corridoio di dati', '穿越数据走廊的 3D 飞行', 'طيران ثلاثي الأبعاد في ممر بيانات', 'データ回廊の 3D 飛行'],
  'Équipe rouge contre équipe bleue, en vraies commandes': ['Red team against blue team, with real commands', 'Red Team gegen Blue Team, mit echten Befehlen', 'Squadra rossa contro squadra blu, con comandi veri', '红队对蓝队，使用真实命令', 'الفريق الأحمر ضد الأزرق بأوامر حقيقية', 'レッドチーム対ブルーチーム、本物のコマンドで'],
  'Élevez un modèle': ['Raise a model', 'Ein Modell aufziehen', 'Alleva un modello', '养成一个模型', 'ربِّ نموذجًا', 'モデルを育てる'],
  'Un LLM local à nourrir, refroidir, aligner': ['A local LLM to feed, cool and align', 'Ein lokales LLM füttern, kühlen, ausrichten', 'Un LLM locale da nutrire, raffreddare, allineare', '喂养、冷却、校准一个本地 LLM', 'LLM محلي تغذّيه وتبرّده وتضبطه', 'ローカル LLM に学習させ、冷やし、調整する'],
  'Monter la baie': ['Build the rack', 'Das Rack bestücken', 'Monta il rack', '组装机柜', 'ركّب الخزانة', 'ラックを組む'],
  'Poids, énergie, ventilation, câblage': ['Weight, power, cooling, cabling', 'Gewicht, Energie, Kühlung, Verkabelung', 'Peso, energia, ventilazione, cablaggio', '重量、电力、散热、布线', 'الوزن والطاقة والتهوية والتوصيل', '重量、電力、冷却、配線'],
  'La salle sans lumière': ['The lightless hall', 'Der Saal ohne Licht', 'La sala senza luce', '无光大厅', 'القاعة المظلمة', '光なき部屋'],
  'Silhouettes, saut, chute': ['Silhouettes, jumps, falls', 'Silhouetten, Sprung, Sturz', 'Sagome, salto, caduta', '剪影、跳跃、坠落', 'ظلال وقفز وسقوط', 'シルエット、ジャンプ、落下'],
  'Pare-feu': ['Firewall', 'Firewall', 'Firewall', '防火墙', 'جدار الحماية', 'ファイアウォール'],
  'Bloquer le rouge, laisser passer le cyan': ['Block the red, let the cyan through', 'Rot blockieren, Cyan durchlassen', 'Blocca il rosso, lascia passare il ciano', '拦住红色，放行青色', 'احجب الأحمر ودع السماوي يمر', '赤を遮断し、シアンを通す'],
  'Triage SOC': ['SOC triage', 'SOC-Triage', 'Triage SOC', 'SOC 分诊', 'فرز SOC', 'SOC トリアージ'],
  '40 secondes pour classer les alertes': ['40 seconds to sort the alerts', '40 Sekunden, um die Alarme einzuordnen', '40 secondi per classificare gli avvisi', '40 秒内给告警分级', '40 ثانية لتصنيف التنبيهات', '40 秒でアラートを分類'],
  'Collecte de paquets': ['Packet collection', 'Pakete sammeln', 'Raccolta di pacchetti', '收集数据包', 'جمع الحزم', 'パケット収集'],
  'La sonde parcourt le réseau': ['The probe roams the network', 'Die Sonde durchstreift das Netz', 'La sonda percorre la rete', '探测器巡游网络', 'المسبار يجوب الشبكة', '探査機がネットワークを巡る'],
  'Renvoyer les attaques': ['Bounce the attacks back', 'Angriffe zurückschlagen', 'Respingi gli attacchi', '反弹攻击', 'ردّ الهجمات', '攻撃を打ち返す'],
  'La raquette protège le pare-feu': ['The paddle protects the firewall', 'Der Schläger schützt die Firewall', 'La racchetta protegge il firewall', '球拍保护防火墙', 'المضرب يحمي جدار الحماية', 'パドルがファイアウォールを守る'],
  'Trouver l\'intrusion': ['Find the intrusion', 'Den Eindringling finden', 'Trova l\'intrusione', '找出入侵', 'اكتشف الاختراق', '侵入を見つける'],
  'Déduction sur une grille de machines': ['Deduction on a grid of machines', 'Deduktion auf einem Raster von Rechnern', 'Deduzione su una griglia di macchine', '在机器网格上推理', 'استنتاج على شبكة من الأجهزة', 'マシンの格子で推理'],
  'Inventaire du parc': ['Fleet inventory', 'Inventar des Parks', 'Inventario del parco', '设备盘点', 'جرد الأجهزة', '機器の棚卸し'],
  'Retrouver les huit paires': ['Find the eight pairs', 'Die acht Paare finden', 'Ritrova le otto coppie', '找出八对', 'اعثر على الأزواج الثمانية', '8 組のペアを探す'],
  'Temps de réaction': ['Reaction time', 'Reaktionszeit', 'Tempo di reazione', '反应时间', 'زمن الاستجابة', '反応時間'],
  'Couper le lien dès l\'alerte': ['Cut the link at the alert', 'Die Verbindung beim Alarm kappen', 'Taglia il collegamento all\'allarme', '告警一响立刻断开链路', 'اقطع الرابط عند التنبيه', 'アラートと同時に回線を切る'],
  'Séquence de démarrage': ['Boot sequence', 'Startsequenz', 'Sequenza di avvio', '启动序列', 'تسلسل الإقلاع', '起動シーケンス'],
  'Reproduire l\'ordre d\'allumage': ['Repeat the power-on order', 'Die Einschaltreihenfolge nachspielen', 'Riproduci l\'ordine di accensione', '复现开机顺序', 'أعد ترتيب التشغيل', '起動順を再現する'],
  'Action': ['Action', 'Action', 'Azione', '动作', 'أكشن', 'アクション'],
  'Stratégie': ['Strategy', 'Strategie', 'Strategia', '策略', 'استراتيجية', '戦略'],
  'Gestion': ['Management', 'Management', 'Gestione', '经营', 'إدارة', '経営'],
  'Réflexion': ['Puzzle', 'Denkspiel', 'Riflessione', '解谜', 'تفكير', '思考'],
  'Plateforme': ['Platformer', 'Jump \'n\' Run', 'Platform', '平台跳跃', 'منصات', 'プラットフォーマー'],
  'Réflexes': ['Reflexes', 'Reflexe', 'Riflessi', '反应', 'ردود فعل', '反射神経'],
  'Arcade': ['Arcade', 'Arcade', 'Arcade', '街机', 'أركيد', 'アーケード'],
  'Mémoire': ['Memory', 'Gedächtnis', 'Memoria', '记忆', 'ذاكرة', '記憶'],
};

function detecter() {
  let st = null;
  try { st = localStorage.getItem(CLE); } catch {}
  if (LANGUES.includes(st)) return st;
  const n = (navigator.languages?.[0] || navigator.language || 'fr').toLowerCase();
  if (n.startsWith('de-ch')) return 'de-CH';
  return ['ar', 'ja', 'zh', 'de', 'it', 'fr'].find((l) => n.startsWith(l)) || 'en';
}

export let langue = detecter();
const abonnes = [];

// Une traduction manquante reste en français, comme sur le portfolio. Les # sont remplis dans l'ordre.
export function t(fr, ...valeurs) {
  let texte = fr;
  if (langue !== 'fr' && T[fr]) texte = T[fr][COLONNE[langue]] ?? fr;
  if (langue === 'de-CH') texte = texte.replaceAll('ß', 'ss');
  for (const v of valeurs) texte = texte.replace('#', v);
  return texte;
}

export function surLangue(fn) { abonnes.push(fn); }

// La page : data-t traduit le texte d'un élément, data-t-aria son étiquette. Le français reste la source, sur l'élément.
function traduirePage() {
  document.documentElement.lang = langue;
  document.documentElement.dir = langue === 'ar' ? 'rtl' : 'ltr';
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t ||= el.textContent);
  for (const el of document.querySelectorAll('[data-t-aria]')) el.setAttribute('aria-label', t(el.dataset.tAria ||= el.getAttribute('aria-label')));
  document.documentElement.style.setProperty('--entrer', JSON.stringify(t('Entrer :')));
}

export function choisir(code) {
  if (!LANGUES.includes(code) || code === langue) return;
  langue = code;
  try { localStorage.setItem(CLE, code); } catch {}
  traduirePage();
  for (const fn of abonnes) fn();
}

// Le sélecteur : le même que celui du portfolio, code de la langue et liste déroulante.
export function brancherSelecteur(racine) {
  const bouton = racine.querySelector('button');
  const code = racine.querySelector('[data-langue-code]');
  const liste = racine.querySelector('ul');
  const fermer = () => { liste.hidden = true; bouton.setAttribute('aria-expanded', 'false'); };
  const marquer = () => {
    code.textContent = langue === 'de-CH' ? 'CH' : langue.toUpperCase();
    for (const b of liste.querySelectorAll('button')) b.setAttribute('aria-current', String(b.dataset.langue === langue));
  };
  for (const c of LANGUES) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.langue = c;
    b.lang = c;
    b.textContent = NOMS[c];
    b.addEventListener('click', () => { choisir(c); fermer(); bouton.focus(); });
    li.append(b);
    liste.append(li);
  }
  bouton.addEventListener('click', () => { liste.hidden = !liste.hidden; bouton.setAttribute('aria-expanded', String(!liste.hidden)); });
  addEventListener('click', (e) => { if (!racine.contains(e.target)) fermer(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') fermer(); });
  surLangue(marquer);
  marquer();
}

traduirePage();
