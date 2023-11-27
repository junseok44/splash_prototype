class UI {
  constructor() {}

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
  }

  drawGameResultScreen() {}
}
