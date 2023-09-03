const player = document.getElementById("player");
const monster = document.getElementById("monster");
const gameover = document.querySelector(".game-overBox");
const startbtn = document.getElementById("startbtn");
const audio = document.getElementById("audio-start");
const audio_over = document.getElementById("audio-over");
const audio_main = document.getElementById("audio-main");
const scorebox = document.querySelector(".scoreBox");
let intervalID;
let score = 0;
// Player Movements
window.onkeydown = (e) => {
  console.log("The key code is ", e.keyCode);
  if (e.keyCode === 38) {
    player.classList.add("animatePlayer");
    setTimeout(() => {
      player.classList.remove("animatePlayer");
    }, 1205);
  }
};

// Check for collision

const checkCollision = () => {
  const monsterPos = monster.getBoundingClientRect();
  const playerPos = player.getBoundingClientRect();

  const offsetX_Mons = Math.floor(monsterPos.left);
  const offsetY_Mons = Math.floor(monsterPos.top);
  const offsetX_Player = Math.floor(playerPos.left);
  const offsetY_Player = Math.floor(playerPos.top);

  //   console.log("OffsetX Monster", offsetX_Mons);
  //   console.log("OffsetY Monster", offsetY_Mons);
  //   console.log("OffsetX player", offsetX_Player);
  //   console.log("OffsetY player", offsetY_Player);

  const offsetXdiff = Math.abs(offsetX_Mons - offsetX_Player);
  const offsetYdiff = Math.abs(offsetY_Mons - offsetY_Player);
  //   console.log("offsetX difference", offsetXdiff);
  //   console.log("offsetY difference", offsetYdiff);
  if (offsetXdiff >= 0 && offsetXdiff < 90 && offsetYdiff < 70) {
    console.log("Game over");
    gameover.style.opacity = "1";
    audio.pause();
    audio_over.currentTime = 0;
    audio_over.play();
    const animateMonster = document.querySelector(".animateMonster");
    animateMonster.style.animationDuration = "5s";
    const currentRight = parseInt(getComputedStyle(animateMonster).right);
    monster.style.right = currentRight + "px";
    monster.classList.remove("animateMonster");
    score = 0;
    clearInterval(intervalID);
    startbtn.disabled = false;
  }
};
setInterval(checkCollision, 100);

// Increase Difficulty
const incDifficulty = () => {
  const monsterPos = monster.getBoundingClientRect();
  const offsetX_Mons = Math.floor(monsterPos.left);
  console.log("Mons pos", offsetX_Mons);
  const animateMonster = document.querySelector(".animateMonster");
  let ani_dur = Number.parseFloat(
    getComputedStyle(animateMonster).getPropertyValue("animation-duration")
  );
  console.log("Duration before", ani_dur);
  if (offsetX_Mons < 0) {
    if (ani_dur > 2) {
      console.log("Decrementing");
      let new_dur = ani_dur - 1;
      animateMonster.style.animationDuration = `${new_dur}s`;
    }
  }
};

// Update Score
const updateScore = () => {
  score = score + 1;
  scorebox.innerHTML = `Score: ${score}`;
  incDifficulty();
};

// Start Button

startbtn.addEventListener("click", () => {
  monster.classList.add("animateMonster");
  intervalID = setInterval(updateScore, 60);
  gameover.style.opacity = "0";
  audio_over.pause();
  audio.currentTime = 1;
  audio.play();
  startbtn.disabled = true;
});
