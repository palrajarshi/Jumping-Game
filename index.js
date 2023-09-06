// Sections:
// 1. Target Elements in the DOM
// 2. Audio
// 3. Array Images
// 4. Variable Declarations
// 5. Player Movement
// 6. Monster Movement
// 7. Pause Btn
// 8. Start Btn
// 8.1 Reset score, bgtransparency
// 8.2 Stop Gameover music and hide Gameover text
// 8.3 Disable Start btn and enable pause btn upon click
// 8.4 Update the Score
// 8.5 Player Movement enabled
// 8.6 Monster Starts Moving
// 9. Add noon effect
// 10. Increase Difficulty
// 11. Set High Score and Update it inside HTML
// 12. Updates Score
// 13. Check for Collision
// 13.1 Computed Positions of Monster and Player
// 13.2 Position difference between player and monster
// 13.3 Check Gameover for diff monsters
// 14.Change Monster
// 15.Fetch Highscore from localStorage when DOM is loaded
// 16.Gameover Function
// 17. Toggle Fly on power up
// 17.1 Stop Fly function to stop flying
// 17.2 Toggle Fly function called when powerup interacts with player
// 17.3 Set a new timeout to stop flying after 6 seconds
// 18. Background and Character Change
// 18.1 Array and Index declaration
// 18.2 Menu Button
// 18.3 Cancel Button
// 18.4 Change Bg options: (left/ next)
// 18.5 Change bg options: (left/ previous)
// 18.6 Select bg(using css variable)
// 18.7 Set index to local Storage upon bg Selection
// 18.8 Get selected index from local storage
// ===> 18.8.1 Load Images
// 18.9 Toggle between Titlebg and Char

// Code Section Starts here-->
//1. Target Elements in the DOM
const startbtn = document.getElementById("startbtn");
const pausebtn = document.getElementById("pausebtn");
const menubtn = document.getElementById("menubtn");
const cancelbtn = document.getElementById("btn-cancel");
const btnleft = document.getElementById("btn-left");
const btnright = document.getElementById("btn-right");
const btnsel = document.getElementById("btnsel");
const scorebox = document.querySelector(".scoreBox");
const player = document.getElementById("player");
const monster = document.getElementById("monster");
const gameover = document.querySelector(".messageBox");
const container = document.querySelector(".game-Container");
const menubox = document.querySelector(".container");
const statusbox = document.querySelector(".statusbar");
const bar = document.querySelector(".bar");
const img = document.querySelector(".img-box img");

//2. Audio
const audio = document.getElementById("audio-start");
const audio_over = document.getElementById("audio-over");
const audio_jump = document.getElementById("audio-jump");
const audio_fly = document.getElementById("audio-fly");

//3. Array Images
const arr = [
  "images/qiqi.png",
  "images/anemoslime.png",
  "images/xiao1.jpg",
  "images/monster.png",
  "images/fungifly.jpg",
  "images/fungi.jpg",
  "images/powerfly.png",
  "images/paimon.jpg",
];

//4. Variable Declarations
let score = 0;
let bgColTransparency = 0;
let intervalID;
let paused = true;
let isAnimating = true;
let onAir = false;
let interval2;

//5. Player Movement
const movePlayer = (e) => {
  console.log("Key code:", e.code);
  if (isAnimating) {
    if (e.code == "ArrowUp" || e.code == "Space") {
      audio_jump.currentTime = 0;
      audio_jump.play();
      player.classList.add("animatePlayer");
      isAnimating = false;
      setTimeout(() => {
        player.classList.remove("animatePlayer");
        isAnimating = true;
      }, 1205);
    }
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
    console.log("Paused");
    clearInterval(intervalID);
    monster.classList.add("pause-animation");
    player.classList.add("pause-animation");
    statusbox.style.animationPlayState = "paused";
    pausebtn.classList.add("color-btn");
    audio.pause();
    audio_fly.pause();
    isAnimating = false;
    paused = false;
    clearTimeout(interval2);
  } else {
    intervalID = setInterval(updateScore, 60);
    monster.classList.remove("pause-animation");
    player.classList.remove("pause-animation");
    statusbox.style.animationPlayState = "running";
    pausebtn.classList.remove("color-btn");
    audio.play();
    isAnimating = true;
    paused = true;
    interval2 = setTimeout(stopFly, 6000);
    if (onAir) {
      audio_fly.play();
    }
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
  menubtn.disabled = true;

  //8.4 Update the Score
  intervalID = setInterval(updateScore, 60);
  // Start bg music
  audio.currentTime = 1;
  audio.play();

  //8.5 Player Movement enabled
  isAnimating = true;
  window.addEventListener("keydown", movePlayer);

  //8.6 Monster Starts Moving
  moveMonster();
});

//9. Add noon effect
const noonEffect = () => {
  bgColTransparency = bgColTransparency + 10;
  console.log("Bg Opacity:", bgColTransparency);
  document.body.style.backgroundColor = `rgb(246,5,5, ${
    bgColTransparency % 100
  }%)`;
};

//10. Increase Difficulty
const incDifficulty = (score) => {
  const animateMonster = document.querySelector(".animateMonster");
  const monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  let ani_dur = Number.parseFloat(
    getComputedStyle(animateMonster).animationDuration
  );
  new_dur = ani_dur;
  new_dur -= 0.1;
  console.log(
    "Present Animation Duration(Mons)/Normal: ",
    getComputedStyle(animateMonster).animationDuration
  );
  // console.log("Monster Present classes: ", monster.classList);
  if (monsterPosX > 1400 && monsterPosX < 1490) {
    changeMonster();
    if (score >= 580) {
      console.log("score crossed 500");
      animateMonster.style.animationDuration = `2.5s`;
    }
    if (score >= 810) {
      console.log("score crossed 760");
      animateMonster.style.animationDuration = `2s`;
    }
    if (score >= 1200) {
      console.log("score crossed 1200");
      animateMonster.style.animationDuration = `1.5s`;
    }
    if (new_dur >= 2.9) {
      console.log("Present Animation Duration(Mons)/Decrease Phase: ", new_dur);
      animateMonster.style.animationDuration = `${new_dur}s`;
    }
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
  incDifficulty(score);
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

  //13.3 Check Gameover for diff monsters
  if (
    getComputedStyle(monster).backgroundImage ===
      'url("http://127.0.0.1:5500/HTML%20CSS%20JAVASCRIPT/Game/images/anemoslime.png")' ||
    getComputedStyle(monster).backgroundImage ===
      'url("http://127.0.0.1:5500/HTML%20CSS%20JAVASCRIPT/Game/images/fungifly.jpg")' ||
    getComputedStyle(monster).backgroundImage ===
      'url("http://127.0.0.1:5500/HTML%20CSS%20JAVASCRIPT/Game/images/paimon.jpg")'
  ) {
    console.log("Adding Class incHeight");
    monster.classList.add("incHeight");
    if (posDiff >= 0 && posDiff < 80 && playerPosY >= 30 && playerPosY < 256) {
      gameOver();
    }
  } else if (
    getComputedStyle(monster).backgroundImage ===
      'url("http://127.0.0.1:5500/HTML%20CSS%20JAVASCRIPT/Game/images/powerfly.png")' &&
    posDiff >= 0 &&
    posDiff < 80 &&
    playerPosY < 125
  ) {
    toggleFly();
  } else if (posDiff >= 0 && posDiff < 80 && playerPosY < 125) {
    gameOver();
  }
};
setInterval(checkCollision, 100);

//14. Change Monster
const changeMonster = () => {
  // Checks if height is increased (for Anemo slime) and removes it
  if (monster.classList.contains("incHeight")) {
    console.log("Removing class incHeight");
    monster.classList.remove("incHeight");
  }
  monster.style.visibility = "visible";
  monsterPosX = Number.parseInt(getComputedStyle(monster).right);
  // console.log("posX", monsterPosX);
  let randInd = Math.floor(Math.random() * arr.length);
  console.log("Random Index Gen: ", randInd);
  monster.style.backgroundImage = `url(${arr[randInd]})`;
};

//15. Fetch Highscore from localStorage when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const highScore = localStorage.getItem("score") || 0;
  scorebox.textContent = `Score: 0| High Score: ${highScore}`;
});

// 16. Gameover Function
const gameOver = () => {
  const animateMonster = document.querySelector(".animateMonster");
  animateMonster.style.animationDuration = `4s`;
  monster.style.display = "none";
  console.log("Game over");
  clearInterval(intervalID);
  gameover.innerHTML = "Game Over";
  gameover.style.opacity = "1";
  statusbox.style.opacity = "1";
  audio.pause();
  audio_over.currentTime = 0;
  audio_over.play();
  monster.classList.remove("animateMonster");
  startbtn.disabled = false;
  pausebtn.disabled = true;
  menubtn.disabled = false;
  isAnimating = false;
};

// 17. Toggle Fly on power up

// 17.1 Stop Fly function to stop flying
const stopFly = (e) => {
  if (onAir || e.code === "KeyE") {
    console.log(e);
    gameover.style.opacity = "0";
    statusbox.style.opacity = "0";
    isAnimating = true;
    player.classList.remove("powerfly");
    statusbox.classList.remove("bar");
    audio_fly.pause();
    onAir = false;
  }
};

// 17.2 Toggle Fly function called when powerup interacts with player
const toggleFly = () => {
  onAir = true;
  gameover.innerHTML = `Press E to land`;
  // console.log("Power up active");
  audio_fly.currentTime = 0;
  audio_fly.play();
  monster.style.visibility = "hidden";
  player.classList.add("powerfly");
  statusbox.classList.add("bar");
  isAnimating = false;
  gameover.style.opacity = "1";
  if (interval2) {
    // console.log("Cleared");
    clearTimeout(interval2);
  }

  // 17.3 Set a new timeout to stop flying after 6 seconds
  interval2 = setTimeout(stopFly, 6000);
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyE") {
      stopFly(e);
    }
  });
};

// 18. Background and Character Change
// const addunderline = document.querySelector(".add-underline");
const titleBg = document.querySelector(".title-bg");
const titleChar = document.querySelector(".title-char");
let bgwindow = true;
// 18.1 Array and Index declaration
let index = 0;
let indChar = 0;
const bgarr = [
  "images/bg.png",
  "images/bg1.jpg",
  "images/bgimg2.jpg",
  "images/bgimg1.jpg",
];
const charArr = [
  "images/player.png",
  "images/ganyu.png",
  "images/zhongli.png",
  "images/barbara.png",
  "images/chongyun.png",
];

// 18.2 Menu Button
menubtn.addEventListener("click", () => {
  if (bgwindow) {
    img.src = "images/bg.png";
    console.log("Hellow");
    titleBg.classList.add("add-underline");
  }
  startbtn.disabled = true;
  menubox.style.transform = "translateY(20%)";
});

// 18.3 Cancel Button
cancelbtn.addEventListener("click", () => {
  startbtn.disabled = false;
  menubox.style.transform = "translateY(-100%)";
});

// 18.4 Change Bg options: (left/ next)
btnright.addEventListener("click", () => {
  if (bgwindow) {
    index = (index + 1) % bgarr.length;
    img.src = bgarr[index];
    console.log("right click, index: ", index);
  } else {
    indChar = (indChar + 1) % charArr.length;
    img.src = charArr[indChar];
    console.log("right click, index: ", indChar);
  }
});

// 18.5 Change bg options: (left/ previous)
btnleft.addEventListener("click", () => {
  if (bgwindow) {
    index = index - 1;
    if (index < 0) {
      index = bgarr.length - 1;
      console.log(index);
    }
    img.src = bgarr[index];
    console.log("left click, index: ", index);
  } else {
    indChar = indChar - 1;
    if (indChar < 0) {
      indChar = charArr.length - 1;
      console.log(indChar);
    }
    img.src = charArr[indChar];
    console.log("left click, index: ", indChar);
  }
});

//18.6 Select bg(using css variable) or Character

btnsel.addEventListener("click", () => {
  if (bgwindow) {
    //18.7 Set index to local Storage upon bg Selection
    localStorage.setItem("indexBg", JSON.stringify(index));
    console.log(localStorage);
    container.style.setProperty("--myvariable", `url(${bgarr[index]})`);
  }else{
    localStorage.setItem("indexChar", JSON.stringify(indChar));
    console.log(localStorage);
    player.style.backgroundImage =`url(${charArr[indChar]})`;
  }
});

//18.8 Get selected index from local storage
const getBg = JSON.parse(localStorage.getItem("indexBg")) || 0;
const getChar = JSON.parse(localStorage.getItem("indexChar")) || 0;
window.addEventListener("DOMContentLoaded", () => {
  container.style.setProperty("--myvariable", `url(${bgarr[getBg]})`);
  player.style.backgroundImage =`url(${charArr[getChar]})`;
});

// 18.9 Toggle between titlebg and char

titleBg.addEventListener("click", () => {
  img.src = `${bgarr[index]}`;
  bgwindow = true;
  titleBg.classList.add("add-underline");
  titleChar.classList.remove("add-underline");
});
titleChar.addEventListener("click", () => {
  img.src = `${charArr[indChar]}`;
  bgwindow = false;
  titleBg.classList.remove("add-underline");
  titleChar.classList.add("add-underline");
});
