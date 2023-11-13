class Camera {
  constructor(player) {
    this.player = player;
  }
  cameraWalk() {
    translate(-cameraX, -cameraY);
  }
}
