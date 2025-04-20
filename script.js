// Check Game level easy or hard
function getDifficulty() {
  return document.querySelector('input[name="difficulty"]:checked').value;
}

// List of fruits 
const fruits = [
  { emoji: '🍎', price: 10 },
  { emoji: '🍌', price: 5 },
  { emoji: '🍇', price: 8 },
  { emoji: '🍉', price: 12 },
  { emoji: '🍒', price: 15 },
  { emoji: '🍍', price: 20 },
  { emoji: '🥝', price: 50 },
  { emoji: '🥭', price: 15 },
  { emoji: '🍊', price: 10 },
  { emoji: '🍓', price: 14 },
  { emoji: '🍐', price: 20 },
  { emoji: '🥑', price: 40 },
];

let totalScore = 0;
let collected = [];
let gameInterval;
let timeLeft = 30;
const scoreDisplay = document.getElementById("score");
const game = document.getElementById("game");
const countdown = document.getElementById("countdown");
const introCard = document.getElementById("introCard");

function updateScore(amount, fruit) {
  totalScore += amount;
  collected.push(fruit);
  scoreDisplay.textContent = `Score: ₹${totalScore}`;
}

// Vibration if fruits clicked 
function vibrate() {
  if (navigator.vibrate) navigator.vibrate(6);
}

// Add/Remove new Fruits in different places, based on level fruits disappear time set
function spawnFruit() {
  const difficulty = getDifficulty();
  let fruit;
  if (difficulty === "hard") {
    const weightedFruits = fruits.flatMap(f => {
      const weight = f.price < 10 ? 3 : 1;
      return Array(weight).fill(f);
    });
    fruit = weightedFruits[Math.floor(Math.random() * weightedFruits.length)];
  } else {
    fruit = fruits[Math.floor(Math.random() * fruits.length)];
  }

  const el = document.createElement("div");
  el.className = "fruit";
  el.textContent = fruit.emoji;

  const maxLeft = game.clientWidth - 40;
  const maxTop = game.clientHeight - 40;
  let left = Math.random() * maxLeft;
  let top = Math.random() * maxTop;

  if (difficulty === "hard") {
    const prev = document.querySelector(".fruit");
    if (prev) {
      const prevLeft = parseFloat(prev.style.left);
      const prevTop = parseFloat(prev.style.top);
      let tries = 0;
      while (Math.abs(left - prevLeft) < 100 && Math.abs(top - prevTop) < 100 && tries < 10) {
        left = Math.random() * maxLeft;
        top = Math.random() * maxTop;
        tries++;
      }
    }
  }

  el.style.left = left + "px";
  el.style.top = top + "px";
  game.appendChild(el);

  // Remove after 3s (easy) or 2s (hard)
  const timeout = difficulty === "hard" ? 1000 : 3000;
  const removeTimeout = setTimeout(() => {
    el.remove();
  }, timeout);

  el.addEventListener("click", () => {
    clearTimeout(removeTimeout);
    el.classList.add("clicked");
    vibrate();
    setTimeout(() => el.remove(), 300);
    updateScore(fruit.price, fruit);
  });
}


// After Game Over Show Total Score 
function showResult() {
  const resultCard = document.createElement("div");
  resultCard.className = "outcard card";
  
  let summary = '';
  const grouped = {};
  collected.forEach(f => {
    grouped[f.emoji] = grouped[f.emoji] ? grouped[f.emoji] + f.price : f.price;
  });
  for (const [emoji, price] of Object.entries(grouped)) {
    summary += `<p>${emoji} = ₹${price}</p>`;
  }
  
  resultCard.innerHTML = `
        <h2>Time's Up!</h2>
        ${summary}
        <h3>Total Amount: ₹${totalScore}</h3>
        <button onclick="restartGame()">Play Again</button>
      `;
  
  game.appendChild(resultCard);
}

// Live Update countdown and score when game start 
function startGame() {
  introCard.style.display = "none";
  countdown.innerHTML = "<p>&#9201;</p>: 0";
  totalScore = 0;
  collected = [];
  scoreDisplay.textContent = `Score: ₹0`;
  timeLeft = 30;
  
  gameInterval = setInterval(spawnFruit, 600);
  const timer = setInterval(() => {
    timeLeft--;
    countdown.innerHTML = '<p>&#9201;</p>: ' + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(timer);
      document.querySelectorAll('.fruit').forEach(f => f.remove());
      countdown.innerHTML = "<p>&#9201;</p>: 0";
      showResult();
    }
  }, 1000);
}

// play again button in game over card
function restartGame() {
  const card = document.querySelector('.outcard');
  if (card) {
    card.style.display = 'none';
    setTimeout(() => {
      card.remove();
      startGame();
    }, 2000);
  } else {
    startGame();
  }
}


// Setting button 
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
settingsBtn.addEventListener('click', () => {
  settingsModal.classList.toggle('hidden');
  settingsBtn.classList.toggle('rotated');
});

// Setting vibration on/off 
function vibrate() {
  const vibrationToggle = document.getElementById("vibrationToggle");
  if (vibrationToggle.checked && "vibrate" in navigator) {
    navigator.vibrate(6);
  }
}


// Setting dark/white mode
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkModeToggle.checked);
});