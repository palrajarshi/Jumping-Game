const startbtn = document.getElementById("startbtn");
const pausebtn = document.getElementById("pausebtn");
const scorebox = document.querySelector(".scoreBox");
const player = document.getElementById("player");
const monster = document.getElementById("monster");
const gameover = document.querySelector(".game-overBox");
const container = document.querySelector(".game-Container");

// Audio
const audio = document.getElementById("audio-start");
const audio_over = document.getElementById("audio-over");
const audio_jump = document.getElementById("audio-jump");

// Array Images
const arr = [
  "images/qiqi.png",
  "images/anemoslime.png",
  "images/xiao1.jpg",
  "images/monster.png",
  "images/mons3.jpg",
  "images/fungi.jpg",
];

let score = 0;
// let ani_dur = 4;
let bgColTransparency = 0;
let intervalID;
paused = true;
// Player Movement
const movePlayer = (e) => {
  console.log("Key code is", e.code);
  if (e.code == "ArrowUp") {
    audio_jump.currentTime = 0;
    audio_jump.play();
    player.classList.add("animatePlayer");
    setTimeout(() => {
      player.classList.remove("animatePlayer");
    }, 1005);
  }
};

// Monster Movement
const moveMonster = () => {
  monster.classList.add("animateMonster");
};
// Pause Btn
pausebtn.disabled = true;
pausebtn.addEventListener("click", () => {
  if (paused) {
    clearInterval(intervalID);
    monster.classList.add("pause-animation");
    player.classList.add("pause-animation");
    pausebtn.classList.add("color-btn");
    audio.pause();
    paused = false;
  } else {
    intervalID = setInterval(updateScore, 60);
    monster.classList.remove("pause-animation");
    player.classList.remove("pause-animation");
    pausebtn.classList.remove("color-btn");
    audio.play();
    paused = true;
  }
});
// Start Btn
startbtn.addEventListener("click", () => {
  monster.style.display = "block";
  // Reset score, bgtransparency
  score = 0;
  bgColTransparency = 0;
  document.body.style.backgroundColor = `rgb(246,5,5, ${bgColTransparency}%)`;
  // Stop gameover music and hide gameover text
  audio_over.pause();
  gameover.style.opacity = "0";
  // Disable Start btn and enable pause btn upon click
  startbtn.disabled = true;
  pausebtn.disabled = false;
  // update the Score
  intervalID = setInterval(updateScore, 60);
  // Start bg music
  audio.currentTime = 1;
  audio.play();

  // Player Movement enabled
  window.addEventListener("keydown", movePlayer);

  // Monster Starts Moving
  moveMonster();
});

// Add noon effect
const noonEffect = () => {
  bgColTransparency = bgColTransparency + 10;
  console.log("Opacity", bgColTransparency);
  document.body.style.backgroundColor = `rgb(246,5,5, ${
    bgColTransparency % 100
  }%)`;
};

// Increase Difficulty

const incDifficulty = () => {
  const animateMonster = document.querySelector(".animateMonster");
  const monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  let ani_dur = Number.parseFloat(
    getComputedStyle(animateMonster).animationDuration
  );
  new_dur = ani_dur;
  new_dur -= 0.1;
  if (monsterPosX > 1400 && monsterPosX < 1440 && new_dur > 2.5) {
    console.log("ani duration is", new_dur);
    changeMonster();
    animateMonster.style.animationDuration = `${new_dur}s`;
  }
};
// Set High Score and Update it inside HTML

const setHighscore = () => {
  let parsedItem = JSON.parse(localStorage.getItem("score")) || 0;
  highScore = parsedItem;
  if (score > highScore) {
    highScore = score;
    console.log(highScore);
    localStorage.setItem("score", JSON.stringify(highScore));
  }
  return highScore;
};

// Updates Score
const updateScore = () => {
  score++;
  incDifficulty();
  let newScore = setHighscore(score);
  scorebox.textContent = `Score: ${score}| High Score: ${newScore}`;
  // Change bgs
  if (score % 50 === 0) {
    noonEffect();
  }
};

// Check for Collision

const checkCollision = () => {
  // Computed Positions of Monster and Player
  monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  monsterPosY = Number.parseInt(getComputedStyle(monster).bottom);
  playerPosX = Number.parseInt(getComputedStyle(player).right);
  playerPosY = Number.parseInt(getComputedStyle(player).bottom);

  // console.log("Monster X", monsterPosX);
  // console.log("Monster Y", monsterPosY);
  // console.log("Player X", playerPosX);
  // console.log("Player Y", playerPosY);

  // Position difference between player and monster
  posDiff = Math.abs(playerPosX - monsterPosX);
  // console.log("PosDiff", posDiff);

  // Check gameover
  if (posDiff >= 0 && posDiff < 60 && playerPosY < 115) {
    const animateMonster = document.querySelector(".animateMonster");
    animateMonster.style.animationDuration = `4s`;
    monster.style.display = "none";
    console.log("Game over");
    clearInterval(intervalID);
    gameover.style.opacity = "1";
    audio.pause();
    audio_over.currentTime = 0;
    audio_over.play();
    monster.classList.remove("animateMonster");
    startbtn.disabled = false;
    pausebtn.disabled = true;
  }
};
setInterval(checkCollision, 100);

// Change Monster
const changeMonster = () => {
  monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  // console.log("posX", monsterPosX);
  let randInd = Math.floor(Math.random() * 6);
  console.log(randInd);
  monster.style.backgroundImage = `url(${arr[randInd]})`;
};

document.addEventListener("DOMContentLoaded", () => {
  const highScore = localStorage.getItem("score") || 0;
  scorebox.textContent = `Score: 0| High Score: ${highScore}`;
});
