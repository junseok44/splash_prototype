//이미지 변경사항
//1) 아이템 뒤 흰색 배경 삭제(image 10~12 & item) 2) sketch.js에서의 Chess Map -> Chess Map Basic (목숨을 하트로 표시한 새 이미지)

class UI {
  /*}
  // player1, player2는 모두 player class를 상속받은 객체여야 합니다!
  constructor(args) {
    this.player1 = args.player1;
    this.player2 = args.player2;
    this.canvasWidth = width;
    this.canvasHeight = height;

    this.player1DeadTime = 0;
    this.player2DeadTime = 0;

    this.UIHeight = (this.canvasHeight / 100) * 20;
    this.horizontalGridOffset = (this.canvasWidth / 100) * 11;
    this.verticalGridOffset = (this.canvasHeight / 100) * 3;
    this.playerLifeUIOffset = (this.canvasWidth / 100) * 14;
    this.playerLifeUIheight = (this.canvasHeight / 100) * 13;

    this.inkRatioUIOffset = (this.canvasWidth / 100) * 20;
    this.inkRatioUIheight = (this.canvasHeight / 100) * 6;
  }

  // 화면 양 옆의 여백

  // TODO 임시로 설정.

  static playerRespawnComment = `부활까지 남은 시간:`;

  calculateRespawnLeftTime(deadTime) {
    return Math.floor(
      Player.respawnTime / 1000 + 1 - (millis() - deadTime) / 1000
    );
  }

  drawTitleScreen() {
    textSize(30);
    text("press any key to start", 10, 30);
  }

  drawSelectCharacterScreen() {}

  drawTutorialScreen() {}
*/
  drawMainGameScreen(inkAreaRatio) {
    //   textSize(15);
    //   text("플레이어1 이동: wasd 회전 qe 잉크총 발사 r", 10, 20);
    //   text("플레이어2 이동: 방향키 회전 < > 바닥 청소 /", 10, 40);

    //   push();
    //   textSize(20);
    //   text(
    //     `Attacker: ${inkAreaRatio.toFixed(0)}%`,
    //     this.inkRatioUIOffset,
    //     this.inkRatioUIheight
    //   );

    //   text(
    //     `Defender:${100 - inkAreaRatio.toFixed(0)}%`,
    //     this.canvasWidth - this.inkRatioUIOffset,
    //     this.inkRatioUIheight
    //   );

    //    pop();

    // attacker, defender의 체력 UI 표시 (몇개 남았는지)
    // Change circles to hearts
    for (let i = 5; i > this.player1.life && i > 0; i--) {
      push();
      noStroke();
      fill(0, 0, 0);
      rect(
        (i * this.canvasWidth) / 26 + this.canvasWidth / 11.4,
        this.playerLifeUIheight * 0.98,
        this.canvasWidth * 0.032,
        this.playerLifeUIheight * 0.42
      );
      pop();
    }

    for (let i = 5; i > this.player2.life && i > 0; i--) {
      push();
      fill(0, 0, 0);
      noStroke();
      rect(
        this.canvasWidth - (i * this.canvasWidth) / 25 - this.canvasWidth / 9.4,
        this.playerLifeUIheight * 0.98,
        this.canvasWidth * 0.037,
        this.playerLifeUIheight * 0.42
      );
      pop();
    }

    /*
    // attacker 죽었을때 부활까지 남은 시간 표시
    if (this.player1.isDead) {

      if (this.player1DeadTime === 0) {
        this.player1DeadTime = millis();
      }

    
    
      push();
      textSize(25);
      textAlign(LEFT);
      fill(255);
     
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player1DeadTime),
        this.playerLifeUIOffset,
        this.playerLifeUIheight
      );
      pop();
    } else {
      // 죽은 시간 초기화해줌
      this.player1DeadTime = 0;
    }



    // defender 죽었을때 부활까지 남은 시간 표시
    if (this.player2.isDead) {
      if (this.player2DeadTime === 0) {
        this.player2DeadTime = millis();
      }

      push();
      textSize(25);
      fill(255);

      textAlign(RIGHT);
      text(
        UI.playerRespawnComment +
          this.calculateRespawnLeftTime(this.player2DeadTime),
        width - this.playerLifeUIOffset,
        this.playerLifeUIheight
      );
      pop();
    } else {
      this.player2DeadTime = 0;
    }

*/
    //점수계산
    for (let i = 0; i < 600; i = i + 50) {
      push();
      fill(0);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.018,
        (1.2 * this.playerLifeUIheight) / 5
      );
      fill(30, 130, 130);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.015,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    for (let i = 0; i < 600; i = i + 50) {
      push();
      fill(0);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.0199,
        (1.2 * this.playerLifeUIheight) / 5
      );
      fill(90, 50, 120);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.016,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    //offense advantage
    for (
      let i = 550;
      i >= (600 * (2 * inkAreaRatio.toFixed(0))) / 100;
      i = i - 50
    ) {
      push();
      fill(90, 50, 120);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 8.6 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.015,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    for (
      let i = 0;
      i <= ((600 * inkAreaRatio.toFixed(0)) / 100 - 300) * 2;
      i = i + 50
    ) {
      push();
      fill(30, 130, 130);
      rectMode(CENTER);
      rect(
        this.canvasWidth / 1.624 + i * (this.canvasWidth / 2211),
        (2.3 * this.playerLifeUIheight) / 5,
        this.canvasWidth * 0.016,
        (1.1 * this.playerLifeUIheight) / 5
      );
      pop();
    }

    //2*inkAreaRatio는 점수계산 시스템 수정 후 반영 예정 - 잘 작동되는지 확인하기 위해 두 배함
  }

  drawGameResultScreen() {}
}
