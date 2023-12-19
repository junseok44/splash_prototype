class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
    this.circles = [];
    // this.minimiArray = [];
    this.minimiPosition = this.width;
    this.minimiSize = this.width / 3;
    this.minimiX = [];
    this.minimiY = [];
    this.minimiRotation = 0;
  }

  static cleanRange = 65;

  //REVISED
  changeControlsForAttackWithReverse() {
    this.changeControls(39, 37, 40, 38, 188, 190, 191);
  }

  changeControlsForAttackWithFreeze() {
    this.changeControls(50, 51, 52, 53, 54, 55, 56);
  }

  changeCleanAreaOffset(value) {
    this.cleanAreaOffset = value;
  }

  rangeUp(value) {
    Defender.cleanRange += value;
  }

  rotate(deltaDeg) {
    this.minimiRotation += deltaDeg;
  }

  attack() {
    // 방향키가 눌리면 자동으로 공격
    if (keyIsDown(37) || keyIsDown(38) || keyIsDown(39) || keyIsDown(40)) {
      push();

      // throttling
      pg.push();
      pg.rectMode(pg.CENTER);

      const pgManager = PgManager.getInstance();
      const { x: pgX, y: pgY } = pgManager.initialPosition;
      pg.translate(this.x - pgX, this.y - pgY);
      pg.rotate(this.deg);
      pg.fill(255);
      //지우개 크기
      pg.rect(0, 0, Defender.cleanRange, Defender.cleanRange);
      pg.pop();

      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, 100);

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
    }
  }

  respawn() {
    super.respawn();
    this.minimiInitialize();
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.deg);
    image(ImageLibrary.defenderImage, -this.width / 2, -this.height / 2);
    pop();

    super.display();
  }

  //minimi  10개 생성
  minimiInitialize() {
    this.circles = [];

    let numCircles = 10;

    for (let i = 0; i < numCircles; i++) {
      let angle = (TWO_PI / numCircles) * i;
      this.circles.push(angle);
    }
  }

  //minimi 공전
  minimiDisplay() {
    stroke(0);
    fill(0);

    this.minimiArray = [];

    for (let i = 0; i < this.circles.length; i++) {
      push();
      translate(this.x, this.y);
      // let rotation = millis() * 0.001;
      let circleAngle = this.circles[i] + this.minimiRotation;
      this.minimiX[i] = this.minimiPosition * cos(circleAngle);
      this.minimiY[i] = this.minimiPosition * sin(circleAngle);
      this.minimiArray.push(this.minimiX[i], this.minimiY[i]);
      // circle(this.minimiX[i], this.minimiY[i], this.minimiSize);
      image(
        ImageLibrary.minimiImage,
        this.minimiX[i] - this.minimiSize / 2,
        this.minimiY[i] - this.minimiSize / 2,
        this.minimiSize,
        this.minimiSize
      );
      pop();
    }
  }

  //minimi와 bullet 충돌시 둘 다 사라짐
  minimiCollide(bullet) {
    let circlesToRemove = [];

    for (let i = this.circles.length - 1; i >= 0; i--) {
      let d = dist(
        bullet.coordX,
        bullet.coordY,
        this.x + this.minimiX[i],
        this.y + this.minimiY[i]
      );

      if (d < this.minimiSize / 2 + bullet.width / 2) {
        circlesToRemove.push(i);
        bullet.coordX = 9999;
        bullet.coordY = 9999;
        this.minimiX.splice(i, 1);
        this.minimiY.splice(i, 1);
      }
    }

    for (let i of circlesToRemove) {
      this.circles.splice(i, 1);
    }
  }
}
