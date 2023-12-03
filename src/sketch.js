let isAttackWithExpansion = true;
let isDefenseWithExpansion = true;
let isAttackWithReverse = true; //makes Defense to go Reverse
let isDefenseWithReverse = true; //makes Attack to go Reverse
let isAttackWithFreeze = true;
let isDefenseWithFreeze = true;

let photos = [];
let currentPhoto;
let choices = [];
let currentChoice;
let backgroundImage;
let foregroundImage;
let finalImage;
let finalImage1;
let countdown = 120;
let showSecondImage = false;
let secondImageTimer = 0;
let randomImages;
let randomImageTimer = 0;
let foregroundVisible = false;
let currentRandomImage = null;
//percentages
let pinkPercentage = 0;
let lastUpdateTime = 0;
//extra
let picWidth;
let picHeight;

let player1;
let player2;
let bullets = [];
let pg;
let ink;
let ui;
let phase = "main_game";

let BASE_DIR = "src/assets/image/";
function preload() {
  // Load your images
  // backgroundImage = loadImage("../src/assets/images/Chess Basic.png");
  backgroundImage = loadImage(BASE_DIR + "Chess Basic.png");
  foregroundImage = loadImage(BASE_DIR + "item.png");
  finalImage = loadImage(BASE_DIR + "Chess Map Winner.png");
  finalImage1 = loadImage(BASE_DIR + "Chess Map Winner 1.png");

  console.log(BASE_DIR + "Chess Basic.png");

  // foregroundImage = loadImage("../src/assets/images/item.png");
  // finalImage = loadImage("../src/assets/images/Chess Map Winner.png");
  // finalImage1 = loadImage("../src/assets/images/Chess Map Winner 1.png");

  // Load additional images from your folder
  randomImages = [
    loadImage(BASE_DIR + "image10.png"),
    loadImage(BASE_DIR + "image11.png"),
    loadImage(BASE_DIR + "image12.png"),
    loadImage(BASE_DIR + "image13.png"),
    loadImage(BASE_DIR + "image14.png"),

    // loadImage("../src/assets/images/image10.png"),
    // loadImage("../src/assets/images/image11.png"),
    // loadImage("../src/assets/images/image12.png"),
    // loadImage("../src/assets/images/image13.png"),
    // loadImage("../src/assets/images/image14.png"),
  ];

  for (let i = 1; i <= 5; i++) {
    let photo = loadImage(BASE_DIR + `photo${i}.png`);
    photos.push(photo);
  }
  for (let i = 1; i <= 2; i++) {
    let pic = loadImage(BASE_DIR + `Pic${i}.png`);
    choices.push(pic);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  pg = createGraphics(windowWidth, windowHeight);
  pg.noStroke();
  player1 = new Attacker({
    x: windowWidth / 2 - 100,
    y: windowHeight / 2,
    width: 50,
    height: 50,
    bullets: bullets,
    color: "rgb(255,78,202)",
    l: 65,
    r: 68,
    u: 87,
    d: 83,
    rotate_l: 81,
    rotate_r: 69,
    attack: 82,
  });
  player2 = new Defender({
    x: windowWidth / 2 + 100,
    y: windowHeight / 2,
    width: 50,
    height: 50,
    bullets: bullets,
    color: "rgb(0,255,125)",
    l: 37,
    r: 39,
    u: 38,
    d: 40,
    rotate_l: 188,
    rotate_r: 190,
    attack: 191,
    pg: pg,
  });
  ink = new InkPattern(100);
  ui = new UI();
}

function draw() {
  //background image settings
  image(backgroundImage, 0, 0, width, height);
  //percentage(pixels)
  if (millis() - lastUpdateTime > 10000) {
    // pinkPercentage = calculatePinkPercentage();
    lastUpdateTime = millis();
  }

  textAlign(CENTER, CENTER);
  textSize(40);
  textStyle(BOLD);
  fill(80, 165, 215);
  text(nf(pinkPercentage, 2, 1), width / 18, height / 3.2);
  fill(115, 20, 150);
  text(100 - nf(pinkPercentage, 2, 1), (16.93 * width) / 18, height / 3.2);
  image(pg, 0, 0);

  function calculatePinkPercentage() {
    let pinkCount = 0;

    // Loop through each pixel on the canvas
    for (let x = pg.width / 8; x < (7 * pg.width) / 8; x++) {
      for (let y = pg.height / 4; y < pg.height; y++) {
        // Get the color of the pixel
        let pixelColor = pg.get(x, y);

        // Check if the pixel color is pink
        if (
          pixelColor[0] === 255 && // Red
          pixelColor[1] === 78 && // Green
          pixelColor[2] === 202 // Blue
        ) {
          pinkCount++;
        }
      }
    }

    // Calculate the percentage of pink pixels
    let totalPixels = (width * height * 9) / 16;
    pinkPercentage = (pinkCount / totalPixels) * 100;
    return pinkPercentage;
  }

  ui.drawUI(phase);

  switch (phase) {
    case "intro":
      break;
    case "select_character":
      break;
    case "tutorial":
      break;
    case "main_game":
      // 프로토타입은 여기서만 코드 작성해주세요~

      image(pg, 0, 0);

      player1.display();
      player1.move();
      player1.attack();

      player2.display();
      player2.move();
      player2.attack();

      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();
      }
      break;
    case "game_result":
      break;
  }

  // Control the visibility of the item image
  if (secondImageTimer > 0) {
    // Check if foregroundImage should be visible
    if (foregroundVisible) {
      // Align foregroundImage to the center of the screen and make it smaller
      let x = width / 2 - foregroundImage.width / 4;
      let y = height / 2 - foregroundImage.height / 4;
      let smallerWidth = foregroundImage.width / 2;
      let smallerHeight = foregroundImage.height / 2;
      image(foregroundImage, x, y + 80, smallerWidth, smallerHeight);

      // Listen for key presses during the visibility of foregroundImage
      if (
        keyIsPressed &&
        (key === "T" || key === "t" || key === "P" || key === "p")
      ) {
        pickRandomPhoto();
        foregroundVisible = false; // Hide foregroundImage when random image is displayed
      }

      if (
        keyIsPressed &&
        (key === "T" || key === "t" || key === "P" || key === "p")
      ) {
        pickRandomChoice();
        foregroundVisible = false; // Hide foregroundImage when random image is displayed
      }
    }

    secondImageTimer--;
  } else if (countdown <= 0) {
    //winner image
    if (pinkPercentage < 50) {
      image(finalImage, 0, 0, width, height);
    } else {
      image(finalImage1, 0, 0, width, height);
    }
  } else {
    showSecondImage = frameCount % 300 === 0;
    if (showSecondImage) {
      secondImageTimer = 120;
      foregroundVisible = true; // Show foregroundImage
    }
  }

  // Display the countdown timer on top
  textSize(80);
  fill(0);
  textAlign(CENTER, CENTER);
  text(countdown, width / 2, height / 5.4);

  // Update the countdown every second
  if (frameCount % 60 === 0 && countdown > 0) {
    countdown--;
  }

  // Draw random image if a key was pressed during the foregroundImage
  if (randomImageTimer > 0 && currentPhoto) {
    // Draw the current random image on top
    let imgX = width / 2 - currentPhoto.width / 4;
    let imgY = height / 2 - currentPhoto.height / 4;
    let imgWidth = currentPhoto.width / 2;
    let imgHeight = currentPhoto.height / 2;
    image(currentPhoto, imgX, imgY + 80, imgWidth, imgHeight);
    randomImageTimer--;

    // Hide foregroundImage when random image is displayed
    foregroundVisible = false;

    if (randomImageTimer > 0 && currentChoice) {
      let picWidth = currentChoice.width / 8;
      let picHeight = currentChoice.height / 8;

      randomImageTimer--;
      image(
        currentChoice,
        imgX + imgWidth / 2 - picWidth / 2,
        imgY + 80 + imgHeight,
        picWidth,
        picHeight
      );

      // Hide foregroundImage when random image is displayed
      foregroundVisible = false;
    }

    if (currentPhoto === photos[0] && currentChoice === choices[0]) {
      //공격 - 가속 - 추가필요
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[0] && currentChoice === choices[1]) {
      //수비 - 가속 - 추가필요
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[1] && currentChoice === choices[0]) {
      // 공격 - 얼음(상대방)
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = true;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[1] && currentChoice === choices[1]) {
      // 수비 - 얼음(상대방)
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = true;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[2] && currentChoice === choices[0]) {
      //공격 - 확장
      isAttackWithExpansion = true;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[2] && currentChoice === choices[1]) {
      //수비 - 확장
      isAttackWithExpansion = false;
      isDefenseWithExpansion = true;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[3] && currentChoice === choices[0]) {
      //공격 - 대마왕(상대방)
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = true;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[3] && currentChoice === choices[1]) {
      //수비 - 대마왕(상대방)
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = true;
    } else if (currentPhoto === photos[4] && currentChoice === choices[0]) {
      //공격 - 본인 감속 - 추가필요
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    } else if (currentPhoto === photos[4] && currentChoice === choices[1]) {
      //수비 - 본인 감속 - 추가필요
      isAttackWithExpansion = false;
      isDefenseWithExpansion = false;
      isAttackWithFreeze = false;
      isDefenseWithFreeze = false;
      isAttackWithReverse = false;
      isDefenseWithReverse = false;
    }

    if (isAttackWithExpansion) {
      ink.changeInkPatternSize(60);
      // Reset the boolean variable after 5000 milliseconds (5 seconds)
      setTimeout(() => {
        ink.changeInkPatternSize(ink.originalInkMaxSize);
        isAttackWithExpansion = false;
      }, 5000);
    }

    if (isDefenseWithExpansion) {
      player2.changeCleanAreaOffset(30);
      setTimeout(() => {
        player2.changeCleanAreaOffset(0);
        isAttackWithExpansion = false;
      }, 5000);
    }

    if (isAttackWithReverse) {
      player2.changeControlsForAttackWithReverse();
      setTimeout(() => {
        player2.changeControls(37, 39, 38, 40, 188, 190, 191);
        isAttackWithExpansion = false;
      }, 5000);
    }

    if (isDefenseWithReverse) {
      player1.changeControlsForDefenseWithReverse();
      setTimeout(() => {
        player1.changeControls(65, 68, 87, 83, 81, 69, 82);
        isAttackWithExpansion = false;
      }, 5000);
    }

    if (isAttackWithFreeze) {
      player2.changeControlsForAttackWithFreeze();
      setTimeout(() => {
        player2.changeControls(37, 39, 38, 40, 188, 190, 191);
        isAttackWithExpansion = false;
      }, 5000);
    }

    if (isDefenseWithFreeze) {
      player1.changeControlsForDefenseWithFreeze();
      setTimeout(() => {
        player1.changeControls(65, 68, 87, 83, 81, 69, 82);
        isAttackWithExpansion = false;
      }, 5000);
    }
  }

  function pickRandomPhoto() {
    // Pick a random image
    currentPhoto = random(photos);
    randomImageTimer = 600; // Display the random image for 3 seconds (3 * 60 frames)
  }

  function pickRandomChoice() {
    currentChoice = random(choices);
    randomImageTimer = 600;
  }
}
