class Defender extends Player {
  constructor(args) {
    super(args);
    this.pg = args.pg;
  }

  //REVISED
  changeControlsForAttackWithReverse() {
    this.changeControls(39, 37, 40, 38, 188, 190, 191);
  }

  changeControlsForAttackWithFreeze() {
    this.changeControls(50, 51, 52, 53, 54, 55, 56);
  }

  changeCleanAreaOffset(value) {
    this.cleanAreaOffset = value;
  }

  attack() {
    if (keyIsDown(this.attackcode)) {
      push();

      let pg = this.pg;
      // throttling
      if (!this.isAttacked) {
        pg.push();
        pg.rectMode(pg.CENTER);
        pg.translate(this.x, this.y);
        pg.rotate(this.deg);
        pg.fill(255);
        pg.rect(0, -20, 50, 150);
        pg.pop();

        this.isAttacked = true;
        setTimeout(() => {
          this.isAttacked = false;
        }, 100);
      }

      // ink.drawCurveVertexesToPG(pg, this.x, this.y, this.deg);
      pop();
    }
  }
}
