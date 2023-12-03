class Player {
  constructor({
    x,
    y,
    width,
    height,
    bullets,
    color,
    l,
    r,
    u,
    d,
    rotate_l,
    rotate_r,
    attack,
  }) {
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
    throw Error("this method must be implemented");
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

  //REVISED
  changeControls(l, r, u, d, rotate_l, rotate_r, attack) {
    this.lcode = l;
    this.rcode = r;
    this.ucode = u;
    this.dcode = d;
    this.rotate_lcode = rotate_l;
    this.rotate_rcode = rotate_r;
    this.attackcode = attack;
  }
}
