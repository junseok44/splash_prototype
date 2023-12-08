class GameManager {
  // 아이템 효과 관련 로직을 총괄.
  // 카운트다운.
  // 잉크 비율도 여기서 관리하도록.
  // 본 게임에서 게임 스타트 이런것도 해야하니까.

  // FIXME: 만약 두번째 아이템이 적용중인데, 랜덤 아이템이 나오면? 지금 안

  constructor() {
    this._currentItemType = null;
    this._currentItemImage = null;
    this._currentItemEater = null;

    this.isDisplayRandomItemImage = false;
  }

  static randomItemInterval = 5000;

  showRandomItemImage() {
    this.isDisplayRandomItemImage = true;
    setTimeout(() => {
      this.isDisplayRandomItemImage = false;
    }, GameManager.randomItemInterval);
  }

  onItemKeyPressed(keyCode, imageLib, { player1, player2 }) {
    this.currentItemEater = this.checkCurrentItemEater(keyCode, {
      player1,
      player2,
    });
    this.setCurrentItemTypeAndImage(ItemManager.pickRandomItem(), imageLib);

    // 테스트용.
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.RANGE_UP, imageLib);
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.SPEED_UP, imageLib);
    // this.setCurrentItemTypeAndImage(ItemManager.itemTypes.REVERSE, imageLib);

    this.isDisplayRandomItemImage = false;

    setTimeout(() => {
      this.initializeItem();
    }, ItemManager.itemEffectTime);
  }

  initializeItem() {
    this.currentItemEater = null;
    this.currentItemType = null;
    this.currentItemImage = null;
  }

  checkCurrentItemEater(keyCode, { player1, player2 }) {
    if (keyCode === 84) {
      return player1;
    } else if (keyCode === 80) {
      return player2;
    }
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
