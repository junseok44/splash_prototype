//https://creativecommons.org/licenses/by-sa/3.0/

let player1;
let player2;
let bullets = [];
let pg;
let ink;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  pg = createGraphics(windowWidth, windowHeight);
  pg.noStroke();
  pg.fill(255, 78, 202);
  player1 = new Player(100, 100, 50, 50, bullets, "rgb(255,78,202)", {
    l: 65,
    r: 68,
    u: 87,
    d: 83,
    rotate_l: 81,
    rotate_r: 69,
    attack: 82,
  });
  player2 = new Player(400, 400, 50, 50, bullets, "rgb(0,255,125)", {
    l: 37,
    r: 39,
    u: 38,
    d: 40,
    rotate_l: 188,
    rotate_r: 190,
    attack: 191,
  });
  ink = new InkPattern(100);
  setTimeout(() => {
    calculateInkAreaRatio();
  }, 5000);
}

function draw() {
  background(255);

  image(pg, 0, 0);

  textSize(15);
  text("플레이어1 이동: wasd 회전 qe 공격 r", 10, 20);
  text("플레이어2 이동: 방향키 회전 < > 공격 /", 10, 40);

  pg.fill(255, 78, 202);

  player1.move();
  player1.display();
  player1.attack();
  pg.fill(0, 255, 125);

  player2.move();
  player2.display();
  player2.attack();

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].display();
  }
}

function keyPressed() {
  switch (key) {
    case "1":
      pg.fill(255, 78, 202);
      break;
    case "2":
      pg.fill(0, 255, 125);
      break;
  }
}

function calculateInkAreaRatio() {
  // Get the pixel data from the pg graphics buffer
  pg.loadPixels();
  console.log(pg.pixels);

  console.log(pg.pixels.findIndex((p) => p !== 0));

  console.log(pg.pixels.filter((p) => p !== 0).length);

  // // Count the number of filled pixels in the pg graphics buffer
  // var filledPixels = 0;
  // for (var i = 0; i < pgData.length; i += 4) {
  //   // Check the alpha value (assuming the ink has an alpha value of 255)
  //   if (pgData[i + 3] === "rgb(255,78,202)") {
  //     filledPixels++;
  //   }
  // }

  // // Calculate the ratio of filled pixels to the total number of pixels in pg
  // var totalPixels = pg.width * pg.height;
  // var inkAreaRatio = filledPixels / totalPixels;

  // // Log the ratio to the console (you can use it as needed in your application)
  // console.log("Ink Area Ratio:", inkAreaRatio);
}
