class ImageLibrary {
  constructor() {
    this.itemImages = [];
    this.resultImages = [];
    this.backgroundImage;
  }

  static BASE_DIR = "src/assets/image/";

  loadImages() {
    this.randomItemImage = loadImage(ImageLibrary.BASE_DIR + "item.png");

    this.itemImages = [
      loadImage(ImageLibrary.BASE_DIR + "image10.png"), // 속도
      loadImage(ImageLibrary.BASE_DIR + "image11.png"), // 빙결
      loadImage(ImageLibrary.BASE_DIR + "image12.png"), // 범위
      loadImage(ImageLibrary.BASE_DIR + "image13.png"), // 리버스
      loadImage(ImageLibrary.BASE_DIR + "image14.png"), // 달팽이
    ];

    this.resultImages = [
      loadImage(ImageLibrary.BASE_DIR + "Chess Map Winner.png"),
      loadImage(ImageLibrary.BASE_DIR + "Chess Map Winner 1.png"),
    ];

    this.backgroundImage = loadImage(
      ImageLibrary.BASE_DIR + "Chess Map Basic.png"
    );

    // for (let i = 1; i <= 5; i++) {
    //   let photo = loadImage(BASE_DIR + `photo${i}.png`);
    //   photos.push(photo);
    // }
    // for (let i = 1; i <= 2; i++) {
    //   let pic = loadImage(BASE_DIR + `Pic${i}.png`);
    //   choices.push(pic);
    // }
  }

  getItemImage(type) {
    switch (type) {
      case ItemManager.itemTypes.SPEED_UP:
        return this.itemImages[0];
      case ItemManager.itemTypes.FREEZE:
        return this.itemImages[1];
      case ItemManager.itemTypes.RANGE_UP:
        return this.itemImages[2];
      case ItemManager.itemTypes.REVERSE:
        return this.itemImages[3];
      case ItemManager.itemTypes.SNAIL:
        return this.itemImages[4];
      default:
        return null;
    }
  }
}
