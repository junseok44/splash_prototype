let pinkPercentage = 0;
let inkAreaRatio = 0;

let player1;
let player2;
let bullets = [];
let pg;
let itemManager;
let ui;
let ink;

let gm = new GameManager();
let imageLib = new ImageLibrary();

let itemDisplayInterval = 3 * System.frameRate;

function preload() {
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
    //attack: 191,
    pg: pg,
  });
  ui = new UI({ player1, player2, width, height });
  itemManager = new ItemManager();
  ink = new InkPattern(100);

  rectMode(CENTER);
  player2.minimiInitialize();

  // setInterval(() => {
  //   system.calculateInkAreaRatio();
  // }, 5000);
}

function draw() {
  switch (system.phase) {
    case System.PHASE.INTRO:
      break;
    case System.PHASE.SELECT_CHARACTER:
      break;
    case System.PHASE.TUTORIAL:
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
        let resultImage;

        if (system.inkAreaRatio > 50) {
          resultImage = finalImage1;
        } else {
          resultImage = finalImage;
        }

        ui.drawGameResultScreen(resultImage);
        return;
      }

      // 메인 게임 ui
      ui.drawMainGameScreen(system.inkAreaRatio, system.countdown);

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

      // 랜덤 아이템 표시인 ? 를 표시하고, 사라지게 하는 로직
      if (frameCount % itemDisplayInterval == 0) {
        gm.showRandomItemImage();
      }

      // 물음표 아이템 표시하고, 입력을 받음.
      if (gm.isDisplayRandomItemImage) {
        ui.drawGameItemImage(imageLib.randomItemImage);

        if (keyIsDown(84) || keyIsDown(80)) {
          gm.onItemKeyPressed(keyCode, imageLib, { player1, player2 });

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

      break;
    case System.PHASE.GAME_RESULT:
      break;
  }
}

// TODO:  -- 키를 눌러 먹으세요!!

// TODO: 아이템 효과 적용 -> 이제 범위 증가만 남음.

// FIXME: 아이템 효과가 끝날때 다 초기화 시켜주는것 - 지금 툴팁이 같이 사라지지가 않아.

// FIXME: 그냥 itemManager에 몰아 넣었으면 되었지 않나? gpt에게 물어볼것.
