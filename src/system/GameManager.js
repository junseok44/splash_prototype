class GameManager {
  constructor({ player1, player2, pg, bullets }) {
    this.countdown = GameManager.gameCountDownSec;

    this.inkAreaRatio = 0;
    this.pg = pg;

    this._currentItemType = null;
    this._currentItemImage = null;
    this._currentItemEater = null;

    this.player1 = player1;
    this.player2 = player2;

    this.bullets = bullets;

    this.isDisplayRandomItemImage = false;
    this.itemResetTimer = null;

    this._randomItemDisplayTimer = null;
    this._calculateInkAreaRatioTimer = null;
    this._countdownTimer = null;

    this.centeredCountDown = 3;

    this.isReady = false;
    this.isReadyEnd = false;
  }

  static gameCountDownSec = 120;
  static lastSeconds = 5;
  static randomItemDisplayInterval = 12000;
  static randomItemDisplayDuration = 5000;
  static calculateInkAreaRatioInterval = 5000;

  static lastSeconds = 5;

  static isColorMatch(r1, g1, b1, a1, r2, g2, b2, a2, threshold) {
    return (
      Math.abs(r1 - r2) <= threshold &&
      Math.abs(g1 - g2) <= threshold &&
      Math.abs(b1 - b2) <= threshold &&
      Math.abs(a1 - a2) <= threshold
    );
  }

  static checkCurrentItemEater(keyCode, { player1, player2 }) {
    if (keyCode === player1.itemCode) {
      return player1;
    } else {
      return player2;
    }
  }

  get isEndGame() {
    return this.countdown <= 0;
  }

  timeLapse() {
    this.countdown--;
  }

  initializeMainGame() {
    this.resetItem();
    this.countdown = GameManager.gameCountDownSec;
    this.inkAreaRatio = 0;
    this.isDisplayRandomItemImage = false;
    bullets = [];

    pg.clear();
    pg.fill(255);

    if (this._randomItemDisplayTimer)
      clearInterval(this._randomItemDisplayTimer);
    if (this._calculateInkAreaRatioTimer)
      clearInterval(this._calculateInkAreaRatioTimer);
    if (this._countdownTimer) clearInterval(this._countdownTimer);
    if (this._startCountdownTimer) clearInterval(this._startCountdownTimer);
    if (this._startMainGameTimer) clearInterval(this._startMainGameTimer);
    player1.initialize();
    player2.initialize();
  }

  startMainGameCountdown() {
    this.initializeMainGame();

    this.isReady = false;
    this.countdown = 3;

    this._startCountdownTimer = setInterval(() => {
      this.timeLapse();
    }, 1000);

    this._startMainGameTimer = setTimeout(() => {
      clearInterval(this._startCountdownTimer);
      this.startMainGame();
    }, 3000);
  }

  startMainGame() {
    this.isReady = true;
    this.countdown = GameManager.gameCountDownSec;

    this._randomItemDisplayTimer = setInterval(() => {
      this.showRandomItemImage();
    }, GameManager.randomItemDisplayInterval);

    setTimeout(() => {
      this.isReadyEnd = true;
    }, (GameManager.gameCountDownSec - GameManager.lastSeconds) * 1000);

    this._calculateInkAreaRatioTimer = setInterval(() => {
      this.calculateInkAreaRatio();
    }, GameManager.calculateInkAreaRatioInterval);

    this._countdownTimer = setInterval(() => {
      this.timeLapse();
    }, 1000);

    this.player2.minimiInitialize();
  }

  calculateInkAreaRatio() {
    pg.loadPixels();

    let totalPixels = pg.pixels.length / 4;
    let inkedPixels = 0;

    // 픽셀 띄엄띄엄 확인하기
    let skipPixels = 10;

    for (let i = 0; i < pg.pixels.length; i += 4) {
      let r = pg.pixels[i];
      let g = pg.pixels[i + 1];
      let b = pg.pixels[i + 2];
      let a = pg.pixels[i + 3];

      // 특정 색상 (rgb(255,78,202))이면 inkedPixels를 증가
      if (GameManager.isColorMatch(r, g, b, a, 255, 78, 202, 255, 100)) {
        inkedPixels++;
      }
    }
    pg.updatePixels();

    // inkAreaRatio를 0 미만으로 되지 않도록 조정
    this.inkAreaRatio = max(min((inkedPixels / totalPixels) * 100, 100), 0);
    console.log(this.inkAreaRatio);
  }

  showRandomItemImage() {
    itemSound.play();
    this.isDisplayRandomItemImage = true;
    setTimeout(() => {
      this.isDisplayRandomItemImage = false;
    }, GameManager.randomItemDisplayDuration);
  }

  setCurrentItemStatus(keyCode, imageLib, itemManager) {
    this.isDisplayRandomItemImage = false;

    clearInterval(this.itemResetTimer);
    this.resetItem();
    if (itemManager.deactivateItemCallback) {
      itemManager.deactivateItemCallback();
    }

    this.currentItemEater = GameManager.checkCurrentItemEater(keyCode, {
      player1: this.player1,
      player2: this.player2,
    });

    this.setCurrentItemTypeAndImage(ItemManager.pickRandomItem(), imageLib);

    // 테스트용.
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.RANGE_UP, imageLib);
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.SPEED_UP, imageLib);
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.REVERSE, imageLib);

    // keyCode가 다른게 되는 경우가 있어서,

    // REVERSE의 경우 리버스 이펙트는 currentItemEater가 아닌 플레이어가 되어야함.

    if (this.currentItemType == ItemManager.itemTypes.REVERSE) {
      if (this.currentItemEater == this.player1) {
        this.player2.setItemType(this.currentItemType);
      } else {
        this.player1.setItemType(this.currentItemType);
      }
    } else {
      this.currentItemEater.setItemType(this.currentItemType);
    }

    this.itemResetTimer = setTimeout(() => {
      if (itemManager.deactivateItemCallback)
        itemManager.deactivateItemCallback();
      itemManager.deactivateItemCallback = null;
      this.resetItem();
    }, ItemManager.itemEffectTime);
  }

  resetItem() {
    this.currentItemEater = null;
    this.currentItemType = null;
    this.currentItemImage = null;
    this.player1.setItemType(null);
    this.player2.setItemType(null);
  }

  setCurrentItemTypeAndImage(type, imageLib) {
    this.currentItemType = type;
    this.currentItemImage = imageLib.getItemImage(type);
  }

  get isDisplayItemImage() {
    return this._currentItemImage && this._currentItemType;
  }

  get currentItemEater() {
    return this._currentItemEater;
  }

  get currentItemType() {
    return this._currentItemType;
  }

  get currentItemImage() {
    return this._currentItemImage;
  }

  set currentItemEater(eater) {
    this._currentItemEater = eater;
  }

  set currentItemType(type) {
    this._currentItemType = type;
  }

  set currentItemImage(image) {
    this._currentItemImage = image;
  }
}
