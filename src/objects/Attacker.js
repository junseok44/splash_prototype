class Attacker extends Player {
  constructor(args) {
    super(args);
  }

  changeControlsForDefenseWithReverse() {
    this.changeControls(68, 65, 83, 87, 81, 69, 82);
  }

  changeControlsForDefenseWithFreeze() {
    this.changeControls(110, 111, 112, 113, 114, 115, 116);
  }

  attack() {
    if (keyIsDown(this.attackcode)) {
      push();

      if (!this.isAttacked) {
        let correction = random(-0.3, 0.3);
        this.bullets.push(
          new Bullet(this.x, this.y, this.deg + correction, this.color)
        );
        this.isAttacked = true;
        setTimeout(() => {
          this.isAttacked = false;
        }, 100);
      }

      pop();
    }
  }
}
