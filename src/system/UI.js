class UI {
  // player1, player2는 모두 player class를 상속받은 객체여야 합니다!
  constructor(args) {
    this.player1 = args.player1;
    this.player2 = args.player2;
    this.canvasWidth = width;
    this.canvasHeight = height;

    this.player1DeadTime = 0;
    this.player2DeadTime = 0;

    this.UIHeight = (this.canvasHeight / 100) * 20;
    this.horizontalGridOffset = (this.canvasWidth / 100) * 11;
    this.verticalGridOffset = (this.canvasHeight / 100) * 3;

    this.playerLifeUIOffset = (this.canvasWidth / 100) * 14;
    this.playerLifeUIheight = (this.canvasHeight / 100) * 13;

    this.inkRatioUIOffset = (this.canvasWidth / 100) * 20;
    this.inkRatioUIheight = (this.canvasHeight / 100) * 6;

    this.itemTooltipUiOffset = (this.canvasWidth / 100) * 22;
    this.itemTooltipUiHeight = (this.canvasHeight / 100) * 19;

    this.itemUIOffset = (this.canvasWidth / 100) * 40;
    this.itemUIheight = (this.canvasHeight / 100) * 17;
  }

  static playerRespawnComment = `부활까지 남은 시간:`;
  static itemTooltipUiRectWidth = 270;
  static itemTooltipUiRectHeight = 40;

  calculateRespawnLeftTime(deadTime) {
    return Math.floor(
      Player.respawnTime / 1000 + 1 - (millis() - deadTime) / 1000
    );
  }

  drawTitleScreen() {
    textSize(30);
    text("press any key to start", 10, 30);
  }

  drawSelectCharacterScreen() {}

  drawTutorialScreen() {}

  drawMainGameScreen(inkAreaRatio, countdown) {
    textAlign(CENTER, CENTER);
    push();

    textSize(80);
    fill(0);
    text(countdown, this.canvasWidth / 2, this.canvasHeight / 5.4);

    pop();

    push();
    textSize(20);
    text(
      `Attacker: ${inkAreaRatio.toFixed(0)}%`,
      this.inkRatioUIOffset,
      this.inkRatioUIheight
    );

    text(
      `Defender:${100 - inkAreaRatio.toFixed(0)}%`,
      this.canvasWidth - this.inkRatioUIOffset,
      this.inkRatioUIheight
    );

    pop();

    push();
    // display the percentage of pink pixels
    textAlign(CENTER, CENTER);
    textSize(40);
    textStyle(BOLD);
    fill(80, 165, 215);
    text(
      nf(inkAreaRatio, 2, 1),
      this.canvasWidth / 18,
      this.canvasHeight / 3.2
    );
    fill(115, 20, 150);
    text(
      100 - nf(inkAreaRatio, 2, 1),
      (16.93 * this.canvasWidth) / 18,
      this.canvasHeight / 3.2
    );

    pop();

    // item slot
    push();
    fill(255);
    rect(this.itemUIOffset, this.itemUIheight, 100, 100);
    rect(this.canvasWidth - this.itemUIOffset, this.itemUIheight, 100, 100);
    fill(0);
    noStroke();
    textSize(20);
    text("Item slot", this.itemUIOffset, this.itemUIheight);
    text("Item slot", this.canvasWidth - this.itemUIOffset, this.itemUIheight);
    textSize(15);
    text("press T", this.itemUIOffset, this.itemUIheight + 20);
    text(
      "Press P",
      this.canvasWidth - this.itemUIOffset,
      this.itemUIheight + 20
    );

    pop();

    push();
    rectMode(LEFT);
    rect(
      this.itemTooltipUiOffset,
      this.itemTooltipUiHeight,
      UI.itemTooltipUiRectWidth,
      UI.itemTooltipUiRectHeight
    );
    rect(
      this.canvasWidth - this.itemTooltipUiOffset,
      this.itemTooltipUiHeight,
      UI.itemTooltipUiRectWidth,
      UI.itemTooltipUiRectHeight
    );
    pop();

    // attacker 죽었을때 부활까지 남은 시간 표시
    if (this.player1.isDead) {
      push();
      textSize(25);
      textAlign(LEFT);
      fill(255);
      if (this.player1DeadTime === 0) {
        this.player1DeadTime = millis();
      }
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player1DeadTime),
        this.playerLifeUIOffset,
        this.playerLifeUIheight
      );
      pop();
    } else {
      // 죽은 시간 초기화해줌
      this.player1DeadTime = 0;
    }

    // defender 죽었을때 부활까지 남은 시간 표시
    if (this.player2.isDead) {
      if (this.player2DeadTime === 0) {
        this.player2DeadTime = millis();
      }
      push();
      textSize(25);
      fill(255);

      textAlign(RIGHT);
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player2DeadTime),
        width - this.playerLifeUIOffset,
        this.playerLifeUIheight
      );
      pop();
    } else {
      this.player2DeadTime = 0;
    }

    // attacker, defender의 체력 UI 표시 (몇개 남았는지)
    // for (let i = 0; i < this.player1.life; i++) {
    //   push();
    //   noStroke();
    //   fill(255, 0, 0);
    //   ellipse(
    //     i * 50 + this.playerLifeUIOffset,
    //     this.playerLifeUIheight,
    //     30,
    //     30
    //   );
    //   pop();
    // }

    // for (let i = 0; i < this.player2.life; i++) {
    //   push();
    //   fill(255, 0, 0);
    //   noStroke();
    //   ellipse(
    //     this.canvasWidth - i * 50 - this.playerLifeUIOffset,
    //     this.playerLifeUIheight,
    //     30,
    //     30
    //   );
    //   pop();
    // }

    // Change circles to hearts
    for (let i = 5; i > this.player1.life && i > 0; i--) {
      push();
      noStroke();
      fill(0, 0, 0);
      rect(
        (i * this.canvasWidth) / 26 + this.canvasWidth / 11.4,
        this.playerLifeUIheight * 0.98,
        this.canvasWidth * 0.032,
        this.playerLifeUIheight * 0.42
      );
      pop();
    }

    for (let i = 5; i > this.player2.life && i > 0; i--) {
      push();
      fill(0, 0, 0);
      noStroke();
      rect(
        this.canvasWidth - (i * this.canvasWidth) / 25 - this.canvasWidth / 9.4,
        this.playerLifeUIheight * 0.98,
        this.canvasWidth * 0.037,
        this.playerLifeUIheight * 0.42
      );
      pop();
    }

    //점수계산
    for (let i = 0; i < 600; i = i + 50) {
      push();
      fill(0);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.018,
        (1.2 * this.playerLifeUIheight) / 5
      );
      fill(30, 130, 130);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.015,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    for (let i = 0; i < 600; i = i + 50) {
      push();
      fill(0);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.0199,
        (1.2 * this.playerLifeUIheight) / 5
      );
      fill(90, 50, 120);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.016,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    //offense advantage
    for (
      let i = 550;
      i >= (600 * (2 * inkAreaRatio.toFixed(0))) / 100;
      i = i - 50
    ) {
      push();
      fill(90, 50, 120);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.015,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    for (
      let i = 0;
      i <= ((600 * inkAreaRatio.toFixed(0)) / 100 - 300) * 2;
      i = i + 50
    ) {
      push();
      fill(30, 130, 130);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.016,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }
  }

  drawGameItemImage(itemImage) {
    let x = width / 2 - itemImage.width / 4;
    let y = height / 2 - itemImage.height / 4;
    let smallerWidth = itemImage.width / 2;
    let smallerHeight = itemImage.height / 2;

    image(itemImage, x, y, smallerWidth, smallerHeight);
  }

  drawItemSlotImage(itemImage, isAttacker) {
    let x = isAttacker
      ? this.itemUIOffset
      : this.canvasWidth - this.itemUIOffset;
    let y = this.itemUIheight;

    push();
    imageMode(CENTER);
    image(itemImage, x, y, 100, 100);
    pop();
  }

  drawItemToolTip(itemType, isAttacker) {
    push();
    textAlign(CENTER, CENTER);
    textSize(18);
    fill(255);

    let textX = isAttacker
      ? this.itemTooltipUiOffset
      : this.canvasWidth - this.itemTooltipUiOffset;
    let textY = this.itemTooltipUiHeight;
    text(`${itemType}획득!!`, textX, textY);
    pop();
  }

  drawGameResultScreen(winnerImage) {
    image(winnerImage, 0, 0, this.canvasWidth, this.canvasHeight);
  }
}
