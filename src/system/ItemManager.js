class ItemManager {
  constructor() {
    this.isItemActivated = false;
    this.deactivateItemCallback = null;
  }

  static itemEffectTime = 3000;
  static defenderRangeUpValue = 100;
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

      this.deactivateItemCallback = () => {
        Attacker.attackInterval = 200;
      };
    } else {
      let originalMoveSpeed = itemEater.moveSpeed;
      itemEater.changeMoveSpeed(10);

      this.deactivateItemCallback = () => {
        itemEater.changeMoveSpeed(originalMoveSpeed);
      };
    }
  }

  applyReverseEffect(itemEater) {
    itemEater.isReversed = true;
    itemEater.itemType = ItemManager.itemTypes.REVERSE;

    this.deactivateItemCallback = () => {
      itemEater.isReversed = false;
    };

    // setTimeout(() => {
    //   itemEater.isReversed = false;
    //   itemEater.itemType = null;
    // }, ItemManager.itemEffectTime);
  }

  applyRangeUpEffect(itemEater) {
    if (itemEater instanceof Defender) {
      itemEater.rangeUp(ItemManager.defenderRangeUpValue);

      this.deactivateItemCallback = () => {
        itemEater.rangeUp(-ItemManager.defenderRangeUpValue);
      };

      // setTimeout(() => {
      //   itemEater.rangeUp(-ItemManager.defenderRangeUpValue);
      // }, ItemManager.itemEffectTime);
    } else {
      ink.changeInkPatternSize(ItemManager.attackerRangeUpValue);

      this.deactivateItemCallback = () => {
        ink.changeInkPatternSize(InkPattern.originalInkMaxSize);
      };
    }
  }
}
