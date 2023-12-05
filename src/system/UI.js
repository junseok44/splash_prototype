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
  }

  // 화면 양 옆의 여백

  // TODO 임시로 설정.

  static playerRespawnComment = `부활까지 남은 시간:`;

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

  drawMainGameScreen(inkAreaRatio) {
    textSize(15);
    text("플레이어1 이동: wasd 회전 qe 잉크총 발사 r", 10, 20);
    text("플레이어2 이동: 방향키 회전 < > 바닥 청소 /", 10, 40);

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
    for (let i = 0; i < this.player1.life; i++) {
      push();
      noStroke();
      fill(255, 0, 0);
      ellipse(
        i * 50 + this.playerLifeUIOffset,
        this.playerLifeUIheight,
        30,
        30
      );
      pop();
    }

    for (let i = 0; i < this.player2.life; i++) {
      push();
      fill(255, 0, 0);
      noStroke();
      ellipse(
        this.canvasWidth - i * 50 - this.playerLifeUIOffset,
        this.playerLifeUIheight,
        30,
        30
      );
      pop();
    }
  }

  drawGameResultScreen() {}
}
