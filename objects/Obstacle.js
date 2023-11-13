class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  display() {
    push();
    fill(0, 0, 255);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}
