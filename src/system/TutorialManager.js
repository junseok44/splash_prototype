class TutorialManager {
  constructor({ imageLib, system, player1, player2, pg }) {
    this.tutorialIndex = 0;
    this.imageLib = imageLib;
    this.system = system;
    this.player1 = player1;
    this.player2 = player2;
    this.pg = pg;
  }

  stageSettings() {
    if (this.tutorialIndex == 2) {
      this.player2.minimiInitialize();
      this.player2.setInitialPosition({
        x: (windowWidth * 20) / 100,
        y: (windowHeight * 30) / 100,
      });
    }

    if (this.tutorialIndex == 3) {
      this.player2.minimiInitialize();
      this.player2.setInitialPosition({
        x: (windowWidth * 80) / 100,
        y: (windowHeight * 50) / 100,
      });
    }

    if (this.tutorialIndex == 1 || this.tutorialIndex == 2) {
      this.player1.setInitialPosition({
        x: (windowWidth * 20) / 100,
        y: (windowHeight * 50) / 100,
      });
    }
    if (this.tutorialIndex == 4) {
      this.player2.minimiInitialize();
      this.player2.setInitialPosition({
        x: (windowWidth * 80) / 100,
        y: (windowHeight * 50) / 100,
      });
      this.player1.setInitialPosition({
        x: (windowWidth * 60) / 100,
        y: (windowHeight * 50) / 100,
      });
    }
  }

  tutorialPrev() {
    if (this.tutorialIndex > 0) {
      this.tutorialIndex--;
      this.pg.clear();

      this.stageSettings();
    }
  }

  tutorialNext() {
    if (this.tutorialIndex < this.imageLib.tutorialImages.length - 1) {
      this.tutorialIndex++;
      this.pg.clear();

      this.stageSettings();
    } else {
      this.player1.setInitialPosition({
        x: (windowWidth * 30) / 100,
        y: (windowHeight * 50) / 100,
      });

      this.player2.setInitialPosition({
        x: (windowWidth * 70) / 100,
        y: (windowHeight * 50) / 100,
      });

      this.system.changePhase(System.PHASE.MAIN_GAME);
    }
  }

  displayTutorialPlayer() {}
}
