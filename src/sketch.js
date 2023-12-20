let xPosition = 0;
let yPosition = 0;
let introVideo;
let player1;
let player2;
let bullets = [];
let pg;
let itemManager;
let ui;
let ink;
let tutorialManager;
let pgManager;
let gm;
let imageLib = new ImageLibrary();

let itemTutorialStartTime;
let itemTutorialPhase = false;

let playWhistle = false;
let playBomb = false;
let playComeback = false;
let playEnlarge = false;

function preload() {
  imageLib.loadImages();
  whistleSound = loadSound("src/assets/sounds/whistle.mp3");
  maingameSound = loadSound("src/assets/sounds/mainGame.mp3");
  bombSound = loadSound("src/assets/sounds/bomb.mp3");
  enlargeSound = loadSound("src/assets/sounds/enlarge.mp3");
  fasterSound = loadSound("src/assets/sounds/faster.mp3");
  finalSound = loadSound("src/assets/sounds/final.mp3");
  hitSound = loadSound("src/assets/sounds/hit.mp3");
  itemSound = loadSound("src/assets/sounds/item.mp3");
  minimiHitSound = loadSound("src/assets/sounds/minimiHit.mp3");
  reverseSound = loadSound("src/assets/sounds/reverse.mp3");
}

function setup() {
  maingameSound.setVolume(0.5);
  createCanvas(windowWidth, windowHeight);

  introVideo = createVideo("src/assets/video/intro.mp4");
  introVideo.hide();
  pgManager = PgManager.getInstance();

  pg = createGraphics(pgManager.size.width, pgManager.size.height);
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
    rotate_l: 49,
    rotate_r: 50,
    attack: 82,
    itemCode: 51,
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
    itemCode: 191,
    pg: pg,
  });
  gm = new GameManager({ player1, player2, pg, bullets });
  system = new System({ pg, gm, pgManager });
  tutorialManager = new TutorialManager({
    player1,
    player2,
    system,
    imageLib,
    pg,
  });

  system.changePhase(System.PHASE.INTRO);
  // system.changePhase(System.PHASE.MAIN_GAME);
  // system.changePhase(System.PHASE.TUTORIAL);
  // system.changePhase(System.PHASE.MAIN_GAME);

  itemManager = new ItemManager({ player1, player2 });
  ui = new UI({ player1, player2, width, height });
  ink = new InkPattern(100);

  player1.setInitialPosition({
    x: ui.tutorialBoxNarrowOffset + ui.tutorialBoxWidth / 2,
    y: ui.tutorialBoxTopOffset + ui.tutorialBoxHeight / 2,
  });

  player2.setInitialPosition({
    x: ui.canvasWidth - (ui.tutorialBoxNarrowOffset + ui.tutorialBoxWidth / 2),
    y: ui.tutorialBoxTopOffset + ui.tutorialBoxHeight / 2,
  });

  rectMode(CENTER);
}

const minimiInitializeOnce = callOneTime(() => {
  player2.minimiInitialize();
  console.log("minimiInitializeOnce");
});

const setItemTutorialStartTimeOnce = callOneTime(() => {
  player1.setInitialPosition({
    x: ui.canvasWidth / 2 - 100,
    y: ui.canvasHeight / 2 + 200,
  });

  player2.setInitialPosition({
    x: ui.canvasWidth / 2 + 100,
    y: ui.canvasHeight / 2 + 200,
  });
});

function draw() {
  switch (system.phase) {
    case System.PHASE.INTRO:
      image(imageLib.introImage, 0, 0, width, height);

      break;
    case System.PHASE.SELECT_CHARACTER:
      console.log("select character");

      image(introVideo, 0, 0, width, height);
      image(imageLib.pressEnterImage, width - 300, height - 150, 300, 150);

      break;
    case System.PHASE.TUTORIAL:
      image(
        imageLib.getTutorialImage(tutorialManager.tutorialIndex),
        0,
        0,
        width,
        height
      );

      if (
        tutorialManager.tutorialIndex <= 2 &&
        tutorialManager.tutorialIndex > 0
      ) {
        pgManager.changePgPosition(
          {
            x: ui.tutorialBoxNarrowOffset,
            y: ui.tutorialBoxTopOffset,
          },
          ui.tutorialBoxWidth,
          ui.tutorialBoxHeight
        );

        if (!pgManager.isPgChanged) {
          pg = createGraphics(pgManager.size.width, pgManager.size.height);
          pg.noStroke();
          pgManager.isPgChanged = true;
        }

        image(
          pg,
          pgManager.initialPosition.x,
          pgManager.initialPosition.y,
          pgManager.size.width,
          pgManager.size.height
        );

        player1.display();
        player1.move({
          left: ui.tutorialBoxNarrowOffset,
          right: ui.tutorialBoxWideOffset,
          top: ui.tutorialBoxTopOffset,
          bottom: ui.tutorialBoxBottomOffset,
        });
      }

      if (
        tutorialManager.tutorialIndex <= 2 &&
        tutorialManager.tutorialIndex >= 1
      ) {
        player1.attack();

        for (let i = 0; i < bullets.length; i++) {
          bullets[i].display();
        }
      }

      if (tutorialManager.tutorialIndex == 2) {
        player2.display();
        player2.minimiDisplay();

        push();
        textAlign(CENTER);
        textSize(20);

        text(
          "잉크총으로 수비를 공격해보세요!",
          ui.tutorialBoxNarrowOffset + ui.tutorialBoxWidth / 2,
          windowHeight - ui.tutorialBoxBottomOffset
        );
        pop();

        //minimi와 bullet, bullet과 수비의 충돌 계산.
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
      }

      if (
        tutorialManager.tutorialIndex >= 3 &&
        tutorialManager.tutorialIndex < 4
      ) {
        console.log(
          "tutorialManager.tutorialIndex >= 3 && tutorialManager.tutorialIndex < 4"
        );
        pgManager.changePgPosition(
          {
            x: ui.tutorialBoxWideOffset,
            y: ui.tutorialBoxTopOffset,
          },
          ui.tutorialBoxWidth,
          ui.tutorialBoxHeight
        );

        if (!pgManager.isPgChanged) {
          pg = createGraphics(pgManager.size.width, pgManager.size.height);
          pg.noStroke();
          pgManager.isPgChanged = true;
        }

        image(
          pg,
          pgManager.initialPosition.x,
          pgManager.initialPosition.y,
          pgManager.size.width,
          pgManager.size.height
        );

        player2.display();
        player2.move({
          left: ui.tutorialBoxWideOffset,
          right: ui.tutorialBoxNarrowOffset,
          top: ui.tutorialBoxTopOffset,
          bottom: ui.tutorialBoxBottomOffset,
        });
        player2.attack();

        minimiInitializeOnce();
        player2.minimiDisplay();
      }

      //아이템 튜토리얼 파트
      if (tutorialManager.tutorialIndex == 7) {
        setItemTutorialStartTimeOnce();

        push();
        translate(windowWidth / 6, 0);
        player1.display();
        pop();

        push();
        translate(-windowWidth / 6, 0);
        player2.display();
        minimiInitializeOnce();
        player2.minimiDisplay();
        pop();

        //아이템 튜토리얼 phase에 들어온 후 3초 지난 후부터 카운트 다운 3초 후 아이템 획득 시뮬레이션 기능
        itemTutorialPhase = true;
        if (itemTutorialPhase) {
          if (!itemTutorialStartTime) {
            itemTutorialStartTime = millis();
          }
        }

        let elapsedTime = millis() - itemTutorialStartTime;
        //elapsedTime 확인용
        //text(elapsedTime, windowWidth/2, windowHeight/3);

        push();
        textAlign(CENTER, CENTER);
        textSize(50);
        if (elapsedTime >= 3000 && elapsedTime < 4000) {
          text("아이템 등장까지 3초", windowWidth / 2, windowHeight / 2);
        }
        if (elapsedTime >= 4000 && elapsedTime < 5000) {
          text("아이템 등장까지 2초", windowWidth / 2, windowHeight / 2);
        }
        if (elapsedTime >= 5000 && elapsedTime < 6000) {
          text("아이템 등장까지 1초", windowWidth / 2, windowHeight / 2);
        }
        if (elapsedTime >= 6000 && elapsedTime < 6100) {
          gm.isDisplayRandomItemImage = true;
        }
        pop();

        if (gm.isDisplayRandomItemImage) {
          ui.drawGameItemImage(imageLib.randomItemImage);

          if (keyCode === player1.itemCode || keyCode === player2.itemCode) {
            gm.setCurrentItemStatus(keyCode, imageLib, itemManager);

            itemManager.activateItemEffect({
              itemEater: gm.currentItemEater,
              itemType: gm.currentItemType,
            });
          }
        }

        // 아이템을 누가 먹었을때, 아이템 이미지와 툴팁을 표시.
        if (gm.isDisplayItemImage) {
          push();
          translate(windowWidth / 2, windowHeight / 2);
          textAlign(CENTER, CENTER);
          textSize(20);
          // let itemName;
          // if (gm.currentItemType == speed_up) {
          //   itemName = '속도';
          // } else if (gm.currentItemType == range_up) {
          //   itemName = '강화';
          // } else {
          //   itemName = '방향';
          // }
          if (gm.currentItemEater == player1) {
            text(
              "공격자가 " + gm.currentItemType + " 아이템을 획득했습니다!",
              0,
              0
            );
          }
          if (gm.currentItemEater == player2) {
            text(
              "수비자가 " + gm.currentItemType + " 아이템을 획득했습니다!",
              0,
              0
            );
          }
          pop();
        }
      } else {
        itemTutorialPhase = false;
        itemTutorialStartTime = null;
      }
      playWhistle = true;

      if (tutorialManager.tutorialIndex == 4) {
        player2.display();
        player2.minimiDisplay();

        push();
        textAlign(CENTER);
        textSize(20);

        text(
          "수비를 이동시켜서 공격측을 공격해보세요!",
          ui.tutorialBoxWideOffset + ui.tutorialBoxWidth / 2,
          ui.tutorialBoxTopOffset + 100
        );
        pop();
        player2.move({
          left: ui.tutorialBoxWideOffset,
          right: ui.tutorialBoxNarrowOffset,
          top: ui.tutorialBoxTopOffset,
          bottom: ui.tutorialBoxBottomOffset,
        });
        player1.display();

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
      }

      break;

    case System.PHASE.MAIN_GAME:
      if (playWhistle) {
        whistleSound.play();
        playWhistle = false;
      }
      image(imageLib.backgroundImage, 0, 0, width, height);

      pgManager.changePgPosition(
        {
          x: (windowWidth * 11) / 100,
          y: (windowHeight * 23) / 100,
        },
        (windowWidth * 78) / 100,
        (windowHeight * 74) / 100
      );

      if (!pgManager.isPgChanged) {
        pg = createGraphics(pgManager.size.width, pgManager.size.height);
        pg.noStroke();
        console.log("pgManager.isPgChanged");
        pgManager.isPgChanged = true;
      }

      image(
        pg,
        pgManager.initialPosition.x,
        pgManager.initialPosition.y,
        pgManager.size.width,
        pgManager.size.height
      );

      // 게임 끝났을때의 ui
      if (gm.isEndGame) {
        let winner;
        let winnerImage;
        if (gm.inkAreaRatio > 50) {
          winner = player1;
        } else {
          winner = player2;
        }

        winnerImage = imageLib.getResultImage(winner);
        image(winnerImage, 0, 0, width, height);
        maingameSound.stop();
        return;
      }

      // 메인 게임 ui
      ui.drawMainGameScreen(
        gm.inkAreaRatio,
        gm.countdown,
        gm.isReady,
        gm.isReadyEnd
      );

      // // pg 레이어 절반 채우고 색 확인
      // push();
      // translate((windowWidth * 11) / 100, (windowHeight * 23) / 100);
      // pg.fill(255, 78, 202);
      // pg.rect(0, 0, (windowWidth * 78) / 100, (windowHeight * 38) / 100);
      // pop();

      // 플레이어1, 플레이어2 그리기
      player1.display();
      player2.display();

      //minimi 보이기
      player2.minimiDisplay();

      if (!gm.isReady) return;

      // 죽지 않았을때만 움직이고 공격가능.
      if (!player1.isDead) {
        player1.move({
          left: ui.horizontalGridOffset,
          right: ui.horizontalGridOffset,
          top: ui.verticalGridOffset + ui.UIHeight,
          bottom: ui.verticalGridOffset,
        });
        player1.attack();
      }

      if (!player2.isDead) {
        player2.move({
          left: ui.horizontalGridOffset,
          right: ui.horizontalGridOffset,
          top: ui.verticalGridOffset + ui.UIHeight,
          bottom: ui.verticalGridOffset,
        });
        player2.attack();
      }

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

      //minimi와 bullet, bullet과 수비의 충돌 계산.
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

        if (keyCode === player1.itemCode || keyCode === player2.itemCode) {
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

      // breaking news
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
    case System.PHASE.CREDITS:
      image(imageLib.creditsImage, 0, 0, width, height);
      break;
  }
}

let isTurning = false;

function keyPressed() {
  if (system.phase == System.PHASE.INTRO) {
    if (keyCode === ENTER) {
      system.changePhase(System.PHASE.SELECT_CHARACTER);
      isTurning = true;
      setTimeout(() => {
        isTurning = false;
      }, 500);
    } else if (keyCode === 67) {
      console.log("credits");
      system.changePhase(System.PHASE.CREDITS);
    }
  }

  if (system.phase == System.PHASE.CREDITS) {
    if (keyCode === BACKSPACE) {
      system.changePhase(System.PHASE.INTRO);
    }
  }

  if (system.phase == System.PHASE.SELECT_CHARACTER) {
    if (keyCode === ENTER && !isTurning) {
      system.changePhase(System.PHASE.TUTORIAL);
      introVideo.stop();
      isTurning = true;
      setTimeout(() => {
        isTurning = false;
      }, 500);
    }
  }

  if (system.phase == System.PHASE.TUTORIAL) {
    if (keyCode === ENTER && !isTurning) {
      tutorialManager.tutorialNext();
      pgManager.isPgChanged = false;
    } else if (keyCode === BACKSPACE) {
      tutorialManager.tutorialPrev();
      pgManager.isPgChanged = false;
    }
  }

  if (system.phase == System.PHASE.MAIN_GAME && gm.isEndGame) {
    if (keyCode === ENTER) {
      maingameSound.stop();
      system.changePhase(System.PHASE.MAIN_GAME);
    }
  }

  // if (system.phase == System.PHASE.MAIN_GAME && gm.isEndGame) {
  //   if (keyCode === ENTER) {
  //     system.changePhase(System.PHASE.MAIN_GAME);
  //   }
  // }
}
