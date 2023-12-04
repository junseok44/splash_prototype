let player1;
let player2;
let bullets = [];
let pg;
let ink;
let ui;

let phase = "main_game";

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  pg = createGraphics(windowWidth, windowHeight);
  pg.noStroke();
  player1 = new Attacker({
    x: 100,
    y: 100,
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
    x: 200,
    y: 100,
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
  background(255);

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
}
