class Player {
  constructor(
    x,
    y,
    width,
    height,
    bullets,
    color,
    { l, r, u, d, rotate_l, rotate_r, attack }
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lcode = l;
    this.rcode = r;
    this.ucode = u;
    this.dcode = d;
    this.rotate_lcode = rotate_l;
    this.rotate_rcode = rotate_r;
    this.attackcode = attack;
    this.deg = 0;

    this.bullets = bullets;
    this.color = color;
    this.isAttacked = false;
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

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
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

  display() {
    push();

    fill(255);

    translate(this.x, this.y);
    rotate(this.deg);

    rect(0, 0, this.width, this.height);
    ellipse(0, -20, 10, 10);

    fill(0);
    pop();
  }
}
