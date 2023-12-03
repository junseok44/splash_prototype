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
