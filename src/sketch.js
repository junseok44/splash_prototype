let player1;
let player2;
let bullets = [];
let pg;
let ink;
let ui;
let inkAreaRatio = 0;
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
    x: 400,
    y: 400,
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
  ui = new UI();

  setInterval(() => {
    calculateInkAreaRatio(); // 잉크 면적 비율 계산
  }, 5000);
}

//점수계산 시스템
function calculateInkAreaRatio() {
  pg.loadPixels();
  let inkedPixels = 0;
  let totalPixels = pg.pixels.length;

  for (let i = 0; i < pg.pixels.length; i += 4) {
    let r = pg.pixels[i];
    let g = pg.pixels[i + 1];
    let b = pg.pixels[i + 2];
    let a = pg.pixels[i + 3];

    // 특정 색상 (rgb(255,78,202))이면 inkedPixels를 증가
    if (r === 255 && g === 78 && b === 202 && a === 255) {
      inkedPixels++;
    }
  }

  console.log(inkedPixels, totalPixels, pg.width * pg.height);

  console.log((inkedPixels / totalPixels) * 100);

  inkAreaRatio = (inkedPixels / totalPixels) * 100;
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

  ui.drawUI(phase);

  switch (phase) {
    case "intro":
      break;
    case "select_character":
      break;
    case "tutorial":
      break;
    case "main_game":
      image(pg, 0, 0);

      drawMainGameScreen(); // 게임 화면 그리기

      player1.display();
      player1.move();
      player1.attack();

      player2.display();
      player2.move();
      player2.attack();

      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();
        bullets[i].move(); // 이 부분이 추가되었습니다.
      }
      break;
    case "game_result":
      break;
  }
}
