/* ════════════════════════════════════════════
   ГОД БЕЛОРУССКОЙ ЖЕНЩИНЫ — script.js
   ════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   STATE
───────────────────────────────────── */
let G = {
  score: 0,
  quizBest:  { famous: 0, history: 0, modern: 0 },
  quizDone:  { famous: false, history: false, modern: false },
  puzzleDone: [],
  riddleDone: [],
  currentQuizType: null,
  currentQuizSet:  [],
  quizIdx:  0,
  quizPts:  0,
  riddleIdx: 0,
  puzzleIdx: 0,
  timerVal: 30,
};

function save() { try { localStorage.setItem('byw25', JSON.stringify(G)); } catch(e){} }
function load() {
  try {
    const d = localStorage.getItem('byw25');
    if (d) Object.assign(G, JSON.parse(d));
  } catch(e) {}
}

/* ─────────────────────────────────────
   QUIZ DATA
───────────────────────────────────── */
const QUIZZES = {
  famous: {
    label: 'Известные женщины Беларуси',
    questions: [
      { q: 'Кто из знаменитых женщин Беларуси считается первой восточнославянской просветительницей и была канонизирована в лике святых?',
        opts: ['София Гольшанская','Евфросиния Полоцкая','Констанция Буйло','Анастасия Слуцкая'], ans: 1,
        fact: 'Евфросиния Полоцкая — преподобная, инокиня и просветительница периода Полоцкого княжества.' },
      { q: 'Белорусская биатлонистка, завоевавшая три золотые медали на Олимпиаде в Сочи в 2014 году?',
        opts: ['Анастасия Кузьмина','Тора Бергер','Дарья Домрачева','Магдалена Нойнер'], ans: 2,
        fact: 'Дарья Домрачева — трёхкратная олимпийская чемпионка Сочи-2014, одна из величайших биатлонисток в истории.' },
      { q: 'Кто из белорусских певиц победил на Детском Евровидении в 2005 году?',
        opts: ['Полина Богусевич','Зена','Ксения Ситник','Валентина Ткаченко'], ans: 2,
        fact: 'Ксения Ситник победила в Киеве с песней «Мы вместе» — первая белорусская победительница Детского Евровидения.' },
      { q: 'Кто была первой белорусской женщиной-космонавтом, побывавшей на МКС?',
        opts: ['Елена Серова','Ольга Савицкая','Марина Василевская','Валентина Терешкова'], ans: 2,
        fact: 'Марина Василевская совершила полёт на МКС в 2024 году, войдя в историю как первый космонавт от Беларуси.' },
      { q: 'Белорусская партизанка и Герой Советского Союза (посмертно), подпольщица оккупированного Витебска?',
        opts: ['Мария Осипова','Вера Хоружая','Зоя Космодемьянская','Надежда Попова'], ans: 1,
        fact: 'Вера Хоружая погибла в ноябре 1942 года. Её именем названы улицы в Минске и Витебске.' },
      { q: 'Белорусская поэтесса, известная под псевдонимом Тётка, одна из основательниц новой белорусской литературы?',
        opts: ['Констанция Буйло','Алоиза Пашкевич','Ядвига Лусина','Лариса Гениюш'], ans: 1,
        fact: 'Алоиза Пашкевич (Тётка) — символ белорусского национального возрождения начала XX века.' },
      { q: 'Какая белорусская гимнастка стала олимпийской чемпионкой в Сеуле в 1988 году?',
        opts: ['Каролина Севастьянова','Маргарита Мамун','Ирина Лобач','Алина Кабаева'], ans: 2,
        fact: 'Ирина Лобач завоевала золото в художественной гимнастике на Олимпиаде в Сеуле-1988.' },
      { q: 'Кто возглавлял Национальный банк Беларуси с 2011 по 2014 год — первая женщина на этом посту?',
        opts: ['Наталья Кочанова','Надежда Ермакова','Мария Колесникова','Лилия Ананич'], ans: 1,
        fact: 'Надежда Ермакова — первая женщина на посту председателя Национального банка Беларуси.' },
      { q: 'В каком году родилась белорусская художница Леонарда Лозинская, работы которой хранятся в Национальном художественном музее?',
        opts: ['1891','1905','1910','1922'], ans: 0,
        fact: 'Леонарда Лозинская (1891–1974) — выдающийся белорусский живописец, автор жанровых и исторических полотен.' },
      { q: 'Как называется книга Светланы Алексиевич о голосах ликвидаторов и жертв Чернобыльской катастрофы?',
        opts: ['Цинковые мальчики','У войны не женское лицо','Чернобыльская молитва','Время секонд хэнд'], ans: 2,
        fact: '«Чернобыльская молитва» (1997) — документальная хроника, составленная из монологов очевидцев трагедии.' },
    ]
  },
  history: {
    label: 'История и культура Беларуси',
    questions: [
      { q: 'Как называется ритуальное белорусское полотенце с национальным орнаментом?',
        opts: ['Скатерть','Рушнік','Фартух','Намитка'], ans: 1,
        fact: 'Рушнік — один из главных символов белорусской культуры, использовался во всех важных обрядах.' },
      { q: 'Какой город является родиной Марка Шагала — знаменитого художника?',
        opts: ['Минск','Гродно','Витебск','Брест'], ans: 2,
        fact: 'Марк Шагал родился в Витебске в 1887 году. В городе открыт Музей Марка Шагала.' },
      { q: 'В каком году Беларусь провозгласила государственный суверенитет?',
        opts: ['1989','1990','1918','1993'], ans: 2,
        fact: 'Беларусь объявила независимость 25 марта 1918 года.' },
      { q: 'Кто из уроженок белорусских земель стала первой в истории женщиной-врачом и написала мемуары о своих путешествиях и лечебной практике в XVIII веке?',
        opts: ['Алоиза Пашкевич','Эмилия Плятер','Саломея Регина Русецкая','Елена Белова'], ans: 2,
        fact: 'Саломея Регина Русецкая — стала первой в истории женщиной-врачом.' },
      { q: 'Как называется традиционный белорусский женский народный танец?',
        opts: ['Гопак','Трепак','Лявониха','Казачок'], ans: 2,
        fact: 'Лявониха — зажигательный белорусский танец, исполняемый парами под одноимённую мелодию.' },
      { q: 'Какое дерево является неофициальным символом Беларуси?',
        opts: ['Дуб','Клён','Ель','Сосна'], ans: 3,
        fact: 'Сосна — Это вечнозелёное дерево символизирует бессмертие, жизненную силу, стойкость, достоинство и добродетель.' },
      { q: 'Как называется традиционная белорусская юбка в полоску?',
        opts: ['Сарафан','Понёва','Андарак','Душегрейка'], ans: 2,
        fact: 'Андарак — элемент традиционного белорусского женского костюма, шился из домотканого полосатого сукна.' },
      { q: 'Как назывался традиционный белорусский женский головной убор в виде длинного полотна (до 3-4 метров), который девушка впервые надевала на свадьбе в знак перехода в статус замужней женщины?',
        opts: ['Намитка','Кокошник','Кичка','Сорока'], ans: 0,
        fact: 'Намитка — длинное белое льняное покрывало, которым повязывали голову замужние белорусские женщины.' },
      { q: 'В каком историческом документе XVI века в Беларуси были прописаны уникальные для того времени права женщин?',
        opts: ['Статуты ВКЛ','Магдебургское право','Привилей Казимира','Конституция 3 мая'], ans: 0,
        fact: 'Статуты Великого княжества Литовского стали основополагающими документами, закрепившими права женщин' },
      { q: 'Какое растение, которое исторически называли «северным шёлком», белорусские женщины обрабатывали вручную, превращая его в полотно для рушников и одежды?',
        opts: ['Хлопок','Лён','Конопля','Джут'], ans: 1,
        fact: 'Лён —  род травянистых растений семейства Льновые' },
    ]
  },
  modern: {
    label: 'Современная Беларусь',
    questions: [
      { q: 'Каким годом в Беларуси объявлен «Год белорусской женщины»?',
        opts: ['2023','2024','2026','2025'], ans: 2,
        fact: '2026 год официально объявлен в Беларуси Годом белорусской женщины.' },
      { q: 'Эта белорусская теннисистка в 2023–2024 годах неоднократно становилась первой ракеткой мира:',
        opts: ['Виктория Азаренко','Александра Саснович','Арина Соболенко','Ольга Говорцова'], ans: 2,
        fact: 'Арина — одна из самых сильных теннисисток современности.' },
      { q: 'Как называется ежегодный республиканский конкурс, который проводит «Белорусский союз женщин»?',
        opts: ['«Мисс Беларусь»','«Женщина года»','«Леди Успех»','«Белорусская берегиня»'], ans: 1,
        fact: 'Этот конкурс отмечает женщин в самых разных номинациях: от «Материнской славы» до «Хозяйки села» и «Успешного руководителя».' },
      { q: 'На каком международном конкурсе Беларусь одержала первую победу в 2021 году в детском вокале?',
        opts: ['Евровидение','Junior Eurovision','Voice Kids','Новая волна'], ans: 1,
        fact: 'Беларусь неоднократно выступала на Детском Евровидении. Первая победа — Ксения Ситник в 2005 году.' },
      { q: 'Эта современная белорусская певица представляла страну на «Евровидении» и является заслуженной артисткой Республики Беларусь:',
        opts: ['Ксения Лартюк','Анна Шаркунова','Алёна Ланская','Гюнешь Абасова'], ans: 2,
        fact: 'Алёна Ланская — двукратная победительница «Славянского базара» и активный участник культурной жизни страны.' },
      { q: 'Кто из белорусских женщин-дизайнеров стал широко известен благодаря созданию уникальных образов и платьев для медийных личностей?',
        opts: ['Александра Варламова','Наталья Ляховец','Татьяна Ефремова','Лариса Балунова'], ans: 1,
        fact: 'Наталья известна своим смелым авторским стилем, её работы часто мелькают на крупных ТВ-проектах и светских мероприятиях.' },
      { q: 'Белорусская гимнастка, многократная чемпионка мира по художественной гимнастике в командных упражнениях?',
        opts: ['Каролина Севастьянова','Алина Горносько','Анастасия Салос','Дарья Трофимова'], ans: 1,
        fact: 'Алина Горносько — олимпийская призёрка (Токио 2021) и многократная чемпионка мира в составе ансамбля.' },
      { q: 'Какой белорусский город претендовал на звание Культурной столицы Содружества в 2025 году?',
        opts: ['Брест','Гродно','Могилёв','Полоцк'], ans: 2,
        fact: 'Могилёв — один из древнейших городов Беларуси, известный богатым историческим наследием.' },
      { q: 'Как называется белорусский фестиваль, на котором ежегодно выбирают лучшую исполнительницу в рамках конкурса «Славянский базар»?',
        opts: ['Музыкальный форум «Золотой шлягер»','Международный конкурс «Песни мира»','Конкурс исполнителей эстрадной песни «Витебск»','Эстрадный фестиваль «Голоса Полесья»'], ans: 2,
        fact: 'Победа в этом конкурсе для многих белорусских певиц стала стартом большой профессиональной карьеры.' },
      { q: 'Какой традиционный белорусский промысел в 2023 году включён в список нематериального наследия ЮНЕСКО?',
        opts: ['Гончарство Ивенца','Витебский фаянс','Слуцкие пояса','Несвижское ткачество'], ans: 2,
        fact: 'Традиция изготовления Слуцких поясов признана объектом нематериального культурного наследия ЮНЕСКО.' },
    ]
  }
};

/* ─────────────────────────────────────
   PUZZLE DATA
   (images slot: set puzzleData[i].imgUrl after user uploads)
───────────────────────────────────── */
const PUZZLES = [
  {
    id: 'domracheva',
    name: 'Дарья Домрачева',
    initials: 'ДД',
    imgUrl: 'domracheva.jpg',      
    colors: ['#9e1a2e','#c8102e','#a01525','#7a0e1e','#8e1228','#b8132a','#6a0c1a','#7e0e20','#9e1228'],
    fact: 'Трёхкратная олимпийская чемпионка по биатлону на Играх в Сочи (2014). Победительница гонок преследования, масс-старта и индивидуальной гонки в один год — результат, не имеющий аналогов в истории биатлона. Четырёхкратная чемпионка мира, заслуженный мастер спорта Республики Беларусь.'
  },
  {
    id: 'alexievich',
    name: 'Марина Василевская',
    initials: 'МВ',
    imgUrl: 'Марина.jpg',
    colors: ['#1a3a6a','#1e4a88','#163060','#234a78','#1a3860','#1c4270','#142850','#1e3a68','#1a3060'],
    fact: 'Первая белорусская женщина-космонавт, бортпроводница авиакомпании «Белавиа». В 2024 году получила звание Героя Беларуси и орден Гагарина. Совершила полёт на МКС, став первой представительницей Беларуси в космосе.'
  },
  {
    id: 'horuzhaya',
    name: 'Вера Хоружая',
    initials: 'ВХ',
    imgUrl: 'Вера.jpg',
    colors: ['#2c5a2a','#3a7838','#245022','#346632','#286028','#30703a','#1e481e','#2a5c28','#246024'],
    fact: 'Герой Советского Союза (посмертно), белорусская революционерка и партизанка. В годы немецкой оккупации организовала подпольную группу в Витебске. Погибла в ноябре 1942 года. Её именем названы улицы, школы и площади в городах Беларуси.'
  }
];

/* ─────────────────────────────────────
   RIDDLES DATA
───────────────────────────────────── */
const RIDDLES = [
  { visual: '?', text: 'Глаза — как озёра, коса — спелый лён, в её доброту каждый путник влюблён.', hint: 'Общее название жительницы нашей страны.', answer: ['Белоруска','белоруска','беларуска','белорусска'], explain: 'Правильный ответ! Белоруска' },
  { visual: 'Цветок', text: 'Синий глазок из ржи на нас смотрит, скромный цветок, что поля не испортит.', hint: 'Растёт прямо в колосьях пшеницы или ржи.', answer: ['василёк','василек'], explain: 'Василёк — это верный спутник хлебного поля и один из самых любимых народных символов.' },
  { visual: '', text: 'Она — берегиня, начало начал, для каждого в жизни — надёжный причал.', hint: 'Самое первое и главное слово в жизни любого человека.', answer: ['Мама','мама'], explain: 'Важный человек в жизни каждого' },
  { visual: '', text: 'Сказку расскажет, даст мудрый совет, вкуснее её пирогов в мире нет.', hint: 'Мама папы или мамы, знаток всех традиций.', answer: ['бабушка','бабуля'], explain: 'Бабушка — это неиссякаемый источник тепла, доброты и самых уютных воспоминаний.' },
  { visual: 'О красоте и природе', text: 'В волосах — василёк, на плечах — вышиванка, встречает зарю на полях спозаранку.', hint: 'Женщина, работающая на уборке урожая в поле.', answer: ['Жнея','жнея'], explain: 'Жнея — это величественный образ из народных песен и сказаний' },
  { visual: '', text: 'Летний народный праздник: костры, венки, гадания у воды. Как он называется?', hint: 'Празднуется в ночь с 6 на 7 июля', answer: ['купалье','иван купала','купала'], explain: 'Купалье — один из самых древних и красивых белорусских народных праздников.' },
  { visual: 'МКС  2024', text: 'В 2024 году эта белоруска впервые в истории страны побывала на борту Международной космической станции. Кто она?', hint: 'Первый белорусский космонавт-женщина', answer: ['василевская','марина василевская'], explain: 'Марина Василевская — первый белорусский космонавт, вписавшая страну в историю освоения космоса.' },
  { visual: '', text: 'На тонком холсте она «пишет» иглой, узоры сплетая с народной душой.', hint: 'Женщина, создающая сложные узоры нитками.', answer: ['Вышивальщица','вышивальщица'], explain: 'Вышивальщица с помощью лишь иголки и нити превращает обычное полотно в произведение искусства.' }
];

/* ─────────────────────────────────────
   SCREEN NAVIGATION
───────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); window.scrollTo(0,0); }
  if (id === 'screen-home')    refreshHome();
  if (id === 'screen-menu')    refreshMenu();
  if (id === 'screen-results') renderResults();
  if (id === 'screen-puzzle')  initPuzzleScreen();
  if (id === 'screen-riddles') initRiddles();
  if (id === 'screen-flower')  initFlower();
}

function refreshHome() {
  const row = document.getElementById('home-score-row');
  if (G.score > 0) {
    row.style.display = 'flex';
    document.getElementById('hs-num').textContent = G.score;
    document.getElementById('hs-level').textContent = levelName(G.score);
  } else row.style.display = 'none';
}

function refreshMenu() {
  const scoreEl = document.getElementById('menu-score-val');
  if (scoreEl) scoreEl.textContent = G.score;
  const totalEl = document.getElementById('menu-total-score');
  if (totalEl) totalEl.textContent = G.score + ' очков';

  ['famous','history','modern'].forEach(cat => {
    const el = document.getElementById('stars-' + cat);
    if (!el) return;
    if (!G.quizDone[cat]) { el.textContent = ''; return; }
    const pct = G.quizBest[cat] / (QUIZZES[cat].questions.length * 13);
    el.textContent = pct >= 0.8 ? '\u2605\u2605\u2605' : pct >= 0.5 ? '\u2605\u2605\u2734' : '\u2605\u2734\u2734';
  });

  const ps = document.getElementById('stars-puzzle');
  if (ps) ps.textContent = G.puzzleDone.length >= PUZZLES.length ? '\u2605\u2605\u2605' : G.puzzleDone.length > 0 ? '\u2605\u2734\u2734' : '';

  const rs = document.getElementById('stars-riddles');
  if (rs) rs.textContent = G.riddleDone.length >= RIDDLES.length ? '\u2605\u2605\u2605' : G.riddleDone.length > 0 ? '\u2605\u2734\u2734' : '';
}

/* ─────────────────────────────────────
   QUIZ LOGIC
───────────────────────────────────── */
let quizTimer = null;

function startQuiz(type) {
  G.currentQuizType = type;
  const qs = [...QUIZZES[type].questions].sort(() => Math.random() - 0.5);
  G.currentQuizSet = qs;
  G.quizIdx = 0;
  G.quizPts = 0;
  showScreen('screen-quiz');
  document.getElementById('quiz-cat-tag').textContent = QUIZZES[type].label;
  renderQuestion();
}

function renderQuestion() {
  const q = G.currentQuizSet[G.quizIdx];
  const total = G.currentQuizSet.length;
  document.getElementById('q-num').textContent = G.quizIdx + 1;
  document.getElementById('q-total').textContent = total;
  document.getElementById('quiz-pts').textContent = G.quizPts;
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('quiz-prog-fill').style.width = ((G.quizIdx / total) * 100) + '%';
  document.getElementById('quiz-fact-box').style.display = 'none';

  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';
  const letters = ['А','Б','В','Г'];
  q.opts.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${text}`;
    btn.addEventListener('click', () => pickAnswer(i, q));
    opts.appendChild(btn);
  });

  startQuizTimer();
}

function startQuizTimer() {
  clearInterval(quizTimer);
  G.timerVal = 30;
  updateTimerUI(30, 30);
  quizTimer = setInterval(() => {
    G.timerVal--;
    updateTimerUI(G.timerVal, 30);
    if (G.timerVal <= 0) { clearInterval(quizTimer); timeUp(); }
  }, 1000);
}

function updateTimerUI(val, max) {
  const numEl = document.getElementById('timer-num');
  const arc   = document.getElementById('timer-arc');
  if (!numEl || !arc) return;
  numEl.textContent = val;
  numEl.className = 'timer-num' + (val <= 10 ? ' urgent' : '');
  const circ = 2 * Math.PI * 24; // r=24
  const offset = circ * (1 - val / max);
  arc.style.strokeDashoffset = offset;
  arc.style.stroke = val <= 10 ? '#e8162f' : '#C8102E';
}

function timeUp() {
  const q = G.currentQuizSet[G.quizIdx];
  lockOptions(q, -1);
  showFact(q, false, true);
  setTimeout(advanceQuestion, 2800);
}

function pickAnswer(idx, q) {
  clearInterval(quizTimer);
  const correct = idx === q.ans;
  if (correct) G.quizPts += 10 + Math.ceil(G.timerVal / 4);
  document.getElementById('quiz-pts').textContent = G.quizPts;
  lockOptions(q, idx);
  showFact(q, correct, false);
  setTimeout(advanceQuestion, 2800);
}

function lockOptions(q, picked) {
  document.querySelectorAll('.q-opt').forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.ans)  btn.classList.add('correct');
    if (i === picked && picked !== q.ans) btn.classList.add('wrong');
  });
}

function showFact(q, correct, timeout) {
  const fb = document.getElementById('quiz-fact-box');
  fb.style.display = 'block';
  fb.className = 'quiz-fact-box ' + (correct ? 'correct' : 'wrong');
  if (timeout) fb.innerHTML = '<b>Время вышло!</b> Правильный ответ: <b>' + q.opts[q.ans] + '</b><br>' + q.fact;
  else if (correct) fb.innerHTML = '<b>Верно!</b> ' + q.fact;
  else fb.innerHTML = '<b>Неверно.</b> Правильный ответ: <b>' + q.opts[q.ans] + '</b><br>' + q.fact;
}

function advanceQuestion() {
  G.quizIdx++;
  if (G.quizIdx >= G.currentQuizSet.length) finishQuiz();
  else renderQuestion();
}

function finishQuiz() {
  clearInterval(quizTimer);
  const type = G.currentQuizType;
  const maxPts = G.currentQuizSet.length * 13;
  if (G.quizPts > (G.quizBest[type] || 0)) {
    G.score += G.quizPts - (G.quizBest[type] || 0);
    G.quizBest[type] = G.quizPts;
  }
  G.quizDone[type] = true;
  save();

  const pct = G.quizPts / maxPts;
  const stars = pct >= 0.8 ? '\u2605\u2605\u2605' : pct >= 0.5 ? '\u2605\u2605\u2734' : '\u2605\u2734\u2734';
  const grade = pct >= 0.8 ? 'Превосходно' : pct >= 0.5 ? 'Хорошо' : 'Продолжайте';

  document.getElementById('ovl-grade').textContent = grade;
  document.getElementById('ovl-score-num').textContent = G.quizPts;
  document.getElementById('ovl-stars').textContent = stars;
  document.getElementById('quiz-overlay').style.display = 'flex';
}

function closeQuizOverlay() {
  document.getElementById('quiz-overlay').style.display = 'none';
  showScreen('screen-menu');
}
function retryQuiz() {
  document.getElementById('quiz-overlay').style.display = 'none';
  startQuiz(G.currentQuizType);
}
function exitQuiz() {
  clearInterval(quizTimer);
  showScreen('screen-menu');
}

/* ─────────────────────────────────────
   PUZZLE LOGIC
───────────────────────────────────── */
let pzOrder = [];       // current piece order on source board
let pzPlaced = [];      // [slotIdx] = pieceIdx | null
let pzDragSrc = null;

function initPuzzleScreen() {
  document.getElementById('pz-selector').style.display = 'block';
  document.getElementById('pz-game').style.display = 'none';
  hidePzFact();

  const el = document.getElementById('pz-choices');
  el.innerHTML = '';
  PUZZLES.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'pz-choice';
    const done = G.puzzleDone.includes(p.id);
    div.innerHTML = `
      <div class="pz-choice-icon">${p.initials}</div>
      <div class="pz-choice-name">${p.name}</div>
      ${done ? '<div class="pz-choice-done">Собрано</div>' : ''}
    `;
    div.addEventListener('click', () => loadPuzzle(i));
    el.appendChild(div);
  });
}

function loadPuzzle(idx) {
  G.puzzleIdx = idx;
  const p = PUZZLES[idx];
  document.getElementById('pz-selector').style.display = 'none';
  document.getElementById('pz-game').style.display = 'block';
  hidePzFact();
  document.getElementById('pz-game-title').textContent = p.name;
  pzPlaced = Array(9).fill(null);
  pzOrder  = [0,1,2,3,4,5,6,7,8].sort(() => Math.random() - 0.5);
  renderPuzzle();
}

function shufflePuzzle() {
  // Return placed pieces to source
  const placed = pzPlaced.filter(v => v !== null);
  placed.forEach(v => { if (!pzOrder.includes(v)) pzOrder.push(v); });
  pzPlaced = Array(9).fill(null);
  pzOrder = pzOrder.sort(() => Math.random() - 0.5);
  renderPuzzle();
}

function renderPuzzle() {
  const p = PUZZLES[G.puzzleIdx];
  const src = document.getElementById('pz-source');
  const cnv = document.getElementById('pz-canvas');
  src.innerHTML = '';
  cnv.innerHTML = '';

  // Source: remaining pieces
  pzOrder.forEach(pieceIdx => {
    const piece = makePiece(p, pieceIdx, false);
    src.appendChild(piece);
  });
  // Fill empty slots to keep grid stable
  const emptyCount = 9 - pzOrder.length;
  for (let e = 0; e < emptyCount; e++) {
    const ghost = document.createElement('div');
    ghost.className = 'pz-piece';
    ghost.style.visibility = 'hidden';
    src.appendChild(ghost);
  }

  // Canvas: 9 slots
  for (let i = 0; i < 9; i++) {
    if (pzPlaced[i] !== null) {
      const piece = makePiece(p, pzPlaced[i], true);
      piece.dataset.slot = i;
      if (pzPlaced[i] === i) piece.style.outline = '2px solid #4caf7d';
      cnv.appendChild(piece);
    } else {
      const slot = makeSlot(i);
      cnv.appendChild(slot);
    }
  }

  const correct = pzPlaced.filter((v,i) => v === i).length;
  const total   = pzPlaced.filter(v => v !== null).length;
  document.getElementById('pz-progress-text').textContent = correct + ' / 9 на месте';
}

function makePiece(p, pieceIdx, inCanvas) {
  const div = document.createElement('div');
  div.className = 'pz-piece';
  div.draggable = !inCanvas;
  div.dataset.piece = pieceIdx;

  const inner = document.createElement('div');
  inner.className = 'pz-piece-inner';

  if (p.imgUrl) {
    // Image: position as background slice
    const col = pieceIdx % 3;
    const row = Math.floor(pieceIdx / 3);
    inner.classList.add('has-img');
    inner.style.backgroundImage = `url('${p.imgUrl}')`;
    inner.style.backgroundPosition = `-${col * 140}px -${row * 140}px`;
  } else {
    // Placeholder: color block + number
    inner.style.background = p.colors[pieceIdx];
    const num = document.createElement('div');
    num.className = 'pz-piece-num';
    num.textContent = pieceIdx + 1;
    inner.appendChild(num);
  }

  div.appendChild(inner);

  if (!inCanvas) {
    div.addEventListener('dragstart', e => {
      pzDragSrc = pieceIdx;
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
  } else {
    // Piece sitting in a canvas slot — allow dragging it out
    div.draggable = true;
    div.addEventListener('dragstart', e => {
      const slotIdx = parseInt(div.dataset.slot);
      pzDragSrc = pieceIdx;
      pzPlaced[slotIdx] = null;
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      // If dropped nowhere valid, put it back in the source bank
      if (pzDragSrc !== null) {
        if (!pzOrder.includes(pzDragSrc)) pzOrder.push(pzDragSrc);
        pzDragSrc = null;
        renderPuzzle();
      }
    });
    // Also: empty slot behind this piece needs to accept drops
    div.addEventListener('dragover', e => { e.preventDefault(); div.classList.add('drag-over'); });
    div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
    div.addEventListener('drop', e => {
      e.preventDefault();
      div.classList.remove('drag-over');
      if (pzDragSrc === null || pzDragSrc === pieceIdx) return;
      const slotIdx = parseInt(div.dataset.slot);
      const displaced = pzPlaced[slotIdx];
      const srcI = pzOrder.indexOf(pzDragSrc);
      if (srcI !== -1) pzOrder.splice(srcI, 1);
      if (displaced !== null && displaced !== undefined) pzOrder.push(displaced);
      pzPlaced[slotIdx] = pzDragSrc;
      pzDragSrc = null;
      renderPuzzle();
      checkPuzzle();
    });
  }
  return div;
}

function makeSlot(slotIdx) {
  const div = document.createElement('div');
  div.className = 'pz-slot';
  div.dataset.slot = slotIdx;

  const num = document.createElement('div');
  num.className = 'pz-slot-num';
  num.textContent = slotIdx + 1;
  div.appendChild(num);

  div.addEventListener('dragover', e => { e.preventDefault(); div.classList.add('drag-over'); });
  div.addEventListener('dragleave', ()  => div.classList.remove('drag-over'));
  div.addEventListener('drop', e => {
    e.preventDefault();
    div.classList.remove('drag-over');
    if (pzDragSrc === null) return;

    const displaced = pzPlaced[slotIdx]; // piece already in target slot (or null)

    // Remove dragged piece from source bank
    const srcI = pzOrder.indexOf(pzDragSrc);
    if (srcI !== -1) pzOrder.splice(srcI, 1);

    // If target slot had a piece, also remove it from any other slot it might be in
    // and send it back to the source bank
    if (displaced !== null && displaced !== undefined) {
      pzOrder.push(displaced);
    }

    pzPlaced[slotIdx] = pzDragSrc;
    pzDragSrc = null;
    renderPuzzle();
    checkPuzzle();
  });

  return div;
}

function checkPuzzle() {
  const filled = pzPlaced.filter(v => v !== null).length;
  if (filled < 9) return;
  const correct = pzPlaced.filter((v,i) => v === i).length;
  if (correct === 9) completePuzzle();
}

function completePuzzle() {
  const p = PUZZLES[G.puzzleIdx];
  if (!G.puzzleDone.includes(p.id)) {
    G.puzzleDone.push(p.id);
    G.score += 30;
    save();
  }
  document.getElementById('pz-fact-name').textContent = p.name;
  document.getElementById('pz-fact-text').textContent = p.fact;
  document.getElementById('pz-fact-overlay').style.display = 'flex';
}

function hidePzFact() { document.getElementById('pz-fact-overlay').style.display = 'none'; }

function nextPuzzle() {
  hidePzFact();
  loadPuzzle((G.puzzleIdx + 1) % PUZZLES.length);
}

/* ─────────────────────────────────────
   RIDDLE LOGIC
───────────────────────────────────── */
function initRiddles() {
  G.riddleIdx = 0;
  document.getElementById('rd-total').textContent = RIDDLES.length;
  renderRiddle();
}

function renderRiddle() {
  const r = RIDDLES[G.riddleIdx];
  document.getElementById('rd-num').textContent = G.riddleIdx + 1;
  document.getElementById('rd-card-num').textContent = String(G.riddleIdx + 1).padStart(2,'0');
  document.getElementById('rd-visual').textContent = r.visual;
  document.getElementById('rd-text').textContent = r.text;
  document.getElementById('rd-input').value = '';
  document.getElementById('rd-hint').style.display = 'none';
  document.getElementById('rd-hint').textContent = r.hint;
  document.getElementById('rd-feedback').style.display = 'none';
  renderDots();
}

function renderDots() {
  const el = document.getElementById('rd-dots');
  el.innerHTML = '';
  RIDDLES.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'rd-dot' + (i === G.riddleIdx ? ' active' : '') + (G.riddleDone.includes(i) ? ' done' : '');
    d.addEventListener('click', () => { G.riddleIdx = i; renderRiddle(); });
    el.appendChild(d);
  });
}

function checkRiddle() {
  const r = RIDDLES[G.riddleIdx];
  const val = (document.getElementById('rd-input').value || '').trim().toLowerCase();
  const fb = document.getElementById('rd-feedback');
  fb.style.display = 'block';
  const ok = r.answer.some(a => val === a || (val.length > 3 && a.includes(val)));
  if (ok) {
    fb.className = 'rd-feedback ok';
    fb.textContent = r.explain;
    if (!G.riddleDone.includes(G.riddleIdx)) {
      G.riddleDone.push(G.riddleIdx);
      G.score += 15;
      save();
    }
    renderDots();
    setTimeout(() => goRiddle(1), 2200);
  } else {
    fb.className = 'rd-feedback err';
    fb.textContent = 'Не совсем верно. Попробуйте ещё раз!';
  }
}

function toggleHint() {
  const h = document.getElementById('rd-hint');
  h.style.display = h.style.display === 'none' ? 'block' : 'none';
}

function goRiddle(dir) {
  G.riddleIdx = (G.riddleIdx + dir + RIDDLES.length) % RIDDLES.length;
  renderRiddle();
}

/* ─────────────────────────────────────
   RESULTS
───────────────────────────────────── */
function levelName(score) {
  if (score >= 350) return 'Эксперт по культуре Беларуси';
  if (score >= 180) return 'Знаток Беларуси';
  if (score >=  60) return 'Исследователь';
  return 'Новичок';
}

function renderResults() {
  const sc = G.score;
  document.getElementById('results-score-big').textContent = sc;
  document.getElementById('results-level-tag').textContent = levelName(sc);

  const maxQuiz = 10 * 13;
  const sections = [
    {
      label: 'Известные женщины',
      pct: G.quizDone.famous ? Math.min(G.quizBest.famous / maxQuiz, 1) : 0,
      stars: G.quizDone.famous ? starsFromPct(G.quizBest.famous / maxQuiz) : null,
    },
    {
      label: 'История и культура',
      pct: G.quizDone.history ? Math.min(G.quizBest.history / maxQuiz, 1) : 0,
      stars: G.quizDone.history ? starsFromPct(G.quizBest.history / maxQuiz) : null,
    },
    {
      label: 'Современность',
      pct: G.quizDone.modern ? Math.min(G.quizBest.modern / maxQuiz, 1) : 0,
      stars: G.quizDone.modern ? starsFromPct(G.quizBest.modern / maxQuiz) : null,
    },
    {
      label: 'Пазл',
      pct: G.puzzleDone.length / PUZZLES.length,
      stars: G.puzzleDone.length >= PUZZLES.length ? '★★★' : G.puzzleDone.length > 0 ? '★★☆' : null,
    },
    {
      label: 'Загадки',
      pct: G.riddleDone.length / RIDDLES.length,
      stars: G.riddleDone.length >= RIDDLES.length ? '★★★' : G.riddleDone.length > 0 ? '★☆☆' : null,
    },
  ];

  const grid = document.getElementById('ach-grid');
  grid.innerHTML = '';
  sections.forEach(s => {
    const pctPx = Math.round(s.pct * 100);
    const barColor = s.pct >= 0.8 ? 'var(--green)' : s.pct >= 0.5 ? 'var(--gold)' : 'var(--red)';
    const starsHtml = s.stars
      ? `<span class="prog-stars">${s.stars}</span>`
      : `<span class="prog-dash">—</span>`;
    const el = document.createElement('div');
    el.className = 'prog-row';
    el.innerHTML = `
      <div class="prog-header">
        <span class="prog-label">${s.label}</span>
        ${starsHtml}
      </div>
      <div class="prog-bar-track">
        <div class="prog-bar-fill" style="width:${pctPx}%;background:${barColor};"></div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function starsFromPct(pct) {
  if (pct >= 0.8) return '★★★';
  if (pct >= 0.5) return '★★☆';
  return '★☆☆';
}

function confirmReset() {
  if (!confirm('Сбросить весь прогресс?')) return;
  G = { score:0, quizBest:{famous:0,history:0,modern:0}, quizDone:{famous:false,history:false,modern:false}, puzzleDone:[], riddleDone:[], currentQuizType:null, currentQuizSet:[], quizIdx:0, quizPts:0, riddleIdx:0, puzzleIdx:0, timerVal:30 };
  localStorage.removeItem('byw25');
  showScreen('screen-home');
}

/* ─────────────────────────────────────
   BACKGROUND CANVAS — subtle particles
───────────────────────────────────── */
function initBg() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, pts;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    pts = Array.from({ length: 28 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * 0.1 + 0.03,
      c:  Math.random() > 0.6 ? '#C8102E' : Math.random() > 0.5 ? '#007A3D' : '#B8860B',
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(frame);
  }

  resize(); init(); frame();
  window.addEventListener('resize', () => { resize(); init(); });
}

/* ─────────────────────────────────────
   PUZZLE IMAGE LOADER
   Call this after user provides images.
   e.g. PUZZLES[0].imgUrl = 'domracheva.jpg';
───────────────────────────────────── */
function setPuzzleImage(puzzleId, url) {
  const p = PUZZLES.find(p => p.id === puzzleId);
  if (p) p.imgUrl = url;
}

/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */

/* ─────────────────────────────────────
   ЦВЕТОК КАЧЕСТВ
───────────────────────────────────── */
const FLOWER_DATA = [
  {
    id: 'wisdom',
    title: 'Мудрость',
    icon: '✦',
    isCenter: true,
    wish: 'Твоя мудрость — это компас, который помогает находить верный путь даже в самые тёмные времена. Пусть она озаряет каждый твой шаг и вдохновляет тех, кто рядом.'
  },
  {
    id: 'tenderness',
    title: 'Нежность',
    icon: '❀',
    isCenter: false,
    wish: 'Пусть твоя нежность растапливает любые льды и вдохновляет окружающих на добрые поступки. Оставайся таким же светлым лучиком — мир становится теплее рядом с тобой.'
  },
  {
    id: 'strength',
    title: 'Сила',
    icon: '◈',
    isCenter: false,
    wish: 'Твоя внутренняя сила способна свернуть горы. Желаю, чтобы она всегда сочеталась с гармонией и душевным покоем — и тогда нет ничего невозможного.'
  },
  {
    id: 'grace',
    title: 'Изящество',
    icon: '◇',
    isCenter: false,
    wish: 'Ты движешься по жизни с такой грацией, что даже трудности превращаются в красивый танец. Пусть это изящество остаётся с тобой всегда.'
  },
  {
    id: 'creativity',
    title: 'Творчество',
    icon: '✧',
    isCenter: false,
    wish: 'Твой творческий дар — это дар всему миру. Пусть вдохновение никогда не покидает тебя, а каждая идея находит воплощение и приносит радость.'
  },
  {
    id: 'kindness',
    title: 'Доброта',
    icon: '♡',
    isCenter: false,
    wish: 'Твоя доброта — это тихая сила, которая меняет мир. Пусть каждое доброе слово и поступок возвращается к тебе сторицей — теплом, любовью и улыбками.'
  },
  {
    id: 'uniqueness',
    title: 'Уникальность',
    icon: '❋',
    isCenter: false,
    wish: 'Ты неповторима — и это твоё главное сокровище. Пусть твоя уникальность всегда остаётся яркой и свободной, не сдерживаемой ничьими рамками.'
  }
];

// Hex geometry helpers
// Flat-top hexagon, radius R
// Center positions for 7-flower: center + 6 around at 60° steps
function initFlower() {
  const container = document.getElementById('flower-container');
  if (!container) return;
  container.innerHTML = '';

  const isMobile = window.innerWidth <= 600;
  const R = isMobile ? 52 : 80;       // hex "radius" (center to vertex)
  const cW = isMobile ? 340 : 520;
  const cH = isMobile ? 340 : 520;
  const cx = cW / 2;
  const cy = cH / 2;

  // Spacing between hex centers for a snug flower (flat-top)
  const spacing = R * 1.72;

  // Angles for 6 surrounding hexes (starting top, going clockwise)
  // For flat-top hex flower: neighbors at 30°, 90°, 150°, 210°, 270°, 330°
  const angles = [90, 30, 330, 270, 210, 150]; // degrees, pointing up first

  // positions: [0]=center, [1]=top, [2]=top-right, [3]=bottom-right, [4]=bottom, [5]=bottom-left, [6]=top-left
  const positions = [[cx, cy]];
  angles.forEach(a => {
    const rad = (a * Math.PI) / 180;
    positions.push([cx + spacing * Math.cos(rad), cy - spacing * Math.sin(rad)]);
  });

  // Map flower data order to position order
  // FLOWER_DATA[0]=center, [1]=top(Нежность), [2]=top-right(Сила), [3]=bottom-right(Изящество),
  // [4]=bottom(Творчество), [5]=bottom-left(Доброта), [6]=top-left(Уникальность)

  FLOWER_DATA.forEach((item, i) => {
    const [px, py] = positions[i];
    const size = R * 2;

    const cell = document.createElement('div');
    cell.className = 'hex-cell' + (item.isCenter ? ' center-hex' : '');
    cell.style.width = size + 'px';
    cell.style.height = size + 'px';
    cell.style.left = (px - R) + 'px';
    cell.style.top  = (py - R) + 'px';

    // SVG hexagon (flat-top)
    const pts = hexPoints(R, R, R, true).map(p => p[0]+','+p[1]).join(' ');
    cell.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0">
        <polygon class="hex-bg" points="${pts}"
          fill="${item.isCenter ? 'rgba(200,16,46,0.05)' : 'rgba(251,248,242,0.9)'}"
          stroke="${item.isCenter ? '#C8102E' : 'rgba(0,0,0,0.12)'}"
          stroke-width="${item.isCenter ? 1.5 : 1}"/>
      </svg>
      <div class="hex-label">
        <span class="hex-icon" style="color:${item.isCenter ? 'var(--red)' : 'var(--gold)'}">${item.icon}</span>
        <span class="hex-title">${item.title}</span>
      </div>
    `;

    // Vertex dots at shared corners (just 2-3 visible per petal for the reference look)
    if (!item.isCenter) {
      const dotAngles = [i === 1 ? [240,300] : i === 2 ? [180,240] : i === 3 ? [120,180] :
                         i === 4 ? [60,120]  : i === 5 ? [0,60]   : [300,0]][0];
      dotAngles.forEach(da => {
        const rad = (da * Math.PI) / 180;
        const dot = document.createElement('div');
        dot.className = 'hex-dot';
        dot.style.left = (R + (R - 2) * Math.cos(rad)) + 'px';
        dot.style.top  = (R - (R - 2) * Math.sin(rad)) + 'px';
        cell.appendChild(dot);
      });
    }

    cell.addEventListener('click', () => openFlowerModal(item));
    container.appendChild(cell);

    // Staggered bloom animation
    setTimeout(() => cell.classList.add('bloomed'), i * 120);
  });
}

// Returns flat-top hexagon points centered at (cx, cy) with radius r
function hexPoints(cx, cy, r, flatTop) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = flatTop ? 60 * i : 60 * i + 30;
    const rad = (angleDeg * Math.PI) / 180;
    pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
  }
  return pts;
}

function openFlowerModal(item) {
  document.getElementById('flower-modal-icon').textContent = item.icon;
  document.getElementById('flower-modal-title').textContent = item.title;
  document.getElementById('flower-modal-text').textContent = item.wish;
  document.getElementById('flower-modal-bg').classList.add('open');
}

function closeFlowerModal() {
  document.getElementById('flower-modal-bg').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  load();
  refreshHome();
  initBg();
});
