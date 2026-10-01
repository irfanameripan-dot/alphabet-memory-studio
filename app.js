const STORAGE_KEY = "alphabetMemoryStudioProgress";

const alphabetSets = {
  abc: {
    title: "ABC",
    description: "English alphabet",
    icon: "Aa",
    characters: [
      ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"],
      ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"], ["J", "J"],
      ["K", "K"], ["L", "L"], ["M", "M"], ["N", "N"], ["O", "O"],
      ["P", "P"], ["Q", "Q"], ["R", "R"], ["S", "S"], ["T", "T"],
      ["U", "U"], ["V", "V"], ["W", "W"], ["X", "X"], ["Y", "Y"],
      ["Z", "Z"]
    ]
  },

  jawi: {
    title: "Jawi",
    description: "Basic Jawi letters",
    icon: "ا ب",
    characters: [
      ["ا", "Alif"], ["ب", "Ba"], ["ت", "Ta"], ["ث", "Tha"],
      ["ج", "Jim"], ["چ", "Ca"], ["ح", "Ha"], ["خ", "Kha"],
      ["د", "Dal"], ["ذ", "Zal"], ["ر", "Ra"], ["ز", "Zai"],
      ["س", "Sin"], ["ش", "Syin"], ["ص", "Sad"], ["ض", "Dad"],
      ["ط", "To"], ["ظ", "Zo"], ["ع", "Ain"], ["غ", "Ghain"],
      ["ڠ", "Nga"], ["ف", "Fa"], ["ڤ", "Pa"], ["ق", "Qaf"],
      ["ك", "Kaf"], ["ݢ", "Ga"], ["ل", "Lam"], ["م", "Mim"],
      ["ن", "Nun"], ["ڽ", "Nya"], ["و", "Wau"], ["ۏ", "Va"],
      ["ه", "Ha"], ["ء", "Hamzah"], ["ي", "Ya"]
    ]
  },

  hiragana: {
    title: "Hiragana",
    description: "Japanese basic characters",
    icon: "あ",
    characters: [
      ["あ", "a"], ["い", "i"], ["う", "u"], ["え", "e"], ["お", "o"],
      ["か", "ka"], ["き", "ki"], ["く", "ku"], ["け", "ke"], ["こ", "ko"],
      ["さ", "sa"], ["し", "shi"], ["す", "su"], ["せ", "se"], ["そ", "so"],
      ["た", "ta"], ["ち", "chi"], ["つ", "tsu"], ["て", "te"], ["と", "to"],
      ["な", "na"], ["に", "ni"], ["ぬ", "nu"], ["ね", "ne"], ["の", "no"],
      ["は", "ha"], ["ひ", "hi"], ["ふ", "fu"], ["へ", "he"], ["ほ", "ho"],
      ["ま", "ma"], ["み", "mi"], ["む", "mu"], ["め", "me"], ["も", "mo"],
      ["や", "ya"], ["ゆ", "yu"], ["よ", "yo"],
      ["ら", "ra"], ["り", "ri"], ["る", "ru"], ["れ", "re"], ["ろ", "ro"],
      ["わ", "wa"], ["を", "wo"], ["ん", "n"]
    ]
  },

  katakana: {
    title: "Katakana",
    description: "Japanese basic characters",
    icon: "ア",
    characters: [
      ["ア", "a"], ["イ", "i"], ["ウ", "u"], ["エ", "e"], ["オ", "o"],
      ["カ", "ka"], ["キ", "ki"], ["ク", "ku"], ["ケ", "ke"], ["コ", "ko"],
      ["サ", "sa"], ["シ", "shi"], ["ス", "su"], ["セ", "se"], ["ソ", "so"],
      ["タ", "ta"], ["チ", "chi"], ["ツ", "tsu"], ["テ", "te"], ["ト", "to"],
      ["ナ", "na"], ["ニ", "ni"], ["ヌ", "nu"], ["ネ", "ne"], ["ノ", "no"],
      ["ハ", "ha"], ["ヒ", "hi"], ["フ", "fu"], ["ヘ", "he"], ["ホ", "ho"],
      ["マ", "ma"], ["ミ", "mi"], ["ム", "mu"], ["メ", "me"], ["モ", "mo"],
      ["ヤ", "ya"], ["ユ", "yu"], ["ヨ", "yo"],
      ["ラ", "ra"], ["リ", "ri"], ["ル", "ru"], ["レ", "re"], ["ロ", "ro"],
      ["ワ", "wa"], ["ヲ", "wo"], ["ン", "n"]
    ]
  }
};

let currentSetId = "abc";
let currentCardIndex = 0;
let answerVisible = false;
let quizCorrectAnswers = 0;
let quizAnswer = null;
let quizLocked = false;

const alphabetList = document.getElementById("alphabet-list");
const overallProgressText = document.getElementById("overall-progress-text");

const homeScreen = document.getElementById("home-screen");
const learningScreen = document.getElementById("learning-screen");

const learningEyebrow = document.getElementById("learning-eyebrow");
const learningTitle = document.getElementById("learning-title");

const cardPosition = document.getElementById("card-position");
const setProgressBar = document.getElementById("set-progress-bar");
const setProgressText = document.getElementById("set-progress-text");

const flashcardCharacter = document.getElementById("flashcard-character");
const flashcardAnswer = document.getElementById("flashcard-answer");
const flashcardTip = document.getElementById("flashcard-tip");
const revealCardButton = document.getElementById("reveal-card-button");
const knowCardButton = document.getElementById("know-card-button");

const quizPrompt = document.getElementById("quiz-prompt");
const quizFeedback = document.getElementById("quiz-feedback");
const quizOptions = document.getElementById("quiz-options");
const quizScore = document.getElementById("quiz-score");
const playCardSoundButton = document.getElementById("play-card-sound-button");
const playQuizSoundButton = document.getElementById("play-quiz-sound-button");

function getProgress() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (savedProgress) {
    return JSON.parse(savedProgress);
  }

  return {
    knownCharacters: {}
  };
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getCurrentSet() {
  return alphabetSets[currentSetId];
}

function getKnownCharacters(setId) {
  const progress = getProgress();
  return progress.knownCharacters[setId] || [];
}

function isCharacterKnown(setId, index) {
  return getKnownCharacters(setId).includes(index);
}

function getSetPercentage(setId) {
  const set = alphabetSets[setId];
  const knownCount = getKnownCharacters(setId).length;

  return Math.round((knownCount / set.characters.length) * 100);
}

function getOverallPercentage() {
  const totalCharacters = Object.values(alphabetSets).reduce((total, set) => {
    return total + set.characters.length;
  }, 0);

  const totalKnown = Object.keys(alphabetSets).reduce((total, setId) => {
    return total + getKnownCharacters(setId).length;
  }, 0);

  return Math.round((totalKnown / totalCharacters) * 100);
}

function renderAlphabetCards() {
  alphabetList.innerHTML = "";

  Object.entries(alphabetSets).forEach(([setId, set]) => {
    const knownCount = getKnownCharacters(setId).length;
    const percentage = getSetPercentage(setId);

    const button = document.createElement("button");
    button.className = "alphabet-card";
    button.type = "button";

    button.innerHTML = `
      <div class="alphabet-icon">${set.icon}</div>
      <div>
        <h3>${set.title}</h3>
        <p>${set.description}</p>
        <p class="card-progress-text">
          ${knownCount} / ${set.characters.length} known · ${percentage}%
        </p>
      </div>
    `;

    button.addEventListener("click", () => openLearningSet(setId));
    alphabetList.appendChild(button);
  });

  overallProgressText.textContent = `${getOverallPercentage()}%`;
}

function showScreen(screenName) {
  homeScreen.classList.remove("active");
  learningScreen.classList.remove("active");

  if (screenName === "home") {
    homeScreen.classList.add("active");
    renderAlphabetCards();
  } else {
    learningScreen.classList.add("active");
  }
}

function openLearningSet(setId) {
  currentSetId = setId;
  currentCardIndex = 0;
  quizCorrectAnswers = 0;

  const set = getCurrentSet();

  learningEyebrow.textContent = `${set.description.toUpperCase()} · FLASHCARDS`;
  learningTitle.textContent = set.title;

  showScreen("learning");
  showFlashcardMode();
  renderFlashcard();
}

function renderSetProgress() {
  const set = getCurrentSet();
  const knownCount = getKnownCharacters(currentSetId).length;
  const percentage = getSetPercentage(currentSetId);

  setProgressBar.style.width = `${percentage}%`;
  setProgressText.textContent = `${percentage}% known`;
  cardPosition.textContent = `${currentCardIndex + 1} / ${set.characters.length}`;

  return knownCount;
}

function renderFlashcard() {
  const set = getCurrentSet();
  const [character, answer] = set.characters[currentCardIndex];
  const known = isCharacterKnown(currentSetId, currentCardIndex);

  answerVisible = false;

  flashcardCharacter.textContent = character;
  flashcardAnswer.textContent = "?";
  flashcardTip.textContent =
    "Look at the character, say it aloud, then reveal the answer.";

  revealCardButton.textContent = "Reveal answer";

  knowCardButton.classList.toggle("known", known);
  knowCardButton.textContent = known
    ? "✓ You know this character"
    : "✓ I know this character";

  renderSetProgress();
}

function revealAnswer() {
  const set = getCurrentSet();
  const [, answer] = set.characters[currentCardIndex];

  answerVisible = !answerVisible;

  if (answerVisible) {
    flashcardAnswer.textContent = answer;
    flashcardTip.textContent = "Great. Say it once more, then mark it if you remember.";
    revealCardButton.textContent = "Hide answer";
  } else {
    flashcardAnswer.textContent = "?";
    flashcardTip.textContent =
      "Look at the character, say it aloud, then reveal the answer.";
    revealCardButton.textContent = "Reveal answer";
  }
}

function moveCard(direction) {
  const set = getCurrentSet();

  currentCardIndex += direction;

  if (currentCardIndex < 0) {
    currentCardIndex = set.characters.length - 1;
  }

  if (currentCardIndex >= set.characters.length) {
    currentCardIndex = 0;
  }

  renderFlashcard();
}

function toggleKnownCharacter() {
  const progress = getProgress();

  if (!progress.knownCharacters[currentSetId]) {
    progress.knownCharacters[currentSetId] = [];
  }

  const knownCharacters = progress.knownCharacters[currentSetId];
  const alreadyKnown = knownCharacters.includes(currentCardIndex);

  if (alreadyKnown) {
    progress.knownCharacters[currentSetId] = knownCharacters.filter(
      (index) => index !== currentCardIndex
    );
  } else {
    knownCharacters.push(currentCardIndex);
  }

  saveProgress(progress);
  renderFlashcard();
  renderAlphabetCards();
}

function showFlashcardMode() {
  document.getElementById("flashcard-mode").classList.add("active");
  document.getElementById("quiz-mode").classList.remove("active");

  document.getElementById("flashcard-mode-button").classList.add("active");
  document.getElementById("quiz-mode-button").classList.remove("active");
}

function showQuizMode() {
  document.getElementById("flashcard-mode").classList.remove("active");
  document.getElementById("quiz-mode").classList.add("active");

  document.getElementById("flashcard-mode-button").classList.remove("active");
  document.getElementById("quiz-mode-button").classList.add("active");

  newQuizQuestion();
}
function getSpeechLanguage() {
  if (currentSetId === "hiragana" || currentSetId === "katakana") {
    return "ja-JP";
  }

  if (currentSetId === "jawi") {
    return "ms-MY";
  }

  return "en-US";
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    window.alert("Sound is not available in this browser.");
    return;
  }

  // Stop any sound currently playing before starting the new one.
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  // Japanese: ja-JP
  // Jawi: ms-MY
  // ABC: en-US
  speech.lang = getSpeechLanguage();

  // Slower speed makes the sound easier for children to follow.
  speech.rate = 0.65;
  speech.pitch = 1.15;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

function playCurrentCardSound() {
  const set = getCurrentSet();
  const [, answer] = set.characters[currentCardIndex];

  speakText(answer);
}

function playCurrentQuizSound() {
  const set = getCurrentSet();
  const correctItem = set.characters.find(
    ([character]) => character === quizAnswer
  );

  if (!correctItem) {
    return;
  }

  const [, answer] = correctItem;

  speakText(answer);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function newQuizQuestion() {
  const set = getCurrentSet();
  quizLocked = false;

  const correctIndex = Math.floor(Math.random() * set.characters.length);
  const [correctCharacter, correctAnswer] = set.characters[correctIndex];

  quizAnswer = correctCharacter;
  quizPrompt.textContent = correctAnswer;
  quizFeedback.textContent = "Listen, then choose the correct character.";
  quizFeedback.className = "quiz-feedback";

  const incorrectOptions = shuffle(
    set.characters.filter(([character]) => character !== correctCharacter)
  ).slice(0, 3);

  const options = shuffle([
    [correctCharacter, correctAnswer],
    ...incorrectOptions
  ]);

  quizOptions.innerHTML = "";

  options.forEach(([character]) => {
    const optionButton = document.createElement("button");
    optionButton.className = "quiz-option";
    optionButton.type = "button";
    optionButton.textContent = character;

    optionButton.addEventListener("click", () => {
      checkQuizAnswer(character);
    });

    quizOptions.appendChild(optionButton);
  });

  quizScore.textContent = `Correct answers: ${quizCorrectAnswers}`;
}

function checkQuizAnswer(selectedCharacter) {
  if (quizLocked) {
    return;
  }

  quizLocked = true;

  if (selectedCharacter === quizAnswer) {
    quizCorrectAnswers += 1;
    quizFeedback.textContent = "Correct! Great memory! ⭐";
    quizFeedback.className = "quiz-feedback correct";

    const set = getCurrentSet();
    const correctIndex = set.characters.findIndex(
      ([character]) => character === quizAnswer
    );

    const progress = getProgress();

    if (!progress.knownCharacters[currentSetId]) {
      progress.knownCharacters[currentSetId] = [];
    }

    if (!progress.knownCharacters[currentSetId].includes(correctIndex)) {
      progress.knownCharacters[currentSetId].push(correctIndex);
      saveProgress(progress);
    }

    renderAlphabetCards();
  } else {
    quizFeedback.textContent = "Not this one. Try another question!";
    quizFeedback.className = "quiz-feedback wrong";
  }

  quizScore.textContent = `Correct answers: ${quizCorrectAnswers}`;
}

function resetAllProgress() {
  const confirmed = window.confirm(
    "Reset all saved alphabet progress and quiz learning marks?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  renderAlphabetCards();

  if (learningScreen.classList.contains("active")) {
    renderFlashcard();
  }
}

document.getElementById("reveal-card-button").addEventListener("click", revealAnswer);
playCardSoundButton.addEventListener("click", playCurrentCardSound);

playQuizSoundButton.addEventListener("click", playCurrentQuizSound);

document.getElementById("previous-card-button").addEventListener("click", () => {
  moveCard(-1);
});

document.getElementById("next-card-button").addEventListener("click", () => {
  moveCard(1);
});

knowCardButton.addEventListener("click", toggleKnownCharacter);

document.getElementById("flashcard-mode-button").addEventListener("click", () => {
  showFlashcardMode();
});

document.getElementById("quiz-mode-button").addEventListener("click", () => {
  showQuizMode();
});

document.getElementById("new-question-button").addEventListener("click", () => {
  newQuizQuestion();
});

document.querySelectorAll("[data-go-home]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen("home");
  });
});

document
  .getElementById("reset-progress-button")
  .addEventListener("click", resetAllProgress);

renderAlphabetCards();