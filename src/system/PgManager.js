class PgManager {
  constructor() {
    this.initialPosition = {
      x: (windowWidth * 11) / 100,
      y: (windowHeight * 23) / 100,
    };

    this.size = {
      width: (windowWidth * 78) / 100,
      height: (windowHeight * 74) / 100,
    };

    this.isPgChanged = false;
  }

  static instance = null;

  static getInstance() {
    if (PgManager.instance === null) {
      PgManager.instance = new PgManager();
    }
    return PgManager.instance;
  }

  changePgPosition({ x, y }, width, height) {
    this.initialPosition = { x, y };
    this.size = { width, height };
  }
}
