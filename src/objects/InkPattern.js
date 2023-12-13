class InkPattern {
  static makeInkPattern(patternSize, maxSize = InkPattern.originalInkMaxSize) {
    var result = [];
    for (var n = 0; n < patternSize; n++) {
      var list = [];
      for (var i = 0; i <= 400; i += 20) {
        list.push(
          createVector(
            random(10, maxSize) * cos(radians(i)),
            random(10, maxSize) * sin(radians(i))
          )
        );
      }
      result[n] = list;
    }
    return result;
  }

  constructor(patternSize) {
    this.patternSize = patternSize;
    this.ink = InkPattern.makeInkPattern(patternSize);
  }

  static originalInkMaxSize = 65;

  changeInkPatternSize(maxSize) {
    this.ink = InkPattern.makeInkPattern(this.patternSize, maxSize);
  }

  getInkPattern() {
    var idx = parseInt(random(0, this.patternSize - 1));
    return this.ink[idx];
  }

  drawCurveVertexesToPG(pg, x, y, distance, deg, color) {
    var idx = parseInt(random(0, this.patternSize - 1));
    pg.push();
    pg.beginShape();
    pg.translate(x - (windowWidth * 11) / 100, y - (windowHeight * 23) / 100);
    pg.rotate(deg);
    pg.fill(color);
    for (var i = 0; i < this.ink[idx].length; i++) {
      //수정
      pg.curveVertex(this.ink[idx][i].x, this.ink[idx][i].y - distance);
    }
    pg.endShape();
    pg.pop();
  }
}
