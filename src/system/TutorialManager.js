class TutorialManager {
  constructor({ imageLib, system, player1, player2, pg }) {
    this.tutorialIndex = 0;
    this.imageLib = imageLib;
    this.system = system;
    this.player1 = player1;
    this.player2 = player2;
    this.pg = pg;
  }

  tutorialPrev() {
    if (this.tutorialIndex > 0) {
      this.tutorialIndex--;
      this.pg.clear();
    }
  }

  tutorialNext() {
    if (this.tutorialIndex < this.imageLib.tutorialImages.length - 1) {
      this.tutorialIndex++;
      this.pg.clear();
    } else {
      this.system.changePhase(System.PHASE.MAIN_GAME);
    }
  }

  displayTutorialPlayer() {}
}
