import * as ECS from '../../libs/pixi-ecs';
import { PlayerConstants } from '../constants/player-constants';


export class Player extends ECS.Component {

  score: number;
  health: number;

  constructor(
    public playerID: number,
    private playerConstants: PlayerConstants ) {
      super();
  }

  onInit() {
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
    this.owner.position.x++;
  }

  moveRight() {
    this.owner.position.y--;
  }

  jump () {

  }

}