class Attacker extends Player {
  constructor(args) {
    super(args);
    this.deg = PI / 2;
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

  move() {
    if (keyIsDown(this.lcode)) {
      this.x -= 5;
    }
    if (keyIsDown(this.rcode)) {
      this.x += 5;
    }
    if (keyIsDown(this.ucode)) {
      this.y -= 5;
    }
    if (keyIsDown(this.dcode)) {
      this.y += 5;
    }
    if (keyIsDown(this.rotate_lcode)) {
      this.deg -= 0.1;
    }
    if (keyIsDown(this.rotate_rcode)) {
      this.deg += 0.1;
    }
  }
}
