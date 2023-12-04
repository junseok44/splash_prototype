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
    //attack: 191,
    pg: pg,
  });
  ink = new InkPattern(100);
  ui = new UI({ player1, player2 });

  player2.minimiInitialize();
  setInterval(() => {
    calculateInkAreaRatio(); // 잉크 면적 비율 계산
  }, 10000);
}

let inkAreaRatio = 0;
function calculateInkAreaRatio() {
  pg.loadPixels();

  let totalPixels = pg.pixels.length / 4;
  let inkedPixels = 0;

  for (let i = 0; i < pg.pixels.length; i += 4) {
    let r = pg.pixels[i];
    let g = pg.pixels[i + 1];
    let b = pg.pixels[i + 2];
    let a = pg.pixels[i + 3];

    // 특정 색상 (rgb(255,78,202))이면 inkedPixels를 증가
    if (colorMatch(r, g, b, a, 255, 78, 202, 255, 100)) {
      inkedPixels++;
    }
  }
  pg.updatePixels();

  // inkAreaRatio를 100이 넘지 않도록 조정
  inkAreaRatio = min((inkedPixels / totalPixels) * 100, 100);

  // inkAreaRatio를 0 미만으로 되지 않도록 조정
  inkAreaRatio = max(inkAreaRatio, 0);

  return inkAreaRatio;
}

function colorMatch(r1, g1, b1, a1, r2, g2, b2, a2, threshold = 20) {
  return (
    Math.abs(r1 - r2) <= threshold &&
    Math.abs(g1 - g2) <= threshold &&
    Math.abs(b1 - b2) <= threshold &&
    Math.abs(a1 - a2) <= threshold
  );
}

function drawMainGameScreen() {
  textSize(15);
  text(`Attacker: ${inkAreaRatio.toFixed(0)}%`, 10, 60);

  text(`Defender:${100 - inkAreaRatio.toFixed(0)}%`, 10, 80);

  text("플레이어1 이동: wasd 회전 qe 잉크총 발사 r", 10, 20);
  text("플레이어2 이동: 방향키 회전 < > 바닥 청소 /", 10, 40);
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

  switch (phase) {
    case "intro":
      break;
    case "select_character":
      break;
    case "tutorial":
      break;
    case "main_game":
      drawMainGameScreen(); // 게임 화면 그리기
      // 프로토타입은 여기서만 코드 작성해주세요~

      image(pg, 0, 0);
      ui.drawMainGameScreen();

      player1.display();
      player2.display();

      if (!player1.isDead) {
        player1.move();
        player1.attack();
      }

      if (!player2.isDead) {
        player2.move();
        player2.attack();
      }

      //minimi 보이기
      player2.minimiDisplay();

      for (let i = 0; i < player2.minimiArray.length; i++) {
        let minimi = player2.minimiArray[i];

        // push();
        // fill(255, 0, 0);
        // ellipse(minimi.x, minimi.y, minimi.width, minimi.width);
        // pop();
        if (
          player1.isCollidedWithCircle({
            coordX: minimi.x,
            coordY: minimi.y,
            width: minimi.width,
          })
        ) {
          player1.hit();
          if (player1.life == 0) {
            player1.dead();
          }
        }
      }

      //minimi, bullet 충돌
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();

        player2.minimiCollide(bullets[i]);

        if (bullets[i].isEnd && bullets[i].isEndDrawing) {
          // 총알이 끝까지 가서 잉크가 퍼졌을때.
          bullets.splice(i, 1);
        } else {
          if (!player2.isDead && player2.isCollidedWithCircle(bullets[i])) {
            // 총알이 플레이어에 맞았을때.
            bullets.splice(i, 1);
            player2.hit();
            if (player2.life == 0) {
              player2.dead();
            }
          }
        }
      }

      player1.isCollidedWithPlayer({
        x: player2.x,
        y: player2.y,
        radius: Math.sqrt(
          Math.pow(player2.width / 2, 2) + Math.pow(player2.height / 2, 2)
        ),
      });
      player2.isCollidedWithPlayer({
        x: player1.x,
        y: player1.y,
        radius: Math.sqrt(
          Math.pow(player1.width / 2, 2) + Math.pow(player1.height / 2, 2)
        ),
      });

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
