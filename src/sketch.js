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
    attack: 191,
    pg: pg,
  });
  ink = new InkPattern(100);
  ui = new UI({ player1, player2 });
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

      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();

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
