let images = [];
let currentImageIndex = 0;
let AkeyImage;
let QeImage;
let defArImage;
let SpImage;
let LgImage;
let ReImage;

let xPosition = 0;
let yPosition = 0;

let player1;
let player2;
let bullets = [];
let pg;
let itemManager;
let ui;
let ink;

let gm;
let imageLib = new ImageLibrary();

function preload() {
  images.push(loadImage("src/assets/image/tutorial/Intro.png"));
  images.push(loadImage("src/assets/image/tutorial/Tutorial.png"));
  images.push(loadImage("src/assets/image/tutorial/OffTutorial.png"));
  images.push(loadImage("src/assets/image/tutorial/OffTutorial.png"));
  images.push(loadImage("src/assets/image/tutorial/DefTutorial.png"));
  images.push(loadImage("src/assets/image/tutorial/ChessMapBasic.png"));
  images.push(loadImage("src/assets/image/tutorial/ChessMapBasic.png"));
  images.push(loadImage("src/assets/image/tutorial/ChessMapBasic.png"));
  images.push(loadImage("src/assets/image/tutorial/Item.png"));
  images.push(loadImage("src/assets/image/tutorial/ChessMapBasic.png"));

  AkeyImage = loadImage("src/assets/image/tutorial/AttackerKey.png");
  QeImage = loadImage("src/assets/image/tutorial/Q,E,R.png");
  defArImage = loadImage("src/assets/image/tutorial/defArrow.png");
  SpImage = loadImage("src/assets/image/tutorial/Speed.png");
  LgImage = loadImage("src/assets/image/tutorial/Lager.png");
  ReImage = loadImage("src/assets/image/tutorial/Reverse.png");

  imageLib.loadImages();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  pg = createGraphics((windowWidth * 78) / 100, (windowHeight * 74) / 100);
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
    pg: pg,
  });
  itemManager = new ItemManager({ player1, player2 });
  gm = new GameManager({ player1, player2 });
  ui = new UI({ player1, player2, width, height });
  ink = new InkPattern(100);

  rectMode(CENTER);
  player2.minimiInitialize();

  setInterval(() => {
    system.calculateInkAreaRatio();
  }, 5000);

  // 랜덤 아이템 표시인 ? 를 표시하고, 사라지게 하는 로직
  setInterval(() => {
    gm.showRandomItemImage();
  }, GameManager.randomItemDisplayInterval);
}

function draw() {
  switch (system.phase) {
    case System.PHASE.INTRO:
      break;
    case System.PHASE.SELECT_CHARACTER:
      break;
    case System.PHASE.TUTORIAL:
      displayImage();
      break;
    case System.PHASE.MAIN_GAME:
      image(imageLib.backgroundImage, 0, 0, width, height);
      image(
        pg,
        (windowWidth * 11) / 100,
        (windowHeight * 23) / 100,
        pg.width,
        pg.height
      );

      // 게임 끝났을때의 ui
      if (system.isEndGame) {
        let winner;
        let winnerImage;
        if (system.inkAreaRatio > 50) {
          winner = player1;
        } else {
          winner = player2;
        }

        winnerImage = imageLib.getResultImage(winner);
        image(winnerImage, 0, 0, width, height);
        return;
      }

      // 메인 게임 ui
      ui.drawMainGameScreen(system.inkAreaRatio, system.countdown);

      // // pg 레이어 절반 채우고 색 확인
      // push();
      // translate((windowWidth * 11) / 100, (windowHeight * 23) / 100);
      // pg.fill(255, 78, 202);
      // pg.rect(0, 0, (windowWidth * 78) / 100, (windowHeight * 38) / 100);
      // pop();

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

      // 물음표 아이템 표시하고, 입력을 받음.
      if (gm.isDisplayRandomItemImage) {
        ui.drawGameItemImage(imageLib.randomItemImage);

        if (keyCode === 84 || keyCode === 80) {
          gm.setCurrentItemStatus(keyCode, imageLib, itemManager);

          itemManager.activateItemEffect({
            itemEater: gm.currentItemEater,
            itemType: gm.currentItemType,
          });
        }
      }

      // 아이템을 누가 먹었을때, 아이템 이미지와 툴팁을 표시.
      if (gm.isDisplayItemImage) {
        ui.drawItemSlotImage(
          gm.currentItemImage,
          gm.currentItemEater == player1
        );
        ui.drawItemToolTip(gm.currentItemType, gm.currentItemEater == player1);
      }

      if (frameCount % 60 === 0 && system.countdown > 0) {
        system.timeLapse();
      }

      if (player1.isDead) {
        push();
        fill(255, 0, 0, 200);
        rectMode(CORNERS);
        rect(
          0,
          (9.5 * windowHeight) / 10,
          (1.15 * windowWidth) / 10,
          windowHeight
        );
        fill(0, 0, 0, 200);
        rectMode(CORNERS);
        rect(
          (1.16 * windowWidth) / 10,
          (9.5 * windowHeight) / 10,
          windowWidth,
          windowWidth
        );
        //fill(30,130,130,100);
        fill(255);
        textSize((1.4 * windowWidth) / 100);
        text("Breaking News", windowWidth / 17, (9.8 * windowHeight) / 10);
        textSize((1.4 * windowWidth) / 100);
        text(
          "PLAYER 1: DEAD!",
          windowWidth / 4 + xPosition,
          (9.8 * windowHeight) / 10
        );

        // Update the x position to make the sentence move to the right
        xPosition += windowWidth / 350;

        // Check if the sentence touches the right side of the canvas}
        pop();
      } else {
        xPosition = 0;
      }

      if (player2.isDead) {
        push();
        fill(255, 0, 0, 200);
        rectMode(CORNERS);
        rect(
          0,
          (9.5 * windowHeight) / 10,
          (1.15 * windowWidth) / 10,
          windowHeight
        );
        fill(0, 0, 0, 200);
        rectMode(CORNERS);
        rect(
          (1.16 * windowWidth) / 10,
          (9.5 * windowHeight) / 10,
          windowWidth,
          windowWidth
        );
        //fill(30,130,130,100);
        fill(255);
        textSize((1.4 * windowWidth) / 100);
        text("Breaking News", windowWidth / 17, (9.8 * windowHeight) / 10);
        textSize((1.4 * windowWidth) / 100);
        text(
          "PLAYER 2: DEAD!",
          windowWidth / 4 + yPosition,
          (9.8 * windowHeight) / 10
        );

        // Update the x position to make the sentence move to the right
        yPosition += windowWidth / 350;

        // Check if the sentence touches the right side of the canvas}
        pop();
      } else {
        yPosition = 0;
      }

      break;
    case System.PHASE.GAME_RESULT:
      break;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    nextImage();
  } else if (keyCode === BACKSPACE) {
    prevImage();
  }
}

function nextImage() {
  if (currentImageIndex === 9) {
    system.phase = System.PHASE.MAIN_GAME;
    return;
  }
  currentImageIndex = (currentImageIndex + 1) % images.length;
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
}

function displayImage() {
  image(images[currentImageIndex], 0, 0, width, height);

  textStyle(BOLD);
  if (currentImageIndex === 2) {
    fill(0);
    textSize(20);
    textAlign(LEFT);
    let line1 = "1. 공격의 방향키:";
    text(line1, width / 15, height / 4 + 20);
    textSize(15);
    let line2 = "WASD 키를 사용하여";

    text(line2, width / 15, height / 4 + 50);
    let line3 = "공격의 방향을 조절하세요.";
    text(line3, width / 15, height / 4 + 70);

    let AkeyImageX = width / 4 - 100;
    let AkeyImageY = height / 2 - 10;
    let AkeyImageWidth = 200;
    let AkeyImageheight = 150;

    image(AkeyImage, AkeyImageX, AkeyImageY, AkeyImageWidth, AkeyImageheight);
  }

  if (currentImageIndex === 3) {
    fill(0);
    textSize(20);
    textAlign(LEFT);
    let line1 = "2. 각도조절과 공격키:";
    text(line1, width / 15, height / 4 + 20);
    textSize(15);
    let line2 = "각도조절: Q,E (공격 범위의 각도 조절)";
    text(line2, width / 15, height / 4 + 50);
    let line3 = "공격키: R (단순&연속 공격)";
    text(line3, width / 15, height / 4 + 70);

    let QeImageX = width / 4 - 130;
    let QeImageY = height / 2 - 10;
    let QeImageWidth = 250;
    let QeImageheight = 150;
    image(QeImage, QeImageX, QeImageY, QeImageWidth, QeImageheight);
  }

  if (currentImageIndex === 4) {
    fill(0);
    textSize(20);
    textAlign(RIGHT);
    let line1 = "1. 수비의 방향키:";
    text(line1, width / 2 + 220, height / 4 + 20);
    textSize(15);
    let line2 = "수비는 움직이면서 자동으로 잉크를 닦을 수 있어요!";
    text(line2, width / 2 + 500, height / 4 + 50);

    let defArImageX = width / 2 + 90;
    let defArImageY = height / 2 - 10;
    let defArImageWidth = 200;
    let defArImageheight = 150;
    image(
      defArImage,
      defArImageX,
      defArImageY,
      defArImageWidth,
      defArImageheight
    );
  }

  if (currentImageIndex === 5) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let SpImageX = width / 3 - 100;
    let SpImageY = height / 2 - 20;
    let SpImageWidth = 200;
    let SpImageheight = 200;
    image(SpImage, SpImageX, SpImageY, SpImageWidth, SpImageheight);

    textSize(20);
    let line3 = "1.속도 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격은 '총알 발사 속도'가";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비는 '이동 속도'가";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "증가해요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 6) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let LgImageX = width / 3 - 100;
    let LgImageY = height / 2 - 20;
    let LgImageWidth = 200;
    let LgImageheight = 200;
    image(LgImage, LgImageX, LgImageY, LgImageWidth, LgImageheight);

    textSize(20);
    let line3 = "2.강화 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격은 '발사되는 잉크면적'이";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비는 '지우는 면적'이";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "늘어나요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 7) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let ReImageX = width / 3 - 100;
    let ReImageY = height / 2 - 20;
    let ReImageWidth = 200;
    let ReImageheight = 200;
    image(ReImage, ReImageX, ReImageY, ReImageWidth, ReImageheight);

    textSize(20);
    let line3 = "3.대마왕 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격 획득, '수비의 방향'이";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비 획득, '공격의 방향'이";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "반대로 바뀌어요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 8) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);

    textSize(15);
    let line2 = "게임 진행 도중 화면에 물음표 아이템이 뜨게 되면...";
    text(line2, width / 2 - 250, height / 2 - 40);

    fill(0, 0, 255);
    textAlign(CENTER);
    textSize(30);
    let line3 = "공격";
    text(line3, width / 2 - 200, height / 2 + 30);

    textSize(35);
    let line4 = "'T 키'";
    text(line4, width / 2 - 200, height / 2 + 80);

    fill(255, 0, 0);
    textSize(30);
    let line5 = "수비";
    text(line5, width / 2 + 200, height / 2 + 30);

    textSize(35);
    let line6 = "'? 키'";
    text(line6, width / 2 + 200, height / 2 + 80);

    fill(0);
    textSize(15);
    let line7 = "아이템 획득키를 먼저 누르는 사람이 획득하게 됩니다.(선착순)";
    text(line7, width / 2 - 30, height / 2 + 200);

    let line8 = "아이템 지속시간: 5초(이후에는 원래대로 돌아와요)";
    text(line8, width / 2 - 65, height / 2 + 240);
  }

  if (currentImageIndex === 9) {
    push();
    fill(0);

    textSize(40);
    textAlign(CENTER);
    text("직접 공격 시스템", width / 2, height / 2 - 65);
    textSize(20);
    text("공격은 잉크총을 상대방에게 발사해서", width / 2, height / 2 - 20);
    text("수비는 미니미가 상대방에게 부딪히면.", width / 2, height / 2 + 20);
    text("상대방을 직접 공격할 수 있어요.", width / 2, height / 2 + 60);
    text("공격을 받으면 하트가 -1 줄어요.", width / 2, height / 2 + 100);
    text(
      "하트가 0이 되면 5초동안 행동 정지 상태가 됩니다.",
      width / 2,
      height / 2 + 140
    );

    push();
    fill(255, 0, 0);
    text("자 이제 준비되었나요??", width / 2, height / 2 + 200);
    text("ENTER 키를 눌러 게임을 시작하세요!", width / 2, height / 2 + 240);
    pop();
  }
}

// TODO:  -- 키를 눌러 먹으세요!!
