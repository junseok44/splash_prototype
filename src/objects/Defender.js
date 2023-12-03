class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
  }

  attack() {
    if (keyIsDown(this.attackcode)) {
      push();

      let pg = this.pg;
      // throttling
      // if (!this.isAttacked) {
      pg.push();
      pg.rectMode(pg.CENTER);
      pg.translate(this.x, this.y);
      pg.rotate(this.deg);
      pg.fill(255);
      pg.rect(0, -20, this.width, this.height);
      pg.pop();
      ㅔ;
      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, 100);
      // }

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
    }
  }
}
