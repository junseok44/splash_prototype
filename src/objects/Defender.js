class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
    this.circles = [];
    this.minimiArray = [];

    this.defenseSpeed = 5; // 수비 속도 초기값
    this.defenseFastItemKey = 191;
    this.defenseFastDuration = 5; // 수비 가속 아이템 지속 시간 (초)
    this.defenseFastItemActive = false; // 수비 속도 아이템 활성화 여부
    this.defenseFastItemTimer = 0; // 수비 가속 아이템 타이머

    this.defenseSlowItemKey = 190;
    this.defenseSlowDuration = 5; // 수비 감속 아이템 지속 시간 (초)
    this.defenseSlowItemActive = false; // 수비 감속 아이템 활성화 여부
    this.defenseSlowItemTimer = 0; // 수비 감속 아이템 타이머
  }

  attack() {
    // 방향키가 눌리면 자동으로 공격
    if (keyIsDown(37) || keyIsDown(38) || keyIsDown(39) || keyIsDown(40)) {
      push();

      let pg = this.pg;
      // throttling
      pg.push();
      pg.rectMode(pg.CENTER);
      pg.translate(this.x, this.y);
      pg.rotate(this.deg);
      pg.fill(255);
      //지우개 크기
      pg.rect(0, 0, 65, 65);
      pg.pop();

      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, 100);

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
      // push();
      // fill(255, 0, 0);
      // ellipse(
      //   this.x + ((this.width * 2) / 3) * cos(this.circles[i]),
      //   this.y + ((this.height * 2) / 3) * sin(this.circles[i]),
      //   this.width / 3,
      //   this.height / 3
      // );
      // pop();
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

  move() {
    if (keyIsDown(this.lcode)) {
      this.x -= this.defenseSpeed;
    }
    if (keyIsDown(this.rcode)) {
      this.x += this.defenseSpeed;
    }
    if (keyIsDown(this.ucode)) {
      this.y -= this.defenseSpeed;
    }
    if (keyIsDown(this.dcode)) {
      this.y += this.defenseSpeed;
    }
    if (keyIsDown(this.rotate_lcode)) {
      this.deg -= 0.1;
    }
    if (keyIsDown(this.rotate_rcode)) {
      this.deg += 0.1;
    }

    if (keyIsDown(this.defenseFastItemKey) && !this.defenseFastItemActive) {
      this.defenseFastItemActive = true;
      this.defenseSpeed = 10; // 아이템 적용 시 수비 속도 증가
      this.defenseFastItemTimer = millis();
    }

    if (
      this.defenseFastItemActive &&
      millis() - this.defenseFastItemTimer > this.defenseFastDuration * 1000
    ) {
      this.defenseFastItemActive = false;
      this.defenseSpeed = 5; // 원래 속도로 복구
    }

    if (keyIsDown(this.defenseSlowItemKey) && !this.defenseSlowItemActive) {
      this.defenseSlowItemActive = true;
      this.defenseSpeed = 2; // 아이템 적용 시 수비 속도 감소
      this.defenseSlowItemTimer = millis();
    }

    if (
      this.defenseSlowItemActive &&
      millis() - this.defenseSlowItemTimer > this.defenseSlowDuration * 1000
    ) {
      this.defenseSlowItemActive = false;
      this.defenseSpeed = 5; // 원래 속도로 복구
    }
  }
}
