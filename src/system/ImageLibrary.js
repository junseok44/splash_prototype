class ImageLibrary {
  constructor() {
    this.itemImages = [];
    this.resultImages = [];
    this.backgroundImage;
  }

  static attackerImage;
  static BASE_DIR = "src/assets/image/";
  static BASE_VIDEO_DIR = "src/assets/video/";

  loadImages() {
    this.randomItemImage = loadImage(ImageLibrary.BASE_DIR + "item.png");

    this.tutorialImages = [];

    this.introImage = loadImage(ImageLibrary.BASE_DIR + "0타이틀.png");
    this.creditsImage = loadImage(ImageLibrary.BASE_DIR + "Credits.png");

    this.itemImages = [
      loadImage(ImageLibrary.BASE_DIR + "image10.png"), // 속도
      loadImage(ImageLibrary.BASE_DIR + "image11.png"), // 범위
      loadImage(ImageLibrary.BASE_DIR + "image12.png"), // 리버스
    ];

    ImageLibrary.attackerImage = loadImage(
      ImageLibrary.BASE_DIR + "공격 최종.png"
    );

    ImageLibrary.defenderImage = loadImage(
      ImageLibrary.BASE_DIR + "수비 최종.png"
    );

    ImageLibrary.minimiImage = loadImage(
      ImageLibrary.BASE_DIR + "수비 방패.png"
    );

    this.tutorialImages = [
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/1게임 목적.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/2공격 조작법.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/3공격 조작법 타격.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/4수비 조작법.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/5수비 조작법 타격.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/6직접 타격 설명.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/7아이템 종류.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/8아이템 체험.png"),
      loadImage(ImageLibrary.BASE_DIR + "/tutorial/9UI 설명.png"),
    ];

    this.resultImages = [
      loadImage(ImageLibrary.BASE_DIR + "공격 승리.png"),
      loadImage(ImageLibrary.BASE_DIR + "수비 승리.png"),
    ];

    this.backgroundImage = loadImage(
      ImageLibrary.BASE_DIR + "Chess Map Basic.png"
    );
  }

  getTutorialImage(index) {
    return this.tutorialImages[index];
  }

  getResultImage(winner) {
    console.log(winner);
    if (winner instanceof Attacker) {
      return this.resultImages[0];
    } else {
      return this.resultImages[1];
    }
  }
  getItemImage(type) {
    switch (type) {
      case ItemManager.itemTypes.SPEED_UP:
        return this.itemImages[0];
      case ItemManager.itemTypes.FREEZE:
        return null;
      case ItemManager.itemTypes.RANGE_UP:
        return this.itemImages[1];
      case ItemManager.itemTypes.REVERSE:
        return this.itemImages[2];
      case ItemManager.itemTypes.SNAIL:
        return null;
      default:
        return null;
    }
  }
}
