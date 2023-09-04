//1. Target Elements in the DOM
const startbtn = document.getElementById("startbtn");
const pausebtn = document.getElementById("pausebtn");
const scorebox = document.querySelector(".scoreBox");
const player = document.getElementById("player");
const monster = document.getElementById("monster");
const gameover = document.querySelector(".game-overBox");
const container = document.querySelector(".game-Container");

//2. Audio
const audio = document.getElementById("audio-start");
const audio_over = document.getElementById("audio-over");
const audio_jump = document.getElementById("audio-jump");

//3. Array Images
const arr = [
  "images/qiqi.png",
  "images/anemoslime.png",
  "images/xiao1.jpg",
  "images/monster.png",
  "images/mons3.jpg",
  "images/fungi.jpg",
];

//4. Variable Declarations
let score = 0;
let bgColTransparency = 0;
let intervalID;
paused = true;

//5. Player Movement
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

//6. Monster Movement
const moveMonster = () => {
  monster.classList.add("animateMonster");
};

//7. Pause Btn
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

//8. Start Btn
startbtn.addEventListener("click", () => {
  monster.style.display = "block";

  //8.1 Reset score, bgtransparency
  score = 0;
  bgColTransparency = 0;
  document.body.style.backgroundColor = `rgb(246,5,5, ${bgColTransparency}%)`;

  //8.2 Stop Gameover music and hide Gameover text
  audio_over.pause();
  gameover.style.opacity = "0";

  //8.3 Disable Start btn and enable pause btn upon click
  startbtn.disabled = true;
  pausebtn.disabled = false;

  //8.4 Update the Score
  intervalID = setInterval(updateScore, 60);
  // Start bg music
  audio.currentTime = 1;
  audio.play();

  //8.5 Player Movement enabled
  window.addEventListener("keydown", movePlayer);

  //8.6 Monster Starts Moving
  moveMonster();
});

//9. Add noon effect
const noonEffect = () => {
  bgColTransparency = bgColTransparency + 10;
  console.log("Opacity", bgColTransparency);
  document.body.style.backgroundColor = `rgb(246,5,5, ${
    bgColTransparency % 100
  }%)`;
};

//10. Increase Difficulty
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

//11. Set High Score and Update it inside HTML
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

//12. Updates Score
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

//13. Check for Collision
const checkCollision = () => {

  //13.1 Computed Positions of Monster and Player
  monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  monsterPosY = Number.parseInt(getComputedStyle(monster).bottom);
  playerPosX = Number.parseInt(getComputedStyle(player).right);
  playerPosY = Number.parseInt(getComputedStyle(player).bottom);

  // console.log("Monster X", monsterPosX);
  // console.log("Monster Y", monsterPosY);
  // console.log("Player X", playerPosX);
  // console.log("Player Y", playerPosY);

  //13.2 Position difference between player and monster
  posDiff = Math.abs(playerPosX - monsterPosX);
  // console.log("PosDiff", posDiff);

  //13.3 Check Gameover
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

//14. Change Monster
const changeMonster = () => {
  monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  // console.log("posX", monsterPosX);
  let randInd = Math.floor(Math.random() * 6);
  console.log(randInd);
  monster.style.backgroundImage = `url(${arr[randInd]})`;
};

//15. Fetch Highscore from localStorage when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const highScore = localStorage.getItem("score") || 0;
  scorebox.textContent = `Score: 0| High Score: ${highScore}`;
});
