import * as ECS from '../../libs/pixi-ecs';
import { WINDOW_WIDTH } from '../constants/game-constants';
import { PlayerConstants } from '../constants/player-constants';

export class Player extends ECS.Component {

  score: number;
  health: number;
  move: number = 4;
  offet: number = 25;
  facingLeft: boolean;
  previousDirectionLeft: boolean;

  constructor(
    public playerID: number,
    private playerConstants: PlayerConstants ) {
      super();
    }

  onInit() {
    this.owner.position.x = this.playerConstants.start_x;
    this.owner.position.y = this.playerConstants.start_y;
    this.facingLeft = this.playerConstants.facingLeft;
    this.previousDirectionLeft = this.playerConstants.facingLeft;
    if(!this.facingLeft) this.owner.scale.x *= -1;
    this.score = 0;
    this.health = 0;
  }

  onUpdate(delta: number, absolute: number) {
    const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    if(keyInputCmp.isKeyPressed(this.playerConstants.left_code)) {
      this.moveLeft();
    }
    if(keyInputCmp.isKeyPressed(this.playerConstants.right_code)) {
      this.moveRight();
    }
    if(keyInputCmp.isKeyPressed(this.playerConstants.jump_code)) {
      this.jump();
    }
  }

  moveLeft() {
    if(this.owner.position.x > this.offet) {
      if(!this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = true;
      this.owner.position.x -= this.move;
    }
  }

  moveRight() {
    if(this.owner.position.x < WINDOW_WIDTH - this.offet) {

      if(this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = false;
      this.owner.position.x += this.move;
    }
  }

  jump () {

  }

}