class ItemManager {
  constructor({ player1, player2 }) {
    this.isItemActivated = false;
    this.deactivateItemCallback = null;
    this.player1 = player1;
    this.player2 = player2;
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
      let originalAttackInterval = Attacker.attackInterval;
      Attacker.attackInterval = 50;

      this.deactivateItemCallback = () => {
        Attacker.attackInterval = originalAttackInterval;
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
    if (itemEater instanceof Defender) {
      this.player1.isReversed = true;
      this.deactivateItemCallback = () => {
        this.player1.isReversed = false;
      };
    } else {
      this.player2.isReversed = true;
      this.deactivateItemCallback = () => {
        this.player2.isReversed = false;
      };
    }

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
