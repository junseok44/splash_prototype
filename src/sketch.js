//https://creativecommons.org/licenses/by-sa/3.0/

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
    attack: 191,
    pg: pg,
  });
  ink = new InkPattern(100);
  ui = new UI();

  // 이부분 건들지 말라고 하셨는데 일단 적어뒀습니다.. 나중에 리스폰할 때도 initialize 쓸 것 같아서요
  player2.minimiInitialize();
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
      // 프로토타입은 여기서만 코드 작성해주세요~

      image(pg, 0, 0);

      player1.display();
      player1.move();
      player1.attack();

      player2.display();
      player2.move();
      player2.attack();
      //minimi 보이기
      player2.minimiDisplay();

      //minimi, bullet 충돌
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();
        player2.minimiCollide(bullets[i]);
        if (bullets[i].isEnd && bullets[i].isEndDrawing) {
          bullets.splice(i, 1);
        }
      }

      break;
    case "game_result":
      break;
  }
}
