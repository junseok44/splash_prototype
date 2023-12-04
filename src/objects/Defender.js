class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
    this.circles = [];
    this.minimiArray = [];
  }

  attack() {
    if (keyIsDown(this.attackcode)) {
      push();

      let pg = this.pg;
      // throttling
      // if (!this.isAttacked) {
      pg.push();
      pg.rectMode(pg.CENTER);
      pg.translate(this.x, this.y);
      pg.rotate(this.deg);
      pg.fill(255);
      pg.rect(0, -20, this.width, this.height);
      pg.pop();
      ㅔ;
      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, 100);
      // }

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
    }
  }

  //minimi  10개 생성
  minimiInitialize() {
    let numCircles = 10;

    for (let i = 0; i < numCircles; i++) {
      let angle = (TWO_PI / numCircles) * i;
      this.circles.push(angle);
    }
  }

  //minimi 공전
  minimiDisplay() {
    push();
    stroke(0);
    fill(255);
    this.minimiArray = [];

    for (let i = 0; i < this.circles.length; i++) {
      push();
      translate(this.x, this.y);
      let rotation = millis() * 0.001;
      let circleAngle = this.circles[i] + rotation;
      rotate(circleAngle);
      ellipse(
        (this.width * 2) / 3,
        (this.height * 2) / 3,
        this.width / 3,
        this.height / 3
      );
      this.minimiArray.push({
        x: this.x + ((this.width * 2) / 3) * cos(this.circles[i]),
        y: this.y + ((this.height * 2) / 3) * sin(this.circles[i]),
        width: this.width / 3,
      });
      pop();
    }
    pop();
  }

  //minimi와 bullet 충돌시 둘 다 사라짐
  minimiCollide(bullet) {
    let circlesToRemove = [];

    for (let i = this.circles.length - 1; i >= 0; i--) {
      let d = dist(
        bullet.coordX,
        bullet.coordY,
        this.x + ((this.width * 2) / 3) * cos(this.circles[i]),
        this.y + ((this.height * 2) / 3) * sin(this.circles[i])
      );

      if (d < this.width / 3 / 2 + bullet.width / 2) {
        circlesToRemove.push(i);
        bullet.coordX = 9999;
        bullet.coordY = 9999;
      }
    }

    for (let i of circlesToRemove) {
      this.circles.splice(i, 1);
    }
  }
}
