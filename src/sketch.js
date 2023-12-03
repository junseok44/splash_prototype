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
      player2.minimiDisplay();

      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();
        player2.minimiCollide(bullets[i]);
      }

      break;
    case "game_result":
      break;
  }
}
