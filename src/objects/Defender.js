class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
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
      if (!this.isAttacked) {
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
      }

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
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
