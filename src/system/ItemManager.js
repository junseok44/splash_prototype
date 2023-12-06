class ItemManager {
  constructor() {}

  // 아이템 효과의 적용.
  // 그리고 랜덤 아이템 선택.

  static itemEffectTime = 5000;

  static itemTypes = ["ink", "speed", "attack", "defense"];

  static pickRandomItem() {
    return this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
  }

  activateItemEffect(itemEater, itemType) {
    if (this.isItemActivated) return;

    this.isItemActivated = true;

    setTimeout(() => {
      this.isItemActivated = false;
    }, ItemManager.itemEffectTime);

    switch (itemType) {
      case "ink":
        // itemEater.inkCapacity += 100;
        break;
      case "speed":
        // itemEater.speed += 0.5;
        break;
      case "attack":
        // itemEater.attack += 0.5;
        break;
      case "defense":
        // itemEater.defense += 0.5;
        break;
      default:
        break;
    }
  }
}
