class System {
  constructor({ pg, gm }) {
    this.pg = pg;
    this.phase = System.PHASE.INTRO;
    this.gameManager = gm;
  }

  static PHASE = {
    INTRO: "intro",
    SELECT_CHARACTER: "select_character",
    TUTORIAL: "tutorial",
    MAIN_GAME: "main_game",
    GAME_RESULT: "game_result",
  };

  static frameRate = 60;

  changePhase(phase) {
    switch (phase) {
      case System.PHASE.INTRO:
        this.phase = System.PHASE.INTRO;
        break;
      case System.PHASE.SELECT_CHARACTER:
        this.phase = System.PHASE.SELECT_CHARACTER;
        break;
      case System.PHASE.TUTORIAL:
        this.phase = System.PHASE.TUTORIAL;
        break;
      case System.PHASE.MAIN_GAME:
        this.phase = System.PHASE.MAIN_GAME;
        this.gameManager.startMainGame();
        break;
      case System.PHASE.GAME_RESULT:
        this.phase = System.PHASE.GAME_RESULT;
        break;
    }
  }
}
