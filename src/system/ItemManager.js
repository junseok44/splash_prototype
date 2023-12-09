class ItemManager {
  constructor() {
    this.isItemActivated = false;
  }

  static itemEffectTime = 3000;
  static defenderRangeUpValue = 50;
  static attackerRangeUpValue = 100;

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

  static setPlayerItemType(player, itemType) {
    player.itemType = itemType;
    setTimeout(() => {
      player.itemType = null;
    }, ItemManager.itemEffectTime);
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

    ItemManager.setPlayerItemType(itemEater, ItemManager.itemTypes.SPEED_UP);
  }

  applyReverseEffect(itemEater) {
    itemEater.isReversed = true;
    itemEater.itemType = ItemManager.itemTypes.REVERSE;
    setTimeout(() => {
      itemEater.isReversed = false;
      itemEater.itemType = null;
    }, ItemManager.itemEffectTime);

    ItemManager.setPlayerItemType(itemEater, ItemManager.itemTypes.REVERSE);
  }

  applyRangeUpEffect(itemEater) {
    if (itemEater instanceof Defender) {
      itemEater.rangeUp(ItemManager.defenderRangeUpValue);
      setTimeout(() => {
        itemEater.rangeUp(-ItemManager.defenderRangeUpValue);
      }, ItemManager.itemEffectTime);
    } else {
      ink.changeInkPatternSize(ItemManager.attackerRangeUpValue);
      setTimeout(() => {
        ink.changeInkPatternSize(InkPattern.originalInkMaxSize);
      }, ItemManager.itemEffectTime);
    }

    ItemManager.setPlayerItemType(itemEater, ItemManager.itemTypes.RANGE_UP);
  }
}
