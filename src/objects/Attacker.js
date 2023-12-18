class Attacker extends Player {
  constructor(args) {
    super(args);
    this.deg = PI / 2;
  }

  static attackInterval = 120;

  rangeUp(value) {
    // Attacker.attackInterval -= value;
  }

  attack() {
    push();

    if (!this.isAttacked) {
      let correction = random(-0.3, 0.3);

      let direction = PI / 2 + this.deg + correction;

      bullets.push(new Bullet(this.x, this.y, direction, this.color));
      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, Attacker.attackInterval);
    }

    pop();
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.deg);
    image(ImageLibrary.attackerImage, -this.width / 2, -this.height / 2);
    pop();

    super.display();
  }
}
