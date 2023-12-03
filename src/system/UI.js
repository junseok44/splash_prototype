class UI {
  // player1, player2는 모두 player class를 상속받은 객체여야 합니다!
  constructor(args) {
    this.player1 = args.player1;
    this.player2 = args.player2;

    this.player1DeadTime = 0;
    this.player2DeadTime = 0;
  }

  // 화면 양 옆의 여백
  static playerLifeUIOffset = 100;
  static playerLifeUIheight = 50;
  static playerRespawnComment = `부활까지 남은 시간:`;

  drawUI(phase) {
    switch (phase) {
      case "intro":
        this.drawTitleScreen();
        break;
      case "select_character":
        this.drawSelectCharacterScreen();
        break;
      case "tutorial":
        this.drawTutorialScreen();
        break;
      case "main_game":
        this.drawMainGameScreen();
        break;
      case "game_result":
        this.drawGameResultScreen();
        break;
    }
  }

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

  drawMainGameScreen() {
    textSize(15);
    text("플레이어1 이동: wasd 회전 qe 잉크총 발사 r", 10, 20);
    text("플레이어2 이동: 방향키 회전 < > 바닥 청소 /", 10, 40);

    // attacker 죽었을때 부활까지 남은 시간 표시
    if (this.player1.isDead) {
      push();
      textSize(20);
      textAlign(LEFT);
      if (this.player1DeadTime === 0) {
        this.player1DeadTime = millis();
      }
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player1DeadTime),
        UI.playerLifeUIOffset,
        UI.playerLifeUIheight
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
      textSize(20);
      textAlign(RIGHT);
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player2DeadTime),
        width - UI.playerLifeUIOffset,
        UI.playerLifeUIheight
      );
      pop();
    } else {
      this.player2DeadTime = 0;
    }

    // attacker, defender의 체력 UI 표시 (몇개 남았는지)
    for (let i = 0; i < this.player1.life; i++) {
      push();
      fill(255, 0, 0);
      noStroke();
      ellipse(i * 50 + UI.playerLifeUIOffset, UI.playerLifeUIheight, 30, 30);
      pop();
    }

    for (let i = 0; i < this.player2.life; i++) {
      push();
      fill(255, 0, 0);
      noStroke();
      ellipse(
        width - i * 50 - UI.playerLifeUIOffset,
        UI.playerLifeUIheight,
        30,
        30
      );
      pop();
    }
  }

  drawGameResultScreen() {}
}
