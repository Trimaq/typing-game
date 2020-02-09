import words from './words.json';
import './main.scss';

const wordsElement = document.getElementById('words');
const wordInput = document.getElementById('wordInput');
const timerElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const restartButton = document.getElementById('restartButton');
const waContent = document.getElementById('waContent');
const waButton = document.getElementById('waButton');

let wordAmount = 100;
let randomWords = [];
let currentIndex = 0;
let started = false;
let right = 0;
let time = 0;
let timer;

const generateRandomWords = () => {
  let generatedWords = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < wordAmount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length) + 0;
    const randomWord = words[randomIndex];
    generatedWords = [...generatedWords, randomWord];
  }
  randomWords = generatedWords;
};

const displayWords = () => {
  while (wordsElement.firstChild) {
    wordsElement.removeChild(wordsElement.firstChild);
  }
  randomWords.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    if (i === 0) {
      span.className = 'word current';
    }
    wordsElement.appendChild(span);
  });
};

const startTimer = () => {
  if (started) {
    timer = setTimeout(() => {
      time += 1;
      startTimer();
    }, 1000);
  } else {
    timer = undefined;
    started = false;
  }
};

const checkWord = (e) => {
  if (!started) {
    started = true;
    startTimer();
  }
  if (e.keyCode === 32) {
    e.preventDefault();
    const currentInputValue = wordInput.value;
    wordInput.value = '';
    if (started && currentIndex === randomWords.length - 1) {
      started = false;
      wpmElement.textContent = ((right / time) * 60).toFixed(2);
      timerElement.textContent = time.toFixed(2);
    }
    const currentWord = randomWords[currentIndex];
    const currentWordElement = wordsElement.childNodes[currentIndex];
    const nextWordElement = wordsElement.childNodes[currentIndex + 1];
    if (currentInputValue === currentWord) {
      right += 1;
      currentWordElement.className = 'word correct';
    } else {
      currentWordElement.className = 'word wrong';
    }
    if (nextWordElement) nextWordElement.className = 'word current';
    currentIndex += 1;
  }
};

const restartGame = () => {
  wpmElement.textContent = '00';
  timerElement.textContent = '00';
  wordInput.value = '';
  randomWords = [];
  currentIndex = 0;
  started = false;
  right = 0;
  time = 0;
  timer = null;
  generateRandomWords();
  displayWords();
};

const setWordAmount = (wa) => {
  localStorage.setItem('wordAmount', wa);
  wordAmount = wa;
  document.getElementById('wordAmountPicker').childNodes.forEach((child) => {
    child.className = 'dropdown-item';
  });
  document.getElementById('waContent');
  document.getElementById(`wa${wa}`).className = 'dropdown-item active';
  restartGame();
};

const toggleDropdown = (dropdownId) => {
  const dropdown = document.getElementById(dropdownId);
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  if (dropdown.classList.contains('open')) {
    dropdown.classList.remove('open');
  } else {
    dropdown.classList.add('open');
  }
};

(() => {
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-btn')) {
      return;
    }
    const dropdowns = document.getElementsByClassName('dropdown-content');
    Array.from(dropdowns).forEach((child) => {
      if (child.classList.contains('open')) {
        child.classList.remove('open');
      }
    });
  });
  if (localStorage.getItem('wordAmount')) {
    setWordAmount(localStorage.getItem('wordAmount'));
  } else setWordAmount(100);
  generateRandomWords();
  displayWords();
  wordInput.addEventListener('keypress', checkWord);
  restartButton.addEventListener('click', restartGame);
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.keyCode === 82) restartGame();
    }
  });
})();

// Attach global functions to the window. This is needed for parcel.
window.setWordAmount = setWordAmount;
window.toggleDropdown = toggleDropdown;
