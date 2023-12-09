class GameManager {
  // 아이템 효과 관련 로직을 총괄.
  // 카운트다운.
  // 잉크 비율도 여기서 관리하도록.
  // 본 게임에서 게임 스타트 이런것도 해야하니까.

  // FIXME: 만약 두번째 아이템이 적용중인데, 랜덤 아이템이 나오면? 지금 안

  constructor({ player1, player2 }) {
    this._currentItemType = null;
    this._currentItemImage = null;
    this._currentItemEater = null;

    this.player1 = player1;
    this.player2 = player2;

    this.isDisplayRandomItemImage = false;
    this.itemResetTimer = null;
  }

  static randomItemDisplayInterval = 10000;
  static randomItemDisplayDuration = 5000;

  static checkCurrentItemEater(keyCode, { player1, player2 }) {
    if (keyCode === 84) {
      return player1;
    } else if (keyCode === 80) {
      return player2;
    }
  }

  showRandomItemImage() {
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
    this.currentItemEater.setItemType(this.currentItemType);

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
