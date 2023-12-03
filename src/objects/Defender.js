class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
    this.circles = [];
  }

  attack() {
    if (keyIsDown(this.attackcode)) {
      push();

      let pg = this.pg;
      // throttling
      if (!this.isAttacked) {
        pg.push();
        pg.rectMode(pg.CENTER);
        pg.translate(this.x, this.y);
        pg.rotate(this.deg);
        pg.fill(255);
        pg.rect(0, -20, 50, 150);
        pg.pop();

        this.isAttacked = true;
        setTimeout(() => {
          this.isAttacked = false;
        }, 100);
      }

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
    }
  }
  minimiDisplay() {
    let numCircles = 10;
    let angle = TWO_PI / numCircles;

    stroke(0);
    fill(255);

    for (let i = 0; i < numCircles; i++) {
      push();
      translate(this.x, this.y);
      let rotation = millis() * 0.001;
      let circleAngle = angle * i + rotation;
      this.circles[i] = circleAngle;
      rotate(circleAngle);
      ellipse(
        (this.width * 2) / 3,
        (this.height * 2) / 3,
        this.width / 3,
        this.height / 3
      );
      pop();
    }
  }
  minimiCollide(bullet) {
    console.log(bullet.x, bullet.y);
    for (let i = this.circles.length - 1; i >= 0; i--) {
      let d = dist(
        bullet.x,
        bullet.y,
        this.x + ((this.width * 2) / 3) * cos(this.circles[i]),
        this.y + ((this.height * 2) / 3) * sin(this.circles[i])
      );
      if (d < this.width / 3 / 2 + bullet.width / 2) {
        console.log("hit");
        this.circles[i].splice(i, 1);
      }
    }
  }
}
