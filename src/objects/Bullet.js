class Bullet {
  constructor(x, y, deg, color, attackSpeed) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.color = color;
    this.attackSpeed = attackSpeed || 10;

    this.attackFastItemKey = 84;
    //일단 아이템 코드를 다르게...
    this.attackFastDuration = 5; // 공격 속도 아이템 지속 시간 (초)
    this.attackFastItemActive = false; // 공격 속도 아이템 활성화 여부
    this.attackFastItemTimer = 0;
    //가속

    this.attackSlowItemKey = 81;
    //일단 아이템 키코드를 다르게...
    this.attackSlowDuration = 5; // 공격 감속 지속 시간 (초)
    this.attackSlowItemActive = false; // 공격 감속 활성화 여부
    this.attackSlowItemTimer = 0;
    //감
    this.width = 10;
    this.height = 10;
    this.yPos = 0;
    this.isEnd = false;
    this.endTimer = null;
    this.isEndDrawing = false;
    this.distance = parseInt(random(150, 200));
    this.coordX = x;
    this.coordY = y;
  }

  static BulletColor = "rgb(0,0,0)";

  move() {
    const angle = Math.PI / 2 - this.deg;
    const deltaX = 10 * Math.cos(angle);
    const deltaY = 10 * Math.sin(angle);
    this.coordX += deltaX;
    this.coordY -= deltaY;
    this.yPos -= this.attackSpeed;
    if (keyIsDown(this.attackFastItemKey) && !this.attackFastItemActive) {
      this.attackFastItemActive = true;
      this.attackSpeed = 8; // 아이템 적용 시 공격 속도 증가
      this.attackFastItemTimer = millis();
    }
    if (
      this.attackFastItemActive &&
      millis() - this.attackFastItemTimer > this.attackFastDuration * 1000
    ) {
      this.attackFastItemActive = false;
      this.attackSpeed = 5; // 원래 속도로 복구
    }
    if (keyIsDown(this.attackSlowItemKey) && !this.attackSlowItemActive) {
      this.attackSlowItemActive = true;
      this.attackSpeed = 2; // 아이템 적용 시 공격 속도 감소
      this.attackSlowItemTimer = millis();
    }
    if (
      this.attackSlowItemActive &&
      millis() - this.attackSlowItemTimer > this.attackSlowDuration * 1000
    ) {
      this.attackSlowItemActive = false;
      this.attackSpeed = 5; // 원래 속도로 복구
      //공격속도 낮추기
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.deg);

    if (this.yPos <= -this.distance && !this.isEnd) {
      this.isEnd = true;
    } else if (this.yPos > -this.distance) {
      this.move();
      stroke(Bullet.BulletColor);
      fill(this.color);
      noStroke();
      ellipse(0, this.yPos, this.width, this.height);
    }

    if (this.isEnd && !this.isEndDrawing) {
      ink.drawCurveVertexesToPG(
        pg,
        this.x,
        this.y,
        -this.yPos,
        this.deg,
        this.color
      );
      if (!this.endTimer) {
        this.endTimer = setTimeout(() => {
          this.isEndDrawing = true;
        }, 100);
      }
    } else if (this.isEnd && this.isEndDrawing) {
      //bullet 터지고나서도 그 자리에 남아있는 거 해결하는 다른 방법
      //this.coordX = 9999;
      //this.coordY = 9999;
    }

    pop();
  }
}
