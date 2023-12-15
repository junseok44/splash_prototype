class Player {
  constructor({
    x,
    y,
    width,
    height,
    bullets,
    color,
    l,
    r,
    u,
    d,
    rotate_l,
    rotate_r,
    attack,
    itemCode,
    constraints,
  }) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.width = width;
    this.height = height;

    this.constraints = constraints;
    // constraints = { left, top, bottom, right}의 상대좌표들.

    this.itemCode = itemCode;
    this.lcode = l;
    this.rcode = r;
    this.ucode = u;
    this.dcode = d;
    this.rotate_lcode = rotate_l;
    this.rotate_rcode = rotate_r;
    this.attackcode = attack;
    this.deg = 0;

    this.bullets = bullets;
    this.color = color;
    this.isAttacked = false;
    this.isHit = false;

    this.isReversed = false;

    this.life = Player.playerLife;
    this.isDead = false;

    this.collisionSide = null;
    this.itemType = null;
    this.moveSpeed = 5;
  }

  static coolTimeAfterHit = 500;
  static respawnTime = 5000;
  static playerLife = 5;

  static rotatePoint(x, y, angle, center_x, center_y) {
    const sin_a = Math.sin(angle);
    const cos_a = Math.cos(angle);
    x -= center_x;
    y -= center_y;
    const new_x = x * cos_a - y * sin_a + center_x;
    const new_y = x * sin_a + y * cos_a + center_y;
    return { x: new_x, y: new_y };
  }

  setInitialPosition({ x, y }) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
  }

  initialize() {
    this.life = Player.playerLife;
    this.isDead = false;
    this.isReversed = false;
    this.moveSpeed = 5;
    this.isHit = false;
    this.deg = 0;
    this.collisionSide = null;
    this.itemType = null;
    this.x = this.initialX;
    this.y = this.initialY;
  }

  // 추상메서드. 자식 클래스에서 반드시 구현해야 함.
  attack() {
    throw Error("this method must be implemented");
  }

  reverse() {
    this.reversed = !this.reversed;
  }

  // 플레이어는 사각형이고 충돌체는 원이라고 가정하고 충돌 판정을 하는 함수.
  isCollidedWithCircle(circle) {
    let square_rotation = this.deg;
    let square_x = this.x;
    let square_y = this.y;
    let square_side = this.width;
    let circle_x = circle.coordX;
    let circle_y = circle.coordY;
    let circle_radius = circle.width / 2;

    // Find the center of the square
    const square_center_x = square_x;
    const square_center_y = square_y;

    // Rotate the circle center point by the negative square rotation
    const { x: rotated_circle_x, y: rotated_circle_y } = Player.rotatePoint(
      circle_x,
      circle_y,
      -square_rotation,
      square_center_x,
      square_center_y
    );

    // Find the closest point on the square to the rotated circle center
    const closest_x = Math.max(
      Math.abs(rotated_circle_x - square_center_x) - square_side / 2,
      0
    );
    const closest_y = Math.max(
      Math.abs(rotated_circle_y - square_center_y) - square_side / 2,
      0
    );

    // Calculate the distance between the closest point on the square and the rotated circle center
    const distance_to_closest = Math.sqrt(closest_x ** 2 + closest_y ** 2);

    // Check if the distance to the closest point on the square is less than the circle's radius
    return distance_to_closest <= circle_radius;
  }

  // 두 플레이어 모두 원이라고 가정하고 충돌 판정을 하는 함수.
  isCollidedWithPlayer(otherCircle) {
    this.radius = this.width / 2;

    const dx = otherCircle.x - this.x;
    const dy = otherCircle.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + otherCircle.radius) {
      const angle = Math.atan2(dy, dx);

      if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
        this.collisionSide = "right";
      } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
        this.collisionSide = "bottom";
      } else if (angle >= (Math.PI / 4) * 3 || angle <= (-Math.PI / 4) * 3) {
        this.collisionSide = "left";
      } else if (angle > (-3 * Math.PI) / 4 && angle <= -Math.PI / 4) {
        this.collisionSide = "top";
      }
    } else {
      this.collisionSide = null;
    }
  }

  rotate(deltaDeg) {
    this.deg += deltaDeg;
  }

  move(constraints) {
    if (this.isReversed) {
      if (keyIsDown(this.lcode)) this.moveTo("right", constraints);
      if (keyIsDown(this.rcode)) this.moveTo("left", constraints);
      if (keyIsDown(this.ucode)) this.moveTo("down", constraints);
      if (keyIsDown(this.dcode)) this.moveTo("up", constraints);

      return;
    }

    if (keyIsDown(this.lcode)) this.moveTo("left", constraints);
    if (keyIsDown(this.rcode)) this.moveTo("right", constraints);
    if (keyIsDown(this.ucode)) this.moveTo("up", constraints);
    if (keyIsDown(this.dcode)) this.moveTo("down", constraints);

    if (keyIsDown(this.rotate_lcode)) {
      this.rotate(-0.1);
    }
    if (keyIsDown(this.rotate_rcode)) {
      this.rotate(0.1);
    }
  }

  changeMoveSpeed(speed) {
    this.moveSpeed = speed;
  }

  moveTo(direction, constraints) {
    let diagonal = (this.width / 2) * Math.sqrt(2);

    switch (direction) {
      case "left":
        if (
          this.x <= diagonal + constraints.left ||
          this.collisionSide == "left"
        ) {
          console.log("lets return");
          return;
        }
        this.x -= this.moveSpeed;
        break;
      case "right":
        if (
          this.x >= width - diagonal - constraints.right ||
          this.collisionSide == "right"
        )
          return;
        this.x += this.moveSpeed;
        break;
      case "up":
        if (this.y <= diagonal + constraints.top || this.collisionSide == "top")
          return;
        this.y -= this.moveSpeed;
        break;
      case "down":
        if (
          this.y >= height - constraints.bottom ||
          this.collisionSide == "bottom"
        )
          return;
        this.y += this.moveSpeed;
        break;
      default:
        break;
    }
  }

  // 맞앗을때
  hit() {
    if (!this.isHit) {
      this.life -= 1;
      this.isHit = true;
      setTimeout(() => {
        this.isHit = false;
      }, Player.coolTimeAfterHit);
    }
  }

  // 죽었을때
  dead() {
    this.isDead = true;
    setTimeout(() => {
      this.respawn();
    }, Player.respawnTime);
  }

  // 부활
  respawn() {
    this.isDead = false;
    this.life = Player.playerLife;
  }

  drawSpiral() {
    let angle = 0;
    let radius = 0;
    let maxRadius = min(this.width, this.height) / 2;
    let angleOffset = 0.2;
    let radiusOffset = 0.15;

    stroke(128, 0, 128);
    strokeWeight(2);

    let prevX = 0;
    let prevY = 0;

    while (radius < maxRadius) {
      let newX = cos(angle) * radius;
      let newY = sin(angle) * radius;
      line(prevX, prevY, newX, newY);

      prevX = newX;
      prevY = newY;

      angle += angleOffset;
      radius += radiusOffset;
    }
  }

  drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2;
    beginShape();
    for (let a = PI / 2; a < TWO_PI + PI / 2; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  setItemType(itemType) {
    this.itemType = itemType;
  }

  display() {
    push();

    if (this.isDead) {
      //무덤
      push();
      fill(0);
      translate(this.x, this.y);

      fill(240, 240, 115);
      ellipse(0, -this.width * 1.5, this.height * 8, this.width * 0.5);
      ellipse(0, -this.width * 1.2, this.height * 7, this.width * 0.5);
      ellipse(0, -this.width * 0.9, this.height * 6, this.width * 0.5);
      ellipse(0, -this.width * 0.65, this.height * 5, this.width * 0.5);

      fill(185, 245, 245);
      ellipse(0, -this.width, 200, 200);
      fill(240, 240, 115);
      ellipse(0, -this.width * 3, this.width * 4, this.height * 0.9);
      fill(255);
      ellipse(0, -this.width * 3, this.width * 3.3, this.height * 0.6);

      fill(220);
      rectMode(CENTER);
      rect(0, -this.width * 0.3, this.width * 2, this.width * 1.5);

      ellipse(0, -this.width, this.width * 2, this.width * 1.5);

      push();
      noStroke();
      rect(0, -this.width * 0.3, this.width * 1.98, this.width * 1.5);
      pop();

      fill(0);
      rect(0, 0, this.width, this.height);

      fill(79, 45, 4);
      ellipse(0, this.width * 0.54, this.height * 2.5, this.width * 0.3);

      for (let i = 0; i <= 80; i += 5) {
        fill(0, 125, 0);
        rectMode(CORNERS);
        rect(
          i - this.width * 0.84,
          15 * this.width * 0.02,
          i + 5 - this.width * 0.84,
          this.width * 0.5
        );
      }

      fill(0, 0, 0, random(100, 255));
      textSize(30);
      text("R.I.P.", 0, -this.width * 1.05);

      pop();

      return;
    }

    fill(255);

    translate(this.x, this.y);
    rotate(this.deg);

    if (this.isHit) {
      push();
      fill(random(150, 255), 0, 0, random(150, 255));
      rect(
        constrain(random(-10, 10), 0, 10),
        constrain(random(-10, 10), 0, 10),
        this.width,
        this.height
      ); // when hit
      pop();
    } else {
      rect(0, 0, this.width, this.height);
      ellipse(0, -20, 10, 10);
    }

    fill(0);
    pop();

    //1. 가속디자인: 공격이랑 수비 모두 똑같은 디자인으로 적용이 되어서 player에 넣었습니다. 아이템 시스템에서 옮기면 될 것 같아요!

    switch (this.itemType) {
      case ItemManager.itemTypes.SPEED_UP:
        push();
        stroke(0, 0, 255);
        strokeWeight(5);
        fill(255, 255, 0);
        translate(this.x, this.y);
        rotate(this.deg);
        rect(0, 0, this.width, this.height);
        noStroke();
        fill(255, 0, 0);
        textStyle(BOLD);
        textSize(50);
        text("S", this.width - 65, this.height - 30);
        pop();
        break;
      case ItemManager.itemTypes.RANGE_UP:
        push();
        fill(0, 8, 117);

        translate(this.x, this.y);
        rotate(this.deg);

        rect(0, 0, this.width, this.height);

        fill(255, 255, 0);
        noStroke();
        this.drawStar(this.width - 50, this.height - 47, this.starSize, 30, 15);

        fill(255);
        stroke(0);
        ellipse(0, -20, 10, 10);
        pop();
        break;
      case ItemManager.itemTypes.REVERSE:
        push();
        fill(190, 254, 243);
        translate(this.x, this.y);
        rotate(this.deg);

        rect(0, 0, this.width, this.height);

        this.drawSpiral();

        fill(255);
        stroke(0);
        ellipse(0, -20, 10, 10);
        pop();

        break;
    }

    ///////////////////////////////////////

    //2. 대마왕 디자인

    //////////////////////////////////

    // 3. 범위 아이템 디자인
  }
}

// 회전을 고려하지 않은 함수 예제.
// checkCollision2(circleX, circleY, radius) {
//   let squareX = this.x;
//   let squareY = this.y;
//   let squareSide = this.width;

//   let closestX = Math.max(
//     squareX - squareSide / 2,
//     Math.min(circleX, squareX + squareSide / 2)
//   );

//   let closestY = Math.max(
//     squareY - squareSide / 2,
//     Math.min(circleY, squareY + squareSide / 2)
//   );

//   let dist = Player.distance(circleX, circleY, closestX, closestY);

//   console.log(circleX, circleY);

//   if (dist <= radius / 2) {
//     console.log("hit");
//     return true;
//   } else {
//     return false;
//   }
// }
