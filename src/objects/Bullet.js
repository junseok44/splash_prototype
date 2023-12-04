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
    this.yPos -= 10; // Update yPos
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
