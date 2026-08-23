/* AD·2026 — traduction. Table indexée par la chaîne française exacte.
   Ordre des colonnes : en, de, it, zh. Une chaîne absente reste en français. */
(function(){
if(window.I18N) return;   /* déjà chargé : on ne repart pas de zéro */
var L = ['fr', 'en', 'de', 'it', 'zh', 'ar', 'ja'];
var NAMES = { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', zh: '中文', ar: 'العربية', ja: '日本語' };
var RTL = { ar: 1 };
var T = {
/* --- libellés restés en français, ajoutés après relevé sur la page en ligne :
   ces 48 chaînes portaient bien data-i18n-fr mais n'avaient aucune entrée
   ici, et une chaîne absente de cette table reste en français. --- */
'Baie A · 24 U — une salle parmi d\'autres': ['Baie A · 24 U — one room among many', 'Baie A · 24 U — ein Raum unter vielen', 'Baie A · 24 U — una sala tra tante', 'Baie A · 24 U — 众多机房之一', 'Baie A · 24 U — قاعة من بين قاعات أخرى', 'Baie A · 24 U — 数あるサーバー室のひとつ'],
'SFP dégradé': ['SFP degraded', 'SFP degradiert', 'SFP degradato', 'SFP 性能下降', 'SFP متدهور', 'SFP 劣化'],
'support 24/7 · échéance 02.2028': ['24/7 support · expires 02.2028', '24/7-Support · Ablauf 02.2028', 'supporto 24/7 · scadenza 02.2028', '24/7 支持 · 到期 02.2028', 'دعم 24/7 · ينتهي في 02.2028', '24/7 サポート · 期限 02.2028'],
'INC-4419 · pièce commandée': ['INC-4419 · part ordered', 'INC-4419 · Teil bestellt', 'INC-4419 · ricambio ordinato', 'INC-4419 · 备件已订购', 'INC-4419 · تم طلب القطعة', 'INC-4419 · 部品発注済み'],
'Salle sous contrôle': ['Room under control', 'Raum unter Kontrolle', 'Sala sotto controllo', '机房尽在掌控', 'القاعة تحت السيطرة', 'サーバー室は正常'],
'Allée froide': ['Cold aisle', 'Kaltgang', 'Corridoio freddo', '冷通道', 'الممر البارد', 'コールドアイル'],
'— consommation par baie, chaleur, capacité restante, matériel sous-utilisé': ['— consumption per rack, heat, remaining capacity, underused hardware', '— Verbrauch pro Rack, Wärme, Restkapazität, kaum genutzte Hardware', '— consumo per rack, calore, capacità residua, hardware sottoutilizzato', '— 每机柜功耗、发热、剩余容量、利用率低的设备', '— الاستهلاك لكل خزانة، الحرارة، السعة المتبقية، العتاد غير المستغل', '— ラックごとの消費電力、発熱、残り容量、稼働率の低い機材'],
'— RGPD et LPD : données minimisées, accès tracés, hébergement maîtrisé': ['— GDPR and FADP: minimised data, logged access, controlled hosting', '— DSGVO und DSG: Daten minimiert, Zugriffe protokolliert, Hosting kontrolliert', '— GDPR e LPD: dati minimizzati, accessi tracciati, hosting controllato', '— GDPR 与 LPD：数据最小化、访问可追溯、托管自主可控', '— GDPR وLPD: تقليل البيانات، تتبّع الوصول، استضافة مُتحكَّم فيها', '— GDPR と LPD：データ最小化、アクセス記録、ホスティングは管理下'],
'DONNÉES QUALIFIÉES → 6 BANCS DE MÉMOIRE': ['VETTED DATA → 6 MEMORY BANKS', 'QUALIFIZIERTE DATEN → 6 SPEICHERBÄNKE', 'DATI QUALIFICATI → 6 BANCHI DI MEMORIA', '合格数据 → 6 个内存组', 'بيانات مُدقَّقة → 6 بنوك ذاكرة', '選別済みデータ → メモリバンク6基'],
'Débit mesuré, pas annoncé : tokens par seconde relevés par modèle et par longueur de contexte': ['Measured throughput, not advertised: tokens per second recorded per model and context length', 'Gemessener Durchsatz, keine Herstellerangabe: Tokens pro Sekunde je Modell und Kontextlänge', 'Throughput misurato, non dichiarato: token al secondo rilevati per modello e lunghezza di contesto', '实测吞吐量，非官方标称：按模型与上下文长度记录的每秒 token 数', 'إنتاجية مقيسة لا مُعلَنة: توكنات في الثانية مُسجَّلة لكل نموذج ولكل طول سياق', '公称ではなく実測のスループット：モデル別・コンテキスト長別の毎秒トークン数'],
'plus gros modèle tenu': ['largest model sustained', 'größtes lauffähiges Modell', 'modello più grande sostenuto', '可稳定运行的最大模型', 'أكبر نموذج يعمل بثبات', '安定動作した最大モデル'],
'donnée client sortante': ['outbound customer data', 'ausgehende Kundendaten', 'dati cliente in uscita', '外发客户数据', 'بيانات عملاء صادرة', '外部送信の顧客データ'],
'Bloc carte mère': ['Motherboard assembly', 'Mainboard-Block', 'Blocco scheda madre', '主板模块', 'وحدة اللوحة الأم', 'マザーボードブロック'],
'Fumée': ['Smoke', 'Rauch', 'Fumo', '烟雾', 'دخان', '煙'],
'Vue éclatée': ['Exploded view', 'Explosionsansicht', 'Vista esplosa', '爆炸视图', 'منظر مُفكَّك', '分解図'],
'glissez pour tourner · les boutons + et − pour approcher · la molette fait défiler la page': ['drag to rotate · the + and − buttons to zoom · the wheel scrolls the page', 'ziehen Sie zum Drehen · + und − zum Zoomen · das Mausrad scrollt die Seite', 'trascina per ruotare · i pulsanti + e − per avvicinarti · la rotellina fa scorrere la pagina', '拖动旋转 · + 和 − 按钮缩放 · 滚轮滚动页面', 'اسحب للتدوير · الزران + و − للتقريب · العجلة تُمرّر الصفحة', 'ドラッグで回転 · + と − ボタンでズーム · ホイールはページをスクロール'],
'BTS CIEL option A — Informatique & Réseaux': ['BTS CIEL option A — IT & Networks', 'BTS CIEL Option A — IT & Netzwerke', 'BTS CIEL opzione A — Informatica & Reti', 'BTS CIEL A 方向 — 信息技术与网络', 'BTS CIEL الخيار A — المعلوماتية والشبكات', 'BTS CIEL オプションA — 情報・ネットワーク'],
'obtenu par VAE — dossier de six activités, soutenu devant jury': ['via prior-learning assessment — six-activity dossier, oral defence', 'durch Berufserfahrung erworben — sechs Tätigkeiten, vor Jury verteidigt', 'per convalida dell\'esperienza — sei attività, discusse in commissione', '通过经验认证获得 — 六项活动档案，评审答辩通过', 'بالاعتراف بالخبرة المهنية — ملف من ستة أنشطة، نوقش أمام لجنة', '実務経験の認定で取得 — 6件の活動報告書、審査委員会で口頭審査'],
'Administrateur systèmes & réseaux': ['Systems & network administrator', 'System- & Netzwerkadministrator', 'Amministratore di sistemi & reti', '系统与网络管理员', 'مدير أنظمة وشبكات', 'システム＆ネットワーク管理者'],
'150 postes migrés · rançongiciel restauré sans perte': ['150 workstations migrated · ransomware recovery, no loss', '150 Rechner migriert · Ransomware ohne Datenverlust behoben', '150 postazioni migrate · ransomware risolto senza perdite', '150 台终端迁移 · 勒索软件攻击后完整恢复，数据零丢失', 'ترحيل 150 محطة عمل · استعادة بعد هجوم فدية دون فقدان بيانات', '150 台の端末を移行 · ランサムウェア被害から損失なく復旧'],
'Nettici — services numériques': ['Nettici — digital services', 'Nettici — digitale Dienste', 'Nettici — servizi digitali', 'Nettici — 数字服务', 'Nettici — خدمات رقمية', 'Nettici — デジタルサービス'],
'Horlogerie & énergie — Arc jurassien': ['Watchmaking & energy — Arc jurassien', 'Uhrenindustrie & Energie — Arc jurassien', 'Orologeria & energia — Arc jurassien', '钟表业与能源 — Arc jurassien', 'صناعة الساعات والطاقة — Arc jurassien', '時計産業＆エネルギー — Arc jurassien'],
'cuivre & fibre certifiés à l\'appareil — Fluke, LanTek': ['copper & fibre certified with the tester — Fluke, LanTek', 'Kupfer & LWL mit Messgerät zertifiziert — Fluke, LanTek', 'rame & fibra certificati con strumento — Fluke, LanTek', '铜缆与光纤经仪器认证 — Fluke、LanTek', 'نحاس وألياف مُعتمَدة بجهاز القياس — Fluke, LanTek', '銅線＆光ファイバーを測定器で認証 — Fluke, LanTek'],
'Wilight Telecoms — Neuchâtel, industrie horlogère': ['Wilight Telecoms — Neuchâtel, watchmaking industry', 'Wilight Telecoms — Neuchâtel, Uhrenindustrie', 'Wilight Telecoms — Neuchâtel, industria orologiera', 'Wilight Telecoms — Neuchâtel，钟表工业', 'Wilight Telecoms — Neuchâtel، صناعة الساعات', 'Wilight Telecoms — Neuchâtel、時計産業'],
'parc entièrement documenté · coût télécom −35 %': ['IT estate fully documented · telecom cost −35 %', 'Bestand lückenlos dokumentiert · Telekomkosten −35 %', 'parco IT interamente documentato · costo telecom −35 %', '资产全面建档 · 电信成本 −35 %', 'منظومة موثّقة بالكامل · تكلفة الاتصالات −35 %', '資産を全件文書化 · 通信費 −35 %'],
'0 / 3 épreuves gagnées': ['0 / 3 challenges won', '0 / 3 Runden gewonnen', '0 / 3 prove vinte', '0 / 3 项挑战获胜', '0 / 3 تحديات رُبحت', '0 / 3 課題クリア'],
'Priorité 1 = production arrêtée · Bruit = aucune action attendue.': ['Priority 1 = production down · Noise = no action expected.', 'Priorität 1 = Produktion steht · Rauschen = keine Aktion nötig.', 'Priorità 1 = produzione ferma · Rumore = nessuna azione attesa.', '优先级 1 = 生产中断 · 噪声 = 无需处理。', 'الأولوية 1 = توقّف الإنتاج · ضجيج = لا إجراء مطلوب.', '優先度 1 = 生産停止 · ノイズ = 対応不要。'],
'Tenir le pare-feu': ['Hold the firewall', 'Die Firewall halten', 'Difendi il firewall', '守住防火墙', 'حماية الجدار الناري', 'ファイアウォールを守る'],
'rouge = à bloquer · cyan = à laisser passer': ['red = block · cyan = let through', 'rot = blockieren · cyan = durchlassen', 'rosso = bloccare · ciano = lasciar passare', '红色 = 拦截 · 青色 = 放行', 'الأحمر = احجبه · السماوي = مرّره', '赤 = 遮断 · シアン = 通過'],
'vol 3D · flèches et espace': ['3D flight · arrows and space', '3D-Flug · Pfeiltasten, Leertaste', 'volo 3D · frecce e spazio', '3D 飞行 · 方向键与空格', 'طيران ثلاثي الأبعاد · الأسهم والمسافة', '3D 飛行 · 矢印キーとスペース'],
'traversez la salle sans rien heurter': ['cross the room without hitting anything', 'durchqueren Sie den Raum, ohne anzustoßen', 'attraversa la sala senza urtare nulla', '穿过机房，不要撞到任何东西', 'اعبر القاعة دون أن تصطدم بشيء', '何にもぶつからずにサーバー室を抜ける'],
'un LLM local à faire grandir — il vit même quand vous partez': ['a local LLM to raise — it lives on even when you leave', 'ein lokales LLM zum Großziehen — es lebt weiter, wenn Sie gehen', 'un LLM locale da far crescere — vive anche quando te ne vai', '一个待培育的本地 LLM — 您离开后它依然活着', 'نموذج LLM محلي تربّيه — يبقى حيًّا حتى بعد مغادرتك', '育てるローカル LLM — 離れている間も生き続けます'],
'âge 0 j': ['age 0 d', 'Alter 0 T', 'età 0 g', '年龄 0 天', 'العمر 0 يوم', '年齢 0 日'],
'Élevez un modèle': ['Raise a model', 'Ziehen Sie ein Modell auf', 'Alleva un modello', '培育一个模型', 'ربِّ نموذجًا', 'モデルを育てましょう'],
'Il vient de naître. Donnez-lui des données propres, gardez-le froid, et alignez-le avant qu\'il ne raconte n\'importe quoi.': ['It was just born. Feed it clean data, keep it cool, and align it before it starts talking nonsense.', 'Es ist gerade erst geboren. Geben Sie ihm saubere Daten, halten Sie es kühl und richten Sie es aus, bevor es Unsinn erzählt.', 'È appena nato. Dagli dati puliti, tienilo al fresco e allinealo prima che inizi a dire sciocchezze.', '它刚刚诞生。喂给它干净的数据，让它保持低温，在它开始胡言乱语之前完成对齐。', 'لقد وُلد للتو. أطعمه بيانات نظيفة، وأبقِه باردًا، ووائِمه قبل أن يهذي.', '生まれたばかりです。クリーンなデータを与え、冷却を保ち、でたらめを言い出す前にアラインメントしてください。'],
'Données': ['Data', 'Daten', 'Dati', '数据', 'البيانات', 'データ'],
'Entraînement': ['Training', 'Training', 'Addestramento', '训练', 'التدريب', '学習'],
'flèches ou glissé du doigt': ['arrows or swipe', 'Pfeiltasten oder Wischen', 'frecce o scorrimento del dito', '方向键或滑动', 'الأسهم أو السحب بالإصبع', '矢印キーまたはスワイプ'],
'flèches ou glissé du doigt · un paquet allonge la sonde': ['arrows or swipe · a packet extends the probe', 'Pfeiltasten oder Wischen · ein Paket verlängert die Sonde', 'frecce o scorrimento del dito · un pacchetto allunga la sonda', '方向键或滑动 · 每个数据包让探针变长', 'الأسهم أو السحب بالإصبع · كل حزمة تُطيل المسبار', '矢印キーまたはスワイプ · パケットを取るとプローブが伸びる'],
'la raquette protège le pare-feu': ['the paddle protects the firewall', 'der Schläger schützt die Firewall', 'la racchetta protegge il firewall', '球拍保护防火墙', 'المضرب يحمي الجدار الناري', 'パドルがファイアウォールを守る'],
'souris, flèches ou doigt': ['mouse, arrows or finger', 'Maus, Pfeiltasten, Finger', 'mouse, frecce o dito', '鼠标、方向键或手指', 'الفأرة أو الأسهم أو الإصبع', 'マウス・矢印キー・指'],
'attendez le rouge, puis cliquez · trop tôt = faux positif': ['wait for red, then click · too early = false positive', 'warten Sie auf Rot, dann klicken Sie · zu früh = Fehlalarm', 'aspetta il rosso, poi clicca · troppo presto = falso positivo', '等到变红再点击 · 太早 = 误报', 'انتظر الأحمر ثم انقر · مبكّرًا جدًا = إنذار كاذب', '赤くなってからクリック · 早すぎると誤検知'],
'regardez la séquence, puis reproduisez-la': ['watch the sequence, then repeat it', 'sehen Sie zu, dann wiederholen Sie die Sequenz', 'guarda la sequenza, poi riproducila', '观察序列，然后重复一遍', 'شاهد التسلسل ثم كرّره', '順序を見て、そのまま再現してください'],
'Terminal — équipe rouge, équipe bleue': ['Terminal — red team, blue team', 'Terminal — Red Team, Blue Team', 'Terminale — squadra rossa, squadra blu', '终端 — 红队、蓝队', 'الطرفية — الفريق الأحمر، الفريق الأزرق', 'ターミナル — レッドチーム、ブルーチーム'],
'Vous jouez l\'attaque. Objectif : prendre la base de données en douze tours.': ['You play the attacker. Goal: take the database in twelve turns.', 'Sie greifen an. Ziel: die Datenbank in zwölf Zügen einnehmen.', 'Giochi in attacco. Obiettivo: prendere il database in dodici turni.', '您扮演攻击方。目标：十二回合内拿下数据库。', 'أنت المهاجم. الهدف: الاستيلاء على قاعدة البيانات في اثني عشر دورًا.', 'あなたは攻撃側です。目標：12 ターンでデータベースを奪取。'],
'Tapez help pour la liste des commandes.': ['Type help for the command list.', 'Tippen Sie help für die Befehlsliste.', 'Digita help per l\'elenco dei comandi.', '输入 help 查看命令列表。', 'اكتب help لعرض قائمة الأوامر.', 'help と入力するとコマンド一覧が出ます。'],
'ENTRÉE': ['ENTER', 'EINGABE', 'INVIO', '回车', 'إدخال', 'エンター'],
'Bienvenue sur le portfolio d\'Anas Dine. Cliquez un point jaune : l\'explication s\'affiche ici, et se dit à voix haute.': ['Welcome to Anas Dine\'s portfolio. Click a yellow dot: the explanation appears here, and is read aloud.', 'Willkommen im Portfolio von Anas Dine. Klicken Sie auf einen gelben Punkt: Die Erklärung erscheint hier und wird vorgelesen.', 'Benvenuto nel portfolio di Anas Dine. Clicca su un punto giallo: la spiegazione appare qui e viene letta ad alta voce.', '欢迎来到 Anas Dine 的作品集。点击任意黄点：说明会显示在此处，并同步朗读。', 'مرحبًا بك في ملف أعمال Anas Dine. انقر على نقطة صفراء: يظهر الشرح هنا ويُقرأ بصوت عالٍ.', 'Anas Dine のポートフォリオへようこそ。黄色い点をクリックすると、説明がここに表示され、音声でも読み上げられます。'],

/* le bloc du diplôme peut arriver aplati en un seul nœud : on garde donc
   aussi la forme concaténée, sinon il reste dans la langue précédente */
'BTS CIEL option A — Informatique & Réseauxobtenu par VAE — dossier de six activités, soutenu devant jury': ['BTS CIEL option A — Computing & Networksobtained through prior-learning assessment — a six-activity portfolio, defended before a panel', 'BTS CIEL Option A — Informatik & Netzwerkeerworben durch Anerkennung von Berufserfahrung — Portfolio mit sechs Tätigkeiten, vor einer Jury verteidigt', 'BTS CIEL opzione A — Informatica e Retiottenuto per convalida dell\'esperienza — un dossier di sei attività, discusso davanti a una giuria', 'BTS CIEL A 方向 — 计算机与网络通过经验认证取得 — 六项活动的档案，在评审团前答辩', 'BTS CIEL خيار A — الحوسبة والشبكاتمُحصَّل بالاعتراف بالخبرة — ملف من ست أنشطة، نوقش أمام لجنة', 'BTS CIEL オプション A — 情報・ネットワーク実務経験の認定により取得 — 六つの活動の記録、審査員の前で発表'],
'TROIS AGENTS, DEUX BAIES, UN HUMAIN QUI REGARDE — CLIQUEZ POUR AGIR': ['THREE AGENTS, TWO RACKS, ONE HUMAN WATCHING — CLICK TO ACT', 'DREI AGENTEN, ZWEI RACKS, EIN MENSCH SIEHT ZU — KLICKEN ZUM HANDELN', 'TRE AGENTI, DUE ARMADI, UN UMANO CHE GUARDA — CLICCA PER AGIRE', '三个代理、两个机柜、一个人在看 — 点击操作', 'ثلاثة عملاء، خزانتان، وإنسان يراقب — انقر للتصرف', '三体のエージェント、二つのラック、見守る人間 — クリックで操作'],
'flèches ou souris · espace pour tirer · doigt sur mobile': ['arrows or mouse · space to fire · finger on mobile', 'Pfeiltasten oder Maus · Leertaste zum Feuern · Finger am Handy', 'frecce o mouse · spazio per sparare · dito su mobile', '方向键或鼠标 · 空格开火 · 手机用手指', 'الأسهم أو الفأرة · مسافة للإطلاق · الإصبع على الهاتف', '矢印キーまたはマウス · スペースで発射 · スマホは指で'],
'Huit ans, des écarts mesurés': ['Eight years, measured gaps', 'Acht Jahre, gemessene Unterschiede', 'Otto anni, scarti misurati', '八年、測った差', 'ثماني سنوات، فوارق مقاسة', '八年、測った差'],
'Le système tourne': ['The system runs', 'Das System läuft', 'Il sistema gira', '系统在运行', 'النّظام يعمل', 'システムは稼働中'],
'Bonus': ['Bonus', 'Bonus', 'Bonus', '彩蛋', 'مكافأة', 'ボーナス'],
'Merci d\'avoir pris le temps de lire': ['Thank you for taking the time to read', 'Danke, dass Sie sich die Zeit zum Lesen genommen haben', 'Grazie per il tempo dedicato alla lettura', '感谢您耗时阅读', 'شكرًا لأنك خصصت وقتًا للقراءة', 'お読みいただきありがとうございます'],
'EN BAS DE PAGE, UNE PANOPLIE DE JEUX': ['A WHOLE SET OF GAMES DOWN THE PAGE', 'UNTEN AUF DER SEITE: EINE GANZE REIHE SPIELE', 'IN FONDO ALLA PAGINA, UNA SERIE DI GIOCHI', '页面底部还有一整套游戏', 'في أسفل الصفحة مجموعة ألعاب', 'フィージ下部にゲーム一式'],
'Je veux suivre mes clients sans tableur.': ['I want to track my clients without a spreadsheet.', 'Ich will meine Kunden ohne Tabelle verfolgen.', 'Voglio seguire i miei clienti senza fogli di calcolo.', '我想不用表格就能跟踪客户。', 'أريد متابعة عملائي بدون جدول بيانات.', '表計算なしで顧客を追いたい。'],
'J\'ai besoin d\'un site qui explique ce que je fais.': ['I need a site that explains what I do.', 'Ich brauche eine Seite, die erklärt, was ich mache.', 'Mi serve un sito che spieghi cosa faccio.', '我需要一个说明我业务的网站。', 'أحتاج موقعًا يشرح ما أفعله.', '自分の仕事を説明するサイトが必要だ。'],
'Mes devis me prennent trop de temps.': ['My quotes take me too long.', 'Meine Angebote kosten mich zu viel Zeit.', 'I miei preventivi mi prendono troppo tempo.', '做报价太耗时间。', 'عروض الأسعار تستهلك وقتي.', '見積作成に時間がかかりすぎる。'],
'Mes clients devraient prendre rendez-vous seuls.': ['My clients should book appointments themselves.', 'Meine Kunden sollten selbst Termine buchen.', 'I miei clienti dovrebbero prenotare da soli.', '客户应该能自己预约。', 'ينبغي أن يحدّد العملاء مواعيدهم بأنفسهم.', '顧客が自分で予約できるべきだ。'],
'Je perds mes documents dans les courriels.': ['I lose my documents in email.', 'Ich verliere meine Dokumente in E-Mails.', 'Perdo i documenti nelle email.', '文件都埋在邮件里。', 'أفقد مستنداتي داخل البريد.', '書類がメールに埋もれる。'],
'Comptes & accès': ['Accounts & access', 'Konten & Zugriff', 'Account e accessi', '账号与权限', 'الحسابات والوصول', 'アカウントと権限'],
'qui entre, et jusqu\'où': ['who gets in, and how far', 'wer hereinkommt, und wie weit', 'chi entra, e fino a dove', '谁能进，能进多深', 'من يدخل، وإلى أي حد', '誰がどこまで入れるか'],
'déposés, versionnés, retrouvés': ['filed, versioned, found again', 'abgelegt, versioniert, wiedergefunden', 'depositati, versionati, ritrovati', '归档、版本、可检索', 'مُودعة، بإصدارات، ويُعاد إيجادها', '保管・版管理・再発見'],
'courriel, message, rappel': ['email, message, reminder', 'E-Mail, Nachricht, Erinnerung', 'email, messaggio, promemoria', '邮件、短信、提醒', 'بريد، رسالة، تذكير', 'メール・メッセージ・リマインド'],
'Paiement': ['Payment', 'Zahlung', 'Pagamento', '支付', 'الدفع', '決済'],
'devis, facture, encaissement': ['quote, invoice, collection', 'Angebot, Rechnung, Zahlungseingang', 'preventivo, fattura, incasso', '报价、发票、收款', 'عرض، فاتورة، تحصيل', '見積・請求・入金'],
'Intégrations': ['Integrations', 'Integrationen', 'Integrazioni', '集成', 'التكاملات', '連携'],
'ce qui existe déjà chez vous': ['what you already run', 'was bei Ihnen schon läuft', 'ciò che avete già', '你们已有的系统', 'ما هو قائم عندكم', 'すでにある仕組み'],
'Traçabilité': ['Traceability', 'Nachvollziehbarkeit', 'Tracciabilità', '可追溯', 'التتبّع', '追跡性'],
'qui a fait quoi, et quand': ['who did what, and when', 'wer was wann getan hat', 'chi ha fatto cosa, e quando', '谁做了什么，何时', 'من فعل ماذا ومتى', '誰が何を、いつ'],
'ce que vos clients voient': ['what your clients see', 'was Ihre Kunden sehen', 'quello che vedono i vostri clienti', '客户看到的', 'ما يراه عملاءكم', '顧客が見るもの'],
'OUTIL EN LIGNE': ['ONLINE TOOL', 'ONLINE-WERKZEUG', 'STRUMENTO ONLINE', '在线工具', 'أداة عبر الإنترنت', 'オンラインツール'],
'ce que vous utilisez tous les jours': ['what you use every day', 'was Sie täglich nutzen', 'quello che usate ogni giorno', '你每天用的', 'ما تستخدمونه كل يوم', '毎日使うもの'],
'BRUIT': ['NOISE', 'RAUSCHEN', 'RUMORE', '噪声', 'ضجيج', 'ノイズ'],
'JOUER': ['PLAY', 'SPIELEN', 'GIOCA', '开始', 'ابدأ', 'プレイ'],
'REJOUER': ['PLAY AGAIN', 'NOCHMAL', 'RIGIOCA', '再玩一次', 'إعادة اللعب', 'もう一度'],
'Jouer': ['Play', 'Spielen', 'Gioca', '开始', 'ابدأ', 'プレイ'],
'EN VOL': ['IN FLIGHT', 'IM FLUG', 'IN VOLO', '飞行中', 'في الطيران', '飛行中'],
'DÉCOLLER': ['TAKE OFF', 'ABHEBEN', 'DECOLLA', '起飞', 'إطلاق', '発進'],
'en pause': ['paused', 'pausiert', 'in pausa', '已暂停', 'متوقف', '一時停止'],
'Fermer': ['Close', 'Schließen', 'Chiudi', '关闭', 'إغلاق', '閉じる'],
'Discuter avec l\'assistant': ['Chat with the assistant', 'Mit dem Assistenten chatten', 'Parla con l\'assistente', '与助手对话', 'التحدث مع المساعد', 'アシスタントと話す'],
'Vaisseau': ['Ship', 'Schiff', 'Nave', '飞船', 'المركبة', '機体'],
'corridor de données': ['data corridor', 'Datenkorridor', 'corridoio di dati', '数据走廊', 'ممر البيانات', 'データ回廊'],
'baie froide': ['cold rack', 'kaltes Rack', 'baia fredda', '冷机柜', 'خزانة باردة', 'コールドラック'],
'zone de bruit': ['noise zone', 'Rauschzone', 'zona di rumore', '噪声区', 'منطقة الضجيج', 'ノイズ帯'],
'cœur du modèle': ['model core', 'Modellkern', 'cuore del modello', '模型核心', 'قلب النموذج', 'モデル中枢'],
'NODE CH · SUISSE ROMANDE': ['NODE CH · FRENCH-SPEAKING SWITZERLAND', 'NODE CH · WESTSCHWEIZ', 'NODE CH · SVIZZERA FRANCESE', '节点 CH · 瑞士法语区', 'العقدة CH · سويسرا الفرنسية', 'ノード CH · スイス仏語圏'],
'Portfolio · build 2026.08': ['Portfolio · build 2026.08', 'Portfolio · Build 2026.08', 'Portfolio · build 2026.08', '作品集 · 构建 2026.08', 'ملف الأعمال · إصدار 2026.08', 'ポートフォリオ · ビルド 2026.08'],
'au dernier passage': ['on the last run', 'beim letzten Durchlauf', 'all\'ultimo passaggio', '最近一次运行', 'في آخر تشغيل', '直近の実行で'],
'aucun échec': ['no failures', 'keine Fehlschläge', 'nessun fallimento', '无失败', 'بلا أي فشل', '失敗なし'],
'Testé avant d\'être livré —': ['Tested before delivery —', 'Vor der Lieferung getestet —', 'Testato prima della consegna —', '交付前已测试 —', 'مُختبر قبل التسليم —', '納品前に検証 —'],
'avec l\'IA': ['with AI', 'mit KI', 'con l\'IA', '借助 AI', 'بالذكاء الاصطناعي', 'AI とともに'],
'mémoire persistante · façon de travailler transmise au modèle': ['persistent memory · my way of working passed to the model', 'persistenter Speicher · meine Arbeitsweise an das Modell übergeben', 'memoria persistente · modo di lavorare trasmesso al modello', '持久记忆 · 我的工作方式传给模型', 'ذاكرة دائمة · طريقة عملي منقولة إلى النموذج', '永続的な記憶 · 私の働き方をモデルへ'],
'comme moi': ['like me', 'wie ich', 'come me', '像我一样', 'مثلي', '私のように'],
'Conformité tenue': ['Compliance upheld', 'Konformität gewahrt', 'Conformità garantita', '合规达标', 'الامتثال محقَّق', 'コンプライアンス遵守'],
'L\'énergie et la place': ['Power and space', 'Energie und Platz', 'Energia e spazio', '能耗与空间', 'الطاقة والمساحة', '電力と場所'],
'glisser : tourner · maj + glisser : monter · clic : figer un équipement': ['drag: rotate · shift+drag: raise · click: pin a device', 'Ziehen: drehen · Umschalt+Ziehen: heben · Klick: Gerät festhalten', 'trascina: ruota · maiusc+trascina: alza · clic: fissa un apparato', '拖动：旋转 · Shift+拖动：上移 · 点击：固定设备', 'اسحب: تدوير · Shift+سحب: رفع · نقر: تثبيت جهاز', 'ドラッグ：回転 · Shift+ドラッグ：上下 · クリック：機器を固定'],
'nom réel sorti': ['real name leaving', 'echter Name verlassen', 'nome reale uscito', '真实姓名外流', 'اسم حقيقي خرج', '外部に出た実名'],
'fichiers de tests,': ['test files,', 'Testdateien,', 'file di test,', '测试文件，', 'ملفات اختبار،', 'テストファイル、'],
'collecteurs d\'API,': ['API collectors,', 'API-Kollektoren,', 'collettori API,', 'API 采集器，', 'جامعات API،', 'API コレクター、'],
'modules Python,': ['Python modules,', 'Python-Module,', 'moduli Python,', 'Python 模块，', 'وحدات Python،', 'Python モジュール、'],
'lignes de rapport, depuis votre arrivée.': ['report lines, since you arrived.', 'Berichtszeilen, seit Ihrer Ankunft.', 'righe di report, dal vostro arrivo.', '报告行数，自您到访起。', 'أسطر تقرير، منذ وصولك.', '到着以降のレポート行数。'],
'interventions suivies ·': ['jobs tracked ·', 'Aufträge verfolgt ·', 'interventi tracciati ·', '跟踪的工单 ·', 'تدخلات متابَعة ·', '追跡した作業 ·'],
'incidents retenus ·': ['incidents kept ·', 'Störungen behalten ·', 'incidenti trattenuti ·', '保留的事件 ·', 'حوادث محتفظ بها ·', '選別した障害 ·'],
'alertes absorbées ·': ['alerts absorbed ·', 'Meldungen absorbiert ·', 'allarmi assorbiti ·', '已吸收告警 ·', 'تنبيهات مستوعبة ·', '吸収したアラート ·'],
'mini-SOC · RMM · suivi du parc — hébergé en local': ['mini-SOC · RMM · estate tracking — hosted locally', 'Mini-SOC · RMM · Bestandsverfolgung — lokal betrieben', 'mini-SOC · RMM · monitoraggio parco — ospitato in locale', '迷你 SOC · RMM · 资产跟踪 — 本地托管', 'مركز عمليات مصغّر · RMM · متابعة المنظومة — مستضاف محلياً', '小規模 SOC・RMM・資産追跡 — ローカル運用'],
'Recharger la page': ['Reload the page', 'Seite neu laden', 'Ricarica la pagina', '重新加载页面', 'إعادة تحميل الصفحة', 'ページを再読み込み'],
'Contact': ['Contact', 'Kontakt', 'Contatto', '联系', 'اتصال', 'お問い合わせ'],
'Haut de page': ['Top of page', 'Seitenanfang', 'Inizio pagina', '页首', 'أعلى الصفحة', 'ページ先頭'],
'maintenir : sommaire': ['hold: contents', 'halten: Inhalt', 'tieni premuto: sommario', '长按：目录', 'اضغط مطولاً: الفهرس', '長押し：目次'],
'[ .. ] mise en cache des couches': ['[ .. ] caching the layers', '[ .. ] Schichten werden zwischengespeichert', '[ .. ] messa in cache dei livelli', '[ .. ] 正在缓存各层', '[ .. ] تخزين الطبقات مؤقتاً', '[ .. ] レイヤーをキャッシュ中'],
'[ OK ] anonymisation — table locale, hachage déterministe': ['[ OK ] anonymisation — local table, deterministic hashing', '[ OK ] Anonymisierung — lokale Tabelle, deterministisches Hashing', '[ OK ] anonimizzazione — tabella locale, hashing deterministico', '[ OK ] 匿名化 — 本地表，确定性哈希', '[ OK ] إخفاء الهوية — جدول محلي وتجزئة حتمية', '[ OK ] 匿名化 — ローカル表、決定的ハッシュ'],
'[ OK ] collecteurs d\'API — 13 en lecture seule': ['[ OK ] API collectors — 13 read-only', '[ OK ] API-Kollektoren — 13 nur lesend', '[ OK ] collettori API — 13 in sola lettura', '[ OK ] API 采集器 — 13 个只读', '[ OK ] جامعات API — 13 للقراءة فقط', '[ OK ] API コレクター — 13 は読み取り専用'],
'[ OK ] découverte du réseau — 26 nœuds, 34 liens': ['[ OK ] network discovered — 26 nodes, 34 links', '[ OK ] Netzwerk erkannt — 26 Knoten, 34 Verbindungen', '[ OK ] rete rilevata — 26 nodi, 34 collegamenti', '[ OK ] 网络发现 — 26 个节点，34 条链路', '[ OK ] تم استكشاف الشبكة — 26 عقدة، 34 رابطاً', '[ OK ] ネットワーク探索 — ノード 26、リンク 34'],
'[ OK ] montage de l\'infrastructure — 6 hôtes, 3 sites': ['[ OK ] infrastructure assembled — 6 hosts, 3 sites', '[ OK ] Infrastruktur aufgebaut — 6 Hosts, 3 Standorte', '[ OK ] infrastruttura montata — 6 host, 3 siti', '[ OK ] 基础设施搭建完成 — 6 台主机，3 个站点', '[ OK ] تم تجهيز البنية التحتية — 6 مضيفات، 3 مواقع', '[ OK ] インフラ構築完了 — ホスト 6、拠点 3'],
'Dine': ['Dine', 'Dine', 'Dine', '迪内', 'دين', 'ディーヌ'],
'Anas': ['Anas', 'Anas', 'Anas', '阿纳斯', 'أنس', 'アナス'],
'Fin de page : le contact est juste là.': ['End of page: contact is right there.', 'Seitenende: der Kontakt ist gleich dort.', 'Fine pagina: il contatto è proprio lì.', '页面结尾：联系方式就在那里。', 'نهاية الصفحة: جهة الاتصال هناك.', 'ページ末尾 — 連絡先はすぐそこです。'],
'Section 06 : les jeux. Chacun a sa notice.': ['Section 06: the games. Each has its own instructions.', 'Abschnitt 06: die Spiele. Jedes hat eine Anleitung.', 'Sezione 06: i giochi. Ognuno ha le sue istruzioni.', '第 06 节：游戏。每个都有说明。', 'القسم 06: الألعاب. لكل واحدة تعليماتها.', '第 06 節：ゲーム。それぞれに説明があります。'],
'Section 04 : le parcours, poste par poste.': ['Section 04: the background, role by role.', 'Abschnitt 04: der Werdegang, Station für Station.', 'Sezione 04: il percorso, ruolo per ruolo.', '第 04 节：经历，逐个岗位。', 'القسم 04: المسار، منصباً بمنصب.', '第 04 節：経歴を職ごとに。'],
'Le boîtier se tourne au glissé, la molette approche.': ['Drag to rotate the enclosure, scroll to zoom.', 'Ziehen dreht das Gehäuse, das Rad zoomt.', 'Trascina per ruotare il case, la rotella zooma.', '拖动旋转机箱，滚轮缩放。', 'اسحب لتدوير الصندوق، والعجلة للتكبير.', 'ドラッグで筐体を回し、ホイールで寄れます。'],
'Ici, la salle machine se tourne au glissé.': ['Here, the server room rotates by dragging.', 'Hier lässt sich der Rechenraum durch Ziehen drehen.', 'Qui la sala macchine si ruota trascinando.', '这里的机房可以拖动旋转。', 'هنا يمكن تدوير قاعة الخدمات بالسحب.', 'ここではサーバールームをドラッグで回せます。'],
'Section 03 : les projets. Les visuels sont manipulables.': ['Section 03: the projects. The visuals are interactive.', 'Abschnitt 03: die Projekte. Die Visuals sind bedienbar.', 'Sezione 03: i progetti. I visual sono manipolabili.', '第 03 节：项目。图示可以操作。', 'القسم 03: المشاريع. الرسوم قابلة للتفاعل.', '第 03 節：プロジェクト。図は操作できます。'],
'Section 02 : quatre besoins, quatre réponses.': ['Section 02: four needs, four answers.', 'Abschnitt 02: vier Bedürfnisse, vier Antworten.', 'Sezione 02: quattro bisogni, quattro risposte.', '第 02 节：四项需求，四个答案。', 'القسم 02: أربع حاجات وأربعة حلول.', '第 02 節：四つの必要、四つの答え。'],
'Vous êtes en haut de page. Faites défiler pour la suite.': ['You\'re at the top. Scroll for more.', 'Sie sind oben. Scrollen Sie weiter.', 'Sei in cima. Scorri per il resto.', '您在页面顶部。继续滚动查看。', 'أنت في أعلى الصفحة. مرّر للمزيد.', 'ページ上部です。下へスクロールしてください。'],
'Le sommaire, la langue, la voix : tout est en haut de page.': ['Contents, language, voice: all at the top of the page.', 'Inhalt, Sprache, Stimme: alles oben auf der Seite.', 'Sommario, lingua, voce: tutto in alto nella pagina.', '目录、语言、语音：都在页面顶部。', 'الفهرس واللغة والصوت: كلها في أعلى الصفحة.', '目次、言語、音声 — すべてページ上部にあります。'],
'Je peux vous dire où trouver une information dans le site.': ['I can tell you where to find something on this site.', 'Ich kann Ihnen sagen, wo Sie etwas auf dieser Seite finden.', 'Posso dirti dove trovare un\'informazione nel sito.', '我可以告诉您在本站何处能找到信息。', 'أستطيع إخبارك بمكان أي معلومة في الموقع.', 'サイト内のどこに何があるかお伝えできます。'],
'Les pictogrammes sonores expliquent chaque zone. Essayez-en un.': ['The sound icons explain each area. Try one.', 'Die Lautsprecher-Symbole erklären jeden Bereich. Probieren Sie eines.', 'Le icone sonore spiegano ogni zona. Provane una.', '喇叭图标会讲解每个区域。试一个吧。', 'أيقونات الصوت تشرح كل منطقة. جرّب واحدة.', 'スピーカーのアイコンが各領域を説明します。試してみてください。'],
'Je suis là pour vous orienter dans la page. Cliquez-moi si vous cherchez quelque chose.': ['I\'m here to help you find your way. Click me if you\'re looking for something.', 'Ich helfe Ihnen, sich zurechtzufinden. Klicken Sie mich an, wenn Sie etwas suchen.', 'Sono qui per orientarti nella pagina. Cliccami se cerchi qualcosa.', '我在这里帮您找路。要找什么就点我。', 'أنا هنا لأدلّك في الصفحة. انقرني إن كنت تبحث عن شيء.', 'ページ内のご案内をします。お探しのものがあればクリックを。'],
'Choisissez votre langue avec le globe, en haut.': ['Pick your language with the globe, at the top.', 'Wählen Sie Ihre Sprache über den Globus oben.', 'Scegli la lingua con il globo, in alto.', '用顶部的地球图标选择语言。', 'اختر لغتك من أيقونة الكرة في الأعلى.', '上部の地球アイコンで言語を選べます。'],
'Le bouton à ma droite coupe ou rend ma voix.': ['The button beside me mutes or restores my voice.', 'Die Taste neben mir schaltet meine Stimme aus oder ein.', 'Il pulsante accanto a me disattiva o riattiva la voce.', '我旁边的按钮可关闭或开启我的语音。', 'الزر إلى جانبي يكتم صوتي أو يعيده.', '隣のボタンで私の音声を切り替えられます。'],
'Les sections sont numérotées de 01 à 06.': ['Sections are numbered 01 to 06.', 'Die Abschnitte sind von 01 bis 06 numeriert.', 'Le sezioni sono numerate da 01 a 06.', '各章节编号为 01 到 06。', 'الأقسام مرقّمة من 01 إلى 06.', 'セクションは 01 から 06 まで番号がついています。'],
'Perdu dans la page ? La barre du haut suit votre progression.': ['Lost on the page? The top bar tracks your progress.', 'Verloren auf der Seite? Die obere Leiste zeigt Ihren Fortschritt.', 'Perso nella pagina? La barra in alto segue il tuo avanzamento.', '在页面里迷路了？顶部栏会显示您的进度。', 'تائه في الصفحة؟ الشريط الأعلى يتابع تقدّمك.', '迷いましたか。上部のバーが進捗を示します。'],
'Cliquez-moi pour ouvrir la conversation.': ['Click me to open the conversation.', 'Klicken Sie mich an, um das Gespräch zu öffnen.', 'Cliccami per aprire la conversazione.', '点我即可打开对话。', 'انقرني لفتح المحادثة.', 'クリックすると会話を開きます。'],
'Le sommaire est sous le logo, en haut à gauche.': ['The contents menu is under the logo, top left.', 'Das Inhaltsmenü ist unter dem Logo, oben links.', 'Il sommario è sotto il logo, in alto a sinistra.', '目录在左上角的标志下方。', 'الفهرس تحت الشعار في الأعلى يساراً.', '目次は左上のロゴの下にあります。'],
'Surlignez un texte et je vous le commente.': ['Select some text and I\'ll comment on it.', 'Markieren Sie einen Text, ich kommentiere ihn.', 'Seleziona un testo e lo commento.', '选中一段文字，我来解读。', 'حدّد نصاً وسأشرحه.', 'テキストを選ぶと解説します。'],
'Cliquez un pictogramme sonore : je vous explique la zone.': ['Click a sound icon and I\'ll explain that area.', 'Klicken Sie ein Lautsprecher-Symbol, ich erkläre den Bereich.', 'Clicca un\'icona sonora e ti spiego quella zona.', '点击喇叭图标，我来讲解该区域。', 'انقر أيقونة الصوت وسأشرح تلك المنطقة.', 'スピーカーのアイコンを押すと、その領域を説明します。'],
'Pour couper la voix : cliquez le bouton prévu à droite du robot.': ['To mute the voice: click the dedicated button beside the robot on the right.', 'Zum Stummschalten: klicken Sie die Taste rechts neben dem Roboter.', 'Per zittire la voce: cliccate il pulsante accanto al robot a destra.', '要关闭语音：点击机器人右侧的专用按钮。', 'لإسكات الصوت: انقر الزر المخصص إلى جانب الروبوت يميناً.', '音声を止めるには、右のロボット横の専用ボタンを押してください。'],
'Le boîtier Leap57 : le cadre open-frame que je construis pour réunir mes deux RTX 4090 dans une seule machine. Glissez pour tourner, molette pour zoomer, et ouvrez la vue éclatée.': ['A real 3D flight game, written for this page. Nothing is downloaded: the ship and the corridor are generated by the code.', 'Ein echtes 3D-Flugspiel, für diese Seite geschrieben. Nichts wird geladen: Schiff und Korridor werden vom Code erzeugt.', 'Un vero gioco di volo 3D, scritto per questa pagina. Nulla è scaricato: la navetta e il corridoio sono generati dal codice.', '一个真正的 3D 飞行游戏，为这个页面而写。没有任何下载：飞船与走廊都由代码生成。', 'لعبة طيران ثلاثية الأبعاد حقيقية كُتبت لهذه الصفحة. لا شيء يُنزَّل: السفينة والممر يولّدهما الكود.', 'このページのために書いた本物の 3D 飛行ゲームです。ダウンロードはなし：機体と回廊はコードが生成します。'],
'Ce que je fais : une demande arrive en langage courant, je réutilise mon socle, l\'IA accélère, et il en sort un site web et un outil en ligne. Cliquez pour voir une autre demande.': ['The Leap57 enclosure: the open-frame chassis I am building to bring my two RTX 4090 into a single machine. Drag to rotate, wheel to zoom, and open the exploded view.', 'Das Leap57-Gehäuse: der Open-Frame-Rahmen, den ich baue, um meine zwei RTX 4090 in einer Maschine zu vereinen. Ziehen zum Drehen, Rad zum Zoomen, Explosionsansicht öffnen.', 'Il case Leap57: il telaio open-frame che sto costruendo per riunire le mie due RTX 4090 in una sola macchina. Trascina per ruotare, rotella per zoomare, apri la vista esplosa.', 'Leap57 机箱：我正在搭建的开放式框架，用于把两块 RTX 4090 装进同一台机器。拖动旋转，滚轮缩放，可打开爆炸视图。', 'صندوق Leap57: هيكل مفتوح أبنيه لجمع بطاقتَي RTX 4090 في جهاز واحد. اسحب للدوران، والعجلة للتكبير، وافتح العرض المفكّك.', 'Leap57 の筐体：二枚の RTX 4090 を一台にまとめるため製作中のオープンフレームです。ドラッグで回転、ホイールで拡大、分解表示も開けます。'],
'Atelier jouable : trois agents traitent les pannes de la baie. Cliquez un équipement pour le prioriser, un agent pour l\'accélérer, un établi pour aider.': ['What I do: a request arrives in plain language, I reuse my foundation, AI speeds things up, and out come a website and an online tool. Click to see another request.', 'Was ich mache: eine Anfrage kommt in Alltagssprache, ich nutze mein Fundament wieder, KI beschleunigt, und heraus kommen eine Website und ein Online-Werkzeug. Klicken für eine andere Anfrage.', 'Cosa faccio: una richiesta arriva in linguaggio comune, riuso la mia base, l\'IA accelera, e ne escono un sito e uno strumento online. Clicca per un\'altra richiesta.', '我的做法：需求以平常话到来，我复用自己的底座，AI 加速推进，最后产出一个网站与一个在线工具。点击可看另一个需求。', 'ما أفعله: يأتي الطلب بلغة عادية، أعيد استخدام أساسي، والذكاء الاصطناعي يُسرّع، فيخرج موقع وأداة على الإنترنت. انقر لطلب آخر.', '私の進め方：平易な言葉で要望が届き、自分の土台を再利用し、AI が加速させ、ウェブサイトとオンラインツールが出てきます。クリックで別の要望へ。'],
'Un mur de baies supervisées : chaque diode est un équipement suivi, et une alerte est localisée à la baie et au tiroir près.': ['Playable workshop: three agents handle the rack\'s faults. Click a device to prioritise it, an agent to speed it up, a bench to lend a hand.', 'Spielbare Werkstatt: drei Agenten bearbeiten die Störungen des Racks. Klicken Sie ein Gerät zum Priorisieren, einen Agenten zum Beschleunigen, eine Werkbank zum Mithelfen.', 'Officina giocabile: tre agenti gestiscono i guasti del rack. Clicca un apparato per dargli priorità, un agente per accelerarlo, un banco per dare una mano.', '可玩的工作间：三名代理处理机柜故障。点设备可提优先级，点代理可加速，点工作台可帮忙。', 'ورشة قابلة للعب: ثلاثة عملاء يعالجون أعطال الخزانة. انقر جهازاً لترفع أولويته، أو عاملاً لتسريعه، أو طاولة للمساعدة.', '操作できる作業場：三体のエージェントがラックの障害を処理します。機器をクリックで優先、エージェントで加速、作業台で手伝い。'],
'Une baie informatique en volume. Chaque tiroir est un équipement documenté : son adresse, sa place au centimètre, ses garanties, ce qui dépend de lui.': ['A wall of supervised racks: each LED is a tracked device, and an alert is pinned to the rack and the exact unit.', 'Eine Wand überwachter Racks: jede LED ist ein überwachtes Gerät, und ein Alarm ist auf Rack und genaue Höheneinheit festgelegt.', 'Un muro di rack supervisionati: ogni LED è un apparato monitorato, e un allarme è localizzato al rack e all\'unità esatta.', '一整墙受监机柜：每个指示灯代表一台受监设备，告警定位到机柜与精确 U 位。', 'حائط من الخزائن المراقَبة: كل مؤشر جهاز مُتابع، والتنبيه محدَّد بالخزانة والوحدة بالضبط.', '監視下のラックの壁：各ランプが監視対象の機器で、アラートはラックと正確な U 位置まで特定されます。'],
'Leonhard en action : à gauche tout ce qui émet des alertes, au centre le filtre qui les trie, à droite les trois priorités et le suivi de l\'intervention.': ['Leonhard at work: on the left everything that raises alerts, in the middle the filter that sorts them, on the right the three priorities and the job tracking.', 'Leonhard im Einsatz: links alles, was Alarme meldet, in der Mitte der Filter, der sie sortiert, rechts die drei Prioritäten und die Auftragsverfolgung.', 'Leonhard in azione: a sinistra tutto ciò che genera allarmi, al centro il filtro che li smista, a destra le tre priorità e il tracciamento.', 'Leonhard 运行中：左侧是所有发出告警的来源，中间是分流过滤器，右侧是三个优先级与工单跟踪。', 'ليونهارد في العمل: على اليسار كل ما يُصدر تنبيهات، في الوسط المرشّح الذي يفرزها، على اليمين الأولويات الثلاث وتتبّع التدخل.', '稼働中の Leonhard：左が発報するすべて、中央が選別するフィルター、右が三つの優先度と作業追跡です。'],
'Le rôle : je traduis un besoin exprimé en langage courant vers une solution technique, et l\'inverse.': ['The role: I translate a need expressed in plain language into a technical solution, and the other way round.', 'Die Rolle: Ich übersetze einen in Alltagssprache formulierten Bedarf in eine technische Lösung — und umgekehrt.', 'Il ruolo: traduco un bisogno espresso in linguaggio comune in una soluzione tecnica, e viceversa.', '角色：我把用平常话表达的需求翻译成技术方案，反之亦然。', 'الدور: أترجم حاجة معبّراً عنها بلغة عادية إلى حل تقني، والعكس.', '役割 — 平易な言葉の要望を技術的な解へ、その逆も。'],
'L\'outillage : ce qui se répète est écrit une fois pour toutes, et l\'IA tourne sur mes machines, pas ailleurs.': ['The tooling: whatever repeats is written once and for all, and the AI runs on my machines, not elsewhere.', 'Die Werkzeuge: was sich wiederholt, wird einmal geschrieben, und die KI läuft auf meinen Maschinen, nicht anderswo.', 'Gli strumenti: ciò che si ripete è scritto una volta per tutte, e l\'IA gira sulle mie macchine, non altrove.', '工具：重复的事写一次就好，而 AI 运行在我的机器上，不在别处。', 'الأدوات: ما يتكرر يُكتب مرة واحدة، والذكاء الاصطناعي يعمل على أجهزتي لا في مكان آخر.', '道具 — 繰り返すものは一度だけ書き、AI は他所ではなく自分の機械で動かします。'],
'Le socle : les machines, le réseau et les sauvegardes. Quand c\'est bien fait, personne n\'en parle jamais.': ['The foundation: the machines, the network and the backups. When it is done well, nobody ever mentions it.', 'Das Fundament: die Maschinen, das Netzwerk und die Backups. Wenn es gut gemacht ist, spricht niemand darüber.', 'La base: le macchine, la rete e i backup. Quando è fatta bene, nessuno ne parla mai.', '基础：机器、网络与备份。做得好时，没人会提起它。', 'الأساس: الأجهزة والشبكة والنسخ الاحتياطية. إذا أُحسن العمل، لا يتحدث عنه أحد.', '土台 — 機器、ネットワーク、バックアップ。うまくできていれば、誰も話題にしません。'],
'Un parc informatique, c\'est l\'ensemble des machines d\'une entreprise : serveurs, postes, réseau. Je m\'occupe de tout, et je fais le lien avec les personnes qui s\'en servent.': ['An IT estate is all of a company\'s machines: servers, workstations, network. Managing it means keeping it running, and knowing what is where.', 'Eine IT-Landschaft ist die Gesamtheit der Maschinen eines Unternehmens: Server, Arbeitsplätze, Netzwerk. Sie zu betreuen heißt, sie am Laufen zu halten und zu wissen, was wo steht.', 'Un parco informatico è l\'insieme delle macchine di un\'azienda: server, postazioni, rete. Gestirlo significa tenerlo in funzione e sapere cosa sta dove.', 'IT 资产是一家公司所有的机器：服务器、工位、网络。管理它意味着让它持续运转，并清楚什么在哪里。', 'المنظومة المعلوماتية هي مجموع أجهزة الشركة: خوادم وحواسيب وشبكة. إدارتها تعني إبقاءها تعمل ومعرفة موقع كل شيء.', 'IT 資産とは、企業のすべての機器 — サーバー、端末、ネットワークのことです。管理とは、動かし続け、何がどこにあるかを把握することです。'],
'Le résumé en une ligne : je m\'occupe de l\'informatique d\'une entreprise, du matériel jusqu\'aux outils qui la font tourner.': ['The one-line summary: I look after a company\'s IT, from the hardware through to the tools that keep it running.', 'Die Kurzfassung: Ich betreue die IT eines Unternehmens, von der Hardware bis zu den Werkzeugen, die den Betrieb tragen.', 'Il riassunto in una riga: mi occupo dell\'informatica di un\'azienda, dall\'hardware fino agli strumenti che la fanno girare.', '一句话总结：我负责一家公司的 IT，从硬件到让它运转的工具。', 'الملخص في سطر: أتولى معلوماتية الشركة، من العتاد إلى الأدوات التي تُشغّلها.', '一言でいえば：企業の IT を、機器から運用を支えるツールまで面倒を見ます。'],
'Un message, et il vous répond. Le contact est juste là.': ['One message and he replies. Contact is right there.', 'Eine Nachricht, und er antwortet. Der Kontakt ist gleich dort.', 'Un messaggio e risponde. Il contatto è proprio lì.', '一条消息，他就会回。联系方式就在那里。', 'رسالة واحدة وسيجيب. جهة الاتصال هناك.', 'メッセージ一通で返信します。連絡先はすぐそこです。'],
'Six jeux ici. Ou une partie avec moi : cliquez-moi.': ['Six games here. Or a round with me: click me.', 'Sechs Spiele hier. Oder eine Runde mit mir: klicken Sie.', 'Sei giochi qui. O una partita con me: cliccami.', '这里有六个游戏。或者和我玩一局：点我。', 'ست ألعاب هنا. أو جولة معي: انقرني.', 'ここに六つのゲーム。私と一局なら、クリックを。'],
'Huit ans de terrain : je peux dérouler chaque poste.': ['Eight years in the field: I can walk through each role.', 'Acht Jahre Praxis: ich kann jede Station durchgehen.', 'Otto anni sul campo: posso ripercorrere ogni ruolo.', '八年一线：每个岗位我都能展开。', 'ثماني سنوات ميدانية: أستطيع سرد كل منصب.', '現場八年 — 各職を順に説明できます。'],
'Deux cartes graphiques, des modèles chez soi : demandez les chiffres.': ['Two graphics cards, models at home: ask for the figures.', 'Zwei Grafikkarten, Modelle zu Hause: fragen Sie nach Zahlen.', 'Due schede grafiche, modelli in locale: chiedete i numeri.', '两块显卡，本地跑模型：想要数据就问。', 'بطاقتان رسوميتان ونماذج في المنزل: اطلب الأرقام.', 'グラフィックカード二枚、自宅でモデル — 数字をお尋ねください。'],
'La salle machine, les baies, la supervision : je détaille.': ['The server room, the racks, the monitoring: I\'ll detail it.', 'Der Rechenraum, die Racks, die Überwachung: ich erläutere.', 'La sala macchine, i rack, il monitoraggio: dettaglio io.', '机房、机柜、监控：我来细说。', 'قاعة الخدمات، الخزائن، المراقبة: أفصّل لك.', 'サーバールーム、ラック、監視 — 詳しく説明します。'],
'Leonhard, le tri des alertes, la fiche équipement : posez la question.': ['Leonhard, alert triage, the device record: ask away.', 'Leonhard, Alarmsortierung, das Gerätedatenblatt: fragen Sie.', 'Leonhard, lo smistamento allarmi, la scheda apparato: chiedete.', 'Leonhard、告警分流、设备档案：请提问。', 'ليونهارد، فرز التنبيهات، بطاقة الجهاز: اسأل.', 'Leonhard、アラート選別、機器カード — お尋ねください。'],
'Ces quatre besoins, je peux les détailler un par un.': ['These four needs, I can detail them one by one.', 'Diese vier Bedürfnisse kann ich einzeln erläutern.', 'Questi quattro bisogni posso dettagliarli uno a uno.', '这四项需求，我可以逐一说明。', 'هذه الحاجات الأربع أستطيع تفصيلها واحدة واحدة.', 'この四つの必要、一つずつ説明できます。'],
'Le socle, l\'outillage, le pont entre les deux : demandez le détail.': ['The foundation, the tooling, the bridge between them: ask for detail.', 'Das Fundament, die Werkzeuge, die Brücke dazwischen: fragen Sie nach.', 'La base, gli strumenti, il ponte tra i due: chiedete il dettaglio.', '基础、工具、二者之间的桥梁：想了解细节就问。', 'الأساس والأدوات والجسر بينهما: اطلب التفصيل.', '土台、道具、その架け橋 — 詳しくお尋ねください。'],
'Vous cherchez quelque chose de précis ? Demandez-moi.': ['Looking for something specific? Ask me.', 'Suchen Sie etwas Bestimmtes? Fragen Sie mich.', 'Cercate qualcosa di preciso? Chiedetemi.', '在找具体内容？问我。', 'تبحث عن شيء محدد؟ اسألني.', '特定のことをお探しですか。お尋ねください。'],
'Je connais ce portfolio par cœur. Testez-moi.': ['I know this portfolio by heart. Test me.', 'Ich kenne dieses Portfolio auswendig. Testen Sie mich.', 'Conosco questo portfolio a memoria. Mettimi alla prova.', '这份作品集我记得清楚。考考我。', 'أعرف هذا الملف عن ظهر قلب. اختبرني.', 'このポートフォリオは把握しています。試してください。'],
'Un devis, une disponibilité, un détail technique : posez la question.': ['A quote, availability, a technical detail: just ask.', 'Ein Angebot, Verfügbarkeit, ein technisches Detail: fragen Sie.', 'Un preventivo, la disponibilità, un dettaglio tecnico: chiedete.', '报价、可用性、技术细节：请提问。', 'عرض سعر، توفر، تفصيل تقني: اسأل.', '見積り、稼働可否、技術的な詳細 — お尋ねください。'],
'Une question sur les chiffres ? Je cite mes sources.': ['A question about the figures? I cite my sources.', 'Eine Frage zu den Zahlen? Ich nenne meine Quellen.', 'Una domanda sui numeri? Cito le fonti.', '关于数字有疑问？我会给出来源。', 'سؤال عن الأرقام؟ أذكر مصادري.', '数字についてのご質問？出典を示します。'],
'ADA · cliquez, je détaille': ['ADA · click, I\'ll detail it', 'ADA · klicken, ich erläutere', 'ADA · clicca, ti dettaglio', 'ADA · 点击，我详细说', 'آدا · انقر وسأفصّل', 'ADA · クリックで詳しく'],
'ADA · je vous explique': ['ADA · I\'ll explain', 'ADA · ich erkläre', 'ADA · ti spiego', 'ADA · 我来解释', 'آدا · سأشرح لك', 'ADA · 説明します'],
'ADA · VISEZ UN POINT JAUNE, JE DÉTAILLE': ['ADA · AIM AT A YELLOW DOT, I\'LL EXPLAIN', 'ADA · GELBEN PUNKT ANVISIEREN, ICH ERKLÄRE', 'ADA · PUNTA UN PUNTO GIALLO, TI SPIEGO', 'ADA · 瞄准黄点，我来解释', 'آدا · استهدف نقطة صفراء وسأشرح', 'ADA · 黄色い点を狙うと説明します'],
'Je connais tout ce qui est écrit ici par cœur — et je cite mes sources. Deux clics.': ['I know everything written here by heart — and I cite my sources. Two clicks.', 'Ich kenne alles hier Geschriebene auswendig — und nenne meine Quellen. Zwei Klicks.', 'Conosco a memoria tutto ciò che è scritto qui — e cito le fonti. Due clic.', '这里写的一切我都记得 — 而且我会给出来源。点两下。', 'أعرف كل ما هو مكتوب هنا عن ظهر قلب — وأذكر مصادري. نقرتان.', 'ここに書かれたことはすべて把握しています — 出典も示します。二度クリック。'],
'Le drone survole, moi je creuse. Ouvrez-moi quand vous voulez aller plus loin.': ['The drone skims, I dig. Open me when you want to go deeper.', 'Die Drohne überfliegt, ich grabe. Öffnen Sie mich, wenn Sie tiefer wollen.', 'Il drone sorvola, io scavo. Apritemi quando volete approfondire.', '无人机掠过表面，我深入细节。想深入时打开我。', 'الطائرة تمرّ سريعاً وأنا أتعمّق. افتحني حين تريد التفصيل.', 'ドローンは俯瞰し、私は掘り下げます。深く知りたいときに開いてください。'],
'Une question précise sur l\'infrastructure, l\'IA locale ou le parcours ? Deux clics, je vous réponds avec les chiffres.': ['A specific question on infrastructure, local AI or background? Two clicks and I answer with figures.', 'Eine konkrete Frage zu Infrastruktur, lokaler KI oder Werdegang? Zwei Klicks, ich antworte mit Zahlen.', 'Una domanda precisa su infrastruttura, IA locale o percorso? Due clic e rispondo con i numeri.', '关于基础设施、本地 AI 或经历有具体问题？点两下，我用数据回答。', 'سؤال محدد عن البنية التحتية أو الذكاء المحلي أو المسار؟ نقرتان وأجيب بالأرقام.', 'インフラ、ローカル AI、経歴について具体的な質問は？二度クリックすれば数字でお答えします。'],
'Moi je suis l\'assistant : le drone montre, je réponds. Deux clics sur moi et posez votre question.': ['I\'m the assistant: the drone points, I answer. Two clicks on me and ask away.', 'Ich bin der Assistent: die Drohne zeigt, ich antworte. Zweimal klicken und fragen.', 'Io sono l\'assistente: il drone mostra, io rispondo. Due clic su di me e chiedi.', '我是助手：无人机负责指，我负责答。点我两下就可以提问。', 'أنا المساعد: الطائرة تشير وأنا أجيب. انقرني مرتين واسأل.', '私が助手です。ドローンが示し、私が答えます。二度クリックして質問してください。'],
'Cliquez-moi une fois : je vous suis. Deux fois : on discute.': ['Click me once: I follow you. Twice: we talk.', 'Einmal klicken: ich folge. Zweimal: wir reden.', 'Cliccami una volta: ti seguo. Due volte: parliamo.', '点我一次：我跟着您。两次：我们聊聊。', 'انقرني مرة: أتبعك. مرتين: نتحدث.', '一度クリックすれば付いていきます。二度なら会話します。'],
'Visez un point jaune : je vous explique.': ['Aim at a yellow dot: I\'ll explain.', 'Zielen Sie auf einen gelben Punkt: ich erkläre.', 'Puntate un punto giallo: vi spiego.', '瞄准一个黄点，我来解释。', 'استهدف نقطة صفراء وسأشرح.', '黄色い点にカーソルを合わせてください。説明します。'],
'Une application, un site à créer ? Attrapez-moi.': ['An application, a site to build? Grab me.', 'Eine Anwendung, eine Website? Greifen Sie zu.', 'Un\'applicazione, un sito da creare? Prendimi.', '要做应用或网站？点我。', 'تطبيق أو موقع تريد إنشاءه؟ التقطني.', 'アプリやサイトを作りたい？つかんでください。'],
'Besoin d\'aide ? Une infrastructure à sécuriser ?': ['Need help? An infrastructure to secure?', 'Brauchen Sie Hilfe? Eine Infrastruktur zu sichern?', 'Serve aiuto? Un\'infrastruttura da mettere in sicurezza?', '需要帮助吗？要保障某套基础设施？', 'تحتاج مساعدة؟ بنية تحتية تحتاج تأميناً؟', 'お手伝いしましょうか。守りたいインフラはありますか？'],
'Volontiers. Morpion, coupe de cartes, ou les six mini-jeux du bas ?': ['Gladly. Noughts and crosses, high card, or the six mini-games below?', 'Gern. Tic-Tac-Toe, Kartenziehen oder die sechs Minispiele unten?', 'Volentieri. Tris, carta più alta, o i sei mini-giochi in basso?', '好啊。井字棋、抽高牌，还是下面的六个小游戏？', 'بكل سرور. لعبة الإكس والدائرة، أو سحب الأوراق، أو الألعاب الست في الأسفل؟', 'いいですよ。三目並べ、カードの引き比べ、それとも下の六つのミニゲーム？'],
'On joue ?': ['Fancy a game?', 'Spielen wir?', 'Giochiamo?', '来玩一局？', 'هل نلعب؟', '遊びますか？'],
'dites-le.': ['say so.', 'sagen Sie es.', 'dimmelo.', '请告诉我。', 'فقل ذلك.', 'おっしゃってください。'],
'si vous visiez plutôt': ['if you meant rather', 'falls Sie eher meinten', 'se intendevi piuttosto', '如果您指的是', 'إن كنت تقصد بالأحرى', 'もしお尋ねが'],
'Activez WEB et je vérifie le reste avec la source.': ['Turn on WEB and I\'ll check the rest against the source.', 'Aktivieren Sie WEB, und ich prüfe den Rest an der Quelle.', 'Attiva WEB e verifico il resto alla fonte.', '开启 WEB，其余我会核对来源。', 'شغّل WEB وسأتحقق من الباقي من المصدر.', 'WEB を有効にすれば、残りは出典で確認します。'],
'Je réponds aux questions : infrastructure, cybersécurité, applications, IA locale, Leonhard, parcours, disponibilité.': ['I answer questions on infrastructure, cybersecurity, applications, local AI, Leonhard, background and availability.', 'Ich beantworte Fragen zu Infrastruktur, Cybersicherheit, Anwendungen, lokaler KI, Leonhard, Werdegang und Verfügbarkeit.', 'Rispondo su infrastruttura, cybersicurezza, applicazioni, IA locale, Leonhard, percorso e disponibilità.', '我回答关于基础设施、网络安全、应用、本地 AI、Leonhard、经历与可用性的问题。', 'أجيب عن أسئلة البنية التحتية والأمن السيبراني والتطبيقات والذكاء المحلي وليونهارد والمسار والتوفر.', 'インフラ、セキュリティ、アプリ、ローカル AI、Leonhard、経歴、稼働可否についてお答えします。'],
'Delta T à 10,4 K : la reprise d\'air est correcte. Les deux U libres sous SW-CORE-01 laissent passer de l\'air chaud vers l\'avant — un obturateur les fermerait.': ['Delta T at 10.4 K: air return is fine. The two free U below SW-CORE-01 let hot air through to the front — a blanking panel would close them.', 'Delta T bei 10,4 K: die Luftrückführung ist in Ordnung. Die zwei freien U unter SW-CORE-01 lassen Warmluft nach vorn durch — ein Blindpanel würde sie schließen.', 'Delta T a 10,4 K: il ritorno d\'aria è corretto. I due U liberi sotto SW-CORE-01 lasciano passare aria calda verso il fronte — un pannello cieco li chiuderebbe.', '温差 10,4 K：回风正常。SW-CORE-01 下方两个空闲 U 会让热风窜到前部 — 加装盲板即可封堵。', 'فرق الحرارة 10,4 كلفن: عودة الهواء سليمة. الوحدتان الفارغتان تحت SW-CORE-01 تسمحان بمرور هواء ساخن إلى الأمام — لوح إغلاق يكفي لسدّهما.', '温度差 10,4 K：還気は良好です。SW-CORE-01 下の空き 2 U から熱気が前面へ抜けています — ブランクパネルで塞げます。'],
'Vous pouvez accéder à plusieurs mini-jeux. Trois réflexes du métier — trier ce qui compte, bloquer ce qui n\'a rien à faire là, monter une baie dans les règles. Puis un vaisseau, une traversée de salle machine, et un modèle local à élever comme un animal : il continue de vivre quand vous fermez la page.': ['Several mini-games are available. Three reflexes of the trade — sorting what matters, blocking what has no business being there, racking a cabinet properly. Then a spacecraft, a server-room crossing, and a local model to raise like a pet: it keeps living after you close the page.', 'Mehrere Minispiele stehen bereit. Drei Reflexe des Fachs — sortieren, was zählt, blocken, was nichts hier zu suchen hat, ein Rack regelkonform aufbauen. Dann ein Raumschiff, eine Durchquerung des Rechenraums und ein lokales Modell, das man wie ein Tier aufzieht: es lebt weiter, wenn Sie die Seite schließen.', 'Sono disponibili vari mini-giochi. Tre riflessi del mestiere — filtrare ciò che conta, bloccare ciò che non c\'entra, montare un rack a regola d\'arte. Poi un\'astronave, una traversata della sala macchine e un modello locale da allevare come un animale: continua a vivere quando chiudi la pagina.', '这里有多个小游戏。三项本行反射 — 筛出要紧的、拦下不该来的、按规范组装机柜。此外还有一艘飞船、一次机房穿越，以及一个像宠物一样养大的本地模型：您关掉页面后它仍继续活着。', 'تتوفر عدة ألعاب مصغّرة. ثلاث بديهيات من المهنة — فرز ما يهم، وحجب ما لا شأن له، وتركيب خزانة وفق القواعد. ثم سفينة فضاء، وعبور لقاعة الخدمات، ونموذج محلي يُربّى كحيوان: يواصل الحياة بعد أن تغلق الصفحة.', 'いくつかのミニゲームがあります。この仕事の三つの反射 — 重要なものを選別する、場違いなものを遮断する、規則どおりにラックを組む。さらに宇宙船、サーバールームの横断、そしてペットのように育てるローカルモデル：ページを閉じても生き続けます。'],
'Inspiré de Leap 71, qui conçoit des réacteurs à partir des seules lois de la physique. J\'ai fait pareil pour mon châssis, puis j\'ai corrigé : les alimentations sont passées à l\'arrière et isolées, les entrées d\'air frais sont en bas, les sorties d\'air chaud au-dessus.': ['Inspired by Leap 71, which designs engines from the laws of physics alone. I did the same for my chassis, then corrected it: the power supplies moved to the rear and were isolated, cool air enters at the bottom, hot air exits above.', 'Inspiriert von Leap 71, das Triebwerke allein aus den Gesetzen der Physik entwirft. Ich habe es für mein Chassis genauso gemacht und dann korrigiert: die Netzteile wanderten nach hinten und wurden isoliert, kühle Luft tritt unten ein, warme oben aus.', 'Ispirato a Leap 71, che progetta motori partendo dalle sole leggi della fisica. Ho fatto lo stesso per il mio telaio, poi ho corretto: gli alimentatori sono passati dietro e isolati, l\'aria fresca entra in basso, l\'aria calda esce sopra.', '受 Leap 71 启发 — 他们仅凭物理定律设计发动机。我对机箱做了同样的事，随后加以修正：电源移到后部并做隔离，冷风从下方进入，热风从上方排出。', 'مستوحى من Leap 71 التي تصمّم المحرّكات من قوانين الفيزياء وحدها. فعلت الشيء نفسه لهيكلي ثم صحّحت: انتقلت مزوّدات الطاقة إلى الخلف ومعزولة، ويدخل الهواء البارد من الأسفل ويخرج الساخن من الأعلى.', '物理法則だけからエンジンを設計する Leap 71 に着想を得ました。自分の筐体でも同じことを行い、その後修正しました。電源は背面へ移して隔離し、冷気は下から入り、熱気は上から抜けます。'],
'Un banc d\'essai pour faire tourner des modèles chez soi et répondre à une question que personne ne mesure : à partir de quel volume le local coûte moins cher que le cloud, et où passe la frontière entre les deux.': ['A test bench to run models at home and answer a question nobody measures: at what volume local costs less than cloud, and where the boundary between the two lies.', 'Ein Prüfstand, um Modelle zu Hause zu betreiben und eine Frage zu beantworten, die niemand misst: ab welchem Volumen lokal günstiger ist als Cloud und wo die Grenze verläuft.', 'Un banco di prova per far girare modelli in locale e rispondere a una domanda che nessuno misura: da quale volume il locale costa meno del cloud, e dove passa il confine.', '一套试验台，用于在本地运行模型，并回答一个无人量化的问题：从多大规模起本地比云更便宜，两者的界线在哪里。', 'مختبر لتشغيل النماذج محلياً والإجابة عن سؤال لا يقيسه أحد: من أي حجم يصبح المحلي أرخص من السحابة، وأين يمرّ الحد بينهما.', 'モデルを自宅で動かし、誰も測らない問いに答えるための試験機です。どの規模からローカルがクラウドより安くなるか、そして両者の境界はどこか。'],
'Elle a un coût, une place et des limites. Je lui donne un périmètre précis, des garde-fous, et je mesure ce qu\'elle rend.': ['It has a cost, a place and limits. I give it a precise remit, guardrails, and I measure what it returns.', 'Sie hat Kosten, einen Platz und Grenzen. Ich gebe ihr einen klaren Rahmen, Schutzgeländer, und messe, was sie leistet.', 'Ha un costo, un posto e dei limiti. Le assegno un perimetro preciso, dei garde-fou, e misuro ciò che rende.', '它有成本、有位置、有边界。我给它明确范围与护栏，并衡量它的产出。', 'لها كلفة وموضع وحدود. أمنحها نطاقاً محدداً وضوابط، وأقيس ما تعيده.', 'それには費用も置き場も限界もあります。明確な範囲と安全柵を与え、成果を測ります。'],
'Une infrastructure sert des gens : je répartis la charge entre ce qu\'automatise une machine, ce que décide un modèle, et ce qui doit rester humain.': ['Infrastructure serves people: I split the load between what a machine automates, what a model decides, and what must stay human.', 'Infrastruktur dient Menschen: Ich verteile die Last zwischen dem, was eine Maschine automatisiert, was ein Modell entscheidet und was menschlich bleiben muss.', 'Un\'infrastruttura serve delle persone: distribuisco il carico tra ciò che automatizza una macchina, ciò che decide un modello e ciò che deve restare umano.', '基础设施服务于人：我在机器自动化、模型决策与必须由人承担之间分配工作。', 'البنية التحتية تخدم الناس: أوزّع العمل بين ما تُؤتمته آلة وما يقرّره نموذج وما يجب أن يبقى بشرياً.', 'インフラは人のためにあります。機械が自動化するもの、モデルが判断するもの、人が担うべきものに負荷を配分します。'],
'Rien ne doit tenir dans la tête d\'une seule personne. Ce que je pose est documenté, versionné, et reprenable par quelqu\'un d\'autre.': ['Nothing should live in one person\'s head. What I put in place is documented, versioned, and can be taken over by someone else.', 'Nichts darf im Kopf einer einzigen Person stecken. Was ich aufsetze, ist dokumentiert, versioniert und von anderen übernehmbar.', 'Nulla deve stare nella testa di una sola persona. Ciò che realizzo è documentato, versionato e riprendibile da altri.', '任何事都不该只存在某一个人的脑子里。我搭建的一切都有文档、有版本，别人能接手。', 'لا ينبغي أن يبقى شيء في رأس شخص واحد. ما أُنشئه موثّق ومُصدَّر ويمكن لغيري متابعته.', '何ごとも一人の頭の中に留めてはいけません。私が据えるものは文書化され、版管理され、他の人が引き継げます。'],
'Je commence par dessiner ce qui existe : machines, dépendances, contrats, accès. Sans ce plan, chaque décision suivante est un pari.': ['I start by mapping what exists: machines, dependencies, contracts, access. Without that map, every decision that follows is a gamble.', 'Ich beginne damit, das Bestehende zu zeichnen: Maschinen, Abhängigkeiten, Verträge, Zugänge. Ohne diesen Plan ist jede weitere Entscheidung ein Glücksspiel.', 'Inizio disegnando ciò che esiste: macchine, dipendenze, contratti, accessi. Senza questa mappa ogni decisione successiva è una scommessa.', '我先把现状画出来：机器、依赖、合同、权限。没有这张图，之后每个决定都是赌博。', 'أبدأ برسم ما هو قائم: الأجهزة والتبعيات والعقود والصلاحيات. بدون هذه الخريطة يصبح كل قرار تالٍ مجازفة.', 'まず現状を描きます：機器、依存関係、契約、権限。この図がなければ、以降の判断はすべて賭けになります。'],
'Je ne liste pas des postes, je liste des écarts mesurés : ce qui existait avant, ce qui existe après. Poids lourds, PME, horlogerie industrielle, énergie, datacenter — et à chaque fois un système qui reste après mon départ.': ['I don\'t list job titles, I list measured gaps: what existed before, what exists after. Heavy goods vehicles, SMEs, industrial watchmaking, energy, datacentre — and each time a system that outlasts my departure.', 'Ich liste keine Stellen, ich liste gemessene Unterschiede: was vorher war, was danach ist. Nutzfahrzeuge, KMU, Uhrenindustrie, Energie, Rechenzentrum — und jedes Mal ein System, das nach meinem Weggang bleibt.', 'Non elenco incarichi, elenco scarti misurati: cosa esisteva prima, cosa esiste dopo. Veicoli industriali, PMI, orologeria industriale, energia, datacenter — e ogni volta un sistema che resta dopo la mia partenza.', '我列的不是职位，而是可量化的差距：之前有什么，之后有什么。重型卡车、中小企业、钟表工业、能源、数据中心 — 每一次都留下一个在我离开后仍运转的系统。', 'لا أسرد المناصب بل الفوارق المقيسة: ما كان قبل وما صار بعد. الشاحنات الثقيلة، الشركات الصغيرة، صناعة الساعات، الطاقة، مركز البيانات — وفي كل مرة نظام يبقى بعد رحيلي.', '私が挙げるのは役職ではなく、測られた差です。前に何があり、後に何があるか。大型車、中小企業、時計産業、エネルギー、データセンター — そのたびに、私が去った後も残る仕組みを。'],
'Je conçois des logiciels en ligne et des sites web — pour mes propres besoins comme pour ceux des autres. L\'IA m\'aide à aller plus vite, du premier écran jusqu\'à la mise en service. Plusieurs sont en cours d\'assemblage.': ['I design online software and websites — for my own needs as much as for other people\'s. AI helps me move faster, from the first screen through to going live. Several are being assembled.', 'Ich entwerfe Online-Software und Websites — für eigene Zwecke wie für andere. KI hilft mir, schneller zu sein, vom ersten Bildschirm bis zur Inbetriebnahme. Mehrere sind im Aufbau.', 'Progetto software online e siti web — per le mie esigenze come per quelle di altri. L\'IA mi aiuta ad andare più veloce, dal primo schermo alla messa in servizio. Diversi sono in assemblaggio.', '我设计在线软件与网站 — 既为自己所需，也为他人。AI 帮我更快推进，从第一个界面到上线。目前有几个正在组装中。', 'أصمّم برمجيات على الإنترنت ومواقع ويب — لاحتياجاتي ولاحتياجات الآخرين. يساعدني الذكاء الاصطناعي على التقدّم أسرع، من الشاشة الأولى حتى التشغيل. عدة مشاريع قيد التجميع.', 'オンラインのソフトウェアとウェブサイトを設計します — 自分のためにも、他の人のためにも。AI が最初の画面から本番稼働まで速度を支えます。いくつかは組立中です。'],
'Chaque intervention, chaque projet et chaque décision alimente la même mémoire : ce qui a été essayé, ce qui a échoué, et pourquoi. À force, il ne s\'agit plus d\'un historique mais d\'une IA qui me ressemble — elle connaît ma façon de diagnostiquer, mes règles, les choix que j\'ai déjà tranchés, et elle m\'assiste dans les suivants.': ['Every job, every project and every decision feeds the same memory: what was tried, what failed, and why. In time it is no longer a log but an AI that resembles me — it knows how I diagnose, my rules, the calls I have already made, and it assists me with the next ones.', 'Jeder Auftrag, jedes Projekt und jede Entscheidung speist denselben Speicher: was versucht wurde, was scheiterte und warum. Mit der Zeit ist es kein Protokoll mehr, sondern eine KI, die mir gleicht — sie kennt meine Diagnoseweise, meine Regeln, meine getroffenen Entscheidungen und hilft mir bei den nächsten.', 'Ogni intervento, ogni progetto e ogni decisione alimenta la stessa memoria: cosa è stato provato, cosa ha fallito e perché. Col tempo non è più uno storico ma un\'IA che mi somiglia — conosce il mio modo di diagnosticare, le mie regole, le scelte già fatte, e mi assiste nelle successive.', '每一次处置、每个项目、每个决定都汇入同一份记忆：尝试过什么、失败了什么、以及为什么。久而久之，它不再是日志，而是一个像我的 AI — 它了解我的诊断方式、我的规则、我已作出的取舍，并在后续中协助我。', 'كل تدخل وكل مشروع وكل قرار يغذّي الذاكرة نفسها: ما جُرّب وما فشل ولماذا. مع الوقت لم يبق سجلاً بل ذكاءً اصطناعياً يشبهني — يعرف طريقتي في التشخيص وقواعدي والخيارات التي حسمتها، ويساعدني في التالية.', 'すべての対応、すべてのプロジェクト、すべての判断が同じ記憶に積み上がります。何を試し、何が失敗し、なぜか。やがてそれは記録ではなく、私に似た AI になります — 私の診断の仕方、規則、既に下した選択を知り、次の判断を支えてくれます。'],
'Le même principe, à plus grande échelle : au lieu d\'un parc, on en pilote plusieurs — plusieurs sites, plusieurs salles machines, plusieurs datacenters, dans une seule vue. On y suit la consommation électrique, la charge réelle de chaque baie, les ressources inutilisées que l\'on peut récupérer. C\'est un DCIM complet, intégré à la chaîne, et conforme au RGPD comme à la LPD suisse.': ['The same principle, at a larger scale: instead of one estate, several are driven — several sites, several server rooms, several datacentres, in a single view. It tracks power draw, the real load of each rack, and the unused resources you can reclaim. A complete DCIM, integrated into the chain, compliant with GDPR and the Swiss FADP.', 'Dasselbe Prinzip, größer: statt eines Bestands werden mehrere gesteuert — mehrere Standorte, mehrere Rechenräume, mehrere Rechenzentren in einer Ansicht. Verfolgt werden Stromaufnahme, die reale Last jedes Racks und ungenutzte Ressourcen, die man zurückgewinnen kann. Ein vollständiges DCIM, in die Kette integriert, DSGVO- und DSG-konform.', 'Lo stesso principio su scala più ampia: invece di un parco se ne governano diversi — più siti, più sale macchine, più datacenter, in una sola vista. Si seguono il consumo elettrico, il carico reale di ogni rack e le risorse inutilizzate recuperabili. Un DCIM completo, integrato nella catena e conforme al GDPR e alla LPD svizzera.', '同一原则，更大规模：不再是一处资产，而是同时管理多处 — 多个站点、多个机房、多个数据中心，尽在一屏。可跟踪用电、每个机柜的实际负载，以及可回收的闲置资源。一套完整的 DCIM，融入整条链路，并符合 GDPR 与瑞士 LPD。', 'المبدأ نفسه على نطاق أوسع: بدل منظومة واحدة تُدار عدة منظومات — عدة مواقع وقاعات ومراكز بيانات في عرض واحد. نتابع استهلاك الطاقة والحمل الفعلي لكل خزانة والموارد غير المستخدمة القابلة للاستعادة. نظام DCIM كامل مدمج في السلسلة ومتوافق مع GDPR وقانون حماية البيانات السويسري.', '同じ原理をより大きな規模で。一つの資産ではなく複数を — 複数拠点、複数のサーバールーム、複数のデータセンターを一つのビューで統括します。消費電力、各ラックの実負荷、回収できる未使用資源を追跡します。チェーンに統合された完全な DCIM で、GDPR とスイス LPD に準拠します。'],
'glissez pour tourner · cliquez dans la vue puis molette pour zoomer · la roue seule fait défiler la page': ['drag to rotate · click inside the view then scroll to zoom · the wheel alone scrolls the page', 'ziehen zum Drehen · in die Ansicht klicken, dann scrollen zum Zoomen · das Rad allein scrollt die Seite', 'trascina per ruotare · clicca nella vista poi rotella per lo zoom · la rotella da sola scorre la pagina', '拖动可旋转 · 先在视图内点击再滚轮缩放 · 单独滚动滚轮则翻页', 'اسحب للتدوير · انقر داخل العرض ثم استخدم العجلة للتكبير · العجلة وحدها تُمرّر الصفحة', 'ドラッグで回転 · ビュー内をクリックしてからホイールで拡縮 · ホイール単独ではページが送られます'],
'flèches ou souris · espace pour tirer · récupérez les données': ['arrows or mouse · space to fire · collect the data', 'Pfeiltasten oder Maus · Leertaste zum Schießen · Daten sammeln', 'frecce o mouse · spazio per sparare · raccogli i dati', '方向键或鼠标 · 空格开火 · 收集数据', 'الأسهم أو الفأرة · مسافة للإطلاق · اجمع البيانات', '矢印かマウス · スペースで射撃 · データを回収'],
'espace, clic ou doigt pour sauter · deux fois pour un saut long': ['space, click or finger to jump · twice for a long jump', 'Leertaste, Klick oder Finger zum Springen · zweimal für einen Weitsprung', 'spazio, clic o dito per saltare · due volte per un salto lungo', '空格、点击或触摸跳跃 · 连按两次为长跳', 'مسافة أو نقرة أو إصبع للقفز · مرتين لقفزة طويلة', 'スペース・クリック・タップでジャンプ · 二回で大ジャンプ'],
'les chiffres disent combien de voisines sont compromises': ['the numbers say how many neighbours are compromised', 'die Zahlen sagen, wie viele Nachbarn kompromittiert sind', 'i numeri dicono quante vicine sono compromesse', '数字表示有多少相邻单元被攻陷', 'الأرقام تبيّن عدد الجارات المُخترقة', '数字は隣接するいくつが侵害されたかを示します'],
'souris, flèches ou doigt pour déplacer la raquette': ['mouse, arrows or finger to move the paddle', 'Maus, Pfeiltasten oder Finger zum Bewegen des Schlägers', 'mouse, frecce o dito per muovere la racchetta', '用鼠标、方向键或手指移动挡板', 'الفأرة أو الأسهم أو الإصبع لتحريك المضرب', 'マウス・矢印・指でパドルを動かす'],
'ADA · visez un point jaune, je détaille': ['ADA · aim at a yellow dot, I\'ll explain', 'ADA · auf einen gelben Punkt zielen, ich erkläre', 'ADA · mira un punto giallo, ti spiego', 'ADA · 指向黄点，我来说明', 'آدا · استهدف نقطة صفراء وسأشرح', 'ADA · 黄色い点を狙うと説明します'],
'se débloque — sur le sujet de votre choix.': ['is unlocked — on the topic of your choice.', 'wird freigeschaltet — zum Thema Ihrer Wahl.', 'si sblocca — sull\'argomento che preferisci.', '即解锁 — 主题由您选择。', 'يُفتح — في الموضوع الذي تختاره.', 'が解放されます — 主題はご自由に。'],
'Gagnez trois épreuves et une': ['Win three challenges and a', 'Gewinnen Sie drei Prüfungen und eine', 'Vinci tre prove e una', '赢下三项挑战，一次', 'اربح ثلاث تحديات و', '三つの課題に勝つと'],
'tapez help pour la liste des commandes': ['type help for the command list', 'help eingeben für die Befehlsliste', 'digita help per l\'elenco dei comandi', '输入 help 查看命令列表', 'اكتب help لقائمة الأوامر', 'help と入力するとコマンド一覧'],
'répétez l\'ordre d\'allumage des équipements': ['repeat the power-on order of the devices', 'die Einschaltreihenfolge der Geräte wiederholen', 'ripeti l\'ordine di accensione degli apparati', '重复设备的开机顺序', 'أعد ترتيب تشغيل الأجهزة', '機器の起動順を再現'],
'coupez dès que le voyant rougit': ['cut as soon as the light reddens', 'abschalten, sobald die Leuchte rot wird', 'interrompi appena la spia arrossa', '指示灯转红立即切断', 'اقطع بمجرد أن يحمرّ المؤشر', 'ランプが赤らんだら即切断'],
'coupez dès que le voyant passe au rouge': ['cut as soon as the light turns red', 'abschalten, sobald die Leuchte rot wird', 'interrompi appena la spia diventa rossa', '指示灯变红立即切断', 'اقطع بمجرد أن يصبح المؤشر أحمر', 'ランプが赤くなったら即切断'],
'retrouvez les huit paires': ['find the eight pairs', 'die acht Paare finden', 'trova le otto coppie', '找出八对', 'اعثر على الأزواج الثمانية', '八組を見つける'],
'retrouvez les paires d\'équipements': ['find the matching devices', 'die passenden Geräte finden', 'trova le coppie di apparati', '找出成对的设备', 'اعثر على أزواج الأجهزة', '対になる機器を見つける'],
'guidez la sonde, évitez les boucles': ['guide the probe, avoid the loops', 'die Sonde führen, Schleifen vermeiden', 'guida la sonda, evita i cicli', '引导探针，避开回环', 'وجّه المجسّ وتجنّب الحلقات', '探査機を導き、ループを避ける'],
'sautez les obstacles': ['jump the obstacles', 'Hindernisse überspringen', 'salta gli ostacoli', '跳过障碍', 'اقفز فوق العوائق', '障害物を飛び越える'],
'vol 3D — récupérez les données, détruisez les intrus': ['3D flight — collect the data, destroy the intruders', '3D-Flug — Daten sammeln, Eindringlinge zerstören', 'volo 3D — raccogli i dati, distruggi gli intrusi', '3D 飞行 — 收集数据，击毁入侵者', 'طيران ثلاثي الأبعاد — اجمع البيانات ودمّر المتسللين', '3D 飛行 — データを回収し、侵入者を破壊'],
'glissez chaque appareil à sa place': ['drag each device into place', 'jedes Gerät an seinen Platz ziehen', 'trascina ogni apparato al suo posto', '把每台设备拖到位', 'اسحب كل جهاز إلى مكانه', '各機器を所定の位置へドラッグ'],
'placez chaque appareil': ['place each device', 'jedes Gerät platzieren', 'posiziona ogni apparato', '放置每台设备', 'ضع كل جهاز', '各機器を配置'],
'40 secondes pour classer': ['40 seconds to sort', '40 Sekunden zum Sortieren', '40 secondi per classificare', '40 秒完成分类', '40 ثانية للتصنيف', '40 秒で分類'],
'Triage des alertes': ['Alert triage', 'Meldungssichtung', 'Triage degli avvisi', '告警分流', 'فرز التنبيهات', 'アラートの選別'],
'C\'est ce banc qui alimente Leonhard et la mémoire : rien ne part au cloud sans être passé par là': ['This bench feeds Leonhard and the memory: nothing goes to the cloud without passing through it', 'Dieser Prüfstand versorgt Leonhard und den Speicher: nichts geht in die Cloud, ohne hier durchzugehen', 'È questo banco che alimenta Leonhard e la memoria: nulla parte verso il cloud senza passarci', '正是这套试验台为 Leonhard 与记忆供能：任何数据上云前必先经过它', 'هذا المختبر يغذّي ليونهارد والذاكرة: لا شيء يذهب إلى السحابة دون أن يعبره', 'この試験機が Leonhard と記憶を支えます。ここを通らずにクラウドへ出るものはありません'],
'RAG local avec LightRAG et serveurs MCP en stdio et HTTP, sans exposer le réseau': ['Local RAG with LightRAG and MCP servers over stdio and HTTP, without exposing the network', 'Lokales RAG mit LightRAG und MCP-Servern über stdio und HTTP, ohne das Netz freizulegen', 'RAG locale con LightRAG e server MCP su stdio e HTTP, senza esporre la rete', '本地 RAG，配合 LightRAG 与 stdio、HTTP 上的 MCP 服务，不暴露网络', 'RAG محلي مع LightRAG وخوادم MCP عبر stdio و HTTP، دون تعريض الشبكة', 'LightRAG によるローカル RAG と stdio・HTTP の MCP サーバー、ネットワークを露出せずに'],
'Elle propose la décision suivante au lieu d\'attendre l\'instruction, et reprend où on s\'est arrêté': ['It suggests the next decision instead of waiting for instructions, and picks up where we left off', 'Sie schlägt die nächste Entscheidung vor, statt auf Anweisungen zu warten, und setzt dort an, wo wir aufgehört haben', 'Propone la decisione successiva invece di attendere istruzioni, e riprende da dove ci si è fermati', '它主动提出下一步决定，而不是等待指令，并从上次中断处继续', 'تقترح القرار التالي بدل انتظار التوجيه، وتتابع من حيث توقّفنا', '指示を待たずに次の判断を提案し、中断したところから再開します'],
'Elle voit tous mes projets d\'un coup : une réponse trouvée sur l\'un ressort sur l\'autre': ['It sees all my projects at once: an answer found on one resurfaces on another', 'Sie sieht alle meine Projekte zugleich: eine Antwort aus einem taucht im anderen wieder auf', 'Vede tutti i miei progetti insieme: una risposta trovata su uno riemerge sull\'altro', '它同时看到我所有项目：在一个上找到的答案会在另一个上复用', 'ترى كل مشاريعي معاً: جواب وُجد في أحدها يظهر في غيره', '私の全プロジェクトを一望します：一方で見つけた答えが他方でも生きます'],
'Elle a appris ma méthode : cause confirmée, correctif appliqué, effet mesuré — jamais une intuition seule': ['It has learned my method: cause confirmed, fix applied, effect measured — never a hunch alone', 'Sie hat meine Methode gelernt: Ursache bestätigt, Korrektur angewandt, Wirkung gemessen — nie nur ein Gefühl', 'Ha imparato il mio metodo: causa confermata, correzione applicata, effetto misurato — mai una sola intuizione', '它学会了我的方法：确认原因、实施修复、衡量效果 — 从不只凭直觉', 'تعلّمت منهجي: سبب مؤكَّد، إصلاح مُطبَّق، أثر مقيس — لا حدس وحده', '私の手法を学びました：原因の確認、修正の適用、効果の計測 — 直感だけには頼りません'],
'— chaque salle, chaque baie, chaque U, dans un même inventaire': ['— every room, every rack, every U, in one inventory', '— jeder Raum, jedes Rack, jede U in einem Inventar', '— ogni sala, ogni rack, ogni U, in un solo inventario', '— 每个机房、每个机柜、每个 U，同一份清单', '— كل قاعة وكل خزانة وكل وحدة في جرد واحد', '— すべての部屋・ラック・U を一つの棚卸しに'],
'être l\'interface entre les deux': ['being the interface between the two', 'die Schnittstelle zwischen beiden zu sein', 'essere l\'interfaccia tra i due', '成为两者之间的接口', 'أن أكون الواجهة بين الاثنين', '両者のあいだのインターフェースになること'],
': je traduis un besoin dit en mots simples en quelque chose qui tourne, et l\'inverse.': [': I turn a need stated in plain words into something that runs, and the other way round.', ': Ich übersetze ein einfach formuliertes Bedürfnis in etwas, das läuft — und umgekehrt.', ': traduco un bisogno detto in parole semplici in qualcosa che funziona, e viceversa.', '：把用平常话说出的需求变成能运行的东西，反之亦然。', '：أحوّل حاجة معبَّراً عنها بكلمات بسيطة إلى شيء يعمل، والعكس.', '：平易な言葉で語られた要望を動くものに変え、その逆も行います。'],
'Les machines ne comprennent pas ce qu\'on attend d\'elles, et les gens n\'ont pas à parler leur langue. Mon métier, c\'est': ['Machines do not understand what is expected of them, and people should not have to speak their language. My job is', 'Maschinen verstehen nicht, was von ihnen erwartet wird, und Menschen müssen ihre Sprache nicht sprechen. Meine Aufgabe ist es,', 'Le macchine non capiscono cosa si aspetta da loro, e le persone non devono parlarne la lingua. Il mio lavoro è', '机器不理解人们对它的期待，而人们也不必说机器的语言。我的工作，就是', 'الآلات لا تفهم ما هو مطلوب منها، والناس ليسوا مضطرين للتحدث بلغتها. مهمتي هي', '機械は求められていることを理解せず、人がその言葉を話す必要もありません。私の仕事は'],
'Les mini-jeux': ['The mini-games', 'Die Minispiele', 'I mini-giochi', '小游戏', 'الألعاب المصغّرة', 'ミニゲーム'],
'La méthode': ['The method', 'Die Methode', 'Il metodo', '方法', 'المنهج', '手法'],
'Salle machine & DCIM': ['Server room & DCIM', 'Rechenraum & DCIM', 'Sala macchine e DCIM', '机房与 DCIM', 'قاعة الخدمات و DCIM', 'サーバールームと DCIM'],
'Réseau & câblage': ['Network & cabling', 'Netzwerk & Verkabelung', 'Rete e cablaggio', '网络与布线', 'الشبكات والكابلات', 'ネットワークと配線'],
'Disponibilité': ['Availability', 'Verfügbarkeit', 'Disponibilità', '可用性', 'التوفر', '稼働状況'],
'Le diplôme': ['Qualification', 'Abschluss', 'Titolo', '学历', 'الشهادة', '資格'],
'Le parcours': ['Background', 'Werdegang', 'Percorso', '经历', 'المسار', '経歴'],
'Leonhard, c\'est quoi ?': ['What is Leonhard?', 'Was ist Leonhard?', 'Cos\'è Leonhard?', 'Leonhard 是什么？', 'ما هو ليونهارد؟', 'Leonhard とは？'],
'Cybersécurité': ['Cybersecurity', 'Cybersicherheit', 'Cybersicurezza', '网络安全', 'الأمن السيبراني', 'サイバーセキュリティ'],
'Sécuriser mon infrastructure': ['Securing my infrastructure', 'Meine Infrastruktur absichern', 'Mettere in sicurezza la mia infrastruttura', '保障我的基础设施', 'تأمين بنيتي التحتية', 'インフラを守る'],
'Je ne trouve pas cela dans ce qui est documenté ici. Je réponds sur l\'infrastructure, la cybersécurité, la création d\'application, l\'IA locale, Leonhard, le parcours, le diplôme et la disponibilité.': ['I can\'t find that in what is documented here. I can answer on infrastructure, cybersecurity, application development, local AI, Leonhard, background, qualifications and availability.', 'Das finde ich hier nicht dokumentiert. Ich antworte zu Infrastruktur, Cybersicherheit, Anwendungsentwicklung, lokaler KI, Leonhard, Werdegang, Abschluss und Verfügbarkeit.', 'Non lo trovo tra ciò che è documentato qui. Posso rispondere su infrastruttura, cybersicurezza, sviluppo di applicazioni, IA locale, Leonhard, percorso, titolo e disponibilità.', '这在此处的记录中找不到。我可以回答基础设施、网络安全、应用开发、本地 AI、Leonhard、经历、学历与可用性方面的问题。', 'لا أجد ذلك ضمن ما هو موثّق هنا. أستطيع الإجابة عن البنية التحتية والأمن السيبراني وتطوير التطبيقات والذكاء المحلي وليونهارد والمسار والشهادة والتوفر.', 'それはここに記載がありません。インフラ、セキュリティ、アプリ開発、ローカル AI、Leonhard、経歴、資格、稼働状況についてお答えできます。'],
'Posez votre question…': ['Ask your question…', 'Stellen Sie Ihre Frage…', 'Fai la tua domanda…', '请输入您的问题…', 'اطرح سؤالك…', '質問を入力してください…'],
'ADA cherche…': ['ADA is searching…', 'ADA sucht…', 'ADA sta cercando…', 'ADA 正在查找…', 'آدا تبحث…', 'ADA が検索中…'],
'source': ['source', 'Quelle', 'fonte', '来源', 'المصدر', '出典'],
'vous': ['you', 'Sie', 'tu', '您', 'أنت', 'あなた'],
'Créer une application': ['Building an application', 'Eine Anwendung bauen', 'Creare un\'applicazione', '开发一个应用', 'إنشاء تطبيق', 'アプリを作る'],
'Anas Dine, qui est-ce ?': ['Who is Anas Dine?', 'Wer ist Anas Dine?', 'Chi è Anas Dine?', 'Anas Dine 是谁？', 'من هو أنس دين؟', 'アナス・ディーヌとは？'],
'ADA · je suis là pour vous guider': ['ADA · I\'m here to guide you', 'ADA · Ich führe Sie', 'ADA · sono qui per guidarti', 'ADA · 我来为您导览', 'آدا · أنا هنا لإرشادك', 'ADA · ご案内します'],
'Une alerte arrive. À vous de dire ce qu\'elle vaut.': ['An alert comes in. You decide what it is worth.', 'Eine Meldung kommt. Sie entscheiden, was sie wert ist.', 'Arriva un avviso. Sta a te dire quanto vale.', '一条告警到来。由你判断它的分量。', 'يصل تنبيه. عليك أن تحدّد قيمته.', 'アラートが届きます。その重みを判断してください。'],
'Des modèles jusqu\'à 70 milliards de paramètres tenus en local, quantifiés sous Ollama': ['Models up to 70 billion parameters run locally, quantised under Ollama', 'Modelle mit bis zu 70 Milliarden Parametern lokal betrieben, quantisiert unter Ollama', 'Modelli fino a 70 miliardi di parametri in locale, quantizzati con Ollama', '最高 700 亿参数的模型在本地运行，通过 Ollama 量化', 'نماذج تصل إلى 70 مليار وسيط تعمل محلياً ومكمّمة عبر Ollama', '最大 700 億パラメータのモデルをローカルで、Ollama で量子化して稼働'],
'Deux RTX 4090 sur riser PCIe — 48 Go de VRAM, 128 Go de RAM, 2 To de SSD': ['Two RTX 4090 on PCIe risers — 48 GB VRAM, 128 GB RAM, 2 TB SSD', 'Zwei RTX 4090 auf PCIe-Risern — 48 GB VRAM, 128 GB RAM, 2 TB SSD', 'Due RTX 4090 su riser PCIe — 48 GB di VRAM, 128 GB di RAM, 2 TB SSD', '两张 RTX 4090 通过 PCIe 转接 — 48 GB 显存、128 GB 内存、2 TB 固态', 'بطاقتا RTX 4090 على موصلات PCIe — 48 غيغابايت VRAM و128 غيغابايت RAM و2 تيرابايت SSD', 'PCIe ライザー上の RTX 4090 二枚 — VRAM 48 GB、RAM 128 GB、SSD 2 TB'],
'Un socle commun réutilisable : ce qui sert à l\'un sert aux suivants': ['A reusable common base: what serves one serves the next', 'Eine wiederverwendbare Basis: was einem dient, dient den Nächsten', 'Una base comune riutilizzabile: ciò che serve a uno serve ai successivi', '可复用的共同底座：服务于一个的，也服务于后续', 'أساس مشترك قابل لإعادة الاستخدام: ما يخدم واحداً يخدم من يليه', '再利用できる共通基盤：一つに役立つものは次にも役立ちます'],
'J\'écoute le terrain, j\'apprends le vocabulaire, je respecte les règles du secteur': ['I listen to the field, learn the vocabulary, respect the sector\'s rules', 'Ich höre auf die Praxis, lerne die Fachsprache, achte die Branchenregeln', 'Ascolto il campo, imparo il lessico, rispetto le regole del settore', '我倾听一线、学习行业术语、遵守行业规则', 'أستمع للميدان، وأتعلّم المصطلحات، وألتزم بقواعد القطاع', '現場を聞き、業界用語を学び、その分野の規則に従います'],
'Un métier, un outil : je pars du problème, pas de la technologie': ['One trade, one tool: I start from the problem, not the technology', 'Ein Beruf, ein Werkzeug: Ich beginne beim Problem, nicht bei der Technik', 'Un mestiere, uno strumento: parto dal problema, non dalla tecnologia', '一个行业，一个工具：我从问题出发，而非技术', 'مهنة واحدة، أداة واحدة: أبدأ من المشكلة لا من التقنية', '一業種、一ツール：技術ではなく課題から始めます'],
'Cette fiche dit qui est coupé, sur quelle alimentation, sous quelle garantie, et ce qui a déjà été tenté.': ['This record says what is down, on which power feed, under what warranty, and what has already been tried.', 'Dieses Datenblatt sagt, was ausgefallen ist, an welcher Einspeisung, unter welcher Garantie und was bereits versucht wurde.', 'Questa scheda dice cosa è fuori servizio, su quale alimentazione, con quale garanzia e cosa è già stato tentato.', '这张档案说明什么中断了、走哪路供电、在何种保修下，以及已经尝试过什么。', 'تقول هذه البطاقة ما توقّف، وعلى أي تغذية، وتحت أي ضمان، وما جُرّب بالفعل.', 'このカードは、何が停止し、どの給電系で、どの保証下にあり、何を既に試したかを示します。'],
'Tout un parc tient dans un seul écran : l\'équipement, la personne qui l\'utilise, le suivi de l\'intervention et le rapport parlent la même langue. L\'IA fait la jonction — et le parc redevient sain, équipement par équipement.': ['A whole estate fits on one screen: the device, the person using it, the job tracking and the report all speak the same language. The AI joins them up — and the estate becomes healthy again, device by device.', 'Ein ganzer Bestand passt auf einen Bildschirm: Gerät, Nutzer, Auftragsverfolgung und Bericht sprechen dieselbe Sprache. Die KI verbindet alles — und der Bestand wird wieder gesund, Gerät für Gerät.', 'Un intero parco sta in un solo schermo: l\'apparato, la persona che lo usa, il tracciamento e il report parlano la stessa lingua. L\'IA fa il collegamento — e il parco torna sano, apparato per apparato.', '整个资产尽收一屏：设备、使用者、工单跟踪与报告说的是同一种语言。AI 把它们连起来 — 资产逐台恢复健康。', 'منظومة كاملة في شاشة واحدة: الجهاز ومن يستخدمه وتتبّع التدخل والتقرير — كلها بلغة واحدة. الذكاء الاصطناعي يصل بينها، فتعود المنظومة سليمة جهازاً بعد جهاز.', '資産全体が一画面に収まります。機器、使う人、作業の追跡、報告書が同じ言葉で話します。AI がそれをつなぎ、資産は一台ずつ健全に戻ります。'],
'L\'informatique produit trop de signaux : chaque serveur, chaque poste, chaque sauvegarde émet ses alertes en continu. Sans tri, il faut une équipe entière pour les lire — et l\'essentiel passe quand même à côté. Leonhard fait ce tri sur des données réelles, relie chaque alerte à son matériel et à la personne concernée, et remonte une liste courte : ce qui doit être réparé aujourd\'hui, et ce qui va bien.': ['IT produces too many signals: every server, every workstation, every backup raises alerts continuously. Without triage it takes a whole team to read them — and the essentials still slip through. Leonhard triages on real data, links each alert to its hardware and to the person affected, and returns a short list: what must be fixed today, and what is fine.', 'Die IT erzeugt zu viele Signale: jeder Server, jeder Arbeitsplatz, jedes Backup meldet laufend. Ohne Sichtung braucht es ein ganzes Team — und das Wesentliche geht dennoch unter. Leonhard sichtet echte Daten, verknüpft jede Meldung mit Gerät und betroffener Person und liefert eine kurze Liste: was heute zu reparieren ist und was in Ordnung ist.', 'L\'informatica produce troppi segnali: ogni server, ogni postazione, ogni backup emette avvisi in continuo. Senza filtro serve un team intero per leggerli — e l\'essenziale sfugge comunque. Leonhard filtra su dati reali, collega ogni avviso al suo hardware e alla persona interessata, e restituisce una lista breve: cosa riparare oggi e cosa va bene.', 'IT 产生的信号太多：每台服务器、每个工位、每次备份都在持续报警。若不分流，需要一整个团队来阅读 — 而要紧的事仍会被漏掉。Leonhard 基于真实数据分流，把每条告警关联到具体硬件和相关人员，并给出一份简短清单：今天必须修的，以及一切正常的。', 'تنتج تقنية المعلومات إشارات أكثر من اللازم: كل خادم وكل حاسوب وكل نسخة احتياطية تُصدر تنبيهات باستمرار. بدون فرز يلزم فريق كامل لقراءتها — ويفوت الجوهري رغم ذلك. يقوم ليونهارد بالفرز على بيانات حقيقية، ويربط كل تنبيه بعتاده وبالشخص المعني، ويعيد قائمة قصيرة: ما يجب إصلاحه اليوم وما هو سليم.', 'IT は信号を出しすぎます。サーバー、端末、バックアップが絶え間なく警告を上げます。選別しなければ読むだけでチーム一つを要し、それでも肝心なことは見落とされます。Leonhard は実データで選別し、各警告を機器と関係者に紐づけ、短い一覧を返します。今日直すべきものと、問題ないもの。'],
'À gauche : les 41 messages d\'erreur qu\'une entreprise reçoit en une matinée, illisibles. À droite : les 3 vraies pannes, avec leur cause et l\'action à mener.': ['Left: the 41 error messages a company gets in one morning, unreadable. Right: the 3 real faults, with their cause and the action to take.', 'Links: die 41 Fehlermeldungen, die ein Unternehmen an einem Morgen erhält, unlesbar. Rechts: die 3 echten Störungen mit Ursache und Maßnahme.', 'A sinistra: i 41 messaggi d\'errore che un\'azienda riceve in una mattinata, illeggibili. A destra: i 3 guasti reali, con causa e azione.', '左侧：一家企业一个上午收到的 41 条错误信息，无法阅读。右侧：3 个真实故障，附原因与应采取的措施。', 'إلى اليسار: 41 رسالة خطأ تتلقاها شركة في صبيحة واحدة، غير قابلة للقراءة. إلى اليمين: 3 أعطال حقيقية بأسبابها والإجراء المطلوب.', '左：企業が一朝に受け取る 41 件のエラー、判読不能。右：実際の障害 3 件、原因と取るべき対応つき。'],
'Hachage déterministe : la mémoire apprend sans savoir de qui': ['Deterministic hashing: the memory learns without knowing whose data it is', 'Deterministisches Hashing: der Speicher lernt, ohne zu wissen von wem', 'Hashing deterministico: la memoria impara senza sapere di chi', '确定性哈希：记忆在学习，却不知属于谁', 'تجزئة حتمية: الذاكرة تتعلّم دون أن تعرف صاحب البيانات', '決定的ハッシュ：記憶は誰のものか知らずに学習します'],
'Tout un parc tient dans un seul écran : l\'équipement, la personne qui l\'utilise, le suivi de l\'intervention et le rapport parlent la même langue.': ['A whole estate fits on one screen: the device, the person using it, the job tracking and the report all speak the same language.', 'Ein ganzer Bestand passt auf einen Bildschirm: das Gerät, die Person, die es nutzt, die Auftragsverfolgung und der Bericht sprechen dieselbe Sprache.', 'Un intero parco sta in un solo schermo: l\'apparato, la persona che lo usa, il tracciamento dell\'intervento e il report parlano la stessa lingua.', '整个资产尽收一屏：设备、使用者、工单跟踪与报告说的是同一种语言。', 'منظومة كاملة في شاشة واحدة: الجهاز، ومن يستخدمه، وتتبّع التدخل، والتقرير — كلها تتحدث اللغة نفسها.', '資産全体が一画面に収まります。機器、使う人、作業の追跡、報告書が同じ言葉で話します。'],
'Un poste discret collecte, corrèle et anonymise. Une machine à la maison analyse — sans jamais voir un seul nom réel. Ne restent à l\'écran que les incidents qui comptent vraiment aujourd\'hui. Le reste attend son tour.': ['A discreet node collects, correlates and anonymises. A machine at home analyses — without ever seeing a single real name. Only the incidents that truly matter today stay on screen. The rest waits its turn.', 'Ein unauffälliger Rechner sammelt, korreliert und anonymisiert. Eine Maschine zu Hause analysiert — ohne je einen echten Namen zu sehen. Auf dem Bildschirm bleiben nur die Störungen, die heute wirklich zählen. Der Rest wartet.', 'Una postazione discreta raccoglie, correla e anonimizza. Una macchina a casa analizza — senza mai vedere un nome reale. Sullo schermo restano solo gli incidenti che contano davvero oggi. Il resto attende il suo turno.', '一台不起眼的机器负责采集、关联与匿名化。家中的机器进行分析 — 从不接触任何真实姓名。屏幕上只留下今天真正要紧的事件，其余等候处理。', 'حاسوب غير ملحوظ يجمع ويربط ويُخفي الهوية. وجهاز في المنزل يحلّل — دون أن يرى أي اسم حقيقي. لا يبقى على الشاشة إلا الحوادث المهمة فعلاً اليوم، والبقية تنتظر دورها.', '目立たない一台が収集・相関・匿名化を行い、自宅の機械が解析します — 実名を一度も見ることなく。画面に残るのは、今日ほんとうに重要な障害だけ。あとは順番待ちです。'],
'L\'informatique produit trop de signaux : chaque serveur, chaque poste, chaque application parle en même temps.': ['IT produces too many signals: every server, every workstation, every application talks at once.', 'Die IT erzeugt zu viele Signale: jeder Server, jeder Arbeitsplatz, jede Anwendung spricht gleichzeitig.', 'L\'informatica produce troppi segnali: ogni server, ogni postazione, ogni applicazione parla allo stesso tempo.', 'IT 产生的信号太多：每台服务器、每个工位、每个应用都在同时说话。', 'تنتج تقنية المعلومات إشارات أكثر من اللازم: كل خادم وكل حاسوب وكل تطبيق يتحدث في الوقت نفسه.', 'IT は信号を出しすぎます。サーバー、端末、アプリが一斉に話しかけてきます。'],
'Voix activée. Clic droit sur moi pour la couper.': ['Voice on. Right-click me to mute.', 'Stimme ein. Rechtsklick auf mich zum Stummschalten.', 'Voce attivata. Clic destro su di me per zittirmi.', '语音已开启。右键点击我可关闭。', 'تم تشغيل الصوت. انقر بالزر الأيمن لإسكاتي.', '音声を有効にしました。右クリックで止められます。'],
'Voix coupée. Clic droit sur moi pour me réentendre.': ['Voice off. Right-click me to hear me again.', 'Stimme aus. Rechtsklick auf mich, um mich wieder zu hören.', 'Voce disattivata. Clic destro su di me per riascoltarmi.', '语音已关闭。右键点击我可重新开启。', 'تم إيقاف الصوت. انقر بالزر الأيمن لسماعي مجدداً.', '音声を止めました。右クリックでまた話します。'],
'Même règle que Leonhard : local d\'abord, anonymisation avant tout appel': ['Same rule as Leonhard: local first, anonymisation before any call', 'Gleiche Regel wie bei Leonhard: erst lokal, Anonymisierung vor jedem Aufruf', 'Stessa regola di Leonhard: prima in locale, anonimizzazione prima di ogni chiamata', '与 Leonhard 同一规则：本地优先，任何调用前先匿名化', 'القاعدة نفسها كما في ليونهارد: محلياً أولاً، وإخفاء الهوية قبل أي نداء', 'Leonhard と同じ規則：まずローカル、呼び出し前に匿名化'],
'Elle a appris ma méthode : cause confirmée, correctif appliqué, effet mesuré.': ['It has learned my method: cause confirmed, fix applied, effect measured.', 'Sie hat meine Methode gelernt: Ursache bestätigt, Korrektur angewandt, Wirkung gemessen.', 'Ha imparato il mio metodo: causa confermata, correzione applicata, effetto misurato.', '它已学会我的方法：确认原因、实施修复、衡量效果。', 'تعلّمت منهجي: سبب مؤكَّد، إصلاح مُطبَّق، أثر مقيس.', '私の手法を学んでいます：原因の確認、修正の適用、効果の計測。'],
'DU BESOIN AU LIVRABLE — CLIQUEZ POUR CHANGER': ['FROM NEED TO DELIVERABLE — CLICK TO CHANGE', 'VOM BEDARF ZUM ERGEBNIS — KLICKEN ZUM WECHSELN', 'DAL BISOGNO AL RISULTATO — CLICCA PER CAMBIARE', '从需求到交付 — 点击切换', 'من الحاجة إلى المنتج — انقر للتغيير', '要望から成果物まで — クリックで切り替え'],
'TROIS AGENTS AU TRAVAIL — CLIQUEZ POUR PRIORISER': ['THREE AGENTS AT WORK — CLICK TO PRIORITISE', 'DREI AGENTEN AM WERK — KLICKEN ZUM PRIORISIEREN', 'TRE AGENTI AL LAVORO — CLICCA PER DARE PRIORITÀ', '三个代理在工作 — 点击可设优先级', 'ثلاثة عملاء يعملون — انقر لتحديد الأولوية', '三体のエージェントが稼働中 — クリックで優先度を設定'],
'fiche d\'un équipement, telle que Leonhard la tient': ['a device record, as Leonhard keeps it', 'ein Gerätedatenblatt, wie Leonhard es führt', 'scheda di un apparato, come la tiene Leonhard', '设备档案，由 Leonhard 维护', 'بطاقة جهاز كما يحفظها ليونهارد', 'Leonhard が保持する機器カード'],
'Deux modèles qui se relisent : analyste + critique': ['Two models reviewing each other: analyst + critic', 'Zwei Modelle, die sich gegenlesen: Analyst + Kritiker', 'Due modelli che si rileggono: analista + critico', '两个模型互相校验：分析者 + 评审者', 'نموذجان يراجعان بعضهما: محلّل وناقد', '相互に検証する二つのモデル：分析役と批評役'],
'Cliquez dans la simulation pour injecter un incident, ou visez un équipement du rack.': ['Click inside the simulation to inject an incident, or aim at a device in the rack.', 'Klicken Sie in die Simulation, um eine Störung einzuspeisen, oder zielen Sie auf ein Gerät im Rack.', 'Clicca nella simulazione per inserire un incidente, o mira a un apparato nel rack.', '在模拟中点击可注入一个事件，或对准机柜中的某台设备。', 'انقر داخل المحاكاة لإدخال حادث، أو استهدف جهازاً في الخزانة.', 'シミュレーション内をクリックすると障害を投入できます。ラック内の機器を狙うこともできます。'],
'Ce qui existe vraiment, ce qui tourne en production, et ce que j\'assemble': ['What actually exists, what runs in production, and what I\'m assembling', 'Was wirklich existiert, was im Betrieb läuft und was ich gerade baue', 'Ciò che esiste davvero, ciò che gira in produzione e ciò che sto assemblando', '真正存在的、正在生产运行的，以及我正在组装的', 'ما هو قائم فعلاً، وما يعمل في الإنتاج، وما أبنيه الآن', '実際にあるもの、稼働中のもの、そして組立中のもの'],
'Activer la voix': ['Enable voice', 'Stimme ein', 'Attiva voce', '开启语音', 'تشغيل الصوت', '音声を有効化'],
'Couper la voix': ['Mute voice', 'Stimme aus', 'Disattiva voce', '关闭语音', 'إسكات الصوت', '音声を止める'],
'Voix coupée.': ['Voice off.', 'Stimme aus.', 'Voce disattivata.', '语音已关闭。', 'تم إيقاف الصوت.', '音声オフ。'],
'Voix activée.': ['Voice on.', 'Stimme ein.', 'Voce attivata.', '语音已开启。', 'تم تشغيل الصوت.', '音声オン。'],
'ADA · SURLIGNEZ UN TEXTE, JE VOUS EXPLIQUE': ['ADA · SELECT SOME TEXT, I\'LL EXPLAIN', 'ADA · TEXT MARKIEREN, ICH ERKLÄRE', 'ADA · SELEZIONA UN TESTO, TI SPIEGO', 'ADA · 选中文字，我来解释', 'آدا · حدّد نصاً وسأشرحه', 'ADA · テキストを選択すると説明します'],
'InfoEco — Grand Est & Suisse romande': ['InfoEco — Grand Est & French-speaking Switzerland', 'InfoEco — Grand Est & Westschweiz', 'InfoEco — Grand Est e Svizzera francese', 'InfoEco — 大东部与瑞士法语区', 'إنفو إيكو — غراند إست وسويسرا الفرنسية', 'InfoEco — グランテスト・スイス仏語圏'],
'Huit ans, des écarts mesurés': ['Eight years, measured gaps', 'Acht Jahre, gemessene Unterschiede', 'Otto anni, scarti misurati', '八年，可量化的差距', 'ثماني سنوات، فوارق مقيسة', '八年、測られた差'],
'Je crée des outils et des sites, avec l\'IA': ['I build tools and websites, with AI', 'Ich baue Werkzeuge und Websites, mit KI', 'Creo strumenti e siti, con l\'IA', '我用 AI 打造工具与网站', 'أصنع أدوات ومواقع بالذكاء الاصطناعي', 'AI とともにツールとサイトを作ります'],
'Une IA qui travaille comme moi': ['An AI that works the way I do', 'Eine KI, die arbeitet wie ich', 'Un\'IA che lavora come me', '一个像我一样工作的 AI', 'ذكاء اصطناعي يعمل مثلي', '私と同じように働く AI'],
'16 baies · une alerte localisée à la baie et au U': ['16 racks · an alert pinned to the rack and the U', '16 Racks · Meldung auf Rack und U genau', '16 rack · un avviso localizzato al rack e all\'U', '16 个机柜 · 告警精确到机柜与 U 位', '16 خزانة · تنبيه محدَّد بالخزانة والوحدة', '16 ラック · アラートはラックと U まで特定'],
'Batteries UPS-A à 3 ans — remplacement à prévoir': ['UPS-A batteries at 3 years — replacement due', 'Batterien UPS-A 3 Jahre alt — Austausch fällig', 'Batterie UPS-A a 3 anni — sostituzione da prevedere', 'UPS-A 电池已使用 3 年 — 需计划更换', 'بطاريات UPS-A عمرها 3 سنوات — يجب استبدالها', 'UPS-A のバッテリーは 3 年 — 交換が必要'],
'Autonomie onduleur retestée en charge réelle': ['UPS runtime retested under real load', 'USV-Laufzeit unter Realbelastung erneut geprüft', 'Autonomia UPS ritestata a carico reale', '已在真实负载下复测 UPS 续航', 'إعادة اختبار زمن المزوّد تحت حمل حقيقي', '実負荷で UPS 稼働時間を再試験'],
'Double alimentation vérifiée sur 7 équipements': ['Dual power verified on 7 devices', 'Doppelte Einspeisung auf 7 Geräten geprüft', 'Doppia alimentazione verificata su 7 apparati', '已在 7 台设备上验证双路供电', 'تم التحقق من التغذية المزدوجة على 7 أجهزة', '7 台で二重給電を確認'],
'Températures dans la plage ASHRAE A2': ['Temperatures within ASHRAE A2 range', 'Temperaturen im ASHRAE-A2-Bereich', 'Temperature nella fascia ASHRAE A2', '温度处于 ASHRAE A2 范围', 'الحرارة داخل نطاق ASHRAE A2', '温度は ASHRAE A2 の範囲内'],
'relevé continu — sondes SNMP v3': ['continuous readings — SNMP v3 probes', 'laufende Messung — SNMP-v3-Sonden', 'rilevamento continuo — sonde SNMP v3', '持续采集 — SNMP v3 探针', 'قياس مستمر — مجسّات SNMP v3', '連続計測 — SNMP v3 プローブ'],
'Lecture seule — aucune écriture chez le client': ['Read-only — nothing written on the client side', 'Nur lesend — kein Schreibzugriff beim Kunden', 'Sola lettura — nessuna scrittura dal cliente', '只读 — 不在客户侧写入', 'للقراءة فقط — لا كتابة عند العميل', '読み取り専用 — 顧客側への書き込みなし'],
'un seul outil, une seule facture, une seule interface': ['one tool, one invoice, one interface', 'ein Werkzeug, eine Rechnung, eine Oberfläche', 'un solo strumento, una fattura, un\'interfaccia', '一个工具、一张账单、一个界面', 'أداة واحدة وفاتورة واحدة وواجهة واحدة', '一つのツール、一つの請求、一つの画面'],
'parc sécurisé : chaque appareil documenté, chaque accès tracé': ['estate secured: every device documented, every access logged', 'Bestand gesichert: jedes Gerät dokumentiert, jeder Zugriff protokolliert', 'parco sicuro: ogni apparato documentato, ogni accesso tracciato', '资产可控：每台设备有档案，每次访问有记录', 'منظومة مؤمَّنة: كل جهاز موثّق وكل وصول مُسجّل', '資産を保全：全機器を記録し、全アクセスを追跡'],
'moins d\'incidents : les alertes se trient avant vous': ['fewer incidents: alerts are triaged before you see them', 'weniger Störungen: Meldungen werden vorsortiert', 'meno incidenti: gli avvisi si filtrano prima di voi', '更少事件：告警在您之前已被分流', 'حوادث أقل: التنبيهات تُفرز قبلك', '障害が減る：アラートは事前に選別される'],
'— au lieu de six abonnements qui ne se parlent pas.': ['— instead of six subscriptions that don\'t talk to each other.', '— statt sechs Abos, die nicht miteinander sprechen.', '— invece di sei abbonamenti che non si parlano.', '— 而不是六个互不相通的订阅。', '— بدلاً من ستة اشتراكات لا تتحدث بينها.', '— 互いに連携しない六つの契約の代わりに。'],
'réunit les coûts dans un seul outil': ['brings the costs into one tool', 'bündelt die Kosten in einem Werkzeug', 'riunisce i costi in un solo strumento', '把成本集中到一个工具里', 'يجمع التكاليف في أداة واحدة', 'コストを一つのツールに集約'],
'fait baisser le nombre d\'incidents': ['brings the number of incidents down', 'senkt die Zahl der Störungen', 'riduce il numero di incidenti', '降低事件数量', 'يقلّل عدد الحوادث', '障害件数を下げる'],
'd\'alertes écartées': ['of alerts filtered out', 'der Meldungen verworfen', 'di avvisi scartati', '的告警被过滤', 'من التنبيهات مُستبعدة', 'のアラートを除外'],
'3 pannes réelles à traiter': ['3 real faults to handle', '3 echte Störungen zu bearbeiten', '3 guasti reali da trattare', '3 个真实故障待处理', '3 أعطال حقيقية للمعالجة', '対応すべき実際の障害 3 件'],
'41 alertes reçues': ['41 alerts received', '41 Meldungen eingegangen', '41 avvisi ricevuti', '收到 41 条告警', 'وصل 41 تنبيهاً', '41 件のアラート受信'],
'des sauvegardes vérifiées': ['verified backups', 'geprüfte Backups', 'backup verificati', '经过验证的备份', 'نسخ احتياطية مُتحقَّق منها', '検証済みのバックアップ'],
'un suivi mené jusqu\'à la vérification': ['tracking carried through to verification', 'Verfolgung bis zur Überprüfung', 'un tracciamento fino alla verifica', '跟踪直至核实完成', 'متابعة حتى التحقق', '検証まで通す追跡'],
'un tri qui ne retient que l\'essentiel': ['a triage that keeps only what matters', 'eine Sichtung, die nur Wesentliches behält', 'un filtro che tiene solo l\'essenziale', '只留下要紧事项的分流', 'فرز يُبقي الجوهري فقط', '本質だけを残す選別'],
'un inventaire complet et à jour': ['a complete, up-to-date inventory', 'ein vollständiges, aktuelles Inventar', 'un inventario completo e aggiornato', '完整且及时更新的清单', 'جرد كامل ومحدّث', '完全で最新の棚卸し'],
'comme une équipe d\'experts à vos côtés': ['like a team of experts at your side', 'wie ein Expertenteam an Ihrer Seite', 'come un team di esperti al vostro fianco', '如同一支专家团队在您身边', 'كفريق خبراء إلى جانبكم', '専門家チームがそばにいるように'],
'Un outillage complet et précis —': ['Complete, precise tooling —', 'Vollständiges, präzises Werkzeug —', 'Strumenti completi e precisi —', '完整而精准的工具 —', 'أدوات كاملة ودقيقة —', '完全で精密な道具立て —'],
'Je monte l\'infrastructure et je la surveille en continu.': ['I build the infrastructure and monitor it continuously.', 'Ich baue die Infrastruktur und überwache sie laufend.', 'Costruisco l\'infrastruttura e la monitoro in continuo.', '我搭建基础设施并持续监控。', 'أبني البنية التحتية وأراقبها باستمرار.', 'インフラを構築し、継続的に監視します。'],
'les tâches répétitives passent en automatique, et l\'IA reste dans vos murs': ['repetitive tasks go automatic, and the AI stays inside your walls', 'Wiederkehrende Aufgaben laufen automatisch, und die KI bleibt im Haus', 'le attività ripetitive diventano automatiche e l\'IA resta in casa', '重复任务自动化，AI 留在您的场所内', 'المهام المتكررة تصبح آلية، والذكاء الاصطناعي يبقى داخل مبانيكم', '反復作業は自動化し、AI は社内に留まります'],
'serveurs, réseau, sauvegardes : plus d\'arrêt de travail imprévu': ['servers, network, backups: no more unplanned downtime', 'Server, Netzwerk, Backups: keine ungeplanten Ausfälle mehr', 'server, rete, backup: nessun fermo imprevisto', '服务器、网络、备份：不再有意外停工', 'خدمات وشبكة ونسخ احتياطي: لا توقف مفاجئ', 'サーバー・ネットワーク・バックアップ：突然の停止をなくす'],
'Les machines d\'un côté, les personnes qui s\'en servent de l\'autre :': ['Machines on one side, the people using them on the other:', 'Maschinen auf der einen Seite, die Menschen, die sie nutzen, auf der anderen:', 'Le macchine da un lato, le persone che le usano dall\'altro:', '一边是机器，另一边是使用它们的人：', 'الآلات من جهة، ومن يستخدمها من جهة أخرى:', '一方に機械、もう一方にそれを使う人：'],
'par l\'utilisateur': ['by the user', 'durch den Nutzer', 'dall\'utente', '由用户', 'من قبل المستخدم', '利用者による'],
'panne découverte': ['fault found', 'Fehler entdeckt', 'guasto scoperto', '故障被发现', 'عطل مكتشف', '障害の発見'],
'en permanence': ['continuously', 'laufend', 'in continuo', '持续', 'باستمرار', '常時'],
'appareils suivis': ['devices tracked', 'überwachte Geräte', 'apparati monitorati', '受监设备', 'أجهزة مُتابعة', '監視対象機器'],
'réparer une panne': ['fix a fault', 'einen Fehler zu beheben', 'riparare un guasto', '修复故障', 'إصلاح عطل', '障害の修復'],
'de temps pour': ['less time to', 'weniger Zeit für', 'meno tempo per', '更短时间', 'وقت أقل لـ', '時間短縮'],
'sans intervention': ['with no action needed', 'ohne Eingriff', 'senza intervento', '无需干预', 'دون تدخل', '対応不要'],
'de la machine': ['off the machine', 'von der Maschine', 'dalla macchina', '离开这台机器', 'من الجهاز', 'この機器から外へ'],
'sans dépendance': ['with no dependency', 'ohne Abhängigkeit', 'senza dipendenze', '无依赖', 'بلا تبعيات', '依存なし'],
'une responsabilité chacun': ['one responsibility each', 'je eine Aufgabe', 'una responsabilità ciascuno', '各司其职', 'مسؤولية واحدة لكل منها', '一つずつの責務'],
'en lecture seule': ['read-only', 'nur lesend', 'in sola lettura', '只读', 'للقراءة فقط', '読み取り専用'],
'gain estimé · −0,04 PUE': ['estimated gain · −0.04 PUE', 'geschätzter Gewinn · −0,04 PUE', 'guadagno stimato · −0,04 PUE', '预计收益 · −0,04 PUE', 'الفائدة المقدّرة · −0,04 PUE', '推定効果 · −0,04 PUE'],
'Une diode rouge ne dit rien.': ['A red LED tells you nothing.', 'Eine rote LED sagt nichts.', 'Un LED rosso non dice nulla.', '一个红灯说明不了什么。', 'مؤشر أحمر لا يقول شيئاً.', '赤いランプだけでは何も分からない。'],
'Plusieurs sites d\'un coup': ['Several sites at once', 'Mehrere Standorte auf einmal', 'Più siti in una volta', '一次多个站点', 'عدة مواقع في وقت واحد', '複数拠点を一度に'],
'de la hauteur': ['back', 'zurück', 'le distanze', '拉远视角', 'مسافة', '上げる'],
'Puis on prend': ['Then we step', 'Dann treten wir', 'Poi prendiamo', '然后我们', 'ثم نأخذ', 'そして視点を'],
'par site, jusqu\'à la réparation': ['per site, through to repair', 'pro Standort bis zur Reparatur', 'per sito, fino alla riparazione', '按站点，直到修复', 'لكل موقع، حتى الإصلاح', '拠点ごとに、修理まで'],
'ce qui tient, ce qui faiblit': ['what holds, what is weakening', 'was hält, was nachlässt', 'cosa tiene, cosa cede', '哪些稳固，哪些在弱化', 'ما يصمد وما يضعف', '持ちこたえるもの、弱るもの'],
'quelle machine, où exactement': ['which machine, exactly where', 'welche Maschine, genau wo', 'quale macchina, dove esattamente', '哪台机器，具体在哪', 'أي جهاز، وأين بالضبط', 'どの機器か、正確な位置'],
'Suivi de l\'incident': ['Incident tracking', 'Störungsverfolgung', 'Tracciamento incidente', '事件跟踪', 'تتبّع الحادث', '障害の追跡'],
'03 · le résultat': ['03 · the outcome', '03 · das Ergebnis', '03 · il risultato', '03 · 结果', '03 · النتيجة', '03 · 結果'],
'02 · la panne': ['02 · the fault', '02 · der Fehler', '02 · il guasto', '02 · 故障', '02 · العطل', '02 · 障害'],
'01 · l\'appareil': ['01 · the device', '01 · das Gerät', '01 · l\'apparato', '01 · 设备', '01 · الجهاز', '01 · 機器'],
'État du parc': ['Estate status', 'Bestandsstatus', 'Stato del parco', '资产状态', 'حالة المنظومة', '資産の状態'],
'Humidité': ['Humidity', 'Luftfeuchte', 'Umidità', '湿度', 'الرطوبة', '湿度'],
'U libres': ['Free U', 'Freie U', 'U liberi', '空闲 U', 'وحدات فارغة', '空き U'],
'Onduleur': ['UPS', 'USV', 'UPS', 'UPS', 'مزوّد طاقة', 'UPS'],
'Allée chaude': ['Hot aisle', 'Warmgang', 'Corridoio caldo', '热通道', 'الممر الساخن', 'ホットアイル'],
'Matériel': ['Hardware', 'Hardware', 'Hardware', '硬件', 'العتاد', 'ハードウェア'],
'Parc sain': ['Healthy estate', 'Gesunder Bestand', 'Parco sano', '资产健康', 'منظومة سليمة', '健全な資産'],
'La baie émet': ['The rack reports', 'Das Rack meldet', 'Il rack segnala', '机柜上报', 'الخزانة تُبلّغ', 'ラックが発報'],
'Les équipements du parc émettent': ['The estate devices report', 'Die Geräte des Bestands melden', 'I dispositivi del parco segnalano', '资产设备上报', 'أجهزة المنظومة تُبلّغ', '資産の機器が発報'],
'LE PARC ÉMET': ['THE ESTATE REPORTS', 'DER BESTAND MELDET', 'IL PARCO SEGNALA', '资产上报', 'المنظومة تُبلّغ', '資産が発報'],
'LE PARC': ['THE ESTATE', 'DER BESTAND', 'IL PARCO', '资产', 'المنظومة', '資産'],
'quatre problèmes, quatre réponses': ['four problems, four answers', 'vier Probleme, vier Antworten', 'quattro problemi, quattro risposte', '四个问题，四个答案', 'أربع مشكلات، أربعة حلول', '四つの課題、四つの答え'],
'02 · l\'outillage': ['02 · the tooling', '02 · das Werkzeug', '02 · gli strumenti', '02 · 工具', '02 · الأدوات', '02 · ツール'],
'01 · le socle': ['01 · the foundation', '01 · das Fundament', '01 · la base', '01 · 基础', '01 · الأساس', '01 · 土台'],
'en ce moment': ['right now', 'gerade jetzt', 'in questo momento', '此刻', 'في هذه اللحظة', 'いま'],
'Projets': ['Projects', 'Projekte', 'Progetti', '项目', 'المشاريع', 'プロジェクト'],
'06/JEUX': ['06/GAMES', '06/SPIELE', '06/GIOCHI', '06/游戏', '06/الألعاب', '06/ゲーム'],
'05/CONTACT': ['05/CONTACT', '05/KONTAKT', '05/CONTATTO', '05/联系', '05/اتصال', '05/連絡'],
'04/PARCOURS': ['04/BACKGROUND', '04/WERDEGANG', '04/PERCORSO', '04/经历', '04/المسار', '04/経歴'],
'03/PROJETS': ['03/PROJECTS', '03/PROJEKTE', '03/PROGETTI', '03/项目', '03/المشاريع', '03/プロジェクト'],
'02/CE QUE JE FAIS': ['02/WHAT I DO', '02/WAS ICH MACHE', '02/COSA FACCIO', '02/我的工作', '02/ما أفعله', '02/私の仕事'],
'01/MA CONVICTION': ['01/MY CONVICTION', '01/MEINE ÜBERZEUGUNG', '01/LA MIA CONVINZIONE', '01/我的信念', '01/قناعتي', '01/私の信念'],
'Cliquez le robot pour poser la question.': ['Click the robot to ask.', 'Klicken Sie den Roboter an, um zu fragen.', 'Clicca il robot per chiedere.', '点击机器人提问。', 'انقر الروبوت لتسأل.', 'ロボットをクリックして質問してください。'],
'Le plus proche :': ['Closest match:', 'Am nächsten:', 'Il più vicino:', '最接近的：', 'الأقرب:', '最も近いもの：'],
'ce point précis n\'est pas documenté ici.': ['this particular point is not documented here.', 'dieser Punkt ist hier nicht dokumentiert.', 'questo punto non è documentato qui.', '此处未记录这一点。', 'هذه النقطة غير موثّقة هنا.', 'この点はここには記載がありません。'],
'Anas Dine, administrateur systèmes et réseaux en Suisse romande, spécialisé en automatisation et en IA hébergée en local. Huit ans de terrain : parcs PME, horlogerie, énergie, salle machine. C\'est son portfolio que vous lisez.': ['Anas Dine, systems and network administrator in French-speaking Switzerland, specialised in automation and locally hosted AI. Eight years in the field: SME estates, watchmaking, energy, server rooms. You are reading his portfolio.', 'Anas Dine, System- und Netzwerkadministrator in der Westschweiz, spezialisiert auf Automatisierung und lokal betriebene KI. Acht Jahre Praxis: KMU-Bestände, Uhrenindustrie, Energie, Rechenraum. Sie lesen sein Portfolio.', 'Anas Dine, amministratore di sistemi e reti nella Svizzera francese, specializzato in automazione e IA ospitata in locale. Otto anni sul campo: parchi PMI, orologeria, energia, sala macchine. Questo è il suo portfolio.', 'Anas Dine，瑞士法语区的系统与网络管理员，专注自动化与本地部署的 AI。八年一线经验：中小企业资产、钟表业、能源、机房。您正在阅读他的作品集。', 'أنس دين، مسؤول أنظمة وشبكات في سويسرا الناطقة بالفرنسية، متخصص في الأتمتة والذكاء الاصطناعي المستضاف محلياً. ثماني سنوات في الميدان: منظومات الشركات الصغيرة، صناعة الساعات، الطاقة، قاعة الخدمات. أنت تقرأ ملف أعماله.', 'アナス・ディーヌ、スイス・フランス語圏のシステム・ネットワーク管理者。自動化とローカル運用の AI を専門とします。現場八年：中小企業の資産、時計産業、エネルギー、サーバールーム。今ご覧なのが彼のポートフォリオです。'],
'Systèmes, réseaux & IA locale': ['Systems, networks & local AI', 'Systeme, Netzwerke & lokale KI', 'Sistemi, reti e IA locale', '系统、网络与本地 AI', 'أنظمة وشبكات وذكاء محلي', 'システム・ネットワーク・ローカル AI'],
'Explication au surlignage': ['Explain on highlight', 'Erklärung bei Markierung', 'Spiegazione alla selezione', '选中即解释', 'شرح عند التحديد', 'ハイライトで解説'],
'Suisse romande': ['French-speaking Switzerland', 'Westschweiz', 'Svizzera francese', '瑞士法语区', 'سويسرا الناطقة بالفرنسية', 'スイス・フランス語圏'],
'rôle : attaque': ['role: attack', 'Rolle: Angriff', 'ruolo: attacco', '角色：攻击', 'الدور: هجوم', '役割：攻撃'],
'CHANGER DE CAMP': ['SWITCH SIDES', 'SEITE WECHSELN', 'CAMBIA SCHIERAMENTO', '切换阵营', 'تغيير الفريق', '陣営を変える'],
'Séquence de démarrage': ['Start-up sequence', 'Startsequenz', 'Sequenza di avvio', '启动顺序', 'تسلسل التشغيل', '起動シーケンス'],
'Temps de réaction': ['Reaction time', 'Reaktionszeit', 'Tempo di reazione', '反应时间', 'زمن الاستجابة', '反応時間'],
'Inventaire du parc': ['Estate inventory', 'Bestandsinventar', 'Inventario del parco', '资产清单', 'جرد المنظومة', '資産の棚卸し'],
'NOUVELLE ANALYSE': ['NEW ANALYSIS', 'NEUE ANALYSE', 'NUOVA ANALISI', '新的分析', 'تحليل جديد', '新しい解析'],
'analyse en cours': ['analysis running', 'Analyse läuft', 'analisi in corso', '分析进行中', 'التحليل جارٍ', '解析中'],
'Renvoyer les attaques': ['Return the attacks', 'Angriffe zurückschlagen', 'Respingere gli attacchi', '反击攻击', 'صدّ الهجمات', '攻撃を打ち返す'],
'Collecte de paquets': ['Packet collection', 'Paketsammlung', 'Raccolta pacchetti', '数据包收集', 'جمع الحزم', 'パケット収集'],
'état : nominal': ['status: nominal', 'Status: normal', 'stato: nominale', '状态：正常', 'الحالة: طبيعية', '状態：正常'],
'Température GPU': ['GPU temperature', 'GPU-Temperatur', 'Temperatura GPU', 'GPU 温度', 'حرارة المعالج الرسومي', 'GPU 温度'],
'la suite se décide ici': ['what happens next is decided here', 'hier entscheidet sich das Weitere', 'il seguito si decide qui', '下一步在这里决定', 'ما بعده يُقرَّر هنا', '次はここで決まります'],
'Admin. systèmes, concepteur d\'outils': ['Systems admin, tool builder', 'Systemadmin, Werkzeugentwickler', 'Sysadmin, sviluppatore di strumenti', '系统管理员、工具开发者', 'مسؤول أنظمة ومطوّر أدوات', 'システム管理者・ツール開発者'],
'Spécialiste réseau, chef de projet': ['Network specialist, project lead', 'Netzwerkspezialist, Projektleiter', 'Specialista di rete, project manager', '网络专家、项目负责人', 'أخصائي شبكات، مدير مشروع', 'ネットワーク専門・プロジェクト責任者'],
'Technicien en câblage structuré': ['Structured cabling technician', 'Techniker für strukturierte Verkabelung', 'Tecnico cablaggio strutturato', '综合布线技术员', 'تقني كابلات منظمة', '構内配線技術者'],
'Responsable réseau & télécoms': ['Network & telecoms manager', 'Leiter Netzwerk & Telekom', 'Responsabile rete e telecom', '网络与电信负责人', 'مدير الشبكات والاتصالات', 'ネットワーク・通信責任者'],
'Fondateur & consultant IT': ['Founder & IT consultant', 'Gründer & IT-Berater', 'Fondatore e consulente IT', '创始人兼 IT 顾问', 'مؤسس ومستشار تقني', '創業者・IT コンサルタント'],
'L\'IA est une ressource, pas une magie': ['AI is a resource, not magic', 'KI ist eine Ressource, keine Magie', 'L\'IA è una risorsa, non magia', 'AI 是资源，不是魔法', 'الذكاء الاصطناعي مورد لا سحر', 'AI は資源であって魔法ではない'],
'huit ans, des écarts mesurés': ['eight years, measured gaps', 'acht Jahre, gemessene Unterschiede', 'otto anni, scarti misurati', '八年，可量化的差距', 'ثماني سنوات، فوارق مقيسة', '八年、測られた差'],
'Quantification': ['Quantisation', 'Quantisierung', 'Quantizzazione', '量化', 'التكميم', '量子化'],
'VRAM disponible': ['VRAM available', 'Verfügbarer VRAM', 'VRAM disponibile', '可用显存', 'ذاكرة الرسوميات المتاحة', '利用可能な VRAM'],
'Le boîtier, à droite': ['The enclosure, on the right', 'Das Gehäuse, rechts', 'Il case, a destra', '右侧的机箱', 'الصندوق، إلى اليمين', '右側の筐体'],
'Infrastructure IA': ['AI infrastructure', 'KI-Infrastruktur', 'Infrastruttura IA', 'AI 基础设施', 'بنية الذكاء الاصطناعي', 'AI インフラ'],
'Je crée des outils et des sites,': ['I build tools and websites,', 'Ich baue Werkzeuge und Websites,', 'Creo strumenti e siti,', '我打造工具与网站，', 'أصنع أدوات ومواقع،', 'ツールとサイトを作ります、'],
'En cours d\'assemblage': ['Being assembled', 'Im Aufbau', 'In assemblaggio', '组装中', 'قيد التجميع', '組立中'],
'Une IA qui travaille': ['An AI that works', 'Eine KI, die arbeitet', 'Un\'IA che lavora', '一个真正工作的 AI', 'ذكاء اصطناعي يعمل', '働く AI'],
'Vue multi-sites': ['Multi-site view', 'Mehrstandort-Ansicht', 'Vista multi-sito', '多站点视图', 'عرض متعدد المواقع', '複数拠点ビュー'],
'Ce qui est tenu': ['What is upheld', 'Was eingehalten wird', 'Ciò che è garantito', '已达成的保障', 'ما يتم الالتزام به', '守られていること'],
'sécurise le parc': ['secures the estate', 'sichert den Bestand', 'mette in sicurezza il parco', '保障资产安全', 'يؤمّن المنظومة', '資産を守る'],
'Ce qu\'un outil comme Leonhard change': ['What a tool like Leonhard changes', 'Was ein Werkzeug wie Leonhard ändert', 'Cosa cambia uno strumento come Leonhard', '像 Leonhard 这样的工具带来什么', 'ما يغيّره أداة مثل ليونهارد', 'Leonhard のようなツールが変えること'],
'une matinée type': ['a typical morning', 'ein typischer Morgen', 'una mattinata tipo', '典型的一个上午', 'صبيحة نموذجية', 'ある朝の例'],
'Copilote IA sur toute la chaîne': ['AI copilot across the chain', 'KI-Copilot über die ganze Kette', 'Copilota IA su tutta la catena', '全链路 AI 副驾', 'مساعد ذكي على كامل السلسلة', '全工程を通した AI 副操縦'],
'Suivi de l\'intervention': ['Job tracking', 'Auftragsverfolgung', 'Tracciamento intervento', '工单跟踪', 'تتبّع التدخل', '作業の追跡'],
'Fiche équipement': ['Device record', 'Gerätedatenblatt', 'Scheda apparato', '设备档案', 'بطاقة الجهاز', '機器カード'],
'Leonhard trie': ['Leonhard sorts', 'Leonhard sortiert', 'Leonhard smista', 'Leonhard 分流', 'ليونهارد يفرز', 'Leonhard が選別'],
'un parc, une personne': ['one estate, one person', 'ein Bestand, eine Person', 'un parco, una persona', '一个资产，一个人', 'منظومة واحدة، شخص واحد', '一つの資産、一人で'],
'ce qui tourne, ce qui s\'assemble': ['what runs, what is being assembled', 'was läuft, was entsteht', 'cosa gira, cosa si assembla', '已运行的与正在组装的', 'ما يعمل وما يُبنى', '稼働中のものと組立中のもの'],
'Intégrer l\'IA': ['Bringing in AI', 'KI einbinden', 'Integrare l\'IA', '引入 AI', 'دمج الذكاء الاصطناعي', 'AI を導入する'],
'Ce que j\'ai construit': ['What I have built', 'Was ich gebaut habe', 'Ciò che ho costruito', '我构建的成果', 'ما بنيته', '私が作ったもの'],
'Le travail se fait seul': ['The work runs itself', 'Die Arbeit läuft von selbst', 'Il lavoro si fa da sé', '工作自动完成', 'العمل يجري تلقائياً', '作業は自動で進む'],
'Le socle tient': ['The foundation holds', 'Das Fundament hält', 'La base tiene', '基础稳固', 'الأساس متين', '土台が持ちこたえる'],
'je fais le pont entre les deux': ['I bridge the two', 'Ich verbinde beide Seiten', 'faccio da ponte tra i due', '我在两者之间搭桥', 'أنا الجسر بينهما', '両者の架け橋になります'],
'— et je les supervise avec l\'IA.': ['— and I supervise them with AI.', '— und überwache sie mit KI.', '— e li supervisiono con l\'IA.', '— 并借助 AI 进行监控。', '— وأراقبها بالذكاء الاصطناعي.', '— そして AI で監視します。'],
'Je gère les parcs informatiques': ['I manage IT estates', 'Ich betreue IT-Landschaften', 'Gestisco parchi informatici', '我管理 IT 资产', 'أدير أنظمة المعلومات', 'IT 資産を管理します'],
'l\'interface entre les deux': ['the interface between the two', 'die Schnittstelle zwischen beiden', 'l\'interfaccia tra i due', '两者之间的接口', 'الواجهة بين الاثنين', '両者をつなぐ接点'],
' : je traduis un besoin dit en mots simples en quelque chose qui tourne, et je renvoie aux gens ce que la machine a compris, dans leur vocabulaire. Une API entre les humains et les machines.': [': I turn a need stated in plain words into something that runs, and I give people back what the machine understood, in their own vocabulary. An API between humans and machines.', ': Ich übersetze einen einfach formulierten Bedarf in etwas, das läuft, und gebe den Menschen zurück, was die Maschine verstanden hat — in ihrer Sprache. Eine API zwischen Mensch und Maschine.', ': traduco un bisogno espresso a parole semplici in qualcosa che funziona, e restituisco alle persone ciò che la macchina ha capito, nel loro linguaggio. Un\'API tra umani e macchine.', '：把用平常话说出的需求变成能运行的东西，再用他们的语言把机器理解到的内容讲回去。人与机器之间的一个 API。', ': أحوّل حاجة معبّراً عنها بكلمات بسيطة إلى شيء يعمل، وأعيد للناس ما فهمته الآلة بمصطلحاتهم. واجهة برمجية بين البشر والآلات.', '。平易な言葉で語られた要件を動くものに変え、機械が理解した内容をその人の言葉で返します。人と機械のあいだの API です。'],
'faire l\'interface entre les deux': ['to be the interface between the two', 'die Schnittstelle zwischen beiden zu sein', 'fare da interfaccia tra i due', '在两者之间充当接口', 'أن أكون الواجهة بين الاثنين', 'その両者をつなぐ接点になることです'],
'Les machines ne comprennent pas ce qu\'on attend d\'elles, et les gens n\'ont pas à parler leur langue. Mon métier, c\'est ': ['Machines do not understand what is expected of them, and people should not have to speak their language. My job is ', 'Maschinen verstehen nicht, was von ihnen erwartet wird, und Menschen müssen ihre Sprache nicht sprechen. Meine Aufgabe ist es, ', 'Le macchine non capiscono ciò che si aspetta da loro, e le persone non devono parlarne la lingua. Il mio lavoro è ', '机器不理解人们对它的期待，而人也不必学它的语言。我的工作，就是', 'الآلات لا تفهم ما هو مطلوب منها، والناس ليسوا مضطرين للتحدث بلغتها. عملي هو ', '機械は求められていることを理解せず、人がその言語を話す必要もありません。私の仕事は、'],
'CE QUE JE FAIS CHEZ VOUS': ['WHAT I DO FOR YOU', 'WAS ICH BEI IHNEN MACHE', 'COSA FACCIO DA VOI', '我为您做什么', 'ما أقوم به لديكم', '御社で私がすること'],
'Ce que je fais chez vous': ['What I do for you', 'Was ich bei Ihnen mache', 'Cosa faccio da voi', '我为您做什么', 'ما أقوم به لديكم', '御社で私がすること'],
'le point de départ': ['the starting point', 'der Ausgangspunkt', 'il punto di partenza', '出发点', 'نقطة البداية', '出発点'],
'MA CONVICTION': ['MY CONVICTION', 'MEINE ÜBERZEUGUNG', 'LA MIA CONVINZIONE', '我的信念', 'قناعتي', '私の信念'],
'Ma conviction': ['My conviction', 'Meine Überzeugung', 'La mia convinzione', '我的信念', 'قناعتي', '私の信念'],
'SON & VOIX — ON': ['SOUND & VOICE — ON', 'TON & STIMME — EIN', 'AUDIO E VOCE — ON', '声音与语音 — 开', 'الصوت — تشغيل', '音声 — オン'],
'SON & VOIX — OFF': ['SOUND & VOICE — OFF', 'TON & STIMME — AUS', 'AUDIO E VOCE — OFF', '声音与语音 — 关', 'الصوت — إيقاف', '音声 — オフ'],
'SaaS vertical': ['Vertical SaaS', 'Vertikales SaaS', 'SaaS verticale', '業種特化 SaaS', 'SaaS رأسي'],
'La donnée attendue d\'abord : entretiens terrain, vocabulaire du métier, contraintes réglementaires': ['The expected data first: field interviews, the trade\'s vocabulary, regulatory constraints', 'Zuerst die erwarteten Daten: Gespräche vor Ort, Fachsprache, regulatorische Vorgaben', 'Prima il dato atteso: interviste sul campo, lessico del mestiere, vincoli normativi', 'まず求められるデータから — 現場での聞き取り、業界の用語、規制上の制約', 'البيانات المتوقعة أولاً: مقابلات ميدانية، مصطلحات المهنة، القيود التنظيمية'],
'Tout corps de métier : la méthode s\'adapte, la rigueur ne change pas': ['Every trade: the method adapts, the rigour does not', 'Jeder Beruf: die Methode passt sich an, die Sorgfalt bleibt', 'Ogni mestiere: il metodo si adatta, il rigore no', 'あらゆる業種 — 手法は変えても、厳密さは変えない', 'كل المهن: المنهج يتكيّف، أما الدقة فلا تتغيّر'],
'Je développe des SaaS verticaux : un métier, un outil. Tous les secteurs m\'intéressent — j\'adapte ma méthode à celui que j\'ai en face pour en ressortir la donnée de qualité qu\'il attend, dans son vocabulaire et selon ses règles.': ['I build vertical SaaS: one trade, one tool. Every sector interests me — I adapt my method to whoever is in front of me, to draw out the quality data they expect, in their vocabulary and under their rules.', 'Ich entwickle vertikale SaaS: ein Beruf, ein Werkzeug. Jede Branche interessiert mich — ich passe meine Methode dem Gegenüber an, um die erwarteten Qualitätsdaten in dessen Sprache und Regeln zu gewinnen.', 'Sviluppo SaaS verticali: un mestiere, uno strumento. Ogni settore mi interessa — adatto il metodo a chi ho davanti per estrarre il dato di qualità atteso, nel suo linguaggio e secondo le sue regole.', '私は業種特化型 SaaS を開発します。業種ごとに一つのツール。どの分野にも関心があり、相手に合わせて手法を変え、その業界の言葉と規則に沿って求められる品質のデータを引き出します。', 'أطوّر حلول SaaS رأسية: مهنة واحدة، أداة واحدة. كل القطاعات تهمّني — أكيّف منهجي مع من أمامي لاستخراج البيانات عالية الجودة التي يتوقعها، بمصطلحاته ووفق قواعده.'],
/* ---- navigation & barre ---- */
'MANIFESTE': ['MANIFESTO', 'MANIFEST', 'MANIFESTO', '理念', 'الرؤية'],
'PILE': ['MY WORK', 'LEISTUNGEN', 'IL MIO LAVORO', '我的工作', 'عملي'],
'SEC 02': ['SEC 02', 'ABS 02', 'SEZ 02', '第 02 节', 'القسم 02'],
'CE QUE JE PEUX FAIRE CHEZ VOUS': ['WHAT I CAN DO FOR YOU', 'WAS ICH FÜR SIE TUN KANN', 'COSA POSSO FARE PER VOI', '我能为你做什么', 'ما أستطيع فعله عندكم'],
'Quatre problèmes, dans l\'ordre où on les rencontre': ['Four problems, in the order they show up', 'Vier Probleme, in der Reihenfolge ihres Auftretens', 'Quattro problemi, nell\'ordine in cui si presentano', '四个问题，按出现顺序', 'أربع مشكلات، بالترتيب الذي تظهر به'],
'CE QUE JE FAIS': ['WHAT I DO', 'WAS ICH TUE', 'COSA FACCIO', '我的工作', 'ما أفعله'],
'PROJETS': ['PROJECTS', 'PROJEKTE', 'PROGETTI', '项目', 'المشاريع'],
'PARCOURS': ['EXPERIENCE', 'WERDEGANG', 'PERCORSO', '经历', 'المسار'],
'JEUX': ['GAMES', 'SPIELE', 'GIOCHI', '游戏', 'ألعاب'],
'CONTACT': ['CONTACT', 'KONTAKT', 'CONTATTO', '联系', 'اتصال'],
'MOUVEMENT — COMPLET': ['MOTION — FULL', 'BEWEGUNG — VOLL', 'MOVIMENTO — PIENO', '动效 — 全开', 'الحركة — كاملة'],
'MOUVEMENT — CALME': ['MOTION — CALM', 'BEWEGUNG — RUHIG', 'MOVIMENTO — CALMO', '动效 — 轻', 'الحركة — هادئة'],
'MOUVEMENT — FIGÉ': ['MOTION — OFF', 'BEWEGUNG — AUS', 'MOVIMENTO — OFF', '动效 — 关', 'الحركة — متوقفة'],
'MOUV. ✓': ['MOTION ✓', 'BEW. ✓', 'MOV. ✓', '动效 ✓', 'حركة ✓'],
'MOUV. CALME': ['MOTION CALM', 'BEW. RUHIG', 'MOV. CALMO', '动效 轻', 'حركة هادئة'],
'MOUV. FIGÉ': ['MOTION OFF', 'BEW. AUS', 'MOV. OFF', '动效 关', 'حركة متوقفة'],
'SON — OFF': ['SOUND — OFF', 'TON — AUS', 'AUDIO — OFF', '声音 — 关', 'الصوت — مغلق'],
'SON — ON': ['SOUND — ON', 'TON — EIN', 'AUDIO — ON', '声音 — 开', 'الصوت — مفتوح'],
'SON ✕': ['SOUND ✕', 'TON ✕', 'AUDIO ✕', '声音 ✕', 'صوت ✕'],
'SON ✓': ['SOUND ✓', 'TON ✓', 'AUDIO ✓', '声音 ✓', 'صوت ✓'],

/* ---- entrée ---- */
'Disponible': ['Available', 'Verfügbar', 'Disponibile', '可接洽', 'متاح'],
'Systèmes & réseaux': ['Systems & networks', 'Systeme & Netzwerke', 'Sistemi e reti', '系统与网络', 'الأنظمة والشبكات'],
'IA hébergée en local': ['AI hosted on-premise', 'KI im eigenen Haus', 'IA ospitata in locale', '本地部署的 AI', 'ذكاء اصطناعي مستضاف محليًا'],
"L'informatique va plus vite que les équipes qui la tiennent. Ma réponse : ":
 ['IT moves faster than the teams that keep it running. My answer: ',
  'Die IT entwickelt sich schneller als die Teams, die sie betreiben. Meine Antwort: ',
  "L'informatica corre più veloce dei team che la tengono in piedi. La mia risposta: ",
  'IT 的变化快过维护它的团队。我的答案：', 'التقنية تتقدم أسرع من الفرق التي تشغّلها. جوابي: '],
"l'administration systèmes et l'IA locale dans les mêmes mains":
 ['systems administration and on-premise AI in the same hands',
  'Systemadministration und lokale KI in einer Hand',
  "amministrazione dei sistemi e IA locale nelle stesse mani",
  '把系统运维与本地 AI 交到同一双手上', 'إدارة الأنظمة والذكاء الاصطناعي المحلي في اليدين نفسهما'],
'01 · ce que je tiens': ['01 · what I keep running', '01 · was ich am Laufen halte', '01 · ciò che mantengo', '01 · 我维护的', '01 · ما أُبقيه يعمل'],
"Je tiens l\'infrastructure": ['I keep the infrastructure up', 'Ich halte die Infrastruktur stabil', "Tengo in piedi l'infrastruttura", '我让基础设施稳定运行', 'أُبقي البنية التحتية قائمة'],
'serveurs, réseau et sauvegardes — huit ans en environnement réel':
 ['servers, network, backups — eight years on real estates',
  'Server, Netzwerk, Backups — acht Jahre in echten Umgebungen',
  'server, rete, backup — otto anni su parchi reali',
  '服务器、网络、备份 —— 八年真实环境经验', 'خواديم وشبكة ونسخ احتياطي — ثماني سنوات في بيئات حقيقية'],
"02 · ce que j\'ajoute": ['02 · what I add', '02 · was ich hinzufüge', '02 · ciò che aggiungo', '02 · 我加上的', '02 · ما أضيفه'],
"Je l\'outille avec de l\'IA": ['I tool it with AI', 'Ich rüste sie mit KI aus', "La equipaggio con l'IA", '我用 AI 为它装上工具', 'أزوّدها بالذكاء الاصطناعي'],
'des modèles installés chez vous ; vos données ne quittent pas vos murs':
 ['models installed on your premises, your data never leaves',
  'Modelle bei Ihnen installiert, Ihre Daten bleiben im Haus',
  'modelli installati da voi, i vostri dati non escono',
  '模型装在你这里，数据不出门', 'نماذج مثبّتة عندكم، وبياناتكم لا تخرج'],
'03 · ce que ça change': ['03 · what changes', '03 · was sich ändert', '03 · cosa cambia', '03 · 带来的改变', '03 · ما يتغيّر'],
'Vous savez enfin où vous en êtes': ['You finally know where you stand', 'Sie wissen endlich, wo Sie stehen', 'Sapete finalmente come state', '你终于清楚现状', 'تعرفون أخيرًا وضعكم الحقيقي'],
'ce qui tombe en panne est détecté, expliqué et réparé':
 ['what breaks is seen, explained and fixed — without chasing you',
  'Was ausfällt, wird erkannt, erklärt und behoben — ohne Nachlaufen',
  'ciò che si rompe è visto, spiegato e riparato — senza inseguirvi',
  '故障被发现、解释并修复 —— 不用追着你', 'ما يتعطل يُكتشف ويُشرح ويُصلح — دون أن نلاحقكم'],
'En service': ['Live', 'Im Betrieb', 'In servizio', '运行中', 'قيد التشغيل'],
'01 faire tenir': ['01 keep it up', '01 stabil halten', '01 far reggere', '01 稳住', '01 التثبيت'],
'02 automatiser': ['02 automate', '02 automatisieren', '02 automatizzare', '02 自动化', '02 الأتمتة'],
'03 rendre lisible': ['03 make it legible', '03 sichtbar machen', '03 rendere leggibile', '03 变清晰', '03 الوضوح'],
'Voir les projets ↓': ['See the projects ↓', 'Projekte ansehen ↓', 'Vedi i progetti ↓', '查看项目 ↓', 'انظر المشاريع ↓'],
"Je remets l'infrastructure d'aplomb, et je la surveille en continu.":
 ['I put the infrastructure back on its feet, and watch it continuously.',
  'Ich bringe die Infrastruktur in Ordnung und überwache sie laufend.',
  "Rimetto in sesto l'infrastruttura e la monitoro in continuo.",
  '我把基础设施扶正，并持续监控。', 'أعيد البنية التحتية إلى استقامتها، وأراقبها باستمرار.'],
'Ce qui se répète devient un script : plus de passage poste par poste.':
 ['Whatever repeats becomes a script: no more machine-by-machine rounds.',
  'Was sich wiederholt, wird ein Skript: keine Runden von Rechner zu Rechner.',
  'Ciò che si ripete diventa uno script: basta giri postazione per postazione.',
  '重复的事变成脚本：不再一台台巡检。', 'ما يتكرر يصبح سكربتًا: لا مزيد من المرور على كل جهاز.'],
'Et vous obtenez un écran qui dit quoi faire, dans quel ordre.':
 ['And you get one screen telling you what to do, in what order.',
  'Und Sie erhalten einen Bildschirm, der sagt, was zu tun ist — in welcher Reihenfolge.',
  'E ottenete una schermata che dice cosa fare, e in quale ordine.',
  '你得到一块屏幕，告诉你先做什么。', 'وتحصلون على شاشة تقول ما يجب فعله، وبأي ترتيب.'],
'Expérience': ['Experience', 'Erfahrung', 'Esperienza', '经验', 'الخبرة'],
'Je prends en charge': ['I cover', 'Ich übernehme', 'Mi occupo di', '我负责', 'أتولّى'],
'du poste au serveur': ['from workstation to server', 'vom Arbeitsplatz bis zum Server', 'dalla postazione al server', '从终端到服务器', 'من الجهاز إلى الخادم'],
"Ce que j\'ai construit": ['What I built', 'Was ich gebaut habe', 'Ciò che ho costruito', '我造的东西', 'ما بنيته'],
'Terrains': ['Sectors', 'Einsatzfelder', 'Settori', '行业', 'القطاعات'],
'PME → industrie': ['SMB → industry', 'KMU → Industrie', 'PMI → industria', '中小企业 → 工业', 'الشركات الصغيرة → الصناعة'],
'Diplôme': ['Qualification', 'Abschluss', 'Diploma', '学历', 'الشهادة'],
'option A · par VAE': ['option A · by prior-experience accreditation', 'Option A · über Berufserfahrung anerkannt', 'opzione A · per esperienza acquisita', 'A 方向 · 经验认证获得', 'المسار أ · بالاعتراف بالخبرة'],
'Défilez — les quatre étages, puis les projets':
 ['Scroll — the four floors, then the projects',
  'Scrollen — die vier Ebenen, dann die Projekte',
  'Scorri — i quattro piani, poi i progetti',
  '向下滚动 —— 四个层级，然后是项目'],
'Suisse romande · disponible sur site et à distance':
 ['French-speaking Switzerland · on site and remote',
  'Westschweiz · vor Ort und remote',
  'Svizzera romanda · in sede e a distanza',
  '瑞士法语区 · 现场与远程', 'سويسرا الناطقة بالفرنسية · حضوريًا وعن بُعد'],

/* ---- manifeste ---- */
"Aucune technologie n'est bonne ou mauvaise : tout dépend des mains qui la tiennent. Bien maîtrisée, elle nous fait progresser ; livrée à elle-même, elle devient la faille. Mon métier, c'est ":
 ['No technology is good or bad in itself: it all depends on the hands holding it. Mastered, it moves us forward; left alone, it becomes the breach. My job is ',
  'Keine Technologie ist gut oder schlecht: es kommt auf die Hände an, die sie führen. Beherrscht bringt sie uns voran; sich selbst überlassen wird sie zur Lücke. Mein Beruf ist es, ',
  "Nessuna tecnologia è buona o cattiva: dipende dalle mani che la tengono. Padroneggiata, ci fa progredire; lasciata a sé, diventa la falla. Il mio lavoro è ",
  '技术本身不分好坏，关键在于掌握它的人。用得好，它推动我们前进；放任不管，它就是缺口。我的工作是', 'لا تقنية جيدة أو سيئة بذاتها: كل شيء يتعلق باليد التي تمسكها. إذا أُحسن استخدامها تقدّمنا؛ وإذا أُهملت صارت الثغرة. مهمتي هي '],
'rester du bon côté de cette bascule': ['staying on the right side of that tipping point', 'auf der richtigen Seite dieses Kipppunkts zu bleiben', 'restare dal lato giusto di questo ribaltamento', '守在这个临界点的正确一侧', 'البقاء في الجانب الصحيح من هذا الميزان'],
" — une infrastructure qui tient, une IA qui sert.":
 [' — infrastructure that holds, AI that serves.',
  ' — eine Infrastruktur, die trägt, und eine KI, die dient.',
  " — un'infrastruttura che tiene, un'IA che serve.",
  ' —— 撑得住的基础设施，用得上的 AI。', ' — بنية تحتية صامدة، وذكاء اصطناعي نافع.'],

/* ---- SEC 02 ---- */
'Le problème': ['The problem', 'Das Problem', 'Il problema', '问题', 'المشكلة'],
'Ce que je fais': ['What I do', 'Was ich tue', 'Cosa faccio', '我做的', 'ما أفعله'],
'Avant / après': ['Before / after', 'Vorher / nachher', 'Prima / dopo', '前后对比', 'قبل / بعد'],
'Faire tenir': ['Keep it running', 'Stabil halten', 'Far reggere', '稳住', 'التثبيت'],
'votre matériel': ['your hardware', 'Ihre Hardware', 'il vostro hardware', '你的设备', 'عتادكم'],
'Automatiser': ['Automate', 'Automatisieren', 'Automatizzare', '自动化', 'الأتمتة'],
'les tâches répétitives': ['repetitive tasks', 'wiederkehrende Aufgaben', 'le attività ripetitive', '重复的工作', 'المهام المتكررة'],
"Intégrer l\'IA": ['Bring in AI', 'KI einbinden', "Integrare l'IA", '引入 AI', 'دمج الذكاء الاصطناعي'],
'sans sortir vos données': ['without your data leaving', 'ohne Ihre Daten herauszugeben', 'senza far uscire i dati', '数据不外流', 'دون إخراج بياناتكم'],
'Savoir où vous en êtes': ['Know where you stand', 'Wissen, wo Sie stehen', 'Sapere come state', '掌握现状', 'معرفة وضعكم'],
'un écran, pas dix': ['one screen, not ten', 'ein Bildschirm, nicht zehn', 'una schermata, non dieci', '一块屏，不是十块', 'شاشة واحدة، لا عشر'],

/* ---- fragments restés en français ---- */

'Plus bas : les projets qui le font.': ['Further down: the projects that do it.', 'Weiter unten: die Projekte, die das tun.', 'Più in basso: i progetti che lo fanno.', '往下看：做到这些的项目。', 'أسفل الصفحة: المشاريع التي تفعل ذلك.'],
'Voir les projets ↓': ['See the projects ↓', 'Projekte ansehen ↓', 'Vedi i progetti ↓', '查看项目 ↓', 'انظر المشاريع ↓'],

/* ---- le pont : triptyque de l'entrée ---- */
'03 · ce que je suis': ['03 · what I am', '03 · was ich bin', '03 · chi sono', '03 · 我的角色', '03 · من أنا'],
'Je fais le pont': ['I bridge the gap', 'Ich baue die Brücke', 'Faccio da ponte', '我做那座桥', 'أبني الجسر'],
"entre la technologie et celles et ceux qui l'utilisent — un interlocuteur qui parle les deux langues": ['between the technology and the people using it — one contact who speaks both languages', 'zwischen der Technik und den Menschen, die sie nutzen — ein Ansprechpartner, der beide Sprachen spricht', 'tra la tecnologia e le persone che la usano — un interlocutore che parla entrambe le lingue', '在技术与使用者之间 —— 一个同时说两种语言的对接人', 'بين التقنية والناس الذين يستخدمونها — جهة اتصال تتحدث اللغتين'],
'01 votre besoin': ['01 your need', '01 Ihr Bedarf', '01 il vostro bisogno', '01 你的需求', '01 حاجتكم'],
'02 je traduis': ['02 I translate', '02 ich übersetze', '02 traduco', '02 我来转译', '02 أترجم'],
'03 ce que vous recevez': ['03 what you get', '03 was Sie erhalten', '03 cosa ricevete', '03 你得到什么', '03 ما تحصلون عليه'],
'Vous exposez le problème dans vos propres termes, sans vocabulaire technique.': ['You describe the problem in your own words — no technical vocabulary needed.', 'Sie schildern das Problem in Ihren Worten — kein Fachjargon nötig.', 'Mi raccontate il problema con le vostre parole — senza gergo tecnico.', '你用自己的话说问题 —— 不需要术语。', 'تشرحون المشكلة بكلماتكم — دون مصطلحات تقنية.'],
"Je le traduis en infrastructure, en scripts et en modèles, et j'assure le lien avec vos équipes.": ['I turn it into infrastructure, scripts and models — and I keep the team in the loop.', 'Ich übersetze es in Infrastruktur, Skripte und Modelle — und halte das Team im Bilde.', 'Lo traduco in infrastruttura, script e modelli — e tengo il collegamento con il team.', '我把它转成基础设施、脚本和模型 —— 并与团队保持衔接。', 'أُحوّلها إلى بنية تحتية وسكربتات ونماذج — وأبقي الفريق على تواصل.'],
'Au terme : un parc maîtrisé, un projet d\'IA livré, un site raccordé, un audit remis.': ['At the end: an estate under control, an AI project delivered, a site connected, an audit handed over.', 'Am Ende: ein beherrschter Bestand, ein geliefertes KI-Projekt, ein angeschlossener Standort, ein übergebenes Audit.', 'Alla fine: un parco sotto controllo, un progetto IA consegnato, un sito collegato, un audit consegnato.', '最终：一个受控的资产群、一个交付的 AI 项目、一个接通的站点、一份交出的审计。', 'في النهاية: أسطول مُحكم، ومشروع ذكاء اصطناعي مُنجز، وموقع موصول، وتقرير تدقيق مُسلَّم.'],

/* ---- SEC 02 : les quatre étapes ---- */
'« Le système retombe chaque semaine, et personne n\'en connaît la cause. »': ['“It goes down every week, and nobody knows why.”', '„Es fällt jede Woche aus, und niemand weiß warum.“', '«Cade ogni settimana e nessuno sa perché.»', '「每周都出故障，也没人知道原因。」', '«يتعطل كل أسبوع، ولا أحد يعرف السبب.»'],
"Je remets vos serveurs, votre réseau et vos sauvegardes en état, puis je vérifie qu'une restauration fonctionne réellement.": ['I put your servers, network and backups back in order — and I check that a restore actually works.', 'Ich bringe Ihre Server, Ihr Netzwerk und Ihre Backups in Ordnung — und prüfe, dass eine Wiederherstellung wirklich funktioniert.', 'Rimetto in ordine server, rete e backup — e verifico che un ripristino funzioni davvero.', '我把服务器、网络和备份恢复到正常状态，并验证还原真的能用。', 'أُعيد خواديمكم وشبكتكم ونسخكم الاحتياطية إلى وضعها الصحيح — وأتحقق أن الاسترجاع يعمل فعلًا.'],
'Vous ne perdez plus de journées de travail à cause d\'une panne.': ['You stop losing working days to an outage.', 'Sie verlieren keine Arbeitstage mehr durch Ausfälle.', 'Smettete di perdere giornate di lavoro per un guasto.', '不再因为一次故障损失整天工作。', 'تتوقفون عن خسارة أيام عمل بسبب عطل.'],
'Avant : ça tombe. Après : ça tient.': ['Before: it fails. After: it holds.', 'Vorher: es fällt aus. Nachher: es hält.', 'Prima: cade. Dopo: tiene.', '之前：会倒。之后：撑得住。', 'قبل: يتعطل. بعد: يصمد.'],
'« Nous répétons les mêmes manipulations, poste après poste. »': ['“We redo the same steps, machine after machine.”', '„Wir wiederholen dieselben Schritte, Rechner für Rechner.“', '«Rifacciamo le stesse operazioni, postazione dopo postazione.»', '「同样的操作，一台一台重复。」', '«نكرر العمليات نفسها، جهازًا بعد جهاز.»'],
"Ce qui revient deux fois est écrit une fois : un script s'en charge chaque soir, sans omission.": ['Whatever comes up twice, I write once: a script handles it every evening, without forgetting.', 'Was zweimal vorkommt, schreibe ich einmal: ein Skript macht es jeden Abend, ohne Auslassung.', 'Ciò che torna due volte lo scrivo una volta: uno script lo fa ogni sera, senza dimenticare nulla.', '出现两次的事我只写一次：脚本每晚执行，不会漏。', 'ما يتكرر مرتين أكتبه مرة واحدة: سكربت يتولّاه كل مساء دون نسيان.'],
'Vos équipes retrouvent du temps pour l\'essentiel.': ['Your team gets its days back for real work.', 'Ihr Team gewinnt seine Tage für echte Arbeit zurück.', 'Il vostro team recupera le giornate per il lavoro vero.', '团队把时间拿回来做真正的工作。', 'يستعيد فريقكم وقته للعمل الحقيقي.'],
'Avant : à la main. Après : automatique.': ['Before: by hand. After: automatic.', 'Vorher: manuell. Nachher: automatisch.', 'Prima: a mano. Dopo: automatico.', '之前：手工。之后：自动。', 'قبل: يدويًا. بعد: تلقائيًا.'],
"« Nous aimerions recourir à l'IA, sans transmettre nos dossiers à l'extérieur. »": ['“We would like to use AI, but not send our files outside.”', '„Wir würden KI gern nutzen, aber unsere Daten nicht nach draußen geben.“', '«Vorremmo usare l\'IA, ma non mandare i nostri documenti fuori.»', '「我们想用 AI，但不想把文件送出去。」', '«نريد استخدام الذكاء الاصطناعي، لكن دون إرسال ملفاتنا للخارج.»'],
"J'installe le modèle chez vous, sur votre machine. Il traite vos documents sans qu'ils quittent vos murs.": ['I install the model on your own machine. It works on your documents without them ever leaving your walls.', 'Ich installiere das Modell bei Ihnen, auf Ihrer Maschine. Es arbeitet mit Ihren Dokumenten, ohne dass diese das Haus verlassen.', 'Installo il modello da voi, sulla vostra macchina. Lavora sui vostri documenti senza che escano dalle vostre mura.', '我把模型装在你们自己的机器上，它处理文件而文件从不离开你们。', 'أُثبّت النموذج عندكم على جهازكم. يعمل على مستنداتكم دون أن تخرج من مقرّكم.'],
"Vous profitez de l'IA sans confier vos données à personne.": ['You get the benefit of AI without handing your data to anyone.', 'Sie nutzen KI, ohne Ihre Daten jemandem zu überlassen.', "Sfruttate l'IA senza affidare i dati a nessuno.", '享受 AI 的好处，数据不交给任何人。', 'تستفيدون من الذكاء الاصطناعي دون تسليم بياناتكم لأحد.'],
'Avant : dans le nuage. Après : chez vous.': ['Before: in the cloud. After: on your premises.', 'Vorher: in der Cloud. Nachher: bei Ihnen.', 'Prima: nel cloud. Dopo: da voi.', '之前：在云端。之后：在你这里。', 'قبل: في السحابة. بعد: عندكم.'],
'« Je n\'ai jamais une vision claire de la situation. »': ['“I never really know where we stand.”', '„Ich weiß nie wirklich, wo wir stehen.“', '«Non so mai davvero come stiamo.»', '「我从来不清楚我们究竟到哪一步了。」', '«لا أعرف أبدًا وضعنا الحقيقي.»'],
'Je vous livre un écran unique : ce qui est en panne, qui est bloqué, et ce qui a déjà été fait.': ['I hand you a single screen: what is down, who is blocked, and what has already been done.', 'Ich liefere Ihnen einen einzigen Bildschirm: was ausgefallen ist, wer blockiert ist, und was bereits getan wurde.', 'Vi consegno una sola schermata: cosa è guasto, chi è bloccato e cosa è già stato fatto.', '我交给你一块屏：什么坏了、谁被卡住、已经做了什么。', 'أُسلّمكم شاشة واحدة: ما المتعطل، ومن المتوقف، وما تم إنجازه.'],
'Vous décidez en quelques secondes, sans réunion.': ['You decide in thirty seconds, without a meeting.', 'Sie entscheiden in dreißig Sekunden, ohne Besprechung.', 'Decidete in trenta secondi, senza riunioni.', '三十秒决策，不用开会。', 'تقررون في ثلاثين ثانية، بلا اجتماع.'],
'Avant : dix écrans. Après : un seul.': ['Before: ten screens. After: one.', 'Vorher: zehn Bildschirme. Nachher: einer.', 'Prima: dieci schermate. Dopo: una.', '之前：十块屏。之后：一块。', 'قبل: عشر شاشات. بعد: واحدة.'],

/* ---- projets ---- */
'Ce qui existe vraiment, ce qui tourne en production, et ce que j\'assemble en ce moment.':
 ['What actually exists, what runs in production, and what I am assembling right now.',
  'Was wirklich existiert, was produktiv läuft und was ich gerade baue.',
  'Ciò che esiste davvero, ciò che è in produzione e ciò che sto assemblando ora.',
  '真实存在的、正在生产环境运行的，以及我此刻正在组装的。', 'ما هو قائم فعلًا، وما يعمل في الإنتاج، وما أبنيه الآن.'],
'En production': ['In production', 'Im Produktivbetrieb', 'In produzione', '生产环境', 'في الإنتاج'],
'En assemblage': ['In progress', 'Im Aufbau', 'In costruzione', '构建中', 'قيد البناء'],
'Sans outil': ['Without a tool', 'Ohne Werkzeug', 'Senza strumenti', '没有工具时', 'بلا أدوات'],
'6 personnes': ['6 people', '6 Personen', '6 persone', '6 个人', '6 أشخاص'],
'Avec Leonhard': ['With Leonhard', 'Mit Leonhard', 'Con Leonhard', '有了 Leonhard', 'مع Leonhard'],
'1 personne': ['1 person', '1 Person', '1 persona', '1 个人', 'شخص واحد'],
'Ce matin : 41 alertes': ['This morning: 41 alerts', 'Heute Morgen: 41 Meldungen', 'Stamattina: 41 allarmi', '今早：41 条告警', 'هذا الصباح: 41 تنبيهًا'],
'3 choses à faire': ['3 things to do', '3 Dinge zu tun', '3 cose da fare', '3 件要做的事', '3 مهام'],
'Emplacement': ['Location', 'Standort', 'Posizione', '位置', 'الموقع'],
'Alimentation': ['Power feed', 'Stromversorgung', 'Alimentazione', '供电', 'التغذية الكهربائية'],
'Câblage': ['Cabling', 'Verkabelung', 'Cablaggio', '布线', 'التوصيلات'],
'Licence': ['Licence', 'Lizenz', 'Licenza', '许可', 'الترخيص'],
'Dépend de lui': ['Depends on it', 'Hängt davon ab', 'Ne dipende', '依赖它的', 'يعتمد عليه'],
'Dernière visite': ['Last service', 'Letzter Einsatz', 'Ultimo intervento', '上次维护', 'آخر صيانة'],
'Incident ouvert': ['Open incident', 'Offener Vorfall', 'Incidente aperto', '未结事件', 'حادثة مفتوحة'],

/* ---- méthode & parcours ---- */
'Ma façon de construire': ['How I build', 'Wie ich baue', 'Come costruisco', '我的构建方式', 'طريقتي في البناء'],
'Le plan avant les outils': ['The map before the tools', 'Der Plan vor den Werkzeugen', 'La mappa prima degli strumenti', '先有图，再有工具', 'المخطط قبل الأدوات'],
'Un système qui se transmet': ['A system that can be handed over', 'Ein System, das übergeben werden kann', 'Un sistema che si trasmette', '能交接的系统', 'نظام قابل للتسليم'],
'Machines et humains dans le même schéma': ['Machines and people in one diagram', 'Maschinen und Menschen in einem Plan', 'Macchine e persone nello stesso schema', '机器与人同在一张图上', 'الآلات والبشر في مخطط واحد'],
"L\'IA est une ressource, pas une magie": ['AI is a resource, not magic', 'KI ist eine Ressource, keine Magie', "L'IA è una risorsa, non magia", 'AI 是资源，不是魔法', 'الذكاء الاصطناعي مورد، لا سحر'],
'Parcours': ['Track record', 'Werdegang', 'Percorso', '经历', 'المسار'],

/* ---- contact & pied ---- */
"Parlons de ce qu'il peut faire chez vous.": ['Let us talk about what it can do for you.', 'Sprechen wir darüber, was das bei Ihnen bewirkt.', 'Parliamo di cosa può fare da voi.', '聊聊它在你这里能做什么。', 'لنتحدث عمّا يمكن أن يفعله عندكم.'],
'ÉCRIVEZ-MOI': ['EMAIL ME', 'SCHREIBEN SIE MIR', 'SCRIVIMI', '给我写信', 'راسلني'],
'WHATSAPP': ['WHATSAPP', 'WHATSAPP', 'WHATSAPP', 'WHATSAPP', 'واتساب'],
'Heure locale': ['Local time', 'Ortszeit', 'Ora locale', '当地时间', 'التوقيت المحلي'],
'Suisse romande · Arc jurassien': ['French-speaking Switzerland · Jura Arc', 'Westschweiz · Jurabogen', 'Svizzera romanda · Arco giurassiano', '瑞士法语区 · 汝拉弧', 'سويسرا الرومانية · قوس الجورا'],
'Disponible immédiatement': ['Available immediately', 'Sofort verfügbar', 'Disponibile subito', '即刻可接洽', 'متاح فورًا'],
'Anas Dine — systèmes, réseaux & IA locale': ['Anas Dine — systems, networks & on-premise AI', 'Anas Dine — Systeme, Netzwerke & lokale KI', 'Anas Dine — sistemi, reti e IA locale', 'Anas Dine —— 系统、网络与本地 AI', 'أنس دين — أنظمة وشبكات وذكاء اصطناعي محلي'],

/* ---- jeux ---- */
'Merci d\'avoir pris le temps de lire.': ['Thank you for taking the time to read.', 'Danke, dass Sie sich die Zeit genommen haben.', 'Grazie per aver dedicato del tempo.', '感谢你读到这里。', 'شكرًا لوقتك في القراءة.'],
'NOUVELLE BAIE': ['NEW RACK', 'NEUER SCHRANK', 'NUOVO RACK', '新机柜', 'خزانة جديدة'],
'NOUVELLE CIBLE': ['NEW TARGET', 'NEUES ZIEL', 'NUOVO OBIETTIVO', '新目标', 'هدف جديد'],
'NOUVEAU JEU': ['NEW GAME', 'NEUES SPIEL', 'NUOVA PARTITA', '新一局', 'لعبة جديدة'],
'DÉCOLLER': ['LAUNCH', 'STARTEN', 'DECOLLARE', '起飞', 'انطلاق'],
'ENTRER': ['ENTER', 'BETRETEN', 'ENTRA', '进入', 'ادخل'],
'REPARTIR DE ZÉRO': ['START OVER', 'NEU BEGINNEN', 'RICOMINCIA', '重新开始', 'ابدأ من جديد'],
'Monter la baie': ['Rack it up', 'Schrank bestücken', 'Montare il rack', '装机柜', 'تجهيز الخزانة'],
'Intrusion': ['Intrusion', 'Eindringen', 'Intrusione', '入侵', 'اختراق'],
'La salle machine': ['The server room', 'Der Serverraum', 'La sala macchine', '机房', 'غرفة الخواديم'],
'Élevez votre modèle': ['Raise your model', 'Zieh dein Modell groß', 'Alleva il tuo modello', '养一个模型', 'اربِّ نموذجك'],
'DONNÉES +': ['DATA +', 'DATEN +', 'DATI +', '数据 +', 'بيانات +'],
'REFROIDIR': ['COOL DOWN', 'KÜHLEN', 'RAFFREDDA', '降温', 'تبريد'],
'ALIGNER': ['ALIGN', 'AUSRICHTEN', 'ALLINEA', '对齐', 'محاذاة'],
'ENTRAÎNER': ['TRAIN', 'TRAINIEREN', 'ADDESTRA', '训练', 'تدريب']
};

var idx = {}, lang = 'fr';

/* ---- japonais : table dédiée, repli anglais pour le reste ---- */
var JA = {
'MANIFESTE':'理念','PILE':'私の仕事','SEC 02':'第 02 節',
'CE QUE JE PEUX FAIRE CHEZ VOUS':'御社で何ができるか',
'Quatre problèmes, dans l\'ordre où on les rencontre':'四つの課題、直面する順に',
'CE QUE JE FAIS':'私の仕事','PROJETS':'プロジェクト','PARCOURS':'経歴','JEUX':'ゲーム','CONTACT':'お問い合わせ',
'MOUVEMENT — COMPLET':'動き — フル','MOUVEMENT — CALME':'動き — 静か','MOUVEMENT — FIGÉ':'動き — オフ',
'SON — OFF':'音 — オフ','SON — ON':'音 — オン','Heure locale':'現地時間',
'Suisse romande · Arc jurassien':'スイス・フランス語圏 · ジュラ地方',
'Disponible immédiatement':'即日対応可能',
'Anas Dine — systèmes, réseaux & IA locale':'アナス・ディーヌ — システム・ネットワーク・ローカル AI',
'Administrateur systèmes & réseaux':'システム・ネットワーク管理者',
'automatisation':'自動化','IA locale':'ローカル AI',
'Systèmes & réseaux':'システムとネットワーク',
'Un parc qui se pilote':'制御できる IT 資産',
'le socle':'土台','la force':'力','le résultat':'成果','ce que je suis':'私の立ち位置',
'Je fais le pont':'私は橋渡しをする',
'huit ans dans des parcs réels':'実運用の現場で八年',
'modèles chez soi, données anonymisées':'モデルは自社内、データは匿名化',
'les alertes se trient et se traitent seules':'アラートは自動で選別され処理される',
'Expérience':'実務経験','ans':'年',
'Aucune technologie n\'est bonne ou mauvaise : tout dépend des mains qui la tiennent.':'技術それ自体に善悪はない。すべては、それを扱う手にかかっている。',
'Parlons de ce qu\'il peut faire chez vous.':'御社で何ができるか、話しましょう。',
'ÉCRIVEZ-MOI':'メールを送る',
'Permis B → 2029':'運転免許 B → 2029 年',
'Faire tenir votre matériel':'機器を安定させる',
'Automatiser les tâches répétitives':'反復作業を自動化する',
'Intégrer l\'IA sans sortir vos données':'データを外に出さずに AI を導入する',
'Savoir où vous en êtes':'現状を可視化する',
'Triage SOC':'SOC トリアージ','Pare-feu':'ファイアウォール',
'Monter la baie':'ラックを組む','Sonde AD·2026':'探査機 AD·2026',
'La salle machine':'サーバールーム','Élevez votre modèle':'モデルを育てる',
'Baie A · 24 U — une salle parmi d\'autres':'ラック A · 24 U — 数あるサーバールームの一つ',
'Salle sous contrôle':'管理下のサーバールーム',
'Allée froide':'コールドアイル','Allée chaude':'ホットアイル','Delta T':'温度差',
'Charge baie':'ラック負荷','Onduleur':'UPS','U libres':'空き U','Humidité':'湿度',
'Conseil d\'optimisation':'最適化の提案','Ce qui est tenu':'守られていること',
'LE PARC ÉCOUTÉ':'監視対象','Vue multi-sites':'複数拠点ビュー',
'Puis on prend de la hauteur':'そして視点を上げる',
'Monter dans la baie':'ラックを上へ','Descendre dans la baie':'ラックを下へ',
'Tourner à gauche':'左に回す','Tourner à droite':'右に回す','Vue de face':'正面ビュー',
'Approcher':'近づく','Reculer':'遠ざける',
'Adresse':'アドレス','Emplacement':'設置位置','Matériel':'ハードウェア',
'Alimentation':'電源','Câblage':'配線','Licence':'ライセンス',
'Dépend de lui':'依存している範囲','Dernière visite':'最終点検','Incident ouvert':'未解決の障害'
};

L.forEach(function(c, i){ idx[c] = i; });

function detect(){
  var st = null;
  try{ st = localStorage.getItem('ad2026.lang'); }catch(e){}
  if(st && idx[st] !== undefined) return st;
  var n = (navigator.languages && navigator.languages[0]) || navigator.language || 'fr';
  n = n.toLowerCase();
  if(n.indexOf('ar') === 0) return 'ar';
  if(n.indexOf('ja') === 0) return 'ja';
  if(n.indexOf('zh') === 0) return 'zh';
  if(n.indexOf('de') === 0) return 'de';
  if(n.indexOf('it') === 0) return 'it';
  if(n.indexOf('fr') === 0) return 'fr';
  return 'en';
}
function t(fr){
  if(fr == null) return fr;   /* rien à traduire : on ne lève pas plus bas */
  if(lang === 'fr') return fr;
  if(lang === 'ja'){
    if(JA[fr]) return JA[fr];
    /* la table principale a une colonne japonaise : on la lit avant de
       confier la phrase au modèle — c'est là que se trouvent les termes
       du métier et les noms de lieux, corrects */
    var rj = T[fr];
    var vj = rj ? rj[idx.ja - 1] : null;
    if(vj) return vj;
    return fr;   /* pas de repli anglais : la traduction automatique prendra */
  }
  var row = T[fr];
  if(!row) return fr;
  return row[idx[lang] - 1] || fr;
}
var KEYS = Object.keys(T).sort(function(x, y){ return y.length - x.length; });
var NODES = null;

/* éléments à traduire : ceux dont le texte contient au moins une clé et qui
   ne contiennent pas d'autre élément traduisible plus fin */
function collect(){
  NODES = [];
  var all = document.body.querySelectorAll('*');
  for(var i = 0; i < all.length; i++){
    var el = all[i];
    if(el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'CANVAS' || el.tagName === 'SVG') continue;
    if(el.closest('svg')) continue;
    /* texte en cours d'animation : on ne l'inscrit pas, on prendrait le
       brouillage pour l'original */
    if(el.closest('[data-i18n-skip]')) continue;
    var txt = (el.textContent || '').trim();
    if(!txt || txt.length > 900) continue;
    /* on ne garde que les éléments sans enfant déjà retenu */
    var deeper = false;
    for(var k = 0; k < el.children.length; k++){
      var ct = (el.children[k].textContent || '').trim();
      if(ct && hasKey(ct)){ deeper = true; break; }
    }
    /* déjà inscrit par nœud lors d'un passage précédent : il le reste */
    if(!deeper){
      for(var q = 0; q < el.attributes.length; q++){
        if(el.attributes[q].name.indexOf('data-i18n-fr-') === 0){ deeper = true; break; }
      }
    }
    /* un texte direct à côté d'un élément enfant : voie mixte obligatoire,
       sinon le texte est jugé sur l'ensemble et l'enfant déjà traduit le
       fait passer pour traduit lui aussi */
    if(!deeper){
      var own2 = 0;
      for(var d = 0; d < el.childNodes.length; d++){
        var dn = el.childNodes[d];
        if(dn.nodeType === 3 && dn.nodeValue && dn.nodeValue.trim().length > 1) own2++;
      }
      if(own2 > 1 || (own2 >= 1 && el.children.length >= 1)) deeper = true;
    }
    if(deeper){
      /* parent mixte : on ne touche qu'à ses nœuds de texte directs */
      var own = [];
      for(var n = 0; n < el.childNodes.length; n++){
        var nd = el.childNodes[n];
        if(nd.nodeType !== 3) continue;
        var v = nd.nodeValue;
        var stamp = 'data-i18n-fr-' + n;
        var kn = el.getAttribute(stamp);
        if(kn !== null && kn.trim()){
          if(lang === 'fr' && v && v !== kn){ kn = v; el.setAttribute(stamp, v); }
          nd.__fr = kn; own.push(nd); continue;
        }
        if(kn !== null) el.removeAttribute(stamp);
        if(nd.__fr !== undefined){ el.setAttribute(stamp, nd.__fr); own.push(nd); continue; }
        if(!v || !v.trim()) continue;
        if(!(T[v] || hasKey(v.trim())) && !(lang !== 'fr' && looksFr(v))) continue;
        nd.__fr = v;
        el.setAttribute(stamp, v);
        own.push(nd);
      }
      if(own.length) NODES.push({ mixed: own });
      continue;
    }
    /* source d'origine : on la lit depuis l'attribut si un passage précédent
       a déjà traduit l'élément, sinon on l'y inscrit. */
    var kept = el.getAttribute('data-i18n-fr');
    if(kept !== null && kept.trim()){
      /* en français, ce qui est affiché fait foi : l'empreinte se remet à jour.
         Sauf si l'affichage porte encore une écriture étrangère — on graverait
         alors du japonais ou de l'arabe comme « original français ». */
      if(lang === 'fr' && txt && txt !== kept && !el.__flat &&
         !/[\u0600-\u06ff\u3040-\u30ff\u4e00-\u9fff]/.test(txt)){
        kept = txt;
        el.setAttribute('data-i18n-fr', txt);
      }
      el.__fr = kept; NODES.push(el); continue;
    }
    if(kept !== null) el.removeAttribute('data-i18n-fr');   /* empreinte vide */
    if(!hasKey(txt) && !(lang !== 'fr' && looksFr(txt))) continue;
    /* hors français, on n'inscrit une empreinte que si le texte ressemble
       encore à du français : sinon on graverait la langue précédente comme
       source, et la phrase serait perdue pour toutes les suivantes */
    if(lang !== 'fr' && (inTarget(txt) || !looksFr(txt))) continue;
    el.__fr = txt;
    el.setAttribute('data-i18n-fr', txt);
    NODES.push(el);
  }
}
/* écritures non latines : si le texte est déjà dans l'écriture visée,
   il est traduit — on n'y retouche pas */
var SCRIPTS = {
  ja: /[\u3040-\u30ff\u4e00-\u9fff]/,
  zh: /[\u4e00-\u9fff]/,
  ar: /[\u0600-\u06ff]/
};
function inTarget(x){
  var re = SCRIPTS[lang];
  return re ? re.test(x) : false;
}
/* le texte ressemble-t-il à du français ? accents, ou mots courants */
var FRW = /(^|[^A-Za-zÀ-ÿ])(le|la|les|des|une|un|vous|pour|avec|dans|sur|est|sont|qui|que|plus|tout|toute|ce|cette|mes|ses|leur|par|sans|chez|d'|l'|j'|n'|s'|qu')([^A-Za-zÀ-ÿ]|$)/i;
/* noms propres, marques, sigles et références matérielles : ils traversent
   la traduction sans être touchés */
var NOTR = /^(?:ad|anas|dine|anas dine|ad-?20\d\d|leonhard|leap ?57|calibre|etik|linkedin|whatsapp|github|ollama|python|veeam|nvidia|rtx ?\d+|raspberry ?pi|pcie|sfp|iscsi|lto-?\d+|bts|ciel|vae|rgpd|lpd|soc|rmm|ia|api|ups|san|raid|dns|dhcp|vpn|ssd|nas|kpi|svg|html|css|sys\.ad|inc-?\d+|u\d+|\d+\s*(?:u|to|go|mo|ko|w|v|a|hz|ms|s|min|h|j|%|°c|gb\/s|g)?)$/i;
/* et les segments qui ne sont qu'un nom propre entouré de ponctuation */
function isProper(x){
  var v = String(x || '').trim().replace(/^[·—–\-:.,\s]+|[·—–\-:.,\s]+$/g, '');
  if(!v) return true;
  return NOTR.test(v);
}
function looksFr(x){
  if(!x) return false;
  var v = String(x).trim();
  if(v.length < 3 || v.length > 900) return false;
  if(isProper(v)) return false;              /* nom propre, sigle ou nombre */
  if(inTarget(v)) return false;              /* déjà dans l'écriture cible */
  if(!/[A-Za-zÀ-ÿ]/.test(v)) return false;   /* chiffres et signes seuls */
  /* langue cible à écriture propre : tout ce qui reste en lettres latines
     est encore à traduire, accents ou pas */
  if(SCRIPTS[lang]) return true;
  return /[àâçéèêëîïôöùûüœÀÂÇÉÈÊËÎÏÔÙÛŒ]/.test(v) || FRW.test(v);
}
var WORD = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/;
function isWord(src, i, k){
  var b = src.charAt(i - 1), a = src.charAt(i + k.length);
  return !(WORD.test(b) || WORD.test(a));
}
function found(src, k){
  var i = src.indexOf(k);
  while(i >= 0){
    if(k.length > 6 || isWord(src, i, k)) return true;
    i = src.indexOf(k, i + 1);
  }
  return false;
}
function hasKey(txt){
  if(T[txt]) return true;
  for(var i = 0; i < KEYS.length; i++) if(found(txt, KEYS[i])) return true;
  return false;
}
function render(src){
  if(T[src]){
    var direct = t(src);
    /* la table a répondu : on la suit. Sinon on continue vers la
       traduction automatique au lieu de rendre le français. */
    if(direct !== src) return direct;
  }
  var out = src;
  var hadKey = false;
  var covered = 0;   /* caractères réellement remplacés */
  for(var i = 0; i < KEYS.length; i++){
    var k = KEYS[i];
    if(!found(out, k)) continue;
    hadKey = true;
    if(k.length > 6){
      /* seulement si le fragment couvre l'essentiel de la chaîne hôte,
         sinon la phrase devient mi-française mi-traduite */
      if(k.length < out.length * .8) continue;
      var tk = t(k);
      if(tk !== k){ covered += k.length; out = out.split(k).join(tk); }
      continue;
    }
    /* clé courte : on ne remplace qu'en mot entier */
    var res = '', j = 0;
    while(true){
      var p = out.indexOf(k, j);
      if(p < 0){ res += out.slice(j); break; }
      if(isWord(out, p, k)){
        var tk2 = t(k);
        res += out.slice(j, p) + tk2;
        if(tk2 !== k) covered += k.length;
      }
      else { res += out.slice(j, p + k.length); }
      j = p + k.length;
    }
    out = res;
  }
  /* Un remplacement partiel donne une phrase moitié française moitié
     traduite : on préfère la confier entière à la traduction automatique.
     On ne garde la substitution que si elle couvre l'essentiel. */
  var enough = src.length ? (covered / src.length) >= .7 : false;
  if((out === src || !enough) && lang !== 'fr' && looksFr(src)) return tAuto(src);
  return out;
}
/* structure préservée : un nœud dont le parent porte plusieurs enfants
   éléments n'est jamais remplacé par un bloc — c'est ce qui cassait la mise
   en page hors français. */
function safeNode(n){
  if(!n || n.nodeType !== 3) return false;
  var p = n.parentNode;
  if(!p) return false;
  var tag = (p.tagName || '').toLowerCase();
  if(tag === 'script' || tag === 'style') return false;
  return true;
}
function nodeVisible(el){
  var e = el.mixed ? (el.mixed[0] && el.mixed[0].parentNode) : el;
  if(!e || !e.getBoundingClientRect) return false;
  var r = e.getBoundingClientRect();
  return r.bottom > -200 && r.top < (window.innerHeight || 800) + 200;
}
function apply(list){
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL[lang] ? 'rtl' : 'ltr';
  if(!NODES) collect();
  /* la liste travaillée est passée en argument : on ne touche plus à NODES.
     C'est cette réaffectation qui perdait la page entière quand une bascule
     tombait au milieu d'une tranche. */
  var arr = list || NODES;
  /* deux passes : l'écran d'abord, le reste juste après — la bascule
     paraît immédiate au lieu d'attendre des centaines de réécritures */
  var near = [], far = [];
  for(var v = 0; v < arr.length; v++){
    (nodeVisible(arr[v]) ? near : far).push(arr[v]);
  }
  if(far.length && !apply.__deferred){
    apply.__deferred = 1;
    var lgPass = lang;
    apply(near);
    /* le reste par tranches de 40 nœuds : aucune image ne dépasse son budget */
    var pos = 0;
    var slice = function(){
      /* la langue a changé : cette passe ne vaut plus rien, la suivante
         reprendra tout depuis le début */
      if(lgPass !== lang){ apply.__deferred = 0; return; }
      var lot = far.slice(pos, pos + 40);
      pos += 40;
      if(lot.length) apply(lot);
      if(pos < far.length) requestAnimationFrame(slice);
      else{
        apply.__deferred = 0;
        if(window.CalibreEngine && window.CalibreEngine.onLang) window.CalibreEngine.onLang(lang);
      }
    };
    requestAnimationFrame(slice);
    return;
  }
  for(var i = 0; i < arr.length; i++){
    var el = arr[i];
    if(el.mixed){
      for(var mi = 0; mi < el.mixed.length; mi++){
        var nd2 = el.mixed[mi];
        if(!nd2.parentNode) continue;
        var s0 = nd2.__fr;
        if(s0 == null) continue;   /* pas d'empreinte : rien à reposer */
        var o0 = render(s0);
        if(o0 !== s0){ nd2.nodeValue = o0; continue; }
        /* la phrase entière n'a rien donné : on tente le noyau sans les
           espaces et la ponctuation de bord */
        var k0 = s0.trim();
        if(k0 && k0 !== s0){
          var ok = render(k0);
          if(ok !== k0){ nd2.nodeValue = s0.replace(k0, ok); continue; }
        }
        nd2.nodeValue = s0;
      }
      continue;
    }
    if(!el.isConnected) continue;
    var src = el.__fr;
    var out = render(src);
    /* On repose toujours le résultat, même quand aucune traduction n'existe :
       sans cela le texte de la langue quittée restait en place et la page
       devenait bilingue (arabe puis français, par exemple). */
    var kids = el.children ? el.children.length : 0;
    if(kids){
      var tn = null;
      for(var c = 0; c < el.childNodes.length; c++){
        var cn = el.childNodes[c];
        if(cn.nodeType === 3 && cn.nodeValue && cn.nodeValue.trim().length > 2){ tn = cn; break; }
      }
      if(tn && tn.nodeValue !== out) tn.nodeValue = out;
      else if(!tn){
        /* aucun texte direct : l'empreinte du parent est la concaténation de
           ses enfants, elle ne peut donc rien réécrire. On traduit alors
           chaque enfant qui porte sa propre empreinte — et seulement si
           cette empreinte n'est pas, elle aussi, une concaténation. */
        for(var kk = 0; kk < el.children.length; kk++){
          var ch = el.children[kk];
          var cs = ch.getAttribute && ch.getAttribute('data-i18n-fr');
          if(!cs || cs === src) continue;
          var co = render(cs);
          if(co !== cs && ch.textContent !== co) ch.textContent = co;
        }
      }
      continue;
    }
    if(el.textContent !== out){
      el.textContent = out;
      el.__flat = out !== src;
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    }
  }
  ['placeholder', 'aria-label', 'title'].forEach(function(a){
    var list = document.querySelectorAll('[' + a + ']');
    for(var j = 0; j < list.length; j++){
      var el2 = list[j], key = '__i18n_' + a;
      if(el2[key] === undefined) el2[key] = el2.getAttribute(a);
      var v = el2[key];
      /* comme pour le texte : on repose la source quand rien n'est connu,
         sinon l'infobulle reste dans la langue précédente */
      if(!v) continue;
      var vt = v.trim(), sortie = T[vt] ? t(vt) : v;
      if(el2.getAttribute(a) !== sortie) el2.setAttribute(a, sortie);
    }
  });
  if(window.CalibreEngine && window.CalibreEngine.onLang) window.CalibreEngine.onLang(lang);
}
/* --- mise en langue immédiate : avant la première peinture --- */
(function(){
  var boot = function(){
    try{
      /* la première passe est complète : pas de report, sinon on voit le français */
      apply.__deferred = 1;
      NODES = null;
      apply();
      apply.__deferred = 0;
    }catch(e){}
  };
  /* une passe immédiate sur ce qui est déjà en place, puis une seule
     reprise quand le contenu est complet : deux balayages au total */
  boot();
  var done = false;
  var late = function(){
    if(done) return;
    done = true;
    NODES = null;
    /* en marge du fil principal : le chargement ne saccade pas */
    requestAnimationFrame(function(){ requestAnimationFrame(boot); });
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', late);
  else late();
})();

var AUTO = {};
try{ AUTO = JSON.parse(localStorage.getItem('ad2026.autotr') || '{}') || {}; }catch(e){ AUTO = {}; }
/* on jette les entrées abîmées d'une version précédente : méta du modèle,
   écho de la source, ou clés en français qui n'ont rien à faire là */
try{
  if(localStorage.getItem('ad2026.autotr.v') !== '8'){
    var keep = {};
    for(var ak in AUTO){
      if(!Object.prototype.hasOwnProperty.call(AUTO, ak)) continue;
      var cut = ak.indexOf('|');
      if(cut < 1) continue;
      var kl = ak.slice(0, cut), ks = ak.slice(cut + 1), kv = AUTO[ak];
      if(kl === 'fr' || !kv || kv === ks) continue;
      if(/(translate|translation|INTO another|not understand|as an ai|i cannot)/i.test(kv)) continue;
      /* source mêlée : reste d'un découpage mot à mot, inutilisable */
      if(/[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff]/.test(ks)) continue;
      if(isProper(ks)) continue;   /* nom propre traduit à tort */
      /* la valeur doit être dans l'écriture de sa propre clé : une réponse
         japonaise rangée sous « de » repeignait la page en japonais */
      var etr = /[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff]/.test(kv);
      if(kl === 'ja' || kl === 'zh' || kl === 'ar'){ if(!etr) continue; }
      else if(etr) continue;
      keep[ak] = kv;
    }
    AUTO = keep;
    localStorage.setItem('ad2026.autotr', JSON.stringify(AUTO));
    localStorage.setItem('ad2026.autotr.v', '8');
  }
}catch(e){}
var AQ = [], abusy = 0, AMAX = 8;   /* huit demandes de front */
function akey(x, l){ return l + '|' + x; }
function saveAuto(){
  try{ localStorage.setItem('ad2026.autotr', JSON.stringify(AUTO)); }catch(e){}
}
/* rejet des réponses qui ne sont pas des traductions : méta du modèle,
   refus, ou simple écho de la source */
var META = /(translate|translation|traduis|traduction|as an ai|i cannot|je ne peux|INTO another|not understand|no puedo)/i;
function goodTr(src, val){
  if(!val || val.length < 1) return false;
  if(isProper(src)) return false;   /* on ne traduit pas les noms propres */
  if(val === src) return false;
  if(val.length > src.length * 6 + 40) return false;
  if(META.test(val) && !META.test(src)) return false;
  /* langue à écriture propre : la réponse doit en contenir */
  var re = SCRIPTS[lang];
  if(re && !re.test(val)) return false;
  /* et l'inverse : une langue à écriture latine ne peut pas recevoir du
     japonais, du chinois ni de l'arabe. C'est ce manque qui laissait entrer
     une réponse d'une autre langue dans le cache. */
  if(!re && /[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff]/.test(val)) return false;
  return true;
}
/* une seule remise en place pour toutes les salves d'un même moment :
   sans cela le fil principal passait son temps à réécrire le document */
var paintT = null, paintLast = 0;
function schedulePaint(){
  if(paintT) return;
  var since = Date.now() - paintLast;
  var wait = since > 500 ? 40 : 500 - since;
  paintT = setTimeout(function(){
    paintT = null;
    paintLast = Date.now();
    try{ apply(); }catch(e){}
    try{
      var CE = window.CalibreEngine;
      if(CE && CE.__relabel) for(var rr = 0; rr < CE.__relabel.length; rr++){
        try{ CE.__relabel[rr](); }catch(e2){}
      }
    }catch(e){}
  }, wait);
}
function pumpAuto(){
  if(abusy >= AMAX || !AQ.length) return;
  if(!(window.claude && window.claude.complete)) { AQ.length = 0; return; }
  abusy++;
  var batch = AQ.splice(0, 40);
  /* la langue au moment de la demande : si l'on bascule pendant le vol, la
     réponse ne vaut plus rien et ne doit surtout pas être écrite sous la
     nouvelle langue — c'est ainsi qu'on voyait du japonais dans une page
     allemande. */
  var lg0 = lang;
  var L = { en:'English', de:'Deutsch', it:'italiano', zh:'中文 simplifié', ar:'العربية', ja:'日本語' };
  var src = batch.map(function(b, i){ return (i + 1) + '. ' + b.txt; }).join('\n');
  window.claude.complete({
    max_tokens: 3600,
    system: 'Traduis en ' + (L[lang] || lang) + '. Rends UNIQUEMENT les traductions, une par ligne, ' +
      'préfixées du même numéro, sans commentaire. Garde les noms propres, sigles et nombres tels quels.',
    messages: [{ role: 'user', content: src }]
  }).then(function(out){
    if(lg0 !== lang){ abusy--; setTimeout(pumpAuto, 120); return; }
    var lines = String(out || '').split('\n');
    lines.forEach(function(ln){
      var m = ln.match(/^\s*(\d+)[.)]\s*(.+)$/);
      if(!m) return;
      var b = batch[parseInt(m[1], 10) - 1];
      if(!b) return;
      var val = m[2].trim();
      if(!goodTr(b.txt, val)) return;
      AUTO[akey(b.txt, lg0)] = val;
      if(b.cbs) for(var ci = 0; ci < b.cbs.length; ci++){ try{ b.cbs[ci](val); }catch(e){} }
    });
    saveAuto();
    abusy--;
    /* on repose le document avec ce qui vient d'arriver, sans reconstruire
       la liste : les originaux sont déjà inscrits sur les éléments.
       Regroupé : trois salves en vol reposaient le document trois fois. */
    schedulePaint();
    setTimeout(pumpAuto, 120);
    pumpAuto();
  }).catch(function(){ abusy--; setTimeout(pumpAuto, 600); });
}
/* rendu immédiat si connu, sinon demande en arrière-plan */
function tAuto(x, cb, urgent){
  if(x == null) return x;
  if(lang === 'fr' || !x) return x;
  /* déjà dans l'écriture visée : c'est une traduction, on la laisse */
  if(inTarget(x)) return x;
  if(isProper(x)) return x;   /* nom propre ou sigle : intouchable */
  var direct = t(x);
  if(direct !== x) return direct;
  var k = akey(x, lang);
  if(AUTO[k]) return AUTO[k];
  if(x.length > 2 && AQ.length < 400){
    var seen = null;
    for(var i = 0; i < AQ.length; i++) if(AQ[i].txt === x){ seen = AQ[i]; break; }
    if(seen){
      /* déjà en vol : on ajoute notre rappel à la liste au lieu de le perdre */
      if(typeof cb === 'function'){ (seen.cbs || (seen.cbs = [])).push(cb); }
      /* devenu urgent : il remonte en tête de file */
      if(urgent){ var pos = AQ.indexOf(seen); if(pos > 0){ AQ.splice(pos, 1); AQ.unshift(seen); } }
    }else{
      var item = { txt: x, cbs: typeof cb === 'function' ? [cb] : [] };
      if(urgent) AQ.unshift(item); else AQ.push(item);
      /* on regroupe les demandes d'une même salve avant de partir */
      if(!tAuto.__t) tAuto.__t = setTimeout(function(){
        tAuto.__t = null;
        for(var p = 0; p < AMAX; p++) pumpAuto();
      }, 30);
    }
  }
  return x;
}

window.I18N = {
  tAuto: tAuto,
  langs: L, names: NAMES,
  get: function(){ return lang; },
  t: t,
  set: function(c){
    if(idx[c] === undefined) return;
    lang = c;
    try{ localStorage.setItem('ad2026.lang', c); }catch(e){}
    /* la langue de la voix bascule tout de suite : elle n'attend pas le texte */
    document.documentElement.lang = c;
    if(window.CalibreEngine && window.CalibreEngine.onLang) window.CalibreEngine.onLang(c);
    /* le registre est reconstruit à chaque bascule : une entrée devenue
       caduque (nœud de texte réécrit dans la langue précédente, donc sans
       empreinte) n'était plus jamais réparée et gardait l'ancienne langue. */
    NODES = null;
    apply();
  },
  apply: apply,
  /* diagnostic : suivre une phrase le long de la chaîne */
  trace: function(x){
    return {
      dansTable: !!T[x],
      cleTrouvee: hasKey(x),
      ressembleFr: looksFr(x),
      dansEcritureCible: inTarget(x),
      rendu: render(x),
      auto: tAuto(x),
      enFile: AQ.length,
      cache: AUTO[akey(x, lang)] || null,
      idxJa: idx.ja,
      ligne: T[x] || null,
      colonneJa: T[x] ? T[x][idx.ja - 1] : null,
      dansJA: JA[x] || null,
      viaT: t(x)
    };
  },
  nodes: function(){
    if(!NODES) return -1;
    var m = 0;
    for(var i = 0; i < NODES.length; i++) if(NODES[i].mixed) m++;
    return { total: NODES.length, mixtes: m };
  },
  rescan: function(){ NODES = null; apply(); },
  resync: function(){ NODES = null; apply(); },
  /* démarrage : on attend une accalmie avant de parcourir tout le document */
  init: function(){ lang = detect(); if(lang !== 'fr') apply(); else { document.documentElement.lang = 'fr'; if(window.CalibreEngine && window.CalibreEngine.onLang) window.CalibreEngine.onLang('fr'); } }
};
})();
