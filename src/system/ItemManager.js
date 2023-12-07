class ItemManager {
  constructor() {
    this.isItemActivated = false;
  }

  static itemEffectTime = 1500;

  static itemTypes = {
    SPEED_UP: "speed_up",
    REVERSE: "reverse",
    RANGE_UP: "range_up",
  };

  static pickRandomItem() {
    const itemTypes = Object.values(ItemManager.itemTypes);
    const randomIndex = Math.floor(Math.random() * itemTypes.length);
    const randomItemType = itemTypes[randomIndex];

    return randomItemType;
  }

  activateItemEffect({ itemEater, itemType }) {
    if (this.isItemActivated) return;

    this.isItemActivated = true;

    // 다시 아이템 효과 받을 수 있게 준비해주는 역할.
    setTimeout(() => {
      this.isItemActivated = false;
    }, ItemManager.itemEffectTime);

    switch (itemType) {
      case ItemManager.itemTypes.SPEED_UP:
        this.applySpeedEffect(itemEater);
        break;
      case ItemManager.itemTypes.REVERSE:
        this.applyReverseEffect(itemEater);
        break;
      case ItemManager.itemTypes.RANGE_UP:
        this.applyRangeUpEffect(itemEater);
        break;
    }
  }

  applySpeedEffect(itemEater) {
    if (itemEater instanceof Attacker) {
      Attacker.attackInterval = 100;
      setTimeout(() => {
        Attacker.attackInterval = 200;
      }, ItemManager.itemEffectTime);
    } else {
      let originalMoveSpeed = itemEater.moveSpeed;
      itemEater.changeMoveSpeed(10);
      setTimeout(() => {
        itemEater.changeMoveSpeed(originalMoveSpeed);
      }, ItemManager.itemEffectTime);
    }
  }

  applyReverseEffect(itemEater) {
    itemEater.isReversed = true;
    setTimeout(() => {
      itemEater.isReversed = false;
    }, ItemManager.itemEffectTime);
  }

  applyRangeUpEffect(itemEater) {
    if (itemEater instanceof Defender) {
      itemEater.rangeUp(50);
      setTimeout(() => {
        itemEater.rangeUp(-50);
      }, ItemManager.itemEffectTime);
    } else {
      itemEater.rangeUp();
    }

    // itemEater.rangeUp();
  }
}
