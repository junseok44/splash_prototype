//다음슬라이드를 넘기려면 enter
//이전슬라이드로 넘기려면 backspace

let images = [];
let currentImageIndex = 0;
let AkeyImage;
let QeImage;
let defArImage;
let SpImage;
let LgImage;
let ReImage;

function preload() {
  images.push(loadImage("assets/Intro.png"));
  images.push(loadImage("assets/Tutorial.png"));
  images.push(loadImage("assets/OffTutorial.png"));
  images.push(loadImage("assets/OffTutorial.png"));
  images.push(loadImage("assets/DefTutorial.png"));
  images.push(loadImage("assets/ChessMapBasic.png"));
  images.push(loadImage("assets/ChessMapBasic.png"));
  images.push(loadImage("assets/ChessMapBasic.png"));
  images.push(loadImage("assets/Item.png"));
}

function setup() {
  createCanvas(700, 400);
  image(images[currentImageIndex], 0, 0, width, height);
}

function keyPressed() {
  if (keyCode === ENTER) {
    nextImage();
  } else if (keyCode === BACKSPACE) {
    prevImage();
  }
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  displayImage();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  displayImage();
}

function displayImage() {
  image(images[currentImageIndex], 0, 0, width, height);

  textStyle(BOLD);
  if (currentImageIndex === 2) {
    fill(0);
    textSize(20);
    textAlign(LEFT);
    let line1 = "1. 공격의 방향키:";
    text(line1, width / 15, height / 4 + 20);
    textSize(15);
    let line2 = "WASD 키를 사용하여";
    text(line2, width / 15, height / 4 + 50);
    let line3 = "공격의 방향을 조절하세요.";
    text(line3, width / 15, height / 4 + 70);

    let AkeyImageX = width / 4 - 100;
    let AkeyImageY = height / 2 - 10;
    let AkeyImageWidth = 200;
    let AkeyImageheight = 150;
    image(AkeyImage, AkeyImageX, AkeyImageY, AkeyImageWidth, AkeyImageheight);
  }

  if (currentImageIndex === 3) {
    fill(0);
    textSize(20);
    textAlign(LEFT);
    let line1 = "2. 각도조절과 공격키:";
    text(line1, width / 15, height / 4 + 20);
    textSize(15);
    let line2 = "각도조절: Q,E (공격 범위의 각도 조절)";
    text(line2, width / 15, height / 4 + 50);
    let line3 = "공격키: R (단순&연속 공격)";
    text(line3, width / 15, height / 4 + 70);

    let QeImageX = width / 4 - 130;
    let QeImageY = height / 2 - 10;
    let QeImageWidth = 250;
    let QeImageheight = 150;
    image(QeImage, QeImageX, QeImageY, QeImageWidth, QeImageheight);
  }

  if (currentImageIndex === 4) {
    fill(0);
    textSize(20);
    textAlign(RIGHT);
    let line1 = "1. 수비의 방향키:";
    text(line1, width / 2 + 220, height / 4 + 20);
    textSize(15);
    let line2 = "수비는 자동으로 수비가 되어요.";
    text(line2, width / 2 + 280, height / 4 + 50);

    let defArImageX = width / 2 + 90;
    let defArImageY = height / 2 - 10;
    let defArImageWidth = 200;
    let defArImageheight = 150;
    image(
      defArImage,
      defArImageX,
      defArImageY,
      defArImageWidth,
      defArImageheight
    );
  }

  if (currentImageIndex === 5) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let SpImageX = width / 3 - 100;
    let SpImageY = height / 2 - 20;
    let SpImageWidth = 200;
    let SpImageheight = 200;
    image(SpImage, SpImageX, SpImageY, SpImageWidth, SpImageheight);

    textSize(20);
    let line3 = "1.속도 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격은 '총알 발사 속도'가";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비는 '이동 속도'가";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "증가해요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 6) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let LgImageX = width / 3 - 100;
    let LgImageY = height / 2 - 20;
    let LgImageWidth = 200;
    let LgImageheight = 200;
    image(LgImage, LgImageX, LgImageY, LgImageWidth, LgImageheight);

    textSize(20);
    let line3 = "2.강화 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격은 '발사되는 잉크면적'이";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비는 '지우는 면적'이";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "늘어나요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 7) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);
    textSize(15);
    let line2 = "아이템의 종류는 총 3가지가 있어요.";
    text(line2, width / 2 - 250, height / 2 - 40);

    let ReImageX = width / 3 - 100;
    let ReImageY = height / 2 - 20;
    let ReImageWidth = 200;
    let ReImageheight = 200;
    image(ReImage, ReImageX, ReImageY, ReImageWidth, ReImageheight);

    textSize(20);
    let line3 = "3.대마왕 아이템";
    text(line3, width / 2 - 10, height / 2);

    textSize(15);
    let line4 = "적용: 아이템을 먼저 획득한 공격 or 수비";
    text(line4, width / 2 - 15, height / 2 + 30);

    let line5 = "공격 획득, '수비의 방향'이";
    text(line5, width / 2 - 15, height / 2 + 60);

    let line6 = "수비 획득, '공격의 방향'이";
    text(line6, width / 2 - 15, height / 2 + 90);

    fill(255, 0, 0);
    textSize(20);
    let line7 = "반대로 바뀌어요";
    text(line7, width / 2 - 15, height / 2 + 140);
  }

  if (currentImageIndex === 8) {
    fill(0);
    textSize(25);
    textAlign(LEFT);
    let line1 = "아이템 튜토리얼";
    text(line1, width / 2 - 250, height / 2 - 65);

    textSize(15);
    let line2 = "게임 진행 도중 화면에 물음표 아이템이 뜨게 되면...";
    text(line2, width / 2 - 250, height / 2 - 40);

    fill(0, 0, 255);
    textAlign(CENTER);
    textSize(30);
    let line3 = "공격";
    text(line3, width / 2 - 160, height / 2 + 30);

    textSize(35);
    let line4 = "'T 키'";
    text(line4, width / 2 - 160, height / 2 + 80);

    fill(255, 0, 0);
    textSize(30);
    let line5 = "수비";
    text(line5, width / 2 + 160, height / 2 + 30);

    textSize(35);
    let line6 = "'/ 키'";
    text(line6, width / 2 + 160, height / 2 + 80);

    fill(0);
    textSize(15);
    let line7 = "아이템 획득키를 먼저 누르는 사람이 획득하게 됩니다.(선착순)";
    text(line7, width / 2 - 30, height / 2 + 150);

    let line8 = "아이템 지속시간: 5초(이후에는 원래대로 돌아와요)";
    text(line8, width / 2 - 65, height / 2 + 170);
  }
}
