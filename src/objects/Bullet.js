class Bullet {
  constructor(x, y, deg, color) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.color = color;
    this.width = 10;
    this.height = 10;
    this.yPos = 0;
    this.isEnd = false;
    this.endTimer = null;
    this.isEndDrawing = false;
    this.distance = parseInt(random(150, 200));
  }

  move() {
    this.yPos -= 10;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.deg);

    if (this.yPos <= -this.distance && !this.isEnd) {
      this.isEnd = true;
    } else if (this.yPos > -this.distance) {
      this.move();
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
    }

    pop();
  }
}
