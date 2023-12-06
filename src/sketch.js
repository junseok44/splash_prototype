// let isAttackWithExpansion = true;
// let isDefenseWithExpansion = true;
// let isAttackWithReverse = true; //makes Defense to go Reverse
// let isDefenseWithReverse = true; //makes Attack to go Reverse
// let isAttackWithFreeze = true;
// let isDefenseWithFreeze = true;

let photos = [];
let choices = [];
let currentPhoto;
let currentChoice;
let backgroundImage;
let foregroundImage;
let finalImage;
let finalImage1;

let showSecondImage = false;
let secondImageTimer = 0;
let randomImages;
let randomImageTimer = 0;
let foregroundVisible = false;
let currentRandomImage = null;
//percentages
let pinkPercentage = 0;
// let lastUpdateTime = 0;
let inkAreaRatio = 0;

//extra
let picWidth;
let picHeight;

let player1;
let player2;
let bullets = [];
let pg;
let ink;
let ui;
let itemManager;

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

  pg = createGraphics(windowWidth, windowHeight);
  pg.noStroke();

  system = new System({ pg });
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
  ui = new UI({ player1, player2, width, height });
  itemManager = new ItemManager();

  rectMode(CENTER);

  player2.minimiInitialize();

  // setInterval(() => {
  //   system.calculateInkAreaRatio();
  // }, 5000);
}

let isDisplayFirstItem = false;

let itemDisplayInterval = 3 * System.frameRate;
let secondItemDisplayInterval = 3000;
let firstItemDisplayDuration = 4000;

let secondItemImage;
let itemEater;

let currentItemType;

function draw() {
  switch (system.phase) {
    case System.PHASE.INTRO:
      break;
    case System.PHASE.SELECT_CHARACTER:
      break;
    case System.PHASE.TUTORIAL:
      break;
    case System.PHASE.MAIN_GAME:
      image(backgroundImage, 0, 0, width, height);
      image(pg, 0, 0);

      // 메인 게임 ui
      ui.drawMainGameScreen(system.inkAreaRatio);

      // 플레이어1, 플레이어2 그리기
      player1.display();
      player2.display();

      // 죽지 않았을때만 움직이고 공격가능.
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

      // 미니미와 공격자 충돌 계산.
      for (let i = 0; i < player2.minimiX.length; i++) {
        if (
          player1.isCollidedWithCircle({
            coordX: player2.x + player2.minimiX[i],
            coordY: player2.y + player2.minimiY[i],
            width: player2.minimiSize,
          })
        ) {
          player1.hit();
          if (player1.life == 0) {
            player1.dead();
          }
        }
      }

      //minimi와 bullet의 충돌 계산.
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

      // 플레이어1과 플레이어2의 충돌 계산.
      player1.isCollidedWithPlayer({
        x: player2.x,
        y: player2.y,
        radius: Math.sqrt(
          Math.pow(player2.width / 2, 2) + Math.pow(player2.height / 2, 2)
        ),
      });

      // 플레이어2와 플레이어1의 충돌 계산.
      player2.isCollidedWithPlayer({
        x: player1.x,
        y: player1.y,
        radius: Math.sqrt(
          Math.pow(player1.width / 2, 2) + Math.pow(player1.height / 2, 2)
        ),
      });

      break;
    case System.PHASE.GAME_RESULT:
      break;
  }

  // 10초마다 잉크 계산.
  // if (millis() - lastUpdateTime > 10000) {
  // pinkPercentage = calculatePinkPercentage();
  // lastUpdateTime = millis();
  // }

  // 10초에 한번씩

  if (!system.isEndGame) {
    // 15초마다 한번씩 띄운다.
    // 2초뒤에는 사라진다.
    // 만약 키를 누르면? 랜덤이미지를 띄운다.
    // 랜덤이미지는 3초간 띄운다.
    // 그 다음 아이템 슬롯으로 보낸다. 지속시간은? 5초라고 하자.

    // 랜덤 아이템 표시인 ? 를 표시하고, 사라지게 하는 로직
    if (frameCount % itemDisplayInterval == 0) {
      isDisplayFirstItem = true;
      setTimeout(() => {
        isDisplayFirstItem = false;
      }, firstItemDisplayDuration);
    }

    if (isDisplayFirstItem) {
      ui.drawGameItemImage(foregroundImage);
      // 여기서 이제 t키나, p키가 눌렸을때? 랜덤이미지를 띄운다.
      // T가 84, p가 80임.
      // 근데 먹지 않았을때도 아이템이 눌리면 패널티를 주는것은?

      if (keyIsDown(84) || keyIsDown(80)) {
        if (keyCode == 84) {
          itemEater = player1;
        } else if (keyCode == 80) {
          itemEater = player2;
        }

        // TODO: 지금 고민되는것은.
        // 아이템 종류와 이미지가 결합되어있는데, 이거를 하나로 묶을것인지.
        secondItemImage = random(randomImages);
        console.log("set second image");
        setTimeout(() => {
          console.log("null second image");
          secondItemImage = null;
        }, secondItemDisplayInterval);

        // TODO: 시스템으로 보낸다. 무엇을? 먹은 사람과, 아이템 코드를.
        // system.activateItemEffect(itemEater, itemType);

        // TODO: 나중에 currentItem과 currentItemImage를 초기화해주기!

        isDisplayFirstItem = false;

        // FIXME : 만약에 두번째 아이템이 사라지지 않았는데도, 첫번째 아이템이 나오는경우를 막으려면.

        // 그 다음 각 플레이어의 아이템 슬롯에 보내준다.
      }
    }

    if (secondItemImage) {
      ui.drawGameItemImage(secondItemImage);
    }
  } else {
    let resultImage;

    if (system.inkAreaRatio > 50) {
      resultImage = finalImage1;
    } else {
      resultImage = finalImage;
    }

    ui.drawGameResultScreen(resultImage);
  }

  // Control the visibility of the item image
  // if (secondImageTimer > 0) {
  //   // Check if foregroundImage should be visible
  //   if (foregroundVisible) {
  //     // Align foregroundImage to the center of the screen and make it smaller
  //     let x = width / 2 - foregroundImage.width / 4;
  //     let y = height / 2 - foregroundImage.height / 4;
  //     let smallerWidth = foregroundImage.width / 2;
  //     let smallerHeight = foregroundImage.height / 2;
  //     image(foregroundImage, x, y + 80, smallerWidth, smallerHeight);

  //     // Listen for key presses during the visibility of foregroundImage
  //     if (
  //       keyIsPressed &&
  //       (key === "T" || key === "t" || key === "P" || key === "p")
  //     ) {
  //       pickRandomPhoto();
  //       pickRandomChoice();

  //       foregroundVisible = false; // Hide foregroundImage when random image is displayed
  //     }
  //   }

  //   secondImageTimer--;
  // } else if (countdown <= 0) {
  //   // 게임이 끝났을때.
  // } else {
  //   // 12초마다 한번씩 랜덤 이지를 띄우자.
  //   showSecondImage = frameCount % 1200 === 0;
  //   if (showSecondImage) {
  //     secondImageTimer = 120;
  //     foregroundVisible = true; // Show foregroundImage
  //   }
  // }

  // TODO: 카운트다운은 system과 ui단으로 분리.

  textSize(80);
  fill(0);
  textAlign(CENTER, CENTER);
  text(system.countdown, width / 2, height / 5.4);

  // Update the countdown every second
  if (frameCount % 60 === 0 && system.countdown > 0) {
    system.timeLapse();
  }

  // Draw random image if a key was pressed during the foregroundImage
  // if (randomImageTimer > 0 && currentPhoto) {
  //   // Draw the current random image on top
  //   let imgX = width / 2 - currentPhoto.width / 4;
  //   let imgY = height / 2 - currentPhoto.height / 4;
  //   let imgWidth = currentPhoto.width / 2;
  //   let imgHeight = currentPhoto.height / 2;
  //   image(currentPhoto, imgX, imgY + 80, imgWidth, imgHeight);
  //   randomImageTimer--;

  //   // Hide foregroundImage when random image is displayed
  //   foregroundVisible = false;

  //   if (randomImageTimer > 0 && currentChoice) {
  //     let picWidth = currentChoice.width / 8;
  //     let picHeight = currentChoice.height / 8;

  //     randomImageTimer--;
  //     image(
  //       currentChoice,
  //       imgX + imgWidth / 2 - picWidth / 2,
  //       imgY + 80 + imgHeight,
  //       picWidth,
  //       picHeight
  //     );

  //     // Hide foregroundImage when random image is displayed
  //     foregroundVisible = false;
  //   }

  //   if (currentPhoto === photos[0] && currentChoice === choices[0]) {
  //     //공격 - 가속 - 추가필요
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[0] && currentChoice === choices[1]) {
  //     //수비 - 가속 - 추가필요
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[1] && currentChoice === choices[0]) {
  //     // 공격 - 얼음(상대방)
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = true;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[1] && currentChoice === choices[1]) {
  //     // 수비 - 얼음(상대방)
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = true;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[2] && currentChoice === choices[0]) {
  //     //공격 - 확장
  //     isAttackWithExpansion = true;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[2] && currentChoice === choices[1]) {
  //     //수비 - 확장
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = true;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[3] && currentChoice === choices[0]) {
  //     //공격 - 대마왕(상대방)
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = true;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[3] && currentChoice === choices[1]) {
  //     //수비 - 대마왕(상대방)
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = true;
  //   } else if (currentPhoto === photos[4] && currentChoice === choices[0]) {
  //     //공격 - 본인 감속 - 추가필요
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   } else if (currentPhoto === photos[4] && currentChoice === choices[1]) {
  //     //수비 - 본인 감속 - 추가필요
  //     isAttackWithExpansion = false;
  //     isDefenseWithExpansion = false;
  //     isAttackWithFreeze = false;
  //     isDefenseWithFreeze = false;
  //     isAttackWithReverse = false;
  //     isDefenseWithReverse = false;
  //   }

  //   if (isAttackWithExpansion) {
  //     ink.changeInkPatternSize(60);
  //     // Reset the boolean variable after 5000 milliseconds (5 seconds)
  //     setTimeout(() => {
  //       ink.changeInkPatternSize(ink.originalInkMaxSize);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }

  //   if (isDefenseWithExpansion) {
  //     player2.changeCleanAreaOffset(30);
  //     setTimeout(() => {
  //       player2.changeCleanAreaOffset(0);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }

  //   if (isAttackWithReverse) {
  //     player2.changeControlsForAttackWithReverse();
  //     setTimeout(() => {
  //       player2.changeControls(37, 39, 38, 40, 188, 190, 191);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }

  //   if (isDefenseWithReverse) {
  //     player1.changeControlsForDefenseWithReverse();
  //     setTimeout(() => {
  //       player1.changeControls(65, 68, 87, 83, 81, 69, 82);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }

  //   if (isAttackWithFreeze) {
  //     player2.changeControlsForAttackWithFreeze();
  //     setTimeout(() => {
  //       player2.changeControls(37, 39, 38, 40, 188, 190, 191);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }

  //   if (isDefenseWithFreeze) {
  //     player1.changeControlsForDefenseWithFreeze();
  //     setTimeout(() => {
  //       player1.changeControls(65, 68, 87, 83, 81, 69, 82);
  //       isAttackWithExpansion = false;
  //     }, 5000);
  //   }
  // }

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
